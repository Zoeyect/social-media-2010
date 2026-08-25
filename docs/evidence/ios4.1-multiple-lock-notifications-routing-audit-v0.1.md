# iOS 4.1 Multiple Lock Notifications Routing Audit v0.1

## Scope and conclusion

This audit examines notification retention, visible Lock Screen ownership, and
unlock routing on iPhone 4 / iOS 4.1 build 8B117. It does not change runtime
code or establish a new replacement policy.

The current single-slot `activeLockNotification` model is **not historically
verified as a complete model**. Original 8B117 SpringBoard metadata proves that
the system retained multiple locked alert items and multiple away/missed items.
It also exposes a singular `visibleAlertItem` and singular alert activation
methods. Together, those facts support this model:

```text
multiple retained notification/away records
                  ↓
one currently visible/actionable alert presentation
```

They do **not** prove this policy:

```text
new cross-application notification
                  ↓
unconditionally replace the old slide-to-view owner forever
```

Accordingly, the current `PRESENT → return event.notification` behavior is a
functional **HOLD approximation**, not **READY** historical behavior. An iOS
5-style stacked Lock Screen or Notification Center is **REJECTED** for this
target.

## Evidence hierarchy

### Tier 1 — ORIGINAL

Inspected recovered files:

- `tmp/firmware/rootfs/recovered/SpringBoard.app/SpringBoard`
  - SHA-256: `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d`
  - Mach-O UUID: `983033E5-8570-6C1C-6C99-EED85CD8DBDB`
  - embedded source path identifies
    `SpringBoard-1205.49/SBAwayController.m`;
- `tmp/firmware/rootfs/recovered/SpringBoard.app/English.lproj/SpringBoard.strings`
  - SHA-256: `a55ba01d41b86b344cff154c5d226bf38f3d5a09d57a34a8d40407f5393f4a21`.

No binary bytes or resources were modified.

### Tier 2 — PERIOD EVIDENCE

- Apple's *iPhone User Guide — For iOS 4 Software* states that previews appear
  when the phone is locked or another application is in use, that conversations
  with unread messages remain represented in Messages, and that unanswered SMS
  previews can repeat. The inspected transcription is a later mirror of the
  period Apple manual, so it corroborates behavior but does not outrank the
  recovered build.
- Apple's archived notification documentation revision history records its
  iOS 4-era update on 2010-08-03 for launching an application from a
  notification alert action. The surviving current archive also preserves the
  legacy `action-loc-key` description: the system supplies Close/View behavior,
  and moving the action slider launches the notification target. These points
  verify targeted alert actions, not multiple-alert ordering.

### Tier 3 — VISUAL-CROSSCHECK

No OldOS or later recreation was needed to reach the classifications below.
No reconstruction is used to promote a result to **READY**.

## 8B117 SpringBoard findings

### 1. Locked alerts are stored as a collection

`SBAlertItemsController` contains these original ivars:

```text
_lockedAlertItems   NSMutableArray
_unlockedAlertItems NSMutableArray
```

Its original selectors include:

```text
visibleAlertItem
alertItemsOfClass:
alertItemOfClass:
activateAlertItem:
deactivateAlertItem:
deactivateAlertItem:reason:
deactivateAlertItemsOfClass:
deactivateVisibleAlertItemOfClass:reason:
deactivateAllAlertItems
convertAnimatingUnlockedAlertsToLockedAlerts
```

**Classification: READY.** Build 8B117 retained multiple alert objects and
distinguished locked from unlocked alert collections. A single nullable record
cannot represent the entire historical notification store.

### 2. One visible alert is selected from retained alerts

The same controller exposes singular `visibleAlertItem`, while activation and
deactivation operate on individual alert items. This supports one current
presentation/action owner at a time even though multiple alert items exist.

**Classification: READY** for “one visible alert item at a time.”

**Classification: HOLD** for the exact selection algorithm. Objective-C class
metadata and selector names do not establish whether a newly arriving item is
shown immediately, queued behind the visible item, coalesced by class, or
selected using priority and dismissal-reason rules.

