# iOS 4.1 SpringBoard Label & Layout Fidelity v0.1

## Scope and evidence

Target: iPhone 4 (`iPhone3,1`), iOS 4.1 build `8B117`, portrait, 320×480 logical points at 2×.

This audit compares the current `SpringBoard.tsx` and `device.css` implementation with the exact 8B117 SpringBoard executable and the previously recovered SpringBoard/UIKit resources. It changes geometry only where the existing evidence establishes a safe structural correction. No icon or other historical PNG is changed.

Classification:

- **READY** — established by exact target-build code or target-build asset dimensions.
- **HOLD** — behavior is known or historically expected, but the exact target-build runtime value is not resolved.

Primary local evidence:

- `docs/evidence/ios4.1-icon-placement-v0.1.md`
- `docs/evidence/ios4.1-springboard-artwork-v0.2.md`
- Exact `SpringBoard.app/SpringBoard` 1205.49, SHA-256 `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d`

## 1. Icon label rendering

The exact executable contains `SBIconLabel`, `defaultLabelFontSize`, `labelWithFontSize:origin:`, `labelWithFontSize:origin:fontName:`, and wallpaper label/shadow paths. This proves a centered runtime text label below the icon artwork. It does not, by itself, resolve all final phone-path metrics.

| Property | Current implementation | iOS 4.1 evidence | Classification |
| --- | --- | --- | --- |
| Renderer | HTML text span | Runtime `SBIconLabel` text | Text behavior **READY**; renderer equivalence **HOLD** |
| Family | `Arial, Helvetica, sans-serif` | Runtime system font/font-name path | Exact face **HOLD** |
| Size | 10 CSS px | `defaultLabelFontSize` exists; selected phone value is unresolved | **HOLD** |
| Weight | normal | Exact selected weight unresolved | **HOLD** |
| Color | white | Light wallpaper-context label is expected; exact color path unresolved | **HOLD** |
| Shadow | `0 1px 1px #000` | Wallpaper label shadow behavior exists; offset, blur, and opacity unresolved | **HOLD** |
| Horizontal alignment | centered on the 59-point presentation cell | Centered SpringBoard label behavior | **READY behavior**; exact label frame **HOLD** |
| Label box | top 60, line-height 14, max-width 76 | Label occupies the portion beneath icon composition within a 59×74 presentation view | Containment **READY**; baseline and width **HOLD** |
| Icon-to-label relationship | label begins after the 59×60 composition canvas | 57-point app image sits inside a 59×60 system canvas; full icon view is 59×74 | Structure **READY**; visible gap/baseline **HOLD** |

No typography value is promoted as final. The existing font size, color, shadow, line height, baseline, truncation width, and fallback stack remain implementation approximations pending a resolved target-build runtime trace. They were not retuned by visual guesswork in this pass.

## 2. Icon position and row/column geometry

The phone portrait path establishes four columns, four rows, a 16-point side inset, a 59×60 icon composition canvas, and a 59×74 icon presentation view.

| Property | Before this pass | Refined implementation | Evidence classification |
| --- | ---: | ---: | --- |
| Columns | 4 | 4 | **READY** |
| Maximum rows | 4 | 4 | **READY** |
| Side inset | 16 pt | 16 pt | **READY** |
| Track/cell width | 60 pt track containing a centered 59 pt cell | 59 pt track/cell | 59 pt presentation width **READY** |
| Column gap | 16 pt | 17 pt | Gap itself **HOLD** |
| Column advance | 76 pt | 76 pt | **HOLD**, compatible with recovered structure |
| Cell X origins | 16.5, 92.5, 168.5, 244.5 | 16, 92, 168, 244 | Final origins **HOLD**; fractional browser offset removed |
| First row Y | 36 pt | 36 pt | **HOLD** |
| Presentation height | 74 pt | 74 pt | **READY** |
| Row gap | 14 pt | 14 pt | **HOLD** |
| Row advance | 88 pt | 88 pt | **HOLD** |

The X refinement removes an accidental browser half-point created by centering a 59-point item in a 60-point CSS track. It does not promote the familiar 76-point advance or final X origins to historical fact. First-row Y and row advance are unchanged because the final `SBIconListView` frame calculation remains unresolved.

## 3. Dock alignment

| Property | Current/refined implementation | iOS 4.1 evidence | Classification |
| --- | --- | --- | --- |
| Background | Exact 640×90 asset rendered 320×45, full width, bottom aligned | Exact `SBDockBG@2x.png` dimensions | Asset and scale **READY**; runtime selection/bottom placement **HOLD** |
| Dock region | 320×90, bottom 0 | Dock is a separate list from the Home page | Separate structure **READY**; region height **HOLD** |
| Icon top | 8 pt within dock region (screen Y 398) | Exact dock Y unresolved | **HOLD** |
| Icon composition size | 59×60 pt | Exact recovered built-in canvas size | **READY** |
| Positions | four 59-point tracks at X 16, 92, 168, 244 | Four dock positions; nominal sequence compatible | Count **READY**; final X/Y **HOLD** |
| Horizontal advance | 76 pt | Final layout-frame rounding unresolved | **HOLD** |
| Reflection | not fabricated | Capability exists; selected offset/composition unresolved | **HOLD** |

The dock received the same track correction as the Home grid, eliminating half-point centering while retaining four evenly advanced positions. Dock artwork, vertical placement, and reflection behavior were not changed.

## 4. Page indicator

| Property | Current implementation | Evidence | Classification |
| --- | --- | --- | --- |
| Glyphs | Exact 10×10 Spotlight asset and exact 6×6 page-dot exports | Asset dimensions and identities recovered | **READY pixels** |
| Horizontal centering | Flex group centered at 50% | SpringBoard page control exists; exact group frame unresolved | **HOLD** |
| Vertical position | bottom 90 pt; group top Y 380 | Exact page-control Y unresolved | **HOLD** |
| Inter-glyph gap | 6 pt | Exact spacing unresolved | **HOLD** |
| State | Spotlight inactive, Page 1 current, Page 2 inactive | Matches approved two-page composition state | **READY application state**; runtime placement **HOLD** |

No indicator position or spacing was changed. The recovered pixels are authoritative; their final SpringBoard frame is not yet proven.

## READY / HOLD summary

**READY**

- 320×480 logical coordinate system.
- Four columns and four maximum Home rows.
- 16-point side inset.
- 59×60 icon composition canvas and 59×74 portrait presentation cell.
- Four dock positions and exact dock/icon/indicator source dimensions.
- Centered label behavior beneath the icon composition.

**HOLD**

- Exact label family, size, weight, color, shadow, baseline, width, truncation, and visible icon gap.
- Final Home icon X/Y frame rounding, first-row Y, and row advance.
- Dock region height, icon Y, final X rounding, background runtime selection, and reflection composition.
- Page-indicator center frame, Y position, and spacing.

## Validation boundary

This pass changes only SpringBoard layout CSS and this audit document. It adds no visuals or third-party icons. Historical PNG integrity is validated byte-for-byte against the pre-change hash manifest after the build.
