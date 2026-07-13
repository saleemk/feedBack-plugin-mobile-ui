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

## Priority Overview

| Priority | Item | Why | Status |
|---|---|---|---|
| **P1** | Mobile Player quick exit | Exit was buried under More → Advanced → Close | Done |
| **P1** | Touch main navigation | Top-left hamburger/sidebar is awkward on touch layouts | Done — compact/wide bottom nav implemented |
| **P2** | Viewport profile polish | Better portrait / landscape fit per device | Partially done — shell topbar/status polish done; broader review remains |
| **P2** | Mobile Highway Gestures | Useful mobile highway interaction | Tap-to-play and vertical scrub implemented; advanced gestures remain later |
| **P2** | Visual preset audit | Improve bland stock visuals safely | Audit first |
| **P3** | Double-tap loop markers | Useful after single-tap gesture is stable | Later |
| **P3** | Visual scrub feedback | Optional polish if scrub needs visible feedback | Later |
| **P3** | Section map enhancement | Only if current behaviour is lacking | Audit first |
| **P3** | Audio / haptic feedback | Nice polish; more cleanup risk | Later |
| **P3** | Visual preset implementation | High impact but cross-plugin risk | After audit |

---

## P1 — Mobile Player Quick Exit

### Problem

On phone portrait the only way to exit the Player is:

> More → Advanced → (scroll to bottom) → ✕ Close player

That is **three taps**, and the target is buried inside a scrollable panel.
This is too slow for a common action.

### Goals

- Phone portrait: exit the Player with **one obvious action**.
- Tablet portrait / landscape: exit without going through Advanced.
- Desktop: unchanged.
- Use the existing core exit path (do not invent a new one).

### Possible designs

1. **Back / Library icon directly in the bottom controls row**
   (alongside rewind / play / forward / speed / More/direct chips).
2. **Exit as a first-class More shelf action** (not hidden under Advanced).

### Audit questions (before implementation)

- What is the current core exit path?
  - Does it call `showScreen('library')` or `window.feedBack.navigate(…)`?
  - Is there an `#btn-exit` or similar element we can `.click()`?
  - Does the Advanced panel's "✕ Close player" button call a public function?
- Does core emit an event when the player closes (e.g. `player:exit`)?
- Is there a keyboard shortcut (Escape) whose handler we can reuse?

### First safe slice

Add a **Back / Library chip** to the More shelf action list (phone portrait)
that triggers the same exit behaviour as the Advanced panel's close button.
Do not move or remove the existing Advanced close button.

**Status:** ✅ Done.  Phone portrait More shelf now shows **Library** as the
first action.  It calls `window.feedBack.requestExitSong()` and does not appear
in tablet direct chips, phone low-height landscape chips, or desktop.

### Second slice — Visible Home / Library icon button

Add a compact **Home / Library icon button** directly in the bottom controls
row, visually separated to the left of the transport controls, so exiting the
Player is a one-tap visible action on every mobile/tablet layout.

**Status:** ✅ Done.

- **Phone portrait** Player: Home icon button in the bottom controls row
  (leftmost, `order: 0; margin-inline-end: auto`).
- **Phone low-height landscape** Player: same Home icon button.
- **Tablet portrait** Player: same Home icon button.
- **Tablet landscape** Player: same Home icon button.
- All call `window.feedBack.requestExitSong()` — the safe core exit path.
- Phone portrait More shelf still retains Library as the first shelf action.
- No Library text chip was added to phone landscape or tablet direct chips.
  Direct chips remain: Visuals, Audio, Mixer, Lyrics, Plugins, Practice, Advanced.
- Desktop unchanged.
- Advanced close button still exists as core fallback.

### Done criteria

- [x] **Near-term:** phone portrait can exit Player from a first-class
  More shelf action (≤ 2 taps).
- [x] **Target:** one-tap visible Back / Library action where space allows
  (icon in bottom controls row on phone portrait, phone landscape,
  tablet portrait, tablet landscape).
- [x] Tablet: exit Player without opening the Advanced panel.
- [x] Uses the existing core action (`window.feedBack.requestExitSong()`).
- [x] Desktop unchanged.
- [x] No duplicate controls.
- [x] No regression to More shelf / direct chips.

### Risks

- **Low.**  This bridges into an existing core action.  The core exit path
  already exists and works.

---

## P1 — Touch Main Navigation

### Problem

The main UI used a **top-left menu / hamburger/sidebar**.  On touch layouts
this is:
- small,
- in the top corner (hard to reach one-handed),
- awkward for thumb-driven navigation.

### Goals

