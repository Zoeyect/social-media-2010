# iOS 4.1 Battery Runtime Regression Audit v0.1

## Scope

This is a read-only runtime audit of the current implementation. No battery, Camera, Messages, audio, or visual code was changed.

Expected behavior supplied for this audit:

`20% → first warning → 10% → second warning → 0% → shutdown`

## Executive finding

The visible 1% state is not evidence that the warning transition ran. The implementation has separate, incompletely connected paths for battery display, critical pending state, critical reveal, and shutdown.

`batteryCriticalPending` does get set after the fifteen-minute threshold under normal locked, SpringBoard, app, or sleeping operation. The regression occurs downstream: presenting the critical warning also requires both `phase === "springboard"` and a non-null `batteryCriticalRevealAtMs`. That reveal timestamp is only created during a narrow unlock-to-SpringBoard path. When an app can resume—including Camera or MobileSMS with `cameraPicker` ownership—the unlock path deliberately leaves the timestamp null. A pending warning therefore has no guaranteed consumer.

The 20% and 10% warnings and the 0% shutdown are separate unimplemented gaps rather than consequences of Camera runtime ownership.

## 1. Battery state owner

Battery lifecycle fields are owned by the root persisted `Session` model in `src/state/deviceMachine.ts`:

- `activeWarning`
- `batteryCriticalPending`
- `batteryCriticalRevealAtMs`
- `unlockEpochMs`
- `dismissedWarnings`

`App.tsx` owns the React `session` state, advances `now`, derives elapsed time and battery percentage, and contains the effects that attempt to move the device into `lowBatteryWarning`.

Neither App Runtime nor Camera Runtime owns battery state. Camera sessions contain only Camera phase, suspension, mode, device, flash, and HDR fields.

Classification: **READY — ownership verified from current code.**

## 2. Simulation clock integration

The battery curve uses:

`elapsed = max(0, Date.now() - unlockEpochMs)`

The browser updates `now` every 250 ms. Sleep, lock, app suspension, and Camera suspension do not pause elapsed time. The session duration is 900,000 ms, so the pacing remains one real second per simulated second.

The current curve is not 100% to 0%:

`batteryPercent = 22 - progress × 21`

Therefore:

- session start: 22%
- session end: 1%
- after session end: clamped at 1%
- 0% is mathematically unreachable

The Status Bar model additionally clamps its displayed percentage to a minimum of 1%. Lock Screen and SpringBoard receive the same derived Status Bar state, so both can correctly display 1% even though no terminal lifecycle event occurred.

Classification: **READY — current clock and curve verified.**

## 3. Warning paths

### 20% and 10%

`currentWarning(elapsed, dismissedWarnings)` correctly contains threshold checks for 20% and 10%. However, no runtime code calls `currentWarning`. No effect sets `activeWarning` to 20 or 10, and no current UI consumes or dismisses those levels.

Result: both expected warnings are unreachable dead code.

Classification: **REJECT — required behavior is not connected.**

### End-of-session critical pending

At `elapsed >= SESSION_DURATION_MS`, an effect sets:

`batteryCriticalPending: true`

This effect runs for locked, SpringBoard, app, sleeping, and low-battery-warning phases. It excludes hero, powered-off, booting, power-off confirmation, and shutdown.

Result: the pending flag itself is normally produced. The observed failure is not primarily that this assignment is absent; it is that pending does not independently trigger presentation or shutdown.

Classification: **READY — producer verified; HOLD — no direct runtime capture of the reporter's persisted localStorage state was performed.**

### Critical reveal

The warning presentation effect requires all three conditions:

1. `phase === "springboard"`
2. `batteryCriticalPending === true`
3. `batteryCriticalRevealAtMs !== null`

Only the Lock Screen unlock handler creates `batteryCriticalRevealAtMs`, and only when:

- a critical warning is already pending, and
- no foreground application can resume.

If an app can resume, unlock returns to `phase: "app"` and explicitly writes `batteryCriticalRevealAtMs: null`. If the threshold is crossed while already on SpringBoard, no unlock occurs to create the timestamp. If it is crossed while an app remains foreground, no transition schedules the reveal. If a saved `lowBatteryWarning` session is recovered, `loadSession()` restores `batteryCriticalPending: true` but also resets the reveal timestamp to null.

