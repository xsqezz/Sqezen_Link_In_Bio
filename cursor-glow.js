(() => {
  const CURSOR_EFFECTS = new Set(["none", "glow", "ring", "neon", "comet", "trail", "sparkle", "orbit", "bubbles", "fire", "snow", "hearts", "pixel", "crosshair", "spotlight", "ripple", "rainbow", "magnetic", "dust", "glitter", "confetti", "leaves", "petals", "shards", "orbs", "smoke", "magic", "coins", "lightning", "stars"]);
  const PARTICLE_GLYPHS = { hearts: "♥", leaves: "❧", petals: "✿", magic: "✧", lightning: "ϟ", stars: "✦", glitter: "✧" };
  const cleanCursorUrl = (value) => String(value || "").replace(/["\\\n\r]/g, "").trim();
  const cleanColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || "").trim()) ? String(value).trim().toLowerCase() : "";
  const colorRgb = (value) => {
    const color = cleanColor(value) || "#5865ee";
    return [0, 2, 4].map((offset) => Number.parseInt(color.slice(offset + 1, offset + 3), 16)).join(",");
  };
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
    cursor.classList.add("particle-anchor");
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
      if (!document.documentElement.classList.contains("cursor-enhanced") || effect === "none") return;
      const particle = document.createElement("i");
      const rawSpread = Number(options.spread);
      const spread = Number.isFinite(rawSpread) ? Math.max(0, rawSpread) : 30;
      const rawMinDistance = Number(options.minDistance);
      const minDistance = Number.isFinite(rawMinDistance) ? Math.max(0, Math.min(spread, rawMinDistance)) : Math.min(4, spread);
      const distance = minDistance + Math.random() * Math.max(0, spread - minDistance);
      const angle = Number.isFinite(Number(options.angle)) ? Number(options.angle) : Math.random() * Math.PI * 2;
      const lift = Number.isFinite(Number(options.lift)) ? Number(options.lift) : 0;
      const duration = Number.isFinite(Number(options.duration)) ? Number(options.duration) : 760;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance - lift;
      particle.className = `cursor-particle is-${effect}`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.color = appliedGlow || "#5865ee";
      particle.style.setProperty("--particle-x", `${offsetX}px`);
      particle.style.setProperty("--particle-y", `${offsetY}px`);
      particle.style.setProperty("--particle-duration", `${duration}ms`);
      particle.style.setProperty("--particle-rotation", `${Math.round(Math.random() * 360)}deg`);
      particle.style.setProperty("--particle-spin", `${Math.round((Math.random() - 0.5) * 720)}deg`);
      particle.style.setProperty("--particle-hue", `${Math.round(Math.random() * 360)}`);
      const glyph = PARTICLE_GLYPHS[effect];
      if (glyph) particle.textContent = glyph;
      effects.appendChild(particle);
      while (effects.childElementCount > 100) effects.firstElementChild?.remove();
      particle.addEventListener("animationend", () => particle.remove(), { once: true });
      window.setTimeout(() => particle.remove(), duration + 120);
    };
    const spawnMovementParticles = (effect, x, y) => {
      const movementConfig = {
        glow: { interval: 42, distance: 6, count: 2, spread: 24, duration: 720, lift: 3 },
        ring: { interval: 78, distance: 10, count: 1, spread: 30, duration: 700 },
        neon: { interval: 34, distance: 5, count: 2, spread: 40, duration: 600 },
        comet: { interval: 28, distance: 5, count: 2, spread: 48, duration: 560 },
        trail: { interval: 22, distance: 4, count: 2, spread: 25, duration: 680 },
        sparkle: { interval: 52, distance: 9, count: 2, spread: 38, duration: 680, lift: 5 },
        orbit: { interval: 68, distance: 12, count: 2, spread: 32, duration: 760 },
        bubbles: { interval: 48, distance: 7, count: 1, spread: 48, duration: 980, lift: 10 },
        fire: { interval: 27, distance: 4, count: 2, spread: 54, duration: 720, lift: 14 },
        snow: { interval: 66, distance: 10, count: 1, spread: 46, duration: 1120, lift: 7 },
        hearts: { interval: 75, distance: 12, count: 1, spread: 48, duration: 980, lift: 13 },
        pixel: { interval: 20, distance: 4, count: 2, spread: 30, duration: 620 },
        crosshair: { interval: 72, distance: 12, count: 1, spread: 36, duration: 760 },
        spotlight: { interval: 42, distance: 7, count: 2, spread: 34, duration: 820, lift: 5 },
        ripple: { interval: 120, distance: 18, count: 1, spread: 18, duration: 620 },
        rainbow: { interval: 48, distance: 8, count: 2, spread: 44, duration: 700 },
        magnetic: { interval: 54, distance: 8, count: 2, spread: 34, duration: 680 },
        dust: { interval: 24, distance: 4, count: 2, spread: 28, duration: 760, lift: 7 },
        glitter: { interval: 36, distance: 6, count: 2, spread: 36, duration: 690, lift: 6 },
        confetti: { interval: 42, distance: 7, count: 2, spread: 56, duration: 920, lift: 8 },
        leaves: { interval: 70, distance: 10, count: 1, spread: 52, duration: 1080, lift: 9 },
        petals: { interval: 62, distance: 9, count: 1, spread: 46, duration: 1040, lift: 10 },
        shards: { interval: 30, distance: 5, count: 2, spread: 52, duration: 650 },
        orbs: { interval: 55, distance: 8, count: 1, spread: 42, duration: 900, lift: 5 },
        smoke: { interval: 70, distance: 10, count: 1, spread: 32, duration: 1260, lift: 14 },
        magic: { interval: 72, distance: 11, count: 1, spread: 48, duration: 1000, lift: 9 },
        coins: { interval: 58, distance: 8, count: 1, spread: 48, duration: 940, lift: 4 },
        lightning: { interval: 32, distance: 5, count: 2, spread: 44, duration: 640 },
        stars: { interval: 62, distance: 10, count: 1, spread: 48, duration: 900, lift: 9 }
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
      const bursts = { glow: 5, ring: 3, neon: 7, comet: 5, trail: 6, sparkle: 8, orbit: 5, bubbles: 6, fire: 8, snow: 7, hearts: 6, pixel: 8, crosshair: 4, spotlight: 5, ripple: 1, rainbow: 9, magnetic: 6, dust: 8, glitter: 10, confetti: 10, leaves: 6, petals: 7, shards: 8, orbs: 6, smoke: 4, magic: 7, coins: 6, lightning: 7, stars: 8 };
      const count = bursts[effect] || 0;
      const spread = effect === "ripple" ? 0 : effect === "smoke" ? 34 : 72;
      const duration = effect === "ripple" ? 680 : effect === "smoke" ? 1300 : 900;
      for (let index = 0; index < count; index += 1) spawnParticle(effect, x, y, { spread, minDistance: effect === "ripple" ? 0 : 12, duration, lift: effect === "fire" || effect === "hearts" ? 12 : 0 });
    };

    const syncCursor = () => {
      const cursorUrl = cleanCursorUrl(getCursorUrl());
      const glowColor = cleanColor(getGlowColor()) || "#5865ee";
      const cursorEffect = cleanCursorEffect(getCursorEffect());
      const isDashboard = document.body.dataset.route === "/dashboard";
      if (cursorUrl === appliedCursor && glowColor === appliedGlow && cursorEffect === appliedEffect && isDashboard === appliedDashboard) return;
      const cursorChanged = cursorUrl !== appliedCursor;
      const effectChanged = cursorEffect !== appliedEffect;
      appliedCursor = cursorUrl;
      appliedGlow = glowColor;
      appliedEffect = cursorEffect;
      appliedDashboard = isDashboard;
      document.documentElement.style.setProperty("--cursor-glow", glowColor);
      document.documentElement.style.setProperty("--cursor-glow-rgb", colorRgb(glowColor));
      document.documentElement.dataset.cursorEffect = cursorEffect;
      effects.style.color = glowColor;
      setEffectClass(glow, cursorEffect);
      setEffectClass(effects, cursorEffect);
      setEffectClass(cursor, cursorEffect);
      const useCustomCursor = supportsFinePointer() && (isDashboard || Boolean(cursorUrl) || cursorEffect !== "none");
      document.documentElement.classList.toggle("has-custom-cursor", useCustomCursor);
      document.documentElement.classList.toggle("cursor-enhanced", useCustomCursor);
      document.documentElement.classList.toggle("cursor-particle-mode", useCustomCursor);
      if (effectChanged) clearParticles();
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
