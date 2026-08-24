# iOS 4.1 SpringBoard Artwork Evidence Audit v0.2

## Scope

Target: iPhone 4 (`iPhone3,1`), iOS 4.1, build `8B117`.

This is an evidence audit only. No application source or tracked historical asset was modified or added. Files were read directly from the verified decrypted filesystem image and, where necessary, extracted only to a temporary audit directory for metadata and hashing.

Classification:

- **READY** — exact target-build asset and role are sufficiently identified; safe to promote in a later integration task.
- **HOLD** — authentic asset exists, but extraction, selection, cap/stretch behavior, placement, or runtime composition is unresolved.
- **REJECT** — authentic file, but not the requested normal SpringBoard resource or state.

## Evidence chain

| Source | Evidence |
| --- | --- |
| Verified root filesystem | `tmp/firmware/rootfs/018-7063-114-decrypted.hfs` |
| Exact SpringBoard bundle | `/System/Library/CoreServices/SpringBoard.app/` |
| Exact SpringBoard executable | SHA-256 `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d` |
| Icon framework | `/System/Library/PrivateFrameworks/MobileIcons.framework/` |
| Retina UIKit archive | `/System/Library/Frameworks/UIKit.framework/Shared@2x~iphone.artwork` |
| Retina archive size/hash | 17,663,232 bytes; SHA-256 `7f2265f0488bda6d49c3a95506193ced36cd461b85460011a45be1d4d38c17e4` |
| Exact archive support map | iOS 4.1.0, 728 records; SHA-256 `2279f090fb25fa7b4df064b8a7d4273380721bc9da7693347c983b90c654edcb` |

The standalone files are original Apple CgBI PNGs. Their hashes below are hashes of the exact bytes extracted from the HFS image. Alpha was inspected using the native image metadata decoder; “no” means the image decoder reports no effective alpha despite the PNG container using RGBA storage.

The two UIKit page indicators are raw premultiplied BGRA records, not embedded PNG files. Their reported hashes identify deterministic lossless RGBA PNG normalizations. Their exact record indices and offsets are included so this distinction is explicit.

## 1. Dock artwork

| Asset | Original path | Physical | Logical | Alpha | SHA-256 | Usage | Status |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| `SBDockBG@2x.png` | `/System/Library/CoreServices/SpringBoard.app/SBDockBG@2x.png` | 640×90 | 320×45 | yes | `d041f3f59a9f62c655d2fc55a7078c1a218af1f7fcf065ce68a81c4e20b33e6d` | Full-width Retina portrait dock background | **READY** |
| `SBDockBG.png` | `/System/Library/CoreServices/SpringBoard.app/SBDockBG.png` | 320×45 | 320×45 at 1× | yes | `65c23d82f275a7725a053e8763c19dbbe7be6d7476a69e1a4312c56a3a772b7e` | Non-Retina companion | **READY / companion** |
| `SBDockMask@2x.png` | `/System/Library/CoreServices/SpringBoard.app/SBDockMask@2x.png` | 118×120 | 59×60 | yes | `e69e8142a3823de757816e0017b0799546392816caf6866f2e0cc3f72464dc7e` | Per-icon dock mask/reflection geometry, not the dock shelf background | **HOLD composition** |
| `SBDockBGT-Portrait.png` | `/System/Library/CoreServices/SpringBoard.app/SBDockBGT-Portrait.png` | 768×64 | scale/name does not establish a 2× logical size | yes | `95068c9dc0752f8e34dbd0821118ac4dd5f661df8d1860bb31e91b7540ba9137` | Alternate/tiled portrait dock resource referenced by the binary | **HOLD selection/stretching** |

Exact SpringBoard strings include `SBDockBG.png`, `SBDockBGT-Portrait.png`, `SBDockMask.png`, `WallpaperIconDockShadow`, `showDock`, `hideDock`, and `visibleIconsInDock`. This confirms a discrete artwork-backed dock and a separate dock-icon treatment. It does not establish cap insets or the complete layer order.

`SBDockBG@2x.png` is the only full-width, exactly 320-point Retina dock background in this set and is safe for a later direct-byte promotion. The artwork is 45 points high; the larger overall dock interaction/layout region must not be inferred from the raster height alone.

