# Instagram 2010 Visual Reconstruction v1.0

## Checkpoint A scope

Target: Instagram initial 1.x-era iPhone application, October 2010, iPhone 4 / iOS 4.1.

Checkpoint A changes only the shared Instagram navigation/tab shell, Feed presentation, and Popular grid. Share/source, Filters, News content, Profile content, Camera, Photos, persistence, device chrome, and narrative data remain outside this checkpoint.

## Evidence

Primary visual evidence is the Web Design Museum's 320×480 Instagram 2010 Feed, Filters, Popular, Location, and Profile screenshots. October 2010 Macworld, VentureBeat, Wired, and TechCrunch reporting corroborates the launch feature set but does not authenticate individual application-bundle rasters.

No original Instagram 1.x bundle artwork is present in the repository. Every new Instagram chrome asset in `src/assets/instagram/chrome` is therefore `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.

## Shared shell classification

| Decision | Value | Classification |
| --- | --- | --- |
| System status bar | 320×20pt, unchanged shared renderer | **CONFIRMED** |
| Instagram application surface | 320×460pt | **CONFIRMED** |
| Top navigation | x=0, y=0, w=320, h=44pt | **CONFIRMED** screenshot measurement |
| Root content | x=0, y=44, w=320, h=368pt | **CONFIRMED** derived from screenshot regions |
| Bottom tabs | x=0, y=412, w=320, h=48pt | **CONFIRMED** screenshot measurement |
| Tab division | five 64pt divisions | **CONFIRMED** |
| Blue/steel nav gradient and bevel values | CSS approximation | **RECONSTRUCTED** |
| Charcoal tab material and selected highlight | CSS approximation | **RECONSTRUCTED** |
| Raised Share housing | 64×36pt visible housing inside an approximately 64×54pt control, protruding 6pt | **RECONSTRUCTED** |
| Feed/Popular/Share/News/Profile icon silhouettes | Screenshot-derived standalone SVG reconstructions | **RECONSTRUCTED** |
| Exact original bundle icon pixels and pressed states | unavailable | **HOLD** |

## Feed classification

| Decision | Value | Classification |
| --- | --- | --- |
| Center script wordmark instead of system text | required by period Feed screenshot | **CONFIRMED** |
| Wordmark raster/path identity | standalone SVG using a period-style script face | **RECONSTRUCTED** |
| Refresh control at upper right | visible in period Feed screenshot | **CONFIRMED** |
| Refresh glyph pixels/material | reconstructed SVG plus shared nav button | **RECONSTRUCTED** |
| Metadata row | 42pt | **PROBABLE** screenshot measurement within 1pt |
| Avatar | 30×30pt at 7pt left inset | **PROBABLE** screenshot measurement |
| Photo | 305×305pt, 7pt left / 8pt right inset, centered cover | **PROBABLE** screenshot measurement |
| Relative timestamp units | minutes, hours, days from simulated device time | **RECONSTRUCTED** formatting behavior |
| Exact early-Instagram rounding and `now` behavior | unavailable | **HOLD** |

Canonical timestamps remain unchanged. Rendering uses the simulated 2010 device `Date`, never the host clock. Invalid timestamps conservatively render `now`; future timestamps clamp to the current-minute presentation.

Feed identities, June's curated avatar/media, post order, followed-account filtering, and the timed deletion/replacement events are unchanged. No likes, comments, captions, avatars, or posts were added.

## Popular classification

| Decision | Value | Classification |
| --- | --- | --- |
| Four fixed columns | period Popular screenshot | **CONFIRMED** |
| 80pt outer cell pitch | 320pt / four columns | **CONFIRMED** |
| 76×76pt visible image with 2pt inset | screenshot-derived approximation | **RECONSTRUCTED** |
| Grid begins immediately below the 44pt nav | period screenshot | **CONFIRMED** |
| Centered-cover crop | conservative rendering of existing square media | **PROBABLE** |
| Exact original Popular ranking/crops | unavailable | **HOLD** |

All twenty existing Popular records, their deterministic order, refresh counter behavior, scroll restoration, and Photo Detail/back state are unchanged. Popular Photo Detail remains `HOLD` except for inheriting the shared shell.

## Asset register

The following are `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`, not authenticated or extracted originals:

- `instagram-wordmark-2010-reconstructed.svg`
- `instagram-feed-2010-reconstructed.svg`
- `instagram-popular-2010-reconstructed.svg`
- `instagram-share-2010-reconstructed.svg`
- `instagram-news-2010-reconstructed.svg`
- `instagram-profile-2010-reconstructed.svg`
- `instagram-refresh-2010-reconstructed.svg`

## HOLD / later checkpoints

- Original Instagram bundle artwork and cap-stretched control assets
- Exact Feed refresh network/runtime behavior
- Popular Photo Detail chrome
- Share/source and Camera Roll integration
- Filters screen and filmstrip
- News content/empty-state reconstruction
- Profile title/action/content reconstruction
