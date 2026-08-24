# iOS 4.1 SMS Notification Runtime v0.2

## Scope

This implementation converts the verified 8B117 SMS alert audit into a device-owned runtime. It does not redesign Messages, add notification banners, introduce Notification Center, or alter the audio registry and historical assets.

The narrative SMS is delivered three elapsed minutes after the session begins—the planned 00:05 point of the 00:02–00:17 experience:

```text
Mom
Home yet?
```

## Architecture

```text
smsMessageReceived
├── SMS notification reducer
├── DeviceAudio semantic event
├── Messages unread/badge reducer
└── Messages conversation reducer
```

The state domains remain independent:

- `smsNotificationState`: system alert identity, source, and disposition;
- `messagesBadgeState`: unread message IDs only;
- `messagesState`: MobileSMS conversation content and app view;
- `appRuntimeState`: foreground/suspended application ownership, unchanged.

Messages does not create the system alert, select a CAF file, or own the global badge count.

## Notification state machine

```text
null
  → RECEIVE
received
  → PRESENT
presenting
  ├── DISMISS → dismissed
  └── VIEW    → viewed
```

Each notification records:

```text
id
sender
message
status: received | presenting | dismissed | viewed
source: foreground | lockscreen
```

`source` records the device state at delivery. Presentation later follows the current device state, so an ignored/preserved alert can remain associated with the same SMS across a sleep/wake boundary.

## Incoming event flow

The exported semantic coordinator is:

```ts
smsMessageReceived({
  id: "mom-home-yet",
  sender: "Mom",
  message: "Home yet?"
}, source, targets)
```

It performs the deterministic simulation sequence:

1. create the notification in `received` state;
2. emit `DeviceAudio.notificationReceived("message")`;
3. add the message ID to the unread badge state;
4. deliver the message content to MobileSMS state;
5. advance the notification to `presenting`.

This ordering makes ownership explicit, but the audit could not establish whether the first audio sample historically preceded the first rendered alert frame. That sub-frame ordering remains **HOLD**.

## Unlocked alert

When the current device phase is not sleeping/locked, the device renders a system-owned modal layer above SpringBoard or the foreground app. Its verified content is:

```text
Text Message
Mom
Home yet?
Touch View to see entire message

Close | View
```

`Cancel` is not used. The overlay is outside `MessagesExperience` and blocks the underlying surface while presenting.

The exact historical alert raster is not a standalone MobileSMS asset. The runtime therefore uses a minimal structural panel with no generated raster, blur, banner, card stack, or modern notification artwork. Exact UIKit/SMSAlertSheet chrome remains **HOLD** and the structural CSS must not be classified as recovered artwork.

## Close behavior

```text
presenting
  → Close
dismissed
  → previous SpringBoard/app remains foreground
```

Close does not:

- launch Messages;
- change the Messages conversation;
- mark the SMS read;
- remove its unread ID;
- clear the badge.

The user can later launch Messages manually, select Mom, and only then mark the message read.

## View behavior

```text
presenting
  → View
viewed
  → existing App Runtime launch/resume path
  → Messages conversation: Mom
```

View opens the target conversation directly. The composer is not focused and the native/browser keyboard is not automatically requested, matching the verified `sms:/open?...;showkeyboard=0` intent.

If another app owns the foreground, the runtime uses the existing `SUSPEND` then `LAUNCH` transitions. If Messages is already suspended, it uses the existing `RESUME` transition. No duplicate lifecycle was added.

## Lock Screen behavior

If delivery occurs while the device is sleeping or locked:

```text
SMS delivery
  → sound + unread state
  → sleeping device changes to existing locked phase
  → Lock Screen SMS preview
  → slide to view
```

The existing Lock Screen remains responsible for its clock, wallpaper, status bar, and slider gesture. While the SMS is presenting, the same slider changes its verified semantic label from `slide to unlock` to `slide to view`. Completing it routes directly to Mom’s Messages conversation without automatically showing the keyboard.

No iOS 5 Lock Screen notification rows, cards, banners, or Notification Center behavior is introduced. Exact SMS preview/slider artwork and backlight timing remain **HOLD**.

## Badge behavior

Unread state is a set of message IDs, not a UI-local counter:

```text
ADD_UNREAD("mom-home-yet")
  → badge count 1

MARK_READ("mom-home-yet")
  → badge count 0
```

The count renders on both existing Messages icon instances—Page 1 and Dock—through the existing historical `SBBadgeBG`/mask compositor. No icon position or grid geometry changes.

The message is marked read only when View targets the conversation or the user manually selects Mom from the conversation list. Alert Close and Lock Screen sleep/wake do not clear it.

## READY

- Independent notification, badge, conversation, and app-runtime state domains.
- Semantic `smsMessageReceived` event.
- Existing verified `sms-received1.caf` resolver path, unchanged.
- Exact strings `Text Message`, `Close`, `View`, helper text, and `slide to view`.
- Modal system alert rather than a banner.
- View targets Mom’s conversation with keyboard hidden.
- Close preserves foreground owner and unread badge.
- Locked delivery wakes to the existing Lock Screen notification path.
- Badge increments on receipt and clears only when the full conversation is displayed.

## HOLD

- Exact UIKit `SMSAlertSheet` raster composition, typography, spacing, and animation.
- Exact Lock Screen SMS preview raster/geometry and backlight timing.
- Audio sample onset versus alert first-frame ordering.
- Ring/Silent, volume, vibration, browser autoplay, and CAF decode behavior.
- The two additional default repeat-alert timers established by the audit.
- Notification/badge persistence across a complete browser reload or simulated process eviction.
- Multiple-message queueing and multi-conversation badge aggregation beyond the ID-based foundation.

## Preservation boundary

No Audio registry/CAF, historical PNG, SpringBoard grid/Dock geometry, Folder, Multitasking Bar, carrier configuration, battery calculation, timeline formatter, or application lifecycle reducer was changed. Messages app chrome and conversation copy remain unchanged apart from receiving the initial message from the new semantic delivery event instead of having it exist before arrival.
