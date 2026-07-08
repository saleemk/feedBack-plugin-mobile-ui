import { createDiagnostics } from './diagnostics.js';
import { createLifecycle } from './lifecycle.js';
import { createState, GLOBAL_KEY, PLUGIN_ID, PLUGIN_VERSION } from './state.js';
import { getViewportInfo } from './viewport.js';

import { createFeature as createShellFeature } from './shell.js';
import { createFeature as createHomeFeature } from './home.js';
import { createFeature as createLibraryFeature } from './library.js';
import { createFeature as createPlayerFeature } from './player.js';
import { createFeature as createHighwayFeature } from './highway.js';
import { createFeature as createSafeAreaFeature } from './safe-area.js';

const ROOT_CLASSES = [
  'mobile-ui-enabled',
  'mobile-ui-phone',
  'mobile-ui-tablet',
  'mobile-ui-desktop',
  'mobile-ui-standalone',
  'mobile-ui-landscape',
  'mobile-ui-portrait'
];

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
    createPlayerFeature(),
    createHighwayFeature(),
    createSafeAreaFeature()
  ]);

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
    snapshot: diagnostics.snapshot
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

    lifecycle.mount(getContext('install'));
    addListeners();
    refresh('install');

    console.info('[mobile_ui] loaded', runtime.snapshot());
  }

  function refresh(reason = 'manual') {
    state.lastRefreshReason = reason;
    state.viewport = getViewportInfo();
    applyRootClasses(state.viewport);
    lifecycle.refresh(getContext(reason));
    return runtime.snapshot();
  }

  function destroy() {
    clearRefreshTimer();
    removeListeners();
    lifecycle.unmount();
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

  function addListeners() {
    if (state.listeners.length) return;

    state.listeners.push(addWindowListener('resize', () => queueRefresh('resize')));
    state.listeners.push(addWindowListener('orientationchange', () => queueRefresh('orientationchange')));

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

  runtime.install = install;
  return runtime;
}

function applyRootClasses(viewport) {
  const root = document.documentElement;
  removeRootClasses();

  root.classList.add('mobile-ui-enabled');
  root.classList.add(`mobile-ui-${viewport.deviceClass}`);
  root.classList.add(viewport.orientation === 'landscape' ? 'mobile-ui-landscape' : 'mobile-ui-portrait');

  if (viewport.standalone) {
    root.classList.add('mobile-ui-standalone');
  }
}

function removeRootClasses() {
  document.documentElement.classList.remove(...ROOT_CLASSES);
}
