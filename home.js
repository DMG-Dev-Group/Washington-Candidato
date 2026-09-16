(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-reveal]').forEach((element) => {
    if (reducedMotion) return;
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    observer.observe(element);
  });

  const section = document.querySelector('[data-testimony]');
  if (!section) return;

  const cards = [...section.querySelectorAll('[data-testimony-card]')];
  const progress = section.querySelector('.testimony-progress span');
  const video = section.querySelector('video');

  function setCardState(card, opacity, offset) {
    card.style.opacity = opacity.toFixed(3);
    card.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    card.style.pointerEvents = opacity > 0.6 ? 'auto' : 'none';
  }

  function updateTestimony() {
    const bounds = section.getBoundingClientRect();
    const range = Math.max(1, bounds.height - window.innerHeight);
    const progressValue = reducedMotion ? 0.84 : Math.max(0, Math.min(1, -bounds.top / range));
    section.style.setProperty('--testimony-progress', progressValue.toFixed(4));
    progress.style.transform = `scaleX(${progressValue})`;

    [[0.02, 0.16, 0.3, 0.42], [0.4, 0.52, 0.64, 0.74], [0.72, 0.86, 1.01, 1.02]]
      .forEach(([start, enter, leave, end], index) => {
        let opacity = 0;
        if (progressValue >= enter && progressValue <= leave) opacity = 1;
        else if (progressValue > start && progressValue < enter) opacity = (progressValue - start) / (enter - start);
        else if (progressValue > leave && progressValue < end) opacity = 1 - (progressValue - leave) / (end - leave);
        const smooth = opacity * opacity * (3 - 2 * opacity);
        setCardState(cards[index], smooth, progressValue < enter ? (1 - smooth) * 30 : -(1 - smooth) * 24);
      });
  }

  if (video) video.play().catch(() => {});
  window.addEventListener('scroll', updateTestimony, { passive: true });
  window.addEventListener('resize', updateTestimony);
  updateTestimony();
})();
