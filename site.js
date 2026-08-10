(function () {
  var overlay = document.querySelector('[data-contact-modal]');
  if (!overlay) return;

  var openers = document.querySelectorAll('[data-open-contact]');
  var closers = overlay.querySelectorAll('[data-close-contact]');

  function open(event) {
    if (event) event.preventDefault();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openers.forEach(function (el) {
    el.addEventListener('click', open);
  });

  closers.forEach(function (el) {
    el.addEventListener('click', close);
  });

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) close();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') close();
  });
})();
