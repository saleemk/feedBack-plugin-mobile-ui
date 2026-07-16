# Mobile UI Roadmap

This roadmap tracks unfinished mobile and tablet work for the standalone
fee[dB]ack Mobile UI plugin. It is intentionally implementation-aware: risky
items require audits before code, and every feature slice should have explicit
done criteria and manual regression checks.

Refer to [AGENTS.md](AGENTS.md) for detailed maintainer and coding-agent
guidance, and [README.md](README.md) for the user-facing overview.

---

## Principles

- Phone and tablet first. Desktop must remain controlled by core unless a
  desktop change is explicitly requested and scoped.
- No core edits as part of this plugin. Any proposed core change must be
  handled separately.
- Prefer existing core actions, anchors, buttons, events, and globals over
  duplicated routing or Player behavior.
- Do not reimplement core popovers, routes, highway rendering, or playback
  internals.
- Keep fixes small and scoped. Prefer CSS-only when it can solve the issue
  safely.
- Audit before touching highway, canvas, camera, renderer, visualization, or
  audio paths.
- Preserve the current Player device/mode matrix.
- Validate each change with syntax checks and real-device regression testing
  appropriate to the affected surface.

---

## Current Baseline

### Touch Navigation

- Home is fixed and always visible.
- All remaining destinations live in one horizontally scrollable strip.
- The same navigation architecture is used for phone portrait, phone
  landscape, tablet portrait, and tablet landscape. Device profiles differ only
  in sizing and available width.
- Known destinations use this mobile priority order:
  1. Library
  2. Career
  3. Progress
  4. Unlockables
  5. FeedBarcade
  6. Plugins
  7. Settings
  8. Playlists
  9. Lessons
  10. Favorites
  11. Saved for Later
- Additional valid core or plugin destinations are appended after the known
  list.
- Hidden, disabled, removed, or invalid entries are not represented.
- Dynamic additions, removals, and supported label or visibility changes
  update the mobile navigation.
- Mobile UI invokes the original core/plugin anchor action instead of
  duplicating navigation logic.
- The active destination is revealed only when needed.
- The Player hides bottom navigation.
- Desktop keeps the core navigation.

Detailed selector, observer, scheduling, escaping, and lifecycle mechanics
belong in AGENTS.md.

### Player

| Device/mode | Player More shelf | Shared direct-control strip | Home/Library exit | Core v3 rail | Pause-on-More |
| --- | --- | --- | --- | --- | --- |
| Phone portrait | yes | no | yes | hidden | opt-in |
| Phone low-height landscape | no | yes | yes | hidden | no |
| Tablet portrait | no | yes | yes | hidden | no |
| Tablet landscape | no | yes | yes | hidden | no |
| Desktop | no | no | no | visible | no |

Desktop uses the core Player without Mobile UI replacement controls.

Phone portrait uses the Player More shelf with:

- quick Arrangement control
- quick Difficulty control
- Visuals
- Audio
- Mixer
- Lyrics
- Plugins
- Practice
- Advanced

Phone low-height landscape and tablet Player layouts use a shared
direct-control strip:

1. Speed
2. Arrangement
3. Difficulty
4. Visuals
5. Audio
6. Mixer
7. Lyrics
8. Plugins
9. Practice
10. Advanced

The shared direct-control strip uses the real core Speed control. Arrangement
and Difficulty are proxy controls that keep the core controls as source of
truth. Visible Arrangement/Difficulty labels may be visually hidden in tight
layouts while accessible names and current values remain available.

### Current Settings

- Enable mobile UI enhancements
- Pause song when opening Player More controls
- Show Mobile UI debug view

Pause-on-More applies only to the phone portrait Player More shelf.

### Out Of Scope

- Highway/canvas/camera/renderer internals.
- Direct visual setting overrides without an audit and restore strategy.
- Core routing, playback, or desktop layout changes.
- Reparenting core popovers.
- Directly mutating core hidden state for rail popovers.

---

## Completed Milestones

### v0.2.0-v0.2.1 - Foundation and Responsive Polish

- Standalone v3 plugin with enable/disable, debug, and optional pause when
  opening the phone portrait Player More shelf.
- Touch shell/topbar polish and shared compact status rail.
- Home, Song Library, Progress, Settings, Plugins, and collection screen
  responsive layout work.
- Phone landscape Home hero and Continue Playing layout density polish.
- Song Library title/status/search layout and denser landscape cards.
- Player Home/Library exit button on touch layouts.
- Phone portrait Player More shelf and landscape/tablet direct Player actions.
- Tap-to-play and vertical highway scrub gestures.
- Player category panels stay open while users interact with controls.
- iPhone standalone portrait-to-landscape viewport-origin correction.
- README, license, thumbnail, and screenshot gallery baseline.

### Completed Since v0.2.1 / Next Release Baseline

#### Dynamic Navigation

- Replaced the previous bottom-navigation architecture with fixed Home plus a
  horizontally scrollable destination strip.
