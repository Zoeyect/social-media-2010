# iOS 4.1 SpringBoard Dock + Page Indicator Calibration v0.2

## Scope

This pass changes SpringBoard vertical geometry only. It preserves the verified four-column grid, 59-point presentation tracks, 76-point column advance, authentic artwork, application state, and device lifecycle behavior.

## Calibrated geometry

Coordinates are logical points in the 320×480 screen.

| Element | Before | After | Change |
| --- | ---: | ---: | ---: |
| Dock region top | Y 390 (`height: 90`) | Y 396 (`height: 84`) | +6 pt |
| Dock icon/presentation top | Y 398 | Y 404 | +6 pt |
| Dock background top | Y 435 | Y 435 | unchanged |
| Dock background size | 320×45 | 320×45 | unchanged |
| Page-indicator top | Y 380 (`bottom: 90`) | Y 386 (`bottom: 84`) | +6 pt |
| Label top within presentation cell | Y 60 | Y 62 | +2 pt |
| Label offset from 57-point application artwork | 3 pt | 5 pt | +2 pt |

The dock background remains bottom-aligned: `480 − 45 = 435`. Only the containing dock list and its icons move downward. The indicator now occupies Y 386–396, between the final Home-grid presentation boundary at Y 374 and the dock region beginning at Y 396. The label is moved without changing its font, text, color, shadow, width, or line height.

## Preserved geometry and behavior

- Home grid origin, row structure, and vertical row spacing are unchanged.
- Four 59-point tracks remain at X 16, 92, 168, and 244.
- The 17-point gaps and 76-point horizontal advance are unchanged.
- Page-indicator horizontal centering and 6-point glyph gap are unchanged.
- No artwork, wallpaper, state, timer, button, or application-launching behavior is changed.

## Evidence boundary

The dock asset size and its bottom-aligned Y coordinate are **READY** geometry. The calibrated dock-icon Y, indicator Y, and label offset satisfy the requested vertical relationships but remain **HOLD** as exact historical runtime values until the corresponding 8B117 frame calculations and font baseline are fully resolved.

No CSS-generated artwork is introduced. Historical PNG integrity is checked against a pre-change SHA-256 manifest after the build.