### 3. The away model retains heterogeneous missed items

`SBAwayModel` has separate mutable arrays:

```text
_standardVMs
_calls
_SMSs
_videoConferences
_otherAwayItems
```

Relevant selectors include:

```text
missedItems
uncoalescedMissedItemCount
populateWithMissedSMS:
addSMSMessage:
addOtherAwayItem:
clearAwayItems
```

`SBAwayItemsView` holds `_displayedItems` as an `NSArray` and implements
`drawItems`, `hasAwayItems`, and per-item title/label methods.

**Classification: READY.** The pre-iOS 5 Lock Screen/away subsystem could
retain and render a collection of missed/away items. This is not evidence for
an iOS 5 Notification Center list; it is evidence against treating the active
action target as the only retained notification state.

### 4. SMS has explicit coalescing/count behavior

`SBAwayItem` contains a `count`, comparison/sorting methods, and singleton versus
aggregate title fields. The exact English resource includes:

```text
MULTIPLE_NEW_MESSAGE_HIDDEN_PREVIEW = "%@ New Text Messages"
AWAY_MASKED_SMSES_LABEL = "Text Messages"
AWAY_MASKED_SMS_LABEL = "Text Message"
```

`SBSMSAlertItem` also exposes `_deactivateAllTaggedSMSAlertItems`, `_tag`, and
`_untag`.

**Classification: READY.** Multiple SMS events were not modeled only as one
latest message with all previous notification identity discarded. At least
some SMS states were counted, grouped, tagged, sorted, or coalesced.

**Classification: HOLD.** Exact behavior when previews are enabled, when
messages come from different senders, and when a new SMS arrives while another
SMS alert is already actionable requires runtime capture or deeper verified
control-flow analysis.

### 5. Slide-to-view targets an individual alert action

Original selectors and strings include:

```text
SBSMSAlertItem.performUnlockAction
SBSMSAlertItem.lockLabel
SMS_LOCK_LABEL = "slide to view"
REMOTE_NOTIFICATIONS_LOCK_LABEL = "slide to view"
REMOTE_NOTIFICATIONS_LOCK_FORMAT = "slide to %@"
```

**Classification: READY.** A locked alert can own a specific unlock action and
route to its application/content target. Ordinary unlock and notification
action unlock are distinct paths.

**Classification: HOLD.** Which retained alert owns that action after several
cross-application arrivals is not exposed by these strings or method names.

## Current implementation comparison

Current reducer:

```ts
type LockNotificationState = ActiveLockNotification | null;

case "PRESENT":
  return event.notification;
```

| Concern | Current implementation | 8B117 evidence | Result |
| --- | --- | --- | --- |
| Current Lock Screen action owner | One nullable item | Singular `visibleAlertItem` / individual activation | **READY direction** |
| Retained locked notifications | Only represented in source-app state outside this reducer | `_lockedAlertItems` is an array | **HOLD approximation** |
| New alert selection | Always replaces current slot | Exact selection policy not recovered | **HOLD** |
| Older unread and badge state | Preserved by source app | Period guide and separate alert/badge semantics support persistence | **READY direction** |
| Same-app SMS aggregation | Not represented by active slot | Counts, tags, aggregate strings exist | **Incomplete / HOLD** |
| Cross-app ordering | Latest presentation wins | No sufficient Tier 1/2 proof | **HOLD** |
| Stacked notification cards | Not implemented | Belongs to later Notification Center model | **REJECTED** |

“READY direction” means the architecture is compatible with recovered evidence,
not that its exact selection or timing rules are verified.

## Scenario audit

### Multiple SMS messages while locked

Verified:

- every message can remain represented in MobileSMS unread/conversation state;
- SpringBoard has count/coalescing machinery for multiple SMS items;
- one visible/actionable alert presentation can be selected;
- opening the action can route through `performUnlockAction`.

Unverified:

- whether the newest sender/message always replaces the visible preview;
- whether an aggregate preview replaces a sender-specific preview;
- whether dismissing/viewing the current item reveals an earlier SMS alert;
- the exact relationship between Repeat Alert and multiple distinct messages.

