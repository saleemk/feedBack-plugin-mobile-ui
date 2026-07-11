let _slider = null;
let _cluster = null;
let _peekTimer = null;

function _handleInput() {
  if (!_slider || !_cluster) return;
  const value = Number(_slider.value).toFixed(2) + 'x';
  _cluster.setAttribute('data-mobile-speed-value', value);
  _cluster.classList.add('mobile-ui-speed-peek');
  clearTimeout(_peekTimer);
  _peekTimer = setTimeout(() => {
    _cluster.classList.remove('mobile-ui-speed-peek');
    _peekTimer = null;
  }, 1000);
}

function _bind() {
  if (_slider) return;
  _slider = document.querySelector('#player-controls .v3-speed-slider');
  if (!_slider) return;
  _cluster = _slider.closest('.v3-speed-cluster');
  _slider.addEventListener('input', _handleInput);
}

function _unbind() {
  if (_slider) {
    _slider.removeEventListener('input', _handleInput);
    _slider = null;
  }
  clearTimeout(_peekTimer);
  _peekTimer = null;
  if (_cluster) {
    _cluster.classList.remove('mobile-ui-speed-peek');
    _cluster.removeAttribute('data-mobile-speed-value');
    _cluster = null;
  }
}

function _isPlayerMobileSpeedScope(state) {
  if (state?.screen !== 'player' || !state?.isV3) return false;
  const vp = state?.viewport;
  if (!vp) return false;
  return vp.deviceClass === 'phone' || (vp.isLandscape && vp.height <= 520);
}

// ── Mobile Controls button + category picker ──────────────────────────────

const MORE_ACTIONS = [
  { label: 'Visuals',  selector: '#v3-player-rail [data-rail="viz"]' },
  { label: 'Audio',    selector: '#v3-player-rail [data-rail="audio"]' },
  { label: 'Mixer',    selector: '#v3-player-rail [data-rail="mixer"]' },
  { label: 'Lyrics',   selector: '#v3-player-rail [data-rail-action="lyrics"]', toggle: true },
  { label: 'Plugins',  selector: '#v3-player-rail [data-rail="plugins"]' },
  { label: 'Practice', selector: '#section-practice-pill' },
  { label: 'Advanced', selector: '#v3-player-rail [data-rail="advanced"]' },
];

let _controlsBtn = null;
let _controlsPicker = null;
let _controlsOpen = false;
let _activeAction = null;
let _actionClickInProgress = false;
let _landscapeControls = null;

function _showPicker() {
  if (!_controlsPicker) return;
  _controlsPicker.hidden = false;
  _controlsOpen = true;
  _syncToggleChips();
  _restoreSelection();
}

function _hidePicker() {
  if (!_controlsPicker) return;
  _closeSheets();
  _controlsPicker.hidden = true;
  _controlsOpen = false;
  _activeAction = null;
  _clearSelection();
}

function _togglePicker(e) {
  e.stopPropagation();
  if (_controlsOpen) { _hidePicker(); } else { _openPicker(); }
}

function _openPicker() {
  if (_getPauseOnMoreOpen() && window.feedBack && window.feedBack.isPlaying) {
    var playBtn = document.getElementById('btn-play');
    if (playBtn) playBtn.click();
  }
  _showPicker();
}

function _getPauseOnMoreOpen() {
  try { return window.localStorage.getItem('mobile_ui.pauseOnMoreOpen') === '1'; } catch (_) { return false; }
}

function _isBtnActive(btn) {
  return btn.classList.contains('is-active') || btn.getAttribute('aria-expanded') === 'true';
}

function _clickActionButton(btn) {
  _actionClickInProgress = true;
  try {
    btn.click();
  } finally {
    _actionClickInProgress = false;
  }
}

function _openCategory(action) {
  const btn = document.querySelector(action.selector);
  if (!btn) return;
  if (action.toggle) {
    _clickActionButton(btn);
    _syncToggleChips();
    return;
  }
  // If tapping the already-active action, toggle the sheet closed.
  if (_activeAction === action && _isBtnActive(btn)) {
    _clickActionButton(btn);
    _activeAction = null;
    _clearSelection();
    return;
  }
  // Switch to new action: close previous sheet, open new one.
  _closeSheets();
  _clickActionButton(btn);
  _activeAction = action;
  _selectAction(action);
}

