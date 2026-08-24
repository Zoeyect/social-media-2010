# Messages Experience v0.1

## Scope

This is one bounded SMS interaction inside the shared iOS 4.1 application runtime. It is not a complete Messages clone and adds no iMessage, avatars, group messaging, attachment flow, badges, or fabricated conversations.

## Runtime connection

The existing authentic Messages icon on SpringBoard Page 1 and the existing Dock Messages icon now emit the same semantic launch ID:

```text
Messages icon
  → onLaunchApp("messages")
  → shared app runtime launching
  → running
  → MessagesExperience
```

No icon placement, SpringBoard geometry, page state, Dock geometry, or artwork was changed. The entry points are attached to the already-present elements only.

Messages state is owned above the runtime surface. Consequently, ordinary Home suspension and later resume preserve the current list/conversation view, draft, sent text, and reply state. No separate Messages lifecycle was introduced.

## Experience flow

### Conversation list

The initial surface contains one row:

```text
Mom
Home yet?
```

Selecting it opens the conversation.

### Conversation

The initial incoming SMS is:

```text
Mom: Home yet?
```

The user can type the narrative response `Got home`. Printable key and Backspace input events emit `DeviceAudio.keyboardTap()`; the component never selects `Tock.caf` directly.

Sending a non-empty draft:

1. emits `DeviceAudio.messageSent()`;
2. records the user's exact typed text;
3. clears and disables the one-shot composer;
4. schedules the fixed reply after a 1,000 ms implementation interval;
5. records `Mom: Good. Sleep early.`;
6. emits `DeviceAudio.notificationReceived("message")`.

The audio registry continues to resolve these semantic events to the verified `SentMessage.caf`, `sms-received1.caf`, and `Tock.caf` assets. Messages contains no CAF paths.

## State model

```text
view: list | conversation
draft: user-entered string
sentText: null | user-entered string
momReply: notSent | pending | received
```

The reducer accepts only navigation, draft editing, one send, and the one fixed incoming reply. It does not generate content or contact data.

## Historical boundary

### READY

- Authentic 8B117 Messages icon and existing shared launch runtime.
- SMS rather than iMessage terminology and behavior.
- Period-appropriate contact/list/thread/composer structure.
- Incoming neutral and outgoing green bubble distinction.
- Existing verified semantic keyboard, sent-message, and default SMS notification sounds.
- Home suspension preserves the experience state.

### HOLD

- Exact MobileSMS 8B117 navigation-bar, bubble, list-row, and composer pixel metrics.
- Exact historical typeface rasterization and native keyboard presentation.
- Exact delay between the sent message and Mom's reply; 1,000 ms is narrative timing, not a recovered system constant.
- Browser audio autoplay and CAF decoding policy.
- Foreground received-message sound distinctions beyond the explicitly requested default SMS notification event.
- Persistence of the conversation across a full browser reload or simulated process eviction.

The current app chrome is a restrained structural CSS implementation. It uses no generated raster artwork and is not classified as recovered MobileSMS artwork.

## Preservation boundary

No Folder, Multitasking Bar, carrier configuration, Lock Screen, device lifecycle, audio registry, historical asset, or SpringBoard layout/state behavior was modified. Only the existing Messages icon entry points received launch actions.
