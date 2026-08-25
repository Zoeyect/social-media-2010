# iOS 4.1 Camera Runtime Container v0.1

## Scope

This change establishes Camera runtime architecture only. It does not attempt to reproduce the final iOS 4.1 Camera controls, live camera capture, picker chrome, or raster composition.

## Runtime model

The runtime defines the required phases:

`none → launching → previewing → capturing → processing → reviewing → returning`

Transitions are explicit reducer events. Unsupported transitions leave the current session unchanged. The runtime also records photo/video mode, rear/front camera selection, flash mode, and the historically constrained `hdrEnabled: false` default without presenting controls for those values.

## Separate owners

The state contains two independent sessions rather than treating both entry paths as one application:

| Owner | Entry point | Foreground relationship | Return target |
| --- | --- | --- | --- |
| `cameraApp` | Existing SpringBoard Camera icon | Camera owns the shared app runtime | SpringBoard through the existing Home/app lifecycle |
| `cameraPicker` | Existing MobileSMS composer camera control | Messages remains the app-runtime owner while the picker surface is presented | MobileSMS composer |

The two records preserve their own phase, suspension flag, mode, selected camera, and flash state.

## Entry and return flow

SpringBoard Camera launch:

`Camera icon → app runtime launching → camera launching → camera previewing`

MobileSMS attachment launch:

`Messages composer camera control → cameraPicker launching → cameraPicker previewing`

The picker reducer supports `CANCEL → cancelled → RETURN → returning → RETURN_COMPLETE`, after which only the picker session resets and the existing MobileSMS composer becomes visible again. A temporary text Cancel control provides a testable return path without introducing Camera artwork. Final historical picker chrome remains HOLD.

## Lifecycle behavior

- Home suspends the active Camera owner before returning to SpringBoard.
- App switching suspends the displaced Camera owner and resumes it when selected again.
- Lock/sleep records the foreground application and suspends its Camera owner.
- Unlock resumes both the existing app runtime and its matching Camera owner.
- Suspension changes only the `suspended` flag; it does not discard the phase, mode, preview state, selected camera, or flash setting.
- Full device/runtime reset clears both sessions consistently with the existing lifecycle boundary.

## Container layering

`CameraContainer` occupies the existing 320 × 460 pt application surface below the shared 20 pt Status Bar. It exposes owner and runtime phase as structural data attributes and currently renders only an empty black preview surface. It contains no camera buttons, labels, synthetic viewfinder image, or copied raster artwork.

## Audio boundary

`requestCameraCapture()` validates that the selected owner is actively previewing, then calls the existing semantic `DeviceAudio.cameraShutter()` hook before entering `capturing`.

No Camera code imports or names `photoShutter.caf`; the existing Device Audio registry remains the sole asset resolver. No visible shutter trigger is added in this foundation task.

## Provenance classification

### READY

- Existing verified SpringBoard Camera icon remains the entry artwork.
- Existing semantic `cameraShutter()` mapping remains the audio boundary.
- Existing application, suspension, lock, and multitasking foundations are reused.

### HOLD

- Final Camera and camera-picker chrome.
- Live browser camera acquisition and permission behavior.
- Exact iOS 4.1 launch, capture, processing, review, and return timings.
- UIKit-generated controls and any Camera raster assets not yet provenance-complete.
- Visible picker cancel/return control and attachment delivery behavior.

## Files changed for this task

- `src/state/cameraRuntime.ts`
- `src/device/CameraContainer.tsx`
- `src/device/App.tsx`
- `src/device/SpringBoard.tsx`
- `src/device/MobileSMSContainer.tsx`
- `src/styles/device.css`
- `docs/evidence/ios4.1-camera-runtime-container-v0.1.md`

SpringBoard geometry and icon positions are unchanged. MobileSMS layout, message state, SMS notification behavior, audio registry, and historical assets are unchanged; the existing Camera icon/control surfaces only receive runtime entry behavior.

## Validation

- `npm run build`: PASS
- `git diff --check`: PASS
- New or modified historical raster assets: none
- Direct CAF references from Camera runtime: none
- Final/generated Camera artwork: none
