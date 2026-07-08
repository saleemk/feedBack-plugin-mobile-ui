import { detectScreen } from './dom.js';
import { PLUGIN_ID, PLUGIN_VERSION } from './state.js';

export function createDiagnostics({ state, getViewport, getMountedFeatures }) {
  return {
    snapshot() {
      state.screen = detectScreen();

      return {
        id: PLUGIN_ID,
        version: PLUGIN_VERSION,
        installed: state.installed,
        installedAt: state.installedAt,
        lastRefreshReason: state.lastRefreshReason,
        viewport: getViewport(),
        rootClasses: [...document.documentElement.classList].filter((name) => name.startsWith('mobile-ui-')),
        mountedFeatures: getMountedFeatures(),
        location: {
          href: window.location.href,
          path: window.location.pathname,
          hash: window.location.hash
        },
        screen: state.screen,
        safeArea: state.safeArea
      };
    }
  };
}
