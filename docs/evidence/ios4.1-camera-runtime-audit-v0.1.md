# iOS 4.1 Camera Runtime & UI Audit v0.1

## Scope and evidence hierarchy

Target: iPhone3,1, iOS 4.1 build 8B117, October 20, 2010.

This is an evidence audit only. No Camera runtime, UI, asset integration, or existing application behavior was changed.

- **ORIGINAL:** the local decrypted 8B117 root filesystem, especially `/Applications/MobileSlideShow.app`, `/System/Library/PrivateFrameworks/PhotoLibrary.framework`, their binaries, strings, and raster resources.
- **PERIOD-EVIDENCE:** the September 2010 iOS 4 user guide and contemporaneous iOS 4.1 coverage.
- **HARDWARE:** Apple’s iPhone 4 technical specifications.

Classifications:

- **READY:** directly established by 8B117 resources and/or strong period evidence.
- **HOLD:** runtime behavior or composition requiring an original-device trace, exact screenshot, or additional binary analysis.
- **REJECT:** behavior or visual language introduced after the target system.

## 1. Launch behavior

### Historical application path

Camera is a role of Apple’s built-in `MobileSlideShow.app`, not a third-party bundle. The exact target bundle contains:

- `icon-Camera@2x.png`;
- `Default-Camera@2x.png`;
- the `MobileSlideShow` executable;
- separate Camera and Photos role declarations/resources.

The executable exposes `showCamera`, `_setupPhotoOrCameraUI`, `_switchToCamera`, `CameraViewController`, `cameraViewIsReady:`, `cameraViewFinishedTakingPicture:`, and `cameraViewFinishedClosingIris:`. A normal Camera icon activation therefore selects the Camera role and enters the live camera controller. This route is **READY**.

The full-screen Retina launch raster is also **READY**. Exact SpringBoard icon-to-launch-raster animation timing, scale curve, and handoff to the live preview remain **HOLD**.

### Current project comparison

The authentic Camera icon is present in Page 1 and the Dock, but neither Camera icon currently has an `onActivate` launch handler. `SpringBoard` launches only Messages from the verified system-icon set. There is no Camera runtime surface. Therefore:

- authentic Camera icon presence: **READY / implemented**;
- Camera icon launch path: **HOLD / not implemented**;
- generic shared app launch animation: implemented for launchable apps, but not historically calibrated for Camera;
- Camera preview ownership: not implemented.

### SpringBoard versus MobileSMS attachment

These are distinct historical entry paths:

1. **SpringBoard Camera icon:** launches the MobileSlideShow Camera role as the foreground application.
2. **MobileSMS attachment/camera action:** should request the system camera picker/capture controller from within the Messages workflow, then return selected media to Messages. It must not be modeled as tapping the SpringBoard Camera icon or permanently transferring the conversation to a separate Camera app.

The target firmware’s shared `PhotoLibrary.framework` contains camera picker, preview, camera sheet, and owner-role resources; `MobileSlideShow` exposes `setImagePickerOptions:` and `setOwnerIsCamera:`. This strongly supports a reusable system capture controller. Exact MobileSMS presentation animation and process/foreground ownership are **HOLD** pending a runtime trace of the target build.

The current MobileSMS camera slot is a noninteractive **HOLD** structure and must remain disconnected until that picker path is implemented.

### Foreground, Home, and suspension

The target MobileSlideShow executable contains `applicationDidEnterBackground:`, `applicationSuspend:settings:`, `_inactiveUnderTaskSwitcher`, `_wantsToSuspend`, `cameraViewCaptureWasInterrupted:`, and `updateSuspendedSettings:`. These establish that Camera participates in iOS 4 background/suspension handling and treats capture interruption explicitly.

Recommended system relationship:

```text
SpringBoard Camera tap
  → shared App Runtime launching
  → Camera owns foreground
  → previewing

Home
  → capture/preview interruption handling
  → app runtime suspended
  → SpringBoard
```

The fact of foreground resignation/suspension is **READY**. Whether resume returns directly to a functioning live preview, briefly reopens the iris, or reconstructs the capture session is **HOLD**.

## 2. Camera UI structure

