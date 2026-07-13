const TAP_MOVE_THRESHOLD_PX = 12;
const TAP_MAX_DURATION_MS = 650;

const SELECTORS = {
  player: '#player',
  highway: '#highway',
  playButton: '#btn-play',
  blockingOverlays: [
    '.mobile-ui-player-controls-picker',
    '#v3-railzone .v3-rail-pop',
    '#section-practice-bar',
    '#v3-plugin-controls-slot [popover]',
    '#v3-plugin-controls-slot .popover',
    '#v3-plugin-controls-slot [role="dialog"]'
  ],
  ignoredTargets: [
    'button',
    'a',
    'input',
    'select',
    'textarea',
    'label',
    '[role="button"]',
    '[role="slider"]',
    '[contenteditable="true"]',
    '#player-controls',
    '#v3-player-rail',
    '#v3-railzone',
    '#v3-plugin-controls-slot',
    '#section-map',
    '#section-practice-control',
    '#section-practice-pill',
    '.mobile-ui-player-controls-picker',
    '.mobile-ui-player-controls-trigger',
    '.mobile-ui-player-tablet-controls',
    '.mobile-ui-player-landscape-controls',
    '.v3-rail-pop'
  ]
};

let _player = null;
let _state = null;
let _activePointer = null;

function _isGestureEligible(state) {
  if (!state || state.disabled || state.screen !== 'player' || !state.isV3) return false;
  const deviceClass = state.viewport?.deviceClass;
  return deviceClass === 'phone' || deviceClass === 'tablet';
}

function _isTouchPointer(event) {
  return event.pointerType === 'touch' || event.pointerType === 'pen';
}

function _isCurrentHighwayTarget(target) {
  const highway = document.querySelector(SELECTORS.highway);
  return !!highway && target === highway;
}

function _closest(target, selectors) {
  return target && typeof target.closest === 'function'
    ? target.closest(selectors.join(','))
    : null;
}

function _isIgnoredTarget(target) {
  return !!_closest(target, SELECTORS.ignoredTargets);
}

function _isVisible(el) {
  if (!el || el.hidden || el.getAttribute('aria-hidden') === 'true') return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function _hasVisibleBlockingOverlay() {
  return SELECTORS.blockingOverlays.some((selector) => {
    return Array.from(document.querySelectorAll(selector)).some(_isVisible);
  });
}

function _onPointerDown(event) {
  if (!_isGestureEligible(_state) || !_isTouchPointer(event) || event.isPrimary === false) return;
  if (!_isCurrentHighwayTarget(event.target) || _isIgnoredTarget(event.target)) return;
  if (_hasVisibleBlockingOverlay()) return;

  _activePointer = {
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    target: event.target,
    x: event.clientX,
    y: event.clientY,
    startedAt: Date.now()
  };
}

function _onPointerUp(event) {
  if (!_activePointer || event.pointerId !== _activePointer.pointerId) return;

  const pointer = _activePointer;
  _activePointer = null;

  if (!_isGestureEligible(_state) || !_isTouchPointer(event)) return;
  if (!_isCurrentHighwayTarget(pointer.target)) return;
  if (!_isCurrentHighwayTarget(event.target) || _isIgnoredTarget(event.target)) return;
  if (_hasVisibleBlockingOverlay()) return;

  const dx = event.clientX - pointer.x;
  const dy = event.clientY - pointer.y;
  const moved = Math.hypot(dx, dy);
  const duration = Date.now() - pointer.startedAt;
  if (moved > TAP_MOVE_THRESHOLD_PX || duration > TAP_MAX_DURATION_MS) return;

  const playButton = document.querySelector(SELECTORS.playButton);
  if (playButton) playButton.click();
}

function _onPointerCancel(event) {
  if (_activePointer && event.pointerId === _activePointer.pointerId) {
    _activePointer = null;
  }
}

function _bind() {
  const player = document.querySelector(SELECTORS.player);
  if (!player) {
    _unbind();
    return;
  }

  if (_player === player) return;
  _unbind();
  _player = player;
  _player.addEventListener('pointerdown', _onPointerDown, { passive: true });
  _player.addEventListener('pointerup', _onPointerUp, { passive: true });
  _player.addEventListener('pointercancel', _onPointerCancel, { passive: true });
}

function _unbind() {
  if (_player) {
    _player.removeEventListener('pointerdown', _onPointerDown);
    _player.removeEventListener('pointerup', _onPointerUp);
    _player.removeEventListener('pointercancel', _onPointerCancel);
  }
  _player = null;
  _activePointer = null;
}

export function createFeature() {
  return {
    name: 'gestures',
    mount(ctx) {
      this.refresh(ctx);
    },
    refresh(ctx) {
      _state = ctx?.state || null;
      if (_isGestureEligible(_state)) _bind();
      else _unbind();
    },
    unmount() {
      _state = null;
      _unbind();
    }
  };
}
