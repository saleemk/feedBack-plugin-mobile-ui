export function createLifecycle(features) {
  const mounted = new Set();

  return {
    mount(ctx) {
      features.forEach((feature) => {
        if (mounted.has(feature.name)) return;
        feature.mount?.(ctx);
        mounted.add(feature.name);
      });
    },

    refresh(ctx) {
      features.forEach((feature) => {
        if (!mounted.has(feature.name)) return;
        feature.refresh?.(ctx);
      });
    },

    unmount() {
      [...features].reverse().forEach((feature) => {
        if (!mounted.has(feature.name)) return;
        feature.unmount?.();
        mounted.delete(feature.name);
      });
    },

    getMountedFeatureNames() {
      return features.filter((feature) => mounted.has(feature.name)).map((feature) => feature.name);
    }
  };
}
