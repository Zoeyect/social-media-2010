# iOS 4.1 Messages Experience v0.2 Preparation Audit

## Scope and evidence

Target: iPhone 4, iOS 4.1 build 8B117, MobileSMS, U.S. locale, October 20, 2010.

This is an audit only. It does not modify `MessagesExperience.tsx`, Messages reducers, notification runtime, audio, assets, CSS, or lifecycle code.

Evidence priority:

- **ORIGINAL:** recovered 8B117 SpringBoard/MobileSMS binaries, strings, settings, UISounds, and raster resources already inventoried by this project.
- **PERIOD-EVIDENCE:** contemporary Apple user documentation and 2010–2011 reviews.
- **HOLD:** details not recoverable from the current binary/resource trace or a verified runtime capture.

The earlier notification audits established the exact 8B117 classes and routes `SBSMSAlertItem`, `SMSAlertSheet`, `SBSMSManager`, `smsMessageReceived`, `updateSMSBadges`, `_markReadIfDisplayingEntireMessage`, and `sms:/open?...;showkeyboard=0`.

## 1. Incoming SMS state

### Required semantic model

The requested states must not be collapsed into one enum because delivery, system-alert disposition, read state, and reply state are independent.

Recommended model:

```text
delivery: scheduled | pending | delivered
notification: none | presenting | ignored | opened
read: unread | read
reply: none | drafting | sent
```

Narrative flow:

```text
scheduled
  → pending
  → delivered + presenting + unread

presenting
  ├── Close / no action → ignored + unread
  └── View / slide to view → opened → conversation displayed → read

read
  → drafting
  → sent
```

Mapping to the requested vocabulary:

| Requested state | Meaning | Classification |
| --- | --- | --- |
| incoming notification pending | event scheduled/accepted but not presented | **READY architecture requirement** |
| notification displayed | system alert or locked preview is visible | **READY** |
| ignored | alert dismissed or left unanswered; SMS remains unread | **READY** |
| opened | notification action targets the full conversation | **READY** |
| replied | outgoing SMS successfully entered the conversation state | **READY concept**; delivery/network acknowledgement details **HOLD** |

### Current implementation comparison

Current state is split across appropriate owners:

- `smsNotificationState`: `received | presenting | dismissed | viewed`;
- `messagesBadgeState`: unread message IDs;
- `messagesState`: conversation content, draft, sent text, and Mom reply;
- `appRuntimeState`: launch/suspend/resume ownership.

This separation is structurally correct. Remaining gaps:

- no explicit pre-delivery `scheduled/pending` state;
- `dismissed` should be documented/renamed semantically as ignored without implying message deletion;
- `viewed` records notification action, but read state belongs to conversation presentation;
- `momReply: pending | received` describes the later narrative response, not the user's general `replied` status;
- one-shot fields (`initialMessage`, `sentText`) are sufficient for v0.1 but not a reusable ordered message record.

## 2. Two notification contexts

### A. Device unlocked

#### Presentation

iOS 4.1 uses a centered modal SMS alert, not a banner and not Notification Center. Exact 8B117 evidence includes `SMSAlertSheet`/`UIAlertView` and these strings:

```text
Text Message
Mom
Home yet?
Touch View to see entire message

Close | View
```

- Modal alert: **READY**.
- Top banner / pull-down notification list: **REJECT**; these are later behavior.
- Sender and body preview with default `SBShowSMSPreview=true`: **READY**.
- Exact alert chrome, typography, dimensions, line breaks, and dimming: **HOLD**.

#### Sound and badge

```text
SMS accepted as unread
  ├── DeviceAudio.notificationReceived("message")
  ├── unread Messages badge +1
  └── system alert presentation
```

The three effects belong to one delivery event. A meaningful sub-frame order between sound onset, badge redraw, and first alert frame is **HOLD**.

- Default selected tone `sms-received1.caf`: **READY**.
- Badge updates on delivery, not after Close or View: **READY**.
- Ring/Silent, volume, vibration, and browser autoplay: **HOLD**.

#### Actions

