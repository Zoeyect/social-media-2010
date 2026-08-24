# iOS 4.1 Folder Opening Geometry Calibration v0.1

## Scope and evidence

Target: iPhone 4 (`iPhone3,1`), iOS 4.1 build `8B117`, portrait. The logical screen is 320×480 pt and the Retina framebuffer is 640×960 px.

- **READY** — directly established by the target-build executable or exact recovered raster dimensions.
- **HOLD** — behavior exists, but its final runtime value or composition is not yet established.
- **REJECT** — a modern or unsupported recreation when represented as historical behavior.

Primary evidence is the recovered SpringBoard 1205.49 executable (SHA-256 `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d`) and the exact 8B117 SpringBoard resources. Relevant runtime methods include `boundsSizeForRows:orientation:`, `linenRectForRows:orientation:`, `topIconInset`, `bottomIconInset`, `_tearLocationForFolderIcon:`, and `_slideFolderOpen:animated:`.

## 1. Final container geometry

The portrait branch of `boundsSizeForRows:orientation:` uses a 125pt one-row base and adds 85pt for every additional row. The verified three-row Folder therefore resolves to:

| Property | Previous implementation | Calibrated logical | Calibrated Retina | Classification |
| --- | ---: | ---: | ---: | --- |
| X | centered implicitly | 0 pt | 0 px | **READY** full-width model |
| Y | 60 pt | 110 pt | 220 px | **READY for the current Page 2 row-1 entry** |
| Width | 320 pt | 320 pt | 640 px | **READY** |
| Height | 360 pt | 295 pt | 590 px | **READY** |
| Bottom edge | 420 pt | 405 pt | 810 px | **READY in the current composition** |

The calibrated panel spans `(0,110,320,295)` and ends at Y=405. It is not centered: its center is `(160,257.5)`, 17.5pt below the screen center. Its upper edge is 90pt below the 20pt status bar. It overlaps the top 9pt of the Dock's 84pt layout region, but ends 30pt above the authentic 45pt Dock artwork, which begins at screen Y=435. The target runtime uses separate sliding views around this boundary; reproducing their displacement remains **HOLD**.

`_tearLocationForFolderIcon:` converts the selected icon bounds into the controller coordinate space and uses `CGRectGetMaxY`. The current row-1 presentation cell is `(16,36,59,74)`, so its lower edge establishes Y=110. This coordinate is tied to the current Folder entry on Page 2, row 1, column 1 and must not be generalized to folders in other rows.

## 2. Raster alignment

| Layer | Previous | Calibrated | Classification |
| --- | --- | --- | --- |
| `FolderSwitcherBG@2x.png` | 320×360 at panel `(0,0)` | Native 320×360, offset Y=-30 inside a 320×295 clip | Source and 30pt linen inset **READY** |
| `FolderShadowTop@2x.png` | Y=0, 320×24 repeat | unchanged at top edge | Asset/edge **READY**; cap behavior **HOLD** |
| `FolderShadowBottom@2x.png` | bottom edge, 320×27 repeat | unchanged at Y=268 | Asset/edge **READY**; cap behavior **HOLD** |
| `FolderShadowTopNotch@2x.png` | X=21.5, Y=0 | X=33.5, Y=0; centered at Folder icon X=45.5 | Current-entry alignment **READY** |
| `FolderShadowBottomNotch@2x.png` | simultaneously visible | not rendered for this downward opening | Opposite direction remains **HOLD** |

No raster is stretched beyond its native logical scale. The 320×360 linen remains 320×360 and is clipped by the verified 320×295 container. Shadows continue to use recovered raster slices; no CSS gradient, blur, border, radius, or box shadow has been introduced.

The exact shadow cap/tiling implementation and the opposite opening-direction notch selection remain **HOLD**.

## 3. Internal grid

The target `SBFolderIconListView` returns four columns, three rows, `topIconInset = 7`, and `bottomIconInset = 10`. The portrait height formula resolves the vertical structure without borrowing the SpringBoard page's row gap:

`34 title/header + 7 top inset + 74 first row + 85 second-row increment + 85 third-row increment + 10 bottom inset = 295 pt`

| Property | Previous | Calibrated | Classification |
| --- | ---: | ---: | --- |
| Columns / rows | 4 / 3 | 4 / 3 | **READY** |
| Cell | 59×74 pt | 59×74 pt | **READY** |
| Grid X | 16 pt | 16 pt | **HOLD** pending complete horizontal method resolution |
| Grid Y in panel | 56 pt | 41 pt | **READY** from header + top inset |
| Screen grid Y | 116 pt in the pre-raster centered card | 151 pt | **READY** |
| Column gap | 17 pt | 17 pt | **HOLD** |
| Row gap | 10 pt | 11 pt | **READY** from the 85pt row advance |
| Bottom inset | overflowed panel | 10 pt | **READY** |

Slots are at panel Y `41`, `126`, and `211`; the final 74pt cell ends at Y=285, leaving the verified 10pt bottom inset. All 12 slots remain empty.

## 4. Opening origin

The current Folder icon occupies Page 2 row 1, column 1. Its source presentation cell is `(16,36,59,74)`, its artwork center is `(45.5,67)`, and its presentation lower edge is Y=110 in screen coordinates. The panel's transform origin is calibrated to X=45.5 and its tear edge Y=110, so the transition is anchored to the selected icon column and the panel opening edge rather than to the old screen-centered origin.

The runtime proves icon-derived tear positioning and upper/lower sliding regions. A complete reproduction of those moving SpringBoard snapshots is **HOLD**. The current uniform `.194 → 1` scale and opacity transition remains a functional approximation, not a claim about the original raster transform.

## 5. Tear and notch behavior

For the current row-1 Folder, the opening occupies the space below the icon row, so the top notch is selected and aligned to the Folder icon center. Rendering both top and bottom notches simultaneously has been removed. Bottom-notch selection for a Folder that opens upward, exact notch cap composition, and switching rules for other rows remain **HOLD** and are not fabricated here.

## 6. Animation calibration

| Property | Current value | Classification |
| --- | --- | --- |
| Open duration | 180ms | **HOLD** functional approximation |
| Close duration | 160ms | **HOLD** functional approximation |
| Open easing | `ease-out` | **HOLD** |
| Close easing | `ease-in` | **HOLD** |
| Scale | `.194 → 1` / reverse | **HOLD** |
| Opacity | `0 → 1` / reverse | **HOLD** |
| 3D, spring, bounce, blur, parallax | absent | **READY-compliant** |

The unsupported translation to the former centered-card geometry was removed. Exact UIKit duration, easing, snapshot displacement, and opacity curve require runtime capture or further call-site resolution and remain **HOLD**.

## 7. Interaction preservation

Folder events still follow `closed → opening → open → closing → closed`; the reducer was not changed. Closing removes only the Folder overlay. `currentPage` remains independent and unchanged, so the same SpringBoard page, Dock, and page-indicator state are restored. Home and sleep continue through their existing lifecycle paths; no lifecycle, navigation, Dock, Status Bar, or Lock Screen logic was changed.

## Remaining HOLD items

- Horizontal outputs of `nineIconRectForScrollPosition:` and exact Folder-specific column gaps.
- Exact upper/lower SpringBoard snapshot displacement around the tear.
- Opposite-direction tear threshold and bottom-notch runtime selection.
- Shadow cap/tiling details and alpha curve.
- Folder title frame and editing behavior.
- Exact animation duration, UIKit curve, scale, and opacity timing.

No new artwork, generated CSS artwork, Folder contents, third-party icons, or historical-asset edits are part of this calibration.
