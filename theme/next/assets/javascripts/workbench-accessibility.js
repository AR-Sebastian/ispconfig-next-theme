(function () {
  'use strict';

  var generatedId = 0;

  function ensureId(element, prefix) {
    if (!element.id) {
      generatedId += 1;
      element.id = prefix + '-' + generatedId;
    }
    return element.id;
  }

  function hasAccessibleName(control) {
    if (control.getAttribute('aria-label') || control.getAttribute('aria-labelledby') || control.title) return true;
    if (control.id && document.querySelector('label[for="' + CSS.escape(control.id) + '"]')) return true;
    return Boolean(control.closest('label'));
  }

  function enhanceTable(table) {
    if (!table.querySelector('caption') && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
      var heading = table.closest('#pageContent, .dashlet')?.querySelector('.page-header h1, .fieldset-legend, h1, h2');
      if (heading && heading.textContent.trim()) {
        var caption = document.createElement('caption');
        caption.className = 'wb-visually-hidden';
        caption.textContent = heading.textContent.trim();
        table.prepend(caption);
      }
    }

    table.querySelectorAll('thead th').forEach(function (header) {
      if (!header.hasAttribute('scope')) header.setAttribute('scope', 'col');
    });

    table.querySelectorAll('thead input, thead select, thead textarea').forEach(function (control) {
      if (hasAccessibleName(control)) return;
      var cell = control.closest('th, td');
      var firstRow = table.tHead && table.tHead.rows[0];
      var header = cell && firstRow && firstRow.cells[cell.cellIndex];
      var text = header && header.textContent.trim();
      if (text) control.setAttribute('aria-label', text);
    });

    table.querySelectorAll('.tbl_row_noresults').forEach(function (row) {
      if (!row.hasAttribute('role')) row.setAttribute('role', 'status');
    });
  }

  function enhanceFormGroup(group) {
    var label = group.querySelector(':scope > label.control-label');
    var controls = Array.from(group.querySelectorAll('input:not([type="hidden"]), select, textarea'));
    if (label && controls.length === 1 && !hasAccessibleName(controls[0])) {
      label.htmlFor = ensureId(controls[0], 'wb-field');
    } else if (label && controls.length > 1) {
      var labelId = ensureId(label, 'wb-group-label');
      controls.forEach(function (control) {
        if (!hasAccessibleName(control)) control.setAttribute('aria-labelledby', labelId);
      });
    }

    if (group.classList.contains('has-error')) {
      var error = group.querySelector('.help-block, .error, [role="alert"]');
      controls.forEach(function (control) {
        control.setAttribute('aria-invalid', 'true');
        if (error) {
          var errorId = ensureId(error, 'wb-field-error');
          var describedBy = (control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
          if (!describedBy.includes(errorId)) describedBy.push(errorId);
          control.setAttribute('aria-describedby', describedBy.join(' '));
        }
      });
    }
  }

  function dialogFocusable(dialog) {
    return Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter(function (element) { return element.offsetParent !== null; });
  }

  function focusDialog(dialog) {
    if (!dialog || dialog.hidden || dialog.getAttribute('aria-hidden') === 'true') return false;
    var focusable = dialogFocusable(dialog);
    (focusable[0] || dialog).focus();
    return dialog.contains(document.activeElement);
  }

  function restoreDialogFocus(dialog) {
    if (!dialog) return false;
    var trigger = dialog.workbenchDialogTrigger || document.querySelector('[aria-controls="' + CSS.escape(dialog.id) + '"]');
    if (!trigger) return false;
    trigger.setAttribute('aria-expanded', 'false');
    if (document.contains(trigger)) trigger.focus();
    dialog.workbenchDialogTrigger = null;
    return document.activeElement === trigger;
  }

  function enhanceDialog(dialog) {
    if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
    if (!dialog.hasAttribute('aria-modal')) dialog.setAttribute('aria-modal', 'true');
    if (!dialog.getAttribute('aria-label') && !dialog.getAttribute('aria-labelledby')) {
      var title = dialog.querySelector('.modal-title, h1, h2, h3, h4');
      if (title) dialog.setAttribute('aria-labelledby', ensureId(title, 'wb-dialog-title'));
    }
    if (dialog.dataset.workbenchFocusTrap !== 'true') {
      dialog.dataset.workbenchFocusTrap = 'true';
      dialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && window.workbenchDialog) {
          event.preventDefault();
          event.stopPropagation();
          window.workbenchDialog.close(dialog, true);
          return;
        }
        if (event.key !== 'Tab') return;
        var focusable = dialogFocusable(dialog);
        if (!focusable.length) {
          event.preventDefault();
          dialog.focus();
          return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    }
    if (dialog.dataset.workbenchDialogEvents !== 'true') {
      dialog.dataset.workbenchDialogEvents = 'true';
      dialog.addEventListener('workbench:dialog-open', function () { focusDialog(dialog); });
      dialog.addEventListener('workbench:dialog-close', function () { restoreDialogFocus(dialog); });
    }
  }

  function enhance(root) {
    var host = root && root.querySelectorAll ? root : document;
    if (host.matches && host.matches('table')) enhanceTable(host);
    host.querySelectorAll('table').forEach(enhanceTable);
    if (host.matches && host.matches('.form-group')) enhanceFormGroup(host);
    host.querySelectorAll('.form-group').forEach(enhanceFormGroup);
    if (host.matches && host.matches('.modal[role="dialog"]')) enhanceDialog(host);
    host.querySelectorAll('.modal[role="dialog"]').forEach(enhanceDialog);
  }

  document.addEventListener('workbench:navigation-complete', function () {
    enhance(document.querySelector('#pageContent'));
    window.setTimeout(function () { enhance(document.querySelector('#pageContent')); }, 100);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { enhance(document); }, { once: true });
  } else {
    enhance(document);
  }

  window.workbenchAccessibility = { enhance: enhance, focusDialog: focusDialog, restoreDialogFocus: restoreDialogFocus };
  window.workbenchAccessibilityInstalled = true;
}());
