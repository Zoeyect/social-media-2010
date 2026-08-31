# iPhone 4 / iOS 4.1 Lock Screen Fidelity v1.0

## Scope and target

Target: black GSM iPhone 4 (`iPhone3,1`), iOS 4.1 build era, 320 × 480 logical viewport, `en-US`, 2010-10-20 U.S. Pacific narrative time. This pass changes only device-shell and Lock Screen presentation. Lock timing, notification scheduling, battery simulation, Messages data, SpringBoard, keyboard, app state, global time, and sleep/wake behavior remain outside scope.

Evidence labels in this document follow the project convention: **PERIOD-EVIDENCE**, **VISUAL-CROSSCHECK**, **RECONSTRUCTED**, and **HOLD**.

## Device-shell geometry audit

The current shell geometry already matches the accepted project-local iPhone 4 composition and was retained. The body ratio and physical control identities are **PERIOD-EVIDENCE**; exact front-artwork offsets are **VISUAL-CROSSCHECK / RECONSTRUCTED**.

| Measurement | Before | Reference / basis | Target |
| --- | ---: | --- | ---: |
| Outer body | 380 × 747px | accepted 58.6:115.2 proportion | unchanged |
| Screen rectangle | x 30, y 133, 320 × 480px | canonical Retina 2× logical viewport | unchanged |
| Top bezel | 133px | project front-view crosscheck | unchanged |
| Bottom bezel | 134px | project front-view crosscheck | unchanged |
| Side margins | 30px | centered canonical screen | unchanged |
| Earpiece | x 161, y 74, 58 × 7px | project front-view crosscheck | unchanged |
| Front camera | x 124, y 72, 10px diameter | project front-view crosscheck | unchanged |
| Home button | x 158, bottom 26, 64px diameter | project front-view crosscheck | unchanged |
| Home glyph | 20 × 20px, 2px ring | project front-view crosscheck | unchanged |

The glass, steel edge, screen glow, and side controls are also unchanged. Further shell tuning without an attached measurable product image would be speculative.

## Clock and date

The combined clock/date panel remains 96px high beginning below the 20px status bar. Its top padding changes from 3px to 1px. The clock changes from 62px/65px to 60px/64px with `-1px` tracking and an explicit period-compatible light weight. The date remains 16px/20px but gains an explicit regular weight and restrained opacity/shadow. These values are **VISUAL-CROSSCHECK / RECONSTRUCTED**; exact 8B117 font rasterization remains **HOLD**.

Clock and date content still come from the existing Lock Screen model. No formatter, time-zone, clock, or scheduler code changes in this pass.

## Text Message alert

| Property | Before | Target |
| --- | ---: | ---: |
| Frame | x 30, y 136, width 260px | x 24, y 137, width 272px |
| Padding | 8 / 11 / 9px | 7 / 10 / 8px |
| Radius | 8px | 8px |
| Title | 16px / 19px, 2px lower gap | 15px / 18px, 1px lower gap |
| Sender/body | 13px / 16px | unchanged |
| Shadow | 6px outer blur at .62 | 4px outer blur at .52 |

The alert keeps the period dark blue-black glossy hierarchy while reducing excessive visual weight. Geometry is **VISUAL-CROSSCHECK** and its CSS material is **RECONSTRUCTED**. Exact `SBAway` runtime panel artwork remains **HOLD**. Notification content, visibility, ownership, and routing are unchanged.

## Slider and wallpaper

The 280 × 52px unlock track, 71 × 47px knob, 96px bottom bar, recovered `WellLock@2x.png`, recovered `BarBottomLock@2x.png`, and recovered `bottombarknobgray@2x.png` remain unchanged and are **PERIOD-EVIDENCE / READY** at the asset and native logical-size level. The right arrow remains embedded in the authentic knob raster; no CSS, Unicode, emoji, SF Symbol, or modern chevron replaces it.

Only label treatment changes: 21px becomes 20px, with weight 300, `-.2px` tracking, 36% white base alpha, and a restrained dark upper edge. The shimmer mask and animation remain unchanged.

A non-interactive 8% black tonal overlay now dims the wallpaper. This is **RECONSTRUCTED** simple compositing: no blur, backdrop filter, translucent-material simulation, or wallpaper crop change is introduced.

## Preserved boundaries

- Status-bar structure and alignment are unchanged.
- Slider travel, threshold, pointer capture, cancellation, and unlock/view routing are unchanged.
- Alert content and delivery timing are unchanged.
- Screen, shell, earpiece, camera, Home button, and side-button geometry are unchanged.
- SpringBoard, applications, keyboard, battery, global time, and session state are unchanged.

## Verification status

Automated seed/build/diff validation is required. Browser comparison is **HOLD** when no in-app browser connection is available; it must not be reported as completed without an actual canonical-viewport inspection.
