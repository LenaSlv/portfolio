(function () {
  var report = null;
  var activeTab = null;
  var elements = {
    audit: document.getElementById('auditButton'),
    highlight: document.getElementById('highlightButton'),
    screenshot: document.getElementById('screenshotButton'),
    bundle: document.getElementById('bundleButton'),
    copy: document.getElementById('copyButton'),
    save: document.getElementById('saveButton'),
    title: document.getElementById('pageTitle'),
    status: document.getElementById('status'),
    dot: document.getElementById('statusDot'),
    metrics: document.getElementById('metrics'),
    issues: document.getElementById('issues')
  };

  function getTab() {
    return chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
      activeTab = tabs[0];
      return activeTab;
    });
  }

  function isRestricted(tab) {
    return !tab || !tab.id || /^(chrome|edge|about|devtools):/i.test(tab.url || '');
  }

  function sendMessage(message) {
    if (!activeTab || isRestricted(activeTab)) return Promise.reject(new Error('Страница недоступна для проверки.'));
    return chrome.tabs.sendMessage(activeTab.id, message).catch(function () {
      return chrome.scripting.executeScript({ target: { tabId: activeTab.id }, files: ['content.js'] }).then(function () {
        return chrome.tabs.sendMessage(activeTab.id, message);
      });
    });
  }

  function setBusy(isBusy) {
    elements.audit.disabled = isBusy;
    elements.highlight.disabled = isBusy;
    elements.screenshot.disabled = isBusy;
    elements.bundle.disabled = isBusy;
    elements.copy.disabled = isBusy || !report;
    elements.save.disabled = isBusy || !report;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function renderReport(nextReport) {
    report = nextReport;
    elements.title.textContent = nextReport.title || nextReport.url;
    elements.metrics.hidden = false;
    elements.metrics.innerHTML = [
      '<div class="metric"><span class="metric__label">Viewport</span><span class="metric__value">' + nextReport.viewport.width + ' × ' + nextReport.viewport.height + '</span></div>',
      '<div class="metric"><span class="metric__label">Документ</span><span class="metric__value">' + nextReport.document.scrollWidth + ' px</span></div>',
      '<div class="metric"><span class="metric__label">Переполнение</span><span class="metric__value">' + nextReport.document.horizontalOverflow + ' px</span></div>',
      '<div class="metric"><span class="metric__label">Изображения</span><span class="metric__value">' + nextReport.counts.brokenImages + ' битых</span></div>'
    ].join('');

    if (!nextReport.issues.length) {
      elements.issues.innerHTML = '<li class="empty">Явных проблем не найдено.</li>';
      elements.status.textContent = 'Проверка завершена.';
      elements.dot.className = 'status-dot is-ok';
    } else {
      elements.issues.innerHTML = nextReport.issues.map(function (issue) {
        return '<li class="issue issue--' + escapeHtml(issue.severity) + '"><span class="issue__title">' + escapeHtml(issue.title) + '</span><span class="issue__detail">' + escapeHtml(issue.detail) + '</span></li>';
      }).join('');
      elements.status.textContent = 'Найдено проблем: ' + nextReport.issues.length + '.';
      elements.dot.className = 'status-dot is-error';
    }
    setBusy(false);
  }

  function audit() {
    setBusy(true);
    elements.status.textContent = 'Проверяю страницу…';
    return getTab().then(function (tab) {
      if (isRestricted(tab)) throw new Error('Эта вкладка недоступна для проверки. Откройте обычную веб-страницу или локальный HTML-файл.');
      return sendMessage({ type: 'audit' });
    }).then(renderReport).catch(function (error) {
      report = null;
      elements.status.textContent = error.message;
      elements.dot.className = 'status-dot is-error';
      elements.metrics.hidden = true;
      elements.issues.innerHTML = '';
      setBusy(false);
    });
  }

  function highlight() {
    if (!report) return audit().then(highlight);
    return sendMessage({ type: 'highlight', report: report }).then(function (result) {
      elements.status.textContent = result.highlighted ? 'Подсвечено элементов: ' + result.highlighted + '.' : 'Элементов для подсветки не найдено.';
    }).catch(function (error) {
      elements.status.textContent = error.message;
    });
  }

  function safeName(value) {
    return (value || 'page').replace(/^https?:\/\//, '').replace(/[^a-z0-9а-яё_-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'page';
  }

  function screenshot() {
    setBusy(true);
    return getTab().then(function (tab) {
      if (isRestricted(tab)) throw new Error('Эта вкладка недоступна для скриншота.');
      return chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
    }).then(function (dataUrl) {
      return chrome.downloads.download({
        url: dataUrl,
        filename: 'portfolio-qa/' + safeName(activeTab.title || activeTab.url) + '-' + Date.now() + '.png',
        saveAs: true
      });
    }).then(function () {
      elements.status.textContent = 'Скриншот сохранён.';
      setBusy(false);
    }).catch(function (error) {
      elements.status.textContent = error.message;
      setBusy(false);
    });
  }

  function bundle() {
    setBusy(true);
    elements.status.textContent = 'Собираю PNG и JSON…';
    var runId = Date.now();
    return getTab().then(function (tab) {
      if (isRestricted(tab)) throw new Error('Эта вкладка недоступна для проверки.');
      return sendMessage({ type: 'audit' });
    }).then(function (nextReport) {
      renderReport(nextReport);
      setBusy(true);
      return chrome.tabs.captureVisibleTab(activeTab.windowId, { format: 'png' }).then(function (dataUrl) {
        var baseName = safeName(activeTab.title || activeTab.url) + '-' + runId;
        var jsonUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(nextReport, null, 2));
        return Promise.all([
          chrome.downloads.download({ url: dataUrl, filename: 'portfolio-qa/' + baseName + '.png', saveAs: false }),
          chrome.downloads.download({ url: jsonUrl, filename: 'portfolio-qa/' + baseName + '.json', saveAs: false }),
          navigator.clipboard.writeText(JSON.stringify(nextReport, null, 2)).catch(function () {})
        ]);
      });
    }).then(function () {
      elements.status.textContent = 'Комплект собран: PNG + JSON. JSON скопирован.';
      setBusy(false);
    }).catch(function (error) {
      elements.status.textContent = error.message;
      setBusy(false);
    });
  }

  function copyReport() {
    if (!report) return;
    navigator.clipboard.writeText(JSON.stringify(report, null, 2)).then(function () {
      elements.status.textContent = 'Отчёт скопирован в буфер обмена.';
    }).catch(function () {
      elements.status.textContent = 'Не удалось скопировать отчёт.';
    });
  }

  function saveReport() {
    if (!report) return;
    var url = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    chrome.downloads.download({
      url: url,
      filename: 'portfolio-qa/' + safeName(activeTab && (activeTab.title || activeTab.url)) + '-' + Date.now() + '.json',
      saveAs: true
    }).then(function () {
      elements.status.textContent = 'JSON-отчёт сохранён.';
    });
  }

  elements.audit.addEventListener('click', audit);
  elements.highlight.addEventListener('click', highlight);
  elements.screenshot.addEventListener('click', screenshot);
  elements.bundle.addEventListener('click', bundle);
  elements.copy.addEventListener('click', copyReport);
  elements.save.addEventListener('click', saveReport);
  audit();
})();
