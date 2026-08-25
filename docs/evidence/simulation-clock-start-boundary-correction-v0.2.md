# Simulation Clock Start Boundary Correction v0.2

## Root cause

The authoritative elapsed-time field was named and used as `unlockEpochMs`. It was assigned inside the Lock Screen unlock callback, and the same callback registered the initial SMS event. Until the first successful unlock:

- elapsed time remained zero;
- the displayed device clock remained at 12:02 AM;
- battery drain did not advance;
- the initial SMS did not exist in the Device Event Scheduler.

This made user interaction, rather than device availability, the global timeline owner.

## Corrected clock owner

The root session now owns:

```ts
sessionStartEpochMs: number | null
```

The value is assigned exactly once by boot completion in the same state update that changes:

```text
booting → locked
```

That boundary means the Lock Screen is available at elapsed 0 and displays the fixed narrative time of 12:02 AM.

Unlock no longer creates, modifies, or resets the session clock.

## Event registration

Boot completion also registers the initial event:

```text
initialSMS
dueElapsedMs = 60,000
```

The existing root Device Event Scheduler continues to compare all events against `elapsedMs(session, Date.now())`. Because the root App and interval remain active in locked and sleeping phases, delivery does not require an unlock or an application component.

At +60 seconds:

- locked/sleeping source routes through existing Lock Screen preview behavior;
- SpringBoard/App source routes through the existing foreground alert behavior;
- message timestamp remains 12:03 AM;
- notification audio and badge behavior are unchanged.

## Battery boundary

`batteryPercent()` now consumes elapsed time from `sessionStartEpochMs`. Its curve is unchanged:

```text
boot-complete Lock Screen: 22%
15 minutes later: approximately 1% / terminal
```

If the user never unlocks, elapsed time, events, and battery terminal handling continue. Locked/sleeping terminal handling still proceeds to shutdown and the Hero session loop.

## Unlock behavior

Unlock performs only surface/lifecycle work:

- resume the recorded foreground owner when appropriate;
- otherwise show SpringBoard;
- play the existing unlock semantic event;
- preserve the existing `sessionStartEpochMs` and device events.

## Migration and stale state

Legacy persisted `unlockEpochMs` is removed during load and is never copied into `sessionStartEpochMs`. An old unlock-based or other in-progress persisted run restarts through `booting`; the new boot-completion boundary creates a fresh authoritative timestamp and scheduler registration. This preserves the project's existing fresh-runtime-on-reload policy without misrepresenting an old unlock timestamp as boot time.

New persisted records write only `sessionStartEpochMs`.

## Validation model

| Case | Result |
| --- | --- |
| Boot, never unlock, wait 60 s | initial SMS becomes a Lock Screen preview |
| Unlock at +30 s | clock/battery retain 30 s elapsed; SMS remains due in about 30 s |
| Unlock at +5 min | device time is about 12:07 AM |
| Never unlock for 15 min | terminal battery path shuts down and returns to Hero |
| Unlock immediately | existing foreground behavior; clock was already started by boot completion |

## Preservation

No Lock Screen visual, Messages UI, SMS notification reducer, Camera runtime, audio asset, battery curve, manual shutdown routing, session-identity reset rule, PNG, CAF, or historical asset was changed.