- Phone: provide a thumb-friendly navigation entry point.
- Tablet / phone landscape: use the extra width for a wider direct nav.
- Desktop: unchanged.
- The existing drawer / navigation must remain the **source of truth** —
  no duplicate routing.

### Possible designs

1. **Bottom navigation bar** with tabs for key screens:
   Home · Library · Progress · Plugins · More.
2. **Floating bottom Menu pill** that opens the existing drawer
   (superseded — was the first safe slice, now replaced).
3. **Bottom drawer handle** that triggers the existing menu.

### Audit questions (before implementation)

- What is the current shell / nav DOM structure?
- How does the existing drawer open / close (CSS class, JS handler)?
- Can we safely `.click()` the existing hamburger button?
- Are there screen-change events (`screen:changed`) we need to stay in
  sync with?
- Does the current drawer update its active-item state when we navigate
  via other means?

### First safe slice (superseded)

A **floating bottom-right Menu pill** (phone portrait only) that clicked the
existing hamburger button.  This was the initial safe bridge — it proved the
concept while leaving the core drawer untouched.

**Status:** ✅ Done, then removed.  The floating Menu pill has been replaced
by the bottom navigation bar (see below).

### Current implementation — Touch bottom navigation

Touch non-Player screens use a Mobile UI **bottom navigation bar**.

**Compact phone portrait nav:**

**Home | Library | Progress | Plugins | More**

**Wide touch nav for phone landscape and tablet:**

**Home | Library | Progress | Unlockables | FeedBarcade | Plugins | Settings | More**

- **Home** → `window.showScreen('v3-home')`
- **Library** → `window.showScreen('v3-songs')`
- **Progress** → `window.showScreen('v3-progress')`
- **Plugins** → `window.showScreen('v3-plugins')`
- **Unlockables / FeedBarcade / Settings** appear directly in wide mode.
- **More** → opens a Mobile UI translucent bottom sheet (does **not** open
  the core drawer/sidebar)

**More sheet:**
- Built dynamically from remaining core nav items in `#v3-nav a[data-v3-nav]`.
- Excludes the direct nav items for the current mode.
- Includes the remaining available core/plugin nav items for the current
  mode: Playlists, Favorites, Saved for Later, Lessons, Settings,
  FeedBarcade, Unlockables/Shop, and any plugin-added nav items present in
  the core sidebar, excluding items already exposed directly in that mode.
- Item clicks use the original core nav `<a>` element, preserving core and
  plugin nav behaviour.
- Two-column grid layout, glass styling matching the bottom nav.

**Status:** ✅ Done.

- The old floating Menu pill is removed (zero references in code).
- Bottom nav is hidden on Player and desktop.
- Core drawer is never opened by bottom nav More.
- Core sidebar / hamburger are hidden while Mobile UI bottom nav is active.
- Core `#v3-nav` remains the source of truth for available More sheet items.
- Active state on primary tabs uses CSS-only via existing
  `mobile-ui-screen-*` root classes.
- Content padding on `#v3-main` via `mobile-ui-has-bottom-nav` root class.
- First-paint old menu/sidebar flash handling has been improved:
  - disabled convention fixed to `mobile_ui.disabled === '1'`;
  - tablet landscape preboot detection expanded beyond 1024 px widths;
  - inline preboot style added before `src/main.js` import.
- A tiny old-menu/sidebar flash may still remain on hard refresh because
  plugin code loads after the core shell can paint.  True zero-frame removal
  likely needs a core early-load hook.

### Done criteria

- [x] Phone has a thumb-friendly navigation entry point.
- [x] Phone landscape / tablet have a wider touch nav.
- [x] Existing core nav remains source of truth for available More items.
- [x] Desktop unchanged.
- [x] No route duplication or desync.

### Risks

- **Low-Medium.**
  - More sheet item collection depends on core nav DOM (`#v3-nav a[data-v3-nav]`).
    If core restructures its sidebar markup, `_collectRemainingNavItems()` must
    be updated.
  - Outside-tap / Escape key close for the More sheet is future polish.
  - Keyboard / `visualViewport` overlap with the bottom nav on iOS is future
    polish.
  - True no-flash hiding of the old core sidebar before the first paint may
    require core support, because `#v3-sidebar` exists in initial v3 HTML.

---

## P2 — Viewport Profile Polish

### Problem

The current mobile / tablet UI works but needs more deliberate fit for
portrait and landscape modes.  This is especially important on the Player,
but also applies to shell, navigation, and screen layouts.

### Goals

Treat each viewport profile as a separate layout target.  No one-size-fits-all.

### Profiles

