(() => {
  const cleanCursorUrl = (value) => String(value || '').replace(/["\\\n\r]/g, '').trim();
  const cleanColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || '').trim()) ? String(value).trim().toLowerCase() : '';
  const supportsFinePointer = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches !== false;

  const startCursorGlow = () => {
    if (document.documentElement.dataset.cursorGlowReady === 'true') return;
    document.documentElement.dataset.cursorGlowReady = 'true';

    const glow = document.createElement('span');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    const cursor = document.createElement('span');
    cursor.className = 'site-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);

    let targetX = -200;
    let targetY = -200;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;
    let visible = false;
    let appliedCursor = '';
    let appliedGlow = '';
    let appliedDashboard = null;

    const getCursorUrl = () => {
      const publicPage = document.querySelector('.public-page[data-custom-cursor]');
      if (publicPage?.dataset.customCursor) return publicPage.dataset.customCursor;
      return document.querySelector('#profile-form [name="cursor_url"]')?.value || '';
    };

    const getGlowColor = () => {
      const publicPage = document.querySelector('.public-page[data-cursor-glow]');
      return publicPage?.dataset.cursorGlow || document.querySelector('#profile-form [name="cursor_glow_color"]')?.value || document.querySelector('#profile-form [name="background_color"]')?.value || '';
    };

    const syncCursor = () => {
      const cursorUrl = cleanCursorUrl(getCursorUrl());
      const glowColor = cleanColor(getGlowColor()) || '#5865ee';
      const isDashboard = document.body.dataset.route === '/dashboard';
      if (cursorUrl === appliedCursor && glowColor === appliedGlow && isDashboard === appliedDashboard) return;
      appliedCursor = cursorUrl;
      appliedGlow = glowColor;
      appliedDashboard = isDashboard;
      document.documentElement.style.setProperty('--cursor-glow', glowColor);
      const useCustomCursor = supportsFinePointer() && (isDashboard || Boolean(cursorUrl));
      document.documentElement.classList.toggle('has-custom-cursor', useCustomCursor);
      document.documentElement.classList.toggle('cursor-enhanced', useCustomCursor);
      if (!useCustomCursor) {
        visible = false;
        glow.style.opacity = '0';
        cursor.style.opacity = '0';
      }
      cursor.classList.remove('has-image');
      cursor.style.backgroundImage = '';
      if (cursorUrl) {
        const probe = document.createElement('img');
        probe.onload = () => {
          if (cursorUrl !== appliedCursor) return;
          cursor.style.backgroundImage = `url("${cursorUrl}")`;
          cursor.classList.add('has-image');
        };
        probe.onerror = () => cursor.classList.remove('has-image');
        probe.src = cursorUrl;
      }
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      const cursorX = targetX;
      const cursorY = targetY;
      glow.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate3d(-50%,-50%,0)`;
      const cursorOffset = cursor.classList.contains('has-image') ? 'translate3d(-12px,-9px,0)' : 'translate3d(-50%,-50%,0)';
      cursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0) ${cursorOffset}`;
      frame = requestAnimationFrame(render);
    };

    document.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      syncCursor();
      if (!document.documentElement.classList.contains('cursor-enhanced')) return;
      cursor.style.opacity = '1';
      if (!visible) {
        visible = true;
        glow.style.opacity = '0.34';
      }
    }, { passive: true });

    window.addEventListener('blur', () => {
      visible = false;
      glow.style.opacity = '0';
      cursor.style.opacity = '0';
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        visible = false;
        glow.style.opacity = '0';
        cursor.style.opacity = '0';
      }
    });

    new MutationObserver(syncCursor).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('input', syncCursor, { passive: true });
    document.addEventListener('change', syncCursor, { passive: true });
    window.setInterval(syncCursor, 300);
    syncCursor();
    render();

    window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
  };

  const waitForBody = () => {
    if (document.body) startCursorGlow();
    else requestAnimationFrame(waitForBody);
  };

  waitForBody();
})();
