# iOS 4.1 Lock Screen Geometry Fidelity Audit v0.1

## Scope and evidence standard

Target: iPhone 4 GSM (`iPhone3,1`), iOS 4.1 build `8B117`, 640×960 Retina pixels / 320×480 logical points. Narrative runtime: AT&T 3G, `en-US`, America/Los_Angeles, Wednesday, October 20, shortly after midnight.

This is an audit only. No application source, CSS, runtime configuration, or asset was changed. Findings use:

- **READY** — established by exact 8B117 resources/binary behavior, first-party period documentation, or direct 2× arithmetic.
- **HOLD** — plausible but exact 8B117 runtime geometry, typography, compositing, preference, or formatter output is not yet proven.
- **REJECT** — the current technique or value must not be represented as authentic final iOS 4.1 output.

The main evidence is the verified 8B117 root filesystem, its exact SpringBoard executable (SHA-256 `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d`), recovered resources from UIKit, TelephonyUI and AT&T_US.bundle, current component/CSS values, and the period structural cross-check recorded in [ios4.1-lockscreen-v0.2.md](./ios4.1-lockscreen-v0.2.md). A period screenshot is a cross-check, not an asset source.

## Coordinate summary

| Region | Current implementation | Evidence-backed target | Classification |
| --- | --- | --- | --- |
| Screen | `0,0,320,480` logical | `0,0,320,480` logical / `0,0,640,960` Retina | **READY** |
| Status bar | `x=0, y=0, w=320, h=20` | 20 pt / 40 px high | **READY** geometry |
| Clock/date panel | begins at `y=20`; CSS height depends on browser font metrics | period cross-check approximately `x=0, y=20, w=320, h=96`, ending near `y=116` | **HOLD** exact 8B117 bounds |
| Bottom-bar element | border box `x=13, y=394, w=294, h=72`, including 10 pt top/bottom padding | period bottom region begins near `y=386`; recovered `BarBottomLock@2x` is intrinsically 96 pt high | **HOLD**; current geometry does not reproduce the raster's native logical height |
| Unlock track | `x=13, y=404, w=294, h=52` | period cross-check approximately `x=20, y=407, w=280, h=49`; `WellLock@2x` is intrinsically 27×52 pt | **HOLD** exact composition |
| Unlock knob | `x=13, y=406.5, w=71, h=47` before dragging | authentic knob is exactly 142×94 px / 71×47 pt | **READY** size; **HOLD** x/y |

The period coordinates above are visual measurements, not extracted constants. They must not be promoted to implementation values until an exact-build runtime capture or traced layout path confirms them.

## 1. Wallpaper geometry

| Property | Current value | Verified value / evidence | Result |
| --- | --- | --- | --- |
| Source | `DefaultWallpaper@2x~iphone.png` | Exact 8B117 UIKit resource, 640×960 RGB CgBI PNG; SHA-256 `f23cc973f4f2d8eb619de29f58948a924527a3edf9698f3acc5913493029287f` | **READY** asset |
| Logical scale | CSS `320px 480px` | Exact 2× mapping gives 320×480 pt | **READY** |
| Crop | centered, explicit full-screen size, no repeat | Full source fits the framebuffer exactly; no crop is needed for this source | **READY** for this fixed source |
| Stretch | 640×960 source displayed at 320×480 CSS pixels | Uniform 2× Retina mapping, not aspect distortion | **READY** |
| Alignment | centered at screen origin beneath all chrome | Full-frame source aligns to `x=0, y=0`; status bar overlays its top 20 pt | **READY** implementation geometry |
| Pristine-install assignment | same recovered default is used by current Lock Screen and SpringBoard | Binary strings prove distinct persisted Lock/Home wallpapers and a shared-wallpaper mode, but not the exact first-boot selection | **HOLD** historical default state |

No screenshot crop, recreated wallpaper, CSS scaling beyond the native 2× mapping, or generated visual is involved.

## 2. Lock Screen status bar

### Overall bar

The 20 pt height is **READY**. Current padding is 2 pt vertically and 6 pt horizontally; the grid is `21px auto auto 1fr 10px auto 24px` with 3 pt gaps. Exact 8B117 item frames and baseline positions remain **HOLD**. The fixed `rgba(0,0,0,.62)` background and CSS text shadow are structural approximations, not authenticated Lock Screen chrome; claiming them as exact artwork is **REJECT**.

### Signal, carrier and network

