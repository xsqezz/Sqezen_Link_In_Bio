(() => {
  const installWheel = () => {
    const appearance = document.querySelector('[data-tab-panel="appearance"]');
    const stage = appearance?.querySelector('.custom-stage');
    const oldNav = appearance?.querySelector('.custom-carousel-nav');
    if (!stage || !oldNav || stage.dataset.wheelFix === 'true') return;

    const cards = Array.from(stage.children).filter((element) => element.classList.contains('custom-card'));
    if (cards.length < 2) return;
    stage.dataset.wheelFix = 'true';

    const nav = oldNav.cloneNode(true);
    oldNav.replaceWith(nav);
    const previous = nav.querySelector('[data-custom-direction="prev"]');
    const next = nav.querySelector('[data-custom-direction="next"]');
    const step = nav.querySelector('[data-custom-step-label]');
    const name = nav.querySelector('[data-custom-step-name]');
    const names = ['Materiały', 'Karta profilu', 'Kolor i ton', 'Układ i detale'];
    let active = Math.max(0, cards.findIndex((card) => card.classList.contains('is-active')));
    let locked = false;

    const updateNav = () => {
      step.textContent = String(active + 1).padStart(2, '0');
      name.textContent = names[active] || 'Sekcja';
      previous.disabled = active === 0;
      next.disabled = active === cards.length - 1;
    };

    const show = (target, direction) => {
      if (locked || target < 0 || target >= cards.length || target === active) return;
      locked = true;
      const outgoing = cards[active];
      const incoming = cards[target];
      const side = direction > 0 ? 'next' : 'prev';
      outgoing.classList.remove('is-active');
      outgoing.classList.add('is-leaving', `leave-${side}`);
      outgoing.setAttribute('aria-hidden', 'true');

      // Keep the incoming card fully hidden until the outgoing card has
      // reached its edge. This prevents two transparent cards from being
      // composited on top of each other during the turn.
      window.setTimeout(() => {
        outgoing.classList.remove('is-leaving', 'leave-next', 'leave-prev');
        incoming.classList.remove('is-leaving', 'leave-next', 'leave-prev', 'enter-next', 'enter-prev');
        incoming.classList.add('is-active', `enter-${side}`);
        incoming.setAttribute('aria-hidden', 'false');
        active = target;
        updateNav();

        window.setTimeout(() => {
          incoming.classList.remove('enter-next', 'enter-prev');
          locked = false;
        }, 360);
      }, 360);
    };

    previous.addEventListener('click', () => show(active - 1, -1));
    next.addEventListener('click', () => show(active + 1, 1));
    updateNav();
  };

  const observer = new MutationObserver(installWheel);
  observer.observe(document.body, { childList: true, subtree: true });
  installWheel();
})();
