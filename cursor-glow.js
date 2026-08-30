(() => {
  const cleanCursorUrl = (value) => String(value || '').replace(/["\\\n\r]/g, '').trim();

  const startCursorGlow = () => {
    if (document.documentElement.dataset.cursorGlowReady === 'true') return;
    document.documentElement.dataset.cursorGlowReady = 'true';

    const glow = document.createElement('span');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let targetX = -200;
    let targetY = -200;
    let currentX = targetX;
    let currentY = targetY;
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
      document.body.style.cursor = cursorUrl ? `url("${cursorUrl}"), auto` : '';
    };

    const render = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      glow.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate3d(-50%,-50%,0)`;
      frame = requestAnimationFrame(render);
    };

    document.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      syncCursor();
      if (!visible) {
        visible = true;
        glow.style.opacity = '0.34';
      }
    }, { passive: true });

    window.addEventListener('blur', () => {
      visible = false;
      glow.style.opacity = '0';
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        visible = false;
        glow.style.opacity = '0';
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
