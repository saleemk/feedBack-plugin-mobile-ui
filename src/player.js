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
  { label: 'Practice', selector: '#v3-player-rail #section-practice-pill' },
  { label: 'Advanced', selector: '#v3-player-rail [data-rail="advanced"]' },
];

let _controlsBtn = null;
let _controlsPicker = null;
let _controlsOpen = false;

function _showPicker() {
  if (!_controlsPicker) return;
  _controlsPicker.hidden = false;
  _controlsOpen = true;
  _syncToggleChips();
}

function _hidePicker() {
  if (!_controlsPicker) return;
  _controlsPicker.hidden = true;
  _controlsOpen = false;
}

function _togglePicker(e) {
  e.stopPropagation();
  if (_controlsOpen) { _hidePicker(); } else { _showPicker(); }
}

function _openCategory(action) {
  _hidePicker();
  const btn = document.querySelector(action.selector);
  if (btn) btn.click();
  if (action.toggle) _syncToggleChips();
}

function _syncToggleChips() {
  if (!_controlsPicker) return;
  const chips = _controlsPicker.querySelectorAll('.mobile-ui-player-controls-option');
  MORE_ACTIONS.forEach(function (action, i) {
    if (!action.toggle) return;
    const btn = document.querySelector(action.selector);
    const active = btn && (btn.classList.contains('is-active') || btn.getAttribute('aria-pressed') === 'true');
    if (chips[i]) chips[i].classList.toggle('is-active', !!active);
  });
}

function _onControlsOutsideClick(e) {
  if (!_controlsOpen) return;
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
  btn.setAttribute('aria-label', 'Player controls');
  btn.textContent = 'More';
  btn.addEventListener('click', _togglePicker);
  container.appendChild(btn);
  _controlsBtn = btn;

  const picker = document.createElement('div');
  picker.className = 'mobile-ui-player-controls-picker';
  picker.hidden = true;

  MORE_ACTIONS.forEach(function (action) {
    const option = document.createElement('button');
    option.className = 'mobile-ui-player-controls-option';
    option.type = 'button';
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

// ── Feature ───────────────────────────────────────────────────────────────

export function createFeature() {
  return {
    name: 'player',
    mount(ctx) {
      if (_isPlayerMobileSpeedScope(ctx?.state)) _bind();
      if (_isPlayerPortraitPhone(ctx?.state)) _ensureControls();
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
    },
    unmount() {
      _unbind();
      _removeControls();
    }
  };
}
