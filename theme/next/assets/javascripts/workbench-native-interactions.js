(function () {
  'use strict';

  function emitNative(element, name, detail, cancelable) {
    if (!element) return false;
    return element.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      cancelable: cancelable === true,
      detail: detail || {}
    }));
  }

  function selectorFor(trigger) {
    var value = trigger && (trigger.getAttribute('data-target') || trigger.getAttribute('href')) || '';
    var hash = value.indexOf('#');
    return hash >= 0 ? value.slice(hash) : '';
  }

  function triggersFor(target) {
    if (!target || !target.id) return [];
    return Array.from(document.querySelectorAll('[data-workbench-collapse]')).filter(function (trigger) {
      return selectorFor(trigger) === '#' + target.id;
    });
  }

  function updateTriggers(target, expanded) {
    triggersFor(target).forEach(function (trigger) {
      trigger.classList.toggle('collapsed', !expanded);
      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (!trigger.getAttribute('aria-controls') && target.id) trigger.setAttribute('aria-controls', target.id);
    });
  }

  function setCollapse(target, expanded, relatedTarget) {
    if (!target) return false;
    var current = target.classList.contains('in');
    var detail = { expanded: expanded, relatedTarget: relatedTarget || null };
    if (current === expanded) {
      target.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      updateTriggers(target, expanded);
      return true;
    }
    if (!emitNative(target, expanded ? 'workbench:collapse-before-open' : 'workbench:collapse-before-close', detail, true)) return false;
    target.classList.toggle('in', expanded);
    target.hidden = !expanded;
    target.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    updateTriggers(target, expanded);
    emitNative(target, expanded ? 'workbench:collapse-open' : 'workbench:collapse-close', detail, false);
    return true;
  }

  function closeAccordionPeers(trigger, target) {
    var parentSelector = trigger.getAttribute('data-parent');
    if (!parentSelector) return;
    var parent;
    try { parent = document.querySelector(parentSelector); } catch (error) { parent = null; }
    if (!parent) return;
    parent.querySelectorAll('.collapse.in, .wb-collapse.in').forEach(function (peer) {
      if (peer !== target) setCollapse(peer, false, trigger);
    });
  }

  function toggleCollapse(trigger) {
    var selector = selectorFor(trigger);
    var target;
    try { target = selector ? document.querySelector(selector) : null; } catch (error) { target = null; }
    if (!target) return false;
    var expanded = !target.classList.contains('in');
    if (expanded) closeAccordionPeers(trigger, target);
    return setCollapse(target, expanded, trigger);
  }

  function dismissAlert(control) {
    var alert = control && control.closest('.alert');
    var detail = { relatedTarget: control || null };
    if (!alert) return false;
    if (!emitNative(alert, 'workbench:alert-before-dismiss', detail, true)) return false;
    alert.remove();
    emitNative(alert, 'workbench:alert-dismiss', detail, false);
    return true;
  }

  function setModal(element, visible, relatedTarget) {
    if (!element || element.getAttribute('role') !== 'dialog' || !window.workbenchDialog) return false;
    return visible ? window.workbenchDialog.open(element, relatedTarget) : window.workbenchDialog.close(element, true);
  }

  function initializeTooltip(element, action) {
    if (!element) return false;
    if (action === 'destroy') {
      delete element.dataset.workbenchNativeTooltip;
      return true;
    }
    var title = element.getAttribute('data-original-title') || element.getAttribute('title') || action && action.title;
    if (title && !element.getAttribute('title')) element.setAttribute('title', title);
    element.dataset.workbenchNativeTooltip = 'true';
    return true;
  }

  function synchronize(root) {
    var host = root && root.querySelectorAll ? root : document;
    host.querySelectorAll('[data-dismiss="alert"], [data-bs-dismiss="alert"]').forEach(function (trigger) {
      trigger.setAttribute('data-workbench-dismiss', 'alert');
      trigger.removeAttribute('data-dismiss');
      trigger.removeAttribute('data-bs-dismiss');
    });
    host.querySelectorAll('[data-workbench-tooltip]').forEach(function (element) {
      initializeTooltip(element);
    });
    host.querySelectorAll('.collapse, .wb-collapse').forEach(function (target) {
      var expanded = target.classList.contains('in');
      target.hidden = !expanded;
      target.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      updateTriggers(target, expanded);
    });
  }

  document.addEventListener('click', function (event) {
    var alertControl = event.target.closest('[data-workbench-dismiss="alert"]');
    if (alertControl) {
      event.preventDefault();
      dismissAlert(alertControl);
      return;
    }
    var collapseControl = event.target.closest('[data-workbench-collapse]');
    if (collapseControl) {
      event.preventDefault();
      toggleCollapse(collapseControl);
    }
  });

  document.addEventListener('workbench:navigation-complete', function (event) {
    synchronize(event.detail && event.detail.container || document.getElementById('pageContent'));
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { synchronize(document); }, { once: true });
  } else {
    synchronize(document);
  }

  window.workbenchInteractions = {
    collapse: setCollapse,
    toggleCollapse: toggleCollapse,
    dismissAlert: dismissAlert,
    modal: setModal,
    tooltip: initializeTooltip,
    synchronize: synchronize
  };
  window.workbenchInteractionsInstalled = true;
}());
