# iOS 4.1 SpringBoard Evidence Audit v0.1

## Scope and evidence standard

Target: iPhone 4 (`iPhone3,1`), iOS 4.1, build `8B117`, portrait.

This is an audit only. No SpringBoard rendering, placeholders, state logic, or assets were modified. Classifications used below:

- **READY**: sufficiently evidenced structure or already correct implementation behavior.
- **HOLD**: historically expected, but exact target-build artwork, geometry, or behavior is not yet proven or implemented.
- **REJECTED**: a current placeholder or substitute that must not be promoted as authentic.

Primary local evidence:

| Evidence | Path | Verification |
| --- | --- | --- |
| Exact SpringBoard executable | `tmp/firmware/rootfs/recovered/SpringBoard.app/SpringBoard` | 1,575,168 bytes; SHA-256 `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d` |
| Exact UIKit wallpaper | `tmp/firmware/rootfs/recovered/UIKit.framework/DefaultWallpaper@2x~iphone.png` | 640×960 CgBI PNG; SHA-256 `f23cc973f4f2d8eb619de29f58948a924527a3edf9698f3acc5913493029287f` |
| Folder icon background | `tmp/firmware/rootfs/recovered/SpringBoard.app/FolderIconBG@2x.png` | 118×124 CgBI PNG; SHA-256 `17f5fff5e4456e77d2fe53efa35a22f4fd26c677a7a903e7f26c3f4226417f10` |
| Icon darkening overlay | `tmp/firmware/rootfs/recovered/SpringBoard.app/IconDarkeningOverlay@2x.png` | 118×124 CgBI PNG; SHA-256 `4b42402d4483261b1753d21a82c169be2c57688fb1d16bc6a64f2c6b09f83ef3` |

The exact binary contains the build path `/SourceCache/SpringBoard/SpringBoard-1205.49/` and explicit identifiers for `SBDockBG.png`, `SBDockBGT-Portrait.png`, `SBBadgeBG.png`, `SBBadgeBGMask.png`, `WallpaperIconShadow`, `WallpaperIconDockShadow`, page control, folder creation/opening, and separate/shared Lock/Home wallpaper handling. These prove system capabilities and artwork names, but not final dimensions or composition where the named raster has not yet been recovered from shared artwork.

External primary corroboration:

