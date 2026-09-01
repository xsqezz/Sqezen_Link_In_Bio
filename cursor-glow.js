(() => {
  const CURSOR_EFFECTS = new Set(["none", "glow", "ring", "neon", "comet", "trail", "sparkle", "orbit", "bubbles", "fire", "snow", "hearts", "pixel", "crosshair", "spotlight", "ripple", "rainbow", "magnetic"]);
  const cleanCursorUrl = (value) => String(value || "").replace(/["\\\n\r]/g, "").trim();
  const cleanColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || "").trim()) ? String(value).trim().toLowerCase() : "";
  const cleanCursorEffect = (value) => CURSOR_EFFECTS.has(String(value || "").trim()) ? String(value).trim() : "none";
  const supportsFinePointer = () => window.matchMedia?.("(hover: hover) and (pointer: fine)").matches !== false;

  const startCursorGlow = () => {
    if (document.documentElement.dataset.cursorGlowReady === "true") return;
    document.documentElement.dataset.cursorGlowReady = "true";

    const glow = document.createElement("span");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    const effects = document.createElement("span");
    effects.className = "cursor-effects";
    effects.setAttribute("aria-hidden", "true");
    document.body.appendChild(effects);

    const cursor = document.createElement("span");
    cursor.className = "site-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);

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
    let lastParticleAt = 0;
    let lastParticleX = targetX;
    let lastParticleY = targetY;

    const getPublicPage = () => document.querySelector(".public-page");
    const getCursorUrl = () => {
      const publicPage = getPublicPage();
      if (publicPage?.dataset.customCursor) return publicPage.dataset.customCursor;
      return document.querySelector('#profile-form [name="cursor_url"]')?.value || "";
    };
    const getGlowColor = () => {
      const publicPage = getPublicPage();
      return publicPage?.dataset.cursorGlow || document.querySelector('#profile-form [name="cursor_glow_color"]')?.value || document.querySelector('#profile-form [name="background_color"]')?.value || "";
    };
    const getCursorEffect = () => {
      const publicPage = getPublicPage();
      return publicPage?.dataset.cursorEffect || document.querySelector('#profile-form [name="cursor_effect"]')?.value || "none";
    };
    const setEffectClass = (node, effect) => {
      CURSOR_EFFECTS.forEach((value) => node.classList.remove(`is-${value}`));
      node.classList.add(`is-${effect}`);
    };
    const clearParticles = () => {
      effects.replaceChildren();
      lastParticleAt = 0;
      lastParticleX = targetX;
      lastParticleY = targetY;
    };
    const spawnParticle = (effect, x, y, options = {}) => {
      if (!document.documentElement.classList.contains("cursor-enhanced")) return;
      const particle = document.createElement("i");
      const spread = Number(options.spread === undefined ? (effect === "fire" ? 42 : effect === "snow" ? 34 : 30) : options.spread);
      const duration = Number(options.duration === undefined ? (effect === "ripple" ? 620 : effect === "comet" ? 520 : 760) : options.duration);
      particle.className = `cursor-particle is-${effect}`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.color = appliedGlow || "#5865ee";
      particle.style.setProperty("--particle-x", `${(Math.random() - 0.5) * spread}px`);
      particle.style.setProperty("--particle-y", `${(Math.random() - 0.68) * spread}px`);
      particle.style.setProperty("--particle-duration", `${duration}ms`);
      particle.style.setProperty("--particle-rotation", `${Math.round(Math.random() * 360)}deg`);
      if (effect === "hearts") particle.textContent = "+";
      effects.appendChild(particle);
      while (effects.childElementCount > 56) effects.firstElementChild?.remove();
      window.setTimeout(() => particle.remove(), duration + 80);
    };
    const spawnMovementParticles = (effect, x, y) => {
      const movementConfig = {
        comet: { interval: 34, distance: 7, count: 1, spread: 30, duration: 560 },
        trail: { interval: 25, distance: 5, count: 1, spread: 22, duration: 680 },
        sparkle: { interval: 78, distance: 12, count: 1, spread: 36, duration: 680 },
        orbit: { interval: 95, distance: 14, count: 1, spread: 28, duration: 720 },
        bubbles: { interval: 62, distance: 9, count: 1, spread: 44, duration: 920 },
        fire: { interval: 35, distance: 6, count: 1, spread: 48, duration: 700 },
        snow: { interval: 88, distance: 13, count: 1, spread: 38, duration: 1050 },
        hearts: { interval: 110, distance: 17, count: 1, spread: 42, duration: 960 },
        pixel: { interval: 27, distance: 5, count: 1, spread: 25, duration: 600 },
        rainbow: { interval: 74, distance: 12, count: 1, spread: 32, duration: 650 }
      };
      const config = movementConfig[effect];
      if (!config) return;
      const now = performance.now();
      const distance = Math.hypot(x - lastParticleX, y - lastParticleY);
      if (now - lastParticleAt < config.interval || distance < config.distance) return;
      lastParticleAt = now;
      lastParticleX = x;
      lastParticleY = y;
      for (let index = 0; index < config.count; index += 1) spawnParticle(effect, x, y, config);
    };
    const spawnClickBurst = (effect, x, y) => {
      const bursts = { ripple: 1, bubbles: 4, sparkle: 5, hearts: 3, fire: 4, snow: 4 };
      const count = bursts[effect] || 0;
      for (let index = 0; index < count; index += 1) spawnParticle(effect, x, y, { spread: effect === "ripple" ? 0 : 54, duration: effect === "ripple" ? 680 : 820 });
    };

    const syncCursor = () => {
      const cursorUrl = cleanCursorUrl(getCursorUrl());
      const glowColor = cleanColor(getGlowColor()) || "#5865ee";
      const cursorEffect = cleanCursorEffect(getCursorEffect());
      const isDashboard = document.body.dataset.route === "/dashboard";
      if (cursorUrl === appliedCursor && glowColor === appliedGlow && cursorEffect === appliedEffect && isDashboard === appliedDashboard) return;
      const cursorChanged = cursorUrl !== appliedCursor;
      appliedCursor = cursorUrl;
      appliedGlow = glowColor;
      appliedEffect = cursorEffect;
      appliedDashboard = isDashboard;
      document.documentElement.style.setProperty("--cursor-glow", glowColor);
      document.documentElement.dataset.cursorEffect = cursorEffect;
      effects.style.color = glowColor;
      setEffectClass(glow, cursorEffect);
      setEffectClass(effects, cursorEffect);
      setEffectClass(cursor, cursorEffect);
      const useCustomCursor = supportsFinePointer() && (isDashboard || Boolean(cursorUrl) || cursorEffect !== "none");
      document.documentElement.classList.toggle("has-custom-cursor", useCustomCursor);
      document.documentElement.classList.toggle("cursor-enhanced", useCustomCursor);
      if (!useCustomCursor) {
        visible = false;
        targetScale = 1;
        glow.style.opacity = "0";
        cursor.style.opacity = "0";
        clearParticles();
      }
      if (cursorChanged) {
        cursor.classList.remove("has-image");
        cursor.style.backgroundImage = "";
        if (cursorUrl) {
          const probe = document.createElement("img");
          probe.onload = () => {
            if (cursorUrl !== appliedCursor) return;
            cursor.style.backgroundImage = `url("${cursorUrl}")`;
            cursor.classList.add("has-image");
          };
          probe.onerror = () => cursor.classList.remove("has-image");
          probe.src = cursorUrl;
        }
      }
      if (cursorEffect === "none" || cursorEffect === "glow") clearParticles();
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      currentScale += (targetScale - currentScale) * 0.2;
      glow.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate3d(-50%,-50%,0)`;
      const cursorX = targetX;
      const cursorY = targetY;
      const cursorOffset = cursor.classList.contains("has-image") ? "translate3d(-12px,-9px,0)" : "translate3d(-50%,-50%,0)";
      cursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0) ${cursorOffset} scale(${currentScale})`;
      frame = requestAnimationFrame(render);
    };

    document.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      syncCursor();
      if (!document.documentElement.classList.contains("cursor-enhanced")) return;
      const interactive = Boolean(event.target?.closest?.("a,button,input,textarea,select,[role='button']"));
      targetScale = appliedEffect === "magnetic" && interactive ? 1.42 : appliedEffect === "magnetic" ? 1.08 : 1;
      spawnMovementParticles(appliedEffect, targetX, targetY);
      cursor.style.opacity = "1";
      if (!visible) {
        visible = true;
        glow.style.opacity = appliedEffect === "none" ? "0" : "0.34";
      }
    }, { passive: true });
    document.addEventListener("pointerdown", (event) => {
      syncCursor();
      if (!document.documentElement.classList.contains("cursor-enhanced")) return;
      spawnClickBurst(appliedEffect, event.clientX, event.clientY);
    }, { passive: true });
    window.addEventListener("blur", () => {
      visible = false;
      targetScale = 1;
      glow.style.opacity = "0";
      cursor.style.opacity = "0";
      clearParticles();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        visible = false;
        targetScale = 1;
        glow.style.opacity = "0";
        cursor.style.opacity = "0";
        clearParticles();
      }
    });

    new MutationObserver(syncCursor).observe(document.body, { childList: true, subtree: true });
    document.addEventListener("input", syncCursor, { passive: true });
    document.addEventListener("change", syncCursor, { passive: true });
    const syncTimer = window.setInterval(syncCursor, 300);
    syncCursor();
    render();

    window.addEventListener("pagehide", () => {
      cancelAnimationFrame(frame);
      window.clearInterval(syncTimer);
      clearParticles();
    }, { once: true });
  };

  const waitForBody = () => {
    if (document.body) startCursorGlow();
    else requestAnimationFrame(waitForBody);
  };

  waitForBody();
})();