```text
Close
  → dismiss alert
  → preserve SpringBoard/current app
  → keep message unread and badge visible

View
  → launch/resume MobileSMS
  → open Mom conversation
  → keyboard remains hidden
  → mark read when entire conversation is displayed
```

Exact conversation targeting and `showkeyboard=0` are **READY** from the recovered routes. `Cancel` is not the standard unlocked SMS action; `Close` is the verified string.

If another app is foreground, the alert does not destroy it. View uses normal suspend/launch behavior; Close restores interaction to the same foreground owner.

### B. Device locked or sleeping

#### Arrival and preview

```text
sleeping/locked
  → incoming SMS
  → sound + unread badge state
  → screen wakes to Lock Screen
  → sender/body preview when Show Preview is enabled
  → slider label becomes "slide to view"
```

- Locked SMS preview: **READY**.
- Exact `SMS_LOCK_LABEL = slide to view`: **READY**.
- iOS 5-style stacked notification rows/cards: **REJECT**.
- Preview frame, backlight timing, typography, persistence duration: **HOLD**.

#### View and ignore behavior

Completing `slide to view` routes to Mom's MobileSMS conversation with the keyboard hidden. Ordinary unlock is a different intent and must preserve the existing foreground-return policy while leaving the SMS unread.

No verified 8B117 evidence currently establishes a dedicated touchscreen `Cancel` button on the locked SMS presentation. Do not invent one. The supported ignore paths are:

- take no action;
- let the screen sleep again;
- later perform ordinary unlock rather than the notification action.

All preserve unread state and the badge. Exact Home/Power dismissal behavior and alert persistence are **HOLD**. The default `SBExtraSMSAlerts=true` description says an ignored SMS alerts twice more; the additional-alert capability/count is **READY**, but its timing is **HOLD**.

## 3. MobileSMS application structure

### Conversation list

