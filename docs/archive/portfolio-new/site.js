(() => {
  const button = document.querySelector('[data-scroll-to-top]');

  if (!button) return;

  const toggleButton = () => {
    button.classList.toggle('is-visible', window.scrollY > 480);
  };

  window.addEventListener('scroll', toggleButton, { passive: true });
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleButton();
})();
