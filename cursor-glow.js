(() => {
  const cleanCursorUrl = (value) => String(value || '').replace(/["\\\n\r]/g, '').trim();

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
    let cursorX = targetX;
    let cursorY = targetY;
    let frame = 0;
    let visible = false;
    let appliedCursor = '';

    const getCursorUrl = () => {
      const publicPage = document.querySelector('.public-page[data-custom-cursor]');
      if (publicPage?.dataset.customCursor) return publicPage.dataset.customCursor;
      return document.querySelector('#profile-form [name="cursor_url"]')?.value || '';
    };

    const syncCursor = () => {
      const cursorUrl = cleanCursorUrl(getCursorUrl());
      if (cursorUrl === appliedCursor) return;
      appliedCursor = cursorUrl;
      document.documentElement.classList.toggle('has-custom-cursor', Boolean(cursorUrl));
      const cursorValue = cursorUrl ? 'none' : '';
      document.documentElement.style.cursor = cursorValue;
      document.body.style.cursor = cursorValue;
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
      cursorX += (targetX - cursorX) * 0.38;
      cursorY += (targetY - cursorY) * 0.38;
      glow.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate3d(-50%,-50%,0)`;
      cursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0) translate3d(-50%,-50%,0)`;
      frame = requestAnimationFrame(render);
    };

    document.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.style.opacity = '1';
      syncCursor();
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
