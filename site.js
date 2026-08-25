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

(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 32);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();

document.querySelectorAll('.other-projects').forEach(function (block) {
  var track = block.querySelector('.other-projects__track');
  var prev = block.querySelector('[data-carousel-prev]');
  var next = block.querySelector('[data-carousel-next]');
  if (!track || !prev || !next) return;

  var cards = Array.prototype.slice.call(track.querySelectorAll('.other-project-card'));
  var index = 0;

  function gap() {
    return parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
  }

  function update() {
    var cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 0;
    var offset = index * (cardWidth + gap());
    track.style.transform = 'translateX(-' + offset + 'px)';
    prev.disabled = index <= 0;
    next.disabled = index >= cards.length - 1;
  }

  prev.addEventListener('click', function () {
    index = Math.max(0, index - 1);
    update();
  });

  next.addEventListener('click', function () {
    index = Math.min(cards.length - 1, index + 1);
    update();
  });

  window.addEventListener('resize', update);
  update();
});

document.querySelectorAll('[data-flow-toggle]').forEach(function (btn) {
  var diagram = document.querySelector('[data-flow-diagram]');
  if (!diagram) return;

  btn.addEventListener('click', function () {
    var expanded = diagram.classList.toggle('is-expanded');
    btn.textContent = expanded ? 'Свернуть флоу ↑' : 'Показать полный флоу →';
  });
});

(function () {
  var button = document.querySelector('[data-scroll-to-top]');
  if (!button) return;

  function update() {
    button.classList.toggle('is-visible', window.scrollY > 480);
  }

  button.addEventListener('click', function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
