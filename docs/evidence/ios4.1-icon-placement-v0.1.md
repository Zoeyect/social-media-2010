# iOS 4.1 SpringBoard Icon Placement Audit v0.1

## Scope and evidence standard

Target: iPhone 4 (`iPhone3,1`), iOS 4.1 build `8B117`, portrait, 640×960 physical pixels / 320×480 logical points at 2×.

This is an audit only. No application source or historical asset was changed. Classification:

- **READY** — directly established by target-build code, target-build pixels, or the 114×114 application-icon contract.
- **HOLD** — authentic behavior is identified, but its final value depends on an unresolved target-build runtime branch, font metrics, or composition step.
- **REJECT** — an unrelated resource or an unsupported substitute.

## Evidence sources

| Evidence | Location | Verification |
| --- | --- | --- |
| Exact SpringBoard executable | `tmp/firmware/rootfs/recovered/SpringBoard.app/SpringBoard` | SpringBoard 1205.49; SHA-256 `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d` |
| MobileIcons resources | `/System/Library/PrivateFrameworks/MobileIcons.framework/` in the verified 8B117 HFS | Exact CgBI PNGs |
| SpringBoard resources | `/System/Library/CoreServices/SpringBoard.app/` in the verified 8B117 HFS | Exact CgBI PNGs |
| Existing extraction audit | `docs/evidence/ios4.1-springboard-artwork-v0.2.md` | Paths, dimensions, alpha, and byte hashes |

The executable exposes `SBIconListView`, `sideIconInset`, `iconColumnsForInterfaceOrientation:`, `iconRowsForInterfaceOrientation:`, `iconsInRowForSpacingCalculation`, `defaultIconSize`, `defaultIconImageSize`, `defaultLabelFontSize`, `_reflectionImageOffset`, `showsReflection`, `badgeLabelVerticalOffset`, and `iconBadgeWithBadgeString:`. Numeric findings below come from ARM/Thumb disassembly of those target-build methods, not from a modern iOS reference.

## 1. Icon presentation canvas

SpringBoard distinguishes application pixels, the MobileIcons composition canvas, and the complete icon view:

| Layer | Retina pixels | Logical points | Finding | Status |
| --- | ---: | ---: | --- | --- |
| Application icon source | 114×114 | 57×57 | Input artwork contract | **READY** |
| MobileIcons mask/overlay/shadow canvas | 118×120 | 59×60 | Two extra physical pixels per horizontal side and six extra vertical pixels in total surround the source | **READY** |
| `SBIcon` portrait presentation bounds | target method selects 59×74 on the phone portrait path | 59×74 | Icon composition plus label area | **READY for the selected target path** |

Target-build `defaultIconImageSize` contains the pairs 59/74 and 78/62 for device/orientation branches. `defaultIconSize` contains 59, 74, and 93. For the iPhone portrait path these resolve to a **59×74-point presentation view** containing a **57×57-point application image**. The 59-point width is therefore not permission to scale an app PNG to 59 points.

### Pixel bounds and padding

Temporary decoding of the original CgBI assets produced these measured bounds (right/bottom coordinates are exclusive):

| Asset | Canvas | Measured non-background/alpha bounds | Interpretation |
| --- | ---: | ---: | --- |
| `AppIconMask@2x.png` | 118×120 | `(2,1)–(116,115)` differs from the black corner | 114×114-pixel mask content begins at physical offset `(2,1)`, i.e. logical `(1,0.5)` |
| `AppIconShadow@2x.png` | 118×120 | alpha `(0,1)–(118,119)` | Shadow deliberately extends outside the 114×114 source |
| `WallpaperIconDockShadow@2x.png` | 118×120 | alpha `(0,2)–(118,120)` | Dock-specific shadow also uses the larger canvas |

`AppIconOverlay@2x.png` has nonzero alpha across its full 118×120 canvas, so its alpha bounding box does not independently identify the visible icon edge. Exact mask blend order and precomposed-icon opt-out remain **HOLD**. CSS `border-radius`, CSS shadows, and scaling the source to 59×60 are **REJECT** substitutes.

Alignment rule: center/align the system composition canvas as a 59-point-wide presentation layer; place the 57-point application bitmap at the mask-defined one-point horizontal inset. Half-point vertical mask sampling is a Retina raster detail and must not be rounded by editing the PNG.

## 2. Icon grid geometry

The target `SBIconListView` class method `sideIconInset` returns **16 points** for the phone path. Its orientation methods return four columns and four rows on the phone path (the five-value branch belongs to other device/orientation conditions).

| Geometry | Target finding | Classification |
| --- | --- | --- |
| Columns | 4 | **READY** |
| Rows above dock | 4 maximum | **READY** |
| Side inset | 16 pt | **READY** |
| Application-image size | 57×57 pt | **READY** |
| Presentation cell | 59×74 pt in phone portrait | **READY** |
| Frequently cited icon-image X origins | approximately `16, 92, 168, 244` pt | **HOLD** — compatible with 76-point advance, but not yet recovered as final rounded `SBIconListView` frames |
| Column center spacing | approximately 76 pt | **HOLD** for the same reason |
| First row Y | approximately 36 pt from the full screen | **HOLD** |
| Row advance | approximately 88 pt | **HOLD** |
| Dock separation | fourth-row-to-dock relationship is managed separately by the dock/list views | **HOLD** |

