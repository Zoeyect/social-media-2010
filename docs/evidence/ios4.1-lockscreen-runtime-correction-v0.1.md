# iOS 4.1 Lock Screen Runtime Correction v0.1

## Scope

This change replaces the Lock Screen's generic shared status presentation with a dedicated SBAway-style runtime boundary. It changes only Lock Screen state/presentation, its clock/date formatting, and slider raster composition. SpringBoard, Folder, Messages, App Runtime, Device Audio, and carrier configuration are not redesigned.

Target: iPhone 4 GSM, iOS 4.1 build 8B117, 320×480 logical points / 640×960 Retina pixels, `en-US`, America/Los_Angeles, October 20, 2010.

## Previous generic path

The previous Lock Screen accepted the ordinary SpringBoard/App `StatusBar` React node plus the shared `deviceTime` and `deviceDate` strings. Consequences:

- Lock Screen and SpringBoard used the same status layout.
- The clock inherited the project's old `en-GB`, Asia/Tokyo, 24-hour formatter and displayed `22:xx`.
- Slider chrome used a scaled `BarBottomLock.png` strip while the actual track stayed transparent.
- Recovered `WellLock` and `bottombarbkgndlock` rasters were not composed.
- The border-box bottom bar placed the track at `y=404` and knob at `y=406.5`; the audit's earlier content-box arithmetic was corrected during implementation validation.

## Dedicated SBAway path

`LockScreenModel` now owns Lock Screen-specific clock/date strings and the carrier/network/battery snapshot required by its status presentation. `LockScreenStatusPresentation` renders that snapshot independently; `LockScreen` no longer accepts or renders the shared `StatusBar` component.

Layer order:

1. native 640×960 wallpaper at 2× logical mapping;
2. dedicated 20 pt SBAway status presentation;
3. 96 pt clock/date panel;
4. optional existing lock-screen SMS state;
5. native-height bottom chrome;
6. raster slider well, text and raster knob.

The exact 8B117 center lock glyph remains unavailable by authenticated packed-artwork name. Its position is deliberately empty and marked `HOLD`; no text, CSS symbol, SVG, or generated replacement was introduced.

## Clock and date correction

The Lock Screen model uses:

- session anchor: `2010-10-20T00:02:00-07:00`;
- locale: `en-US`;
- time zone: `America/Los_Angeles`;
- 12-hour formatter, with the day-period part excluded from the large clock;
- date fields: weekday, full month, numeric day.

Visible output begins at:

- clock: `12:02`;
- date: `Wednesday, October 20`.

This formatter is Lock Screen-specific, so the task does not alter SpringBoard or app status-clock behavior. The clock/date panel is fixed at `x=0, y=20, w=320, h=96`; the clock occupies a 65 pt line box after 3 pt top inset and the date uses a 20 pt line box. Horizontal centering is on `x=160`.

The font stack now requests `Helvetica Neue`, then `Helvetica`, then a generic fallback. No font file was added and no raster font was fabricated. Exact 8B117 font face, weight, baseline and antialiasing remain **HOLD**; the implementation must not be described as typographically final.

## Slider raster integration and geometry

| Layer | Asset | Source pixels | Logical rendering | Placement |
| --- | --- | ---: | ---: | --- |
| Bottom background | `bottombarbkgndlock@2x.png` | 158×192 | repeated in 79×96 pt units | `x=0, y=384, w=320, h=96` |
| Slider well | `WellLock@2x.png` | 54×104 | repeated in 27×52 pt units | `x=20, y=407, w=280, h=52` |
| Slider knob/arrow | `bottombarknobgray@2x.png` | 142×94 | 71×47 pt | `x=23, y=411, w=71, h=47` |

The knob retains its embedded authentic arrow. The track and bottom chrome have no CSS gradient, radius, border, shadow, blur, gloss, SVG, or generated artwork. Original PNG bytes are unchanged.

The track's usable movement is 203 pt (`280 - 2×3 - 71`). The existing completion threshold remains `0.78` and is still explicitly provisional; exact 8B117 travel threshold and return animation remain **HOLD**.

## Audio and lifecycle boundary

Successful ordinary unlock still invokes the existing `DeviceAudio.unlock()` path in `App.tsx`. The audio registry and audio files were not changed. Existing SMS `slide to view` routing remains intact and continues to use the same Lock Screen component/state boundary.

## Classification

### READY

- Dedicated Lock Screen model and presentation, separate from the shared SpringBoard/App Status Bar.
- `en-US` / America/Los_Angeles 12-hour large-clock output for the defined session.
- `Wednesday, October 20` date output.
- 320×480 logical / 640×960 Retina mapping.
- Authentic AT&T, signal, 3G and battery assets inherited from the unchanged carrier/status state.
- Authentic `WellLock@2x`, `bottombarbkgndlock@2x`, and gray knob raster bytes and native logical sizes.
- Final implemented raster bounds listed above are evidence-calibrated geometry for v0.1.
- Existing unlock audio call and lifecycle routing preserved.

### HOLD

- Authenticated extraction/name mapping of the centered Lock Screen lock glyph.
- Exact 8B117 clock/date font face, weight, baselines, kerning, shadows and antialiasing.
- Exact runtime cap-inset/stretch semantics versus the current raster-repeat composition.
- Slider text mask/highlight animation.
- Exact slider travel, completion threshold, cancellation and easing.
- Exact per-item Lock Screen status positions and battery-percentage preference.
- Dynamic user wallpaper crop/pan behavior.

### REJECT

- Reusing the ordinary SpringBoard `StatusBar` inside Lock Screen.
- Tokyo/24-hour output for the selected U.S. narrative.
- CSS-generated slider gradients, arrows, gloss, transparency, shadows or borders as artwork replacements.
- Fabricated lock glyphs and modern Lock Screen behaviors.

## Files changed by this correction

- `src/state/lockScreenModel.ts`
- `src/device/LockScreenStatusPresentation.tsx`
- `src/device/LockScreen.tsx`
- `src/device/App.tsx` — Lock Screen wiring only
- `src/styles/device.css` — SBAway presentation and raster geometry only
- `docs/evidence/ios4.1-lockscreen-runtime-correction-v0.1.md`

No PNG, CAF, carrier configuration, SpringBoard component, Folder component, Messages component, app-runtime state, or audio-runtime implementation was modified.
