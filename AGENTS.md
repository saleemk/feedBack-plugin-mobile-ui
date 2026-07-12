# Mobile UI Plugin — Agent Maintainer Guide

This guide is for AI coding agents and maintainers working on the Mobile UI
plugin. It captures the architecture, selector risks, Player modes, and
regression requirements so future sessions can make small safe changes without
rediscovering the same context.

## Purpose

Mobile UI is a standalone fee[dB]ack v3 plugin that improves phone and tablet
layouts while preserving desktop behavior. The core fee[dB]ack repo remains
untouched; this plugin is mounted separately and should be reversible through
its runtime/settings controls.

## Repository Map

- Plugin repo: [saleemk/feedBack-plugin-mobile-ui](https://github.com/saleemk/feedBack-plugin-mobile-ui)
- Core repo reference: fee[dB]ack core repo, read-only for this plugin
- Local app: `http://localhost:8000`
- `plugin.json`: manifest, module entry, stylesheet, settings page
- `screen.js`: intentionally tiny entrypoint importing `src/main.js`
- `settings.html`: plugin settings UI
- `assets/mobile_ui.css`: the single manifest-loaded stylesheet
- `src/main.js`: runtime install, refresh, root classes, public API
- `src/lifecycle.js`: feature mount/refresh/unmount lifecycle
- `src/viewport.js`: phone/tablet/desktop and orientation detection
- `src/dom.js`: active screen detection and diagnostics selectors
- `src/player.js`: highest-risk module; Player touch controls and action bridge
- `src/library.js`: Song Library toolbar/content behavior
- `src/plugins.js`: phone Plugins row-to-settings bridge
- `src/shell.js`: topbar/status rail classes
- `src/debug.js`: debug overlay
- `src/diagnostics.js`: runtime snapshot
- `src/safe-area.js`: tiny active diagnostics feature
- `src/home.js`: intentionally no-op; Home is currently CSS-only
- `src/highway.js`: intentionally no-op; highway internals are not touched

## Screen Support

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

## Player Mode Map

| Device/mode | Behavior |
| --- | --- |
| Phone portrait | More icon opens persistent shelf. |
| Phone low-height landscape | Direct inline action chips. No More shelf. |
| Tablet portrait | Direct inline action chips. No More button or More shelf. |
| Tablet landscape | Direct inline action chips. No More button or More shelf. |
| Desktop | Core player remains unchanged. |

Notes:

- Old v3 rail is visually hidden in touch modes but kept in the DOM.
- Rail buttons remain the core action targets; Mobile UI clicks them.
- Mobile UI does not reimplement core rail popovers.
- Practice is special and not a normal rail popover.
- Section Map is optional.
- Highway/canvas/camera/renderer internals are intentionally out of scope.

## Player Feature Notes

- speed bars, chevrons, and presets hidden in touch modes
- speed slider pill styling
- speed value peek while dragging the slider
- static speed label hidden in touch modes
- restart/retry hidden in touch modes
- Lyrics active-state sync
- Practice special handling
- glass/translucent panels
- phone/tablet/landscape panel positioning
- pause-on-More applies only to phone portrait More shelf opening

## Settings

The plugin settings page provides:

- Enable mobile UI enhancements
- Pause song when opening More controls
- Show Mobile UI debug view

Pause-on-More applies only to phone portrait More shelf opening. It does not
apply to tablet direct chips or phone low-height landscape chips.

## Runtime / Debug API

```js
window.__feedBackMobileUi.snapshot()
window.__feedBackMobileUi.refresh('manual')
window.__feedBackMobileUi.destroy()
window.__feedBackMobileUi.disable()
window.__feedBackMobileUi.enable()
window.__feedBackMobileUi.isDisabled()
window.__feedBackMobileUi.enableDebug()
window.__feedBackMobileUi.disableDebug()
window.__feedBackMobileUi.toggleDebug()
```

Useful page check:

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
- desktop Player: all injected counts are `0`

## CSS Architecture

- `plugin.json` currently supports one manifest-loaded stylesheet.
- `assets/mobile_ui.css` intentionally remains the single loaded CSS file.
- Avoid JS dynamic CSS injection unless a feature clearly needs it.
- If splitting becomes necessary later, prefer a build-free manifest wrapper
  using `@import`.
- Player CSS is the first extraction candidate.
- Preserve cascade order during any split.

Current CSS sections:

- diagnostics/debug
- shell/topbar/drawer
- Home
- Library
- Progress
- Settings
- Plugins
- Collections
- Player shared
- Player phone portrait
- Player low-height landscape
- Player tablet direct controls
- Player panels/Practice
- optional integrations

## Fragile Selectors / Compatibility Points

Treat these core selectors as compatibility points:

- `#player`
- `#highway`
- `#player-controls`
- `#v3-player-rail`
- `#v3-railzone`
- `.v3-rail-pop`
- `#section-practice-pill`
- `#section-practice-control`
- `#section-map`
- `#btn-play`
- `.v3-speed-slider`
- `#speed-label` / `.v3-speed-label`

Rules:

- Do not remove rail DOM.
- Do not directly toggle core hidden state unless the existing action path does it.
- Missing targets should fail safely.
- Use debug mode for missing selector diagnostics.

## Lifecycle Notes

- `src/main.js` owns runtime install, refresh, root classes, and public API.
- `src/lifecycle.js` isolates feature mount/refresh/unmount errors.
- Feature lifecycle errors are debug-only warnings.
- Player mode classes should be cleaned on disable, screen change, and unmount.
- Refresh, rotation, and screen changes must not create duplicate DOM/listeners.

## Validation Commands

Run from the plugin repo:

```powershell
cd feedBack-plugin-mobile-ui
git status --short
git diff --stat -- .
git diff --check -- .
Get-ChildItem .\src -Filter *.js | ForEach-Object { node --check $_.FullName }
node --check .\screen.js
```

## Manual Regression Checklist

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
- debug view setting
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

## Safe Change Rules

- No core edits.
- No highway/canvas/camera internals.
- One slice at a time.
- No broad refactors while fixing UI bugs.
- Do not commit automatically; leave changes for human review unless explicitly asked.
- Prefer diagnose/report first for risky areas.
- Preserve the phone/tablet/desktop behavior matrix.
- Run validation before reporting done.

## Known Limitations / Deferred Cleanup

- `assets/mobile_ui.css` is large.
- `src/player.js` is the highest-risk module.
- Further Player refactoring should be slice-based.
- CSS split is deferred.
- Selector guards should remain maintained as core evolves.
- Keep regression coverage strong around phone portrait, low-height landscape,
  tablet direct controls, Practice, Lyrics, and speed peek.