- Apple specifies the iPhone 4 Retina display as 960×640 pixels: [iPhone 4 Technical Specifications](https://support.apple.com/en-euro/112562).
- Apple’s archived icon requirements identify 57×57 Home-screen icons and 114×114 Retina counterparts for iOS 6.1 and earlier: [Technical Q&A QA1686](https://developer.apple.com/library/archive/qa/qa1686/_index.html).

## 1. Framebuffer and layout

The physical portrait framebuffer is **640×960 pixels** and the corresponding interface space is **320×480 points at 2×**. The current `.screen` is exactly 320×480 CSS pixels, so its base coordinate system is **READY**.

### Current grid geometry

The current implementation is one CSS grid containing ten disabled buttons:

| Property | Current implementation |
| --- | --- |
| Status-bar reservation | 20 points |
| Grid origin | `.apps` begins below the status bar; padding origin `x=9`, `y=38` in screen coordinates |
| Columns | 4 |
| Populated rows | 3 (4 + 4 + 2 items); no explicit four-row page model |
| Content width | 302 points after 9-point side padding |
| Column track width | 68 points |
| Column track origins | `x=9, 87, 165, 243` |
| 57-point icon-box origins | approximately `x=14.5, 92.5, 170.5, 248.5` due to centering in each track |
| Horizontal track gap | 10 points; effective icon-box gap 21 points |
| Icon box | 57×57 points |
| Icon-to-label gap | 5 points |
| Label | generic 10 px text; centered; line-height inherited as normal |
| Row gap | 18 points; inferred row advance approximately 90 points |
| Dock | absent |

Fractional icon origins arise from centering a 57-point box inside a 68-point track. That is a current-browser layout consequence, not evidenced SpringBoard rounding.

### Historical comparison

Portrait iPhone SpringBoard uses four columns and supports four rows above a persistent dock. A contemporary SpringBoard-management implementation models 76-point horizontal and 88-point vertical advances, suggesting study origins around `x=16, 92, 168, 244` and screen `y≈36, 124, 212, 300`; it is corroboration rather than Apple source: [libimobiledevice sbmanager layout](https://cgit.libimobiledevice.org/sbmanager.git/tree/src/sbmanager.c?id=aac359ee78746785f9796cb7343ba9dbb610abe2).

| Layout feature | Current | Historical target | Status |
| --- | --- | --- | --- |
| Screen coordinate system | 320×480 | 320×480 / 640×960 at 2× | **READY** |
| Columns | 4 | 4 | **READY** |
| Page rows | incidental 3 populated rows | up to 4 rows above dock | **HOLD** |
| Icon size | 57×57 placeholder | 57×57 display from 114×114 source | size **READY**, artwork **HOLD** |
| Origins/spacing | CSS grid; fractional origins | fixed SpringBoard placement | **HOLD** |
| Label baseline | normal-flow CSS | system-managed fixed baseline | **HOLD** |
| Dock | none | fixed four-item dock | **HOLD** |

## 2. Icon rendering

Authentic iPhone 4 Home-screen icon sources are 114×114 Retina pixels and render at 57×57 points. The system applies its own icon presentation pipeline; exact 8B117 mask, gloss, shadow, pressed darkening, and badge composition must not be replaced with hand-drawn approximations.

The recovered 118×124 `FolderIconBG@2x.png` and `IconDarkeningOverlay@2x.png` demonstrate that SpringBoard-owned presentation can extend beyond the 114×114 application bitmap. They do not authorize treating 118×124 as the application icon source size.

Current rendering:

- `icon-hold` is a 57×57 dark translucent rounded box with dashed border and literal `HOLD` text.
- No application PNG is loaded.
- An arbitrary 11-point CSS corner radius is applied directly to the placeholder.
- There is no authentic mask, gloss, icon shadow, or pressed overlay.
- Labels use the project’s inherited Arial/Helvetica stack at 10 px with a generic black text shadow.
- Badges are CSS red capsules with CSS border and generic text.

| Icon subsystem | Classification |
| --- | --- |
| 57×57 logical footprint | **READY** |
| 114×114 Retina contract | **READY** |
| Current dashed placeholders as historical visuals | **REJECTED** |
| Authentic system and third-party icon PNGs | **HOLD** |
| System corner mask/gloss/shadow pipeline | **HOLD** |
| Exact label font, weight, width, baseline, truncation, and shadow | **HOLD** |
| Current badge data values and persistence | **READY as application state only** |
| Current CSS badge artwork and geometry | **REJECTED** |
| Exact `SBBadgeBG`/mask raster extraction and composition | **HOLD** |

## 3. Dock

The iOS 4.1 phone dock is a persistent four-item dock, conventionally Phone, Mail, Safari, and iPod, on skeuomorphic glass/shelf artwork. It remains fixed while icon pages move horizontally.

Exact 8B117 SpringBoard strings confirm `SBDockBG.png`, `SBDockBGT-Portrait.png`, `SBDockBG-old.png`, `SBDockMask.png`, `SBDockMask-72.png`, `WallpaperIconDockShadow`, `showDock`, `hideDock`, `visibleIconsInDock`, and a distinct dock model. This is strong source evidence for an artwork-backed dock and separate dock icon treatment. It does not establish blur; describing the iOS 4 dock as a modern runtime blur would be inaccurate.

Current implementation has no dock container, no dock background, no dock icons, and no fixed/page separation. The `hold-note` at the bottom is not a dock.

| Dock item | Status |
| --- | --- |
| Four-icon persistent behavior | **READY as documented requirement** |
| Phone/Mail/Safari/iPod identities | **READY as historical structure** |
| Current implementation | **HOLD — absent** |
| Exact dock raster, dimensions, cap/stretch data, reflections, and shadows | **HOLD** |
| Modern CSS blur substitute | **REJECTED** |

## 4. Wallpaper

### Current

SpringBoard currently renders:

```css
background: linear-gradient(160deg, #1a2730, #51696d 55%, #172026);
```

It has no image provenance, intrinsic dimensions, image scaling, or crop behavior. It is a generated placeholder and is **REJECTED** as historical wallpaper.

### Verified target asset

The exact firmware contains `UIKit.framework/DefaultWallpaper@2x~iphone.png`, a 640×960 CgBI PNG with SHA-256 `f23cc973f4f2d8eb619de29f58948a924527a3edf9698f3acc5913493029287f`. The byte-identical tracked copy currently lives under the Lock Screen asset directory, but SpringBoard does not reference it.

The exact SpringBoard binary confirms `homescreen-wallpaper`, `SBUseUniqueHomeScreenWallpaper`, `lockScreenAndHomeScreenShareWallpaper`, `wallpaper-image`, and `updateWallpaperOffsets`. Therefore Home and Lock wallpaper may be distinct or shared according to preferences. The archive proves the default raster; it does not alone prove the pristine 8B117 Home-screen preference choice or exact crop/pan behavior.

| Wallpaper question | Status |
| --- | --- |
| Exact default 640×960 water-drop raster | **READY** |
| Current CSS gradient | **REJECTED** |
| Direct 1:1 mapping at 320×480 if chosen | geometrically compatible at 2× |
| Exact initial Home wallpaper assignment | **HOLD** |
| Runtime crop, pan, zoom, and shared/separate preference | **HOLD** |

## 5. Social Media 2010 application context

Classification distinguishes whether an application belongs in the target-era concept from whether its exact icon artwork is usable.

| Application | Era/identity | Authentic target icon | Overall implementation status |
| --- | --- | --- | --- |
| Messages | Built-in iOS 4 application | Not recovered/promoted | **HOLD artwork; identity READY** |
| Calendar | Built-in; icon requires dynamic date composition | Base and overlays not recovered | **HOLD** |
| Photos | Built-in iOS 4 application | Not recovered/promoted | **HOLD artwork; identity READY** |
| Camera | Built-in iOS 4 application | Not recovered/promoted | **HOLD artwork; identity READY** |
| Facebook | Period iPhone application | Exact 2010 IPA/icon absent | **HOLD** |
| Twitter | Official iPhone client existed by May 2010 | Exact target-date IPA/icon absent | **HOLD** |
| Instagram | Launch-era iPhone application existed in October 2010 | Exact launch IPA/icon absent | **HOLD** |
| Foursquare | Period iPhone application | Exact target-date IPA/icon absent | **HOLD** |
| Flickr | Official native iPhone app launched in September 2009 | Exact target-date IPA/icon absent | **HOLD** |
| Tumblr | Period iPhone application identity is plausible | Provenance-complete 2010 IPA/icon absent | **HOLD** |

The official [Flickr launch post](https://blog.flickr.net/en/2009/09/10/the-new-flickr-iphone-app/) confirms its native iPhone app before the target era. A contemporary report dates official Twitter for iPhone to May 2010: [Twitter for iPhone launch report](https://techcrunch.com/2010/05/19/yes-folks-the-official-iphone-twitter-app-is-here-screen-shots-2/). These establish era presence, not icon bytes.

No current `HOLD` box is acceptable replacement icon artwork. No app is **REJECTED** merely for its identity; the generated placeholder visuals are **REJECTED** as final representations.

## 6. Interaction audit

| Behavior | Historical iOS 4.1 | Current implementation | Classification |
| --- | --- | --- | --- |
| Tap icon | Launches application | Buttons are `disabled`; no tap transition | **HOLD** |
| Horizontal pages | Swipe between pages; dock remains fixed | One static grid; no page container or dots | **HOLD** |
| Badges | System artwork at upper-right; dynamic app value | Values exist and persist; CSS substitute renders | data **READY**, visual **REJECTED** |
| Reordering | Touch-and-hold enters rearrangement | Missing | **HOLD** |
| Folders | Drag one icon onto another; open/close folder UI | Missing, although exact firmware proves folder system/assets | **HOLD** |
| App launch state | Application becomes active | `app` exists in the device phase type, but no icon reaches it and no app view renders | **HOLD** |
| Home button from app | Returns to SpringBoard | State transition exists but is unreachable from current icons | logic **READY**, end-to-end **HOLD** |

The exact 8B117 binary contains folder creation/open/close, page-control, dock, badge, and rearrangement-related symbols. This confirms these are target-build behaviors without requiring modern references.

## 7. Implementation gap summary

| Area | Current | Required next evidence | Status |
| --- | --- | --- | --- |
| Framebuffer | Correct 320×480 logical container | None | **READY** |
| Grid | Four CSS columns, ten placeholders | Exact 8B117 origins, advances, row bounds, and rounding | **HOLD** |
| Icons | Correct nominal box size only | Exact system bundle icons and dated original third-party IPAs | **HOLD** |
| Mask/shadow/gloss | Generic rounded placeholder | Recover/map SpringBoard/UIKit presentation artwork and semantics | **HOLD** |
| Labels | Generic CSS text | Exact font metrics and SpringBoard layout | **HOLD** |
| Badges | Persistent values with CSS visual | Extract `SBBadgeBG`/mask and determine anchor/font | **HOLD** |
| Dock | Missing | Extract named 8B117 dock artwork and composition | **HOLD** |
| Wallpaper | CSS gradient | Establish initial Home preference and runtime placement for verified raster | **HOLD** |
| Pages/dots | Missing | Page-control assets/geometry and interaction constants | **HOLD** |
| Folders | Missing | Existing exact resources need promotion plus runtime forensics | **HOLD** |
| App launch | Disabled | Authentic app views and explicit launch routing | **HOLD** |

## Confirmed facts

- iPhone 4 uses a 640×960 physical Retina display and this simulator uses the correct 320×480 logical screen.
- The historical Home-screen icon contract is 114×114 Retina pixels rendered at 57×57 points.
- Four columns, four page rows, a fixed four-icon dock, pages, badges, folders, and Home wallpaper are consistent with the target generation and corroborated by exact 8B117 SpringBoard symbols.
- The verified default water-drop wallpaper exists as an exact 640×960 firmware asset.
- The current SpringBoard has only the correct logical screen size, four-column count, nominal icon size, and persistent badge data. Its wallpaper, icon visuals, badge visuals, geometry, dock, and interactions are not historically complete.

## Stop condition

This document records evidence and gaps only. No application code or asset was added, removed, or altered.
