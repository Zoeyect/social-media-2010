# iOS 4.1 Lock Screen Lock Indicator v0.1

## Result

The centered Lock Screen status indicator is **READY** and is integrated only in the dedicated SBAway status presentation. It is removed automatically when the Lock Screen unmounts after unlock and never appears in the shared SpringBoard/App Status Bar.

## Provenance

| Field | Evidence |
| --- | --- |
| Device/build | iPhone3,1, iOS 4.1, build 8B117 |
| Source archive | `/System/Library/Frameworks/UIKit.framework/Shared@2x~iphone.artwork` |
| Archive SHA-256 | `7f2265f0488bda6d49c3a95506193ced36cd461b85460011a45be1d4d38c17e4` |
| Build-matched map | `Shared@2x~iphone.artwork-17663232.json`, iOS 4.1.0 |
| Retina record | index 29, offset 200704, 20×40 pixels |
| Name evidence | Matching opening status-bar block in `Shared~iphone.artwork-19529344.json` names the corresponding record `Black_Lock.png`, 10×20 points |
| Exported file | `src/assets/historical/ios4.1/statusbar/Black_Lock.png` |
| Export SHA-256 | `ee4bd00b5d369a1f8f52edec1add1f48f822b614e88a0a0a014d07474f02f522` |

The export uses the historical artwork tool's documented 8-pixel row packing and premultiplied-BGRA conversion. As a control, the same decoder was applied to Retina index 26 (`Black_DataTypeUMTS`); its decoded pixels matched the existing READY `Black_DataTypeUMTS.png` export byte-for-byte after both were normalized to BMP. This validates the extraction path before promoting the lock record.

The exported PNG is a deterministic lossless RGBA normalization of the raw artwork record. The archive contains raw raster records rather than embedded PNG files, so the PNG hash identifies this normalized export, not a PNG byte stream stored inside the archive.

## Runtime boundary

```text
locked
  → LockScreen
  → LockScreenStatusPresentation
  → centered Black_Lock raster visible

unlock
  → LockScreen unmounts
  → centered lock raster removed
  → SpringBoard shared StatusBar remains unchanged
```

The raster renders at its native 10×20 logical size centered by the existing three-column SBAway status layout. No status-bar geometry, carrier, network, battery, clock, date, slider, wallpaper, or lifecycle transition was changed.

## Classification

### READY

- Exact 8B117 artwork archive and build-matched record.
- Source-derived original UIKit name `Black_Lock.png` from the corresponding named status-bar record block.
- 20×40 Retina pixels / 10×20 logical points.
- Pixel-validated extraction method.
- Locked-only SBAway rendering and automatic removal on unlock.

### HOLD

- Whether Apple internally exposed a more specific `@2x` filename string for this packed record; the archive map uses the generic Retina key while the corresponding named map establishes `Black_Lock.png`.
- Subpixel compositing differences between browser rendering and UIKit's original artwork renderer.

### REJECTED

- CSS-drawn locks, SVG recreation, emoji, modern symbols, screenshot crops, and generated replacements.

## Change boundary

- Added the verified normalized raster export.
- Added the raster only to `LockScreenStatusPresentation`.
- Updated only the center item's intrinsic CSS size.
- Added this provenance record.

No unrelated Lock Screen presentation or application behavior was changed.
