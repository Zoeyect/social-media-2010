# iOS 4.1 MobileSMS Notification & Conversation List Fidelity v0.3

## Scope

Target: iPhone 4, iOS 4.1 build 8B117, 20 October 2010.

This pass audits and corrects only the locked SMS preview and MobileSMS conversation-list chrome. It does not change SMS timing, the +60-second device event, notification state transitions, badge logic, audio, replies, bubbles, composer, keyboard, or battery runtime.

Evidence labels:

- **ORIGINAL** — exact 8B117 firmware resource, binary, string, or recovered asset.
- **PERIOD-EVIDENCE** — Apple documentation or contemporary iPhone 4/iOS 4 material.
- **VISUAL-CROSSCHECK** — later reconstruction; never sufficient for READY.
- **READY** — sufficiently established behavior or structure.
- **HOLD** — plausible/current approximation without enough evidence for exactness.
- **REJECT** — post-target or fabricated substitute.

## Evidence used

### Tier 1 — ORIGINAL

The existing exact-build audit records:

- `SBSMSAlertItem`, `SMSAlertSheet`, `SBSMSManager`, and the `UIAlertView` path in the 8B117 SpringBoard binary;
- exact strings `SMS_ALERT_TITLE = Text Message` and `SMS_LOCK_LABEL = slide to view`;
- default `SBShowSMSPreview = true`;
- targeted MobileSMS routes with `showkeyboard=0`;
- authentic recovered `WellLock@2x.png`, `bottombarknobgray@2x.png`, `BarBottomLock@2x.png`, and `bottombarlocktextmask@2x.png` already used by the Lock Screen.

These establish preview presence, content role, and the notification-action lock bar. They do not establish an exact CSS rectangle for the preview panel.

### Tier 2 — PERIOD-EVIDENCE

