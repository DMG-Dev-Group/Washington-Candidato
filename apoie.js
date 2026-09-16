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

  const picker = document.querySelector('[data-value-picker]');
  if (!picker) return;

  const noteText = picker.querySelector('[data-value-note-text]');
  const otherButton = picker.querySelector('[data-value-other]');
  const inputWrap = picker.querySelector('[data-value-input-wrap]');
  const customInput = picker.querySelector('#pix-custom-value');
  const presetButtons = [...picker.querySelectorAll('[data-pix-amount]')];

  function showNote(button) {
    if (noteText && button.dataset.note) noteText.textContent = button.dataset.note;
  }

  presetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      otherButton.classList.remove('active');
      inputWrap.hidden = true;
      showNote(button);
    });
  });

  otherButton.addEventListener('click', () => {
    presetButtons.forEach((button) => button.classList.remove('active'));
    otherButton.classList.add('active');
    inputWrap.hidden = false;
    customInput.focus();
    showNote(otherButton);
  });

  function formatCurrency(rawValue) {
    let digits = rawValue.replace(/\D/g, '');
    if (!digits) return '';
    digits = digits.replace(/^0+(?=\d)/, '');
    while (digits.length < 3) digits = `0${digits}`;
    const cents = digits.slice(-2);
    const reais = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${reais},${cents}`;
  }

  customInput.addEventListener('input', () => {
    customInput.value = formatCurrency(customInput.value);
  });
})();
