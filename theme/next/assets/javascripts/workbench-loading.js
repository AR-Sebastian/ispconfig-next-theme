(function(window, document) {
  'use strict';

  function runtime() { return typeof window.workbenchRuntime === 'function' ? window.workbenchRuntime() : null; }
  var legacy = window.ISPConfig;
  var app = runtime();
  if (!legacy || !app || legacy.workbenchLoadingInstalled) return;

  var originalCapp = legacy.capp;
  var content = function() { return document.getElementById('pageContent'); };
  var moduleItems = [];
  var messages = {};
  var moduleTransitionTimer = null;

  try {
    var messageSource = document.getElementById('workbench-content-messages');
    messages = JSON.parse(messageSource ? messageSource.textContent : '{}');
  } catch (error) {
    messages = {};
  }

  function finishModuleTransition() {
    if (moduleTransitionTimer !== null) {
      window.clearTimeout(moduleTransitionTimer);
      moduleTransitionTimer = null;
    }
    document.body.classList.remove('wb-module-transition-active');
    moduleItems.forEach(function(item) {
      item.removeAttribute('aria-busy');
      item.classList.remove('wb-module-transition-source');
      var state = item.querySelector('.wb-module-transition');
      if (state) state.remove();
    });
    moduleItems = [];
  }

  function startModuleTransition(module) {
    finishModuleTransition();
    document.body.classList.add('wb-module-transition-active');
    moduleItems = Array.prototype.filter.call(document.querySelectorAll('[data-capp]'), function(item) {
      return item.getAttribute('data-capp') === String(module);
    });
    moduleItems.forEach(function(item) {
      item.setAttribute('aria-busy', 'true');
      item.classList.add('wb-module-transition-source');
      var state = document.createElement('span');
      state.className = 'wb-module-transition';
      state.setAttribute('role', 'status');
      var sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = messages.module_switching || 'Switching module';
      state.appendChild(sr);
      item.appendChild(state);
    });
    // Match the content-state request timeout so the transition indicator does
    // not disappear while the underlying module request is still active.
    moduleTransitionTimer = window.setTimeout(finishModuleTransition, 30000);
  }

  var moduleRequest = null;

  legacy.capp = function(module, redirect) {
    var api = runtime();
    startModuleTransition(module);
    legacy.workbenchActiveModule = module;
    if (!api || typeof api.requestText !== 'function') return originalCapp.apply(this, arguments);
    if (moduleRequest && moduleRequest.readyState !== 4) moduleRequest.abort();
    try {
      var request = api.requestText('capp.php', {
        query: { mod: module, redirect: redirect === undefined ? null : redirect },
        timeout: 30000
      });
      moduleRequest = request;
      request.promise.then(function(responseText) {
        if (responseText.indexOf('HEADER_REDIRECT:') > -1) {
          api.navigateTo(responseText.split(':')[1]);
        } else if (responseText.indexOf('URL_REDIRECT:') > -1) {
          document.location.href = responseText.substr(responseText.indexOf('URL_REDIRECT:') + 'URL_REDIRECT:'.length);
          return;
        }
        var menus = api.loadMenus({ module: module });
        if (Array.isArray(menus)) {
          Promise.all(menus.map(function(request) { return request.promise.catch(function() {}); })).then(finishModuleTransition);
        } else {
          finishModuleTransition();
        }
      }).catch(function(error) {
        if (!request.aborted && (!error || error.name !== 'AbortError')) {
          finishModuleTransition();
          api.reportError('Module request was not successful. ' + module);
        }
      });
      return request;
    } catch (error) {
      finishModuleTransition();
      throw error;
    }
  };

  document.addEventListener('workbench:navigation-complete', function() {
    if (moduleItems.length) finishModuleTransition();
  });

  legacy.beginRequest = function() {
    if (legacy.options.useLoadIndicator !== true) return;
    legacy.requestsRunning += 1;
    document.body.classList.add('wb-request-active');
    document.body.dataset.wbRequestCount = String(legacy.requestsRunning);
    var region = content();
    if (!region) return;
    region.setAttribute('aria-busy', 'true');
    var status = region.querySelector(':scope > .wb-request-status');
    if (!status) {
      status = document.createElement('div');
      status.className = 'wb-request-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.setAttribute('aria-atomic', 'true');
      status.textContent = 'Processing request';
      region.prepend(status);
    }
  };

  legacy.endRequest = function() {
    legacy.requestsRunning = Math.max(0, legacy.requestsRunning - 1);
    document.body.dataset.wbRequestCount = String(legacy.requestsRunning);
    if (legacy.requestsRunning > 0) return;
    document.body.classList.remove('wb-request-active');
    var region = content();
    if (!region) return;
    region.setAttribute('aria-busy', 'false');
    var status = region.querySelector(':scope > .wb-request-status');
    if (status) status.remove();
  };

  legacy.showLoadIndicator = function() {
    return legacy.beginRequest();
  };

  legacy.hideLoadIndicator = function() {
    return legacy.endRequest();
  };

  legacy.workbenchLoadingInstalled = true;
})(window, document);
