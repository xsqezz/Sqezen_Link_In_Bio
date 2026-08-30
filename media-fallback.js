(() => {
  const protectMedia = () => {
    document.querySelectorAll('img.profile-avatar, img.preview-avatar').forEach((image) => {
      if (image.dataset.fallbackReady) return;
      image.dataset.fallbackReady = 'true';
      const replaceWithFallback = () => {
        if (!image.isConnected) return;
        const fallback = document.createElement('span');
        fallback.className = `${image.className} avatar-fallback`;
        fallback.setAttribute('aria-label', image.alt || 'Avatar użytkownika');
        const name = image.alt.replace(/^Avatar użytkownika\s*/i, '').trim() || 'S';
        fallback.textContent = name.slice(0, 1).toUpperCase();
        image.replaceWith(fallback);
      };
      image.addEventListener('error', replaceWithFallback, { once: true });
      if (image.complete && image.naturalWidth === 0) replaceWithFallback();
    });

    document.querySelectorAll('.public-media').forEach((media) => {
      if (media.dataset.fallbackReady) return;
      media.dataset.fallbackReady = 'true';
      const removeBrokenMedia = () => media.remove();
      media.addEventListener('error', removeBrokenMedia, { once: true });
      if (media.tagName === 'VIDEO') {
        media.load();
      } else {
        const background = media.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i)?.[1];
        if (background) {
          const probe = new Image();
          probe.onerror = removeBrokenMedia;
          probe.src = background;
        }
      }
    });
  };

  const observer = new MutationObserver(protectMedia);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  protectMedia();
})();
