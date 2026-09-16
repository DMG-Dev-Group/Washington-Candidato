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

  const scoreboard = document.querySelector('[data-scoreboard]');
  if (!scoreboard) return;

  const rows = [...scoreboard.querySelectorAll('.traj-score-row')].map((row) => ({
    row,
    value: row.querySelector('.traj-score-value'),
    fill: row.querySelector('.traj-score-fill'),
    target: Number(row.dataset.value),
    width: row.dataset.width,
  }));

  function setProgress(progress) {
    rows.forEach(({ value, fill, target, width }) => {
      value.textContent = Math.round(target * progress);
      fill.style.width = `${Number(width) * progress}%`;
    });
  }

  if (reducedMotion) {
    setProgress(1);
    return;
  }

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || animated) return;
      animated = true;
      const start = performance.now();
      const step = (now) => {
        const elapsed = Math.min(1, (now - start) / 900);
        setProgress(1 - Math.pow(1 - elapsed, 3));
        if (elapsed < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.3 });
  observer.observe(scoreboard);
})();
