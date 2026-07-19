export function createFeature() {
  let lastState = null;
  let dashboardListenerInstalled = false;
  let syncFrame = null;
  let topbarStats = null;
  let songsSource = null;
  let activeSource = null;

  return {
    name: 'home',
    mount(ctx) {
      lastState = ctx?.state || null;
      _installDashboardListener();
      _scheduleSync();
    },
    refresh(ctx) {
      lastState = ctx?.state || null;
      _scheduleSync();
    },
    unmount() {
      _removeDashboardListener();
      _cancelSync();
      _removeTopbarStats();
      lastState = null;
    }
  };

  function _installDashboardListener() {
    if (dashboardListenerInstalled) return;
    document.addEventListener('v3:dashboard-rendered', _onDashboardRendered);
    dashboardListenerInstalled = true;
  }

  function _removeDashboardListener() {
    if (!dashboardListenerInstalled) return;
    document.removeEventListener('v3:dashboard-rendered', _onDashboardRendered);
    dashboardListenerInstalled = false;
  }

  function _onDashboardRendered() {
    _scheduleSync();
  }

  function _scheduleSync() {
    if (syncFrame) return;
    syncFrame = requestAnimationFrame(function () {
      syncFrame = null;
      _syncTopbarStats();
    });
  }

  function _cancelSync() {
    if (!syncFrame) return;
    cancelAnimationFrame(syncFrame);
    syncFrame = null;
  }

  function _isTouchHomeWithTopbarStats() {
    return lastState?.screen === 'home' &&
      lastState?.isV3 &&
      !lastState?.disabled &&
      (lastState?.viewport?.deviceClass === 'phone' || lastState?.viewport?.deviceClass === 'tablet');
  }

  function _syncTopbarStats() {
    if (!_isTouchHomeWithTopbarStats()) {
      _removeTopbarStats();
      return;
    }

    const rail = document.querySelector('.mobile-ui-topbar-status-rail');
    const profile = document.getElementById('v3-badge-profile');
    const stats = _readHomeStats();
    if (!rail || !stats.songs) {
      _removeTopbarStats();
      return;
    }

    const wrapper = _ensureTopbarStats(rail, profile);
    _upsertButton(wrapper, 'songs', stats.songs, 'Songs', 'v3-songs');
    if (stats.active) {
      _upsertButton(wrapper, 'active', stats.active, 'Active', 'v3-plugins');
    } else {
      wrapper.querySelector('[data-mobile-ui-home-stat="active"]')?.remove();
    }
    _syncSourceVisibility(stats);
  }

  function _readHomeStats() {
    const grid = document.querySelector('#v3-home > .max-w-7xl > .grid.md\\:grid-cols-3');
    if (!grid) return {};

    const children = Array.from(grid.children);
    const songCard = children.find(function (child) {
      return child.id !== 'v3-audio-routing' && _parseStatText(child.textContent, 'songs');
    }) || null;
    const careerSlot = document.getElementById('v3-dash-career-slot');
    const careerCard = careerSlot?.querySelector?.('.pp-dash-card') || null;
    const activeCard = careerCard ? null : careerSlot;

    return {
      songCard,
      activeCard,
      songs: songCard ? _parseStatText(songCard.textContent, 'songs') : null,
      active: activeCard ? _parseStatText(activeCard.textContent, 'active') : null
    };
  }

  function _parseStatText(text, unit) {
    const normalized = String(text || '').trim().replace(/\s+/g, ' ');
    const match = normalized.match(new RegExp('^(.+?)\\s+' + unit + '$', 'i'));
    if (!match) return null;
    return { value: match[1], unit };
  }

  function _ensureTopbarStats(rail, profile) {
    if (!topbarStats || !topbarStats.isConnected) {
      topbarStats = document.createElement('div');
      topbarStats.className = 'mobile-ui-home-topbar-stats';
      topbarStats.setAttribute('aria-label', 'Home stats');
      topbarStats.addEventListener('click', _onTopbarStatClick);
    }
    const reference = profile ? profile.nextSibling : null;
    if (topbarStats.parentElement !== rail || (profile && topbarStats.previousElementSibling !== profile)) {
      rail.insertBefore(topbarStats, reference);
    }
    return topbarStats;
  }

  function _upsertButton(wrapper, key, stat, label, target) {
    let button = wrapper.querySelector('[data-mobile-ui-home-stat="' + key + '"]');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-ui-home-stat-button';
      button.setAttribute('data-mobile-ui-home-stat', key);
      wrapper.appendChild(button);
    }
    button.setAttribute('data-mobile-ui-target', target);
    button.setAttribute('aria-label', label + ': ' + stat.value + ' ' + stat.unit);
    button.innerHTML = '<span class="mobile-ui-home-stat-value"></span><span class="mobile-ui-home-stat-unit"></span>';
    button.querySelector('.mobile-ui-home-stat-value').textContent = stat.value;
    button.querySelector('.mobile-ui-home-stat-unit').textContent = stat.unit;
  }

  function _onTopbarStatClick(event) {
    const button = event.target.closest('[data-mobile-ui-home-stat]');
    if (!button) return;
    const target = button.getAttribute('data-mobile-ui-target');
    if (target && typeof window.showScreen === 'function') {
      window.showScreen(target);
    }
  }

  function _syncSourceVisibility(stats) {
    _setSourceHidden(songsSource, false);
    _setSourceHidden(activeSource, false);
    songsSource = stats.songCard || null;
    activeSource = stats.activeCard || null;
    _setSourceHidden(songsSource, true);
    if (stats.active) _setSourceHidden(activeSource, true);
  }

  function _setSourceHidden(source, hidden) {
    if (!source) return;
    source.classList.toggle('mobile-ui-home-stat-source-hidden', !!hidden);
  }

  function _removeTopbarStats() {
    _setSourceHidden(songsSource, false);
    _setSourceHidden(activeSource, false);
    songsSource = null;
    activeSource = null;
    topbarStats?.remove();
    topbarStats = null;
    document.querySelectorAll('.mobile-ui-home-stat-source-hidden')
      .forEach(function (node) { node.classList.remove('mobile-ui-home-stat-source-hidden'); });
  }
}
