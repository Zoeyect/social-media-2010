# iOS 4.1 Camera Wake / Viewfinder v0.1

## Scope

Target: iPhone 4 GSM (`iPhone3,1`), iOS 4.1 build `8B117`, portrait Camera App.

This pass implements only the standalone Camera launch raster, live-preview geometry, and nonfunctional historical chrome. It does not implement capture, video behavior, Camera Roll, Photos integration, Camera picker changes, or a Camera-specific wake duration.

Confidence labels retain their project meanings:

- **CONFIRMED** — exact-build asset or direct period evidence.
- **PROBABLE** — close-period evidence with no known target-build conflict.
- **RECONSTRUCTED** — conservative presentation required where exact runtime values are unavailable.
- **HOLD** — restored evidence or behavior that is intentionally not rendered or claimed.

## Exact-build source

The selected assets were extracted byte-for-byte from `tmp/firmware/rootfs/018-7063-114-decrypted.hfs`. The matching restore archive identifies `ProductType=iPhone3,1`, `ProductVersion=4.1`, `ProductBuildVersion=8B117`, and root filesystem member `018-7063-114.dmg`.

Original CgBI resources remain unchanged under `src/assets/historical/ios4.1/camera/`. Each has a browser-readable standard-PNG companion produced without crop, scaling, recoloring, or redrawing.

### MobileSlideShow.app

| Asset | Pixels | SHA-256 | Role | Confidence |
|---|---:|---|---|---|
| `Default-Camera@2x.png` | 640×960 | `de28eeade1fd86510e74683f226bd2e1c3115324de06189ff0d5b6d1f6bc581c` | Full-screen Camera launch raster | **CONFIRMED** |

### PhotoLibrary.framework

| Asset | Pixels | SHA-256 | Role | Confidence |
|---|---:|---|---|---|
| `CameraButtonIcon@2x.png` | 52×42 | `b15863f15666971c36c66cdf409489654e11f59cb6b4a0927ef04abc4c1a4f14` | Dark Photo-mode shutter glyph | **CONFIRMED** |
| `CameraSwitchIcon@2x.png` | 56×44 | `5e950b84ac19e8c2991b429bbfdfedd0c1791d53f95929ae5eccec1d133e1277` | Photo-mode icon | **CONFIRMED asset** |
| `Video@2x.png` | 56×44 | `874e314c34ceb1a068119aeeb72dbe746492168f80cdea94178329c30d7a1ab3` | Video-mode icon | **CONFIRMED asset** |
| `cameraButtonBarSilver@2x.png` | 4×106 | `ddd026a769c147ba6500d9079330ea8f55e81bfa94f93515b199c0eacad172b1` | Silver bottom-bar repeat | **CONFIRMED** |
| `cameraButtonBarSilverShadow@2x.png` | 4×10 | `dd1c8c4b7fb1d8fc7b72146d50bbc50372acddbe187bd44e4c5b66f853ff17bd` | Unplaced upper shadow | **HOLD / unrendered** |
| `cameraButtonBarSwitchWell@2x.png` | 140×106 | `3ddfb0e610393e505f8c9df4df53dcdd1c09a340cc41097f31bf02dcdfad98cb` | Photo/video switch well | **CONFIRMED asset** |
| `cameraButtonBarSwitchWellBackground@2x.png` | 140×106 | `a17d10395f1cc1de091eb09d9e642590ff2196fd497012249cd85e8dafd13b24` | Photo-mode switch background | **CONFIRMED asset** |
| `cameraButtonSilver@2x.png` | 98×82 | `da85c10cc57880dd39235427b01e66d6c5490caebbb3327c902b192b8fbd530b` | Shutter source | **CONFIRMED asset / RECONSTRUCTED stretch** |
| `cameraPreviewPlaceholder@2x.png` | 74×74 | `c4ae6a1dbce9c7940f7e77cb45b53e60cf2401806b7cb1d2b07022bc243028ba` | Empty thumbnail | **CONFIRMED** |
| `cameraPreviewWell@2x.png` | 94×106 | `b310f58a1b0dc872038a7974c6f4123cb6a947d7bd3b2d679411eb946b05ec58` | Thumbnail well | **CONFIRMED asset** |
| `vc~cameraFlashBackgroundLeft.png` | 49×63 | `6c2a181a78ba93bfd171ce4ff16377bdf01bd7d10abe9b1b039cac53f23d57b4` | Flash left/icon segment | **CONFIRMED asset** |
| `vc~cameraFlashBackgroundRight.png` | 32×63 | `f094f04a33d497ee6c5becb5386ea79f65504a5ba6bf6845036ffdb5e91d15c4` | Flash right segment | **CONFIRMED asset** |
| `vc~cameraHDRButtonLeft.png` | 32×63 | `6f537a08ff0127b4cfa5dccd304d282f751abfbcd6c4f3e787eead94b38accff` | HDR left segment | **CONFIRMED asset** |
| `vc~cameraHDRButtonRight.png` | 32×63 | `f237f08239ed85e35925840cd69e7042eedf7b92f5fb5eba2cc6d8be37d502bd` | HDR right segment | **CONFIRMED asset** |
| `vc~cameraToggle.png` | 120×62 | `bbf65f198b4b4e516063ffef25faaad87dab971e17cf71c718fdaf4fd9316ad2` | Rear/front Camera toggle | **CONFIRMED asset** |

