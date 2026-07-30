(function () {
  'use strict';

  var storageKey = 'ispconfig-workbench-login-username';
  var stayStorageKey = 'ispconfig-workbench-login-stay';

  function getStorage() {
    try {
      var testKey = storageKey + '-test';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch (error) {
      return null;
    }
  }

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function localizeThemeCopy() {
    var username = document.getElementById('username');
    var login = document.querySelector('.wb-auth-actions input[type="submit"]');
    var languageProbe = ((username && username.getAttribute('placeholder')) || '') + ' ' + ((login && login.value) || '');
    var language = /benutzer|anmeld|passwort/i.test(languageProbe) ? 'de' : 'en';
    var copy = {
      de: {
        hero_kicker: 'Sicherer Zugang',
        hero_title: 'Deine Server.<br>Ein klarer<br>Einstieg.',
        hero_intro: 'Ein moderner, fokussierter Einstieg in deine zentrale Serververwaltung.',
        hero_service: 'Zentrale Verwaltung deiner Dienste',
        hero_security: 'Geschützte Anmeldung mit Zwei-Faktor-Prüfung',
        hero_responsive: 'Optimiert für Desktop, Tablet und Smartphone',
        hero_footer: 'ISPConfig NEXT · sichere Serververwaltung',
        welcome: 'Willkommen zurück',
        login_intro: 'Melde dich sicher an deiner Serververwaltung an.',
        security_label: 'Sicherheitshinweis',
        security_note: 'Zugangsdaten werden nur an diese ISPConfig-Instanz übertragen.',
        remember_username: 'Benutzername merken',
        remember_hint: 'Auf diesem Gerät wird nur der Benutzername gespeichert.',
        password_manager: 'Dein Passwortmanager kann das Passwort sicher speichern.',
        theme_toggle: 'Darstellung wechseln'
      },
      en: {
        hero_kicker: 'Secure access',
        hero_title: 'Your servers.<br>One clear<br>entry point.',
        hero_intro: 'A modern, focused entry point for your central server administration.',
        hero_service: 'Central administration of your services',
        hero_security: 'Protected sign-in with two-factor authentication',
        hero_responsive: 'Optimized for desktop, tablet and smartphone',
        hero_footer: 'ISPConfig NEXT · secure server administration',
        welcome: 'Welcome back',
        login_intro: 'Sign in securely to your server administration.',
        security_label: 'Security notice',
        security_note: 'Credentials are transmitted only to this ISPConfig instance.',
        remember_username: 'Remember username',
        remember_hint: 'Only the username is stored on this device.',
        password_manager: 'Your password manager can securely store the password.',
        theme_toggle: 'Change appearance'
      }
    }[language];

    document.documentElement.lang = language;
    Array.prototype.forEach.call(document.querySelectorAll('[data-wb-i18n]'), function(node) {
      var key = node.getAttribute('data-wb-i18n');
      if (!Object.prototype.hasOwnProperty.call(copy, key)) return;
      if (key === 'hero_title') node.innerHTML = copy[key];
      else node.textContent = copy[key];
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-wb-i18n-aria-label]'), function(node) {
      var key = node.getAttribute('data-wb-i18n-aria-label');
      if (Object.prototype.hasOwnProperty.call(copy, key)) node.setAttribute('aria-label', copy[key]);
    });
  }

  function normalizeFeedback() {
    var surface = document.querySelector('.wb-login-form-surface');
    if (!surface) return;

    var nodes = surface.querySelectorAll('.alert, .box_error, .box_warning, .box_success, .box_info');
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.dataset.wbLoginFeedbackNormalized === 'true') return;
      var text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) return;

      node.dataset.wbLoginFeedbackNormalized = 'true';
      node.classList.add('wb-login-feedback-normalized');
      if (!node.getAttribute('role')) node.setAttribute('role', 'alert');
      if (!node.getAttribute('aria-live')) node.setAttribute('aria-live', 'polite');

      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }

      var message = document.createElement('span');
      message.className = 'wb-login-feedback-text';
      message.textContent = text;
      node.appendChild(message);
    });
  }

  function observeFeedback() {
    var surface = document.querySelector('.wb-login-form-surface');
    if (!surface || !('MutationObserver' in window)) return;

    var pending = false;
    var observer = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () {
        pending = false;
        normalizeFeedback();
      });
    });

    observer.observe(surface, { childList: true, subtree: true });
  }

  ready(function () {
    var storage = getStorage();
    var form = document.querySelector('.wb-login-form-surface form');
    var username = document.getElementById('username');
    var remember = document.getElementById('remember_username');
    var stay = document.getElementById('stay');
    var card = document.querySelector('.wb-login-card');

    localizeThemeCopy();
    normalizeFeedback();
    observeFeedback();

    document.addEventListener('click', function (event) {
      var control = event.target && event.target.closest ? event.target.closest('[data-login-navigate]') : null;
      if (!control) return;
      var target = control.getAttribute('data-login-navigate');
      if (!target) return;
      event.preventDefault();
      window.location.href = target;
    });

    if (!form || !username || !storage) {
      return;
    }

    var rememberedUsername = storage.getItem(storageKey);
    if (rememberedUsername && !username.value) {
      username.value = rememberedUsername;
      if (remember) remember.checked = true;
      if (card) {
        card.setAttribute('data-wb-remembered-user', 'true');
      }
    }

    if (stay && storage.getItem(stayStorageKey) === '1') {
      stay.checked = true;
    }

    username.addEventListener('input', function () {
      if (card) {
        card.removeAttribute('data-wb-remembered-user');
      }
    });

    form.addEventListener('submit', function () {
      var value = (username.value || '').trim();
      if (remember && remember.checked && value) {
        storage.setItem(storageKey, value);
      } else {
        storage.removeItem(storageKey);
      }

      if (stay && stay.checked) {
        storage.setItem(stayStorageKey, '1');
      } else {
        storage.removeItem(stayStorageKey);
      }
    });
  });
}());
