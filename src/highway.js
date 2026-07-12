// Intentionally no-op feature module.
// Mobile UI does not touch highway/canvas/camera internals; keep this boundary
// for future safe wrappers only.
export function createFeature() {
  return {
    name: 'highway',
    mount() {},
    refresh() {},
    unmount() {}
  };
}