function _closeSheets() {
  if (!_activeAction) return;
  const btn = document.querySelector(_activeAction.selector);
  if (btn && _isBtnActive(btn)) _clickActionButton(btn);
  _activeAction = null;
}

function _selectAction(action) {
  _clearSelection();
  const index = MORE_ACTIONS.indexOf(action);
  if (index < 0) return;
  document.querySelectorAll('[data-mobile-ui-player-action="' + index + '"]').forEach(function (chip) {
    chip.classList.add('is-selected');
  });
}

function _clearSelection() {
  document.querySelectorAll('.mobile-ui-player-controls-option.is-selected, .mobile-ui-player-landscape-chip.is-selected').forEach(function (c) {
    c.classList.remove('is-selected');
  });
}

function _restoreSelection() {
  if (_activeAction) _selectAction(_activeAction);
}

function _syncToggleChips() {
  MORE_ACTIONS.forEach(function (action, i) {
    if (!action.toggle) return;
    const btn = document.querySelector(action.selector);
    const active = btn && (btn.classList.contains('is-active') || btn.getAttribute('aria-pressed') === 'true');
    document.querySelectorAll('[data-mobile-ui-player-action="' + i + '"]').forEach(function (chip) {
      chip.classList.toggle('is-active', !!active);
    });
  });
}

function _onControlsOutsideClick(e) {
  if (!_controlsOpen) return;
  if (_actionClickInProgress) return;
  if (_controlsBtn && _controlsBtn.contains(e.target)) return;
  if (_controlsPicker && _controlsPicker.contains(e.target)) return;
  _hidePicker();
}

function _ensureControls() {
  const player = document.getElementById('player');
  if (!player) return;
  const controlsBar = document.getElementById('player-controls');

  if (_controlsBtn && _controlsBtn.isConnected) {
    const existing = _controlsBtn.closest('.mobile-ui-player-controls-trigger');
    if (existing) {
      existing.setAttribute('data-v3-native', '');
      if (controlsBar && existing.parentElement !== controlsBar) {
        controlsBar.appendChild(existing);
      }
    }
    return;
  }

  const container = document.createElement('div');
  container.id = 'mobile-ui-player-controls-trigger';
  container.className = 'mobile-ui-player-controls-trigger';
  container.setAttribute('data-v3-native', '');

  const btn = document.createElement('button');
  btn.className = 'mobile-ui-player-controls-button';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'More controls');
  btn.title = 'More controls';
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="4" x2="6" y2="4"/><line x1="10" y1="4" x2="14" y2="4"/><circle cx="8" cy="4" r="1.5"/><line x1="2" y1="8" x2="4" y2="8"/><line x1="10" y1="8" x2="14" y2="8"/><circle cx="7" cy="8" r="1.5"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="10" y1="12" x2="14" y2="12"/><circle cx="7.5" cy="12" r="1.5"/></svg>';
  btn.addEventListener('click', _togglePicker);
  container.appendChild(btn);
  _controlsBtn = btn;

  const picker = document.createElement('div');
  picker.className = 'mobile-ui-player-controls-picker';
  picker.hidden = true;

  MORE_ACTIONS.forEach(function (action, index) {
    const option = document.createElement('button');
    option.className = 'mobile-ui-player-controls-option';
    option.type = 'button';
    option.dataset.mobileUiPlayerAction = String(index);
    option.textContent = action.label;
    option.addEventListener('click', function (e) {
      e.stopPropagation();
      _openCategory(action);
    });
    picker.appendChild(option);
  });
  container.appendChild(picker);
  _controlsPicker = picker;

  (controlsBar || player).appendChild(container);
  document.addEventListener('click', _onControlsOutsideClick);
}

function _ensureLandscapeControls() {
  const controlsBar = document.getElementById('player-controls');
  if (!controlsBar) return;

  if (_landscapeControls && _landscapeControls.isConnected) {
    if (_landscapeControls.parentElement !== controlsBar) controlsBar.appendChild(_landscapeControls);
    return;
  }

  const container = document.createElement('div');
  container.id = 'mobile-ui-player-landscape-controls';
  container.className = 'mobile-ui-player-landscape-controls';
  container.setAttribute('data-v3-native', '');

  const row = document.createElement('div');
  row.className = 'mobile-ui-player-landscape-chip-row';

  MORE_ACTIONS.forEach(function (action, index) {
    const chip = document.createElement('button');
    chip.className = 'mobile-ui-player-landscape-chip';
    chip.type = 'button';
    chip.dataset.mobileUiPlayerAction = String(index);
    chip.textContent = action.label;
    chip.addEventListener('click', function (e) {
      e.stopPropagation();
      _openCategory(action);
    });
    row.appendChild(chip);
  });
  container.appendChild(row);

  controlsBar.appendChild(container);
  _landscapeControls = container;
  _syncToggleChips();
  _restoreSelection();
}