| Profile | Focus |
|---|---|
| **Phone portrait** | Maximise highway / content space.  Thumb-friendly controls.  Avoid top/bottom crowding.  More shelf usable without covering too much. |
| **Phone low-height landscape** | Minimise vertical waste.  Inline chips usable.  Panels don't cover too much highway.  Scrolling chip strips ok. |
| **Tablet portrait** | Use available width / height better.  Don't force phone-style cramped layouts.  Don't over-size controls. |
| **Tablet landscape** | Preserve highway space.  Direct actions accessible.  Avoid panel placement issues.  Direct chip row readable and scroll-safe. |
| **Standalone / app-like** | Detect `display-mode: standalone`.  Adjust safe-area / overscroll behaviour if needed. |

### Implemented / Audited

- **Implemented:** phone low-height landscape Player chip strip polish.
  The direct chip strip remains a scroll-safe horizontal strip with fade
  masks on the edges.  Scoped to phone low-height landscape Player only.
  Tablet and desktop unaffected.
- **Implemented:** compact/wide touch bottom navigation.
  Phone portrait uses compact primary tabs; phone landscape and tablet use
  a wider direct nav.  Player and desktop remain excluded.
- **Implemented:** touch topbar layout polish.
  - Home touch topbar:
    row 1 is title/welcome left and Support Us right;
    row 2 is compact status cards.
  - Non-Home touch topbar:
    row 1 is screen title left and Support Us right;
    row 2 is status cards;
    row 3 is Library search only.
  - Library search now sits below the title/status area.
  - Applies to phone/tablet non-Player screens.  Desktop unchanged.
- **Implemented:** shared compact status-card rules for touch topbars.
  Tuning / instrument / streak cards share the same visual height.  The
  streak/rank card may be wider, but is no longer taller and keeps its mini
  signal graph visible.
- **Audited:** tablet portrait Player controls.  Layout math shows
  transport + speed slider + 7 chips fit at ~768 px width with ~70 px of
  slack.  No code change was made.  A real-device screenshot is still
  useful for visual confirmation.

### Audit / screenshots needed

- Current screenshots of each profile on the Player screen.
- Identify specific areas that feel cramped, wasted, or misaligned.

### First safe slice (completed)

Phone low-height landscape Player chip strip polish (CSS-only).

### Next possible slice

Screenshot-led phone portrait or tablet portrait polish, **only if** a
concrete spacing / crowding issue is visible.

### Done criteria

- [x] Phone low-height landscape Player reviewed and adjusted.
- [x] Tablet portrait Player audited — no change made; layout appears to fit.
- [x] Touch bottom nav has compact and wide modes.
- [x] Home and non-Home touch topbars use the accepted row model.
- [x] Touch topbar status cards have equal visual height with mini graph visible.
- [ ] Each remaining profile independently reviewed and adjusted.
- [ ] No regressions to desktop.
- [ ] No regressions to other profiles.

### Risks

- **Low.**  CSS-only, scoped to device / orientation classes already in use.

---

## P2 — Mobile Highway Gestures

### Implemented

- **Tap-to-play:** touch or pen tap on the actual current `#highway` canvas
  toggles play / pause.
- **Vertical scrub:** touch or pen vertical drag on the actual current
  `#highway` canvas scrubs through the song.
- Player screen only.  Phone / tablet only.  Desktop / mouse excluded.
- Uses delegated `pointer` listeners from `#player`.
- Uses safe core paths:
  - `#btn-play.click()` for play / pause.
  - `window.seekBy()` for relative scrub steps.
- Scrub direction:
  - drag down seeks forward.
  - drag up seeks backward.
  - one second per step.
- Uses scoped `touch-action` CSS on phone / tablet Player `#highway` so the
  browser does not cancel the pointer stream before scrub activates.
- Does **not** touch highway renderer or canvas internals.
- Ignores interactive targets (buttons, inputs, selects, sliders, panels,
  More shelf, direct chips).
- No double-tap loop, haptics, audio feedback, gesture settings, or visual
  scrub overlay implemented yet.
- **Verified:** the current 3D Highway wrapper (`.h3d-wrap`) and its child
  canvases use `pointer-events: none`, so touch / pen events pass through
  to `#highway`.  Tap-to-play and vertical scrub work with the observed
  3D setup — no code change needed.  Other custom visual plugins may need
  verification in the future if they capture pointer events.

### Inspiration only

The old **Slopsmith Mobile Note Highway** plugin had additional gesture
ideas (double-tap loop, vertical scrub).  Those are **ideas**, not
code to copy.  fee[dB]ack APIs and DOM structure are different.

### Gesture candidates

- **Tap highway** → play / pause.
- **Double-tap highway** → cycle loop markers (A → B → Clear).
- **Vertical drag / swipe on highway** → scrub through song.
- **Section map drag / tap** enhancement (only if current behaviour is
  lacking).
