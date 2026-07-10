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
  if (_slider) return; // already bound
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

function _isPlayerOnPhone(state) {
  return state?.screen === 'player' && state?.isV3 && state?.viewport?.deviceClass === 'phone';
}

export function createFeature() {
  return {
    name: 'player',
    mount(ctx) {
      if (_isPlayerOnPhone(ctx?.state)) _bind();
    },
    refresh(ctx) {
      if (_isPlayerOnPhone(ctx?.state)) {
        _bind();
      } else {
        _unbind();
      }
    },
    unmount() {
      _unbind();
    }
  };
}