Result: `batteryCriticalPending` can remain true indefinitely.

Classification: **REJECT — reveal scheduling has an unreachable/deadlocked set of common paths.**

## 4. App and Camera runtime interaction

App and Camera effects do not overwrite battery fields. Camera ownership is therefore not the root owner or producer failure.

They do expose the existing gating flaw:

- Locking while Camera or MobileSMS is active records a resumable foreground app.
- Unlock computes `canResume === true`.
- That branch resumes the app and its Camera owner.
- The same branch does not schedule `batteryCriticalRevealAtMs`.
- The warning effect cannot run because the phase is `app` and the timestamp is null.

The same behavior applies to any resumable app; Camera merely makes the path more consistently reproducible. The `cameraPicker` remains owned by MobileSMS rather than becoming a standalone app, but MobileSMS is still a resumable foreground owner for the unlock gate.

Classification: **READY — interaction verified; Camera is an exposing condition, not the root cause.**

## 5. Lock Screen and SpringBoard observers

There is no independent Lock Screen or SpringBoard battery observer:

- `batteryPercent(elapsed)` is calculated in `App.tsx`.
- `createStatusBarState()` clamps and classifies the visual percentage.
- Lock Screen copies that Status Bar battery model.
- SpringBoard renders the shared Status Bar model.

These surfaces observe only the derived display percentage. They do not dispatch warning or shutdown transitions. Consequently, a correct red 1% rendering does not imply correct battery lifecycle behavior.

Classification: **READY — render dependency verified.**

## 6. Shutdown path

The only current transition into `phase: "shutdown"` is the manual Power Off confirmation action. The existing shutdown effect merely resets the session 500 ms after that phase has already been entered.

No effect performs:

`battery <= 0 → shutdown`

Because the battery curve itself bottoms out at 1%, even adding a `battery <= 0` observer without correcting the terminal model would never fire.

Classification: **REJECT — automatic battery shutdown is not implemented.**

## Root-cause chain

Current behavior:

`elapsed reaches 15 min`

`→ batteryPercent reaches 1 and remains there`

`→ batteryCriticalPending becomes true`

`→ reveal timestamp remains null in common SpringBoard/app-resume paths`

`→ lowBatteryWarning phase is never entered`

`→ no battery-driven shutdown transition exists`

## Required future correction

A later implementation task should centralize battery lifecycle transitions instead of coupling them to unlock presentation:

1. Give the root device runtime a single threshold observer driven by simulated elapsed time.
2. Connect 20% and 10% threshold events exactly once using `dismissedWarnings` or an equivalent durable record.
3. Allow warning presentation over the valid foreground surface rather than requiring a future unlock-to-SpringBoard event.
4. Separate warning presentation timing from battery event creation.
5. Define a reachable 0% terminal point and transition the root device phase to shutdown.
6. Specify how warning dismissal returns to the prior locked, SpringBoard, or app owner without clearing suspended runtime state.

These are recommendations only; none were implemented in this audit.

## READY / HOLD / REJECT summary

| Item | Classification | Finding |
| --- | --- | --- |
| Root battery owner | READY | Persisted device `Session` |
| 1:1 simulation clock | READY | Browser elapsed time drives device and battery time |
| Shared Lock Screen/SpringBoard percentage | READY | Both consume one derived Status Bar model |
| `batteryCriticalPending` producer | READY | Set at the fifteen-minute threshold in normal runtime phases |
| Reporter-specific persisted state | HOLD | Not captured from the browser's localStorage in this audit |
| 20% warning | REJECT | Threshold helper exists but is never called |
| 10% warning | REJECT | Threshold helper exists but is never called |
| Critical warning reveal | REJECT | Requires a timestamp only produced by a narrow unlock path |
| Camera ownership as root cause | REJECT | Camera does not own battery state; it only exercises the resumable-app gate |
| 0% state | REJECT | Curve and display bottom out at 1% |
| Automatic shutdown | REJECT | No battery-driven transition exists |

## Validation

- Application code changes: none
- Asset changes: none
- Camera UI changes: none
- Messages changes: none
- Audio asset changes: none
- `npm run build`: PASS
- `git diff --check`: PASS