## Geometry and chrome

- Standalone Camera root: `x=0, y=0, w=320, h=480` — **CONFIRMED** device geometry.
- Shared status bar: omitted only while standalone Camera owns the foreground — **PROBABLE** presentation, scoped so Camera picker and unrelated apps retain their existing status bar.
- Live preview: `x=0, y=0, w=320, h=427` — **RECONSTRUCTED WITH STRONG ASSET/RATIO SUPPORT**; this is not an Apple-published runtime constant.
- Bottom bar: `x=0, y=427, w=320, h=53` — boundary and height supported by the exact 640×960 launch raster and 4×106 bottom-bar asset.

Approved top-control outer frames remain **RECONSTRUCTED**:

| Control | Frame in points |
|---|---|
| Flash Auto | `14, 11, 70, 31.5` |
| HDR Off | `119, 11, 82, 31.5` |
| Camera switch | `247, 11, 60, 31` |

Exact UIKit text metrics and cap-inset behavior remain **HOLD**. The implementation uses only the authenticated left/right raster segments plus runtime `Auto` and `HDR Off` text. The Flash left/icon segment remains at its natural 24.5×31.5-point size; Flash and HDR preserve their natural 16-point endcaps and stretch only a one-point flat raster sample through their reconstructed centers. It does not substitute a CSS-drawn pill.

Bottom-control frames:

| Component | Frame in points | Confidence |
|---|---|---|
| Preview well | `0, 427, 47, 53` | **CONFIRMED** in launch raster |
| Empty placeholder | `10, 435, 37, 37` | **CONFIRMED** in launch raster |
| Shutter outer frame | `111, 433, 98, 41` | **CONFIRMED** final raster frame |
| Shutter glyph | `147, 443, 26, 21` | **CONFIRMED** in the launch raster; **PROBABLE** for active runtime |
| Photo/video well | `250, 427, 70, 53` | **CONFIRMED** asset/raster frame |
| Photo icon canvas | `250, 435, 28, 22` | **PROBABLE** |
| Video icon canvas | `292, 435, 28, 22` | **PROBABLE** |

The shutter source is presented at the evidenced 98×41-point final frame using a 20.5 / 57 / 20.5-point cap-preserving reconstruction. The exact launch raster supports the resulting rounded-end/flat-center silhouette, but the original UIKit cap-inset implementation remains unrecovered; the cap values are **PROBABLE / RECONSTRUCTED**, not claimed as original UIKit constants.

The shutter mark uses the authenticated dark `CameraButtonIcon@2x.png` at its native 26×21-point canvas without tint, filtering, recoloring, redrawing, or additional opacity. Its asset identity and dark presentation are **CONFIRMED**. The exact `Default-Camera@2x.png` launch raster confirms its 52×42-pixel canvas at physical coordinates `294, 886` (logical `147, 443`). Reusing that placement for the active runtime is **PROBABLE**. Exact UIKit active/pressed opacity behavior remains **HOLD**.

The Photo/Video well and icons retain their independently composable authenticated rasters. No separate Photo-thumb raster was recovered, so the initially selected Photo thumb is reconstructed at `250.5, 456.5, 21, 14.5` from the authenticated silver-button material at reduced opacity. Its geometry and optical density are calibrated against the exact launch raster, which remains pixel-reference ground truth and is not rendered as runtime bottom chrome. This material reuse is **RECONSTRUCTED**, not claimed as recovered UIKit composition.

## Launch and preview lifecycle

Standalone Camera uses the existing runtime phases:

```text
launching
  → authenticated Default-Camera@2x launch raster
existing preview-ready transition
  → hard replacement with the live preview and chrome
```

No Camera-specific duration, black hold, crossfade, exposure ramp, noise ramp, blur ramp, focus animation, or cinematic lens effect is implemented.

The pre-existing shared app-container launch transition remains unchanged and retains its earlier **HOLD functional approximation** classification. It is not treated as Camera wake timing. Within the Camera surface, the launch raster and preview do not opacity- or scale-interpolate; the runtime phase replaces one with the other directly.

The earlier `180ms raster + 140ms exposure establishment` idea remains only a **RECONSTRUCTED experiment candidate**. It is not an implemented or historical timing claim.

## Camera World Bridge

The renderer remains unchanged. Its existing `cameraBounds()` reads the live preview canvas's actual browser rectangle and derives the WebGL scissor from it. The 320×427 canvas therefore rebinds the Camera pass while preserving the shared scene state, source texture, clock, outer Ambient World and stable Camera treatment.

Stable Camera treatment remains **RECONSTRUCTED** and unchanged:

| Parameter | Value |
|---|---:|
| Blur | `0.10` |
| Exposure | `1.00` |
| Noise | `0.022` |
| Luminance drift | `0.010` |
| Color drift | `0.004` |
| Bloom | `0.16` |

## Preserved boundaries

- Shutter is visual and inert; capture is not wired.
- Initial presentation remains rear Camera, Flash Auto, HDR Off, Photo mode, empty thumbnail.
- Video behavior, Photos, Camera Roll persistence, Camera picker and MobileSMS picker are unchanged.
- `cameraButtonBarSilverShadow@2x.png` is restored but not imported or rendered; placement remains **HOLD**.
- Ambient World idle treatment, scene asset, device shell, Lock Screen, SpringBoard and unrelated app launch behavior are unchanged.
