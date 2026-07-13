// Preflight: hide old core navigation immediately on touch devices if
// Mobile UI is enabled, so there is no flash of the sidebar/hamburger
// before the main runtime initialises.  The preboot class is cleaned up
// once the real bottom-nav classes are in place.
(function () {
  var disabled = false;
  try { disabled = localStorage.getItem('mobile_ui.disabled') === 'true'; } catch (_) { /* private mode */ }
  if (!disabled) {
    var w = window.innerWidth || document.documentElement.clientWidth || 0;
    if (w > 0 && w <= 1024) {
      document.documentElement.classList.add('mobile-ui-preboot-touch-nav');
    }
  }
})();

import('./src/main.js');