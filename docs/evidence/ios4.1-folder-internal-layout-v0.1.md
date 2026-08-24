# iOS 4.1 Folder Internal Layout Audit v0.1

## Scope and evidence standard

Target: iPhone 4 (`iPhone3,1`), iOS 4.1 build `8B117`, portrait.

- Logical screen: 320×480 points.
- Retina framebuffer: 640×960 pixels at 2×.
- **READY** — directly established by exact target-build code or recovered target-build pixels.
- **HOLD** — the subsystem or behavior is established, but its final runtime value/composition is unresolved.
- **REJECT** — a modern or unsupported recreation when presented as historical iOS 4.1 output.

Primary evidence:

- Exact SpringBoard 1205.49 executable, SHA-256 `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d`.
- Recovered resources in the exact 8B117 `/System/Library/CoreServices/SpringBoard.app`.
- Current `SpringBoard.tsx`, `folderState.ts`, and `device.css` implementation.

The executable exposes `SBFolderView`, `SBFolderIconListView`, `SBFolderSlidingView`, `SBFolderTitleLabel`, `SBFolderTextField`, `_tearLocationForFolderIcon:`, `_folderRowsForIconCount:`, `_slideFolderOpen:animated:`, `linenRectForRows:orientation:`, `boundsSizeForRows:orientation:`, and notch/shadow placement methods. This proves a row-dependent split/tear architecture, not a fixed centered-card model.

## 1. Folder container geometry

### Verified historical structure

The target creates upper and lower `SBFolderSlidingView` regions, computes a tear location from the selected Folder icon, inserts an `SBFolderView`, and uses row-count-dependent linen and bounds methods. Top/bottom notch views and upper/lower shadow assets frame the opening.

| Property | Finding | Classification |
| --- | --- | --- |
| Screen coordinate system | 320×480 pt / 640×960 px | **READY** |
| Folder width model | Full-width sliding/linen structure is supported by a 320×360 pt Retina background and `SBFolderSlidingView`; final visible rect is computed at runtime | Structure **READY**; exact width **HOLD** |
| Folder height model | Depends on folder row count through `linenRectForRows:` and `boundsSizeForRows:` | Dynamic behavior **READY**; row-specific values **HOLD** |
| Horizontal position | Root sliding/folder system spans the phone layout; exact final frame remains runtime-computed | **HOLD** |
| Vertical position | Derived from Folder icon tear location, row count, orientation, and available upper/lower content | Behavior **READY**; exact Y **HOLD** |
| Screen center relationship | Not established as a centered rectangle | Centered-card equivalence **REJECT** |
| Status-bar relationship | Folder controller owns sliding root content and updates status-bar behavior; exact frame below/through the status-bar region is unresolved | **HOLD** |
| Dock relationship | Dock is represented separately while folder sliding views are inserted; exact visibility/shift during opening is unresolved | Separate subsystem **READY**; final composition **HOLD** |

The recovered `FolderSwitcherBG@2x.png` is 640×720 pixels / 320×360 points. Its dimensions are **READY**, but they do not prove that every open folder has a fixed 320×360 frame or establish its screen Y coordinate.

### Current implementation measurement

| Property | Logical | Retina |
| --- | ---: | ---: |
| Overlay | `(0,0)`, 320×480 | `(0,0)`, 640×960 |
| Panel | `(8,99)`, 304×282 | `(16,198)`, 608×564 |
| Panel center | `(160,240)` | `(320,480)` |
| Gap below 20pt status bar | 79 pt | 158 px |
| Gap above dock region at Y 396 | 15 pt | 30 px |

The current centered panel is deterministic structural scaffolding. Its width, height, centering, and rounded-card form are **HOLD as implementation choices** and **REJECT if claimed as verified iOS 4.1 folder geometry**.

## 2. Folder background and edge treatment

