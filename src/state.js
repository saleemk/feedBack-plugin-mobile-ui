export const GLOBAL_KEY = '__feedBackMobileUi';
export const PLUGIN_ID = 'mobile_ui';
export const PLUGIN_VERSION = '0.1.0';

export function createState() {
  return {
    installed: false,
    installedAt: null,
    lastRefreshReason: 'created',
    viewport: null,
    listeners: [],
    refreshTimer: null,
    pendingRefreshReason: null,
    screen: 'unknown',
    safeArea: null
  };
}
