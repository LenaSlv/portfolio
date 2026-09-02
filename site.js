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

  if (document.body.classList.contains('case-page')) {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var soulProjectCards = [
      {
        href: 'case-transport-pet.html',
        kicker: 'iOS / Android B2C',
        title: 'Единый транспортный сервис для\u00a0городских и\u00a0междугородних поездок',
        desktopKicker: 'Product concept',
        desktopTitle: 'Единый транспортный сервис для городских и междугородних поездок',
        tags: ['iOS / Android', 'B2C', 'MVP'],
        description: 'Product concept · Information architecture · User flows · Mobile UX/UI · Edge cases',
        image: 'assets/site/preview-kaliningrad.png',
        alt: 'Единый транспортный сервис'
      },
      {
        href: 'case-soul.html',
        kicker: 'Telegram MiniApp',
        title: 'Платформа для\u00a0поиска компании и\u00a0активностей в\u00a0путешествиях',
        desktopKicker: 'Telegram MiniApp',
        desktopTitle: 'SOUL — платформа для поиска компании и активностей в путешествиях',
        tags: ['iOS / Android', 'B2C', 'MVP'],
        description: 'UX Research · Synthesis · Product hypotheses · User Flow · Mobile UX/UI',
        image: 'assets/site/other-project-soul.png',
        alt: 'SOUL'
      },
      {
        href: 'case-arm-kassira.html',
        kicker: 'Web B2B',
        title: 'Автоматизированное рабочее место кассира',
        desktopKicker: 'Внутренний продукт',
        desktopTitle: 'АРМ Кассира',
        tags: ['WEB', 'B2B', 'NDA'],
        description: 'Complex B2B flows · Payment scenarios · Edge cases · Web UI',
        image: 'assets/site/other-project-arm.png',
        alt: 'АРМ кассира'
      },
      {
        href: 'case-corporate.html',
        kicker: 'iOS / Android B2B2E',
        title: 'Сервис корпоративного транспорта',
        desktopKicker: 'Внутренний продукт',
        desktopTitle: 'Сервис заказа корпоративного транспорта',
        tags: ['iOS / Android', 'B2B', 'NDA'],
        description: 'Product logic · User flows · Mobile UX/UI',
        image: 'assets/site/preview-corporate.png',
        alt: 'Сервис корпоративного транспорта'
      }
    ];

    var visibleProjectCards = soulProjectCards.filter(function (item) {
      return item.href !== currentPage;
    });

    var isArmDesktop = document.body.classList.contains('case-page--arm') && window.matchMedia('(min-width: 961px)').matches;
    if (isArmDesktop) {
      var desktopOrder = ['case-corporate.html', 'case-soul.html', 'case-transport-pet.html'];
      visibleProjectCards.sort(function (a, b) {
        return desktopOrder.indexOf(a.href) - desktopOrder.indexOf(b.href);
      });
    }

    cards.forEach(function (card, cardIndex) {
      var item = visibleProjectCards[cardIndex];
      if (!item) {
        card.remove();
        return;
      }
      card.href = item.href;
      if (isArmDesktop) {
        var tags = item.tags.map(function (tag) {
          return '<span>' + tag + '</span>';
        }).join('');
        card.innerHTML = '<div class="other-project-card__body other-project-card__body--desktop"><div class="other-project-card__top"><span class="kicker">' + item.desktopKicker + '</span><h3 class="other-project-card__title">' + item.desktopTitle + '</h3></div><div class="other-project-card__meta">' + tags + '</div><span class="other-project-card__link">Смотреть кейс</span></div><div class="other-project-card__preview"><img src="' + item.image + '" alt="' + item.alt + '"></div>';
      } else {
        card.innerHTML = '<div class="other-project-card__body"><div class="other-project-card__top"><span class="kicker">' + item.kicker + '</span><h3 class="other-project-card__title">' + item.title + '</h3></div><div class="other-project-card__bottom"><p class="other-project-card__desc">' + item.description + '</p><span class="other-project-card__link">Смотреть кейс</span></div></div><div class="other-project-card__preview"><img src="' + item.image + '" alt="' + item.alt + '"></div>';
      }
    });

    cards = Array.prototype.slice.call(track.querySelectorAll('.other-project-card'));
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

  function setInlineExpanded(expanded) {
    diagram.classList.toggle('is-expanded', expanded);
    card.classList.toggle('is-expanded', expanded);
    btn.textContent = expanded ? 'Свернуть' : 'Показать полный флоу';
    btn.setAttribute('aria-expanded', String(expanded));
  }

  setInlineExpanded(false);

  btn.addEventListener('click', function () {
    setInlineExpanded(!card.classList.contains('is-expanded'));
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