Period Apple documentation establishes a thread/conversation list rather than a flat message inbox. The list supports opening a conversation, composing a new message, editing/deleting conversations, and search. [Apple period Messages guide](https://cdsassets.apple.com/live/6GJYWVAV/user/ma616_iphone_ios3_1_user_guide.pdf) iOS 4 reviews also record Messages search and failed-send badge behavior. [iOS 4 period review](https://www.imore.com/ios-4-review)

Expected structure:

```text
Status Bar
Navigation Bar: Edit | Messages | Compose
Conversation rows:
  sender/contact
  latest-message preview
  recency/time metadata
  disclosure/navigation behavior
```

- List/thread architecture and sender/preview relationship: **READY**.
- Edit/compose capabilities: **READY historical behavior**, optional outside the narrative scope.
- Exact row height, separators, fonts, truncation, date format, accessory glyph, and unread treatment: **HOLD**.

Current v0.1 has the central title and a sender/preview row, but omits Edit, Compose, recency metadata, search, and verified raster chrome. It is a structural approximation.

### Conversation view

Expected structure:

```text
Status Bar
Navigation Bar:
  back to Messages
  contact/title
  contact/call affordance where applicable
Scrollable transcript
Composer
Native keyboard when input is focused
```

- Back navigation, contact identity, transcript, composer, and Send action: **READY**.
- Exact right-side navigation control in this context/build: **HOLD**.
- View action opening the conversation with no keyboard: **READY**.
- Keyboard appearing only after explicit input focus: **READY direction**; exact transition/geometry **HOLD**.

### Message bubbles

Period MobileSMS uses conversation balloons. Contemporary iPhone 4 coverage describes SMS as conversation balloons and embedded media. [Period iPhone 4 review](https://www.techradar.com/reviews/phones/mobile-phones/iphone-4-694980/review/6)

- Incoming and outgoing messages occupy opposing sides: **READY**.
- SMS outgoing balloon is green; incoming is neutral gray: **READY period visual behavior**.
- iMessage blue bubbles, delivery/read receipts, reactions, avatars, Stories-style elements, effects, and modern inline apps: **REJECT** for October 2010.
- Exact bubble raster assets, cap insets, tails, margins, shadows, fonts, and maximum widths: **HOLD** until the recovered MobileSMS balloon resources are mapped to runtime composition.

Current CSS gray/green bubbles have the correct broad semantic distinction but use structural gradients/radius/shadows and must not be classified as recovered MobileSMS artwork.

### Composer, keyboard, and Send

- Text entry field plus Send button: **READY**.
- System keyboard used for SMS composition: **READY**.
- Keyboard clicks enabled by default: **READY**.
- Exact 8B117 keyboard artwork/geometry and special-key sound mapping: **HOLD**.
- Exact Send enabled/disabled visuals and button raster/cap insets: **HOLD**.
- Current browser input is not a historical keyboard implementation and remains a functional placeholder.

### Timestamps

Period conversation UI shows temporal separators/metadata, but exact 8B117 rules for when a timestamp appears are not established by the current evidence.

- Time context exists in conversation history: **READY broad behavior**.
- Timestamp on every message: **REJECT** as an unsupported assumption.
- Exact grouping threshold, wording (`Today`, date, time), locale formatting, centering, and placement: **HOLD**.
- For the short narrative, do not invent per-message timestamps until the rule is verified.

## 4. Audio event mapping

| Event | Asset/event | Classification |
| --- | --- | --- |
| Incoming SMS while SpringBoard/another app/locked | `DeviceAudio.notificationReceived("message")` → `sms-received1.caf` | **READY** default mapping |
| Open alert / open conversation | no verified dedicated open sound | **HOLD / remain silent** |
| Keyboard character feedback | `DeviceAudio.keyboardTap()` → `Tock.caf` | **READY** recommended normal key mapping; special keys **HOLD** |
| Send SMS | `DeviceAudio.messageSent()` → `SentMessage.caf` | **READY** |
| Message received while MobileSMS is foreground | `ReceivedMessage.caf` asset exists | exact foreground trigger versus selected notification tone **HOLD** |

Applications should emit semantic events and must not select CAF paths. Opening Messages must not reuse `unlock.caf`, a generic click, or a fabricated sound.

## Recommended v0.2 implementation boundary

Before visual refinement:

1. retain the four existing state owners rather than creating one Messages mega-state;
2. add explicit delivery and read/reply semantics;
3. treat Close/ignore, View/open, read, and reply as distinct transitions;
4. keep system alert rendering outside MobileSMS;
5. route both unlocked View and locked `slide to view` through the same targeted conversation request;
6. keep keyboard hidden on notification entry;
7. preserve unread state until the full conversation is displayed;
8. keep exact MobileSMS chrome, keyboard, bubble composition, timestamps, and foreground receive sound as HOLD.

## READY / HOLD summary

### READY

- Modal unlocked alert; no banners or Notification Center.
- Locked preview and `slide to view` action.
- `Close` preserves current context and unread badge.
- `View` targets the conversation with keyboard hidden.
- Badge increments on unread delivery and clears on full-conversation read.
- Conversation-list → conversation → composer structure.
- Neutral incoming and green outgoing SMS balloons.
- `sms-received1.caf`, `Tock.caf`, and `SentMessage.caf` semantic mappings described above.

### HOLD

- Exact alert/Lock Screen/MobileSMS pixel composition and typography.
- Lock Screen cancellation/dismissal control details beyond ignore/ordinary-unlock behavior.
- Native keyboard rendering and special-key audio.
- Exact timestamp grouping/formatting.
- Foreground MobileSMS received-message sound selection.
- Repeat-alert delays, sound/alert frame ordering, vibration, silent switch, volume, and browser playback policy.

### REJECT

- iOS 5+ banners or Notification Center.
- Modern Lock Screen notification cards.
- iMessage-specific visuals/features in the October 2010 SMS flow.
- Clearing unread state on Close.
- Automatically opening the keyboard from View/slide to view.
- Fabricated notification, bubble, keyboard, or sound artwork.

## Validation boundary

Only this evidence document is added. Existing Messages code, reducers, CSS, assets, notification runtime, audio runtime, and lifecycle behavior remain unchanged.
