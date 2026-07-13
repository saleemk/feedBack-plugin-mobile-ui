export function createFeature() {
  let statusRow = null;
  let statusRail = null;
  let bottomNav = null;
  let moreSheet = null;

  // Nav keys that have dedicated bottom-nav tabs and should be excluded
  // from the More sheet.
  var PRIMARY_NAV_KEYS = ['home', 'songs', 'progress', 'plugins'];

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
      _closeMoreSheet();
    }

    if (ctx?.state?.disabled || !ctx?.state?.isV3) return;

    var tuner = document.getElementById('v3-badge-tuner');
    var instrument = document.getElementById('v3-badge-instrument');
    var profile = document.getElementById('v3-badge-profile');
    if (!tuner || !instrument || !profile) return;

    var rail = tuner.parentElement;
    if (!rail || instrument.parentElement !== rail || profile.parentElement !== rail) return;

    var row = rail.parentElement;
    if (!row) return;

    statusRail = rail;
    statusRow = row;
    statusRail.classList.add('mobile-ui-topbar-status-rail');
    statusRow.classList.add('mobile-ui-topbar-status-row');
  }

  function unmount() {
    clearStatusClasses();
    _removeBottomNav();
    _closeMoreSheet();
  }

  function clearStatusClasses() {
    if (statusRail) statusRail.classList.remove('mobile-ui-topbar-status-rail');
    if (statusRow) statusRow.classList.remove('mobile-ui-topbar-status-row');

    document.querySelectorAll('.mobile-ui-topbar-status-rail')
      .forEach(function (el) { el.classList.remove('mobile-ui-topbar-status-rail'); });
    document.querySelectorAll('.mobile-ui-topbar-status-row')
      .forEach(function (el) { el.classList.remove('mobile-ui-topbar-status-row'); });

    statusRail = null;
    statusRow = null;
  }

  function _shouldShowBottomNav(state) {
    if (state?.disabled || !state?.isV3 || state?.screen === 'player') return false;
    var vp = state?.viewport;
    return !!(vp && vp.deviceClass === 'phone' && vp.isPortrait);
  }

  // --- Bottom navigation bar -----------------------------------------------

  function _ensureBottomNav() {
    if (bottomNav && bottomNav.isConnected) return;

    var nav = document.createElement('nav');
    nav.className = 'mobile-ui-bottom-nav';
    nav.setAttribute('aria-label', 'Primary mobile navigation');

    var items = [
      { key: 'home', label: 'Home', screen: 'v3-home' },
      { key: 'library', label: 'Library', screen: 'v3-songs' },
      { key: 'progress', label: 'Progress', screen: 'v3-progress' },
      { key: 'plugins', label: 'Plugins', screen: 'v3-plugins' },
      { key: 'more', label: 'More', screen: null }
    ];

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mobile-ui-bottom-nav-item';
      btn.setAttribute('data-mobile-ui-bottom-nav', item.key);
      btn.setAttribute('aria-label', item.label);
      btn.textContent = item.label;

      if (item.key === 'more') {
        btn.addEventListener('click', function () {
          _toggleMoreSheet();
        });
      } else if (item.screen) {
        btn.addEventListener('click', function (screenId) {
          return function () {
            _closeMoreSheet();
            if (typeof window.showScreen === 'function') {
              window.showScreen(screenId);
            }
          };
        }(item.screen));
      }

      nav.appendChild(btn);
    }

    document.body.appendChild(nav);
    bottomNav = nav;

    document.documentElement.classList.add('mobile-ui-has-bottom-nav');
  }

  function _removeBottomNav() {
    _closeMoreSheet();
    if (bottomNav) {
      bottomNav.remove();
      bottomNav = null;
    }
    document.querySelectorAll('.mobile-ui-bottom-nav').forEach(function (el) { el.remove(); });
    document.documentElement.classList.remove('mobile-ui-has-bottom-nav');
  }

  // --- More sheet ----------------------------------------------------------

  function _toggleMoreSheet() {
    if (moreSheet && moreSheet.isConnected) {
      _closeMoreSheet();
    } else {
      _openMoreSheet();
    }
  }

  function _openMoreSheet() {
    _closeMoreSheet();            // safety: never duplicate
    _ensureMoreSheetDOM();
    document.documentElement.classList.add('mobile-ui-bottom-nav-more-open');
  }

  function _closeMoreSheet() {
    if (moreSheet) {
      moreSheet.remove();
      moreSheet = null;
    }
    document.querySelectorAll('.mobile-ui-bottom-nav-more-sheet').forEach(function (el) { el.remove(); });
    document.documentElement.classList.remove('mobile-ui-bottom-nav-more-open');
  }

  function _ensureMoreSheetDOM() {
    var sheet = document.createElement('div');
    sheet.className = 'mobile-ui-bottom-nav-more-sheet';
    sheet.setAttribute('aria-label', 'More navigation');

    var inner = document.createElement('div');
    inner.className = 'mobile-ui-bottom-nav-more-sheet-inner';

    var remaining = _collectRemainingNavItems();
    if (remaining.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'mobile-ui-bottom-nav-more-sheet-empty';
      empty.textContent = 'No more items';
      inner.appendChild(empty);
    } else {
      for (var i = 0; i < remaining.length; i++) {
        var entry = remaining[i];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mobile-ui-bottom-nav-more-sheet-item';
        btn.textContent = entry.label;

        btn.addEventListener('click', function (navKey) {
          return function () {
            // Click the original sidebar link so core's own handler
            // (go() → showScreen + closeMobileSidebar) runs.
            var original = document.querySelector('#v3-nav a[data-v3-nav="' + navKey + '"]');
            if (original) original.click();
            _closeMoreSheet();
          };
        }(entry.key));
        inner.appendChild(btn);
      }
    }

    sheet.appendChild(inner);
    document.body.appendChild(sheet);
    moreSheet = sheet;
  }

  function _collectRemainingNavItems() {
    var links = document.querySelectorAll('#v3-nav a[data-v3-nav]');
    var seen = {};
    var result = [];

    for (var i = 0; i < links.length; i++) {
      var el = links[i];
      var key = el.getAttribute('data-v3-nav');
      if (!key || seen[key]) continue;
      if (PRIMARY_NAV_KEYS.indexOf(key) !== -1) continue;

      var label = (el.textContent || '').trim();
      if (!label) continue;

      seen[key] = true;
      result.push({ key: key, label: label });
    }

    return result;
  }
}
