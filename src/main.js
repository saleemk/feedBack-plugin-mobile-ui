import { createDiagnostics } from './diagnostics.js';
import { createDebugOverlay } from './debug.js';
import { createLifecycle } from './lifecycle.js';
import { detectScreen, getActiveScreenId, getScreenClassNames, isV3Ui } from './dom.js';
import {
  createState,
  DEBUG_STORAGE_KEY,
  DISABLED_STORAGE_KEY,
  GLOBAL_KEY,
  PLUGIN_ID,
  PLUGIN_VERSION
} from './state.js';
import { getViewportInfo } from './viewport.js';

import { createFeature as createShellFeature } from './shell.js';
import { createFeature as createHomeFeature } from './home.js';
import { createFeature as createLibraryFeature } from './library.js';
import { createFeature as createPlayerFeature } from './player.js';
import { createFeature as createPluginsFeature } from './plugins.js';
import { createFeature as createHighwayFeature } from './highway.js';
import { createFeature as createGesturesFeature } from './gestures.js';
import { createFeature as createSafeAreaFeature } from './safe-area.js';

const ROOT_CLASSES = [
  'mobile-ui-enabled',
  'mobile-ui-phone',
  'mobile-ui-tablet',
  'mobile-ui-desktop',
  'mobile-ui-standalone',
  'mobile-ui-landscape',
  'mobile-ui-portrait',
  'mobile-ui-v3',
  'mobile-ui-disabled',
  'mobile-ui-player-more-shelf-mode',
  'mobile-ui-player-tablet-direct-controls-mode',
  ...getScreenClassNames()
];

const reportedFeatureErrors = new Set();

const existingRuntime = window[GLOBAL_KEY];

if (existingRuntime?.installed) {
  existingRuntime.refresh?.('module-reloaded');
} else {
  const runtime = createRuntime();
  window[GLOBAL_KEY] = runtime;
  runtime.install();
}

