(function (window, document) {
  'use strict';

  if (window.workbenchFeedbackInstalled) return;

  var icons = {
    success: '<path d="m5 12 4 4L19 6"/>',
    danger: '<path d="M12 8v5M12 17h.01"/><path d="M10.3 3.8 2.7 18a2 2 0 0 0 1.8 3h15a2 2 0 0 0 1.8-3L13.7 3.8a2 2 0 0 0-3.4 0Z"/>',
    warning: '<path d="M12 8v5M12 17h.01"/><path d="M10.3 3.8 2.7 18a2 2 0 0 0 1.8 3h15a2 2 0 0 0 1.8-3L13.7 3.8a2 2 0 0 0-3.4 0Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>'
  };

  function svgFromMarkup(markup) {
    var parsed = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false">' + markup + '</svg>', 'image/svg+xml');
    var svg = document.importNode(parsed.documentElement, true);
    svg.setAttribute('aria-hidden', 'true');
    return svg;
  }

  function tone(alert) {
    if (alert.classList.contains('alert-success')) return 'success';
    if (alert.classList.contains('alert-danger')) return 'danger';
    if (alert.classList.contains('alert-warning')) return 'warning';
    return 'info';
  }

  function localized(german, english) {
    var language = typeof window.workbenchLanguage === 'function' ? window.workbenchLanguage() : (document.documentElement.lang || '');
    return String(language).toLowerCase().indexOf('de') === 0 ? german : english;
  }

  function structureContent(alert) {
    var content = alert.querySelector(':scope > .wb-feedback__content');
    if (content) return content;
    content = document.createElement('div');
    content.className = 'wb-feedback__content';
    Array.prototype.slice.call(alert.childNodes).forEach(function(node) {
      if (node.nodeType === 1 && node.matches('.close, [data-workbench-dismiss], .wb-feedback__icon')) return;
      content.appendChild(node);
    });
    alert.appendChild(content);
    return content;
  }

  function enhanceAlert(alert) {
    if (alert.dataset.workbenchFeedback === 'true') return;
    if (alert.closest && alert.closest('.wb-login-form-surface')) return;
    var state = tone(alert);
    alert.dataset.workbenchFeedback = 'true';
    alert.dataset.workbenchTone = state;
    alert.classList.add('wb-feedback');
    alert.setAttribute('role', state === 'danger' || state === 'warning' ? 'alert' : 'status');
    alert.setAttribute('aria-live', state === 'danger' || state === 'warning' ? 'assertive' : 'polite');
    alert.setAttribute('aria-atomic', 'true');
    structureContent(alert);
    var icon = document.createElement('span');
    icon.className = 'wb-feedback__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.appendChild(svgFromMarkup(icons[state]));
    alert.prepend(icon);
    var dismiss = alert.querySelector(':scope > .close, :scope > [data-workbench-dismiss]');
    if (dismiss) {
      if (dismiss.tagName === 'BUTTON' && !dismiss.getAttribute('type')) dismiss.setAttribute('type', 'button');
      if (!dismiss.getAttribute('aria-label') || /^(?:close|schlie(?:ß|ss)en)$/i.test(dismiss.getAttribute('aria-label'))) {
        dismiss.setAttribute('aria-label', localized('Schließen', 'Close'));
      }
      dismiss.setAttribute('title', localized('Meldung schließen', 'Dismiss notification'));
    }
  }

  function enhanceDialog(dialog) {
    dialog.classList.add('wb-dialog--enhanced');
    var list = dialog.querySelector('.wb-dialog__body > ul');
    if (list) {
      list.classList.add('wb-dialog__activity-list');
      Array.prototype.forEach.call(list.children, function (item) { item.classList.add('wb-dialog__activity-item'); });
    }
  }

  function enhance(root) {
    var host = root && root.querySelectorAll ? root : document;
    if (host.matches && host.matches('.alert')) enhanceAlert(host);
    Array.prototype.forEach.call(host.querySelectorAll('.alert'), enhanceAlert);
    if (host.matches && host.matches('.wb-dialog')) enhanceDialog(host);
    Array.prototype.forEach.call(host.querySelectorAll('.wb-dialog'), enhanceDialog);
  }

  function show(message, state) {
    var text = String(message || '').trim();
    if (!text) return null;
    var host = document.getElementById('pageContent');
    if (!host) return null;
    var stack = host.querySelector(':scope > .wb-feedback-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'wb-feedback-stack';
      stack.setAttribute('aria-label', localized('Meldungen', 'Notifications'));
      host.prepend(stack);
    }

    var toneName = ['success', 'danger', 'warning', 'info'].indexOf(state) > -1 ? state : 'info';
    var alert = document.createElement('div');
    alert.className = 'alert alert-' + toneName;
    alert.setAttribute('data-workbench-generated-feedback', 'true');
    var content = document.createElement('p');
    content.textContent = text;
    var dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'close';
    dismiss.setAttribute('data-workbench-dismiss', 'alert');
    dismiss.setAttribute('aria-label', localized('Schließen', 'Close'));
    dismiss.textContent = '×';
    alert.appendChild(content);
    alert.appendChild(dismiss);
    stack.prepend(alert);
    enhanceAlert(alert);

    Array.prototype.slice.call(stack.querySelectorAll('[data-workbench-generated-feedback]')).slice(3).forEach(function(oldAlert) {
      oldAlert.remove();
    });
    return alert;
  }

  function start() {
    enhance(document);
    var page = document.getElementById('pageContent');
    if (page && window.MutationObserver) {
      new MutationObserver(function (records) {
        records.forEach(function (record) {
          Array.prototype.forEach.call(record.addedNodes, function (node) {
            if (node.nodeType === 1) enhance(node);
          });
        });
      }).observe(page, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();

  window.workbenchFeedback = { enhance: enhance, show: show };
  window.workbenchFeedbackInstalled = true;
}(window, document));
