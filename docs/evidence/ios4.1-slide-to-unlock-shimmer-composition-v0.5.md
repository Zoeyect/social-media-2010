# iOS 4.1 Slide To Unlock Shimmer Composition Correction v0.5

## Outcome

No runtime correction was necessary. Direct inspection confirms that the current implementation already has the required persistent base-text layer and a separate temporary shimmer layer. Rewriting it would not improve the verified layer relationship and could introduce geometry or readability regressions.

No component, CSS, asset, slider geometry, or Status Bar code is changed by v0.5.

## Current layer audit

### Layer 0 — Slider background

- `unlock-track-raster` renders the existing authentic `WellLock@2x.png` composition.
- It has `z-index: 0`.
- It has no animation.

### Layer 1 — Persistent base text

- `unlock-track-label` contains the current runtime label: `slide to unlock` or `slide to view`.
- It has `z-index: 1`.
- It is not targeted by `slider-highlight` or the slider-state pause rule.
- It remains visible when the highlight opacity is zero and while the highlight animation is paused.

This satisfies the requirement that the text must not disappear between sweeps.

### Layer 2 — Temporary highlight sweep

- `unlock-track-highlight` contains the same runtime string as the base label and is marked `aria-hidden`.
- The rendered text glyphs inherently define this layer's first alpha boundary.
- `bottombarlocktextmask@2x.png` provides the second alpha boundary through CSS `mask-image`.
- The visible result is the intersection of the highlight text's glyph alpha and the translated historical mask alpha.
- It has `z-index: 2`, above the base text.
- Only mask position and highlight-layer opacity animate.
- It is hidden during `dragging`, `success`, and `returning`; the persistent base label is unaffected.

This satisfies the verified composition relationship:

```text
slider background
  → persistent runtime text glyphs
  → translated historical mask clipped by duplicate runtime glyph alpha
  → final composite
```

The duplicate string is not a second persistent label. It is the dynamic glyph-alpha carrier required to constrain the highlight. Removing it without an equivalent glyph mask would expose the rectangular horizontal mask rather than a text-only shimmer.

### Knob

- The authentic knob remains a separate `button` raster layer.
- No shimmer animation targets it.

## Forbidden-result checks

| Risk | Current result |
| --- | --- |
| Text disappears between sweeps | Not present; base label is independent and persistent |
| Highlight is the only visible text | Not present |
| Whole button glows | Not present |
| Track animates | Not present |
| Knob animates with shimmer | Not present |
| Historical mask replaced | Not present |

## Timing boundary

The current values remain documented approximations:

- cycle: 2.8 seconds;
- easing: linear;
- opacity: `0 → .3 → .65 → 0`;
- active movement ends at 70% of the cycle;
- animation repeats infinitely while idle.

These values remain **HOLD**. v0.5 validates only the layer relationship and does not claim timing fidelity.

## Classification

### READY

- Persistent base text exists independently of the shimmer.
- Separate highlight text supplies dynamic glyph alpha.
- Authentic `bottombarlocktextmask@2x.png` further constrains the highlight.
- Visible movement is left to right.
- Track and knob are not shimmer targets.

### HOLD

- Base text color/alpha and exact system glyph rasterization.
- Highlight opacity, duration, easing, travel endpoints, reset interval, and repeat scheduling.
- Exact original SpringBoard/Core Animation layer implementation.

## Validation boundary

Only this evidence document is added. Existing runtime files may already be modified in the working tree by earlier tasks, but v0.5 makes no changes to them.
