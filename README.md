# Mobile UI

A touch-optimized phone and tablet interface plugin for fee[dB]ack. Mobile
UI improves shell navigation, Home, Song Library, Progress, Settings, Plugins,
Collections, Player controls, and touch gestures while leaving desktop behavior
to core.

The plugin is optimized for phones and tablets in portrait and landscape.
Browser and device testing is ongoing, so the focus is practical touch
improvements with honest limits.

> **Early testing:** Please include your device, browser, orientation,
> screenshots, and console errors when reporting issues.

## What You Get

- touch bottom navigation on phone/tablet non-Player screens
- compact phone portrait nav: **Home · Library · Progress · Plugins · More**
- wide touch nav for phone landscape/tablet:
  **Home · Library · Progress · Unlockables · FeedBarcade · Plugins · Settings · More**
- translucent More sheet for remaining screens, built from the app's nav
- visible Home/Library Player exit button on phone and tablet
- phone portrait Player More shelf
- phone landscape/tablet direct Player action chips
- tap-to-play and vertical highway scrub gestures
- Home and non-Home topbar/status rail polish
- Song Library search below the title/status rail
- compact aligned status cards with the streak mini graph preserved
- enable/disable, debug, and optional pause-on-More settings

## Navigation

On phone portrait non-Player screens, Mobile UI shows:

**Home · Library · Progress · Plugins · More**

On phone landscape and tablet non-Player screens, Mobile UI shows:

**Home · Library · Progress · Unlockables · FeedBarcade · Plugins · Settings · More**

**More** opens a Mobile UI translucent sheet for the remaining screens. The
sheet uses the existing app/plugin navigation entries, so fee[dB]ack's own nav
remains the source of truth.

The Player hides the bottom nav and uses Player-specific controls. Desktop keeps
the core navigation. While the Mobile UI bottom nav is active, the old core
sidebar/hamburger is hidden after Mobile UI initializes.

On some devices, a tiny refresh flash of the old core menu/sidebar may still
appear because plugins load after the core shell can paint. Runtime layout
corrects once Mobile UI initializes.

## Topbar and Screens

Home uses a touch-friendly topbar with the welcome/title on the left, Support Us
on the right, and compact status cards below.

Non-Home screens use the same pattern: screen title left, Support Us right, and
status cards below. Song Library adds search below the title/status area.

The tuning, instrument, and streak/rank status cards are compact and aligned.
The streak/rank card can be wider, but it should not be taller, and its mini
signal graph remains visible.

## Player Experience

### Phone

In phone portrait, the Player shows a compact **Home/Library exit button** on
the left side of the controls row. Tapping More opens a persistent shelf with
Library first, followed by Visuals, Audio, Mixer, Lyrics, Plugins, Practice,
and Advanced.

In low-height phone landscape, the Player shows the same Home/Library exit
button and direct inline action chips instead of a More shelf.

Pause-on-More applies only to the phone portrait More shelf.

### Tablet

Tablet portrait and tablet landscape show the **Home/Library exit button** and
direct inline action chips for Visuals, Audio, Mixer, Lyrics, Plugins,
Practice, and Advanced. Tablet does not use the phone More shelf.

### Gestures

On phone/tablet Player:

- tap the highway to play or pause
- drag vertically on the highway to scrub
- drag down seeks forward
- drag up seeks backward

Desktop/mouse behavior is excluded.

### Desktop

Desktop stays with the core fee[dB]ack Player. Mobile UI does not replace the
desktop Player or desktop layouts.

| Device/mode | Behavior |
| --- | --- |
| Phone portrait | Home/Library exit button + More shelf with Library first. |
| Phone low-height landscape | Home/Library exit button + direct inline action chips. No More shelf. |
| Tablet portrait | Home/Library exit button + direct inline action chips. No More shelf. |
| Tablet landscape | Home/Library exit button + direct inline action chips. No More shelf. |
| Desktop | Core Player remains unchanged. |

Player touch features include speed cleanup, speed slider pill styling, speed
value peek while dragging, Lyrics active-state sync, Practice handling, and
glass/translucent panels.

