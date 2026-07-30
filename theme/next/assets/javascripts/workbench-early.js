(function(window, document) {
  'use strict';

  try {
    if (window.localStorage && window.localStorage.getItem('ispconfig-workbench-theme') === 'dark') {
      document.documentElement.setAttribute('data-wb-theme', 'dark');
    }
  } catch (error) {
    /* Keep first paint independent from storage availability. */
  }
})(window, document);
