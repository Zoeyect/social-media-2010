# iOS 4.1 Lock Screen slider integration

Target: iPhone 4, iOS 4.1, build 8B117.

All assets below were copied byte-for-byte from `tmp/firmware/rootfs/recovered/TelephonyUI.framework/` into `src/assets/historical/ios4.1/lockscreen/`. No image was converted, resized, recompressed, or otherwise modified.

| Asset | Dimensions | Alpha | SHA-256 | Rendering role |
|---|---:|---|---|---|
| `bottombarknobgray@2x.png` | 142 × 94 | Yes | `f57505c51b25ef9b2884f712facee0aebab7d0fa19454e045cc4313b9a0dc57a` | Unlock knob at 71 × 47 logical points; arrow embedded in the original raster |
| `bottombarbkgndlock.png` | 79 × 96 | Yes | `0576041039c60e0bfc7f5d1e720100c6e9ff07621d5259bb366831871fcebf90` | Undistorted, horizontally repeated bottom slider background |
| `BarBottomLock.png` | 1 × 96 | Yes | `13bc408c2f083668ac6e0c833e3c889cb468ea57ae29c91e8613abb2edb1431a` | Verified and promoted; not used by the v0.1 visual mapping |
| `WellLock.png` | 27 × 52 | Yes | `72440574fde1e214fc2dc60a9124a18e4d044ec88a93685f5a17994821e0ac8a` | Verified and promoted; not used by the v0.1 visual mapping |

The existing pointer-driven knob element and unlock threshold logic are unchanged.