- Removed the obsolete bottom-navigation overflow UI.
- Added canonical mobile ordering for known destinations.
- Added automatic append behavior for valid unknown/plugin-added destinations.
- Added filtering for hidden, disabled, removed, or invalid core nav anchors.
- Added dynamic handling for destination additions, removals, label changes,
  and visibility changes.
- Preserved original core/plugin anchor click behavior.
- Added nearest active-item reveal without always recentering the strip.
- Coalesced nav rebuilds and guarded against duplicate items during refresh and
  rotation.

#### Player Quick Controls

- Added Arrangement and Difficulty quick controls.
- Kept core Arrangement and Difficulty controls as the source of truth.
- Added phone portrait quick settings inside the Player More shelf.
- Added phone landscape and tablet quick settings in the direct-control strip.
- Moved the real Speed control into the shared direct-control strip for phone
  low-height landscape and tablet Player layouts.
- Compacted Speed, Arrangement, and Difficulty for touch strips while retaining
  usable sliders/selects.
- Hid redundant Arrangement, Difficulty, and Close Player rows from the core
  Advanced panel on touch layouts.
- Kept the Home/Library exit action separate and visible.

#### Player Panel Compatibility

- Corrected the core Mixer panel so it opens expanded and uses usable touch
  rows instead of a clipped strip.
- Added Stem Mixer compatibility for its body-level fixed dialog while keeping
  Stem Mixer code untouched.
- Styled the Stem Mixer dialog to match Mobile UI glass panels on touch
  layouts.
- Kept Player action/category panels open while internal controls are used.
- Reused core and plugin controls without reparenting popovers or duplicating
  panel contents.

#### Tablet And Touch Target Polish

- Aligned touch target heights for Player controls, including Home/Library
  exit, Speed, Player More, and direct action controls where applicable.
- Improved tablet Player spacing so controls use more available width.
- Preserved independent phone/tablet and portrait/landscape sizing.

#### Documentation And Screenshots

- README screenshot gallery uses GitHub user-attachment URLs.
- README navigation and Player sections reflect the fixed Home, dynamic
  destination strip, and current Player quick controls.
- No image binaries are stored in the plugin repo.
- Rendered GitHub Markdown review remains a release-prep check unless it has
  been explicitly performed.

---

## Active Priorities

| Priority | Item | Why | Status |
| --- | --- | --- | --- |
| P1 | Final responsive polish | Fix concrete real-device issues only | Ongoing |
| P2 | Gesture enhancements | Double-tap loop and optional gesture controls need audit | Planned |
| P2 | Mobile visual/highway preset audit | Determine safe opt-in visual defaults | Audit first |
| P3 | Visual preset implementation | Only after the audit recommends implementation | Deferred |
| P3 | Haptics/audio feedback | Optional interaction polish | Deferred |
| P3 | Section map enhancement | Only if current behavior proves insufficient | Audit first |

---

## P1 - Final Responsive Polish

Remaining responsive work is regression-driven only. Do not start broad
redesigns from this item.

### Goals

- Fix observed real-device layout or interaction issues as small scoped slices.
- Keep phone, tablet, rotation, Player lifecycle, and desktop regressions in
  the validation path.
- Prefer CSS-only and orientation-scoped fixes where practical.

### Recent Completed Items

- Dynamic bottom navigation with fixed Home and plugin destination support.
- Phone/tablet Player direct-control strip with Speed, Arrangement, Difficulty,
  and action chips.
- Tablet Speed placement and control width cleanup.
- Phone and tablet touch-target height alignment.
- Song Library search width/layout polish across phone landscape and tablet.

### Closure Criteria

- Current known phone/tablet layout issues are resolved.
- Full phone/tablet matrix has been manually rechecked.
- No open reproducible P1 layout defects remain.
- Desktop remains unchanged.

---

## Audit-First Future Work

### P2 - Gesture Enhancements

Tap-to-play and vertical scrub are current baseline features. Remaining gesture
work requires an audit before implementation.

#### Double-Tap Loop Markers

- Identify core loop APIs and events first.
- Avoid delaying single-tap play/pause unless the interaction tradeoff is
  accepted.
- Ensure double-tap handling does not interfere with vertical scrub.

#### Optional Gesture Settings

Possible settings to evaluate:

- enable/disable tap-to-play
- enable/disable vertical scrub
- scrub sensitivity
- optional double-tap loop controls if implemented

Do not prescribe UI shape or storage keys until the feature is designed.

### P2 - Mobile Visual / Highway Presets Audit

This is an audit, not an implementation promise.

#### Search Targets

These names are unverified search targets only:

- highway render scale controls, if any
- visualization selection APIs such as `setViz()`, if exposed
- settings/localStorage keys for quality, scoreboard, venue motion, mood FX,
  background images, and plugin visualizations

#### Safety Rules

- Opt-in only.
- Do not automatically overwrite user settings.
- Preserve and restore previous values.
- Avoid renderer/canvas/camera internals.
- Consider plugin visualizations and phone/tablet performance separately.

#### Audit Deliverables