| Resource/behavior | Physical size | SHA-256 | Classification |
| --- | ---: | --- | --- |
| `FolderSwitcherBG@2x.png` | 640×720 | `1daaed1612ea3475ca9b3195e20f6910710b8a5d62bc147550866dd4852c79cb` | **READY asset**; exact runtime placement/composition **HOLD** |
| `FolderShadowTop@2x.png` | 2×48 | `da491651a2b32f14ab72a19d16f41aa62dd6b849269b87baf1393160cad1012d` | **READY asset identity**; tiling/placement **HOLD** |
| `FolderShadowBottom@2x.png` | 1×54 | `dbf7b7deca324423a989b1a32fa6d39bf2aee50ae9e5fbc1fba181b27d13e81b` | **READY asset identity**; tiling/placement **HOLD** |
| `FolderShadowTopNotch@2x.png` | 48×78 | `ac24db2c3671978113c387b68ab9901e7240110275c645885c24ff4233a9d569` | **READY asset identity**; notch composition **HOLD** |
| `FolderShadowBottomNotch@2x.png` | 48×80 | `4d8ee565d8391b8f942ee2179912e3291e320637a2601c685cf5b8aebc60c6d2` | **READY asset identity**; notch composition **HOLD** |
| `FolderTitleEditField@2x.png` | 58×58 | `66c1e52edd6e0f0a5555c23b37255a9bd48ce5977671c077bfae47a33a7f05d7` | **READY editing asset**; not a normal folder background |

The binary implements `setBackgroundAlpha:` and raster-backed top/bottom/notch shadows. Transparency behavior and shadow capability are therefore **READY behaviors**, while exact alpha values, cap/tiling rules, and layer order remain **HOLD**. Exact corner/radius treatment is not established as a rounded rectangle.

Current implementation comparison:

- `rgba(0,0,0,.32)` overlay and `rgba(12,12,12,.9)` panel are CSS structural placeholders: **HOLD**, not recovered colors.
- `border-radius: 12px` is unsupported as target-build folder geometry: **REJECT as historical evidence**.
- No blur, glassmorphism, custom gradient, or CSS shadow is present: compliant.
- Replacing raster-backed linen/notch/shadows with modern blur or a generic glass card: **REJECT**.

## 3. Internal icon grid

`SBFolderIconListView` is an `SBIconListView` subclass. Exact target methods return:

- `iconColumnsForInterfaceOrientation:` → **4**.
- `iconRowsForInterfaceOrientation:` → **3**.
- `topIconInset` → **7.0 pt**.
- `bottomIconInset` → **10.0 pt**.

The subclass overrides only its row/column counts, top/bottom insets, and `nineIconRectForScrollPosition:` in the relevant geometry surface. It inherits the phone icon presentation system; the 59×60 composition canvas inside a 59×74 presentation cell remains applicable.

| Property | Historical finding | Classification |
| --- | --- | --- |
| Columns | 4 | **READY** |
| Rows per folder page | 3 | **READY** |
| Capacity per page | 12 | **READY** |
| Composition canvas | 59×60 pt | **READY** |
| Presentation cell | 59×74 pt | **READY** |
| Top icon inset | 7 pt | **READY** |
| Bottom icon inset | 10 pt | **READY** |
| Exact horizontal origins/gaps | Final `nineIconRectForScrollPosition:` calculation not fully resolved | **HOLD** |
| Exact vertical row advance | Final inherited/subclass frame calculation not fully resolved | **HOLD** |
| Internal paging/scroll frame | Capability is present; final clipping and page-control geometry unresolved | **HOLD** |

This differs from the root SpringBoard grid: both use four columns and the same icon presentation dimensions, but the Folder has three rows, explicit 7/10pt vertical insets, a folder-specific nine-icon rect method, and a row-dependent container. Root-page origins and gaps must not be assumed as Folder evidence.

### Current implementation

The current empty grid is `(16,116)`, 287 points wide, relative to the screen. It uses:

