# iOS 4.1 SpringBoard evidence audit

Canonical target: iPhone 4 GSM (`iPhone3,1`), iOS 4.1, build `8B117`,
portrait orientation. This document records evidence only. It does not approve
visually similar assets from later iOS releases.

## Evidence classes

- **ORIGINAL** — Apple firmware, Apple documentation, or an original captured
  artifact tied to the target generation.
- **SOURCE-DERIVED** — a conclusion derived from period APIs, contemporary
  tooling, or measurements, but not directly read from SpringBoard 8B117.
- **VISUAL-CROSSCHECK** — supported by dated screenshots/video but not by an
  extracted binary or asset.
- **UNKNOWN** — insufficient evidence for implementation; treat as HOLD.

Confidence is stated separately because a period screenshot may be visually
strong evidence without being an original build artifact.

## 1. Framebuffer and coordinate system

### ORIGINAL

- The iPhone 4 portrait framebuffer is **640 × 960 physical pixels**. Apple
  identifies the iPhone 4 as a 2010 model; contemporary device material and the
  period design reference record the 640 × 960 display.
- The interface coordinate space is **320 × 480 logical points**. Retina assets
  are supplied at twice the linear resolution. Therefore `1 pt = 2 px` in this
  target portrait path.
- The status bar is **20 logical points / 40 physical pixels** high.
- Pre-notch iPhone 4 has no modern safe-area inset. The screen is rectangular;
  SpringBoard reserves the status-bar band rather than applying modern notch,
  home-indicator, or rounded-corner safe areas.

