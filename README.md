# Mobile UI

Standalone mobile and tablet UI improvements for fee[dB]ack v3.

This plugin is developed outside the core fee[dB]ack repo and is mounted into
the app as a normal plugin. It should not require core file edits. The goal is
to improve touch layouts while preserving desktop behavior.

## Repository Notes

- Plugin repo: `D:\Development\GIT\feedBack-plugin-mobile-ui`
- Core repo reference: `D:\Development\GIT\feedback`
- Local app: `http://localhost:8000`
- Entry script: `screen.js`
- Runtime module: `src/main.js`
- Stylesheet: `assets/mobile_ui.css`
- Settings UI: `settings.html`

`screen.js` stays intentionally small and imports `src/main.js`. The manifest
uses `"scriptType": "module"` so the runtime can stay split into ES modules.

## Current Screen Support

| Area | Status | Notes |
| --- | --- | --- |
| Shell/topbar/drawer | active | Mobile drawer and status rail polish. |
| Home | active | Mobile/tablet layout polish. |
| Song Library | active | Toolbar, options, and content polish. |
| Progress | active | Mobile/tablet layout polish. |
| Settings | active | Mobile/tablet spacing, tabs, and forms. |
| Plugins | active | Phone list mode and row-to-settings bridge. |
| Playlists | active | Collection layout polish. |
| Favorites | active | Compact mobile/tablet collection layout. |
| Saved for Later | active | Compact mobile list rows. |
| Lessons | mapped only | Screen detection retained; visual styling reverted. |
| FeedBarcade | mapped only | Screen detection retained; visual styling skipped. |
| Unlockables | mapped only | Screen detection retained; visual styling skipped. |
| Player | active | Touch controls, speed cleanup, panels, and rail bridge. |

## Player Behavior By Device

| Device/mode | Behavior |
| --- | --- |
| Phone portrait | Shows a More icon. More opens a persistent shelf with Visuals, Audio, Mixer, Lyrics, Plugins, Practice, and Advanced. |
| Phone low-height landscape | Shows direct inline action chips. No More shelf. |
| Tablet portrait | Shows direct inline action chips. No More button or More shelf. |
| Tablet landscape | Shows direct inline action chips. No More button or More shelf. |
| Desktop | Core player remains unchanged. |

In touch Player modes, the old v3 rail is visually hidden but kept in the DOM so
core action targets remain available. Mobile UI does not remove or reimplement
core rail popovers.

Current Player features include:

- speed bars, chevrons, and presets hidden in touch modes
- speed slider pill styling
- speed value peek while dragging the slider
- static speed label hidden in touch modes
- restart/retry hidden in touch modes
- Practice special handling
- Lyrics active-state sync
- glass/translucent panel styling
- phone, tablet, and low-height landscape panel positioning
- optional pause when opening the phone More shelf
- enable/disable setting support

Mobile UI intentionally does not touch highway/canvas/camera/renderer internals.

## Settings

The plugin settings page currently provides:

- Enable mobile UI enhancements
- Pause song when opening More controls

Pause-on-More applies only when opening the phone portrait More shelf. It does
not apply to tablet direct action chips or phone low-height landscape chips.

The enable/disable setting stores a local override. When disabled, Mobile UI
removes its enabled root classes and injected controls so core behavior returns.

## Runtime And Debug API

The runtime singleton is exposed at:

```js
window.__feedBackMobileUi
```

Useful commands:

```js
window.__feedBackMobileUi.snapshot()
window.__feedBackMobileUi.refresh('manual')
window.__feedBackMobileUi.destroy()
window.__feedBackMobileUi.disable()
window.__feedBackMobileUi.enable()
window.__feedBackMobileUi.isDisabled()
```

Visible debug overlay, off by default:

```js
window.__feedBackMobileUi.enableDebug()
window.__feedBackMobileUi.disableDebug()
window.__feedBackMobileUi.toggleDebug()
```

Useful page checks:

```js
document.documentElement.className
```

Player duplicate-control check:

```js
{
  moreTrigger: document.querySelectorAll('.mobile-ui-player-controls-trigger').length,
  morePicker: document.querySelectorAll('.mobile-ui-player-controls-picker').length,
  tabletControls: document.querySelectorAll('.mobile-ui-player-tablet-controls').length,
  landscapeControls: document.querySelectorAll('.mobile-ui-player-landscape-controls').length
}
```

Expected broad results:

- phone portrait Player: `moreTrigger` is `1`
- phone low-height landscape Player: `landscapeControls` is `1`
- tablet Player: `tabletControls` is `1`
- desktop Player: all injected control counts are `0`

## Architecture Notes

Important files:

- `plugin.json` declares the plugin entry, stylesheet, and settings page.
- `screen.js` imports `src/main.js`.
- `src/main.js` owns runtime installation, refresh, root classes, and public API.
- `src/lifecycle.js` mounts and refreshes feature modules.
- `src/viewport.js` classifies phone/tablet/desktop and orientation.
- `src/dom.js` detects the active v3 screen and diagnostic elements.
- `src/player.js` is the highest-risk module and owns Player touch behavior.
- `assets/mobile_ui.css` contains all Mobile UI styles.

`src/home.js` and `src/highway.js` are currently no-op/placeholder feature
modules. They are kept so feature ownership stays explicit, but they should not
be mistaken for active Highway or Home logic.

`src/safe-area.js` is intentionally tiny but active: it records safe-area and
standalone context for runtime snapshots while CSS uses `env()` directly.

Core selectors are compatibility points. Treat Player rail selectors, Practice
selectors, and optional Section Map selectors as fragile integration surfaces.

## Validation Commands

Run from the plugin repo:

```powershell
cd D:\Development\GIT\feedBack-plugin-mobile-ui
git status --short
git diff --stat -- .
git diff --check -- .
Get-ChildItem .\src -Filter *.js | ForEach-Object { node --check $_.FullName }
node --check .\screen.js
```

## Manual Regression Checklist

Before accepting Player or layout changes, check:

- phone portrait Player
- phone low-height landscape Player
- tablet portrait Player
- tablet landscape Player
- desktop unchanged
- Player rotation
- leave and re-enter Player
- no duplicate injected controls
- enable/disable setting
- pause-on-More setting
- Practice opens and remains usable
- Lyrics toggles and active state updates
- speed slider and speed peek
- Home
- Song Library
- Progress
- Settings
- Plugins
- Playlists/Favorites/Saved for Later
- no console errors

## Known Limitations And Deferred Cleanup

- `assets/mobile_ui.css` is large and should be re-sectioned before more visual
  feature work.
- Player selector guards and comments should be improved around rail, Practice,
  and optional Section Map integration.
- Placeholder modules should be clarified or removed in a small cleanup slice.
- Further Player JS refactoring should be slice-based only.
- Highway/canvas/camera/core player internals should remain out of scope unless
  a specific bug requires core-side work.
