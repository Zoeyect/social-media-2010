# iOS 4.1 Camera Look Control v0.1

## Scope and classification

This pass adds a restrained, direct manipulation of the existing Camera World Bridge framing. It does not claim a documented iOS 4.1 Camera gesture. The interaction, nominal travel, runtime safety calculation, and persistence policy are **RECONSTRUCTED** project behavior. It changes neither the authenticated Camera chrome nor the established Camera image treatment.

No orientation sensor or `DeviceOrientation` permission is used in v0.1. `orientationOffset` is retained in the Camera session model at `{ x: 0, y: 0 }` as an inactive future input channel.

## Session behavior

`CameraLookState` belongs to the existing per-owner `CameraSession`:

```ts
type CameraLookState = {
  pointerOffset: { x: number; y: number };
  orientationOffset: { x: number; y: number };
};
```

The ordinary `SUSPEND` and `RESUME` transitions preserve the complete session object, including Camera look. Home/reopen, application switching, and lock/sleep therefore preserve framing. `LAUNCH` only creates a zeroed look for a session whose phase is `none`; the full runtime `RESET` transition recreates the session and returns both offsets to zero. No recenter animation is introduced.

## Pointer mapping

The active standalone Camera preview uses primary Pointer Events with pointer capture. A horizontal drag across half the 320-point preview width requests the nominal horizontal limit; a vertical drag across half the 427-point preview height requests the nominal vertical limit. Mapping is direct and unsmoothed:

- horizontal nominal source-UV range: `[-0.06, +0.06]`
- vertical nominal source-UV range: `[-0.04, +0.04]`
- dragging right increases source U
- dragging down decreases source V

Top controls remain outside the preview gesture hit behavior. The picker owner receives no look input.

## Dynamic source-safety calculation

The renderer derives the Camera preview bounds from the live Ambient canvas and the scissored preview rectangle on every rendered frame. For each axis it:

1. converts the preview bounds into full-canvas UV;
2. applies the same cover scale used by the shader;
3. evaluates both endpoints at the full shared zoom excursion, `0.9986...1.0014`;
4. reserves the maximum shared sway, `0.001` source UV in each direction;
5. reserves the Camera blur ring radius, `2^(0.10 × 5) × 0.85 / 941 = 0.0012774511` source UV;
6. inverts the shader's final edge scale, `0.994`;
7. intersects the resulting directional range with the nominal limits.

The Camera pass receives `sharedSceneOffset + clampedCameraLook`. The outer Ambient World pass is drawn first with `sharedSceneOffset` alone. This preserves scene/time alignment without moving the outer world.

At a centered 1440×900 viewport, the 320×427 Camera preview occupies global `x=560...880`, `y=209.5...636.5`. Its guarded source extrema are approximately:

- X: `0.3988066...0.6011934`
- Y: `0.2914873...0.7685969`

The computed directional safe range therefore remains the full nominal `X [-0.06,+0.06]`, `Y [-0.04,+0.04]`. At a narrow 375×667 viewport with the fixed-size device flowing from the stage padding, the same calculation also retains the full nominal range. If a resize or device position reduces either directional allowance, the renderer immediately clamps the canonical `pointerOffset`; no recenter transition is applied.

The Ambient canvas exposes the current results for QA as `data-camera-look-min-x`, `data-camera-look-max-x`, `data-camera-look-min-y`, `data-camera-look-max-y`, `data-camera-look-x`, and `data-camera-look-y`.

## Unchanged values

- Ambient World idle treatment: unchanged
- Camera treatment (`Blur 0.10`, `Exposure 1.00`, `Noise 0.022`, `Luminance 0.010`, `Color 0.004`, `Bloom 0.16`): unchanged and **RECONSTRUCTED**
- shared motion, noise, color drift, shader architecture, scene plate, Camera bridge geometry, Camera chrome, capture behavior, Photos, and device controls: unchanged
