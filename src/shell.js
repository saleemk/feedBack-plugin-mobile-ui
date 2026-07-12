export function createFeature() {
  let statusRow = null;
  let statusRail = null;
  let menuPill = null;

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
    if (_shouldShowMenuPill(ctx?.state)) {
      ensureMenuPill();
    } else {
      removeMenuPill();
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
    removeMenuPill();
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

  function _shouldShowMenuPill(state) {
    if (state?.disabled || !state?.isV3 || state?.screen === 'player') return false;
    const vp = state?.viewport;
    return !!(vp && vp.deviceClass === 'phone' && vp.isPortrait);
  }

  function ensureMenuPill() {
    if (menuPill && menuPill.isConnected) return;

    const button = document.createElement('button');
    button.className = 'mobile-ui-menu-pill';
    button.type = 'button';
    button.setAttribute('aria-label', 'Menu');
    button.title = 'Menu';
    button.textContent = '☰';
    button.addEventListener('click', function () {
      const hamburger = document.getElementById('v3-hamburger');
      if (hamburger) hamburger.click();
    });

    document.body.appendChild(button);
    menuPill = button;
  }

  function removeMenuPill() {
    if (menuPill) {
      menuPill.remove();
      menuPill = null;
    }
    document.querySelectorAll('.mobile-ui-menu-pill').forEach((el) => el.remove());
  }
}
