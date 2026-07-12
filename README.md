# Mobile UI

A touch-optimized mobile and tablet interface plugin for fee[dB]ack v3. Mobile
UI improves navigation, library screens, collections, settings, plugins, and
the Player on phones and tablets while leaving desktop behavior to core.

The plugin is optimized for phones and tablets in portrait and landscape.
Desktop is intentionally left unchanged. Browser and device testing is ongoing,
so the focus is practical touch improvements without core edits.

## What You Get

- cleaner mobile/tablet shell, topbar, and drawer navigation
- compact Home, Song Library, Progress, Settings, Plugins, and Collections views
- touch-friendly Player speed and action controls
- phone portrait More shelf for secondary Player actions
- direct tablet action chips with no hidden More layer
- direct low-height landscape chips for phones
- mobile/tablet plugin settings polish
- enable/disable switch, debug view toggle, and optional pause-on-More

## Player Experience

### Phone

In phone portrait, the Player shows a compact More icon. Tapping it opens a
persistent shelf with Visuals, Audio, Mixer, Lyrics, Plugins, Practice, and
Advanced.

In low-height phone landscape, the Player uses direct inline action chips
instead of the More shelf so the controls stay fast and horizontal.

Speed controls are cleaned up for touch use: duplicate indicators and presets
are hidden, the slider uses a compact pill style, and a speed value peek appears
while dragging.

### Tablet

Tablet has enough room for direct access, so it does not use the phone More
button. Tablet portrait and tablet landscape show inline action chips for
Visuals, Audio, Mixer, Lyrics, Plugins, Practice, and Advanced.

In touch Player modes, the old v3 rail is visually hidden but kept in the DOM so
Mobile UI can reuse core rail actions instead of reimplementing them.

### Desktop

Desktop stays with the core fee[dB]ack Player. Mobile UI does not replace the
desktop Player or change desktop layouts.

| Device/mode | Behavior |
| --- | --- |
| Phone portrait | More icon opens a persistent shelf. |
| Phone low-height landscape | Direct inline action chips. No More shelf. |
| Tablet portrait | Direct inline action chips. No More button or More shelf. |
| Tablet landscape | Direct inline action chips. No More button or More shelf. |
| Desktop | Core Player remains unchanged. |

Player touch features include:

- speed bars, chevrons, and presets hidden in touch modes
- speed slider pill styling
- speed value peek while dragging
- static speed label hidden in touch modes
- restart/retry hidden in touch modes
- Lyrics active-state sync
- Practice special handling
- glass/translucent panels
- phone, tablet, and landscape panel positioning
- optional pause when opening the phone portrait More shelf

## Screen Coverage

| Area | Status | Notes |
| --- | --- | --- |
| Shell/topbar/drawer | active | Mobile drawer and status rail polish. |
| Home | active | Mobile/tablet layout polish. |
| Song Library | active | Toolbar, options, and content polish. |
| Progress | active | Mobile/tablet layout polish. |
| Settings | active | Mobile/tablet spacing, tabs, and forms. |
| Plugins | active | Phone list mode and row-to-settings bridge. |
| Playlists/Favorites/Saved for Later | active | Collection layout polish. |
| Lessons/FeedBarcade/Unlockables | mapped/light-touch | Screen detection retained; visual styling skipped or reverted. |
| Player | active | Touch controls, speed cleanup, panels, and rail bridge. |

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

Pause-on-More applies only to the phone portrait More shelf. It does not apply
to tablet direct action chips or phone low-height landscape chips.

## Installation

Clone this repo into your fee[dB]ack `plugins/` directory as `mobile_ui`, then
restart fee[dB]ack or reload the page.

```bash
cd /path/to/feedback/plugins
git clone https://github.com/saleemk/feedBack-plugin-mobile-ui.git mobile_ui
```

Mobile UI is a normal standalone plugin. It does not need fee[dB]ack core files
to be edited.

## Compatibility / Known Limits

- Optimized for phone and tablet portrait/landscape layouts.
- Desktop behavior is intentionally left to core.
- Lessons, FeedBarcade, and Unlockables are mapped/light-touch rather than fully
  restyled.
- Highway, canvas, camera, renderer, and core Player internals are out of scope.

## Technical Notes

- Built as a standalone fee[dB]ack plugin.
- Player controls reuse core actions where practical instead of replacing the
  underlying Player systems.
- Detailed architecture and maintenance notes live in `AGENTS.md`.

## Maintainers / AI Agents

See [AGENTS.md](AGENTS.md) for the detailed maintainer guide, architecture
notes, selector risks, Player mode map, validation commands, and regression
checklist.