## 2. Application icon mask

| Asset | Original path | Physical | Logical | Alpha | SHA-256 | Usage | Status |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| `AppIconMask@2x.png` | `/System/Library/PrivateFrameworks/MobileIcons.framework/AppIconMask@2x.png` | 118×120 | 59×60 | no effective alpha | `361f75f10ba5e6137fcaf06a55a64e6df16d93c5a2de55c1d1521db2c8c8cca3` | Luminance/mask input for a 57-point application icon inside a larger presentation canvas | **READY asset / HOLD compositing** |
| `AppIconMask.png` | `/System/Library/PrivateFrameworks/MobileIcons.framework/AppIconMask.png` | 59×60 | 59×60 at 1× | no effective alpha | `0b10e3c2c9730a01a43c6df90da25e1d942a2d3e59529b78cd681349fdbca2ce` | Non-Retina companion | **READY / companion** |

The 118×120 canvas is not evidence that application icon source artwork is 118×120. The application source remains 114×114 Retina; MobileIcons supplies a larger system presentation canvas around it. Exact mask blend semantics and icon offset remain **HOLD** until the MobileIcons runtime path is traced.

## 3. Icon gloss/overlay

| Asset | Original path | Physical | Logical | Alpha | SHA-256 | Usage | Status |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| `AppIconOverlay@2x.png` | `/System/Library/PrivateFrameworks/MobileIcons.framework/AppIconOverlay@2x.png` | 118×120 | 59×60 | yes | `93f1c12fdde164b8a677fc9ed9baba5bf23de29a8079b04c60712fee64c1a990` | System application-icon overlay/gloss layer | **READY asset / HOLD compositing** |
| `AppIconOverlay.png` | `/System/Library/PrivateFrameworks/MobileIcons.framework/AppIconOverlay.png` | 59×60 | 59×60 at 1× | yes | `ee697fef19c280515beff6971eb9b555a450785c455d0c944256779d2e42bfb9` | Non-Retina companion | **READY / companion** |
| `IconDarkeningOverlay@2x.png` | `/System/Library/CoreServices/SpringBoard.app/IconDarkeningOverlay@2x.png` | 118×124 | 59×62 | yes | `4b42402d4483261b1753d21a82c169be2c57688fb1d16bc6a64f2c6b09f83ef3` | Pressed/darkened SpringBoard icon state | **REJECT as gloss; READY for pressed-state research** |

`IconDarkeningOverlay` must not be substituted for the normal gloss layer. The exact SpringBoard binary references it specifically as `_iconDarkeningOverlay`.

## 4. Icon shadows

| Asset | Original path | Physical | Logical | Alpha | SHA-256 | Usage | Status |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| `AppIconShadow@2x.png` | `/System/Library/PrivateFrameworks/MobileIcons.framework/AppIconShadow@2x.png` | 118×120 | 59×60 | yes | `5de493a5b8c703160b659e520136b9809dd51c62fe9a3df76773bc1c683a2906` | Base MobileIcons application-icon shadow | **READY asset / HOLD layer selection** |
| `AppIconShadow.png` | `/System/Library/PrivateFrameworks/MobileIcons.framework/AppIconShadow.png` | 59×60 | 59×60 at 1× | yes | `3f54310307f73de1e47bb5dbc3116c295737cb92e5f5dba963a44595e4609b5c` | Non-Retina companion | **READY / companion** |
| `WallpaperIconShadow@2x.png` | `/System/Library/CoreServices/SpringBoard.app/WallpaperIconShadow@2x.png` | 206×206 | 103×103 | yes | `6ce02fb6a2106e7f069f647aabe83c260af3c4a1739eb6efd07533a97cd40082` | SpringBoard wallpaper-context icon shadow | **READY identity / HOLD cap and placement** |
| `WallpaperIconDockShadow@2x.png` | `/System/Library/CoreServices/SpringBoard.app/WallpaperIconDockShadow@2x.png` | 118×120 | 59×60 | yes | `e3a4d192a650feac33383ea5553f7efcddf80e37fbba16e254f99670343b4741` | Dock icon shadow/reflection treatment over wallpaper | **READY identity / HOLD composition** |