- Optional haptic feedback.
- Optional audio / whoosh feedback.
- Optional scrub sensitivity setting.

### Phased plan

#### G0 — Audit (no code)

- Identify the safe fee[dB]ack play / pause API.
- Identify the safe seek API.
- Identify the safe loop A / B / Clear API.
- Check whether `#highway` receives pointer / touch events cleanly.
- Check whether core already has gesture or pointer handlers.
- Check interaction with panels, buttons, sliders, select boxes, direct
  chips, More shelf, Practice, and Lyrics.
- Check Section Map current tap / drag behaviour.

#### G1 — Gesture infrastructure

- Add a dedicated gesture module (`src/gestures.js`).
- Do **not** put large gesture logic into `src/player.js`.
- Player-screen only.
- Phone / tablet only.
- Idempotent listener lifecycle.
- Cleanup on disable, destroy, screen change, and rotation.
- Ignore interactive targets: `button`, `input`, `select`, `textarea`,
  `a`, sliders, panels / popovers, More shelf / direct chips.
- Multi-touch → cancel or ignore.
- No duplicate listeners after refresh.

#### G2 — Single tap

- Tap empty highway area → play / pause.
- Prefer triggering the existing core play button / action path.
- Delay single-tap execution until double-tap window expires (avoid
  conflict).
- Do not directly manipulate audio unless the audit confirms it is safe.

#### G3 — Double tap

- Double tap empty highway area → cycle loop markers (A → B → Clear).
- Must use current fee[dB]ack loop APIs.
- Small visual feedback (brief highlight / pulse).

#### G4 — Vertical scrub

- Drag vertically on highway → scrub.
- Start only after movement threshold.
- Prevent accidental page scroll only after scrub mode is confirmed.
- Update position through safe core seek path.
- No audio / whoosh feedback in first scrub slice.

**Status:** ✅ Done.  Uses `window.seekBy()` in one-second relative steps.
Drag down seeks forward; drag up seeks backward.  Scoped `touch-action` CSS
keeps the browser from cancelling the pointer stream on phone / tablet Player
`#highway`.

#### G5 — Section map

- Audit existing Section Map behaviour first.
- Enhance only if there is a real gap.
- Do not duplicate or fight the existing Section Map plugin.

#### G6 — Haptic / audio feedback

- Optional later setting.
- Haptics small and not spammy.
- Audio feedback / whoosh optional and disabled by default.
- Web Audio cleanup must be explicit.

### Done criteria (for G2, the first implementation slice)

- [x] G0 audit complete.
- [x] Tap highway → play / pause works (touch / pen only, phone / tablet only).
- [x] Does not fire on panels, buttons, sliders, chips, shelf.
- [x] Cleanup on disable / screen change / rotation.
- [x] Desktop unaffected.
- [ ] Does not conflict with double-tap (deferred — double-tap not yet implemented).

### Done criteria (for G4, vertical scrub)

- [x] G0 audit confirmed safe `window.seekBy()` path.
- [x] Drag down on highway seeks forward.
- [x] Drag up on highway seeks backward.
- [x] Scrub uses stepped relative seeking, not absolute seek mutation.
- [x] Scrub does not also trigger tap-to-play on release.
- [x] Desktop unaffected.
- [x] Does not touch highway renderer or canvas internals.

### Risks

- **Medium.**  Accidental play / pause while interacting with panels.
- Conflict with sliders / chips / buttons.
- Scroll / gesture conflicts in mobile browsers.
- Incorrect seek / loop API assumptions.
- Duplicate listeners after refresh / rotation.

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

- **Double-tap loop markers** — after single-tap gesture (G2) is stable.
- **Section map enhancement** — after audit of current behaviour.
- **Haptic / audio feedback** — optional setting; requires Web Audio
  cleanup.
- **Custom visual overlay support** — only if a future visual plugin
  captures pointer events and prevents current canvas-targeted gestures.
  The current 3D Highway overlay is verified as pass-through (no fix
  needed).
- **Visual preset implementation** — after P2 audit.
- **Background image presets** — after visual audit confirms support.
- **Visual theme packs** — low priority; brainstorming only.
- **Optional gesture settings** — sensitivity, enable / disable per gesture.
- **README screenshots** — once the UI is visually stable.
- **Bottom nav icon / label polish** — if text-only labels feel too sparse.
- **More sheet outside-tap / Escape close** — small UX polish for the
  bottom nav More sheet.
- **Bottom nav keyboard / visualViewport handling** — handle iOS keyboard
  overlap gracefully.
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
