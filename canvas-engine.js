(() => {
  const ITEM_SELECTOR = "[data-dynamic-tile],[data-standard-tile]";
  const INTERACTIVE_SELECTOR = "a,button,input,textarea,select,[contenteditable='true']";
  const MIN_WIDTH = 180;
  const MIN_HEIGHT = 96;
  const GRID_SIZE = 12;
  const RESPONSE = 22;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const round = (value, precision = 2) => {
    const factor = 10 ** precision;
    return Math.round(value * factor) / factor;
  };

  class CanvasMotionEngine {
    constructor(root, options = {}) {
      if (!(root instanceof HTMLElement)) throw new TypeError("Canvas root must be an HTMLElement.");
      this.root = root;
      this.prefix = options.prefix === "standard" ? "standard" : "dynamic";
      this.selector = options.selector || ITEM_SELECTOR;
      this.grid = Math.max(1, Number(options.grid) || GRID_SIZE);
      this.response = Math.max(1, Number(options.response) || RESPONSE);
      this.onCommit = typeof options.onCommit === "function" ? options.onCommit : () => {};
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.items = new Map();
      this.active = null;
      this.frame = 0;
      this.lastFrameTime = 0;
      this.enabled = false;

      this.onPointerDown = this.onPointerDown.bind(this);
      this.onPointerMove = this.onPointerMove.bind(this);
      this.onPointerEnd = this.onPointerEnd.bind(this);
      this.onPointerCancel = this.onPointerCancel.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
      this.tick = this.tick.bind(this);

      root.addEventListener("pointerdown", this.onPointerDown, true);
      root.addEventListener("pointermove", this.onPointerMove, true);
      root.addEventListener("pointerup", this.onPointerEnd, true);
      root.addEventListener("pointercancel", this.onPointerCancel, true);
      root.addEventListener("keydown", this.onKeyDown);

      this.resizeObserver = new ResizeObserver(() => this.reconcileBounds());
      this.resizeObserver.observe(root);
      this.refresh();
    }

    refresh() {
      this.root.querySelectorAll(this.selector).forEach((element) => {
        if (!(element instanceof HTMLElement) || this.items.has(element)) return;
        this.register(element);
      });
    }

    register(element) {
      const styles = getComputedStyle(element);
      const frame = this.root.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      const id = element.dataset.dynamicTile || element.dataset.standardTile || `tile-${this.items.size + 1}`;
      const percentX = Number.parseFloat(styles.getPropertyValue(`--${this.prefix}-x`));
      const percentY = Number.parseFloat(styles.getPropertyValue(`--${this.prefix}-y`));
      const centerX = Number.isFinite(percentX) ? percentX : 50;
      const centerY = Number.isFinite(percentY) ? percentY : 50;
      const width = rect.width;
      const height = rect.height;
      const x = clamp((frame.width * centerX) / 100 - width / 2, 0, Math.max(0, frame.width - width));
      const y = clamp((frame.height * centerY) / 100 - height / 2, 0, Math.max(0, frame.height - height));
      const state = {
        id,
        element,
        x,
        y,
        width,
        height,
        targetX: x,
        targetY: y,
        targetWidth: width,
        targetHeight: height,
        settling: false
      };
      if (!element.hasAttribute("tabindex")) element.tabIndex = 0;
      this.items.set(element, state);
      this.renderState(state);
      this.resizeObserver.observe(element);
    }

    setEnabled(enabled) {
      const next = Boolean(enabled);
      if (this.enabled === next) return;
      this.enabled = next;
      this.root.dataset.layout = next ? "canvas" : "stack";
      this.root.classList.toggle("native-canvas-active", next);
      if (!next) {
        this.cancelActive();
        this.items.forEach((state) => {
          state.element.classList.remove("is-settling");
          state.element.style.removeProperty("transform");
        });
        return;
      }
      this.rehydrateFromProperties();
    }

    rehydrateFromProperties() {
      const frame = this.root.getBoundingClientRect();
      this.items.forEach((state) => {
        const styles = getComputedStyle(state.element);
        const percentX = Number.parseFloat(styles.getPropertyValue(`--${this.prefix}-x`));
        const percentY = Number.parseFloat(styles.getPropertyValue(`--${this.prefix}-y`));
        state.width = state.targetWidth = state.element.getBoundingClientRect().width;
        state.height = state.targetHeight = state.element.getBoundingClientRect().height;
        const nextX = (frame.width * (Number.isFinite(percentX) ? percentX : 50)) / 100 - state.width / 2;
        const nextY = (frame.height * (Number.isFinite(percentY) ? percentY : 50)) / 100 - state.height / 2;
        state.x = state.targetX = this.clampX(state, nextX);
        state.y = state.targetY = this.clampY(state, nextY);
        this.renderState(state);
      });
    }

    onPointerDown(event) {
      const origin = event.target instanceof Element ? event.target : null;
      const element = origin?.closest(this.selector);
      if (!(element instanceof HTMLElement) || !this.root.contains(element)) return;
      if (!this.enabled) {
        if (!origin.closest(INTERACTIVE_SELECTOR)) event.stopPropagation();
        return;
      }
      if (!event.isPrimary || event.button !== 0) return;
      const handle = origin.closest("[data-resize-handle]");
      if (!handle && origin.closest(INTERACTIVE_SELECTOR)) return;
      const state = this.items.get(element);
      if (!state) return;
      const rootRect = this.root.getBoundingClientRect();
      const mode = handle ? "resize" : "drag";
      this.active = {
        mode,
        direction: handle?.dataset.resizeHandle || "",
        pointerId: event.pointerId,
        state,
        rootRect,
        pointerX: event.clientX,
        pointerY: event.clientY,
        startX: state.targetX,
        startY: state.targetY,
        startWidth: state.targetWidth,
        startHeight: state.targetHeight,
        grabX: event.clientX - rootRect.left - state.x,
        grabY: event.clientY - rootRect.top - state.y
      };
      element.classList.add(mode === "resize" ? "is-resizing" : "is-dragging");
      try { element.setPointerCapture?.(event.pointerId); } catch {}
      event.preventDefault();
      event.stopPropagation();
    }

    onPointerMove(event) {
      if (!this.active || event.pointerId !== this.active.pointerId) return;
      const samples = event.getCoalescedEvents?.() || [event];
      const sample = samples[samples.length - 1] || event;
      if (this.active.mode === "resize") this.updateResize(sample);
      else this.updateDrag(sample);
      this.active.state.settling = true;
      this.requestFrame();
      event.preventDefault();
      event.stopPropagation();
    }

    updateDrag(event) {
      const { state, rootRect, grabX, grabY } = this.active;
      const x = this.snap(event.clientX - rootRect.left - grabX);
      const y = this.snap(event.clientY - rootRect.top - grabY);
      state.targetX = this.clampX(state, x);
      state.targetY = this.clampY(state, y);
    }

    updateResize(event) {
      const active = this.active;
      const state = active.state;
      const direction = active.direction;
      const deltaX = event.clientX - active.pointerX;
      const deltaY = event.clientY - active.pointerY;
      const west = direction.includes("w");
      const east = direction.includes("e");
      const north = direction.includes("n");
      const south = direction.includes("s");
      let width = active.startWidth;
      let height = active.startHeight;
      let x = active.startX;
      let y = active.startY;

      if (east || west) width = this.snap(active.startWidth + deltaX * (west ? -1 : 1));
      if (south || north) height = this.snap(active.startHeight + deltaY * (north ? -1 : 1));
      width = clamp(width, Math.min(MIN_WIDTH, active.rootRect.width), active.rootRect.width);
      height = clamp(height, Math.min(MIN_HEIGHT, active.rootRect.height), active.rootRect.height);
      if (west) x = active.startX + active.startWidth - width;
      if (north) y = active.startY + active.startHeight - height;
      x = clamp(x, 0, Math.max(0, active.rootRect.width - width));
      y = clamp(y, 0, Math.max(0, active.rootRect.height - height));
      width = Math.min(width, active.rootRect.width - x);
      height = Math.min(height, active.rootRect.height - y);
      state.targetX = x;
      state.targetY = y;
      state.targetWidth = width;
      state.targetHeight = height;
    }

    onPointerEnd(event) {
      if (!this.active || event.pointerId !== this.active.pointerId) return;
      const { state, mode } = this.active;
      state.element.classList.remove(mode === "resize" ? "is-resizing" : "is-dragging");
      state.element.classList.add("is-settling");
      try {
        if (state.element.hasPointerCapture?.(event.pointerId)) state.element.releasePointerCapture(event.pointerId);
      } catch {}
      this.active = null;
      this.commit();
      this.requestFrame();
      event.stopPropagation();
    }

    onPointerCancel(event) {
      if (!this.active || event.pointerId !== this.active.pointerId) return;
      const active = this.active;
      active.state.targetX = active.startX;
      active.state.targetY = active.startY;
      active.state.targetWidth = active.startWidth;
      active.state.targetHeight = active.startHeight;
      active.state.settling = true;
      this.cancelActive();
      this.requestFrame();
      event.stopPropagation();
    }

    onKeyDown(event) {
      if (!this.enabled || !(event.target instanceof Element)) return;
      const element = event.target.closest(this.selector);
      if (!(element instanceof HTMLElement) || event.target !== element) return;
      const state = this.items.get(element);
      const direction = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1]
      }[event.key];
      if (!state || !direction) return;
      const step = event.shiftKey ? 1 : this.grid;
      state.targetX = this.clampX(state, state.targetX + direction[0] * step);
      state.targetY = this.clampY(state, state.targetY + direction[1] * step);
      state.settling = true;
      element.classList.add("is-settling");
      this.commit();
      this.requestFrame();
      event.preventDefault();
    }

    tick(time) {
      this.frame = 0;
      const delta = Math.min(32, this.lastFrameTime ? time - this.lastFrameTime : 16.67);
      const alpha = this.reducedMotion.matches ? 1 : 1 - Math.exp((-this.response * delta) / 1000);
      this.lastFrameTime = time;
      let moving = false;
      this.items.forEach((state) => {
        const values = [
          ["x", "targetX"],
          ["y", "targetY"],
          ["width", "targetWidth"],
          ["height", "targetHeight"]
        ];
        values.forEach(([current, target]) => {
          const difference = state[target] - state[current];
          if (Math.abs(difference) < .08) state[current] = state[target];
          else {
            state[current] += difference * alpha;
            moving = true;
          }
        });
        if (!moving && state.settling) {
          state.settling = false;
          state.element.classList.remove("is-settling");
        }
        this.renderState(state);
      });
      if (moving) this.requestFrame();
    }

    renderState(state) {
      const width = `${round(state.width)}px`;
      const height = `${round(state.height)}px`;
      const transform = `translate3d(${round(state.x)}px,${round(state.y)}px,0)`;
      if (state.renderedWidth !== width) {
        state.element.style.width = width;
        state.renderedWidth = width;
      }
      if (state.renderedHeight !== height) {
        state.element.style.height = height;
        state.renderedHeight = height;
      }
      if (state.renderedTransform !== transform) {
        state.element.style.transform = transform;
        state.renderedTransform = transform;
      }
    }

    commit() {
      const frameWidth = Math.max(1, this.root.clientWidth);
      const frameHeight = Math.max(1, this.root.clientHeight);
      const positions = {};
      this.items.forEach((state) => {
        const position = {
          x: round(((state.targetX + state.targetWidth / 2) / frameWidth) * 100, 1),
          y: round(((state.targetY + state.targetHeight / 2) / frameHeight) * 100, 1),
          width: round(state.targetWidth),
          height: round(state.targetHeight),
          free: true
        };
        positions[state.id] = position;
        state.element.style.setProperty(`--${this.prefix}-x`, String(position.x));
        state.element.style.setProperty(`--${this.prefix}-y`, String(position.y));
        state.element.style.setProperty(`--${this.prefix}-width`, `${position.width}px`);
        state.element.style.setProperty(`--${this.prefix}-height`, `${position.height}px`);
      });
      this.root.dispatchEvent(new CustomEvent("sqezen:canvascommit", { bubbles: true, detail: { prefix: this.prefix, positions } }));
      this.onCommit(positions);
    }

    reconcileBounds() {
      if (!this.enabled || this.active) return;
      this.items.forEach((state) => {
        state.targetX = this.clampX(state, state.targetX);
        state.targetY = this.clampY(state, state.targetY);
        state.settling = true;
      });
      this.requestFrame();
    }

    clampX(state, value) {
      return clamp(value, 0, Math.max(0, this.root.clientWidth - state.targetWidth));
    }

    clampY(state, value) {
      return clamp(value, 0, Math.max(0, this.root.clientHeight - state.targetHeight));
    }

    snap(value) {
      return Math.round(value / this.grid) * this.grid;
    }

    cancelActive() {
      if (!this.active) return;
      const { state, pointerId } = this.active;
      state.element.classList.remove("is-dragging", "is-resizing");
      try {
        if (state.element.hasPointerCapture?.(pointerId)) state.element.releasePointerCapture(pointerId);
      } catch {}
      this.active = null;
    }

    requestFrame() {
      if (!this.frame) this.frame = requestAnimationFrame(this.tick);
    }

    destroy() {
      cancelAnimationFrame(this.frame);
      this.cancelActive();
      this.resizeObserver.disconnect();
      this.root.removeEventListener("pointerdown", this.onPointerDown, true);
      this.root.removeEventListener("pointermove", this.onPointerMove, true);
      this.root.removeEventListener("pointerup", this.onPointerEnd, true);
      this.root.removeEventListener("pointercancel", this.onPointerCancel, true);
      this.root.removeEventListener("keydown", this.onKeyDown);
      this.items.clear();
    }
  }

  const instances = new WeakMap();
  const media = window.matchMedia("(min-width: 1024px)");

  const syncInstance = (root, engine) => {
    root.dataset.layout = media.matches ? "canvas" : "stack";
    engine.setEnabled(media.matches);
  };

  const mount = (scope = document) => {
    const roots = [
      ...scope.querySelectorAll?.(".dynamic-embed-page.is-embed-editor .dynamic-embed-main") || [],
      ...scope.querySelectorAll?.(".standard-embed-editor-page.is-embed-editor .public-main") || []
    ];
    roots.forEach((root) => {
      if (instances.has(root)) {
        instances.get(root).refresh();
        syncInstance(root, instances.get(root));
        return;
      }
      const prefix = root.closest(".standard-embed-editor-page") ? "standard" : "dynamic";
      const selector = prefix === "standard" ? "[data-standard-tile]" : "[data-dynamic-tile]";
      const engine = new CanvasMotionEngine(root, { prefix, selector });
      instances.set(root, engine);
      syncInstance(root, engine);
    });
  };

  const syncAll = () => {
    document.querySelectorAll(".dynamic-embed-main.native-canvas-active,.standard-embed-editor-page .public-main").forEach((root) => {
      const engine = instances.get(root);
      if (engine) syncInstance(root, engine);
    });
    mount(document);
  };

  media.addEventListener?.("change", syncAll);
  window.SqezenCanvas = { CanvasMotionEngine, mount, syncAll };
})();
