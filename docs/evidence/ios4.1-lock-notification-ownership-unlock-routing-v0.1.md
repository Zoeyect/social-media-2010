# iOS 4.1 Lock Notification Ownership & Unlock Routing v0.1

## Previous coupling

The Lock Screen derived both preview visibility and slider action directly from `smsNotification.status === "preview-visible"`. Its successful slider branch called a dedicated `onViewSMS` callback. That meant the SMS notification state implicitly owned `slide to view`, with no system-level slot that a later Facebook or Twitter event could replace.

Normal unlock restoration already used `unlockReturnAppId`, but it was bypassed by the SMS-specific branch rather than selected by an explicit notification owner.

## Explicit owner

The root runtime now owns exactly one:

```ts
ActiveLockNotification | null
```

Its shape contains:

```text
id
sourceApp
target
timestamp
payload
```

Targets are explicit discriminated values:

- `messagesConversation` with a conversation ID;
- generic `app` with an app ID for future system notification producers.

`PRESENT` replaces the single active slot. It does not delete or mutate notification data, unread state, badge state, or application data owned elsewhere. No stack or iOS 5 Notification Center model was introduced.

## Two slider paths

### Normal unlock

```text
activeLockNotification = null
  → slide to unlock
  → existing onUnlock path
  → restore unlockReturnAppId when retained
  → otherwise SpringBoard
```

The existing foreground-owner capture during lock/sleep remains authoritative. SpringBoard stays SpringBoard; Messages, Twitter, or another retained application resumes through App Runtime rather than being hardcoded to SpringBoard.

### Actionable notification

```text
activeLockNotification != null
  → slide to view
  → clear only activeLockNotification
  → route target
```

For Mom SMS, the target is `messagesConversation: mom`; the existing Messages notification View path opens the conversation and its existing visible-conversation effect controls read/badge clearing.

Generic future `app` targets use the existing App Runtime launch/resume architecture.

An SMS that first appeared as an unlocked foreground Alert and is still active when the device locks is promoted into the same lock-owner slot while its SMS state changes to preview-visible. It therefore cannot fall through to a misleading normal `slide to unlock` action.

## Replacement semantics

When a new locked notification is presented:

```text
old active owner → replaced in Lock Screen action slot only
new notification → active preview and slide-to-view target
```

The old source application's unread record and badge are not part of this reducer and therefore remain untouched. This supports the required Messages → Facebook → Twitter replacement sequence without stacked Lock Screen UI.

## Ignore and timeline behavior

Doing nothing leaves the active slot intact through locked/sleeping behavior. A later event may replace it. The slot does not own or pause `sessionStartEpochMs`, Device Event Scheduler, battery warnings, or the passive terminal predicate. Shutdown resets the slot with other transient overlays.

## Test matrix

| Case | Result |
| --- | --- |
| SpringBoard lock/unlock, no notification | normal unlock returns SpringBoard |
| Messages/Twitter lock/unlock, no notification | existing retained foreground owner resumes |
| Mom SMS while locked | SMS becomes active owner; slide opens Mom conversation |
| Mom then Facebook | Facebook replaces action slot; Mom unread/badge remains owned by Messages |
| Facebook then Twitter | Twitter becomes action owner; Facebook state is not deleted |
| Slide to view | only active slot is cleared; target opens |
| No interaction for 15 minutes | lock owner does not affect passive shutdown invariant |

## Preservation

No global clock, battery curve, Messages conversation/reply logic, Camera picker, audio asset, Lock Screen geometry, PNG, CAF, or historical asset was changed.
