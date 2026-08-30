# iOS 4.1 SpringBoard Reconstruction v1.0

Target: SOCIAL MEDIA, 2010; iPhone 4; iOS 4.1; en-US portrait; 2010-10-20 U.S. Pacific Time.

## Canonical structure

| Rule | Classification | Implementation |
| --- | --- | --- |
| 4×4 page grid | PERIOD-EVIDENCE / CONFIRMED | fixed sixteen-slot arrays and four explicit CSS tracks |
| Four dock icons | PERIOD-EVIDENCE / CONFIRMED | Messages, Safari, Camera, YouTube |
| iOS 4 folder system | PERIOD-EVIDENCE / CONFIRMED | shared linen/shadow/notch expansion tray and existing reducer |
| Utilities stock folder | PERIOD-EVIDENCE | Clock, Calculator, Compass, Voice Memos |
| Social folder | PROJECT-CANON / PERIOD-COMPATIBLE | preserved on Page 2 with six existing social applications |
| Game Center on iOS 4.1 | PERIOD-EVIDENCE / CONFIRMED | exact `Game Center~iphone.app` target-build icon |
| Water-droplet wallpaper | CURRENT PROJECT VISUAL TARGET / PERIOD-CONSISTENT | unchanged exact existing URL/crop |
| DeviantArt 2026 icon pack | MODERN RECONSTRUCTION / VISUAL-CROSSCHECK ONLY | not imported |

## Fixed geometry

- Screen: 320×480 logical points.
- Grid origin: `(16,36)`.
- Presentation slot: 59×74 points.
- Column origins: `16, 92, 168, 244`; centers: `45.5, 121.5, 197.5, 273.5`.
- Row origins: `36, 124, 212, 300`; centers: `73, 161, 249, 337`.
- Page-dot control: fixed top 386 / center 391; independent of populated rows.
- Dock layout region: 84 points at Y=396; exact 320×45 dock artwork remains bottom-aligned at Y=435.
- Labels: local top 62, 14-point line box, compact Helvetica-family fallback and existing dark shadow.

## Placement

Page 1:

| Row | Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- | --- |
| 1 | Calendar | Photos | Stocks | Utilities |
| 2 | Maps | Weather | Notes | iTunes |
| 3 | App Store | Game Center | Settings | Empty |
| 4 | Empty | Empty | Empty | Empty |

Page 2 preserves `Social` at row 1, column 1. The dock remains `Messages | Safari | Camera | YouTube`. The former Page 1 copies of all four dock apps were removed.

## Folder behavior

Both folders use the existing `closed → opening → open → closing → closed` reducer and remain inside SpringBoard context. The authenticated full-width linen, edge shadows, and selected-column notch are reused. Panel height follows the target-build formula `125 + 85 × (rows − 1)`: Utilities uses one row / 125 points; Social uses two rows / 210 points. Tap outside and device Home retain the existing close path.

Utilities miniatures and tray entries use exact 8B117 icons. Social miniatures and tray entries represent the existing Facebook, Twitter, Foursquare, Tumblr, Flickr, and Instagram runtimes. Their period icon bytes remain HOLD, so the visual marks are explicitly isolated reconstructions rather than claimed originals.

## Scope boundary

No application container, reducer, seeded content, story, timestamp, notification count, device status bar, wallpaper raster, wallpaper crop, device lifecycle, or Home-button runtime was changed. Newly visible stock apps have no invented application implementation. The Calendar icon receives only the target-date `Wednesday / 20` SpringBoard overlay.
