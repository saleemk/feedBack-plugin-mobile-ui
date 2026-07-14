# Mobile UI Roadmap

This roadmap captures planned mobile and tablet layout improvements for the
fee[dB]ack Mobile UI plugin. It is intentionally **implementation-aware**:
risky items require audits before any code is written, and every feature
slice must pass explicit done criteria and manual regression checks.

Refer to [`AGENTS.md`](AGENTS.md) for the detailed maintainer and coding-agent
guide, and [`README.md`](README.md) for the user-facing overview.

---

## Principles

- **Phone / tablet first.**  Desktop must remain unchanged unless a change
  is explicitly and intentionally scoped to desktop.
- **No core edits.**  The plugin lives outside the core repo and must not
  require core patches.  If a core change is *proposed*, it must be a
  separate discussion with the feedBack maintainers.
- **Prefer existing core actions and APIs.**  Bridge into core buttons,
  events, and globals rather than re-implementing behaviour.
- **Do not reimplement core popovers, routes, or player behaviour.**  The
  plugin's job is to *surface* existing controls in a mobile-friendly way,
  not to duplicate them.
- **One small slice at a time.**  Prefer CSS-only when possible; add JS
  only when CSS cannot solve the problem safely.
- **Audit before risky integrations.**  Anything that touches the highway,
  canvas, renderer, visualisation settings, or audio playback path must be
  audited first — do not assume internal APIs.