- four 59pt columns at X `16, 92, 168, 244`;
- three 74pt rows at Y `116, 200, 284`;
- 17pt column gaps and 10pt row gaps;
- 17pt panel top padding and 8pt horizontal padding.

Four columns, three rows, 12 empty slots, and presentation-cell dimensions are **READY-compatible**. Current margins, origins, and gaps are **HOLD**. In particular, the current 17pt panel top padding is not the verified 7pt `topIconInset` and the centered panel does not match the runtime tear model.

## 4. Folder title

The exact target contains `SBFolderTitleLabel`, `SBFolderTextField`, `setFolderName:`, editable title rect methods, and `FolderTitleEditField.png`. A runtime title is therefore **READY behavior**.

| Property | Finding | Classification |
| --- | --- | --- |
| Title renderer | `SBFolderTitleLabel` / editable `SBFolderTextField` | **READY** |
| Position/top spacing | Runtime folder-view layout unresolved | **HOLD** |
| Font family/size/weight | Exact values unresolved | **HOLD** |
| Color/shadow | Exact values unresolved | **HOLD** |
| Baseline | Exact value unresolved | **HOLD** |
| Default name | Proposed/fallback naming exists, but no universal historical default is established | **HOLD** |

The current open panel renders no internal title. `Social` is the user-created label of the Folder icon on Page 2; it is not evidence of a historical default Folder title and remains user-created content.

## 5. Open/close animation geometry

The target binary proves `_tearLocationForFolderIcon:`, `_slideFolderOpen:animated:`, `_openCloseFolderAnimationEnded:finished:context:`, upper/lower sliding views, notch geometry, ghosted icon lists, and wallpaper animation control.

| Animation property | Historical finding | Classification |
| --- | --- | --- |
| Opening origin | Derived from visible Folder icon tear location | **READY behavior**; exact coordinate **HOLD** |
| Final geometry | Row/orientation/notch-dependent folder view between sliding regions | **READY behavior**; exact frame **HOLD** |
| Scale | Folder icon mini-grid and snapshots participate, but a single uniform panel scale is not established | **HOLD** |
| Duration | Animated/non-animated path exists; exact duration unresolved | **HOLD** |
| Easing | Exact UIKit animation curve unresolved | **HOLD** |
| Physics | No evidence supports modern spring, elastic, parallax, blur, or 3D treatment | Those substitutions **REJECT** |

Current implementation starts from the Page 2 Folder artwork center `(45.5,67)`, translates `(-114.5,-173)`, scales from `.194`, and reaches the centered panel in 180ms `ease-out`; close uses 160ms `ease-in`. The source coordinate is deterministic for the current placement, but the transform model, scale, durations, easing, and centered final panel are **HOLD approximations**, not verified 8B117 values.

## 6. Close behavior audit

Current implementation flow:

`open → outside pointer-down → closing → animation complete → closed`

Static verification shows:

- `currentPage` is held independently in `App` and is not changed by Folder events: same page is preserved (**READY implementation fact**).
- Dock nodes and calibration remain outside the page track and are not modified during Folder close (**READY implementation fact**).
- The page indicator reads the unchanged `currentPage` state (**READY implementation fact**).
- The overlay is removed only after the closing animation reports completion (**READY implementation fact**).

Historical exact close animation geometry and dock/page dimming or sliding composition remain **HOLD**.

## Remaining unknowns

- Numeric outputs of `linenRectForRows:orientation:`, `boundsSizeForRows:orientation:`, and `nineIconRectForScrollPosition:` for the iPhone portrait runtime branch.
- Exact linen selection, tiling/cap behavior, transparency, notch placement, and shadow layer order.
- Title frame and typography metrics.
- Internal page clipping, scrolling, and indicator placement.
- Exact open/close timing and UIKit curve.
- Exact dock, wallpaper, status-bar, and root-icon sliding behavior during each animation phase.

## Validation boundary

This audit adds only this Markdown document. It does not alter application code, Folder contents, third-party icons, or historical assets.
