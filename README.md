# Mobile UI

A touch-optimized phone and tablet interface plugin for [fee[dB]ack](https://github.com/got-feedBack/feedBack). Mobile
UI improves shell navigation, Home, Song Library, Progress, Settings, Plugins,
Collections, Player controls, and touch gestures while leaving desktop behavior
to core.

The plugin is optimized for phones and tablets in portrait and landscape.
Browser and device testing is ongoing, so the focus is practical touch
improvements with honest limits.

> **Testing and feedback:** Please include your device, browser, orientation,
> screenshots, and console errors when reporting issues.

## What You Get

- touch bottom navigation on phone/tablet non-Player screens
- fixed Home plus a horizontally scrollable touch navigation strip
- automatic inclusion of valid fee[dB]ack core/plugin navigation entries
- phone/tablet portrait and landscape support
- visible Home/Library Player exit button on phone and tablet
- phone portrait Player More shelf
- phone landscape/tablet direct Player controls
- quick Arrangement and Difficulty controls
- compact Speed controls
- Player action panels that stay open while their controls are used
- tap-to-play and vertical highway scrub gestures
- responsive Home, Library, Progress, Settings, Plugins, and collection screens
- scoped iPhone standalone rotation handling
- Home and non-Home topbar/status rail polish
- Song Library search below the title/status rail
- compact aligned status cards with the streak mini graph preserved
- enable/disable, debug, and optional pause-on-Player-More settings
- desktop remains controlled by core

## Screenshots

> **Tip:** The screenshots below were taken in standalone (Home Screen) mode
> where available to maximize usable screen space.

Mobile UI adapts its navigation, content density, and Player controls for phone
and tablet portrait/landscape layouts.

### Phone Portrait

<p>
  <img width="280" alt="Mobile UI Home on phone portrait" src="https://github.com/user-attachments/assets/628e319c-cca7-4d16-a97d-a82367824fcb">
  &nbsp;&nbsp;
  <img width="280" alt="Mobile UI Song Library on phone portrait" src="https://github.com/user-attachments/assets/0c13cce1-5207-4979-8e7b-2fa89239f7e8" >
</p>

Fixed Home with scrollable touch navigation, responsive Home cards, and a
touch-friendly two-column Song Library layout.

<p>
  <img width="280" alt="Mobile UI Player controls and Player More shelf on phone portrait" src="https://github.com/user-attachments/assets/b0c41ff6-37f7-4452-ba4c-e3181212d21b">
  &nbsp;&nbsp;
  <img width="280" alt="Mobile UI Plugins screen on phone portrait" src="https://github.com/user-attachments/assets/c9e47a07-2d01-43a6-9b98-ad11d26884ec">
</p>

Phone portrait Player More shelf and touch controls; compact Plugins management
layout.

### Phone Landscape

<p>
  <img width="600" alt="Mobile UI Home on phone landscape" src="https://github.com/user-attachments/assets/27a29499-266a-497b-9e9e-f7edc39bfe9f">
</p>

Landscape Home uses a two-column hero and Continue Playing layout.

<p>
  <img width="600" alt="Mobile UI Song Library on phone landscape" src="https://github.com/user-attachments/assets/03d84e2b-749d-4b04-b072-735cc7221cb2" >
</p>

Landscape Library uses denser cards and touch navigation.

<p>
  <img width="600" alt="Mobile UI Player direct action controls on phone landscape" src="https://github.com/user-attachments/assets/df6d677e-b6ed-41a9-b120-1664c68059b9" >
</p>
<p>
  <img width="600" alt="Mobile UI Player plugin controls panel on phone landscape" src="https://github.com/user-attachments/assets/fd985f50-6dba-47b8-81d2-a73101c68d6d">
</p>

Phone landscape uses direct Player controls. Player category panels remain open
while their controls are used.

### Tablet Player

<p>
  <img width="360" alt="Mobile UI Player on tablet portrait" src="https://github.com/user-attachments/assets/8c2b7b58-0eff-449d-ac79-b6effff0294a" >
</p>
<p>
  <img width="700" alt="Mobile UI Player on tablet landscape" src="https://github.com/user-attachments/assets/d9198276-8480-4b20-8abf-d8c10fcc49a8" >
</p>

Tablet portrait and landscape expose direct Player controls without the phone
portrait Player More shelf.

## Navigation

On phone and tablet non-Player screens, Mobile UI keeps **Home** fixed on the
left and places the remaining destinations in one horizontally scrollable strip.
Swipe the strip to reach Library, Career, Progress, Unlockables, FeedBarcade,
Plugins, Settings, Playlists, Lessons, Favorites, and Saved for Later. The same
navigation design is used across phone and tablet portrait/landscape layouts;
only sizing and available width change.

Mobile UI builds the destination list from fee[dB]ack's existing navigation.
Known destinations keep a consistent mobile order, while additional valid core
or plugin destinations are appended automatically. Hidden or removed
destinations are removed from the mobile navigation, and delayed plugin
destinations can appear when they become available. Tapping a mobile navigation
item invokes the original fee[dB]ack navigation action, so plugin-specific
behavior is preserved.

The active destination is brought into view only when needed, and the horizontal
scroll position is preserved where practical. The Player hides the bottom nav
and uses Player-specific controls. Desktop keeps the core navigation. While the
Mobile UI bottom nav is active, the old core sidebar/hamburger stays in the DOM
as fee[dB]ack's source navigation, but is hidden on active touch layouts after
Mobile UI initializes.

Mobile UI includes a scoped repair for an iPhone standalone
portrait-to-landscape viewport-origin issue that could otherwise shift the page
and misalign touch targets.

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

Phone landscape Home places the hero and Continue Playing cards side by side
when space allows. Phone landscape Home and Song Library use denser card
layouts, while phone portrait keeps the taller touch layout and tablet keeps its
own sizing.

## Player Experience

### Phone

In phone portrait, the Player shows a compact **Home/Library exit button** on
the left side of the controls row, rewind/play/forward transport controls,
compact Speed, and a Player More button. Tapping the Player More button opens
the phone portrait Player More shelf with quick Arrangement and Difficulty
controls plus Visuals, Audio, Mixer, Lyrics, Plugins, Practice, and Advanced.

In low-height phone landscape, the Player shows the same Home/Library exit
button and a shared horizontally scrollable direct-control strip. The strip
starts with Speed, Arrangement, and Difficulty, followed by Visuals, Audio,
Mixer, Lyrics, Plugins, Practice, and Advanced. Arrangement and Difficulty
labels may be visually hidden for space, while accessible labels and current
values remain available.

Pause-on-Player-More applies only to the phone portrait Player More shelf.

### Tablet

Tablet portrait and tablet landscape show the **Home/Library exit button** and
a shared horizontally scrollable direct-control strip. The strip uses the real
Speed control first, then Arrangement, Difficulty, Visuals, Audio, Mixer,
Lyrics, Plugins, Practice, and Advanced. Tablet does not use the phone portrait
Player More shelf.

### Gestures

On phone/tablet Player:

- tap the highway to play or pause
- drag vertically on the highway to scrub
- drag down seeks forward
- drag up seeks backward

Desktop/mouse behavior is excluded.

Action/category panels remain open while users interact with lists, selects,
sliders, buttons, toggles, and plugin controls. Outside taps or category changes
can still close or switch panels. This applies to phone portrait Player More
shelf panels and phone landscape/tablet direct-control panels.

### Desktop

Desktop stays with the core fee[dB]ack Player. Mobile UI does not replace the
desktop Player or desktop layouts.

| Device/mode | Behavior |
| --- | --- |
| Phone portrait | Home/Library exit, transport controls, compact Speed, Player More shelf, Arrangement/Difficulty in the shelf. |
| Phone low-height landscape | Home/Library exit + shared horizontal direct-control strip. No Player More shelf. |
| Tablet portrait | Home/Library exit + shared horizontal direct-control strip. No Player More shelf. |
| Tablet landscape | Home/Library exit + shared horizontal direct-control strip. No Player More shelf. |
| Desktop | Core Player remains unchanged. |

Player touch features include compact Speed controls, quick Arrangement and
Difficulty controls, speed value peek while dragging, Lyrics active-state sync,
Practice handling, core Mixer/Stem Mixer compatibility polish, and
glass/translucent panels.

## Screen Coverage

| Area | Status | Notes |
| --- | --- | --- |
| Shell/topbar/nav | active | Fixed Home, horizontally scrollable dynamic destination strip, shared topbar/status rail polish. |
| Home | active | Responsive portrait layout and two-column phone landscape hero/Continue Playing layout. |
| Song Library | active | Portrait grid, denser landscape cards, title/status/search layout, toolbar, and options polish. |
| Progress | active | Mobile/tablet layout and status rail polish. |
| Settings | active | Mobile/tablet spacing, tabs, and forms. |
| Plugins | active | Touch layout and compact plugin management cards. |
| Playlists/Favorites/Saved for Later | active | Collection layout polish. |
| Lessons/FeedBarcade/Unlockables | mapped/light-touch | Available in navigation; lighter-touch than main screens. |
| Player | active | Quick exit, Speed/Arrangement/Difficulty controls, Player More shelf or direct-control strip by mode, interactive panels, gestures, and iPhone standalone rotation handling. |

## Usage

Open fee[dB]ack on a phone or tablet. Mobile UI activates automatically when the
plugin is enabled.

Use **Settings -> Plugins -> Mobile UI** for plugin options. Desktop users keep
the core interface.

## Settings

Mobile UI provides:

- **Enable mobile UI enhancements** - turns the plugin's layout changes on or off
- **Pause song when opening More controls** - pauses playback when opening the
  phone portrait Player More shelf
- **Show Mobile UI debug view** - displays runtime/device diagnostics while
  debugging

Pause-on-Player-More applies only to the phone portrait Player More shelf. It
does not apply to phone landscape direct controls, tablet direct controls, or
bottom navigation.

## Requirements

- [fee[dB]ack](https://github.com/got-feedBack/feedBack)
- A phone or tablet browser, installed web app, or supported desktop build
- The ability to install or mount external fee[dB]ack plugins

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

## 📱 Best Experience on Phones

Mobile UI works in any supported browser, but the best experience on phones is
achieved when fee[dB]ack is launched in standalone mode from the Home Screen.
This is especially important in phone landscape, where every pixel of vertical
space matters while playing.

### iPhone / iPad (Safari)

- Open fee[dB]ack in Safari.
- Use **Share -> Add to Home Screen**.
- Launch fee[dB]ack from the Home Screen for the best experience.

### Android (Chrome)

- Chrome requires fee[dB]ack to be served over **HTTPS** for Home Screen
  launches to run in standalone mode.
- If you access fee[dB]ack from a normal `http://` LAN address, Chrome creates
  a browser shortcut and the address bar remains visible.
- Launching the HTTPS version from the Home Screen opens fee[dB]ack in
  standalone mode with the full available screen space.

> Mobile UI still works in a normal browser, but standalone mode provides the
> intended touch experience by maximizing the available screen space.

## Testing / Feedback

Help test Mobile UI on your devices. Areas to try:

- fixed Home remains visible in touch navigation
- horizontal destination strip scrolls fully
- all known screens can be reached
- Career appears immediately after Library
- additional plugin destinations appear after known destinations
- hidden or removed plugin destinations disappear
- active destination scrolls into view when needed
- no duplicate destinations after refresh, rotation, or plugin injection
- old sidebar/hamburger stays hidden after Mobile UI initializes
- known tiny refresh flash, if your device still shows it
- Home topbar/status cards
- Library title/status/search layout
- phone landscape Home two-column layout
- phone landscape Library dense cards
- Progress, Plugins, and Settings topbar/status layout
- Player Home/Library exit button
- phone portrait Player More shelf
- phone landscape direct-control strip
- tablet portrait direct-control strip
- tablet landscape direct-control strip
- Speed, Arrangement, and Difficulty remain usable
- sliders drag without unintentionally scrolling the strip
- Arrangement changes once
- Player hides bottom navigation
- Player action panel controls stay usable without closing the panel
- highway tap-to-play and vertical scrub gestures
- iPhone standalone portrait-to-landscape rotation
- bottom-nav hit targets stay aligned after rotation
- enable/disable setting
- desktop unchanged

When reporting issues, include:

- device model
- browser and version, if known
- portrait or landscape
- which screen/page the issue happened on
- screenshot or short video
- console errors, if available
- copied Mobile UI debug text, if the debug view is enabled
- whether Mobile UI settings were enabled or disabled

## Compatibility / Known Limits

- Optimized for phone and tablet portrait/landscape layouts.
- Desktop behavior is intentionally left to core.
- Lessons, FeedBarcade, and Unlockables are lighter-touch than Home, Library,
  Progress, Settings, Plugins, and Player.
- Highway, canvas, camera, renderer, and core Player internals are out of scope.
- Mobile UI includes a scoped correction for an iPhone standalone rotation
  issue discovered during testing. Continued device testing is welcome.
- A tiny old menu/sidebar flash can still appear during refresh on some devices
  because the core shell can paint before plugins load. Runtime layout corrects
  after Mobile UI initializes. A true zero-frame fix likely needs core support.

Planned but not implemented yet:

- double-tap loop markers
- optional gesture settings
- haptic/audio feedback
- mobile visual/highway preset audit
- visual preset implementation
- keyboard/visualViewport handling for bottom nav

See [ROADMAP.md](ROADMAP.md) for the full plan and priorities.

## License

MIT. See [LICENSE](LICENSE).

## Technical Notes

- Built as a standalone fee[dB]ack plugin.
- Player controls reuse core actions where practical instead of replacing the
  underlying Player systems.
- Detailed architecture and maintenance notes live in [AGENTS.md](AGENTS.md).

## Maintainers / AI Agents

See [AGENTS.md](AGENTS.md) for the detailed maintainer guide, architecture
notes, selector risks, Player mode map, validation commands, and regression
checklist.