- inventory of available visual settings
- supported public APIs/events
- persistence mechanism
- restoration strategy
- phone/tablet performance findings
- recommendation to proceed or stop

---

## Deferred / Later Ideas

- Visual preset implementation after the audit recommends it.
- Optional haptic/audio feedback with cleanup and browser support review.
- Section map enhancement after a focused audit of current behavior.
- Custom visual overlay support only if a future visual plugin blocks existing
  gestures.
- Background image presets only after visual-setting support is confirmed.
- Visual theme packs as low-priority experimentation.
- Bottom-nav keyboard/visualViewport handling only if a reproducible issue is
  found.
- Core early no-flash hook. Plugin preboot reduces the old menu/sidebar flash,
  but true zero-frame suppression likely needs core support.
- Plugin-screen compatibility fixes discovered through testing.
- Ongoing compatibility review as fee[dB]ack core navigation and Player markup
  evolve.
- Official organization or desktop-bundle submission is not an active roadmap
  item. The plugin remains independently distributed unless that decision is
  revisited.

---

## Feature Slice Template

Use this template when starting a new feature slice.

### Feature Name

- Problem:
- Goal:
- Scope:
- Out of scope:
- Audit required:
- Files likely touched:
- First implementation slice:
- Validation:
  ```powershell
  cd D:\Development\GIT\feedBack-plugin-mobile-ui
  git status --short
  git diff --stat -- .
  git diff --check -- .
  Get-ChildItem .\src -Filter *.js | ForEach-Object { node --check $_.FullName }
  node --check .\screen.js
  ```
- Manual regression:
  - Touch navigation: fixed Home, full horizontal destination strip, Career
    after Library, plugin-added destinations after known entries, hidden/removed
    destinations disappear, active destination reveal, no duplicate nav, Player
    hides bottom nav.
  - Player controls: phone portrait Player More shelf, phone landscape strip,
    tablet portrait strip, tablet landscape strip, Speed, Arrangement,
    Difficulty, no accidental strip pan while dragging sliders, Arrangement
    changes once, Advanced hides redundant touch controls.
  - Panels: Mixer, Stem Mixer when installed, Practice, Lyrics, Plugins, and
    Advanced remain usable.
  - Lifecycle: rotation, leave/re-enter Player, no duplicate injected controls,
    enable/disable, pause-on-More, debug.
  - Screens: Home, Song Library, Progress, Settings, Plugins, and collections.
  - Desktop unchanged and no console errors.
- Rollback plan:

---

## Validation

Standard validation commands for code/CSS changes:

```powershell
cd D:\Development\GIT\feedBack-plugin-mobile-ui
git status --short
git diff --stat -- .
git diff --check -- .
Get-ChildItem .\src -Filter *.js | ForEach-Object { node --check $_.FullName }
node --check .\screen.js
```

Documentation-only changes should still run:

```powershell
git status --short
git diff --stat -- <changed-doc>
git diff --check -- <changed-doc>
git diff -- <changed-doc>
```

---

## Manual Regression Matrix

### Navigation

- Home remains fixed.
- Horizontal destination strip reaches all entries.
- Canonical order is Library, Career, Progress, Unlockables, FeedBarcade,
  Plugins, Settings, Playlists, Lessons, Favorites, Saved for Later.
- Plugin-added destination appears after known entries.
- Hidden/removed destination disappears.
- Active destination reveals only as needed.
- No duplicate navigation items after refresh or rotation.
- Player hides bottom navigation.
- Desktop sidebar/navigation remains core-controlled.

### Player Layouts

- Phone portrait uses Home/Library exit, transport, compact Speed, and a
  Player More shelf with visible Arrangement, Difficulty, and action controls.
- Phone low-height landscape uses Home/Library exit and the shared
  direct-control strip.
- Tablet portrait uses Home/Library exit and the shared direct-control strip.
- Tablet landscape uses Home/Library exit and the shared direct-control strip.
- Speed is first in shared direct-control strips, followed by Arrangement,
  Difficulty, and action chips.

### Player Interactions

- Speed slider and speed value peek work.
- Arrangement select works and changes exactly once.
- Difficulty slider/value work.
- Sliders do not accidentally pan the strip.
- Home/Library exit works.
- Transport controls work.
- Player panels stay open during internal interaction.
- Practice, Lyrics, Mixer, Plugins, and Advanced remain usable.
- Stem Mixer remains usable when installed.
- No duplicated or orphaned core controls after rotation/re-entry.

### Screens

- Home.
- Song Library.
- Career.
- Progress.
- Settings.
- Plugins.
- Playlists, Favorites, and Saved for Later.
- Lessons, FeedBarcade, and Unlockables remain reachable.

### Lifecycle And Settings

- Portrait/landscape rotation.
- Leave and re-enter Player.
- Enable/disable setting.
- Pause-on-More setting.
- Debug setting and copy action.
- iPhone standalone rotation correction.

### Desktop And Regressions

- Desktop remains unchanged.
- Core Player remains unchanged on desktop.
- No console errors.