- **Preserve the current Player device-behaviour matrix** (see [Current
  Baseline](#current-baseline)).
- **Avoid broad refactors while fixing UX issues.**
- **Run validation + manual regression after every change.**

---

## Current Baseline

### Player behaviour by device / mode

| Device / mode          | More shelf | Direct chips | Home / Library exit | Old v3 rail | Pause-on-More |
|------------------------|-----------|-------------|---------------------|-------------|---------------|
| Phone portrait         | ✅         | —           | ✅ icon + More action | hidden      | ✅ (opt-in)    |
| Phone low-height landscape | —     | ✅ (inline)  | ✅ icon              | hidden      | ❌             |
| Tablet portrait        | —         | ✅ (inline)  | ✅ icon              | hidden      | ❌             |
| Tablet landscape       | —         | ✅ (inline)  | ✅ icon              | hidden      | ❌             |
| Desktop                | —         | —           | —                   | visible     | ❌             |

**Direct chips** are the Visuals / Audio / Mixer / Lyrics / Plugins /
Practice / Advanced category chips rendered inline in the bottom controls
row (no More shelf).

### Current settings

- **Enable mobile UI enhancements** — on/off; persists via
  `localStorage` key `mobile_ui.disabled`.
- **Pause song when opening More controls** — on/off; persists via
  `localStorage` key `mobile_ui.pauseOnMoreOpen`.
- **Show Mobile UI debug view** — on/off; persists via
  `localStorage` key `mobile_ui.debug`.

### Out of scope (for now)

- Highway / canvas / camera / renderer internals.
- Directly resizing or manipulating `#highway` / canvas / renderer
  internals.  Requesting a safe core resize or layout refresh is
  allowed **after audit** (e.g. calling a documented core method that
  triggers a relayout).
- Changing core playback behaviour (except the explicit pause-on-More
  setting which only pauses, never plays).
- Reparenting core rail popovers.
- Directly toggling `.hidden` on core rail popovers.

### Docs split

| File | Audience |
|---|---|
| `README.md` | Users — what the plugin does, how to install. |
| `AGENTS.md` | Maintainers and coding agents — architecture, conventions, patterns. |
| `ROADMAP.md` | This file — future work, priorities, audit gates. |

---

## Completed Milestones

### v0.2.0–v0.2.1 — Mobile UI Foundation and Polish

The core touch-optimised UI is in place.  Phone and tablet users now have
a bottom navigation bar, responsive topbar with compact status cards,
one-tap Player exit, tap-to-play and vertical scrub gestures, and
orientation-aware layout polish — all without touching core or desktop.

#### Navigation

- Bottom navigation bar replacing the old core hamburger/sidebar on touch layouts.
- Compact 5-tab nav (Home · Library · Progress · Plugins · More) for phone portrait.
- Wide 8-tab nav (adding Unlockables · FeedBarcade · Settings) for phone landscape and tablet.
- Dynamic More sheet built from remaining core `#v3-nav` items — never opens the old core drawer.
- Core sidebar and hamburger hidden while bottom nav is active (CSS-only, DOM preserved as data source).
- First-paint flash of old core nav minimised via preboot class.
- Responsive rebuild on rotation between compact and wide modes.

#### Home

- Responsive touch topbar with title / welcome and Support Us on the first row and compact status cards below.
- Status card height normalisation — tuner, instrument, and profile/rank cards share the same visual height.
- Profile equalizer bars remain visible in a compact form so the streak card no longer dominates.
- Support Us button compacted and kept aligned with the title across touch layouts.
- Phone landscape Home places the hero and Continue Playing card side-by-side.
- Landscape density improvements: hero compacted, stat cards tightened, and section spacing reduced.
- Tablet refinements keep the same information hierarchy while using tablet-specific sizing.

#### Song Library

- Responsive toolbar and Options flow for phone and tablet.
- Search relocated below the title/status area on touch layouts.
- Phone portrait keeps a touch-friendly multi-column library layout.
- Phone landscape uses denser artwork, spacing, text, and tags so more songs fit above the bottom nav.
- Compact cards and responsive layout polish across touch profiles.

#### Player

- One-tap Home/Library exit icon button on all phone/tablet Player layouts.
- Phone portrait More shelf with Library as first action.
- Direct landscape/tablet action chips (Visuals, Audio, Mixer, Lyrics, Plugins, Practice, Advanced).
- Tap-to-play gesture (touch/pen on highway → play/pause).
- Vertical scrub gesture (drag down → seek forward, drag up → seek backward).
- Player category panels remain open while users interact with lists, sliders, toggles, selects, buttons, and plugin controls; outside taps and category changes still close or switch panels.
- Responsive layouts across all four touch orientations.

#### Tablet

- Shared touch UI with phone — bottom nav, compact topbar, direct Player chips.
- Portrait and landscape layouts tuned independently.
- Wider bottom nav island with proper item spacing.

#### General

- Shared compact status-card sizing across all touch orientations.
- Responsive spacing improvements throughout.
- Improved preboot handling to reduce the old core navigation flash during plugin startup.
- Diagnosed an iPhone standalone portrait → landscape viewport-origin bug where iOS reported negative `visualViewport` and document offsets, causing a top gap and incorrect hit-testing.
- Added a scoped measured-offset correction for standalone phone landscape; the correction clears when the viewport returns to normal.
- Safari, simulator, portrait, tablet, and desktop remain unaffected by the standalone rotation correction.
- Enable/disable, debug, and pause-on-More settings.

---

## Priority Overview

| Priority | Item | Why | Status |
|---|---|---|---|
| **P1** | Final responsive polish | Address concrete issues found through real-device testing | Ongoing |
| **P1** | Documentation / screenshots | Present the completed touch layouts clearly | In progress |
| **P2** | Gesture enhancements | Double-tap loop and optional gesture settings | Later |
| **P2** | Visual preset audit | Determine safe mobile-friendly visual defaults | Audit first |
| **P3** | Visual preset implementation | Apply presets without overwriting user settings | After audit |
| **P3** | Haptics / audio feedback | Optional gesture polish | Later |
| **P3** | Section map enhancement | Only if current behaviour is lacking | Audit first |

---

## P1 — Final Responsive Polish

### Problem

Remaining spacing, crowding, or alignment issues discovered during
real-device testing across phone portrait, phone landscape, tablet portrait,
and tablet landscape.

### Goals

- Address concrete issues found in screenshots or real-device testing.
- Each fix must be CSS-only where possible, scoped to the affected
  orientation, and must not regress other orientations or desktop.
- No broad refactors.

### Done criteria

- [x] Representative real-device screenshots collected for phone portrait, phone landscape, tablet portrait, and tablet landscape.
- [x] Phone landscape Home and Song Library density issues identified in screenshots and corrected.
- [ ] Additional concrete crowding / spacing issues fixed as they are discovered.
- [ ] No regressions to desktop.
- [ ] No regressions to other orientations.

### Risks

- **Low.**  CSS-only, scoped to device / orientation classes already in use.

---

## P1 — Documentation / Screenshots

### Status

Representative phone and tablet screenshots have been collected.  The README
screenshot gallery is being prepared using GitHub-hosted user-attachment URLs;
image files will not be checked into the plugin repository.

### Goals

- Add phone portrait screenshots for Home, Song Library, Player, and Plugins.
- Add phone landscape screenshots for Home, Song Library, Player controls, and a Player category panel.
- Add tablet portrait and landscape Player screenshots.
- Keep portrait images narrow enough to pair cleanly and landscape images large enough to show control detail.
- Keep `README.md` user-facing rather than turning it into a release changelog.

### Done criteria

- [x] Phone portrait screenshots collected: Home, Song Library, Player, Plugins.
- [x] Phone landscape screenshots collected: Home, Song Library, Player controls, Player category panel.
- [x] Tablet screenshots collected: portrait Player and landscape Player.
- [ ] GitHub user-attachment URLs inserted into `README.md`.
- [ ] Screenshot gallery reviewed in rendered GitHub Markdown.
- [ ] No image binaries added to the repository.

### Risks

- **Low.**  Documentation-only.  The main risk is oversized or poorly grouped images making the README difficult to scan.

---

## P2 — Gesture Enhancements

Tap-to-play and vertical scrub are implemented.  Remaining gesture work:

### Double-tap loop markers

- Double-tap highway → cycle loop markers (A → B → Clear).
- Must use core loop APIs (audit required).
- Must not conflict with single-tap play/pause (delay single-tap until
  double-tap window expires).

### Gesture settings

- Optional enable/disable per gesture.
- Scrub sensitivity setting.
- Persisted via `localStorage`.

### Done criteria

- [ ] Double-tap loop implemented and does not conflict with tap-to-play.
- [ ] Gesture settings panel added (or integrated into existing settings).
- [ ] Settings persist across sessions.
- [ ] Desktop / mouse unaffected.
- [ ] No regression to existing gestures.

### Risks

- **Medium.**  Double-tap adds latency to single-tap.  Loop API may have
  edge cases.  Settings UI adds surface area.

---

## P2 — Mobile Visual / Highway Presets Audit

### Problem

The stock visualisation settings can feel bland on mobile.  There appear to
be many visual options, possibly including background images.

### Goal

Determine whether Mobile UI can **safely** recommend or apply mobile-
friendly visualisation presets without breaking user customisations or
touching renderer internals.

### Audit questions (before any implementation)

- What visualisation settings exist?
  - Viz picker (Auto / Classic 2D / 3D Highway / plugin viz).
  - Quality / render scale.
  - Min resolution.
  - Scoreboard.
  - Venue Motion / Venue Mood FX.
  - Background images (if any).
- Are there public APIs for these settings?  **These are possible APIs
  to verify — none are confirmed safe or callable from plugin scope.**
  - `highway.setRenderScale()` — existence and safety not yet verified.
  - `setViz()` — existence and safety not yet verified.
  - Are there other settings paths (e.g. `localStorage` keys) that can
    be read / written without calling internal functions?
- Are settings stored in `localStorage`?
  - If yes, what keys?
  - Can Mobile UI safely read / write them?
- Can changes be **restored**?
  - Does the viz picker have a "Restore previous" path?
  - Can we snapshot and restore?
- Are background images supported?
  - If yes, what are the path / loading / performance implications on
    phones?
- Performance implications:
  - Does switching to 3D Highway hurt phone framerate?
  - Does a lower render scale help?
  - Does tablet need different settings from phone?

### Possible preset names (for later)

- Phone Focus
- Phone Stage
- Tablet Stage
- Performance
- Default / No override

### User-safety rules (must be enforced if implemented)

- **No automatic overwrite** of custom visual settings.
- **Explicit Apply button** — user must opt in.
- **Clear restore / reset** behaviour.
- Store what Mobile UI changed so it can avoid repeated overwrites.
- Avoid renderer / canvas / camera internals unless explicitly approved
  after audit.

### Done criteria (audit only)

- [ ] All audit questions answered.
- [ ] Report filed: what is safe, what is risky, what is impossible.
- [ ] Recommendation for whether to proceed with implementation.

### Risks

- **Medium-High (implementation).**  Cross-plugin risk — visualisation
  plugins may have their own settings contracts.  Background images may
  have loading / copyright / path issues.  Performance impact on phones
  may be significant.

---

## P3 — Later Ideas

These are worth doing but depend on earlier work or audits:

- **Visual preset implementation** — after P2 audit.
- **Haptic / audio feedback** — optional setting; requires Web Audio cleanup.
- **Section map enhancement** — after audit of current behaviour.
- **Custom visual overlay support** — only if a future visual plugin
  captures pointer events and prevents current canvas-targeted gestures.
  The current 3D Highway overlay is verified as pass-through (no fix needed).
- **Background image presets** — after visual audit confirms support.
- **Visual theme packs** — low priority; brainstorming only.
- **More sheet outside-tap / Escape close** — small UX polish.
- **Bottom nav keyboard / visualViewport handling** — handle on-screen keyboard overlap and related viewport resizing gracefully.
- **Core early no-flash hook** — plugin preboot reduces the old
  menu/sidebar flash after plugin load, but true zero-frame removal likely
  needs core support because `#v3-sidebar` can paint from initial HTML
  before plugins load.

---

## Feature Slice Template

Use this template when starting a new feature slice:

### Feature name

- **Problem:**  What is broken or missing?
- **Goal:**  What should be true when done?
- **Scope:**  Device / mode / screen.  What IS included?
- **Out of scope:**  What is explicitly NOT included?
- **Audit required:**  Yes / No.  If yes, list audit questions.
- **Files likely touched:**
- **First implementation slice:**
- **Validation:**
  ```powershell
  cd D:\Development\GIT\feedBack-plugin-mobile-ui
  git status --short
  git diff --stat -- .
  git diff --check -- .
  Get-ChildItem .\src -Filter *.js | ForEach-Object { node --check $_.FullName }
  node --check .\screen.js
  ```
- **Manual regression:**
  - [ ] Phone portrait Player
  - [ ] Phone low-height landscape Player
  - [ ] Tablet portrait Player
  - [ ] Tablet landscape Player
  - [ ] Desktop unchanged
  - [ ] Player rotation
  - [ ] Leave / re-enter Player
  - [ ] No duplicate injected controls
  - [ ] Enable / disable setting
  - [ ] Pause-on-More setting
  - [ ] Debug setting
  - [ ] Practice
  - [ ] Lyrics
  - [ ] Speed slider and speed peek
  - [ ] Home
  - [ ] Song Library
  - [ ] Progress
  - [ ] Settings
  - [ ] Plugins
  - [ ] Playlists / Favorites / Saved for Later
  - [ ] No console errors
- **Rollback plan:**  What to revert if the slice causes a regression.

---

## Validation

Standard validation commands (run after every change):

```powershell
cd D:\Development\GIT\feedBack-plugin-mobile-ui
git status --short
git diff --stat -- .
git diff --check -- .
Get-ChildItem .\src -Filter *.js | ForEach-Object { node --check $_.FullName }
node --check .\screen.js
```

## Manual Regression Areas

After any Player or navigation change, verify at minimum:

- [ ] Phone portrait Player
- [ ] Phone low-height landscape Player
- [ ] Tablet portrait Player
- [ ] Tablet landscape Player
- [ ] Desktop unchanged
- [ ] Player rotation (portrait ↔ landscape)
- [ ] Leave and re-enter Player
- [ ] No duplicate injected controls after refresh / screen change
- [ ] Enable / disable setting works and persists
- [ ] Pause-on-More setting works and persists
- [ ] Debug setting works and persists
- [ ] Practice opens and closes correctly
- [ ] Lyrics toggles and shows active indicator
- [ ] Speed slider and speed value peek work
- [ ] Home screen ok
- [ ] Song Library screen ok
- [ ] Progress screen ok
- [ ] Settings screen ok
- [ ] Plugins screen ok
- [ ] Playlists / Favorites / Saved for Later ok
- [ ] No console errors
