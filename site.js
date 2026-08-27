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

  if (document.body.classList.contains('case-page--soul')) {
    var soulProjectCards = [
      {
        href: 'case-transport-pet.html',
        kicker: 'Мобильное приложение',
        title: 'Единый транспортный сервис для городских и междугородних поездок',
        meta: ['iOS / Android', '·', 'B2C'],
        image: 'assets/site/preview-kaliningrad.png',
        alt: 'Единый транспортный сервис'
      },
      {
        href: 'case-corporate.html',
        kicker: 'Внутренний продукт',
        title: 'Сервис заказа корпоративного транспорта',
        meta: ['iOS / Android', 'B2B', 'NDA'],
        image: 'assets/site/other-project-corporate.png',
        alt: 'Сервис заказа корпоративного транспорта'
      },
      {
        href: 'case-arm-kassira.html',
        kicker: 'Внутренний продукт',
        title: 'Автоматизированное рабочее место кассира',
        meta: ['Web', '·', 'B2B', '·', 'NDA'],
        image: 'assets/site/other-project-arm.png',
        alt: 'АРМ кассира'
      }
    ];

    cards.forEach(function (card, cardIndex) {
      var item = soulProjectCards[cardIndex];
      if (!item) return;
      card.href = item.href;
      var meta = '<div class="other-project-card__meta">' + item.meta.map(function (value) { return '<span>' + value + '</span>'; }).join('') + '</div>';
      card.innerHTML = '<div class="other-project-card__body"><span class="kicker">' + item.kicker + '</span><h3 class="other-project-card__title">' + item.title + '</h3><span class="other-project-card__spacer" aria-hidden="true"></span>' + meta + '<span class="other-project-card__link">Смотреть кейс&nbsp; →</span></div><div class="other-project-card__preview"><img src="' + item.image + '" alt="' + item.alt + '"></div>';
    });
  }

  cards.forEach(function (card) {
    var preview = card.querySelector('.other-project-card__preview img');
    if (preview) preview.removeAttribute('loading');
  });

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
  var card = btn.closest('.soul-flow-card');
  if (!card) return;
  var diagram = card.querySelector('[data-flow-diagram]');
  if (!diagram) return;
  var collapseBtn = card.querySelector('[data-flow-collapse]');
  if (collapseBtn) collapseBtn.remove();
  var caption = card.querySelector('.soul-flow-caption');
  if (caption) caption.remove();

  function setExpanded(expanded) {
    diagram.classList.toggle('is-expanded', expanded);
    card.classList.toggle('is-expanded', expanded);
    btn.textContent = expanded ? 'Свернуть флоу ↑' : 'Показать полный флоу →';
    diagram.after(btn);
  }

  setExpanded(false);

  btn.addEventListener('click', function () {
    setExpanded(!card.classList.contains('is-expanded'));
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
