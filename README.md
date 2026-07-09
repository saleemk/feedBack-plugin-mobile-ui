# Mobile UI

Mobile-first shell and player experience improvements for FeedBack.

This repository is currently in a foundation-only state for FeedBack v3. It
installs a modular, idempotent runtime and applies reversible viewport/screen
classification classes to `<html>`, but it does not change FeedBack layout or
visuals yet.

## Structure

```text
feedBack-plugin-mobile-ui/
├── plugin.json
├── screen.js
├── assets/
│   └── mobile_ui.css
└── src/
    ├── main.js
    ├── state.js
    ├── viewport.js
    ├── lifecycle.js
    ├── diagnostics.js
    ├── debug.js
    ├── dom.js
    ├── shell.js
    ├── home.js
    ├── library.js
    ├── player.js
    ├── highway.js
    └── safe-area.js
```

`screen.js` stays tiny and imports `src/main.js`. The manifest uses
`"scriptType": "module"` so the runtime can stay split into ES modules.

## Runtime

The runtime singleton is exposed at:

```js
window.__feedBackMobileUi
```

Useful diagnostics:

```js
window.__feedBackMobileUi.snapshot()
window.__feedBackMobileUi.refresh('manual')
window.__feedBackMobileUi.destroy()
```

`snapshot()` reports the plugin id/version, install state, viewport info, root
classes, mounted feature names, current location, and best-effort screen
detection.

Temporary local disable override:

```js
window.__feedBackMobileUi.disable()
window.__feedBackMobileUi.enable()
window.__feedBackMobileUi.isDisabled()

// Equivalent storage controls:
localStorage.setItem('mobile_ui.disabled', '1')
localStorage.removeItem('mobile_ui.disabled')
```

Visible debug overlay, off by default:

```js
window.__feedBackMobileUi.enableDebug()
window.__feedBackMobileUi.disableDebug()
window.__feedBackMobileUi.toggleDebug()

// Equivalent storage controls:
localStorage.setItem('mobile_ui.debug', '1')
localStorage.removeItem('mobile_ui.debug')
```

## Current Behavior

The runtime applies these reversible classes to `<html>`:

- `mobile-ui-enabled`
- `mobile-ui-phone`, `mobile-ui-tablet`, or `mobile-ui-desktop`
- `mobile-ui-portrait` or `mobile-ui-landscape`
- `mobile-ui-standalone` when running in standalone/PWA display mode
- `mobile-ui-v3` when FeedBack v3 is detected
- one `mobile-ui-screen-*` class for the active screen
- `mobile-ui-disabled` when the local disable override is set

Feature modules are mounted but intentionally no-op for now.
