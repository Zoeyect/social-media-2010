# iOS 4.1 SMS Notification Alert Flow Audit v0.1

## Scope and evidence standard

Target: iPhone 4, iOS 4.1 build 8B117, AT&T, United States, 20 October 2010, 00:02–00:17 Pacific Time.

This is an audit only. It does not modify Messages UI, application runtime, device lifecycle, audio behavior, badge state, or artwork.

- **READY** — supported by Apple period/period-adjacent user documentation, the iOS notification API model, or verified 8B117 resources.
- **HOLD** — exact 8B117 MobileSMS/SpringBoard runtime behavior or pixel/timing detail is not yet directly recovered.
- **REJECT** — a notification model introduced after the target release.

Primary evidence:

- **Exact-build primary source:** `tmp/firmware/rootfs/018-7063-114-decrypted.hfs`, verified iPhone3,1 iOS 4.1 build 8B117. Audit files were extracted to `/tmp/ios41-sms-audit` only. The inspected SpringBoard executable SHA-256 is `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d`; its English `SpringBoard.strings` SHA-256 is `a55ba01d41b86b344cff154c5d226bf38f3d5a09d57a34a8d40407f5393f4a21`. The MobileSMS executable SHA-256 is `edb94c878f11d5e860c0f637571375c10c813facc6d69163a246ea2e33e21822`.
- The exact SpringBoard binary contains the concrete classes `SBSMSAlertItem`, `SMSAlertSheet`, and `SBSMSManager`, links `UIAlertView`, and exposes `smsMessageReceived`, `updateSMSBadges`, `_showSMSPreview`, `_markReadIfDisplayingEntireMessage`, and `alertView:clickedButtonAtIndex:`. This is direct evidence of a system-owned modal SMS alert path, not an inference from screenshots.
- Exact English strings include `SMS_ALERT_TITLE = Text Message`, `CLOSE = Close`, `VIEW = View`, and `SMS_HELP_TEXT = Touch View to see entire message`. They also include `SMS_LOCK_LABEL = slide to view`.
- Exact notification routes include `sms:/open?groupid=%d;showkeyboard=0` and `sms:/open?address=%@;showkeyboard=0`; `SBSMSAlertItem` exposes `_groupID`, `rawAddress`, and `reply`. These establish conversation-targeted View behavior with the keyboard initially hidden.
- Exact Settings configuration uses `SBShowSMSPreview`, default `true`, and `SBExtraSMSAlerts`, default `true`. Its localized repeat description is `If you ignore a message you will be alerted twice more.`
- Apple’s iPhone OS 3.1 guide states that message previews appear by default while the phone is locked or another application is in use, that alerts may repeat when unanswered, and that the Ring/Silent switch suppresses text-alert sound. This is immediately preceding behavior retained into the iOS 4 guide family: [Apple iPhone User Guide](https://cdsassets.apple.com/live/6GJYWVAV/user/ma616_iphone_ios3_1_user_guide.pdf).
- Apple’s iPhone 4 documentation index identifies the contemporary iOS 4.2/4.3 guide for this hardware; indexed guide text repeats that previews appear while locked or using another app: [Apple iPhone 4 manuals](https://support.apple.com/en-us/docs/iphone/132927).
- Apple’s legacy `UILocalNotification` documentation describes the pre-modern system model: when the notified app is not frontmost, iOS displays the alert, applies the requested badge, and plays the requested sound; its action button launches/wakes the app, while the locked form uses an action slider: [UILocalNotification](https://developer.apple.com/documentation/UIKit/UILocalNotification).
- Apple’s notification payload reference establishes the classic two-button alert contract (`Close` plus an action normally called `View`) and that alert, sound, and badge are independent fields of one delivery: [Payload Key Reference](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html).
- Apple’s period guide identifies the Messages badge as the total number of unread messages: [Apple iPhone User Guide](https://cdsassets.apple.com/live/6GJYWVAV/user/ma616_iphone_ios3_1_user_guide.pdf).

The API documentation is used to establish the system notification contract, not to claim that MobileSMS itself used `UILocalNotification` for carrier SMS delivery.

## Notification model classification

| Candidate | iOS 4.1 finding | Classification |
| --- | --- | --- |
| Center-screen alert dialog | Exact 8B117 `SBSMSAlertItem` + `SMSAlertSheet` + `UIAlertView` path | **READY** |
| Top banner | Notification banners belong to the later Notification Center-era model | **REJECT** |
| Pull-down Notification Center/list | Not present in iOS 4.1 | **REJECT** |
| Modern expandable notification/action sheet | Not present | **REJECT** |

The target should therefore use a modal system alert, not a banner.

The MobileSMS bundle contains conversation chrome such as balloon, input, Send-button, and launch PNGs, but no standalone SMS notification panel artwork. The alert is owned by SpringBoard/UIKit (`SBSMSAlertItem` / `SMSAlertSheet` / `UIAlertView`). Therefore no `MobileSMS alert artwork` should be invented or extracted by mislabeling conversation assets; exact alert chrome remains inside the system UI implementation and is **HOLD** until its runtime composition is recovered.

## Scenario A — device unlocked

### Arrival over SpringBoard or another foreground app

Recommended system sequence:

```text
SMS delivery
  → unread Messages state and badge update
  → selected text-alert sound
  → centered system preview alert over the current surface
  → wait for explicit user choice
```

The exact alert title is `Text Message`; its buttons are `Close` and `View`; and SpringBoard supplies the instruction `Touch View to see entire message`. For this narrative, the preview contains sender (`Mom`) and—because exact Settings sets Show Preview true by default—the body (`Home yet?`). These strings, button identities, and preview policy are **READY**. Exact line breaks, sender/body formatting, panel dimensions, typography, and alert raster composition remain **HOLD**.

`Cancel` is **REJECT** for this normal incoming-SMS alert: it exists elsewhere in SpringBoard, but the SMS-specific localized path names `Close` and `View`.

The alert is modal: the underlying app remains the foreground owner but does not accept ordinary interaction until the alert is acted on. It must not suspend or destroy that app merely because the SMS arrived.

If Messages itself is frontmost, generic notification APIs do not require a system alert. Exact MobileSMS in-app receipt behavior and whether `ReceivedMessage.caf` replaces the selected SMS tone are separate **HOLD** items; the proposed narrative notification should arrive while SpringBoard or another app is foreground.

### View/action

```text
system alert
  → View/action
  → preserve or suspend the previous foreground owner normally
  → launch/foreground Messages
  → select the notification target
```

Launching/foregrounding Messages and targeting the specific conversation are **READY**. Exact SpringBoard routes select by conversation group ID or sender address and pass `showkeyboard=0`; therefore View should open Mom’s conversation without automatically focusing the reply keyboard.

The target-build SMS action label is `View` and the dismissal label is `Close`, both **READY**. `REPLY = Reply` exists in SpringBoard for other SMS-related paths, but it does not displace the explicit `VIEW`/`SMS_HELP_TEXT` pair used by the standard SMS alert.

### Close/ignore

```text
system alert
  → Close/dismiss
  → alert removed
  → same foreground app or SpringBoard remains
  → message remains unread and available in Messages
```

Preserving the current foreground surface and leaving the message unread are **READY behavioral requirements**. Dismissal must not open Messages, mark the thread read, or clear its badge.

## Scenario B — device sleeping or locked

### Arrival

Recommended system sequence:

```text
SMS delivery
  → unread state and badge update
  → selected text-alert sound (unless silenced)
  → screen wake / Lock Screen preview
  → notification action slider available
```

Displaying a preview while locked and using a locked notification action slider are **READY**. The exact target-build slider string is `slide to view`. Treating this as an iOS 5-style list of Lock Screen notification rows is **REJECT**. Exact screen-wake/backlight timing, preview frame, alert positioning, typography, and slider raster composition remain **HOLD**.

With Show Preview enabled, `Mom` and `Home yet?` may be visible before unlocking. This is a deliberate narrative privacy state, not a universal device invariant; the preference can be disabled.

### Notification action / view

Apple’s legacy notification contract distinguishes the notification action slider from ordinary unlock:

```text
Lock Screen notification
  → move notification action slider
  → unlock/authenticate as required
  → wake or launch target app
```

Opening Messages and selecting Mom’s conversation from the action slider are **READY** because the target-build SMS alert owns group-ID/address routes into MobileSMS. The keyboard remains hidden on entry (`showkeyboard=0`).

### Ignore and ordinary unlock

If the user does nothing, the message remains unread. The exact 8B117 Settings bundle enables `SBExtraSMSAlerts` by default and states that an ignored message alerts twice more. The additional-alert count is therefore **READY**; exact delays and how long the first locked alert remains visible are **HOLD**.

On a later ordinary wake/unlock, the normal foreground-return policy should remain in force. Ordinary unlock is not equivalent to choosing the notification action: it should return to the previously owned app or SpringBoard, with the unread Messages badge preserved. The user can then open Messages manually.

## Badge behavior

Apple identifies the Messages icon badge as the total unread-message count. The correct state relationship is:

```text
SMS accepted as unread
  → unread count increments immediately
  → all rendered Messages icon instances reflect the same count
```

The exact SpringBoard runtime contains `smsMessageReceived`, `updateSMSBadges`, `unreadCount`, `unreadConversationCount`, and `markMessageAsRead:`. `SBSMSAlertItem` also contains `_markReadIfDisplayingEntireMessage`. Together with Apple’s unread-badge definition, this establishes that receipt updates unread/badge state independently of dismissal, while displaying the entire message marks it read. Choosing Close does not clear it. Exact instruction-level ordering between database commit, badge redraw, and alert presentation remains **HOLD**.

The current project intentionally avoided a Messages unread counter in v0.1. A future implementation needs one shared unread source for Page 1, Dock, and any multitasking representation; it must use the existing authentic badge compositor rather than inventing artwork.

## Sound behavior

The verified runtime mapping remains:

```text
notificationReceived("message")
  → sms-received1.caf
```

Alert, sound, and badge are products of the same incoming-SMS delivery. Apple’s APIs do not establish a meaningful serialized order such as “sound completes, then alert appears.” They should be dispatched atomically from one notification event. Frame-level onset order is **HOLD**.

The target default tone asset/mapping is **READY**. SpringBoard imports `AudioServicesPlayAlertSound`, owns `cancelScheduledSMSSounds`, and exact Settings maps `sms-sound` default value `1`; however, static binary evidence does not prove whether the first audio sample precedes or follows the first alert frame. Ring/Silent state, alert volume, vibration, repeat-alert timing, and browser autoplay behavior remain **HOLD**. The sound must fire on initial SMS arrival, not only after the user opens Messages.

## Current implementation comparison

Current Messages v0.1 begins with `Home yet?` already present. The user discovers it only by launching Messages. The only incoming notification event occurs later for `Good. Sleep early.` after sending. Therefore it does not yet model the initial SMS as a system event.

The corrected narrative should separate four facts:

1. scheduled/arriving SMS payload;
2. unread conversation state;
3. system notification presentation and user disposition;
4. Messages application view state.

## OldOS Visual Cross-Check

### Evidence tier and inspected revision

OldOS is a later SwiftUI reconstruction and is used here only as **VISUAL-CROSSCHECK**. It is never `ORIGINAL` or `PERIOD-EVIDENCE`, and no conclusion is promoted to **READY** from OldOS alone.

Inspected source: Zane Kleinberg / OldOS, public repository revision [`a2e454d0a4155c8969d236340b37b865376a69de`](https://github.com/zzanehip/The-OldOS-Project/tree/a2e454d0a4155c8969d236340b37b865376a69de), specifically [`Common.swift`](https://github.com/zzanehip/The-OldOS-Project/blob/a2e454d0a4155c8969d236340b37b865376a69de/OldOS/OldOS/Common.swift), [`LockScreen.swift`](https://github.com/zzanehip/The-OldOS-Project/blob/a2e454d0a4155c8969d236340b37b865376a69de/OldOS/OldOS/LockScreen.swift), and [`Messages.swift`](https://github.com/zzanehip/The-OldOS-Project/blob/a2e454d0a4155c8969d236340b37b865376a69de/OldOS/OldOS/Messages.swift). The project's own README describes OldOS as a modern, mostly SwiftUI recreation of the past experience; that description fixes its evidence tier as reconstruction rather than Apple-original material.

No OldOS image, asset, texture, icon, or source file was copied into this repository. SwiftUI constants below are observations about the reconstruction, not Apple-original geometry.

### Public-source limitation

The inspected public OldOS revision does **not** implement an incoming-SMS notification flow:

- `Messages.swift` says the public Messages experience is “Coming Soon” and displays a development-status alert after launch.
- The reusable `skeumorphic_alert` in `Common.swift` accepts a title/subtitle and exposes one `OK` dismissal action; it is not an SMS-specific `Close` / `View` alert.
- `LockScreen.swift` implements the ordinary clock/date and `slide to unlock` reconstruction, but contains no SMS sender/body presentation, `slide to view`, or notification target routing.
- No public flow was found that connects incoming SMS → alert → View → Messages conversation.

Therefore OldOS can cross-check only the generic reconstructed modal composition and ordinary Lock Screen hierarchy. It provides no affirmative visual cross-check for the exact SMS-specific unlocked alert, locked notification, or Messages transition.

### Unlocked SMS alert comparison

| Observation | OldOS behavior — **VISUAL-CROSSCHECK** | Tier 1 / Tier 2 status | Agreement / discrepancy | Result |
| --- | --- | --- | --- | --- |
| Modal versus banner | The generic `skeumorphic_alert` is centered as an overlay rather than placed as a top banner. | **ORIGINAL:** 8B117 contains `SBSMSAlertItem`, `SMSAlertSheet`, and `UIAlertView`. | Broad hierarchy agrees. OldOS's alert is generic, not SMS-specific. | Modal SMS structure remains **READY** from ORIGINAL evidence; OldOS adds visual corroboration only. |
| Background interruption | OldOS's Messages development alert overlays a black layer at 0.55 opacity plus a separate blurred white reconstruction effect. | **ORIGINAL:** modal alert path established. Exact dimming/compositing not recovered. | Presence of underlying-surface suppression broadly agrees; OldOS blur is reconstruction-specific and cannot establish historical styling. | Interruption hierarchy **READY** from ORIGINAL; exact dimming, blur, opacity and compositing **HOLD**. Copying the OldOS blur would be **REJECTED**. |
| Overall alert shape and vertical placement | OldOS centers a rounded blue panel, constrained to a maximum 200-point reconstructed height with 30-point side padding. | Exact 8B117 alert geometry remains unrecovered. | No Tier 1/2 pixel measurement confirms these SwiftUI values. | Shape, dimensions, radius and vertical position remain **HOLD**. |
| Title placement | OldOS places a centered title near the panel top, followed by centered subtitle content. | **ORIGINAL:** exact SMS title is `Text Message`; sender/body fields are part of the preview path. Exact typography/line layout is unresolved. | Broad title-above-content hierarchy agrees; it does not prove sender/body formatting. | Exact title string remains **READY** from ORIGINAL; placement, font and spacing remain **HOLD**. |
| Sender and message preview | The public OldOS alert has only generic title/subtitle properties and does not implement distinct SMS sender/message fields. | **ORIGINAL/PERIOD-EVIDENCE:** default SMS preview and target content are established. | OldOS supplies no SMS-specific corroboration. | Sender/body presence remains **READY** from Tier 1/2; exact line layout remains **HOLD**. |
| Button arrangement | OldOS's generic alert contains one `OK` button. | **ORIGINAL:** exact 8B117 SMS strings and alert path establish `Close` and `View`. | Direct discrepancy caused by comparing a generic development alert with an SMS alert. | `Close` / `View` remains **READY** from ORIGINAL. OldOS `OK` is **REJECTED** as an SMS-alert reference. |
| `Cancel` / `View` relationship | OldOS implements neither pairing in the public SMS path. | **ORIGINAL:** the target pairing is `Close` / `View`; `Cancel` is rejected for this alert. | No corroboration. | Existing classification unchanged: `Close` / `View` **READY**, `Cancel` **REJECTED**. |
| Exact gloss, shadow and colors | OldOS reconstructs these with SwiftUI gradients, opacity, shadow and custom drawing. | Exact UIKit composition is unrecovered. | Reconstruction values have no original-asset provenance. | **HOLD**; using OldOS values as historical constants or artwork is **REJECTED**. |

### Locked SMS notification comparison

| Observation | OldOS behavior — **VISUAL-CROSSCHECK** | Tier 1 / Tier 2 status | Agreement / discrepancy | Result |
| --- | --- | --- | --- | --- |
| Ordinary Lock Screen hierarchy | OldOS reconstructs status bar → large clock/date → wallpaper → bottom `slide to unlock` control. | **ORIGINAL/PERIOD-EVIDENCE:** 8B117 resources and period documentation establish this broad structure. | Broad ordinary Lock Screen hierarchy agrees. | Existing Lock Screen structure remains supported; OldOS does not independently produce **READY**. |
| Sender/message placement | No locked SMS sender/body UI exists in the inspected public source. | **PERIOD-EVIDENCE:** previews appear while locked; **ORIGINAL:** Show Preview setting and SMS alert classes exist. | No OldOS cross-check available. | Preview presence remains **READY** from Tier 1/2; exact placement stays **HOLD**. |
| Relationship to unlock slider | OldOS implements only `slide to unlock`; no `slide to view` notification state was found. | **ORIGINAL:** exact 8B117 string `SMS_LOCK_LABEL = slide to view`. | OldOS is incomplete for this state and must not override the firmware. | `slide to view` remains **READY** from ORIGINAL; OldOS's omission is recorded, not treated as conflict with the target behavior. |
| Replace, overlay, or augment | OldOS has no SMS notification state from which this relationship can be observed. | Locked preview/action structure is established broadly; exact frame/layer composition remains unresolved. | No corroboration. | Exact locked composition remains **HOLD**. |
| Reconstructed Lock Screen styling | OldOS draws gradients, rounded rectangles, a text arrow and other SwiftUI visual substitutes. | The current project has recovered authentic Lock Screen rasters; exact notification composition is separate. | OldOS styling is not original artwork and conflicts with the project's provenance rules if copied. | OldOS styling/assets/code are **REJECTED** as provenance sources. |

### Messages transition comparison

| Observation | OldOS behavior — **VISUAL-CROSSCHECK** | Tier 1 / Tier 2 status | Agreement / discrepancy | Result |
| --- | --- | --- | --- | --- |
| Alert → View → conversation | No implementation exists in the inspected public revision; Messages opens a “Coming Soon” surface instead. | **ORIGINAL:** `sms:/open?groupid=...;showkeyboard=0` and address route establish targeted MobileSMS opening. | OldOS supplies no interaction corroboration. | Targeted View transition remains **READY** from ORIGINAL; exact animation and foreground handoff details remain **HOLD**. |
| Keyboard on entry | Not represented by an SMS transition in OldOS. | **ORIGINAL:** `showkeyboard=0`. | No corroboration. | Keyboard-hidden entry remains **READY** from ORIGINAL. |

### Cross-check disposition

- **VISUAL-CROSSCHECK agreement:** a centered modal overlay, title-above-content hierarchy, background suppression, and the broad ordinary Lock Screen hierarchy.
- **VISUAL-CROSSCHECK unavailable:** SMS sender/body layout, two-button SMS actions, locked SMS preview, `slide to view`, and View-to-conversation routing.
- **Discrepancy resolved in favor of ORIGINAL:** OldOS's generic single `OK` action must not replace 8B117's `Close` / `View` SMS contract.
- **REJECTED as provenance:** all OldOS SwiftUI dimensions, gradients, blur, shadows, textures, icons, and recreated assets.
- No READY/HOLD decision elsewhere in this audit was upgraded solely because of OldOS.

## Implementation recommendation

### `messagesState.ts`

- Add an initial-message delivery state such as `scheduled | deliveredUnread | read` rather than pre-seeding only visible conversation text.
- Keep unread count independent of alert visibility.
- Add notification disposition: `none | presenting | dismissed | viewed`.
- Mark read only when the target conversation is actually presented.

### `MessagesExperience.tsx`

- Continue rendering the existing conversation content; do not own the system alert.
- Accept notification-target navigation so `View` can open Mom directly.
- Clear/recompute unread state on conversation presentation, not on alert dismissal.

### Device audio integration

- Move `DeviceAudio.notificationReceived("message")` to the initial delivery event.
- Dispatch sound once per delivery, alongside badge and alert state.
- Do not let the alert component choose `sms-received1.caf` directly.

### App/runtime notification flow

- Add device-owned SMS notification state above individual apps.
- Preserve the current foreground owner while the unlocked alert is displayed.
- `View` should launch/resume Messages through the existing runtime and target Mom.
- `Close` should restore interaction to the unchanged underlying surface.
- While locked, keep ordinary unlock and notification-action unlock as distinct intents.
- Do not implement banners, Notification Center, modern notification queues, or inline reply.

## READY / HOLD summary

### READY

- Preview by default while locked or using another app.
- Exact modal `SMSAlertSheet`/`UIAlertView` path rather than a banner.
- Exact title `Text Message`, buttons `Close` / `View`, and help text `Touch View to see entire message`.
- Notification action wakes/launches Messages and targets the sender/group conversation with the keyboard hidden.
- Locked notification uses `slide to view` rather than a modern list interaction.
- Ignoring preserves unread content and current foreground context.
- Messages badge represents total unread messages and updates from delivery state.
- Ignored messages alert twice more under the default 8B117 preference.
- Sound, alert, and badge originate from one incoming-SMS event.

### HOLD

- Exact alert geometry, sender/body line formatting, typography, and UIKit artwork.
- Exact locked preview frame, slider raster composition, and screen-wake timing.
- Instruction-level badge redraw timing relative to alert presentation.
- Sound/alert onset order at sub-frame precision.
- Repeat-alert delay and persistence across later wakes.
- Ring/Silent, vibration, output route, and browser playback policy.

## Validation boundary

Only this evidence document is added by the audit. No Messages UI, application/runtime state, lifecycle, audio registry, sound asset, badge, or historical artwork is changed.
