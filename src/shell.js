export function createFeature() {
  let statusRow = null;
  let statusRail = null;
  let bottomNav = null;

  return {
    name: 'shell',
    mount(ctx) {
      refresh(ctx);
    },
    refresh,
    unmount
  };

  function refresh(ctx) {
    clearStatusClasses();
    if (_shouldShowBottomNav(ctx?.state)) {
      _ensureBottomNav();
    } else {
      _removeBottomNav();
    }

    if (ctx?.state?.disabled || !ctx?.state?.isV3) return;

    const tuner = document.getElementById('v3-badge-tuner');
    const instrument = document.getElementById('v3-badge-instrument');
    const profile = document.getElementById('v3-badge-profile');
    if (!tuner || !instrument || !profile) return;

    const rail = tuner.parentElement;
    if (!rail || instrument.parentElement !== rail || profile.parentElement !== rail) return;

    const row = rail.parentElement;
    if (!row) return;

    statusRail = rail;
    statusRow = row;
    statusRail.classList.add('mobile-ui-topbar-status-rail');
    statusRow.classList.add('mobile-ui-topbar-status-row');
  }

  function unmount() {
    clearStatusClasses();
    _removeBottomNav();
  }

  function clearStatusClasses() {
    if (statusRail) statusRail.classList.remove('mobile-ui-topbar-status-rail');
    if (statusRow) statusRow.classList.remove('mobile-ui-topbar-status-row');

    document.querySelectorAll('.mobile-ui-topbar-status-rail')
      .forEach((el) => el.classList.remove('mobile-ui-topbar-status-rail'));
    document.querySelectorAll('.mobile-ui-topbar-status-row')
      .forEach((el) => el.classList.remove('mobile-ui-topbar-status-row'));

    statusRail = null;
    statusRow = null;
  }

  function _shouldShowBottomNav(state) {
    if (state?.disabled || !state?.isV3 || state?.screen === 'player') return false;
    const vp = state?.viewport;
    return !!(vp && vp.deviceClass === 'phone' && vp.isPortrait);
  }

  // --- Bottom navigation bar -----------------------------------------------

  function _ensureBottomNav() {
    if (bottomNav && bottomNav.isConnected) return;

    const nav = document.createElement('nav');
    nav.className = 'mobile-ui-bottom-nav';
    nav.setAttribute('aria-label', 'Primary mobile navigation');

    const items = [
      { key: 'home', label: 'Home', screen: 'v3-home' },
      { key: 'library', label: 'Library', screen: 'v3-songs' },
      { key: 'progress', label: 'Progress', screen: 'v3-progress' },
      { key: 'plugins', label: 'Plugins', screen: 'v3-plugins' },
      { key: 'more', label: 'More', screen: null }
    ];

    for (const item of items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mobile-ui-bottom-nav-item';
      btn.setAttribute('data-mobile-ui-bottom-nav', item.key);
      btn.setAttribute('aria-label', item.label);
      btn.textContent = item.label;

      btn.addEventListener('click', function () {
        if (item.screen) {
          if (typeof window.showScreen === 'function') {
            window.showScreen(item.screen);
          }
        } else {
          const hamburger = document.getElementById('v3-hamburger');
          if (hamburger) hamburger.click();
        }
      });

      nav.appendChild(btn);
    }

    document.body.appendChild(nav);
    bottomNav = nav;

    // Signal to CSS that bottom nav is present for content padding.
    document.documentElement.classList.add('mobile-ui-has-bottom-nav');
  }

  function _removeBottomNav() {
    if (bottomNav) {
      bottomNav.remove();
      bottomNav = null;
    }
    // Clean up any leaked instances.
    document.querySelectorAll('.mobile-ui-bottom-nav').forEach((el) => el.remove());
    document.documentElement.classList.remove('mobile-ui-has-bottom-nav');
  }
}
