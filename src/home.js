// Intentionally no-op feature module.
// Home layout is currently CSS-only; this keeps a clear feature boundary for
// future Home-specific JS without changing runtime behavior today.
export function createFeature() {
  return {
    name: 'home',
    mount() {},
    refresh() {},
    unmount() {}
  };
}
