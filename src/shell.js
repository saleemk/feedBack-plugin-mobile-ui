export function createFeature() {
  let statusRow = null;
  let statusRail = null;

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
}