- Apple’s June 2010 iPhone 4/iOS 4 user guide release establishes the target guide and hardware context: [MacRumors contemporary guide announcement](https://www.macrumors.com/2010/06/23/apple-posts-user-guide-for-iphone-4-and-ios-4/).
- A period-specific iPhone 4/iOS 4 device guide explicitly instructs users to press the new-message icon in the upper-right of Messages: [Vodafone iPhone 4 iOS 4 Messages guide](https://devices.vodafone.com.au/apple/iphone-4-ios4/basic-use/write-and-send-text-messages/).
- The same iPhone 4/iOS 4 guide family describes selecting a sender from the message list and using Edit in Messages: [Vodafone iPhone 4 iOS 4 read-message guide](https://devices.vodafone.com.au/apple/iphone-4-ios4/basic-use/read-text-messages/).
- Apple’s immediately preceding iPhone guide states that SMS previews appear while locked and that the Messages badge represents unread messages: [Apple iPhone OS 3.1 User Guide](https://cdsassets.apple.com/live/6GJYWVAV/user/ma616_iphone_ios3_1_user_guide.pdf).

Tier 3 reconstruction values were not used to set geometry, colors, radius, fonts, or artwork.

## A. Locked incoming-SMS preview

### Preserved runtime structure

```text
12:03 AM
incoming SMS
→ screen wakes to locked surface
→ Text Message / Mom / Home yet? preview
→ authentic lock-bar composition relabeled slide to view
```

The preview remains a SpringBoard/Lock Screen system surface. It is not a Notification Center row, banner, or app-owned card.

### Audit table

| Property | Current value/behavior | Evidence | Result |
| --- | --- | --- | --- |
| Preview exists while locked | `preview-visible` renders sender and body | ORIGINAL strings/classes and Show Preview default | **READY** |
| Title | `Text Message` | Exact 8B117 string | **READY** |
| Sender/body | `Mom` / `Home yet?` from delivered payload | ORIGINAL preview path; narrative payload | **READY** content, **HOLD** exact line formatting |
| Alert width | 272pt at x=24pt | No exact runtime measurement recovered | **HOLD**; unchanged |
| Vertical position | y=151pt | No exact runtime measurement recovered | **HOLD**; unchanged |
| Corner radius | 8pt | No exact UIKit measurement recovered | **HOLD**; unchanged |
| Background | `rgba(24,31,42,.92)` | No verified raster/compositing recipe | **HOLD**; unchanged |
| Border/highlight | 1pt translucent light border | Exact alert chrome unavailable | **HOLD**; unchanged |
| Title typography | centered 16px | Exact font metrics unavailable | **HOLD**; unchanged |
| Sender/body typography | 14px | Exact font metrics unavailable | **HOLD**; unchanged |
| Padding/gap | 10×12pt; 4pt grid gap | Exact runtime values unavailable | **HOLD**; unchanged |
| Relationship to clock/date | preview begins below the 96pt clock/date region | Broad hierarchy supported; exact separation unknown | **READY** hierarchy / **HOLD** offset |
| Relationship to action bar | preview remains above the bottom lock bar | ORIGINAL locked action-slider model | **READY** hierarchy / **HOLD** spacing |
| `slide to view` text | exact target string | Exact 8B117 string | **READY** |
| Lock-bar artwork | existing recovered lock rasters and existing shimmer path | ORIGINAL assets | **READY** asset usage |
| Slider accessibility intent | now identifies “Slide to view message” during preview | Same notification action state as visible text | **READY** correction |

The alert element now carries `data-geometry-status="HOLD"` so the current structural approximation is not misrepresented as verified geometry.

### Rejected alternatives

- iOS 5+ Notification Center or banner: **REJECT**.
- Detached plain `slide to view` text: **REJECT**.
- Modern stacked lock-screen notification card: **REJECT**.
- Invented gradients, blur, SVG, or screenshot-derived alert artwork: **REJECT**.

No unsupported alert geometry was changed in this pass.

## B. MobileSMS conversation list

### Empty state at 12:02 AM

The list remains empty before the scheduled SMS event. The application still renders the shared 20pt Status Bar, a 44pt MobileSMS navigation bar, and an empty white UIKit-style list surface.

Whether 8B117 visually enables, disables, or omits `Edit` when there are zero conversations was not established. The implementation therefore does not invent an enabled empty-state Edit target.

The upper-right new-message control is behaviorally confirmed by PERIOD-EVIDENCE, but no provenance-complete 8B117 glyph was recovered from the current asset set. A reserved 30×30pt structural slot is present and explicitly marked **HOLD**; it is visually empty rather than replaced with Unicode, SVG, CSS drawing, an SF Symbol, or screenshot-derived pixels.

### One-row state at 12:03 AM

After the scheduled event, the list displays:

```text
Mom                                      12:03 AM
Home yet?
```

### Audit table

| Property | Current/changed value | Evidence | Result |
| --- | --- | --- | --- |
| Navigation height | 44pt | Target-era UIKit structure and prior project evidence | **READY** structure / **HOLD** exact raster chrome |
| Center title | `Messages`, 20px bold white | PERIOD-EVIDENCE supports centered title; exact metrics unrecovered | **READY** relationship / **HOLD** typography |
| Left Edit control | shown when a conversation exists | PERIOD-EVIDENCE confirms list editing | **READY** label/placement relationship / **HOLD** exact font and button chrome |
| Empty-state Edit behavior | omitted | No evidence for enabled/disabled/hidden state at zero rows | **HOLD** |
| Right new-message control | reserved but visually empty | PERIOD-EVIDENCE confirms control; exact glyph unavailable | **READY** control role / **HOLD** artwork and exact geometry |
| List background | corrected from light gray to white | Plain target-era UITableView list surface | **READY** material class / **HOLD** exact sampled color |
| Row height | 61pt | Consistent with approximately 60pt target row | **HOLD** exact value |
| Sender | bold 17px, leading | PERIOD-EVIDENCE and target-era list hierarchy | **READY** hierarchy / **HOLD** exact font metrics |
| Preview | gray 15px below sender | PERIOD-EVIDENCE and target-era list hierarchy | **READY** hierarchy / **HOLD** exact color/metrics |
| Timestamp | `12:03 AM`, trailing, 11px gray | Delivered event timestamp and period list hierarchy | **READY** content/alignment / **HOLD** exact typography |
| Timestamp fallback | corrected from `12:05 AM` to `12:03 AM` | Narrative device event occurs exactly at 12:03 | **READY** correction |
| Separator | 1px gray bottom separator | UITableView row structure supported; exact tone unrecovered | **READY** structure / **HOLD** color |
| Avatar | absent | Not part of target scope/evidence | **READY** absence |
| iMessage/modern actions | absent | Post-target behavior | **REJECT** if added |

## Changed visual properties

1. The MobileSMS empty/list surface is now white rather than light gray — **READY class, HOLD exact color**.
2. A period-supported `Edit` label appears on the left when a conversation row exists — **READY relationship, HOLD exact styling**.
3. A non-rendering right compose slot records the verified control without fabricating its missing glyph — role **READY**, artwork **HOLD**.
4. The initial row’s legacy fallback timestamp is corrected to `12:03 AM` — **READY**.
5. The locked notification slider exposes the correct action intent to accessibility APIs — **READY**.

## Files changed

- `src/device/LockScreen.tsx`
- `src/device/MobileSMSContainer.tsx`
- `src/styles/device.css`
- `docs/evidence/ios4.1-mobilesms-notification-list-fidelity-v0.3.md`

## Validation

- `npm run build`: PASS
- `git diff --check`: PASS
- SMS +60-second scheduling: unchanged
- SMS audio and registry: unchanged
- Badge logic: unchanged
- Bubbles, composer, keyboard: unchanged
- Battery runtime: unchanged
- Historical assets added or modified: none
- Modern notification behavior introduced: none
