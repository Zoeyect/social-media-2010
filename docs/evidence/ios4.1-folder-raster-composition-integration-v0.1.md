# iOS 4.1 Folder Raster Composition Integration v0.1

## Integrated 8B117 assets

| Layer | Asset | Physical / logical size | SHA-256 |
| --- | --- | --- | --- |
| Linen | `FolderSwitcherBG@2x.png` | 640×720 / 320×360 | `1daaed1612ea3475ca9b3195e20f6910710b8a5d62bc147550866dd4852c79cb` |
| Top shadow slice | `FolderShadowTop@2x.png` | 2×48 / 1×24 | `da491651a2b32f14ab72a19d16f41aa62dd6b849269b87baf1393160cad1012d` |
| Bottom shadow slice | `FolderShadowBottom@2x.png` | 1×54 / 0.5×27 | `dbf7b7deca324423a989b1a32fa6d39bf2aee50ae9e5fbc1fba181b27d13e81b` |
| Top notch | `FolderShadowTopNotch@2x.png` | 48×78 / 24×39 | `ac24db2c3671978113c387b68ab9901e7240110275c645885c24ff4233a9d569` |
| Bottom notch | `FolderShadowBottomNotch@2x.png` | 48×80 / 24×40 | `4d8ee565d8391b8f942ee2179912e3291e320637a2601c685cf5b8aebc60c6d2` |

All files are byte-for-byte copies from the verified iPhone3,1 iOS 4.1 (`8B117`) SpringBoard bundle. No normalization, recoloring, cropping, recompression, or generated replacement is used.

## Composition

The previous CSS translucent rounded card has been removed. The Folder panel now uses the authentic 320×360 logical linen raster, repeated native-scale top/bottom raster shadow slices, and native-scale notch rasters. No CSS background color, radius, gradient, blur, or box shadow supplies Folder chrome.

Layer order inside the existing opening/closing overlay:

1. Folder linen raster.
2. Top and bottom raster shadow slices.
3. Top and bottom raster notch layers.
4. Reserved title layer — not rendered because exact title frame/typography remain HOLD.
5. Empty 4×3 icon grid.

The internal grid remains twelve empty 59×74 presentation slots. Its existing screen origin is preserved at `(16,116)`; within the now-centered 320×360 raster this is `(16,56)`. No Folder content, label, placeholder, or third-party icon is introduced.

## Remaining HOLD items

- Exact runtime Y and row-dependent Folder bounds from `linenRectForRows:` and `boundsSizeForRows:`.
- Exact shadow tiling/cap rules and top/bottom/notch selection for the active tear direction.
- Exact notch offsets and animation-time movement.
- Exact Folder title frame, typography, and editing behavior.
- Exact tear animation duration, scale, and easing.
- Exact dock, wallpaper, status-bar, and root-icon sliding composition during opening and closing.

The current centered Y and preserved internal-grid origin remain integration HOLD values; they are not promoted as verified historical offsets.
