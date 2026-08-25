# iOS 4.1 SMS Notification Runtime v0.1

## Scope

This change implements the device-owned SMS notification lifecycle before further MobileSMS visual work. It does not redesign `MessagesExperience`, change Lock Screen geometry, modify the audio registry, add notification artwork, or introduce iOS 5 banners/Notification Center.

Target event:

```text
Mom
Home yet?
```

## State model

The notification state is independent from Messages conversation state, unread Badge state, and application runtime state:

```text
none
  → incoming
  ├── alert-visible   (foreground/SpringBoard)
  └── preview-visible (sleeping/locked)

alert-visible
  ├── dismissed
  └── viewing

preview-visible
  └── viewing

viewing
  → opened
```

State meanings:

- `none`: no narrative SMS has been delivered;
- `incoming`: delivery has been accepted and the semantic event is being dispatched;
- `alert-visible`: the existing system modal is active over an unlocked surface;
- `preview-visible`: the existing Lock Screen preview and `slide to view` path are active;
- `viewing`: View/slide-to-view requested the target conversation, but read completion has not yet been committed;
- `dismissed`: Close removed the foreground alert without reading the SMS;
- `opened`: the Mom conversation is actually the active Messages view.

The payload is retained in every state except `none`. It contains message ID, sender, body, and the delivery context.

## Incoming event ordering

`smsMessageReceived` remains the device-owned coordinator:

```text
RECEIVE → incoming
DeviceAudio.notificationReceived("message")
ADD_UNREAD
deliver content to Messages state
SHOW_ALERT or SHOW_PREVIEW
```

The resolver continues to map the semantic notification event to the verified `sms-received1.caf`. `ReceivedMessage.caf` is not dispatched.

The code order is deterministic for ownership, but exact sample-onset versus first rendered frame remains historically HOLD.

## Scenario A — unlocked

Foreground and SpringBoard delivery select `alert-visible`. The existing system-owned alert remains outside MobileSMS and presents:

```text
Text Message
Mom
Home yet?
Touch View to see entire message

Close | View
```

### Close

```text
alert-visible → dismissed
```

Close changes only notification presentation state. The message ID remains in the unread Badge set, conversation content remains available, and the current SpringBoard/application owner is preserved.

### View

```text
alert-visible → viewing
request Messages runtime
request Mom conversation
conversation becomes active
mark unread ID read
viewing → opened
```

The Badge is no longer cleared inside the click handler. A React effect observes that the conversation is actually the current Messages view before dispatching `MARK_READ` and `OPEN`. This preserves the boundary between requesting a view and displaying the entire message.

The input is not focused and the keyboard is not opened automatically.

## Scenario B — locked

Delivery while sleeping/locked selects `preview-visible`, plays the same semantic incoming sound, adds the unread ID, and uses the existing Lock Screen preview/slider structure.

```text
preview-visible
  → slide to view
viewing
  → Messages / Mom conversation
opened
```

Ignoring the preview performs no transition: the device remains locked and the unread state persists. No Cancel button, banner, notification row, or modern card is introduced.

If an unlocked `alert-visible` notification is subsequently covered by device lock/sleep, it transitions to `preview-visible` while retaining the same payload and unread ID. This prevents lifecycle changes from discarding the notification.

## Badge model

Unread state remains an independent set of message IDs:

```text
incoming unread → ADD_UNREAD(id)
Close           → no Badge event
ignore locked   → no Badge event
conversation displayed → MARK_READ(id)
```

The existing Messages instances on Page 1 and in the Dock consume the same count and existing historical Badge compositor. No SpringBoard icon position or Badge artwork changes.

## Persistence

Notification, unread, and Messages content reducers are owned by the root device component and are not reset by:

- Home suspension;
- application switching;
- screen sleep;
- wake to Lock Screen;
- ordinary app suspend/resume transitions.

Full browser reload/process persistence remains outside v0.1.

## Files changed

- `src/state/smsNotificationState.ts`
- `src/system/smsNotification.ts`
- `src/device/App.tsx`
- `src/device/SMSAlertOverlay.tsx`
- `src/device/LockScreen.tsx` — state-name wiring only; no geometry or visual styling
- this evidence document

## Preservation confirmation

- No MobileSMS UI or CSS was changed.
- No Lock Screen geometry or CSS was changed.
- No audio registry or CAF asset was changed.
- No historical PNG was added or modified.
- No banner or Notification Center behavior was introduced.
- Existing app suspension/resume architecture remains authoritative.

## HOLD

- Exact sound/alert first-frame ordering.
- Repeat-alert timers and locked preview persistence timing.
- Ring/Silent, vibration, output volume, and browser playback policy.
- Multiple simultaneous SMS queueing.
- Persistence across browser reload or simulated process eviction.
