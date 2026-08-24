# iOS 4.1 Slide To Unlock Alpha Fidelity Audit v0.1

## Scope and evidence boundary

This is an audit only. It does not change slider position, dimensions, knob travel, Lock Screen geometry, Status Bar, assets, or runtime behavior.

Primary local evidence is the recovered 8B117 `bottombarlocktextmask@2x.png` resource and the current `LockScreen.tsx` / `device.css` composition. Exact original Core Animation blend parameters have not yet been recovered and remain **HOLD**.

## 1. Current rendering

The current layer order is:

1. `BarBottomLock@2x.png` bottom-bar raster;
2. `WellLock@2x.png` track raster via `border-image`;
3. opaque HTML label (`unlock-track-label`);
4. a second HTML label (`unlock-track-highlight`) masked by the recovered PNG;
5. `bottombarknobgray@2x.png` knob.

### Current alpha and blend values

| Layer | Current value | Finding |
| --- | --- | --- |
| Base label | `color: #ccc`; no declared opacity, therefore computed `opacity: 1` | Opaque HTML text; **REJECT** as final historical alpha composition |
| Text mask | CSS `mask-image` / `-webkit-mask-image`; displayed at 80×32pt; no separate element opacity | Used only on the duplicate highlight text, not as the base text's alpha source; **HOLD/mismatch** |
| Highlight | white HTML text; animated opacity `0 → .3 → .65 → 0`; 2.8s linear infinite | Functional approximation; exact opacity/timing **HOLD** |
| Blend mode | none declared | Browser default `normal` source-over compositing; historical blend operation **HOLD** |
| Track | authentic raster beneath both text layers | Raster identity **READY**; cap-inset implementation is outside this audit |

There is no `.slider-text { color: white; opacity: 1 }` rule verbatim, but the effective concern is present: `.unlock-track-label` inherits `#ccc` and the default fully opaque element opacity.

## 2. Historical-composition comparison

The expected reconstruction direction is:

```text
slider background raster
  → recovered text alpha mask defines the text region
  → subtle moving highlight is composited through that region
  → final semi-transparent embedded text result
```

The current implementation instead produces:

```text
slider background raster
  → fully opaque gray HTML text
  → separately masked duplicate white HTML text
```

Consequently, the authentic mask does not control the persistent text alpha. Even if the animated overlay becomes visible, the underlying text remains ordinary browser-rendered text at full element opacity. The current result cannot be classified as faithful iOS 4.1 alpha composition.

Subsequent direct decoding of the CgBI alpha plane established that this resource is a horizontal sweep mask, not a text-glyph mask: all 64 alpha rows are identical and every column is nonzero. It therefore cannot define the persistent text shape. The exact text opacity, luminance, premultiplication behavior, runtime blend operation, and original dynamic-glyph renderer remain **HOLD** rather than being inferred visually.

## 3. Asset provenance

| Property | Verified value | Classification |
| --- | --- | --- |
| File | `src/assets/historical/ios4.1/lockscreen/bottombarlocktextmask@2x.png` | **READY** |
| Source format | Apple CgBI PNG, 8-bit RGBA | **READY** |
| Dimensions | 160×64px / 80×32pt | **READY** |
| Alpha channel | present | **READY** |
| SHA-256 | `41ebbdb16bfae569c68e2b4119e41c35ede724d5f55a968f25974fb29cf9a233` | **READY**; matches the existing 8B117 asset inventory |
| Runtime reference | CSS loads the original file directly | **READY**; no preprocessing or replacement asset |
| Exact alpha structure | 64 identical rows; all 160 columns nonzero; alpha range 13–255 along X | **READY**; horizontal sweep mask, not glyph artwork |

The original bytes are preserved. No gradient, SVG text, replacement raster, or recreated text-mask artwork was added.

## 4. Compositing classification

### READY

- Authentic 8B117 Retina text-mask asset identity, dimensions, alpha-channel presence, and SHA-256.
- Authentic track and bottom-bar rasters remain below the text layers.
- Highlight uses the historical horizontal sweep mask rather than a newly drawn gradient.

### HOLD

- Exact 8B117 base-text opacity and luminance.
- Exact highlight opacity curve, sweep timing, direction, and idle delay.
- Original UIKit/Core Animation blend and premultiplied-alpha behavior.
- Exact movement/compositing relationship between the recovered sweep mask and the runtime-rendered text glyphs.

### REJECT

- Treating the current opaque `#ccc` HTML base label as the final authentic text rendering.
- Claiming the current `normal` browser blend mode or `.65` peak highlight opacity as verified historical constants.
- Describing the current order as “background → authentic text alpha mask → highlight → final composite”; the mask currently affects only the duplicate highlight layer.

## 5. Recommended future correction boundary

A later implementation task must retain a separate dynamic glyph source for `slide to unlock` / `slide to view`; the recovered mask cannot replace it because it contains no glyph silhouette. The historical sweep mask should modulate a highlight constrained by those glyphs. Base luminance/opacity, glyph-rendering metrics, and blend behavior must first be established or explicitly retained as **HOLD**. That correction should not alter slider coordinates, track size, or knob geometry.

## Validation boundary

Only this evidence document is added by the audit. No application code, CSS, asset, or geometry change is part of v0.1.