The unusually large 103-point `WallpaperIconShadow` canvas indicates a compositing or stretch/cap role; it must not be scaled directly to a 57-point icon without runtime evidence.

`SwitcherIconShadow@2x.png` also exists in SpringBoard, but its name and switcher-specific binary references identify it as **REJECT** for normal Home-screen icon rendering.

## 5. Badge composition

| Asset | Original path | Physical | Logical | Alpha | SHA-256 | Usage | Status |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| `SBBadgeBG@2x.png` | `/System/Library/CoreServices/SpringBoard.app/SBBadgeBG@2x.png` | 58×62 | 29×31 | yes | `55046243fe1bd782fdba0286766109624a95befd908ff16d57be94c0e52cc6a0` | Primary glossy badge background | **READY asset / HOLD stretching** |
| `SBBadgeBGMask@2x.png` | `/System/Library/CoreServices/SpringBoard.app/SBBadgeBGMask@2x.png` | 58×62 | 29×31 | yes | `a82551d9bd94b060e8c860a21ab4d7b22bc2172b90237e94ffd1e21c58c18d3b` | Badge mask for variable-width composition | **READY asset / HOLD mask semantics** |
| `SBBadgeExclamation@2x.png` | `/System/Library/CoreServices/SpringBoard.app/SBBadgeExclamation@2x.png` | 58×62 | 29×31 | yes | `2490b746e6c661c41b59b4634a2a769978fe3607ced3e63b602182a3aafa9318` | Special exclamation badge, not a numbered badge background | **REJECT for numeric badges** |
| `SBBadgeTargetGlyph@2x.png` | `/System/Library/CoreServices/SpringBoard.app/SBBadgeTargetGlyph@2x.png` | 9×9 | 4.5×4.5 | yes | `9cfe2d58b30ff40486c94218f889f9f717426d47bd273a4f97902b9bd1867085` | Special target/location badge glyph | **REJECT for numeric badges** |

The exact executable contains `SBBadgeLabel`, `badgeLabelVerticalOffset`, `iconBadgeWithBadgeString:`, `SBBadgeBG.png`, and `SBBadgeBGMask.png`. Numeric text is therefore a runtime text layer over system badge artwork. Exact font, minimum width, cap insets, multi-digit expansion, anchor, and baseline remain **HOLD**.

The 1× companions are exact and present:

- `SBBadgeBG.png`, 29×31, alpha yes, SHA-256 `397d462a5629f5b968b22993b6287b5ec5e4820bf150db7c34de13e96d000149`.
- `SBBadgeBGMask.png`, 29×31, alpha yes, SHA-256 `8ab4f3c0ed11a57d18b174e3c498adc92de5455c731bb639e81edd87cf87b57e`.

## 6. Standard page-indicator dots

The standard dots are records in the verified Retina UIKit archive rather than standalone bundle PNGs.

| Recovered name | Original container/key | Record | Offset | Physical | Logical | Alpha | Normalized export SHA-256 | Status |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| `UIPageIndicator.png` | `Shared@2x~iphone.artwork` / `shared-iphone-2x-437` | 437 | 5,726,208 | 12×12 | 6×6 | yes; max alpha 77 | `4db2a3e0795ea1d9964c54f8fa3cb93049cf18e416e715cd1777187c45843990` | **READY pixels / HOLD runtime promotion** |
| `UIPageIndicatorCurrent.png` | `Shared@2x~iphone.artwork` / `shared-iphone-2x-438` | 438 | 5,730,304 | 12×12 | 6×6 | yes | `0544e0013bc09c6816432eafe9ddc3758f9884aa2526f5176639e0edd7dbfb78` | **READY pixels / HOLD runtime promotion** |

Name recovery is supported by a 104-record uninterrupted dimension/order match between the named UIKit Retina map and the exact 4.1 map around these two records. The exact 8B117 dyld shared cache independently contains the strings `UIPageIndicator.png` and `UIPageIndicatorCurrent.png`, while the exact SpringBoard executable contains `_pageIndicatorImageForPage:` and `_pageIndicatorCurrentImageForPage:`. This is sufficient to identify the source pixels, but exact SpringBoard tint/selection and placement remain **HOLD**.