Result: **HOLD** for latest-SMS-wins routing.

### SMS followed by a third-party push notification

Verified:

- locked alert items are held in a collection;
- remote/local notification alerts have their own SpringBoard classes;
- a visible item has an application-specific action target;
- SMS unread data and an app badge need not be erased when another alert is
  presented.

Unverified:

- whether the push immediately supersedes an already-visible SMS preview;
- whether it waits in the locked alert array;
- priority rules between system SMS and third-party notifications;
- whether the older item becomes visible again after the newer item is handled.

Result: **HOLD** for unconditional cross-app latest-wins.

### Several third-party notifications

The original alert-item arrays prove retention capacity, but neither inspected
firmware metadata nor period documentation establishes FIFO, LIFO, priority,
or per-application coalescing at the Lock Screen action layer.

Result: **HOLD**.

## Classification summary

| Finding | Evidence | Classification |
| --- | --- | --- |
| No iOS 5 Notification Center/stacked-card model | 8B117 structures and iOS 4 period model | **READY / later model REJECTED** |
| Multiple locked alert records can coexist | `_lockedAlertItems: NSMutableArray` | **READY** |
| Locked and unlocked alerts are separately retained | Two original arrays | **READY** |
| Away/missed items span multiple categories | `SBAwayModel` arrays and `missedItems` | **READY** |
| One alert item is currently visible/actionable | singular `visibleAlertItem`, individual activation | **READY** |
| SMS supports count/coalescing behavior | count/tag/aggregate-string evidence | **READY** |
| Badges/unread data survive another presentation | independent app data plus period Apple behavior | **READY direction** |
| Newest cross-app event always owns slide-to-view | no sufficient evidence | **HOLD** |
| Earlier actionable items never return | no sufficient evidence | **HOLD** |
| Exact queue, priority, and dismissal policy | requires deeper disassembly or device capture | **HOLD** |

## Recommendation for a later implementation task

Do not freeze the current latest-wins reducer as historical truth. It is safe to
retain temporarily if explicitly labeled **HOLD**, because it preserves one
visible Lock Screen action and keeps older unread/badge state in application
stores. A provenance-complete correction should distinguish:

```text
retained locked alert items
          ↓ selection/coalescing policy
visible actionable alert item
```

The selection policy should remain replaceable until one of the following is
obtained:

1. verified runtime captures on iOS 4.1 showing multiple cross-app arrival and
   dismissal sequences;
2. sufficiently complete control-flow analysis of
   `SBAlertItemsController.activateAlertItem:`,
   `deactivateAlertItemsForAlertActivation`, and the corresponding away-item
   population/rendering paths;
3. contemporaneous Apple documentation explicitly describing ordering and
   replacement.

No runtime change is authorized by this audit.

## Sources

### ORIGINAL

- Recovered 8B117 `SpringBoard.app/SpringBoard` Objective-C metadata, ivars,
  selectors, embedded source paths, and UUID, locally inspected with `otool` and
  `strings`.
- Recovered 8B117 English `SpringBoard.strings`, locally inspected without
  modification.

### PERIOD EVIDENCE

- Apple, *iPhone User Guide — For iOS 4 Software*, Messages chapter, “Managing
  Previews and Alerts” (period Apple document; inspected through a document
  mirror): https://manuals.plus/m/57785d951b410a35088a009e8cb15f344a60154cb258b173aceb93721b2270cf
- Apple Developer Documentation Archive, notification guide revision history
  (records the 2010-08-03 notification-action update):
  https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/RevisionHistory.html
- Apple Developer Documentation Archive, legacy payload action semantics
  (`action-loc-key`, Close/View, action slider):
  https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html

The archived developer pages are currently maintained documents containing
later additions. Only the explicitly legacy action semantics and dated revision
entry are used; modern banners, categories, content extensions, and
Notification Center behavior are excluded.

## Validation constraints

- No application/runtime code changed.
- `activeLockNotification` and its reducer were not changed.
- No replacement policy was changed.
- No assets were added, copied, or modified.
- No Tier 3 reconstruction produced a **READY** classification.
