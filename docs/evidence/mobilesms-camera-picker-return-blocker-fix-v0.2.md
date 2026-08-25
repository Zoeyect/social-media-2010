# MobileSMS Camera Picker Return Blocker Fix v0.2

## Root cause

The picker runtime used `idle` as a special inactive phase and `cancelled` as an intermediate phase. The Cancel handler then dispatched `CANCEL`, `RETURN`, and `RETURN_COMPLETE` synchronously from one click. Correct return therefore depended on three queued reducer events being applied in order rather than on an observable runtime transition. Picker-active checks elsewhere also depended on the `idle` exception.

The placeholder preview itself occupies the full application surface. Its temporary Cancel control existed, but its return path was not independently driven by the picker state and the preview layer did not explicitly opt out of pointer targeting.

## Corrected ownership model

Every camera session now records an explicit launch mode:

```text
standalone Camera.app → standaloneCamera
MobileSMS PhotoButton → mobileSMSPicker
```

The existing internal owners remain `cameraApp` and `cameraPicker`, but they are no longer treated as equivalent application launches. MobileSMS remains the foreground application owner throughout the picker flow.

## Picker transition

```text
none
  → LAUNCH
launching
  → LAUNCH_COMPLETE
previewing
  → CANCEL
returning
  → next animation frame / RETURN_COMPLETE
none
```

Cancel dispatches only `CANCEL`. A runtime effect observes `returning` and completes the return on the following animation frame. This gives the return transition its own state boundary and removes the synchronous three-dispatch dependency.

## Parent restoration

`MobileSMSContainer` remains mounted beneath the picker overlay. Therefore:

- `MessagesState.view` stays `conversation`;
- the Mom transcript and message records are unchanged;
- the draft remains in `MessagesState.draft`;
- the local pre-picker keyboard state remains available;
- when the picker becomes inactive, the existing focus restoration effect runs;
- App Runtime ownership remains `messages` throughout Cancel and return.

For the regression case, typing `test`, opening the picker, and cancelling leaves `state.draft === "test"`. Home still suspends the `messages` App Runtime and the active `mobileSMSPicker` session when applicable; wake/resume uses the existing lifecycle path.

## Visual boundary

The black preview remains a structural placeholder. The Cancel button is an isolated functional control marked `data-visual-status="HOLD"`. Its chrome is not claimed to match iOS 4.1. No Camera artwork, capture UI, gallery, or browser camera permission is introduced.

## Preservation

No PhotoButton raster, MobileSMS composer chrome, conversation data, SMS notification logic, Mom reply logic, Device Audio, Battery, Lock Screen, or SpringBoard layout is changed.

