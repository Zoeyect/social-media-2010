# iOS 4.1 Simulation Clock Runtime Audit v0.1

> Superseded boundary notice: this document records the pre-correction unlock-based implementation. `simulation-clock-start-boundary-correction-v0.2.md` is authoritative for current runtime behavior: boot completion now starts the clock and registers the initial SMS.

## Scope

This is a read-only runtime audit of the simulated device clock, browser wall clock, scheduled events, and dormant Mom-reply timer. No application or UI code was changed.

## 1. Device clock

The implementation is a hybrid of options **A** and **B**, with no acceleration:

```text
fixed narrative epoch: 2010-10-20T00:02:00-07:00
                         +
real elapsed milliseconds: Date.now() - unlockEpochMs
                         =
displayed simulated device time
```

`src/state/deviceMachine.ts` defines the fixed narrative epoch as `SESSION_START_ISO`. This audit originally found that `elapsedMs(session, now)` used the browser-wall-clock timestamp recorded at first unlock. Simulation Clock Start Boundary Correction v0.2 replaces that source with `sessionStartEpochMs`, recorded when boot completes and Lock Screen becomes active.

`src/device/App.tsx` samples `Date.now()` every 250 ms and passes the resulting single `deviceDateTime` to the Lock Screen, SpringBoard Status Bar, and app Status Bar formatters. The surfaces therefore share one device-time source.

Classification:

- Fixed 2010 narrative start: **READY implementation fact**.
- Browser wall-clock elapsed as the runtime driver: **READY implementation fact**.
- Accelerated simulation clock: **REJECTED**; no multiplier or compressed timeline exists.
- Monotonic timing: **HOLD**. `Date.now()` is a wall clock, so a host clock correction can move the computed elapsed time forward or backward. It is not based on `performance.now()`.

## 2. Timeline and scale

`SESSION_DURATION_MS` is exactly `15 * 60_000`, or 900,000 real milliseconds. There is no scale factor between elapsed browser time and simulated device time:

```text
1 real second   = 1 simulated second
60 real seconds = 1 simulated minute
```

At the time of this audit, first successful unlock set `unlockEpochMs` to `Date.now()`. This start boundary is superseded by v0.2; only the recorded 1:1 pacing conclusion remains applicable.

The 250 ms interval controls render/update frequency only. It does not accelerate time. If the interval is throttled while the browser is backgrounded, the next sample catches up from `Date.now()` rather than replaying missed ticks.

### Fifteen-minute terminal behavior

The requested timeline and the current terminal behavior are not equivalent:

```text
expected design:
12:17 AM → shutdown

current implementation:
elapsed >= 15 minutes → batteryCriticalPending = true
```

Crossing the duration threshold does **not** set `phase: "shutdown"`. The critical screen is separately gated on SpringBoard plus a non-null `batteryCriticalRevealAtMs`. That reveal timestamp is assigned during a later unlock-to-SpringBoard path, not directly at the fifteen-minute threshold. Therefore automatic shutdown at 12:17 is **not implemented** and is classified **HOLD / runtime gap**.

## 3. Scheduled events

### Initial SMS

The initial `Mom: Home yet?` event is scheduled against simulated elapsed time, not with a dedicated timeout:

- threshold: `INITIAL_SMS_DELAY_MS = 3 * 60_000`;
- source: the same `elapsed` value that drives the displayed clock;
- trigger: a React effect observes `elapsed >= INITIAL_SMS_DELAY_MS`;
- result: the event is delivered approximately at narrative time 12:05 AM.

This event therefore follows the 1:1 simulation timeline. Browser interval throttling can delay presentation until React runs again, but the elapsed clock itself catches up.

### Mom reply

`src/device/App.tsx` contains a conditional wall-timer path:

```text
momReply === "pending"
  → window.setTimeout(..., 1_000)
  → RECEIVE_MOM_REPLY
  → DeviceAudio.notificationReceived("message")
```

Its delay source is a plain one-second browser `setTimeout`. It is not tied to `elapsed`, `SESSION_START_ISO`, or a simulation scheduler.

However, the current `SEND` transition no longer changes `momReply` from `notSent` to `pending`. No current event transition enters `pending`. Consequently:

- the Mom-reply effect exists;
- the nominal delay is 1,000 browser milliseconds;
- the path is currently **unreachable** after Send;
- no Mom reply is currently scheduled or delivered.

This is consistent with the current “do not implement incoming reply yet” boundary. It must not be described as an active feature.

## 4. Suspension and timer lifetime

If a future step makes `momReply === "pending"`, the current effect would have the following behavior:

| Transition while timer is pending | Current timer behavior |
| --- | --- |
| Home to SpringBoard | Continues. `App` remains mounted and the effect does not depend on device phase. |
| App switching / Messages suspension | Continues for the same reason. App-runtime suspension does not cancel the root effect. |
| Power lock or auto-sleep | Continues. Sleeping/locked phase is not an effect dependency. |
| Wake/unlock | Does not restart an already-live timer; the callback may already have fired while locked. |
| Browser backgrounding | Browser timer throttling may delay callback execution. |
| Page reload, tab close, or root unmount | Cancels through effect cleanup; `messagesState` is not persisted to local storage. |
| `momReply` changes before callback | Cancels and replaces/removes the timer through effect cleanup. |

Thus Home, Sleep, Lock, and app switching do not intentionally pause or cancel a live reply timer. This is browser-wall-time behavior, not a simulation-clock scheduling guarantee.

## 5. Persistence boundaries

At the time of this audit, `unlockEpochMs` was saved to local storage. v0.2 removes that persisted field, rejects it as a clock source during migration, and creates `sessionStartEpochMs` only at a fresh boot-completion boundary.

Messages, notification, badge, app-runtime, folder, SpringBoard-page, and Mom-reply reducer states are held in React memory and are not stored with the session. A full reload resets those states even though the persisted device clock may continue from its previous unlock epoch.

This creates a current mismatch:

- simulated device time can survive reload;
- SMS/reply state and scheduled reply work cannot.

Cross-reload narrative event persistence remains **HOLD**.

## Conclusions

| Question | Result |
| --- | --- |
| Clock model | Fixed 2010 epoch plus real `Date.now()` elapsed |
| Acceleration | None |
| Scale | 1 simulated second = 1 real second |
| 00:02 → 00:17 duration | 15 real minutes |
| Automatic shutdown at 00:17 | Not implemented; only critical-battery pending state is set |
| Initial SMS scheduling | Simulated elapsed threshold at +3 minutes |
| Mom reply delay source | Dormant `window.setTimeout(1_000)` path |
| Mom reply currently reachable | No |
| Home/app switching effect on a live reply timer | Continues |
| Sleep/lock effect on a live reply timer | Continues |
| Reload effect | Timer and Messages state reset; persisted clock continues |

The recommended 1:1 pacing is already the clock model in use. Future Mom-reply work should explicitly choose whether its one-second dramatic delay is real wall time or a persisted simulation event, and the fifteen-minute terminal behavior requires a separate correction before it can be claimed as automatic shutdown.