| Item | Current | Evidence | Classification |
| --- | --- | --- | --- |
| Signal | authentic `Black_0...5_Bars` family, 38×40 px / 19×20 pt, placed in a 21 pt column | recovered 8B117 status family; leftmost status item | **READY** asset and order; **HOLD** exact x/y and selected strength |
| Carrier | authentic `FSO_CARRIER_ATT@2x.png`, 63×40 px / 31.5×20 pt | exact `ATT_US.bundle` asset; SHA-256 `b75add2544c6cdc48b61103db8fa8cfca99cc5fcbb3005ed06a7ec286711b44e` | **READY** asset and narrative value; **HOLD** FSO-vs-Default style choice and exact x/y |
| 3G | authentic `Black_DataTypeUMTS.png`, 30×40 px / 15×20 pt | exact recovered 8B117 status asset | **READY** capability/artwork; **HOLD** scene-specific radio state and exact spacing |

`AT&T 3G` is historically appropriate for the selected U.S. narrative, but it is a runtime state, not a claim about every iPhone 4 session.

### Center item and time format

Current behavior is `en-GB`, `Asia/Tokyo`, 24-hour time, shared by both ordinary Status Bar and Lock Screen; it produces values such as `22:11`. This is **REJECT** for the selected U.S./Pacific narrative.

The exact SpringBoard binary contains the separate Lock Screen class family `SBAwayController`, `SBAwayView`, `SBAwayDateView`, and `SBAwayLockBar`, plus `_updateStatusBarLockAndTime`. Period evidence shows a centered lock indicator on the locked screen rather than the ordinary centered status-bar clock. Therefore:

- the current centered `22:11` on the Lock Screen is an implementation mismatch;
- ordinary unlocked Status Bar time remains full-screen centered;
- exact 8B117 lock-glyph identity and conditional time/lock behavior remain **HOLD** because the packed glyph is not yet mapped by authenticated name;
- if a Lock Screen runtime branch displays time, the target locale cycle is 12-hour. The exact presence, spacing and typography of `AM` in that status surface remain **HOLD**.

The narrative example `12:11 AM` must not be copied into the large clock. The large Lock Screen clock is separately expected to show `12:11`; surface-specific formatter behavior remains to be proven.

### Battery

Current battery artwork uses authentic recovered 8B117 assets: a 42×40 px / 21×20 pt frame, 6×40 px fill strip, low-fill strip, and charging glyph. The right grid column is 24 pt. Asset identity and logical size are **READY**; exact right inset, fill mask/cap behavior, percentage baseline and glyph alignment are **HOLD**.

The percentage is always rendered. iOS 4.1 treated battery percentage as an optional preference, so unconditional display is an implementation-policy gap. The low red raster is authentic, but the project threshold and continuous fill calculation are narrative/runtime choices, not recovered Lock Screen geometry.

## 3. Large clock

Current CSS uses a centered generic inherited sans-serif at `62px`, numeric weight `200`, browser-default `normal` line height, and `text-shadow: 0 1px 2px #000`. The top panel begins after the 20 pt status bar and adds 16 pt top padding, so the clock line box begins around `y=36`; its exact visible glyph bounds vary by browser/font.

Period cross-check places a sample clock's visible bounds approximately at `y=29..79` and the combined clock/date panel ending near `y=115/116`. The current clock is therefore likely low, but an exact offset cannot be asserted without rendering the same time in the authentic font pipeline.

| Property | Current | Verified target | Result |
| --- | --- | --- | --- |
| Content | shared `deviceTime`, currently 24-hour Tokyo | `12:xx` for the target session; no day-period suffix in the large clock | target content **READY**; current **REJECT** |
| Horizontal alignment | centered | centered on x=160 | **READY** |
| Top/baseline | 16 pt panel padding; browser-derived baseline | exact 8B117 baseline not extracted | **HOLD** |
| Font | generic inherited sans-serif | authentic system font/rendering call not identified | **REJECT** as final fidelity claim |
| Size/weight | 62 px / weight 200 | exact nominal size/weight unknown | **HOLD** |
| Shadow | CSS `0 1px 2px #000` | exact raster/text shadow unknown | **REJECT** as authenticated treatment |
| Line height | browser `normal` | exact metrics unknown | **HOLD** |

## 4. Date label

Current content is dynamic `en-US` weekday/month/day text but is calculated in `Asia/Tokyo`; current size is 16 px, centered, with the clock's inherited weight and shadow. For the corrected target instant, `Wednesday, October 20` is the intended locale string.

Period cross-check places visible date glyphs around `y=89..103`, with roughly 4–8 pt between the clock and date visible glyphs. Exact 8B117 font, size, weight, baseline, punctuation branch, tracking, shadow and spacing are **HOLD**. The current center alignment and target English content are **READY**; the current Tokyo time-zone input and generic typography are **REJECT** for final fidelity.

## 5. Unlock slider

### Track and bottom chrome

The current bottom bar uses only the authentic 1× `BarBottomLock.png` repeat slice as a CSS background. The global `border-box` rule makes the background positioning area 294×72 pt, so its 1×96 px source is scaled to 72 pt high. The authentic Retina sibling is 1×192 px, corresponding to 0.5×96 pt. The current use therefore does not preserve native height.