Generic UIKit search, tab-bar, and table-index magnifiers are **REJECT** for the SpringBoard page-control search position; they belong to different UIKit controls.

## 7. Spotlight/search page indicator

| Asset | Original path | Physical | Logical | Alpha | SHA-256 | Usage | Status |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| `SBSearchPageIndicator@2x.png` | `/System/Library/CoreServices/SpringBoard.app/SBSearchPageIndicator@2x.png` | 20×20 | 10×10 | yes | `bcc999db35ea525d10bf4ced49770aa420fecca6124d3c54830e41a974e92bf4` | Spotlight/search page indicator, inactive | **READY** |
| `SBSearchPageIndicatorCurrent@2x.png` | `/System/Library/CoreServices/SpringBoard.app/SBSearchPageIndicatorCurrent@2x.png` | 20×20 | 10×10 | yes | `cae382ccb1275aa15df2b3660de699414f4960501d3888916a743dfc548c88a0` | Spotlight/search page indicator, current | **READY** |
| `SBSearchPageIndicator.png` | `/System/Library/CoreServices/SpringBoard.app/SBSearchPageIndicator.png` | 10×10 | 10×10 at 1× | yes | `7a81f841f566a55d547cb40b3311bde04e37fc25a419b4dcd6d1f3582bd4b107` | Non-Retina companion | **READY / companion** |
| `SBSearchPageIndicatorCurrent.png` | `/System/Library/CoreServices/SpringBoard.app/SBSearchPageIndicatorCurrent.png` | 10×10 | 10×10 at 1× | yes | `891c76b751baf3bc10c2c31a5528bc85f8821a88c3c6141196194084907d5fcb` | Non-Retina companion | **READY / companion** |

The executable names these exact resources and implements page-specific current/non-current image selection. They are safe for later promotion.

`spotlight-full@2x.png` and `spotlight-keyboard@2x.png` are large Spotlight interface backgrounds, not page-indicator glyphs, and are **REJECT** for this use.

## Readiness summary

| Requested family | Finding | Classification |
| --- | --- | --- |
| Dock artwork | Exact 640×90 `SBDockBG@2x.png` recovered; 320×45 logical | **READY** |
| Icon mask | Exact MobileIcons mask recovered | **READY asset / HOLD composition** |
| Icon gloss | Exact MobileIcons overlay recovered | **READY asset / HOLD composition** |
| Icon shadow | Base, wallpaper, and dock-context shadows identified | **READY identities / HOLD selection and placement** |
| Badge assets | Exact background and mask recovered; numeric text is runtime | **READY assets / HOLD composition** |
| Page dots | Exact archive records decoded and hashed | **READY pixels / HOLD promotion and runtime placement** |
| Spotlight glyph | Exact inactive/current Retina pair recovered | **READY** |

## Remaining HOLD items

- Exact layer order and offsets for the 114×114 application bitmap inside the 118×120 MobileIcons canvas.
- Mask blend operation and overlay/gloss opt-out behavior for applications declaring precomposed icons.
- Selection between base MobileIcons shadow and SpringBoard wallpaper-specific shadow layers.
- Dock cap/stretch behavior, vertical placement, and relationship between `SBDockBG`, `SBDockBGT-Portrait`, dock masks, and dock shadows.
- Badge cap insets, font, baseline, multi-digit expansion, and exact icon anchor.
- Page-control spacing, center point, and SpringBoard-specific tint/compositing.

## Rejected substitutions

- `IconDarkeningOverlay` as a normal gloss layer.
- `SwitcherIconShadow` as a Home-screen icon shadow.
- `SBBadgeExclamation` or `SBBadgeTargetGlyph` as numbered badges.
- Generic UIKit search/tab/table glyphs as the Spotlight page indicator.
- `spotlight-full` or `spotlight-keyboard` backgrounds as the page-control glyph.

## Validation boundary

Only this evidence document was added. Application files and historical PNG assets were not changed. Temporary audit extracts are outside the repository and are not integration assets.
