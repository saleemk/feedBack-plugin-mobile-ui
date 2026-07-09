import { DEBUG_STORAGE_KEY, PLUGIN_ID, PLUGIN_VERSION } from './state.js';

export function createDebugOverlay({ state }) {
  let overlay = null;

  return {
    isEnabled,
    setEnabled,
    refresh,
    remove
  };

  function isEnabled() {
    try {
      return window.localStorage.getItem(DEBUG_STORAGE_KEY) === '1';
    } catch (_) {
      return false;
    }
  }

  function setEnabled(value) {
    try {
      if (value) window.localStorage.setItem(DEBUG_STORAGE_KEY, '1');
      else window.localStorage.removeItem(DEBUG_STORAGE_KEY);
    } catch (_) {
      /* private mode */
    }
  }

  function refresh() {
    if (!isEnabled()) {
      remove();
      return;
    }

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-ui-debug-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    const viewport = state.viewport || {};
    overlay.innerHTML = [
      `<strong>${escapeHtml(PLUGIN_ID)} ${escapeHtml(PLUGIN_VERSION)}</strong>`,
      `viewport: ${escapeHtml(viewport.deviceClass || 'unknown')}`,
      `orientation: ${escapeHtml(viewport.orientation || 'unknown')}`,
      `screen: ${escapeHtml(state.screen || 'unknown')}`,
      `v3: ${state.isV3 ? 'true' : 'false'}`,
      `standalone: ${viewport.standalone ? 'true' : 'false'}`,
      `disabled: ${state.disabled ? 'true' : 'false'}`
    ].join('<br>');
  }

  function remove() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}