The `.unlock-track` itself is transparent. Although authentic `WellLock`, `WellLock@2x`, `bottombarbkgndlock`, and Retina background resources are present in the repository, they are not composed by the current Lock Screen. Exact cap insets and layer order remain **HOLD**; replacing them with CSS borders, gradients, radius or shadow would be **REJECT**.

### Thumb

The current thumb uses the exact `bottombarknobgray@2x.png` bytes, SHA-256 `f57505c51b25ef9b2884f712facee0aebab7d0fa19454e045cc4313b9a0dc57a`, at its native 71×47 pt logical size. The arrow is embedded in the raster; there is no CSS arrow. Asset, alpha, dimensions and arrow treatment are **READY**. Its current initial x/y (`13,406.5`) and sub-point 2.5 pt vertical offset are **HOLD**.

### Text and interaction geometry

Current text is generic sans-serif at 21 px, line-height 52 px, color `#ccc`, centered then shifted 10 pt left. Authentic `bottombarlocktextmask` resources exist in 8B117 evidence but are not integrated. Consequently font, baseline, highlight/mask animation, opacity and shadow are **HOLD**; the flat CSS treatment is **REJECT** as final historical artwork.

Current travel is 223 pt (`294 - 2×0 - 71`) and completion threshold is explicitly provisional at `0.78`. Exact travel, threshold, cancellation and motion are **HOLD**. Continuous horizontal drag and left-to-right movement are **READY** behavior.

## 6. Bottom geometry

Current computed geometry:

- bottom-bar border box: `x=13`, `y=394`, `w=294`, `h=72`; the global `border-box` rule includes its padding in that height;
- track: `x=13`, `y=404`, `w=294`, `h=52`;
- thumb: `x=13`, `y=406.5`, `w=71`, `h=47`, ending at `y=453.5`;
- visible thumb-to-screen-bottom distance: 26.5 pt;
- the simulated physical Home button is outside the 320×480 framebuffer, so it must not affect Lock Screen content geometry.

The current track is close to the period cross-check y range, but its width, x inset and incomplete raster composition differ. The correct 8B117 replacement geometry remains evidence-calibrated rather than derived from the old CSS. Period visual evidence places the full bottom overlay near `y=386..480` and the track near `y=407..456`; these are comparison ranges only.

## 7. Asset disposition

### READY

- Native 640×960 UIKit wallpaper and exact 2× full-screen rendering.
- Authentic gray Retina unlock knob with embedded arrow.
- Authentic `BarBottomLock`, `WellLock`, `bottombarbkgndlock`, and text-mask families; identity, bytes, alpha and intrinsic dimensions only.
- Authentic recovered signal, UMTS/3G, battery, Bluetooth and AT&T FSO carrier assets.
- 320×480 logical frame, 2× scale, 20 pt status band, centered large clock/date structure, bottom slider structure and continuous slide behavior.

### HOLD

- Exact `SBAwayView`/`SBAwayDateView` frames, baselines and font calls.
- Exact lock-screen center status item, glyph and time/lock conditional path.
- Exact per-item status-bar x/y positions and the correct Default-versus-FSO carrier variant.
- Exact clock/date fonts, weights, sizes, line heights, shadows and date-format punctuation.
- Exact slider cap insets, track composition, bottom-bar height/y, text-mask animation and layer order.
- Exact slider initial x/y, travel, completion threshold and motion.
- First-boot Lock/Home wallpaper assignment and user-selected wallpaper crop behavior.
- Battery-percentage preference and scene-specific signal/network state.

### REJECT

- Current 24-hour Tokyo clock for the U.S./Pacific target.
- Generic fonts and CSS shadows presented as authentic 8B117 typography.
- CSS-created slider chrome, arrows, gradients, borders or gloss in place of recovered raster composition.
- The current flat transparent track and scaled 1× bottom slice as a claim of complete authentic slider composition.
- Modern Notification Center/banner UI, camera grabber, swipe-up unlock, Face ID affordances, widgets, or iOS 7+ styling.
- Screenshot-derived, generated, or modern replacement artwork.

## Current versus target priority

1. **HOLD evidence first:** trace exact `SBAwayDateView` and `SBAwayLockBar` layout/composition calls or capture an authenticated 8B117 runtime at 640×960.
2. **Known mismatch:** separate ordinary Status Bar formatting from Lock Screen large-clock formatting and replace the Tokyo/24-hour target later; this audit does not implement it.
3. **Known incomplete composition:** map the recovered well/background/text-mask cap semantics before changing the slider.
4. **Do not tune by eye:** clock/date baselines and bottom offsets must remain HOLD until the authentic font and runtime frames are measurable.

## Validation boundary

This audit adds only this Markdown evidence file. It applies no visual adjustment, adds no asset, and modifies no historical PNG. Build and whitespace validation results are recorded at handoff.