The September 2010 iOS 4 user guide depicts and labels the Camera screen with LED flash mode, HDR, camera switching, focus area, zoom, Camera/Video switch, last-shot thumbnail, and shutter. The same structure is independently present in 8B117 raster names. [Period iOS 4 user guide](https://macdailynews.com/wp-content/uploads/2010/06/iphone_ios4_user_guide.pdf)

### Top controls — READY structure

- **Upper left:** LED flash mode (`Auto`, `On`, `Off` behavior; exact menu composition **HOLD**).
- **Upper center:** `HDR Off` / `HDR On` control.
- **Upper right:** front/rear camera switch.
- Controls overlay the preview; this is not a modern mode carousel or floating translucent control tray.

Relevant 8B117 resources include:

- `flashDisabled@2x.png`;
- `vc~cameraFlashBackgroundLeft.png` / `Right.png`;
- `vc~cameraHDRButtonLeft.png` / `Right.png`;
- `vc~cameraHDRIconBackgroundLeft.png` / `Strip.png`;
- `CameraSwitchIcon@2x.png`;
- `vc~cameraToggle.png` and `vc~cameraTogglePressed.png`.

Exact cap-inset composition, labels, selected states, coordinates, and interaction menus remain **HOLD**.

### Live preview — READY structure

- Camera sensor preview occupies the main surface.
- Tap-to-focus is available for stills and video.
- Focus crosshair rasters exist at Retina scale.
- A zoom control exists in this generation’s UI/resources.
- Exact preview crop, orientation transform, focus timing, and zoom reveal interaction remain **HOLD**.

### Bottom camera bar — READY structure

The bottom chrome is a silver raster bar rather than a modern black mode strip:

- **Left:** thumbnail/preview well for the most recent Camera Roll item.
- **Center:** silver still-photo shutter button.
- **Right:** Camera/Video mode switch well.

8B117 provides `cameraButtonBarSilver@2x.png`, its shadow, `cameraPreviewWell@2x.png`, `cameraButtonSilver@2x.png`, pressed state, `cameraButtonBarSwitchWell@2x.png`, and record on/off states.

### Shutter and capture

- Still mode uses the silver shutter raster and pressed state.
- Capture produces the historical shutter sound, subject to ring/silent and region policy described by the period guide.
- The target firmware includes both PhotoLibrary’s `photoShutter.aiff` and the already-audited UISound `photoShutter.caf`; exact system routing between them is **HOLD**.
- The closed-iris raster and executable selectors establish an iris/capture transition. Exact duration and ordering are **HOLD**.

### Photo preview and Camera Roll

The lower-left thumbnail opens the Camera Roll / last-shot review path. `cameraRoll@2x.png`, `cameraPreviewWell@2x.png`, Camera Roll strings, and MobileSlideShow’s album/photo controllers make this **READY** at the structural level.

The Camera Roll supports viewing captured photos/videos and returning to Camera. Exact review navigation controls, transition timing, whether a just-captured image is shown automatically under every configuration, and empty-roll presentation remain **HOLD**.

## 3. iPhone 4 and iOS 4.1 constraints

Apple specifies the iPhone 4 camera system as:

- 5-megapixel rear still camera;
- 720p HD video recording at up to 30 fps with audio;
- VGA-quality front-camera photos and video at up to 30 fps;
- LED flash;
- tap-to-focus for stills and video;
- photo/video geotagging. [Apple iPhone 4 technical specifications](https://support.apple.com/en-euro/112562)

All are **READY hardware/function constraints**.

### HDR correction

The proposed assumption that HDR “should not exist” is **REJECTED**.

HDR was a headline iOS 4.1 addition for iPhone 4 and is present in the exact 8B117 assets (`hdrBadge@2x.png` and multiple `vc~cameraHDR*` rasters). The September 2010 guide states that:

- HDR is available on iPhone 4;
- it combines three exposures;
- HDR is off by default;
- enabling HDR disables flash;
- Settings can retain both the normal and HDR versions, with both saved by default.

Contemporaneous September 2010 hands-on coverage independently shows the top-screen HDR toggle and its default-off state. [September 2010 HDR hands-on](https://www.engadget.com/2010-09-08-hdr-high-dynamic-range-iphone-ios.html)

Therefore classic, user-controlled iOS 4.1 HDR is **READY**. Modern automatic/Smart HDR behavior is **REJECT**.

### Video mode

Video mode is **READY**, supported by hardware specifications, the guide’s Camera/Video switch, and target assets including record-off/on buttons, elapsed-time elements, video preview, and Camera/Video switch wells.

Exact video start/stop animation, elapsed counter geometry, torch policy, and whether camera switching is allowed during an active recording remain **HOLD**.

### Modern Camera features to reject

Do not introduce:

- iOS 7+ flat Camera chrome or mode carousel;
- Live Photos;
- Portrait mode, Cinematic mode, Night mode, Action mode, or Spatial capture;
- Smart HDR, Deep Fusion, Photographic Styles, or automatic modern computational-camera treatment;
- panorama;
- square mode, built-in filter carousel, or modern editing affordances;
- slo-mo or time-lapse;
- modern zoom-lens selectors such as `.5×`, `1×`, `2×`, or multi-camera lens pills;
- QR scanner UI;
- modern Lock Screen camera shortcut/swipe entry;
- volume-button shutter behavior unless separately verified for iOS 4.1.

## 4. Verified 8B117 assets

The following files were read directly from the decrypted 8B117 filesystem. They were extracted only to `/private/tmp` for inspection; none were added to or modified in the project.

| Asset | Source | Retina pixels | SHA-256 | Classification |
| --- | --- | ---: | --- | --- |
| `icon-Camera@2x.png` | `MobileSlideShow.app` | 118×120 | `fda38114fc4ce321595513927250414f5caed2d6a5a694a6a2580a5e562a790e` | **READY**, already integrated SpringBoard icon |
| `Default-Camera@2x.png` | `MobileSlideShow.app` | 640×960 | `de28eeade1fd86510e74683f226bd2e1c3115324de06189ff0d5b6d1f6bc581c` | **READY** launch raster; not integrated |
| `CameraSwitchIcon@2x.png` | `PhotoLibrary.framework` | 56×44 | `5e950b84ac19e8c2991b429bbfdfedd0c1791d53f95929ae5eccec1d133e1277` | **READY** |
| `cameraButtonBarSilver@2x.png` | `PhotoLibrary.framework` | 4×106 | `ddd026a769c147ba6500d9079330ea8f55e81bfa94f93515b199c0eacad172b1` | **READY** repeat/cap component |
| `cameraButtonBarSwitchWell@2x.png` | `PhotoLibrary.framework` | 140×106 | `3ddfb0e610393e505f8c9df4df53dcdd1c09a340cc41097f31bf02dcdfad98cb` | **READY** |
| `cameraButtonRecordOff@2x.png` | `PhotoLibrary.framework` | 70×70 | `de8365815b1862013c391f1b87251fc8dc871b92f5b694b64e410e4b74cf4bf5` | **READY** |
| `cameraButtonRecordOn@2x.png` | `PhotoLibrary.framework` | 70×70 | `7a9fa32c90a28dead803f6989e602c77cd6ecd3b12af68b03059d65504cd187d` | **READY** |
| `cameraButtonSilver@2x.png` | `PhotoLibrary.framework` | 98×82 | `da85c10cc57880dd39235427b01e66d6c5490caebbb3327c902b192b8fbd530b` | **READY** shutter |
| `cameraButtonSilver_pressed@2x.png` | `PhotoLibrary.framework` | 98×82 | `a8ec527e76641fdd1eb873ce47dfef941de9c81d9167e74cb743776d5622879f` | **READY** shutter pressed |
| `cameraPreviewWell@2x.png` | `PhotoLibrary.framework` | 94×106 | `b310f58a1b0dc872038a7974c6f4123cb6a947d7bd3b2d679411eb946b05ec58` | **READY** |
| `cameraRoll@2x.png` | `PhotoLibrary.framework` | 110×110 | `5fac0ec909c027ee04bfa97b60d096d1d7681008d6cbcb2dae8995cf709d8028` | **READY** |
| `flashDisabled@2x.png` | `PhotoLibrary.framework` | 39×33 | `28130adc9163e1a900eb0c0c405052b77f716a8238d41929456a2bdba784c91b` | **READY** |
| `hdrBadge@2x.png` | `PhotoLibrary.framework` | 126×50 | `5fad82a5f5610e6683d19009844e5d745df71c60439cb023adbc1c245ebba46b` | **READY** |
| `vc~cameraToggle.png` | `PhotoLibrary.framework` | 120×62 | `bbf65f198b4b4e516063ffef25faaad87dab971e17cf71c718fdaf4fd9316ad2` | **READY** |
| `vc~cameraHDRButtonLeft.png` | `PhotoLibrary.framework` | 32×63 | `6f537a08ff0127b4cfa5dccd304d282f751abfbcd6c4f3e787eead94b38accff` | **READY** composition component |
| `vc~cameraHDRButtonRight.png` | `PhotoLibrary.framework` | 32×63 | `f237f08239ed85e35925840cd69e7042eedf7b92f5fb5eba2cc6d8be37d502bd` | **READY** composition component |

Additional verified families include focus crosshairs, zoom track/thumb/end caps, flash backgrounds, HDR background strips, video elapsed-time digits/background, camera closed iris, picker playback controls, camera-sheet buttons, empty Camera Roll artwork, and 1× siblings. These should be inventoried with hashes before integration.

### HOLD composition details

- Exact logical coordinates and orientation-specific placement.
- Stretch/cap-inset rules for narrow strip assets.
- Which `vc~` variants are selected on iPhone3,1 in every state.
- Text rendered by UIKit versus raster labels.
- Flash/HDR menu animation and selected-state combinations.
- Preview thumbnail source and first-launch empty Camera Roll state.
- Exact shutter/iris/processing timing.

### REJECT asset practices

- Recreating recovered controls in CSS or SVG.
- Copying assets from later iOS releases or visual reconstructions.
- Using SF Symbols, emoji, modern Camera icons, or generated artwork.
- Stretching complete control rasters where a cap/repeat composition is required.

## 5. Recommended runtime model

```text
none
  → launching
  → previewing
  → capturing
  → processing
  → previewing

previewing
  → reviewing
  → returning
  → previewing

previewing / capturing / processing / reviewing
  → Home or foreground interruption
  → suspended through shared App Runtime
```

State responsibilities:

| State | Responsibility |
| --- | --- |
| `none` | Camera has no active runtime surface. |
| `launching` | Shared app launch transition plus authentic `Default-Camera@2x.png`; exact duration **HOLD**. |
| `previewing` | Live selected-camera preview with current photo/video, flash, HDR, focus, and zoom state. |
| `capturing` | Shutter pressed / iris closing or video start-stop edge; accepts no duplicate capture. |
| `processing` | Photo save and optional HDR combination, or video finalization. Duration is device work, not fabricated instant UI. |
| `reviewing` | Camera Roll / last-shot review surface. |
| `returning` | Transition from review back to capture preview. |

Recommended orthogonal data:

- `mode: "photo" | "video"`;
- `cameraDevice: "rear" | "front"`;
- `flashMode: "auto" | "on" | "off"` with front-camera/device constraints;
- `hdrMode: "on" | "off"`, default `off`, photo-only, mutually disabling flash;
- current capture identifier and processing status;
- latest Camera Roll thumbnail/reference;
- capture-interrupted flag for suspension;
- picker owner/return target when invoked by MobileSMS.

The Camera runtime should attach to the existing shared App Runtime when launched from SpringBoard. MobileSMS attachment capture should use a separate picker presentation/return contract and must not duplicate global lifecycle logic.

## READY / HOLD / REJECT summary

### READY

- Camera is the Camera role of `MobileSlideShow.app`.
- Authentic Camera icon and full-screen launch raster.
- Rear 5MP stills, 720p/30 video, LED flash, tap focus.
- Front VGA photo/video camera and camera-switch control.
- Photo/video mode switching.
- Silver bottom bar, shutter, last-shot thumbnail/Camera Roll, and record controls.
- User-controlled HDR on iPhone 4 in iOS 4.1; off by default; disables flash.
- Extensive provenance-complete 8B117 Camera raster families.
- Home/background suspension and capture-interruption concepts.

### HOLD

- Exact launch animation and preview-ready timing.
- Camera resume geometry/behavior after suspension.
- MobileSMS picker ownership, transition, cancellation, and return details.
- Exact raster composition coordinates and cap-inset rules.
- Flash/HDR menus, zoom interaction, focus animation, iris timing, and processing duration.
- Audio routing and regional mute policy in the simulation.
- Real camera permission/browser-media bridge and deterministic fallback policy.

### REJECT

- Claim that iOS 4.1 on iPhone 4 lacks HDR.
- Modern flat Camera UI, mode carousel, SF Symbols, or generated controls.
- Modern computational capture, Live Photos, Portrait, Night, Cinematic, panorama, filters, slo-mo, time-lapse, or multi-lens selector UI.
- Treating MobileSMS attachment capture as an ordinary SpringBoard Camera-app launch.

## Implementation prerequisites

Before Camera implementation:

1. copy only selected verified assets from the 8B117 root filesystem without byte modification;
2. record every integrated asset’s source path, dimensions, alpha, and SHA-256;
3. wire existing SpringBoard and Dock Camera icons to the shared app runtime without changing their geometry;
4. define a browser camera-permission/fallback policy without fabricated imagery;
5. calibrate the launch raster, preview bounds, top controls, and bottom bar from original evidence;
6. keep MobileSMS attachment capture as a later, separate picker integration task;
7. retain exact timings and uncertain picker behavior as **HOLD**.
