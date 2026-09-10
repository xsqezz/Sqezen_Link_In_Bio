(() => {
  const CURSOR_EFFECTS = new Set(["none", "glow", "ring", "neon", "comet", "trail", "sparkle", "orbit", "bubbles", "fire", "snow", "hearts", "pixel", "crosshair", "spotlight", "ripple", "rainbow", "magnetic", "dust", "glitter", "confetti", "leaves", "petals", "shards", "orbs", "smoke", "magic", "coins", "lightning", "stars"]);
  const FIXED_EFFECT_COLORS = Object.freeze({
    fire: "#ff8a4c",
    snow: "#ffffff",
    hearts: "#ff4d6d",
    leaves: "#8dff9b",
    coins: "#ffc34d"
  });
  const CONFETTI_COLORS = Object.freeze(["#57d9ff", "#ff7096", "#ffe574", "#8dff9b", "#a78bfa"]);
  const GLYPHS = Object.freeze({ hearts: "♥", glitter: "✧", magic: "✧", lightning: "ϟ", stars: "✦" });
  const LIFT_EFFECTS = new Set(["fire", "hearts", "snow", "leaves", "petals", "smoke", "magic", "stars"]);
  const MOVEMENT = Object.freeze({
    glow: [42, 6, 2, 24, 720], ring: [78, 10, 1, 30, 700], neon: [34, 5, 2, 40, 600],
    comet: [28, 5, 2, 48, 560], trail: [22, 4, 2, 25, 680], sparkle: [52, 9, 2, 38, 680],
    orbit: [68, 12, 2, 32, 760], bubbles: [48, 7, 1, 48, 980], fire: [27, 4, 2, 54, 720],
    snow: [66, 10, 1, 46, 1120], hearts: [75, 12, 1, 48, 980], pixel: [20, 4, 2, 30, 620],
    crosshair: [72, 12, 1, 36, 760], spotlight: [42, 7, 2, 34, 820], ripple: [120, 18, 1, 18, 620],
    rainbow: [48, 8, 2, 44, 700], magnetic: [54, 8, 2, 34, 680], dust: [24, 4, 2, 28, 760],
    glitter: [36, 6, 2, 36, 690], confetti: [42, 7, 2, 56, 920], leaves: [70, 10, 1, 52, 1080],
    petals: [62, 9, 1, 46, 1040], shards: [30, 5, 2, 52, 650], orbs: [55, 8, 1, 42, 900],
    smoke: [70, 10, 1, 32, 1260], magic: [72, 11, 1, 48, 1000], coins: [58, 8, 1, 48, 940],
    lightning: [32, 5, 2, 44, 640], stars: [62, 10, 1, 48, 900]
  });
  const BURSTS = Object.freeze({ glow: 5, ring: 3, neon: 7, comet: 5, trail: 6, sparkle: 8, orbit: 5, bubbles: 6, fire: 8, snow: 7, hearts: 6, pixel: 8, crosshair: 4, spotlight: 5, ripple: 1, rainbow: 9, magnetic: 6, dust: 8, glitter: 10, confetti: 10, leaves: 6, petals: 7, shards: 8, orbs: 6, smoke: 4, magic: 7, coins: 6, lightning: 7, stars: 8 });

  const cleanCursorUrl = (value) => String(value || "").replace(/["\\\n\r]/g, "").trim();
  const cleanColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || "").trim()) ? String(value).trim().toLowerCase() : "";
  const cleanCursorEffect = (value) => CURSOR_EFFECTS.has(String(value || "").trim()) ? String(value).trim() : "none";
  const colorRgb = (value) => {
    const color = cleanColor(value) || "#626262";
    return [0, 2, 4].map((offset) => Number.parseInt(color.slice(offset + 1, offset + 3), 16)).join(",");
  };
  const supportsFinePointer = () => window.matchMedia?.("(hover: hover) and (pointer: fine)").matches !== false;

  class ParticleStudio {
    constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext("2d", { alpha: true, desynchronized: true });
      this.particles = [];
      this.pool = [];
      this.frame = 0;
      this.lastFrame = 0;
      this.lastEmission = 0;
      this.lastX = -999;
      this.lastY = -999;
      this.frameSamples = [];
      this.effect = "none";
      this.color = "#626262";
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const memory = Number(navigator.deviceMemory || 8);
      const cores = Number(navigator.hardwareConcurrency || 8);
      const saveData = Boolean(navigator.connection?.saveData);
      this.quality = saveData || memory <= 4 || cores <= 4 ? "balanced" : "high";
      this.maxParticles = this.quality === "high" ? 120 : 64;
      this.frameInterval = this.quality === "high" ? 0 : 1000 / 60;
      this.enabled = !this.reducedMotion.matches;
      this.resize = this.resize.bind(this);
      this.tick = this.tick.bind(this);
      window.addEventListener("resize", this.resize, { passive: true });
      this.reducedMotion.addEventListener?.("change", () => {
        this.enabled = !this.reducedMotion.matches;
        if (!this.enabled) this.clear();
      });
      this.resize();
    }

    resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      this.canvas.width = Math.round(width * ratio);
      this.canvas.height = Math.round(height * ratio);
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    configure(effect, color) {
      const changed = this.effect !== effect;
      this.effect = effect;
      this.color = FIXED_EFFECT_COLORS[effect] || cleanColor(color) || "#626262";
      if (changed) this.clear();
    }

    movement(x, y) {
      if (!this.enabled || this.effect === "none") return;
      const config = MOVEMENT[this.effect];
      if (!config) return;
      const [interval, distance, count, spread, duration] = config;
      const now = performance.now();
      if (now - this.lastEmission < interval || Math.hypot(x - this.lastX, y - this.lastY) < distance) return;
      this.lastEmission = now;
      this.lastX = x;
      this.lastY = y;
      for (let index = 0; index < count; index += 1) this.spawn(x, y, spread, duration, false);
    }

    burst(x, y) {
      if (!this.enabled || this.effect === "none") return;
      const count = BURSTS[this.effect] || 0;
      const spread = this.effect === "ripple" ? 0 : this.effect === "smoke" ? 34 : 72;
      const duration = this.effect === "ripple" ? 680 : this.effect === "smoke" ? 1300 : 900;
      for (let index = 0; index < count; index += 1) this.spawn(x, y, spread, duration, true);
    }

    spawn(x, y, spread, duration, burst) {
      if (this.particles.length >= this.maxParticles) this.release(this.particles.shift());
      const particle = this.pool.pop() || {};
      const angle = Math.random() * Math.PI * 2;
      const distance = (burst ? 12 : 3) + Math.random() * Math.max(0, spread - (burst ? 12 : 3));
      const lift = LIFT_EFFECTS.has(this.effect) ? 12 + Math.random() * 12 : 0;
      particle.effect = this.effect;
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * distance / (duration / 16.67);
      particle.vy = Math.sin(angle) * distance / (duration / 16.67) - lift / (duration / 16.67);
      particle.rotation = Math.random() * Math.PI * 2;
      particle.spin = (Math.random() - .5) * .18;
      particle.life = 0;
      particle.duration = duration;
      particle.size = this.effect === "hearts" ? 21 : this.effect === "smoke" ? 20 : 5 + Math.random() * 7;
      particle.color = this.effect === "confetti" ? CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] : this.color;
      this.particles.push(particle);
      this.requestFrame();
    }

    tick(now) {
      this.frame = 0;
      if (!this.enabled || document.hidden) return this.clear();
      if (this.frameInterval && now - this.lastFrame < this.frameInterval) return this.requestFrame();
      const delta = Math.min(32, this.lastFrame ? now - this.lastFrame : 16.67);
      this.lastFrame = now;
      this.frameSamples.push(delta);
      if (this.frameSamples.length > 45) this.frameSamples.shift();
      this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let index = this.particles.length - 1; index >= 0; index -= 1) {
        const particle = this.particles[index];
        particle.life += delta;
        if (particle.life >= particle.duration) {
          this.release(this.particles.splice(index, 1)[0]);
          continue;
        }
        const progress = particle.life / particle.duration;
        particle.x += particle.vx * (delta / 16.67);
        particle.y += particle.vy * (delta / 16.67);
        particle.rotation += particle.spin * (delta / 16.67);
        this.draw(particle, progress);
      }
      if (this.frameSamples.length === 45) {
        const average = this.frameSamples.reduce((sum, value) => sum + value, 0) / this.frameSamples.length;
        if (average > 20 && this.maxParticles > 48) {
          this.maxParticles = 48;
          this.frameInterval = 1000 / 60;
        }
      }
      if (this.particles.length) this.requestFrame();
    }

    draw(particle, progress) {
      const context = this.context;
      const alpha = Math.max(0, 1 - progress);
      const scale = Math.max(.12, 1 - progress * .72);
      context.save();
      context.globalAlpha = alpha;
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.scale(scale, scale);
      context.fillStyle = particle.color;
      context.strokeStyle = particle.color;
      context.shadowColor = particle.color;
      context.shadowBlur = particle.effect === "smoke" ? 12 : 7;
      const glyph = GLYPHS[particle.effect];
      if (glyph) {
        context.font = `800 ${particle.size}px Manrope, sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(glyph, 0, 0);
      } else if (particle.effect === "snow") {
        context.lineWidth = 1.4;
        for (let index = 0; index < 3; index += 1) {
          context.rotate(Math.PI / 3);
          context.beginPath();
          context.moveTo(-particle.size, 0);
          context.lineTo(particle.size, 0);
          context.stroke();
        }
      } else if (particle.effect === "leaves" || particle.effect === "petals") {
        context.beginPath();
        context.ellipse(0, 0, particle.size, particle.size * .5, 0, 0, Math.PI * 2);
        context.fill();
      } else if (particle.effect === "confetti" || particle.effect === "shards") {
        context.fillRect(-particle.size * .35, -particle.size, particle.size * .7, particle.size * 2);
      } else if (particle.effect === "ripple" || particle.effect === "bubbles" || particle.effect === "crosshair") {
        context.globalAlpha = alpha * .85;
        context.lineWidth = 1.4;
        context.beginPath();
        context.arc(0, 0, particle.size * (1 + progress * 2.4), 0, Math.PI * 2);
        context.stroke();
        if (particle.effect === "crosshair") {
          context.beginPath();
          context.moveTo(-particle.size * 1.5, 0);
          context.lineTo(particle.size * 1.5, 0);
          context.moveTo(0, -particle.size * 1.5);
          context.lineTo(0, particle.size * 1.5);
          context.stroke();
        }
      } else if (particle.effect === "coins") {
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(0, 0, particle.size, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "#ffe28a";
        context.stroke();
      } else {
        context.beginPath();
        context.arc(0, 0, particle.size, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }

    release(particle) {
      if (particle) this.pool.push(particle);
    }

    requestFrame() {
      if (!this.frame) this.frame = requestAnimationFrame(this.tick);
    }

    clear() {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      while (this.particles.length) this.release(this.particles.pop());
    }

    destroy() {
      this.clear();
      window.removeEventListener("resize", this.resize);
    }
  }

  const startCursorGlow = () => {
    if (document.documentElement.dataset.cursorGlowReady === "true") return;
    document.documentElement.dataset.cursorGlowReady = "true";
    const glow = document.createElement("span");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    const effects = document.createElement("canvas");
    effects.className = "cursor-effects";
    effects.setAttribute("aria-hidden", "true");
    const cursor = document.createElement("span");
    cursor.className = "site-cursor particle-anchor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(glow, effects, cursor);
    const studio = new ParticleStudio(effects);
    window.sqezenParticleStudio = studio;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetX = -200;
    let targetY = -200;
    let currentX = targetX;
    let currentY = targetY;
    let currentScale = 1;
    let targetScale = 1;
    let frame = 0;
    let visible = false;
    let appliedCursor = "";
    let appliedGlow = "";
    let appliedEffect = "";
    let appliedDashboard = null;
    let appliedDashboardPreview = null;

    const getPublicPage = () => document.querySelector(".public-page");
    const getCursorUrl = () => getPublicPage()?.dataset.customCursor || document.querySelector('#profile-form [name="cursor_url"]')?.value || "";
    const getGlowColor = () => getPublicPage()?.dataset.cursorGlow || document.querySelector('#profile-form [name="cursor_glow_color"]')?.value || document.querySelector('#profile-form [name="background_color"]')?.value || "";
    const getCursorEffect = () => getPublicPage()?.dataset.cursorEffect || document.querySelector('#profile-form [name="cursor_effect"]')?.value || "none";
    const setEffectClass = (node, effect) => {
      CURSOR_EFFECTS.forEach((value) => node.classList.remove(`is-${value}`));
      node.classList.add(`is-${effect}`);
    };
    const syncCursor = () => {
      const cursorUrl = cleanCursorUrl(getCursorUrl());
      const glowColor = cleanColor(getGlowColor()) || "#626262";
      const cursorEffect = cleanCursorEffect(getCursorEffect());
      const isDashboard = document.body.dataset.route === "/dashboard";
      const dashboardPreview = isDashboard && Boolean(document.querySelector('[data-tab-panel="cursor-effects"]:hover'));
      if (cursorUrl === appliedCursor && glowColor === appliedGlow && cursorEffect === appliedEffect && isDashboard === appliedDashboard && dashboardPreview === appliedDashboardPreview) return;
      const cursorChanged = cursorUrl !== appliedCursor;
      appliedCursor = cursorUrl;
      appliedGlow = glowColor;
      appliedEffect = cursorEffect;
      appliedDashboard = isDashboard;
      appliedDashboardPreview = dashboardPreview;
      const effectColor = FIXED_EFFECT_COLORS[cursorEffect] || (cursorEffect === "confetti" ? CONFETTI_COLORS[0] : glowColor);
      document.documentElement.style.setProperty("--cursor-glow", glowColor);
      document.documentElement.style.setProperty("--cursor-glow-rgb", colorRgb(glowColor));
      document.documentElement.dataset.cursorEffect = cursorEffect;
      glow.style.setProperty("--cursor-glow", effectColor);
      glow.style.setProperty("--cursor-glow-rgb", colorRgb(effectColor));
      setEffectClass(glow, cursorEffect);
      setEffectClass(cursor, cursorEffect);
      studio.configure(cursorEffect, effectColor);
      const enhanced = supportsFinePointer() && (!isDashboard || dashboardPreview) && (Boolean(cursorUrl) || cursorEffect !== "none");
      document.documentElement.classList.toggle("has-custom-cursor", enhanced);
      document.documentElement.classList.toggle("cursor-enhanced", enhanced);
      document.documentElement.classList.toggle("cursor-particle-mode", enhanced);
      if (!enhanced) {
        visible = false;
        targetScale = 1;
        glow.style.opacity = "0";
        cursor.style.opacity = "0";
        studio.clear();
      }
      if (cursorChanged) {
        cursor.classList.remove("has-image");
        cursor.style.backgroundImage = "";
        if (cursorUrl) {
          const probe = new Image();
          probe.onload = () => {
            if (cursorUrl !== appliedCursor) return;
            cursor.style.backgroundImage = `url("${cursorUrl}")`;
            cursor.classList.add("has-image");
          };
          probe.onerror = () => cursor.classList.remove("has-image");
          probe.src = cursorUrl;
        }
      }
    };
    const render = () => {
      frame = 0;
      const response = reducedMotion.matches ? 1 : .2;
      currentX += (targetX - currentX) * response;
      currentY += (targetY - currentY) * response;
      currentScale += (targetScale - currentScale) * response;
      glow.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate3d(-50%,-50%,0)`;
      const offset = cursor.classList.contains("has-image") ? "translate3d(-12px,-9px,0)" : "translate3d(-50%,-50%,0)";
      cursor.style.transform = `translate3d(${targetX}px,${targetY}px,0) ${offset} scale(${currentScale})`;
      const settled = Math.abs(targetX - currentX) < .1 && Math.abs(targetY - currentY) < .1 && Math.abs(targetScale - currentScale) < .001;
      if (visible && !settled) frame = requestAnimationFrame(render);
    };
    const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };
    const hide = () => {
      visible = false;
      targetScale = 1;
      glow.style.opacity = "0";
      cursor.style.opacity = "0";
      studio.clear();
    };
    document.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      syncCursor();
      if (!document.documentElement.classList.contains("cursor-enhanced")) return;
      const interactive = Boolean(event.target?.closest?.("a,button,input,textarea,select,[role='button']"));
      const formControl = Boolean(event.target?.closest?.("input,textarea,select"));
      targetScale = appliedEffect === "magnetic" && interactive ? 1.42 : appliedEffect === "magnetic" ? 1.08 : 1;
      if (!formControl) studio.movement(targetX, targetY);
      cursor.style.opacity = "1";
      if (!visible) {
        visible = true;
        glow.style.opacity = appliedEffect === "none" ? "0" : ".34";
      }
      requestRender();
    }, { passive: true });
    document.addEventListener("pointerdown", (event) => {
      syncCursor();
      if (document.documentElement.classList.contains("cursor-enhanced") && !event.target?.closest?.("input,textarea,select")) studio.burst(event.clientX, event.clientY);
    }, { passive: true });
    document.addEventListener("input", syncCursor, { passive: true });
    document.addEventListener("change", syncCursor, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", () => { if (document.hidden) hide(); });
    const app = document.querySelector("#app");
    const observer = app ? new MutationObserver(syncCursor) : null;
    observer?.observe(app, { childList: true });
    syncCursor();
    requestRender();
    window.addEventListener("pagehide", () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      studio.destroy();
    }, { once: true });
  };

  window.SqezenParticleStudio = ParticleStudio;
  if (document.body) startCursorGlow();
  else requestAnimationFrame(startCursorGlow);
})();