## Screen Coverage

| Area | Status | Notes |
| --- | --- | --- |
| Shell/topbar/nav | active | Touch bottom nav, More sheet, shared topbar/status rail polish. |
| Home | active | Mobile/tablet layout and status rail polish. |
| Song Library | active | Title/status/search layout, toolbar, options, and content polish. |
| Progress | active | Mobile/tablet layout and status rail polish. |
| Settings | active | Mobile/tablet spacing, tabs, and forms. |
| Plugins | active | Touch layout and plugin screen polish. |
| Playlists/Favorites/Saved for Later | active | Collection layout polish. |
| Lessons/FeedBarcade/Unlockables | mapped/light-touch | Available in navigation; lighter-touch than main screens. |
| Player | active | Touch controls, quick exit, gestures, speed cleanup, panels. |

## Usage

Open fee[dB]ack on a phone or tablet. Mobile UI activates automatically when the
plugin is enabled.

Use **Settings -> Plugins -> Mobile UI** for plugin options. Desktop users keep
the core interface.

## Settings

Mobile UI provides:

- **Enable mobile UI enhancements** - turns the plugin's layout changes on or off
- **Pause song when opening More controls** - pauses playback when opening the
  phone portrait More shelf
- **Show Mobile UI debug view** - displays runtime/device diagnostics while
  debugging

Pause-on-More does not apply to tablet direct chips or phone low-height
landscape chips.

## Installation

Clone this repo into your fee[dB]ack `plugins/` directory as `mobile_ui`, then
restart fee[dB]ack or reload the page.

```bash
cd /path/to/feedback/plugins
git clone https://github.com/saleemk/feedBack-plugin-mobile-ui.git mobile_ui
```

### Docker / local mount

If you run fee[dB]ack with Docker, mount the plugin folder into the container:

```yaml
services:
  web:
    volumes:
      - ../feedBack-plugin-mobile-ui:/app/plugins/mobile_ui
```

Then restart the container so the server discovers the updated `plugin.json`.

## Testing / Feedback

Help test Mobile UI on your devices. Areas to try:

- phone portrait bottom nav
- phone landscape/tablet wide bottom nav
- More sheet navigation
- old sidebar/hamburger stays hidden after Mobile UI initializes
- known tiny refresh flash, if your device still shows it
- Home topbar/status cards
- Library title/status/search layout
- Progress, Plugins, and Settings topbar/status layout
- Player Home/Library exit button
- Player More shelf and direct chips
- highway tap-to-play and vertical scrub gestures
- enable/disable setting
- desktop unchanged

When reporting issues, include:

- device model
- browser and version, if known
- portrait or landscape
- which screen/page the issue happened on
- screenshot or short video
- console errors, if available
- whether Mobile UI settings were enabled or disabled

## Compatibility / Known Limits

- Optimized for phone and tablet portrait/landscape layouts.
- Desktop behavior is intentionally left to core.
- Lessons, FeedBarcade, and Unlockables are lighter-touch than Home, Library,
  Progress, Settings, Plugins, and Player.
- Highway, canvas, camera, renderer, and core Player internals are out of scope.
- A tiny old menu/sidebar flash can still appear during refresh on some devices
  because the core shell can paint before plugins load. Runtime layout corrects
  after Mobile UI initializes. A true zero-frame fix likely needs core support.

Planned but not implemented yet:

- double-tap loop markers
- optional gesture settings
- haptic/audio feedback
- mobile visual/highway preset audit
- visual preset implementation
- README screenshots
- More sheet outside-tap/Escape polish
- keyboard/visualViewport handling for bottom nav

See [ROADMAP.md](ROADMAP.md) for the full plan and priorities.

## Technical Notes

- Built as a standalone fee[dB]ack plugin.
- Player controls reuse core actions where practical instead of replacing the
  underlying Player systems.
- Detailed architecture and maintenance notes live in [AGENTS.md](AGENTS.md).

## Maintainers / AI Agents

See [AGENTS.md](AGENTS.md) for the detailed maintainer guide, architecture
notes, selector risks, Player mode map, validation commands, and regression
checklist.
