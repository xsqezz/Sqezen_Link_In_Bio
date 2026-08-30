(() => {
  const initCursorGlow = () => {
    const page = document.querySelector('.public-page[data-custom-cursor]');
    if (!page || page.dataset.cursorGlowReady === 'true') return;
    page.dataset.cursorGlowReady = 'true';
    page.style.cursor = `url("${page.dataset.customCursor.replace(/["\\\n\r]/g, '')}"),auto`;

    const glow = document.createElement('span');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    page.appendChild(glow);

    let targetX = -200;
    let targetY = -200;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;
    let visible = false;

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      glow.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate3d(-50%,-50%,0)`;
      frame = requestAnimationFrame(render);
    };

    page.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        glow.style.opacity = '0.34';
      }
    });
    page.addEventListener('pointerenter', () => { glow.style.opacity = visible ? '0.34' : '0'; });
    page.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
    render();

    window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
  };

  const observer = new MutationObserver(initCursorGlow);
  observer.observe(document.body, { childList: true, subtree: true });
  initCursorGlow();
})();