function createRuntime() {
  const state = createState();
  const lifecycle = createLifecycle([
    createShellFeature(),
    createHomeFeature(),
    createLibraryFeature(),
    createPluginsFeature(),
    createPlayerFeature(),
    createHighwayFeature(),
    createGesturesFeature(),
    createSafeAreaFeature()
  ], { reportError: reportFeatureError });
  const debugOverlay = createDebugOverlay({ state });

  const diagnostics = createDiagnostics({
    state,
    getViewport: () => state.viewport,
    getMountedFeatures: () => lifecycle.getMountedFeatureNames()
  });

  const runtime = {
    id: PLUGIN_ID,
    version: PLUGIN_VERSION,
    installed: false,
    installedAt: null,
    refresh,
    destroy,
    snapshot: diagnostics.snapshot,
    disable,
    enable,
    isDisabled,
    enableDebug,
    disableDebug,
    toggleDebug
  };

  function install() {
    if (runtime.installed) {
      refresh('install-already-mounted');
      return;
    }

    runtime.installed = true;
    runtime.installedAt = new Date().toISOString();
    state.installed = true;
    state.installedAt = runtime.installedAt;

    // Mount features before the first full refresh so feature boundaries exist
    // for diagnostics immediately; the install refresh below supplies current
    // viewport/screen state and lets features settle into their active modes.
    lifecycle.mount(getContext('install'));
    addListeners();
    refresh('install');

    console.info('[mobile_ui] loaded', runtime.snapshot());
  }

  function refresh(reason = 'manual') {
    state.lastRefreshReason = reason;
    state.viewport = getViewportInfo();
    state.disabled = isDisabled();
    state.debug = isDebugEnabled();
    state.uiVersion = window.feedBack?.uiVersion || null;
    state.isV3 = isV3Ui();
    state.screenId = getActiveScreenId();
    state.screen = detectScreen();

    applyRootClasses(state);
    lifecycle.refresh(getContext(reason));
    debugOverlay.refresh(getContext(reason));
    return runtime.snapshot();
  }

  function destroy() {
    clearRefreshTimer();
    removeListeners();
    lifecycle.unmount();
    debugOverlay.remove();
    removeRootClasses();

    runtime.installed = false;
    state.installed = false;
    state.lastRefreshReason = 'destroy';

    return runtime.snapshot();
  }

  function getContext(reason) {
    return {
      runtime,
      state,
      reason,
      viewport: state.viewport,
      refresh
    };
  }

  function disable() {
    setStorageFlag(DISABLED_STORAGE_KEY, true);
    return refresh('disable');
  }

  function enable() {
    setStorageFlag(DISABLED_STORAGE_KEY, false);
    return refresh('enable');
  }

  function isDisabled() {
    return readStorageFlag(DISABLED_STORAGE_KEY);
  }

  function enableDebug() {
    debugOverlay.setEnabled(true);
    return refresh('enable-debug');
  }

  function disableDebug() {
    debugOverlay.setEnabled(false);
    return refresh('disable-debug');
  }

  function toggleDebug() {
    debugOverlay.setEnabled(!debugOverlay.isEnabled());
    return refresh('toggle-debug');
  }

  function isDebugEnabled() {
    return readStorageFlag(DEBUG_STORAGE_KEY);
  }

  function addListeners() {
    if (state.listeners.length) return;

    state.listeners.push(addWindowListener('resize', () => queueRefresh('resize')));
    state.listeners.push(addWindowListener('orientationchange', () => queueRefresh('orientationchange')));
    state.listeners.push(addFeedBackListener('screen:changed', () => queueRefresh('screen:changed')));

    if (window.visualViewport?.addEventListener) {
      const handler = () => queueRefresh('visualViewport.resize');
      window.visualViewport.addEventListener('resize', handler, { passive: true });
      state.listeners.push(() => window.visualViewport.removeEventListener('resize', handler));
    }
  }

  function removeListeners() {
    state.listeners.splice(0).forEach((remove) => remove());
  }

  function queueRefresh(reason) {
    state.pendingRefreshReason = reason;
    clearRefreshTimer();
    state.refreshTimer = window.setTimeout(() => {
      const queuedReason = state.pendingRefreshReason || reason;
      state.refreshTimer = null;
      state.pendingRefreshReason = null;
      refresh(queuedReason);
    }, 80);
  }

  function clearRefreshTimer() {
    if (state.refreshTimer) {
      window.clearTimeout(state.refreshTimer);
      state.refreshTimer = null;
    }
  }

  function addWindowListener(type, handler) {
    window.addEventListener(type, handler, { passive: true });
    return () => window.removeEventListener(type, handler);
  }

  function addFeedBackListener(type, handler) {
    const bus = window.feedBack;
    if (!bus || typeof bus.on !== 'function' || typeof bus.off !== 'function') return () => {};

    bus.on(type, handler);
    return () => bus.off(type, handler);
  }

  function reportFeatureError(phase, featureName, error) {
    if (!isDebugEnabled()) return;
    const key = `${phase}:${featureName}`;
    if (reportedFeatureErrors.has(key)) return;
    reportedFeatureErrors.add(key);
    console.warn('[mobile_ui] feature lifecycle error', {
      phase,
      feature: featureName,
      error
    });
  }

  runtime.install = install;
  return runtime;
}

function applyRootClasses(state) {
  const root = document.documentElement;
  removeRootClasses();

  if (state.disabled) {
    root.classList.add('mobile-ui-disabled');
    return;
  }

  const viewport = state.viewport;
  root.classList.add('mobile-ui-enabled');
  root.classList.add(`mobile-ui-${viewport.deviceClass}`);
  root.classList.add(viewport.orientation === 'landscape' ? 'mobile-ui-landscape' : 'mobile-ui-portrait');
  root.classList.add(`mobile-ui-screen-${state.screen || 'unknown'}`);

  if (viewport.standalone) {
    root.classList.add('mobile-ui-standalone');
  }

  if (state.isV3) {
    root.classList.add('mobile-ui-v3');
  }
}

function removeRootClasses() {
  document.documentElement.classList.remove(...ROOT_CLASSES);
}

function readStorageFlag(key) {
  try {
    return window.localStorage.getItem(key) === '1';
  } catch (_) {
    return false;
  }
}

function setStorageFlag(key, value) {
  try {
    if (value) window.localStorage.setItem(key, '1');
    else window.localStorage.removeItem(key);
  } catch (_) {
    /* private mode */
  }
}
