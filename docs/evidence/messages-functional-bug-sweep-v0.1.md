# Messages Functional Bug Sweep v0.1

## Scope and result

This sweep traced the existing Messages state reducers, notification and badge reducers, root device-event scheduler, App Runtime integration, Lock Screen route, Camera picker ownership, battery overlays, and terminal session cleanup.

No open **A — Blocker** or **B — Functional** regression was found in the requested paths. No Messages runtime code was changed merely to create a diff. Visual fidelity observations remain C-level backlog and were not modified.

## Verification method

Two forms of verification were used:

1. deterministic reducer/scheduler execution with Node's TypeScript stripping support;
2. component and root-effect trace for behavior that depends on React surface ownership.

The executable state checks covered:

- empty initial Messages state and draft;
- initial incoming message, timestamp, unread status, badge addition, alert dismissal, and later read clearing;
- affirmative classification for `Yes`, `Yeah`, `I'm home`, and `Got home`;
- negative classification for `Not yet`, `No`, and `Not home`;
- ambiguous classification for `Mom?`, `Hello`, and `?`;
- the exact 29,999 ms / 30,000 ms scheduler boundary;
- one and only one generated Mom reply;
- unlimited outgoing messages after that reply without another schedule;
- runtime reset back to the empty seed.

Result: **PASS**.

## Test matrix

| # | Path | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Fresh session | PASS | `initialMessagesState` has no messages/draft; Hero creates only root `sessionIdentity`; boot completion starts elapsed time at 12:02 and schedules the initial event before unlock |
| 2 | Initial SMS +60 s | PASS | `initialSMS` device event is scheduled at 60,000 ms; event is removed after one delivery; payload timestamp is `12:03 AM`; `smsMessageReceived()` dispatches one semantic sound, badge addition, message insertion, then presentation |
| 3 | Unlocked Close/View | PASS | `DISMISS` changes only notification disposition; unread ID remains. View enters conversation; badge clearing effect requires the Messages app/conversation surface and matching message |
| 4 | Locked notification | PASS | locked/sleeping source selects `SHOW_PREVIEW`; sleeping wakes to locked; successful slide invokes the notification View route into Mom conversation |
| 5 | Affirmative reply | PASS | controlled exact-phrase classification sets `momReply: pending`; SEND persists outgoing record; root scheduler records +30,000 ms; generated reply text is fixed and delivery changes state to `delivered` |
| 6 | Negative reply | PASS | negative set is checked before affirmative; tested phrases remain `momReply: none` |
| 7 | Ambiguous reply | PASS | tested phrases classify ambiguous and create no scheduled reply |
| 8 | After Mom reply | PASS | scheduler predicate requires `momReply === none`; `DELIVER_MOM_REPLY` is a no-op after `delivered`; subsequent outgoing SEND remains available |
| 9 | Suspension | PASS | scheduled event belongs to root `Session.deviceEvents`, not MobileSMS component timers; Home/lock/sleep/app switching do not remove it; due-event effect is mounted at device root |
| 10 | Camera picker | PASS | MobileSMS remains mounted beneath picker; draft is root Messages state; Cancel runs `returning → none`; focus state restoration is isolated from draft content |
| 11 | 20%/10% warning | PASS | ordinary warnings leave root phase as app/SpringBoard and overlay the surface; Messages/App/Camera states are not reset |
| 12 | Battery terminal | PASS | terminal enters shutdown, resets Messages/notification/badge/App/Camera/event state, crosses powered-off boundary, and restores initial Hero session |
| 13 | New identity session | PASS | battery completion restores `initialSession` and empty `sessionIdentity`; Messages reducers are reset; new Hero submission replaces identity without carrying old messages/draft/badge/events |

## Important boundaries

### Audio

The initial SMS path calls `DeviceAudio.notificationReceived("message")` exactly once per consumed device event. Browser autoplay policy can still prevent audible output; that environment behavior is not a duplicate-dispatch bug.

### Read timing

Conversation state marks incoming records read when `OPEN_CONVERSATION` is processed. The global badge is not cleared by Close or by message receipt. Its clearing effect additionally requires:

```text
device phase = app
active app = messages
Messages view = conversation
matching message exists
```

This preserves the requested user-visible badge boundary.

### Scheduler ownership

Mom reply timing uses simulated elapsed milliseconds stored in the root session. There is no MobileSMS `setTimeout`; unmounting, suspending, locking, or covering the conversation with another surface does not cancel the event.

## Severity findings

### A — Blocker

None found.

### B — Functional

None found.

### C — Polish backlog (not changed)

- Exact bubble tails and bubble raster/material.
- Exact SMS Alert chrome, gradients, shadows, and small geometry offsets.
- Historical keyboard raster rather than the browser/device input surface.
- Final Camera picker Cancel chrome.
- Exact Lock Screen preview and slide-to-view pixel geometry.
- Audible playback under browser autoplay restrictions; semantic dispatch is correct, but browser policy is external to Messages state.

## Files changed by this sweep

- `docs/evidence/messages-functional-bug-sweep-v0.1.md`

No application code, visual style, message content, scheduler, audio registry, or asset was changed by this sweep.

## Validation

- deterministic reducer/scheduler checks: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- historical asset modifications: none
