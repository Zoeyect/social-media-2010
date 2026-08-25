# Passive 15-Minute Session Shutdown Invariant v0.1

## Invariant

The root device runtime now exposes the terminal predicate directly:

```ts
hasReachedSessionTerminal(session, now) =
  session.sessionStartEpochMs !== null &&
  now - session.sessionStartEpochMs >= SESSION_DURATION_MS
```

`SESSION_DURATION_MS` remains `15 * 60_000`. The predicate has no dependency on unlock state, user interaction, foreground ownership, rendered application content, or warning dismissal.

## Clock progression

Boot completion creates `sessionStartEpochMs` in the same state transition that makes Lock Screen active. A root `window.setInterval` samples `Date.now()` every 250 ms for runtime presentation. The terminal predicate compares absolute wall-clock timestamps, so browser timer throttling may delay the observing callback but cannot reset or extend elapsed time; the next callback catches up against the authoritative epoch.

The root App remains mounted while the device is:

- locked;
- sleeping/black;
- idle or untouched;
- on SpringBoard;
- in an App or suspended App lifecycle;
- showing Camera picker;
- showing SMS or battery notification overlays.

None of those states owns or pauses the clock.

## Terminal resolution

When the predicate becomes true, the root sets `batteryCriticalPending` independently of ordinary warning eligibility.

The pending consumer resolves as follows:

```text
SpringBoard/App
  → terminal depleted presentation
  → shutdown

locked/sleeping/powerOffConfirm
  → shutdown directly
```

Both routes then use the existing shared cleanup:

```text
shutdown
  → poweredOff black boundary
  → Hero / fresh session
```

## Deferred warning independence

20% and 10% ordinary warning presentation remains limited to SpringBoard or a foreground App. While locked or sleeping, those alerts are deferred because no `activeWarning` is created.

The terminal predicate does not inspect `dismissedWarnings`. If a normal warning is active and undisposed when the endpoint arrives, terminal pending supersedes it. If the warning was never presented, terminal shutdown still runs. Therefore neither deferred UI nor user dismissal can block completion.

## Validation cases

| Case | Runtime trace | Result |
| --- | --- | --- |
| A: never unlock | boot completion starts epoch; root interval continues on Lock Screen | terminal → shutdown → Hero |
| B: auto-sleep | sleeping phase renders black but root App/interval remain mounted | terminal → direct shutdown → Hero |
| C: warnings never shown | warning eligibility remains deferred; terminal ignores dismissal history | terminal still resolves |
| D: unlock at 14:50 | unlock does not write `sessionStartEpochMs` | approximately 10 seconds remain |
| App/Camera/notification overlay | surface state does not participate in predicate | terminal still resolves and runtime cleanup runs |

## Preservation

- Battery curve remains 22% to approximately 1% over fifteen minutes.
- Initial SMS and all Device Events continue to use the same elapsed clock.
- Messages, Camera, notification visuals, Lock Screen visuals, manual shutdown, identity-reset rules, PNG, CAF, and historical assets are unchanged.

## Classification

- Absolute terminal predicate: **READY — implementation invariant**.
- 250 ms observation cadence: implementation detail; it does not change elapsed-time authority.
- Browser background suspension may postpone JavaScript execution until the page is scheduled again, but elapsed time catches up immediately from the absolute epoch; no user input is required.
