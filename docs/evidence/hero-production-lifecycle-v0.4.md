# Hero Production Lifecycle v0.4

Implementation checkpoint; manual Safari E2E acceptance is pending. This is a
reconstructed presentation lifecycle, not a claim about historical boot duration.

## Ownership and boundaries

App owns the existing software Session and the single Hero presentation reducer.
HeroSandbox consumes that reducer's state and reports physical acknowledgements;
it does not own another lifecycle. DeviceRoot, App, DeviceScreen, ScreenPortal,
AmbientWorld, Camera runtime, phone and charger remain mounted owners.

`startExperience({ name })` is accepted only in reset-complete identity with no
active ID. The existing ID generator is called once. The ID survives boot,
sleep/wake, terminal depletion, return, and connector insertion.

T0 remains the successful Hero boot handoff to the existing Lock Screen. The
controller rejects an early handoff. Typing, detach, inspection, the 3000 ms Power
hold and the 20000 ms boot consume none of the 900000 ms narrative runtime.
Production remains October 20, 2010, 00:02–00:17 America/Los_Angeles. Scheduler
IDs, order and offsets are unchanged.

At T+900, `finishExperience({ reason: "battery-depleted" })` synchronously claims
the physical terminal transition once. The shared scheduler rejects further
delivery at/after the boundary. Hero bypasses the legacy terminal alert delay;
the existing earlier 20%/10% warnings remain. DeviceScreen becomes hidden/inert,
not unmounted. Manual software power-off uses the same return path with a distinct
reason; short-press sleep does not terminate a run.

Physical sequence: experience → power-loss (0.8 s black hold) → returning
(existing 1.4 s transform) → recharging (0.45 s insertion) → resetting → identity.
The cable remains absent during return, then approaches using the live Dock30Pin
transform. Plug geometry, final insertion depth, phone scale and target poses are
unchanged. Resetting retains the connected pose. The next ID is created only
after reset completion and the next accepted name.

## Reset inventory

| Ownership | Reset policy |
| --- | --- |
| Software Session/localStorage session snapshot | Replace with initial Session at connected reset; no active ID or clock |
| App reducers, app navigation, folders, drafts, alerts, badges | Existing disposable-reset actions; historical initial records retained |
| Scheduler and delivery claims | Clear at reset; schedule fresh events at the next T0 |
| Power/Home pending callbacks and capture namespace | Cancel/invalidate at reset; hooks retain their normal cancellation paths |
| Camera selection | Existing weighted selector once per new ID; cached and stable through open/Home/sleep/wake/handoff |
| Player Camera Roll (IndexedDB) | One cached erase/initialize chain per new ID; existing stale-player cleanup; no global erase |
| Historical photos/media | Not part of player capture erase; unchanged |
| Public Twitter repositories | Module-owned repositories retained; no erase/withdraw/recreation during reset |
| Public timeline selection and pending local submission UI | Existing per-session refresh when ID changes; ordering unchanged |
| Physical mute | Session-local on the same hardware hook; persists through sleep/wake and return/recharge, then `RESET_COMPLETE` / `resetGeneration` restores ringer, non-silent slider position, orange off, and the audio gate before next identity |
| Physical volume | Persists across loops on the same hardware hook; initial volume 8 unchanged |

The current Public Twitter repository is a mock, not newly durable storage. Its
accepted submissions/idempotency state survive in-page loops. The existing
optional terminal submission outro is preserved, including retries: if active,
it holds the connected `resetting` boundary until the user completes it. It does
not extend the narrative clock or reactivate software.

Camera selection may choose the same scene in consecutive runs; a fresh weighted
draw does not imply a forced different result. Camera preview/capture algorithms,
weights, variants and historical content are unchanged.

## QA

`hero.html?heroLifecycleDebug=1&heroHardwareDebug=1` exposes lifecycle, ID, T0,
elapsed time, terminal claim, screen ownership, hardware/charger state, reset
generation, Camera owner ID and actual DeviceScreen semantic instance ID.
The existing DEV “Simulate 15-minute end” now calls the controller terminal
boundary. It does not compress scheduler time. Arbitrary phase jumps/reset are
not exposed for this production lifecycle composition.

Automated coverage:

- Actual App controller and reducers under a deterministic hook/timer host: two
  complete runs, unique IDs, duplicate-start rejection, early handoff rejection,
  Lock Screen/unlock, Camera open, sleep/wake, repeated scheduled SMS delivery,
  terminal idempotency, local draft reset, and timer cleanup.
- Actual Camera selector and player-roll initialization counts: once per run.
- Stable-host structural/mutation guards; no extra App, DeviceScreen, Camera,
  AmbientWorld, scheduler or Hero lifecycle owner.
- Existing boot, Power routing/cancellation, audio-gate and projection tests.

The controller host is not a browser renderer. DeviceScreen mount continuity is
structurally guarded and instrumented, but real DOM continuity, Safari pointer
behavior, audio, animations, connector timing and two-loop visual alignment still
require the requested manual Safari walkthrough. No Safari control surface is
available in this tool session. Deferred social-app notifications are not added.