function _removeLandscapeControls() {
  _closeSheets();
  if (_landscapeControls) {
    _landscapeControls.remove();
    _landscapeControls = null;
  }
}

function _removeControls() {
  document.removeEventListener('click', _onControlsOutsideClick);
  _hidePicker();
  if (_controlsBtn) {
    const container = _controlsBtn.closest('.mobile-ui-player-controls-trigger');
    if (container) container.remove();
    _controlsBtn = null;
    _controlsPicker = null;
  }
}

function _isPlayerPortraitPhone(state) {
  if (state?.screen !== 'player' || !state?.isV3) return false;
  const vp = state?.viewport;
  if (!vp) return false;
  return vp.deviceClass === 'phone' && vp.isPortrait;
}

function _isPlayerLowHeightLandscape(state) {
  if (state?.screen !== 'player' || !state?.isV3) return false;
  const vp = state?.viewport;
  if (!vp) return false;
  return vp.isLandscape && vp.height <= 520;
}

// ── Play/Pause button sync (core bug compatibility) ───────────────────────

let _pbSyncTimers = [];
let _pbListeners = null;

function _syncPlayButton() {
  if (typeof setPlayButtonState !== 'function') return;
  const actuallyPlaying = !!(window.feedBack && window.feedBack.isPlaying);
  const btn = document.getElementById('btn-play');
  if (!btn) return;
  const btnShowsPause = btn.getAttribute('aria-label') === 'Pause';
  if (actuallyPlaying !== btnShowsPause) {
    setPlayButtonState(actuallyPlaying);
  }
}

function _schedulePlayButtonSync() {
  _clearPlayButtonSync();
  [0, 100, 500, 1200].forEach(function (ms) {
    _pbSyncTimers.push(setTimeout(_syncPlayButton, ms));
  });
}

function _clearPlayButtonSync() {
  _pbSyncTimers.forEach(clearTimeout);
  _pbSyncTimers = [];
}

function _installPlayButtonSync() {
  if (_pbListeners) return;
  var fb = window.feedBack;
  if (!fb || !fb.on) return;
  _pbListeners = [
    { event: 'song:play', fn: _syncPlayButton },
    { event: 'song:pause', fn: _syncPlayButton },
    { event: 'song:ready', fn: _schedulePlayButtonSync },
  ];
  _pbListeners.forEach(function (l) { fb.on(l.event, l.fn); });
}

function _uninstallPlayButtonSync() {
  _clearPlayButtonSync();
  if (!_pbListeners) return;
  var fb = window.feedBack;
  _pbListeners.forEach(function (l) {
    if (fb && fb.off) fb.off(l.event, l.fn);
  });
  _pbListeners = null;
}

// ── Feature ───────────────────────────────────────────────────────────────

export function createFeature() {
  return {
    name: 'player',
    mount(ctx) {
      if (_isPlayerMobileSpeedScope(ctx?.state)) _bind();
      if (_isPlayerPortraitPhone(ctx?.state)) _ensureControls();
      if (_isPlayerLowHeightLandscape(ctx?.state)) _ensureLandscapeControls();
      _installPlayButtonSync();
      _syncPlayButton();
    },
    refresh(ctx) {
      if (_isPlayerMobileSpeedScope(ctx?.state)) {
        _bind();
      } else {
        _unbind();
      }
      if (_isPlayerPortraitPhone(ctx?.state)) {
        _ensureControls();
      } else {
        _removeControls();
      }
      if (_isPlayerLowHeightLandscape(ctx?.state)) {
        _ensureLandscapeControls();
      } else {
        _removeLandscapeControls();
      }
      if (ctx?.state?.screen === 'player' && ctx?.state?.isV3) {
        _installPlayButtonSync();
        _syncPlayButton();
      } else {
        _uninstallPlayButtonSync();
      }
    },
    unmount() {
      _unbind();
      _removeControls();
      _removeLandscapeControls();
      _uninstallPlayButtonSync();
    }
  };
}
