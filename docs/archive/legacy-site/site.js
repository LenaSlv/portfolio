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

(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menu.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });
})();

document.querySelectorAll('.other-projects').forEach(function (block) {
  var row = block.querySelector('.other-projects__row');
  var prev = block.querySelector('[data-carousel-prev]');
  var next = block.querySelector('[data-carousel-next]');
  if (!row || !prev || !next) return;

  function step() {
    var card = row.querySelector('.other-project-card');
    return card ? card.offsetWidth + 24 : row.clientWidth;
  }

  function updateButtons() {
    var maxScroll = row.scrollWidth - row.clientWidth;
    prev.disabled = row.scrollLeft <= 4;
    next.disabled = row.scrollLeft >= maxScroll - 4;
  }

  prev.addEventListener('click', function () {
    row.scrollBy({ left: -step(), behavior: 'smooth' });
  });

  next.addEventListener('click', function () {
    row.scrollBy({ left: step(), behavior: 'smooth' });
  });

  row.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();

  window.__carouselUpdaters = window.__carouselUpdaters || [];
  window.__carouselUpdaters.push(updateButtons);
});