Sources: [2011 iOS design reference](https://appletree.or.kr/quick_reference_cards/Apple-Mac-iOS/iOS-Design-Cheat-Sheet.pdf),
[Apple iPhone 4 documentation index](https://support.apple.com/en-us/docs/iphone/132927),
[period iPhone 4 launch coverage](https://www.wired.com/2010/06/live-blog-apples-iphone-centric-wwdc-2010/).

### SOURCE-DERIVED

- SpringBoard layout should be expressed in the 320 × 480 logical coordinate
  space, while bitmap resources use `@2x`/Retina dimensions where supplied.
  A 114 × 114 icon bitmap renders as 57 × 57 logical points.
- Home-screen usable geometry is:
  - status bar: logical `x=0, y=0, w=320, h=20`
  - content below status bar: logical `x=0, y=20, w=320, h=460`
- A contemporary `libimobiledevice` SpringBoard manager models a 320 × 480
  stage, a 90-point bottom dock region, four columns, 76-point horizontal
  advances and 88-point vertical advances. This is useful corroboration, not
  Apple SpringBoard source and therefore not authoritative for final pixels.

Source: [sbmanager source at revision `aac359e`](https://cgit.libimobiledevice.org/sbmanager.git/tree/src/sbmanager.c?id=aac359ee78746785f9796cb7343ba9dbb610abe2).

### VISUAL-CROSSCHECK

- Dated iOS 4 screenshots show the wallpaper and icons continuing behind the
  translucent status bar, with the first icon row below it and the dock pinned
  to the screen bottom.
- The Apple Wiki file history contains two 640 × 960 iOS 4 captures uploaded
  December 28, 2010. The current file was later overwritten with an iOS 9
  image, so only the dated historical revisions are relevant.

Source: [The Apple Wiki iOS 4 screenshot history](https://theapplewiki.com/wiki/File%3AIOS4.jpg).

### UNKNOWN

- Exact internal SpringBoard 8B117 point-to-pixel rounding rules have not been
  recovered from the binary.
- Exact bounds of every icon/label/dock sublayer require measurement of an
  original 640 × 960 capture or inspection of the 8B117 SpringBoard binary.

## 2. Status bar evidence

### ORIGINAL

- Height: **20 pt / 40 px**.
- The status bar includes cell signal, carrier, network type, centered time,
  optional Bluetooth state, optional numeric battery percentage, and battery
  glyph. The period Apple user guide documents the status icons and their
  meanings.
- Time is centered in the full screen, not merely in the remaining flexible
  space between left and right status items.

Sources: [iPhone 4/iOS 4 user-guide transcription](https://www.manualshelf.com/manual/apple/iphone-4-a1332/iphone-user-guide.html),
[period iOS design reference](https://appletree.or.kr/quick_reference_cards/Apple-Mac-iOS/iOS-Design-Cheat-Sheet.pdf).

### SOURCE-DERIVED

Approximate logical regions for a SoftBank/3G/percentage-visible state are
listed only as implementation study ranges. Variable carrier text and optional
indicators change the left/right packing.

| Element | Approximate logical region | Confidence |
|---|---:|---|
| Signal | `x≈3..22, y=4..16` | Medium |
| Carrier (`SoftBank`) | `x≈24..72, y=3..17` | Medium |
| Network (`3G`) | `x≈75..92, y=3..17` | Medium |
| Time | centered around `x=160`, `y=3..17` | High |
| Bluetooth | right-side cluster, before percentage | Medium |
| Battery percentage | immediately before battery glyph | Medium |
| Battery glyph | rightmost cluster, ending near `x=317` | Medium |

- Background treatment is a dark/translucent status-bar layer over the
  wallpaper on SpringBoard. Exact opacity, gradients, highlights and compositing
  remain unmeasured.

### VISUAL-CROSSCHECK

- July 2010 iOS 4.1 beta screenshots document the revised iPhone 4 signal-bar
  graphics. June 2010 iOS 4 GM galleries show the same overall status-bar order
  and centered time.

Sources: [Cult of Mac, July 14 2010](https://www.cultofmac.com/news/quick-look-ios-4-1-beta),
[Redmond Pie iOS 4 GM gallery, June 14 2010](https://www.redmondpie.com/ios-4.0-screenshots-gallery-iphone/).

### UNKNOWN

- Original 8B117 status-bar glyph files, exact glyph bounds, text font files,
  kerning and compositing values have not been recovered.
- The project’s CSS-drawn signal, Bluetooth and battery shapes are not original
  assets and are not approved by this audit as pixel-authentic.

## 3. Icon grid system

### ORIGINAL

- Portrait iPhone SpringBoard uses **four columns × four rows**, excluding the
  dock.
- iPhone 4 SpringBoard icon resources are **114 × 114 pixels**, displayed at
  **57 × 57 logical points**.
- The period design reference reports an approximately **20-pixel Retina corner
  radius** (10 logical points) for the icon artwork/mask.

Source: [period iOS design reference](https://appletree.or.kr/quick_reference_cards/Apple-Mac-iOS/iOS-Design-Cheat-Sheet.pdf).

### SOURCE-DERIVED

The contemporary SpringBoard-management client uses the following model:

- page start: `x=16`, `y=16` within its SpringBoard content actor
- horizontal advance: `76 pt`
- vertical advance: `88 pt`
- label placement: centered in a 59-point item group, `y = icon-group y + 62`
- four items per row

Because that client is a visual management utility rather than Apple’s actual
SpringBoard, these are **not final canonical coordinates**. With the 20-point
status bar accounted for, they suggest icon study bounds near:

```text
columns x ≈ 16, 92, 168, 244
rows    y ≈ 36, 124, 212, 300  (screen coordinates)
icon    w = 57, h = 57
```

This model’s 76-point column advance implies approximately 19 points between
57-point icon boxes; its 88-point row advance includes label and inter-row
space. Treat all listed origins as medium-confidence calibration candidates,
not implementation approval.

Source: [sbmanager layout code](https://cgit.libimobiledevice.org/sbmanager.git/tree/src/sbmanager.c?id=aac359ee78746785f9796cb7343ba9dbb610abe2).

### VISUAL-CROSSCHECK

- Period captures show white, centered labels below each icon, with a dark
  shadow making the text legible over wallpaper.
- Label size is visually consistent with roughly 10–12 logical pixels. The
  management client uses a bold 10-pixel substitute font, but `FreeSans` is not
  the iOS font and cannot establish Apple’s exact typography.

### UNKNOWN

- Exact icon origins, Apple mask path, corner-radius rasterization and gloss
  overlay for build 8B117.
- Exact label font face/weight, point size, baseline, truncation width, shadow
  offset, blur and alpha.
- Exact badge anchor, font and glossy badge assets.

## 4. Dock system

### ORIGINAL

- Default iPhone dock contains **four icons**: Phone, Mail, Safari and iPod.
- The dock remains fixed while SpringBoard pages move horizontally.
- iOS 4 uses a skeuomorphic, glass-shelf-style dock rather than the earlier
  simple black treatment or any later blurred/flat dock.

Sources: [period iPhone guide commentary](https://api.pageplace.de/preview/DT0400.9781449397845_A23800910/preview-9781449397845_A23800910.pdf),
[Apple iOS 4 user guide](https://files.customersaas.com/files/Manual/Apple_iPhone_4_User_manual.pdf).

### SOURCE-DERIVED

- Contemporary tooling reserves the bottom **90 logical points**, `y=390..480`,
  for the dock.
- For four items it models 60-point item groups separated by 16 points,
  centered as a group. This yields group origins approximately
  `x=16, 92, 168, 244`, with dock-local `y=8`.
- Dock label baseline placement is modeled at dock-local `y≈67`.

Source: [sbmanager dock layout](https://cgit.libimobiledevice.org/sbmanager.git/tree/src/sbmanager.c?id=aac359ee78746785f9796cb7343ba9dbb610abe2).

### VISUAL-CROSSCHECK

- Period screenshots show the reflective glass shelf, icon shadows/reflections,
  and four evenly spaced dock icons.

### UNKNOWN

- Exact dock background filename, dimensions, cap insets, highlight, reflection
  strength, and icon/label pixel bounds from 8B117 are unrecovered.

## 5. Wallpaper

### ORIGINAL

- iOS 4 introduced user-selectable Home-screen wallpaper on iPhone 4.
- Target-native wallpaper raster size is expected to be 640 × 960 for the
  iPhone 4 display, but the exact file must be recovered from the 8B117 root
  filesystem before implementation.

Source: [Apple-era iOS 4 user guide reporting](https://www.macrumors.com/2010/06/23/apple-posts-user-guide-for-iphone-4-and-ios-4/).

### VISUAL-CROSSCHECK

- Period default-installation imagery consistently shows the dark water-droplet
  wallpaper associated with iOS 4. This identifies the visual family, not an
  approved raster.

### UNKNOWN

- Exact 8B117 wallpaper filename, SHA hash, color profile and encoded dimensions.
- Whether the original asset is presented 1:1, center-cropped, or transformed
  by SpringBoard for the exact target state.
- Wallpaper aggregator copies and modern upscales are not acceptable evidence.

**HOLD:** recover the wallpaper from the verified iPhone3,1 8B117 filesystem or
an equivalently provenance-complete original package.

## 6. Default app icon assets

An icon is READY only when the exact period PNG is recovered from the 8B117
filesystem or an original dated IPA. Visual sightings establish identity but
not usable asset provenance.

| Icon | Evidence | Expected native size | Format | Confidence / status |
|---|---|---:|---|---|
| Phone | Default dock documented by period guide | 114 × 114 | PNG expected | System identity high; asset **HOLD** |
| Safari | Default dock documented by period guide | 114 × 114 | PNG expected | System identity high; asset **HOLD** |
| Mail | Default dock documented by period guide | 114 × 114 | PNG expected | System identity high; asset **HOLD** |
| iPod | Default dock documented by period guide | 114 × 114 | PNG expected | System identity high; asset **HOLD** |
| Messages | Visible in default iOS 4 captures | 114 × 114 | PNG expected | Identity high; asset **HOLD** |
| Calendar | Visible in default iOS 4 captures; date is dynamically composited | 114 × 114 base plus overlays | PNG plus runtime layers | **HOLD** |
| Photos | Visible in default iOS 4 captures | 114 × 114 | PNG expected | Identity high; asset **HOLD** |
| Camera | Visible in default iOS 4 captures | 114 × 114 | PNG expected | Identity high; asset **HOLD** |
| Facebook | A 2010 iPhone app and Retina-compatible update are documented | 114 × 114 likely in period IPA | PNG expected | Period identity medium; exact IPA/icon **HOLD** |
| Twitter | Official iPhone client existed in 2010 | 114 × 114 likely in period IPA | PNG expected | Exact October 20 version **HOLD** |
| Instagram | Launch-era app existed in October 2010 | 114 × 114 likely in period IPA | PNG expected | Exact October 20 version **HOLD** |
| Foursquare | 2010 app visually documented | 114 × 114 likely in period IPA | PNG expected | Exact IPA/icon **HOLD** |
| Flickr | Period iPhone app evidence incomplete | Unknown until IPA recovery | Unknown | **HOLD** |
| Tumblr | Period iPhone app evidence incomplete | Unknown until IPA recovery | Unknown | **HOLD** |

Supporting period references:

- [Facebook Retina/iOS 4 update, June 30 2010](https://techcrunch.com/2010/06/30/facebook-iphone-4/)
- [Facebook for iPhone in 2010 archive page](https://www.webdesignmuseum.org/iphone/facebook-for-iphone-in-2010)
- [Instagram launch-era timeline](https://en.wikipedia.org/wiki/Timeline_of_Instagram)
- [The Apple Wiki dated iOS 4 screenshot history](https://theapplewiki.com/wiki/File%3AIOS4.jpg)

No icon artwork is approved for import by this audit.

## 7. SpringBoard behavior

### ORIGINAL

- Horizontal swipe changes Home-screen pages.
- Page dots indicate the number of pages and the current page.
- Tapping an icon launches that application.
- Touch-and-hold enters icon rearrangement (wiggle) mode.
- Dragging one icon onto another creates a folder; folders were introduced in
  iOS 4 and can be placed on a page or in the dock.
- App badges are red numbered badges anchored to the icon’s upper-right area.
- The four dock items persist while pages are swiped.

Sources: [Apple iOS 4 user guide](https://files.customersaas.com/files/Manual/Apple_iPhone_4_User_manual.pdf),
[June 2010 iOS 4 screenshot gallery](https://www.redmondpie.com/ios-4.0-screenshots-gallery-iphone/),
[contemporary iOS 4 feature gallery](https://www.cbsnews.com/pictures/whats-new-in-ios-4/).

### SOURCE-DERIVED

- Icon page/dock state is stored as ordered rows and groups. Contemporary
  SpringBoard tooling serializes four icons per row and separate dock items.
- Page indicator dots use different active/inactive opacity and are centered as
  a group in the contemporary tooling model.

Source: [sbmanager source](https://cgit.libimobiledevice.org/sbmanager.git/tree/src/sbmanager.c?id=aac359ee78746785f9796cb7343ba9dbb610abe2).

### UNKNOWN

- Exact swipe threshold, easing curve, duration and rubber-banding constants.
- Exact wiggle animation, deletion badge and folder-opening animation geometry.
- These behaviors are not required until the project enables page navigation,
  editing, or folders; they remain HOLD.

## 8. Current implementation gap analysis

| Feature | Current project | Historical evidence | Action |
|---|---|---|---|
| Framebuffer | 320 × 480 logical screen | 640 × 960 at 2× | Keep |
| Status-bar height | 20 px logical | 20 pt / 40 px Retina | Structurally ready |
| Status-bar glyphs | CSS/SVG reconstruction | Original glyph assets unrecovered | HOLD exact visuals |
| Wallpaper | CSS gradient | Original iOS 4 raster required | Replace only after recovery |
| Grid | Four CSS columns, ten placeholders | Four columns × four rows | Rebuild coordinates after exact measurement |
| Icon size | 57 × 57 placeholder box | 114 × 114 asset rendered at 57 × 57 | Size ready; artwork HOLD |
| Horizontal spacing | CSS grid-derived, not canonical | Contemporary model suggests 76-pt advance | HOLD exact origin/advance |
| Vertical spacing | 18 px CSS row gap | Contemporary model suggests 88-pt advance | HOLD exact origin/advance |
| Labels | Generic 10 px text | White bold period labels with shadow | HOLD exact font/baseline/shadow |
| Badges | CSS red badge | Period red glossy upper-right badges | Preserve data; HOLD artwork/geometry |
| Dock | Missing | Four fixed icons on glass shelf | Structure known; visuals/assets HOLD |
| Page dots | Missing | Centered current-page indicator | Behavior known; exact assets/geometry HOLD |
| Icon launch | Buttons disabled | Tap launches app | Enable only with app implementation |
| Folders/editing | Missing | Supported in iOS 4 | Out of current minimum scope; HOLD |

Current implementation references inspected:
`src/device/App.tsx` SpringBoard rendering and `src/styles/device.css` status,
grid, icon and badge rules.

## 9. Implementation readiness

### READY

- 640 × 960 physical / 320 × 480 logical coordinate model.
- 2× Retina mapping.
- No modern safe-area inset.
- 20-point status-bar reservation.
- Four-column by four-row page capacity.
- 114 × 114 native icon resources rendered at 57 × 57 logical points.
- Four-item persistent dock semantics.
- Default dock application identities: Phone, Mail, Safari, iPod.
- Basic page swipe, page-dot, tap-to-launch, badge, rearrangement and folder
  behavior at the semantic level.

### HOLD

- Exact 8B117 status-bar assets and per-element pixel coordinates.
- Exact SpringBoard icon origins, advances, label baseline and typography.
- Exact icon mask/gloss/shadow compositing.
- Exact dock raster, cap insets, reflection and icon coordinates.
- Original 8B117 default wallpaper raster and crop behavior.
- All requested system icon files until extracted from the verified filesystem.
- All requested social icon files until recovered from dated original IPAs.
- Badge artwork and precise geometry.
- Page-dot assets and precise animation constants.

The next evidence-safe recovery step is filesystem extraction from the verified
`iPhone3,1_4.1_8B117_Restore.ipsw`, followed by hashes and metadata for
SpringBoard, wallpaper, dock, status and system-app resources. Third-party icons
require separately provenance-complete October 2010 IPA archives.

## Lock-screen cross-reference

The persistent camera grabber beside `slide to unlock` is **not present in iOS
4.1** and must not be implemented for build 8B117. It is an iOS 5.1-era control.
Evidence and the rejected implementation decision are recorded in
[`ios4.1-lockscreen-camera.md`](./ios4.1-lockscreen-camera.md).
