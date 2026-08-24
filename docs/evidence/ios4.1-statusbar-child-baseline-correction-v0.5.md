# iOS 4.1 Status Bar Child Baseline Correction Audit v0.5

## Scope

This correction is limited to the carrier/network group, center clock or lock indicator, and battery group. The status bar remains a fixed 320×20pt layer at logical coordinate (0, 0).

## Previous implementation

The unlocked status bar and locked `SBAway` presentation used different grid/flex alignment paths. Their children therefore inherited different centering and line-height behavior even though the outer status-bar layer was fixed. This could produce a visible Y shift during the Lock Screen → SpringBoard transition.

## Corrected coordinate space

Both presentations now use the same absolutely positioned regions inside the same 20pt coordinate space:

| Region | Logical bounds | Contents |
| --- | --- | --- |
| Left | x=0, y=0, w=90, h=20pt | signal, AT&T, 3G |
| Center | x=115, y=0, w=90, h=20pt | lock indicator or clock |
| Right | x=230, y=0, w=90, h=20pt | Bluetooth when applicable, battery percentage, battery raster |

No status-bar child depends on flex/grid centering, inherited line height, `vertical-align`, or transform offsets.

## Child audit

### Carrier and network — READY

- Signal raster: x=6, y=0, w=19, h=20pt.
- AT&T raster/text box: x=30, y=0, w=31.5, h=20pt.
- Network raster: x=64.5, y=0, h=20pt.
- Locked and unlocked surfaces render the same classes and coordinates.

The authentic carrier and network rasters remain unchanged.

### Center lock indicator — READY / HOLD

- Fixed box: x=155, y=0, w=10, h=20pt.
- The box occupies the center region independently of the raster's opaque pixel bounds.
- **READY:** recovered 8B117 lock raster and deterministic runtime placement.
- **HOLD:** exact opaque-pixel optical alignment against an original-device framebuffer capture.

### Center clock — READY / HOLD

- Fixed box: x=115, y=0, w=90, h=20pt.
- Explicit height and line-height: 20pt.
- **READY:** identical runtime coordinates across SpringBoard and application status presentations.
- **HOLD:** exact historical font metrics and UIKit text baseline; the browser font stack remains an approximation.

### Battery — READY

- Percentage text uses the shared 20pt text track and ends at x=290.
- Battery raster: x=293, y=0, w=21, h=20pt.
- Locked and unlocked surfaces use the same percentage and raster classes.
- Existing battery raster composition and calculation are unchanged.

## Classification summary

- **READY:** one shared 320×20pt coordinate space; identical left/right geometry; fixed center region; authentic existing rasters retained.
- **HOLD:** exact historical text font metrics and optical comparison against a verified 8B117 runtime framebuffer.
- **REJECT:** independent flex/grid centering and child-specific inherited vertical alignment.

## Change boundary

No historical asset bytes, device lifecycle, clock source, carrier configuration, SpringBoard geometry, Lock Screen content geometry, Messages behavior, or audio behavior were changed by this correction.
