# iOS 4.1 Low Battery Warning vs Depleted Screen Correction v0.1

## Root cause

The runtime used one device phase, `lowBatteryWarning`, for two distinct concepts:

1. ordinary 20%/10% warnings; and
2. the terminal depleted presentation before shutdown.

Every `lowBatteryWarning` phase rendered `low-battery-iphone4.png`. Consequently, connecting the previously unused `currentWarning()` helper made the full-screen red-battery/lightning image appear as soon as the battery reached 20%. The same phase also replaced the foreground application or SpringBoard instead of behaving as a dismissible system alert.

The threshold calculations, curve, and clock were not the cause.

## Tier 1 warning evidence

Recovered iPhone3,1 iOS 4.1 build 8B117 resources contain these English SpringBoard strings:

| Key | 8B117 value | Classification |
| --- | --- | --- |
| `LOW_BATT_TITLE` | `Low Battery` | READY / ORIGINAL |
| `LOW_BATT_MSG_LEVEL` | `%@ of battery remaining` | READY / ORIGINAL |
| `DISMISS_ALERT` | `Dismiss` | READY / ORIGINAL |

Source: `tmp/firmware/rootfs/recovered/SpringBoard.app/English.lproj/SpringBoard.strings`.

The SpringBoard binary also contains `SBLowBatteryLevel`, `AtCriticalLevel`, and distinct immediate restart/shutdown strings for the critical power notification. This supports separating ordinary low-level alerts from terminal power handling.

## Corrected 20% and 10% behavior

At each threshold, once per simulation session:

```text
currentWarning()
  → DeviceAudio.lowBatteryWarning()
  → modal Low Battery alert over current foreground surface
  → Dismiss
  → same App or SpringBoard remains active
```

The content is:

```text
Low Battery
20% of battery remaining
Dismiss
```

and later:

```text
Low Battery
10% of battery remaining
Dismiss
```

The alert does not change the root device phase. It therefore does not unmount Messages, Camera picker, SpringBoard, drafts, or application ownership. `dismissedWarnings` records each threshold only when the user selects Dismiss. The alert sound fires once when the warning becomes active.

If the device is locked or sleeping at a threshold, presentation remains deferred until an eligible foreground surface exists.

The alert reuses the project's existing period-UIKit system-alert chrome. Its exact pixel material and geometry remain **HOLD**; the Tier 1 strings and modal/dismissible behavioral separation are the evidence-backed correction.

## Terminal behavior

The existing narrative terminal condition remains unchanged:

```text
15 simulated minutes / approximately 1%
  → terminal pending
  → depleted state when foreground
  → shutdown
  → poweredOff boundary
  → Hero / fresh session
```

Locked and sleeping devices continue directly to shutdown without rendering a warning underneath those surfaces. Ordinary 20%/10% dismissal never enters shutdown.

## Full-screen image classification

Current file:

- path: `src/assets/device/low-battery-iphone4.png`
- dimensions: 1024×1536 px
- SHA-256: `ca0b2a792073406ff0dbd675e0a55419297577417384ad6371b3d24ee0564fe4`
- visible content: black background, large horizontal battery with a red segment, and a lightning symbol.

Classification: **HOLD**.

The image visually belongs to an extremely-low-power / charging-required family, not to the ordinary 20% or 10% SpringBoard alert. Its repository provenance does not establish the exact 8B117 lifecycle placement, and the lightning symbol creates additional uncertainty for a narrative with no connected charger. It remains restricted to the terminal path as an existing approximation; it is not promoted to READY and is never shown for ordinary warnings.

No charging behavior or charging UI was added.

## Runtime result

| Condition | Corrected result |
| --- | --- |
| 20% | ordinary modal warning; sound once; dismissible; foreground preserved |
| 10% | second one-time modal warning; sound once; dismissible; foreground preserved |
| 1% terminal | depleted/shutdown path; full-screen image permitted only here as HOLD |
| App or Camera picker active | warning overlays existing runtime; dismissal preserves ownership and state |
| Locked/sleeping | ordinary warning not rendered underneath; terminal still shuts down |

## Remaining HOLD items

- Exact UIKit alert geometry and material.
- Exact relationship between `low_power.caf`, mute state, and historical alert timing.
- Exact lifecycle placement of the current full-screen red-battery/lightning image.
- Whether a no-charger terminal state should omit the lightning variant entirely.
- Exact terminal depleted-screen dwell time before shutdown.

## Preservation

- Battery curve remains 22% to approximately 1%.
- Session duration remains fifteen real/simulated minutes at 1:1 speed.
- No audio registry, Messages, Camera, Lock Screen geometry, Status Bar geometry, PNG, CAF, or historical asset was modified.
