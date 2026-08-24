# iOS 4.1 Lock Screen asset recovery v0.1

## Scope

Target device: iPhone 4 GSM (`iPhone3,1`)  
Target OS: iOS 4.1  
Target build: `8B117` (Baker)

This record covers asset recovery only. No recovered file has been connected to application rendering, and no React, CSS, state-machine, or existing tracked asset file was modified.

Classifications:

- **READY** — byte-for-byte resource recovered from the verified target root filesystem; identity and metadata are established.
- **HOLD** — resource is missing, packed without a verified extraction map, or its exact runtime role remains uncertain.
- **REJECTED** — resource or feature belongs to a later iOS release and must not be used for this target.

## Source and extraction chain

| Item | Evidence |
|---|---|
| IPSW | `tmp/firmware/iPhone3,1_4.1_8B117_Restore.ipsw` |
| IPSW SHA-1 | `a3f8a333ca181146b862ca6a59c9a6e7c27eba0b` — previously verified exact match |
| Product/build | `Restore.plist`: `ProductType=iPhone3,1`, `ProductVersion=4.1`, `ProductBuildVersion=8B117` |
| Root filesystem member | `018-7063-114.dmg`, named by `Restore.plist` under `SystemRestoreImages/User` |
| Extracted encrypted DMG SHA-256 | `da41c2f5b339ada2e32d130bf366219a0b1156ff83c7c32703f8c13d5a6c7b0f` |
| Root filesystem key provenance | [The iPhone Wiki, Baker 8B117 (iPhone3,1)](https://www.theiphonewiki.com/wiki/Baker_8B117_%28iPhone3%2C1%29); the key is intentionally omitted from this tracked record |
| DMG/HFS tooling | Locally compiled, unmodified xpwn source revision `20c32e5c12d1b22a9d55a59a0ff6267f539b77f4` |
| DMG result | Decryption/decompression succeeded; xpwn identified a readable HFS+ volume with total filesystem size `747,995,136` bytes |
| Extraction scope | Exact files only from `TelephonyUI.framework`, `UIKit.framework`, and the `SpringBoard.app` executable; the full filesystem was not copied into tracked source |
| Exact SpringBoard executable | 1,575,168 bytes; SHA-256 `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d` |

The temporary build used the existing local OpenSSL and zlib dependencies. The only compiler diagnostics were OpenSSL 3 deprecation warnings in xpwn's historical AES/HMAC calls; the tool completed and the output HFS+ catalog was readable.

## Format note: Apple CgBI PNG

All recovered images below are PNG resources containing Apple's `CgBI` chunk. This is the native on-device iOS PNG representation, not a corrupt file. The recovered bytes were not normalized, optimized, recompressed, or converted.

Metadata was read directly with macOS ImageIO through `sips`. Temporary standard-PNG previews were generated under `/tmp` solely for visual inspection; those previews are not evidence assets, are not stored in the project, and are not listed as recovered outputs.

## READY — authentic slider resources

Source bundle for every resource in this section:

`/System/Library/PrivateFrameworks/TelephonyUI.framework/`

Temporary byte-for-byte recovery directory:

`tmp/firmware/rootfs/recovered/TelephonyUI.framework/`

### Unlock knob and embedded arrow

| Filename | Bytes | Dimensions | Format | Alpha | SHA-256 | Confidence |
|---|---:|---:|---|---|---|---|
| `bottombarknobgray.png` | 1,642 | 71 × 47 | CgBI PNG, 8-bit RGBA | Yes | `5aa3421d0dd03ed322fdc108c9e9f97020765d04556aa916fd379469bf6cb03b` | **READY / exact 1× resource** |
| `bottombarknobgray@2x.png` | 3,830 | 142 × 94 | CgBI PNG, 8-bit RGBA | Yes | `f57505c51b25ef9b2884f712facee0aebab7d0fa19454e045cc4313b9a0dc57a` | **READY / exact Retina resource** |

Visual inspection of a temporary decode confirms that the right-pointing arrow is already composited into the complete gray knob raster. There is no need to invent or separately draw an arrow.

- Asset identity: **READY**, high confidence, from filename, exact bundle path, and recovered visual.
- Lock Screen use: **READY**, high confidence. Contemporary iOS theming documentation independently identifies `bottombarknobgray` as the unlock knob.
- Separate arrow asset: **HOLD / not applicable unless later code evidence contradicts the composite**. No standalone Lock Screen arrow was found; the arrow is present in the original knob.

### Green and red sibling knob states

These were recovered to distinguish the unlock resource from other TelephonyUI actions. They are authentic 8B117 files but are not the normal Lock Screen unlock knob.

| Filename | Bytes | Dimensions | Format | Alpha | SHA-256 | Classification |
|---|---:|---:|---|---|---|---|
| `bottombarknobgreen.png` | 1,837 | 71 × 47 | CgBI PNG, 8-bit RGBA | Yes | `e16bd34232be10ab485e0d75ce33975742ac641298a47c80e1eacde54e89299f` | **READY authentic; not normal unlock state** |
| `bottombarknobgreen@2x.png` | 4,400 | 142 × 94 | CgBI PNG, 8-bit RGBA | Yes | `62a1bb039c70f3cf183d095ac4a1ad9ae8e1baa0f4ce99d02d1c7413368fb29b` | **READY authentic; not normal unlock state** |
| `bottombarknobred.png` | 1,796 | 70 × 47 | CgBI PNG, 8-bit RGBA | Yes | `409d84c29818ed3b1443c511ee78f07634f8ba7513c949ac8e6574a649982b3c` | **READY authentic; power-off/action state, not unlock** |
| `bottombarknobred@2x.png` | 4,283 | 140 × 94 | CgBI PNG, 8-bit RGBA | Yes | `49adb362140fc63eabc9f75f70286e793cfcad98a205358f751bccf22e524863` | **READY authentic; power-off/action state, not unlock** |

The size difference in the red pair is original metadata and has not been corrected or normalized.

### Slider well, background, and text mask

| Filename | Bytes | Dimensions | Format | Alpha | SHA-256 | Confidence / role |
|---|---:|---:|---|---|---|---|
| `WellLock.png` | 4,030 | 27 × 52 | CgBI PNG, 8-bit RGBA | Yes | `72440574fde1e214fc2dc60a9124a18e4d044ec88a93685f5a17994821e0ac8a` | **READY**; slider-well segment, high confidence |
| `WellLock@2x.png` | 2,886 | 54 × 104 | CgBI PNG, 8-bit RGBA | Yes | `30a1de0c4f2f4cfabb94dc9d66d8257b2b6335cd64d4b9e0b7fccd02a49cbbba` | **READY**; Retina slider-well segment, high confidence |
| `BarBottomLock.png` | 2,912 | 1 × 96 | CgBI PNG, 8-bit RGBA | Yes | `13bc408c2f083668ac6e0c833e3c889cb468ea57ae29c91e8613abb2edb1431a` | **READY**; vertically complete bottom-bar repeat slice, high confidence |
| `BarBottomLock@2x.png` | 332 | 1 × 192 | CgBI PNG, 8-bit RGBA | Yes | `9f4fcbf680a6ca4d242f0ac91d5c663754118108d120dc133160f343559defea` | **READY**; Retina bottom-bar repeat slice, high confidence |
| `bottombarbkgndlock.png` | 2,155 | 79 × 96 | CgBI PNG, 8-bit RGBA | Yes | `0576041039c60e0bfc7f5d1e720100c6e9ff07621d5259bb366831871fcebf90` | **READY asset**; exact cap/stretch semantics remain HOLD |
| `bottombarbkgndlock@2x.png` | 3,324 | 158 × 192 | CgBI PNG, 8-bit RGBA | Yes | `5b7a29c3a372bf9dbb3beb2b2d48ecfeb8ec6829476276bc0311f840f7661bb9` | **READY asset**; exact Retina cap/stretch semantics remain HOLD |
| `bottombarlocktextmask.png` | 343 | 80 × 32 | CgBI PNG, 8-bit RGBA | Yes | `f3b645053c651d6ce983fcca06c341d06722bd3b8e2e97c52a89104db05e9e07` | **READY asset**; animated text-mask role, high confidence |
| `bottombarlocktextmask@2x.png` | 459 | 160 × 64 | CgBI PNG, 8-bit RGBA | Yes | `41ebbdb16bfae569c68e2b4119e41c35ede724d5f55a968f25974fb29cf9a233` | **READY asset**; Retina animated text mask, high confidence |

Important implementation boundary: authentic bytes and intrinsic dimensions are READY. The exact stretching/cap-inset configuration, layer order, and placement calls are not established by filenames alone and remain HOLD until TelephonyUI/SpringBoard rendering semantics are traced.

## READY — default iPhone Retina wallpaper resource

| Field | Result |
|---|---|
| Original path | `/System/Library/Frameworks/UIKit.framework/DefaultWallpaper@2x~iphone.png` |
| Source bundle | `UIKit.framework` |
| Filename | `DefaultWallpaper@2x~iphone.png` |
| Temporary recovered path | `tmp/firmware/rootfs/recovered/UIKit.framework/DefaultWallpaper@2x~iphone.png` |
| Bytes | 949,265 |
| Dimensions | 640 × 960 |
| Format | CgBI PNG, 8-bit RGB |
| Alpha | No |
| SHA-256 | `f23cc973f4f2d8eb619de29f58948a924527a3edf9698f3acc5913493029287f` |
| Visual content | Apple's water-droplet wallpaper, full Retina portrait canvas |
| Asset authenticity | **READY**, high confidence: exact target root filesystem and explicitly named UIKit default resource |

### Lock Screen versus SpringBoard use

The exact 8B117 SpringBoard executable contains these strings:

- `LockBackground.jpg`
- `LockBackgroundPortrait.jpg`
- `LockBackgroundThumbnail.jpg`
- `HomeBackground.jpg`
- `HomeBackgroundLandscape.jpg`
- `HomeBackgroundThumbnail.jpg`
- `SBUseUniqueHomeScreenWallpaper`
- `lockScreenAndHomeScreenShareWallpaper`

Conclusions:

- The recovered UIKit file is unquestionably the exact-build default iPhone Retina wallpaper resource: **READY**.
- SpringBoard supports separate persisted Lock and Home wallpaper files and a mode in which they share wallpaper: **SOURCE-DERIVED**, high confidence from the exact binary.
- The wallpaper may be displayed by both Lock Screen and SpringBoard when the shared-wallpaper mode is active: **SOURCE-DERIVED**, high confidence.
- The exact first-boot preference path that selects this default resource for both screens was not dynamically traced: **HOLD**, medium uncertainty. Do not claim that every 8B117 installation always displays it on both screens.
- No cropping is required for the recovered source itself: it is already a complete 640 × 960 Retina portrait canvas. Any runtime pan/zoom/crop semantics remain **HOLD** until traced.

## HOLD — centered status-bar lock glyph

No standalone lock glyph PNG was found in either:

- `/System/Library/CoreServices/SpringBoard.app/`
- `/System/Library/PrivateFrameworks/TelephonyUI.framework/`

UIKit contains the exact packed archive:

`/System/Library/Frameworks/UIKit.framework/Shared@2x~iphone.artwork`

Recovered temporary archive:

`tmp/firmware/rootfs/recovered/UIKit.framework/Shared@2x~iphone.artwork`

Archive size: `17,663,232` bytes.

Archive SHA-256: `7f2265f0488bda6d49c3a95506193ced36cd461b85460011a45be1d4d38c17e4`.

Period evidence indicates that signal, Wi-Fi/network, battery, and related status glyphs reside in this packed artwork family. The historical `iOS-Artwork-Extractor` source was obtained at revision `17e6f1a62ca846c9c6535a8104a0f7e7a1221a66`, but it depends on a matching historical iOS SDK/simulator and private UIKit image-name mapping. It is not a safe generic command-line carver for this device archive on the current host.

Therefore:

- Exact centered lock glyph: **HOLD**.
- Signal/network/battery status glyph rasters from this archive: **HOLD**.
- Blind byte carving or assigning unnamed images by appearance: rejected because it would lose the name/index provenance needed to establish runtime identity.

## Camera asset audit

Targeted catalog searches found no filename containing `camera` in:

- `/System/Library/PrivateFrameworks/TelephonyUI.framework/`
- `/System/Library/CoreServices/SpringBoard.app/`

Targeted string searches of the exact 8B117 `SpringBoard` Mach-O found no `lock...camera`, `camera...lock`, or camera-grabber identifier.

Classification:

- A persistent Lock Screen camera shortcut asset for iOS 4.1: **absent in the searched target bundles**, high confidence.
- iOS 5 double-Home camera UI: **REJECTED** for this target.
- iOS 5.1 camera grabber and upward-drag assets: **REJECTED** for this target.
- This negative search does not claim that Camera.app contains no camera artwork; it establishes that no Lock Screen camera resource or code marker is present in the relevant 8B117 bundles searched.

## Search-target disposition

| Requested target | Result |
|---|---|
| `bottombarknob` | No exact unsuffixed file; color-specific authentic family recovered. |
| `bottombarknobgray` | **READY:** 1× and 2× recovered; correct unlock knob; arrow embedded. |
| `bottombarknobred` | **READY asset:** 1× and 2× recovered; not the normal unlock knob. |
| `bottombarknobgreen` | **READY asset:** 1× and 2× recovered; not the normal unlock knob. |
| unlock | No visual file named `unlock`; `unlock.aiff` exists in SpringBoard.app but is audio and was not recovered because this task targets visuals. |
| slide | No standalone filename containing `slide` in the relevant bundle listings. |
| arrow | No standalone Lock Screen arrow; the authentic arrow is embedded in `bottombarknobgray`. |
| lock glyph | **HOLD:** no standalone file; likely packed artwork, identity not safely carved. |
| camera shortcut | **REJECTED / absent for 4.1:** no target-bundle file or exact-binary marker found. |
| slider background | **READY asset family:** `BarBottomLock`, `WellLock`, `bottombarbkgndlock`, and mask pairs recovered; exact composition semantics remain HOLD. |
| default wallpaper | **READY asset:** exact 640 × 960 UIKit default Retina wallpaper recovered; pristine first-boot screen assignment remains HOLD. |

## Final classification

### READY

- Authentic gray Lock Screen unlock knob at 1× and 2×, including its original embedded arrow.
- Authentic green and red sibling action knobs at 1× and 2×, correctly distinguished from normal unlock.
- Authentic `WellLock`, `BarBottomLock`, `bottombarbkgndlock`, and `bottombarlocktextmask` resource pairs.
- Authentic 640 × 960 `DefaultWallpaper@2x~iphone.png` from the exact 8B117 UIKit framework.
- Exact original paths, byte sizes, intrinsic dimensions, alpha state, and SHA-256 values recorded above.

### HOLD

- Exact runtime layer order, stretch/cap insets, and coordinates for the recovered slider background pieces.
- Centered status-bar lock glyph and other status glyphs inside packed UIKit artwork.
- Authenticated extraction/name map for `Shared@2x~iphone.artwork` on this exact build.
- Exact first-boot preference decision proving whether Lock Screen and Home Screen initially share the UIKit default wallpaper.
- Wallpaper runtime crop/pan/scale behavior.

### REJECTED

- iOS 5 double-Home camera shortcut UI.
- iOS 5.1 Lock Screen camera grabber and upward-drag UI.
- Later-iOS or modern status glyphs.
- Screenshot crops, recreated slider pieces, CSS-drawn final artwork, generated substitutes, and unnamed blind artwork carving.

## Recovery conclusion

The principal iOS 4.1 Lock Screen slider assets and full Retina default wallpaper have been recovered byte-for-byte from the verified `iPhone3,1` 8B117 root filesystem and are READY for a separate placement/usage forensics step. They have not been promoted into tracked application assets or wired into the Lock Screen. The centered lock/status glyph family and exact composition semantics remain HOLD.
