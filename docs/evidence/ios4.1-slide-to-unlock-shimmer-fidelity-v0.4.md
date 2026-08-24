# iOS 4.1 Slide To Unlock Shimmer Fidelity Audit v0.4

## Scope and evidence hierarchy

This is an audit only. No Lock Screen component, CSS, text renderer, slider geometry, animation, or asset is modified.

Evidence is classified as:

- **Tier 1 — ORIGINAL:** recovered iPhone3,1 iOS 4.1 build 8B117 assets and their directly decoded pixel/alpha data.
- **Tier 2 — PERIOD-EVIDENCE:** 2010–2011 descriptions, demonstrations, and close-period implementation observations.
- **Tier 3 — VISUAL-CROSSCHECK:** later reconstructions. These cannot create READY findings and are not used for numeric calibration here.

The exact 8B117 SpringBoard animation constants and an authenticated frame-measurable device recording are not currently available. Numeric timing, opacity, and easing therefore remain **HOLD**.

## 1. Idle shimmer behavior

The classic lock label visibly receives recurring passes while the Lock Screen remains idle. A May 2010 implementation discussion specifically recreating the contemporary iPhone effect models it with a horizontal mask animation and an effectively infinite repeat count. This is close-period corroboration, not Apple source code. [May 2010 period implementation discussion](https://stackoverflow.com/questions/438046/iphone-slide-to-unlock-animation/2778232)

Classification against the proposed models:

| Model | Finding |
| --- | --- |
| A — back-to-back continuous loop | **HOLD** as an exact scheduler model; supported by period recreations but not established for 8B117 |
| B — one animation after lock, then permanent pause | **REJECT**; inconsistent with recurring idle shimmer observations |
| C — periodically triggered pass with an idle interval | **HOLD**; cannot be distinguished from A without frame-measurable original footage or binary constants |

**READY behavioral conclusion:** shimmer is not a one-shot lock-entry effect; it recurs while the label remains idle. Whether the original used a continuously repeating animation with a low-alpha tail or explicitly scheduled separate passes remains unresolved.

## 2. Shimmer duration

No exact 8B117 duration constant was recovered.

- A May 2010 imitation uses a 1.0-second horizontal mask translation with indefinite repetition. This demonstrates a plausible contemporary Core Animation model, not an Apple value. [Period implementation](https://stackoverflow.com/questions/438046/iphone-slide-to-unlock-animation/2778232)
- Later examples range around 1.5–2.8 seconds and cannot be used to calibrate iOS 4.1.
- The current project declares a 2.8-second cycle, but its visible pass ends at 70%, producing approximately 1.96 seconds of active mask travel followed by approximately 0.84 seconds at zero opacity.

| Measurement | Classification |
| --- | --- |
| Exact full sweep duration | **HOLD** |
| Exact complete cycle/repeat interval | **HOLD** |
| Current 2.8s cycle / 1.96s active segment | **READY current-implementation fact**, not historical evidence |

No duration should be promoted to READY from a recreation.

## 3. Direction, start/end, and easing

The visual grammar and close-period implementations agree on a bright region progressing from the label's left side toward its right side. The recovered mask is a horizontal intensity ramp suitable for translation across a text region.

- Sweep direction: **left → right — READY** at behavioral level.
- Start: highlight begins outside or at the left edge of the glyph region — **READY directionally**, exact X **HOLD**.
- End: highlight exits at or beyond the right edge — **READY directionally**, exact X **HOLD**.
- Easing: **HOLD**. Linear translation is plausible and used by recreations, but no exact 8B117 timing function was recovered.
- Autoreverse/right-to-left return: **REJECT** as the target visible behavior; the pass resets for another left-to-right traversal.

## 4. Highlight mask and compositing

### Tier 1 asset facts

`bottombarlocktextmask@2x.png` is an authentic 160×64px / 80×32pt CgBI RGBA asset with SHA-256 `41ebbdb16bfae569c68e2b4119e41c35ede724d5f55a968f25974fb29cf9a233`.

Direct decoding establishes:

- all 64 alpha scanlines are identical;
- all 160 columns have nonzero alpha;
- alpha ranges from 13 to 255 along X;
- the asset encodes a horizontal intensity profile, not glyph silhouettes.

A January 2011 resource-replacement guide identifies the same TelephonyUI filename as the image controlling the flashing lock-text effect, providing close-period corroboration of its role. [Period resource account](https://jingyan.baidu.com/article/11c17a2c5d2048f446e39d2a.html)

### Supported model

```text
runtime text glyph alpha
  × translated horizontal mask alpha
  → shimmer visible only inside the glyphs
```

- Whole mask translated across the text region: **READY model direction**, exact layer API/frame **HOLD**.
- Mask clipped/intersected by glyph alpha: **READY necessary composition**; otherwise the 80×32pt rectangle would become visible.
- Separate animation of the mask's own opacity: **HOLD** and not required by the decoded asset, because its alpha ramp already carries intensity.
- Separate brightness animation: **HOLD**; no original constant/path recovered.
- Mask repeat/reset mechanics: **HOLD**.

The close-period Core Animation reproduction moves the mask layer position and leaves its encoded alpha/profile responsible for the moving intensity. It does not establish that SpringBoard also animated global opacity.

## 5. Base text appearance

| Property | Current implementation | Historical status |
| --- | --- | --- |
| Glyph renderer | browser HTML text | SpringBoard runtime text is **READY** broadly; exact renderer **HOLD** |
| Color | `#ccc` | muted gray/silver direction supported; exact RGB **HOLD** |
| Base opacity | default element opacity `1` | **HOLD** |
| Shadow | no label-specific shadow | **HOLD** |
| Edge/highlight | separate white duplicate text layer | exact historical layer structure **HOLD** |

The non-shimmer state must remain legible at a subdued intensity. The mask's minimum decoded alpha is nonzero, which is compatible with a dim persistent label when a translated mask layer also supplies its baseline alpha. That inference does not reveal the final framebuffer opacity because source color, layer background, premultiplication, and downstream compositing are unknown.

## 6. Highlight strength

No verified 8B117 peak opacity, brightness, or contrast constant is available.

### READY qualitative limits

- The highlight is a localized reflective sweep, not a glow around the text.
- It stays inside glyph boundaries.
- It does not illuminate the track or knob.
- It travels left to right.

### HOLD numeric values

- peak framebuffer opacity;
- base-to-peak luminance ratio;
- contrast against `WellLock`;
- source white level and blend operation.

The current `.65` highlight-layer peak is an implementation approximation. It must not be treated as historically verified, and no evidence supports neon, bloom, blur, or a whole-control white flash.

## 7. Current implementation comparison

Current CSS:

- 2.8s `linear infinite` cycle;
- opacity keyframes `0 → .3 → .65 → 0`;
- mask position moves from `-80px` to `205px` by 70%;
- remaining 30% is a zero-opacity reset/idle segment;
- duplicate white HTML text is masked;
- animation pauses and disappears during dragging, success, and returning.

Comparison:

| Area | Result |
| --- | --- |
| Left-to-right direction | consistent with historical behavior — **READY direction** |
| Historical mask asset | authentic and unchanged — **READY asset** |
| Text-only clipping intent | structurally aligned, exact implementation **HOLD** |
| 2.8s total duration | **HOLD approximation** |
| Explicit opacity animation and `.65` peak | **HOLD approximation** |
| 30% idle/reset interval | **HOLD approximation** |
| Linear easing | plausible but **HOLD** |
| Infinite recurrence | broad recurring behavior supported; exact A-versus-C scheduling **HOLD** |

## READY / HOLD summary

### READY

- Authentic horizontal 8B117 mask identity and decoded alpha structure.
- Recurring idle shimmer rather than one pass only after lock.
- Left-to-right visible sweep.
- Highlight constrained to dynamic text glyph alpha.
- No reverse sweep, track glow, knob glow, blur, bloom, or modern neon effect.

### HOLD

- Continuous-loop versus periodic-trigger implementation model.
- Duration, idle delay, repeat interval, easing, start/end coordinates.
- Base text alpha/color and peak highlight strength.
- Whether opacity/brightness is separately animated in addition to mask translation.
- Exact Core Animation/private SpringBoard layer structure.

### REJECT

- One shimmer at lock followed by permanent inactivity.
- Treating recreation timing as an Apple constant.
- Moving the shimmer right-to-left or autoreversing it visibly.
- Animating the whole slider, knob, or track.
- Modern glow, blur, neon, or excessive white flashing.

## Required evidence for calibration

Exact calibration requires either:

1. the 8B117 `SBAwayLockBar` animation construction/constants; or
2. authenticated iPhone 4 / iOS 4.1 footage with stable frame rate and enough uninterrupted locked-idle time to measure pass duration and inter-pass interval.

Until then, current timing and opacity values remain explicitly provisional.

## Validation boundary

Only this Markdown evidence file is added. No code, CSS, geometry, text rendering, or asset is changed.
