(function () {
  if (window.__portfolioQaLensLoaded) return;
  window.__portfolioQaLensLoaded = true;

  var highlightStyleId = 'portfolio-qa-lens-style';
  var highlightAttribute = 'data-portfolio-qa-highlight';

  function getSelector(element) {
    if (!element || element.nodeType !== 1) return '';
    if (element.id) return '#' + CSS.escape(element.id);

    var parts = [];
    var current = element;
    while (current && current.nodeType === 1 && current !== document.body) {
      var part = current.tagName.toLowerCase();
      var sameTag = current.parentElement
        ? Array.prototype.filter.call(current.parentElement.children, function (child) {
            return child.tagName === current.tagName;
          })
        : [];
      if (sameTag.length > 1) part += ':nth-of-type(' + (sameTag.indexOf(current) + 1) + ')';
      parts.unshift(part);
      current = current.parentElement;
    }
    return parts.join(' > ');
  }

  function shortText(element) {
    return (element.innerText || element.getAttribute('aria-label') || element.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100);
  }

  function escapesViewport(element) {
    var current = element.parentElement;
    while (current && current !== document.body) {
      var overflowX = getComputedStyle(current).overflowX;
      if (overflowX === 'hidden' || overflowX === 'clip' || overflowX === 'auto' || overflowX === 'scroll') return false;
      current = current.parentElement;
    }
    return true;
  }

  function audit() {
    var viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    var viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    var scrollWidth = Math.max(document.documentElement.scrollWidth, document.body ? document.body.scrollWidth : 0);
    var overflowElements = [];

    Array.prototype.forEach.call(document.querySelectorAll('body *'), function (element) {
      var rect = element.getBoundingClientRect();
      var style = getComputedStyle(element);
      if (!rect.width || !rect.height || style.position === 'fixed' || style.position === 'sticky') return;
      if ((rect.left < -1 || rect.right > viewportWidth + 1) && escapesViewport(element)) {
        overflowElements.push({
          selector: getSelector(element),
          text: shortText(element),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        });
      }
    });

    var brokenImages = Array.prototype.map.call(document.images, function (image) {
      if (!image.complete || image.naturalWidth > 0) return null;
      return {
        selector: getSelector(image),
        source: image.currentSrc || image.src,
        alt: image.alt || ''
      };
    }).filter(Boolean);

    var unlabeledControls = Array.prototype.map.call(document.querySelectorAll('a, button, input, select, textarea'), function (element) {
      var label = element.getAttribute('aria-label') || element.getAttribute('title') || shortText(element);
      if (label) return null;
      return { selector: getSelector(element), tag: element.tagName.toLowerCase() };
    }).filter(Boolean);

    var hasScrollToTop = Boolean(document.querySelector('[data-scroll-to-top], .scroll-to-top'));
    var issues = [];

    if (scrollWidth > viewportWidth + 1) {
      issues.push({
        code: 'horizontal-overflow',
        severity: 'error',
        title: 'Горизонтальное переполнение страницы',
        detail: 'Ширина документа ' + scrollWidth + ' px при viewport ' + viewportWidth + ' px.'
      });
    }

    overflowElements.slice(0, 30).forEach(function (item) {
      issues.push({
        code: 'overflow-element',
        severity: 'error',
        title: 'Элемент выходит за границы viewport',
        detail: item.selector + ' · right: ' + item.right + ' px · ' + (item.text || 'без текста'),
        selector: item.selector
      });
    });

    brokenImages.forEach(function (item) {
      issues.push({
        code: 'broken-image',
        severity: 'error',
        title: 'Изображение не загрузилось',
        detail: item.source,
        selector: item.selector
      });
    });

    unlabeledControls.slice(0, 20).forEach(function (item) {
      issues.push({
        code: 'unlabeled-control',
        severity: 'warning',
        title: 'Интерактивный элемент без подписи',
        detail: item.tag + ' · ' + item.selector,
        selector: item.selector
      });
    });

    if (!hasScrollToTop) {
      issues.push({
        code: 'missing-scroll-top',
        severity: 'warning',
        title: 'Нет кнопки возврата наверх',
        detail: 'На странице не найден [data-scroll-to-top] или .scroll-to-top.'
      });
    }

    return {
      checkedAt: new Date().toISOString(),
      url: window.location.href,
      title: document.title,
      viewport: { width: viewportWidth, height: viewportHeight },
      document: {
        scrollWidth: scrollWidth,
        scrollHeight: Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0),
        horizontalOverflow: Math.max(0, scrollWidth - viewportWidth)
      },
      counts: {
        overflowElements: overflowElements.length,
        brokenImages: brokenImages.length,
        unlabeledControls: unlabeledControls.length
      },
      issues: issues,
      overflowElements: overflowElements.slice(0, 30),
      brokenImages: brokenImages,
      hasScrollToTop: hasScrollToTop
    };
  }

  function clearHighlights() {
    Array.prototype.forEach.call(document.querySelectorAll('[' + highlightAttribute + ']'), function (element) {
      element.removeAttribute(highlightAttribute);
    });
    var style = document.getElementById(highlightStyleId);
    if (style) style.remove();
  }

  function highlight(report) {
    clearHighlights();
    var style = document.createElement('style');
    style.id = highlightStyleId;
    style.textContent = '[' + highlightAttribute + '] { outline: 3px solid #e5484d !important; outline-offset: 3px !important; }';
    document.documentElement.appendChild(style);

    (report && report.issues ? report.issues : audit().issues).forEach(function (issue) {
      if (!issue.selector) return;
      var element = document.querySelector(issue.selector);
      if (element) element.setAttribute(highlightAttribute, issue.severity || 'error');
    });
    return { highlighted: document.querySelectorAll('[' + highlightAttribute + ']').length };
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (!message || !message.type) return;
    if (message.type === 'audit') sendResponse(audit());
    if (message.type === 'highlight') sendResponse(highlight(message.report));
    if (message.type === 'clear-highlights') {
      clearHighlights();
      sendResponse({ cleared: true });
    }
    return true;
  });
})();