The binary proves the counts and side inset, but final centers are produced by `iconsInRowForSpacingCalculation` and layout-frame code. A familiar 76×88 grid is geometrically consistent; it is not promoted to **READY** until those final frame calculations are fully resolved. Coordinates are logical points relative to the 320×480 screen; physical coordinates are exactly doubled.

### Current implementation comparison

The current structural CSS uses grid origin `(16,36)`, four 60-point columns, 16-point gaps, three 57-point rows, and a 31-point row gap. This gives 76-point column and 88-point row advances, but it reserves only three rows and treats the 57-point image box as the grid item. It is a close structural hypothesis, not independent historical evidence.

## 3. Label rendering

The exact binary contains `SBIconLabel.m`, `defaultLabelFontSize`, `labelWithFontSize:origin:`, `labelWithFontSize:origin:fontName:`, label locking, wallpaper-display state, and a 59×74 icon presentation view. This establishes a system-rendered text label rather than image artwork.

| Property | Finding | Status |
| --- | --- | --- |
| Renderer | SpringBoard/UIKit text (`SBIconLabel`) | **READY** |
| Horizontal alignment | centered to the icon presentation view | **READY behavior / HOLD exact frame** |
| Family | system font selected at runtime; no asset-backed label | **HOLD exact face** |
| Size/weight | `defaultLabelFontSize` exists, but the phone-path numeric value has not been conclusively resolved | **HOLD** |
| Color | wallpaper-context light label is historically expected; exact target runtime color path not isolated | **HOLD** |
| Shadow | SpringBoard has wallpaper label/shadow behavior; exact offset, blur, and opacity not isolated | **HOLD** |
| Baseline and icon gap | contained in the remaining 17 points beneath a 57-point image within the 74-point presentation height; exact baseline is runtime/font dependent | **HOLD** |

Arial/Helvetica CSS fallback, arbitrary `10px` sizing, and a generic CSS text shadow are **REJECT** as evidence of authentic metrics.

## 4. Dock icon geometry

The dock is a distinct icon list/model with four positions. `SBDockBG@2x.png` is 640×90 pixels (320×45 points), while dock icon shadow/mask assets use the same 118×120-pixel (59×60-point) presentation canvas as Home icons.

| Property | Finding | Status |
| --- | --- | --- |
| Dock capacity/positions | four, horizontally distributed | **READY** |
| Presentation width | 59 pt system canvas containing 57 pt source | **READY** |
| Nominal X sequence | approximately `16, 92, 168, 244` pt | **HOLD final frame rounding** |
| Vertical alignment | separate dock layout above/through the 45-point dock artwork | **HOLD** |
| Reflection support | `_reflectionImageOffset`, `showsReflection`, `imageForReflection`, and `WallpaperIconDockShadow` are present | **READY capability / HOLD exact composition** |
| Reflection offset | target method returns a runtime-dependent 7 or 9 pt (and another branch returns a distinct constant) | **HOLD selected phone value** |

The dock artwork height is not the dock interaction height and must not be used alone to infer the icon Y coordinate. CSS reflection, gradients, blur, or shadows are **REJECT**.

## 5. Badge geometry

The authentic numeric badge is composited at runtime from `SBBadgeBG@2x.png` and `SBBadgeBGMask@2x.png`, both 58×62 pixels / 29×31 points. Their measured alpha bounds are `(1,2)–(57,59)` and `(0,2)–(58,61)` respectively.

| Property | Finding | Status |
| --- | --- | --- |
| Minimum artwork canvas | 29×31 pt | **READY** |
| Anchor region | upper-right of icon presentation | **READY behavior** |
| Exact anchor point/offset | not conclusively recovered from the final layout method | **HOLD** |
| Label vertical correction | cached default is `-4.0` pt; runtime scale adjustment can add 0.5 pt | **READY code fact / HOLD resolved device value** |
| Single digit | centered over the minimum badge artwork | **READY behavior / HOLD exact font metrics** |
| Multiple digits | background/mask expands horizontally; it is not a uniformly scaled capsule | **READY behavior / HOLD cap/stretch parameters** |

`SBBadgeExclamation` and `SBBadgeTargetGlyph` are **REJECT** for ordinary numeric badges. A CSS red capsule is also **REJECT**.

## Classification summary

| Area | Result |
| --- | --- |
| 114×114 source → 57×57 logical artwork | **READY** |
| 118×120 system canvas → 59×60 logical composition | **READY** |
| 59×74 phone portrait icon presentation view | **READY** |
| Four columns, four rows, 16-point side inset | **READY** |
| Exact final X/Y origins and row/column rounding | **HOLD** |
| Exact label font, baseline, and shadow metrics | **HOLD** |
| Four-position dock and reflection capability | **READY** |
| Exact dock Y/reflection composition | **HOLD** |
| Badge source canvas and runtime expansion model | **READY** |
| Exact badge corner anchor and text metrics | **HOLD** |

## Validation boundary

This audit adds only `docs/evidence/ios4.1-icon-placement-v0.1.md`. No application file, compositor, PNG, dock, wallpaper, status bar, or lifecycle behavior was modified. Build validation is reported with the task handoff.
