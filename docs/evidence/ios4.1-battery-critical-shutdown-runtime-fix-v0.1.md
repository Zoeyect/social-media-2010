# iOS 4.1 Battery Critical / Shutdown Runtime Fix v0.1

## Root cause

The battery display, warning helper, critical-pending flag, and shutdown phase existed as disconnected paths:

- `batteryPercent()` correctly followed the 22% to 1% fifteen-minute curve.
- `currentWarning()` described 20% and 10% eligibility but no runtime called it.
- the endpoint set `batteryCriticalPending`, but its only consumer required `phase === "springboard"` and a reveal timestamp created only by a narrow unlock path;
- the battery curve deliberately bottoms out at the narrative 1% endpoint, so a hypothetical `battery <= 0` check could never run;
- only manual Power Off could enter `shutdown`;
- after `shutdown`, the old completion effect reset to the initial onboarding state instead of a powered-off device.

Camera ownership did not cause the defect. A resumable app merely made the unreachable reveal gate easier to reproduce.

## Previous transition

```text
15-minute endpoint
  → displayed battery clamps at 1%
  → batteryCriticalPending = true
  → reveal timestamp commonly remains null
  → no critical presentation
  → no battery-driven shutdown
```

## Corrected transition

The existing fifteen-minute endpoint is the single terminal condition. The 22% to 1% curve and the 1:1 clock are unchanged.

```text
elapsed >= 15 minutes
  → batteryCriticalPending
  → foreground: existing critical screen
  → shutdown
  → poweredOff
```

When the endpoint is reached while locked or sleeping, the warning is not rendered underneath those surfaces. The runtime proceeds directly to `shutdown` and then `poweredOff`.

Battery depletion does not enter `powerOffConfirm`; it reuses the existing `shutdown` phase directly.
If a manual Power Off confirmation happens to be open at the endpoint, depletion supersedes it and still enters the same `shutdown` phase without waiting for user confirmation.

## Warning behavior

`currentWarning()` is now connected to the root runtime. The existing 20% and 10% thresholds are consumed once each through `dismissedWarnings`.

- Eligibility continues to advance while locked or sleeping.
- Presentation is deferred until SpringBoard or an application is foreground.
- The verified `low_power.caf` semantic event is emitted through `DeviceAudio.lowBatteryWarning()`.
- The existing low-battery presentation is reused; no new warning artwork was created.
- A regular warning is a modal overlay on the same foreground class (`app` or `springboard`) and dismissal does not replace that surface.
- The terminal critical presentation proceeds to shutdown rather than returning.

The 1.5-second terminal depleted-screen interval is a functional implementation approximation and remains **HOLD**. It is not claimed as verified iOS 4.1 timing.

## Shutdown cleanup

Entering `shutdown` now resets transient runtime ownership before the powered-off state is installed:

- App Runtime;
- standalone Camera and MobileSMS camera picker sessions;
- multitasking bar;
- folder overlay state;
- SMS alert/preview state and badge runtime;
- runtime Messages mutations and input state;
- saved unlock return owner.

After the existing 500 ms shutdown interval, the root reaches `poweredOff` with no active runtime owner. User Identity Session Loop and Manual Power-Off Session Reset corrections establish the experience-level policy: both battery depletion and confirmed manual shutdown cross a powered-off boundary, return to Hero, and clear the completed session. Their trigger paths remain distinct.

## Regression-path result

| Context at terminal condition | Result |
| --- | --- |
| SpringBoard | critical presentation → shutdown → poweredOff |
| Messages/App Runtime | critical presentation → shutdown; app ownership reset |
| Sleeping | direct shutdown; no warning rendered under sleep |
| Locked | direct shutdown; no permanent 1% Lock Screen |
| MobileSMS camera picker | critical presentation → shutdown; picker and parent App Runtime reset |

## READY / HOLD

### READY

- One root elapsed-time owner.
- Existing 22% to 1% curve and fifteen-minute endpoint.
- Existing 20% and 10% warning eligibility.
- Battery-driven use of the existing `shutdown` phase.
- Terminal cleanup and powered-off result.
- No manual Power Off confirmation in the depletion path.

### HOLD

- Exact historical warning display duration.
- Exact visual provenance/fidelity of the existing low-battery presentation remains governed by its prior asset evidence; this task adds no visual claim.

## Preservation

No MobileSMS visual, Mom reply, Camera picker return, Folder/SpringBoard geometry, Status Bar geometry, Lock Screen geometry, audio asset, PNG, or other historical asset was changed.
