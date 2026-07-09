const SCREEN_CLASS_NAMES = [
  'mobile-ui-screen-home',
  'mobile-ui-screen-library',
  'mobile-ui-screen-player',
  'mobile-ui-screen-settings',
  'mobile-ui-screen-plugins',
  'mobile-ui-screen-unknown'
];

const ELEMENT_SELECTORS = {
  sidebar: '#v3-sidebar',
  nav: '#v3-nav',
  topbar: '#v3-topbar',
  main: '#v3-main',
  home: '#v3-home',
  library: '#v3-songs',
  player: '#player',
  highway: '#highway',
  controls: '#player-controls',
  pluginControlsSlot: '#v3-plugin-controls-slot'
};

export function detectScreen() {
  return screenNameFromId(getActiveScreenId());
}

export function getActiveScreenId() {
  return document.querySelector('.screen.active')?.id || null;
}

export function screenNameFromId(screenId) {
  switch (screenId) {
    case 'v3-home':
      return 'home';
    case 'v3-songs':
      return 'library';
    case 'player':
      return 'player';
    case 'settings':
      return 'settings';
    case 'v3-plugins':
      return 'plugins';
    default:
      return 'unknown';
  }
}

export function getScreenClassNames() {
  return SCREEN_CLASS_NAMES.slice();
}

export function getElementPresence() {
  return Object.fromEntries(
    Object.entries(ELEMENT_SELECTORS).map(([key, selector]) => [key, !!document.querySelector(selector)])
  );
}

export function isV3Ui() {
  return window.feedBack?.uiVersion === 'v3' || !!document.getElementById('v3-main');
}
