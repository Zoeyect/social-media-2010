# iOS 4.1 Slide To Unlock Alpha Composition Correction v0.2

## Outcome

The requested runtime replacement is **HOLD** and was not applied because the recovered asset does not contain the text shape assumed by the proposed pipeline. Implementing it as specified would remove the readable label and render a rectangular horizontal alpha band, which would be fabricated behavior rather than iOS 4.1 fidelity.

No slider code, CSS, coordinates, Status Bar code, or historical asset was changed.

## Direct asset verification

`bottombarlocktextmask@2x.png` was decoded directly from its Apple CgBI PNG representation without rewriting the source file.

| Property | Verified result |
| --- | --- |
| Dimensions | 160×64px / 80×32pt |
| Format | CgBI, 8-bit RGBA |
| SHA-256 | `41ebbdb16bfae569c68e2b4119e41c35ede724d5f55a968f25974fb29cf9a233` |
| Unique alpha scanlines | 1 across all 64 rows |
| Alpha range | 13–255 |
| Nonzero alpha columns | 160 of 160 |
| Shape encoded | horizontal intensity ramp; no text glyph silhouette |

If the file encoded `slide to unlock` glyphs, transparent areas would surround individual letter shapes and alpha scanlines would vary vertically. Neither condition is present. The resource is therefore an authentic horizontal highlight/sweep mask, not an authentic rasterized label.

## Proposed pipeline assessment

The requested pipeline was:

```text
slider background
  → bottombarlocktextmask@2x.png defines visible text
  → white text composite
  → highlight using the same mask
```

This is not implementable from the verified asset because it defines no text boundary. A white source masked only by it produces an 80×32pt gradient rectangle. It cannot display either the dynamic ordinary label `slide to unlock` or the firmware-supported SMS label `slide to view`.

The historically plausible architecture instead requires two distinct functions:

```text
runtime-rendered label glyph alpha
  × base text luminance/alpha
  + horizontal highlight mask constrained by the same glyph alpha
```

The recovered PNG can provide the horizontal highlight function. It cannot provide the runtime-rendered glyph alpha. Exact UIKit font rendering, base opacity, blend operation, and animation timing remain unverified.

## Current implementation assessment

The current persistent `#ccc` HTML label at default element opacity remains **REJECT** as final historical alpha fidelity. The duplicate HTML highlight approximation also remains **HOLD**. However, deleting both layers without a verified replacement would be a regression and would violate the instruction not to generate or recreate typography.

No alternate authentic glyph raster exists in the current 8B117 asset inventory. The label also has at least two runtime strings (`slide to unlock` and `slide to view`), reinforcing that the system needed a dynamic text-rendering source rather than one static phrase raster.

## Classification

### READY

- Original mask bytes, dimensions, alpha-channel presence, hash, and direct runtime reference.
- The asset's decoded role as a horizontal alpha ramp rather than text-glyph artwork.
- Existing verified slider background, track, and knob rasters remain unchanged.

### HOLD

- Exact iOS 4.1 label font rasterization and glyph alpha.
- Base white-source opacity/luminance.
- Core Animation compositing and premultiplied-alpha behavior.
- Sweep speed, opacity curve, clipping implementation, and idle interval.
- A faithful browser analogue that preserves both dynamic labels without presenting generic browser typography as Apple-original artwork.

### REJECT

- Using `bottombarlocktextmask@2x.png` alone as the text silhouette.
- Producing a white gradient rectangle and calling it authentic lock-screen text.
- Creating replacement SVG, CSS-drawn, generated, or screenshot-derived glyph artwork.
- Removing the only readable label before a provenance-valid glyph path exists.

## Required evidence before implementation

Implementation can resume after recovering the original `SBAwayLockBar` text-rendering path or equivalent runtime evidence establishing the font/glyph source and how the horizontal mask is composed with it. Until then, the alpha correction remains deliberately **HOLD**.
