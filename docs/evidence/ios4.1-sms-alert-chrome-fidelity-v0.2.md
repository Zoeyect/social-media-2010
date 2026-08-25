# iOS 4.1 SMS Alert Chrome Fidelity Audit v0.2

## Scope

This is a visual evidence audit of the unlocked-device SMS alert on iPhone 4, iOS 4.1 build 8B117. It does not change notification logic, scheduling, Messages state, audio, application code, CSS, or assets.

Target payload:

```text
Mom
Good. Sleep early.
```

The current alert is a functional structural reconstruction. None of its CSS measurements or material values are treated as Apple-original evidence.

## Evidence hierarchy and inspected sources

### Tier 1 — ORIGINAL

- Exact recovered executable: `tmp/firmware/rootfs/recovered/SpringBoard.app/SpringBoard`
  - Mach-O ARMv7
  - SHA-256: `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d`
- Exact English localization: `tmp/firmware/rootfs/recovered/SpringBoard.app/English.lproj/SpringBoard.strings`
- Exact UIKit artwork archive: `tmp/firmware/rootfs/recovered/UIKit.framework/Shared@2x~iphone.artwork`
  - size: `17,663,232` bytes
  - SHA-256: `7f2265f0488bda6d49c3a95506193ced36cd461b85460011a45be1d4d38c17e4`
- Objective-C metadata and ARMv7 disassembly from the exact SpringBoard binary.

The binary establishes these implementation facts:

- `SBSMSAlertItem` owns the SMS alert behavior.
- `SMSAlertSheet` is a direct subclass of `UIAlertView`, not a MobileSMS view and not a modern notification card.
- `SMSAlertSheet` overrides `layout` and `layoutAnimated:` and implements `updateTagline`.
- The alert path exposes `taglineTextLabel`, `bodyTextLabel`, `setTitleMaxLineCount:`, `setBodyTextMaxLineCount:`, `numberOfLinesInTitle`, `isBodyTextTruncated`, `bodyTextAlignmentForAlertSheet:displayedLineCount:`, `_displayingEntireMessage`, and `_markReadIfDisplayingEntireMessage`.
- `SMSAlertSheet` has `_showingTagline` and `_showingImage` state. Consequently the help/tagline is conditional system content, not an unconditional third message line.
- The English bundle contains `SMS_ALERT_TITLE = Text Message`, `SMS_HELP_TEXT = Touch View to see entire message`, `CLOSE = Close`, and `VIEW = View`.
- It also contains sender-title variants: `TEXT_FROM_ONE_LINE = Text from %@`, `TEXT_FROM_TWO_LINES = Text from\n%@`, and `TEXT_FROM_NO_NAME = Text from Unknown`.

The exact archive proves that period UIKit shared artwork is present, but the available archive index maps numeric records rather than semantic `UIAlertView` part names. It does not yet identify which records, cap insets, colors, or drawing operations compose this alert.

### Tier 2 — PERIOD EVIDENCE

- Apple’s period iPhone guide states that a new-message preview appears by default while the phone is locked or another app is in use, and can repeat twice when ignored: [Apple iPhone User Guide](https://cdsassets.apple.com/live/6GJYWVAV/user/ma616_iphone_ios3_1_user_guide.pdf).
- A June 2009 contemporary description records the pre-iOS 5 popup model, the sender remaining visible when previews are disabled, and the user choosing View or Close: [iDownloadBlog, “Hide SMS Preview in iPhone OS 3.0”](https://www.idownloadblog.com/2009/06/25/hide-sms-preview/).
- Apple’s iPhone 4 document index identifies the contemporary iOS 4 guide family for the 2010 device: [Apple iPhone 4 manuals](https://support.apple.com/en-ph/docs/iphone/132927).

These sources corroborate the modal preview contract. They do not provide a provenance-controlled, native-resolution 8B117 screenshot suitable for exact pixel measurement.

### Tier 3 — VISUAL-CROSSCHECK

The earlier OldOS cross-check found only a later generic SwiftUI alert, not an SMS-specific `Close` / `View` implementation. It cannot establish geometry, colors, gradients, typography, or artwork and is not used to promote any finding to READY.

## Current implementation inventory

Current component: `src/device/SMSAlertOverlay.tsx`. Current chrome: `src/styles/device.css`.

| Property | Current implementation |
| --- | --- |
| Overlay bounds | full `320 × 480pt` screen (`inset: 0`) |
| Overlay dim | `rgba(0,0,0,.28)` |
| Alert width | `270pt` (`540px` Retina equivalent) |
| Alert height | content-dependent; no fixed value |
| Alert X | centered, therefore `25pt` at the current width |
| Alert Y | grid-centered, therefore `(480pt − rendered height) / 2` |
| Outer radius | `11pt` (`22px` Retina equivalent) |
| Outer border | `1pt solid #111827` |
| Body material | `rgba(31,42,58,.97)` |
| Shadow | `0 2pt 8pt rgba(0,0,0,.75)` |
| Global text shadow | `0 -1pt #000` |
| Title | HTML `<strong>`, `18px`, centered; padding `12 12 4pt` |
| Sender | HTML `<b>`, `15px`, independent centered line |
| Message | HTML `<p>`, inherited `14px`, centered |
| Help text | HTML `<small>`, always present, `12px`, `#d4d8df` |
| Actions | `43pt` high, equal two-column CSS grid |
| Buttons | `16px` bold HTML buttons, flat `#4e6583` background |
| Layering | overlay `z-index: 40`; shared status bar is `z-index: 30`, so the dim layer covers it |

The current dimensions are logical CSS pixels in the project’s 320 × 480 coordinate space. Retina equivalents above are simple 2× conversions, not historical measurements.

## Findings

### 1. Alert ownership and material

| Observation | Evidence | Classification |
| --- | --- | --- |
| The unlocked SMS interruption is a modal `SMSAlertSheet`/`UIAlertView`, not a banner. | Exact 8B117 class hierarchy and methods. | **READY** |
| The chrome belongs to SpringBoard/UIKit, not to MobileSMS. | `SBSMSAlertItem`; `SMSAlertSheet : UIAlertView`; no standalone MobileSMS alert panel identified. | **READY** |
| The alert uses the period UIKit alert visual family. | Direct UIKit superclass plus shared UIKit artwork archive. | **READY** at the family/owner level. |
| Exact background color, opacity, gradient stops/direction, texture, and translucency. | Not recoverable from class metadata or the unsigned artwork index alone. | **HOLD** |
| Purely raster-based versus purely code-drawn. | UIKit may combine packed stretchable artwork and runtime drawing/layout; constituent records are not yet semantically mapped. | **HOLD** |
| Current dark blue-gray `rgba(31,42,58,.97)` panel is exact. | Project CSS only. | **REJECT** as a historical claim; retain only as an acknowledged approximation until replaced by evidence. |
| Modern flat card, blur, glassmorphism, or iOS 5+ notification chrome. | Conflicts with the exact `UIAlertView` path and target era. | **REJECT** |

The period evidence describes a popup/alert, and later historical recollection describes the pre-iOS 5 alert as bluish, but neither is sufficient to derive exact CSS color or opacity.

### 2. Alert bounds and screen placement

The exact binary contains a custom layout routine with line-count, truncation, image, and tagline branches. The alert height therefore changes with content and cannot be represented honestly as one universal height.

| Property | Current | Verified target | Classification |
| --- | --- | --- | --- |
| Width | `270pt` / `540px` | Not measured from a provenance-controlled 8B117 frame | **HOLD** |
| Height | automatic | Content-dependent custom UIKit layout is verified; exact result for this payload is unknown | Dynamic behavior **READY**; numeric height **HOLD** |
| X | centered at `25pt` with current width | Modal centering is structurally consistent; exact width/X pair unknown | Centered relationship **READY**; `25pt` **HOLD** |
| Y | exact screen center | Exact vertical placement/bias not recovered | **HOLD** |
| Status Bar relationship | overlay spans and dims all 480pt | Status Bar must not move; exact dim coverage and alert-to-bar gap are not recovered | Fixed coordinate relationship **READY**; dim treatment **HOLD** |

No logical-point or Retina-pixel target should be promoted beyond these statements until an original 640 × 960 capture or a fully decoded UIKit layout path is available.

### 3. Corner treatment

- A rounded period `UIAlertView` outline is supported by the verified UIKit class family: **READY**.
- Exact outer radius: **HOLD**.
- Whether upper and lower radii differ, and the precise button-area corner clipping: **HOLD**.
- Current `11pt` radius: **REJECT** as an evidence-backed value; it is only a project approximation.
- A modern large-radius notification card: **REJECT**.

### 4. Border, highlight, and shadow

| Layer | Finding | Classification |
| --- | --- | --- |
| Outer border | Period alert chrome visibly requires edge separation, but exact width/color/alpha is not established by the recovered metadata. | Presence **READY** at family level; values **HOLD** |
| Inner highlight/gloss | Consistent with the period UIKit alert family, but no semantically identified 8B117 part or measured frame is available. | **HOLD** |
| Drop shadow | A modal separation shadow is plausible and period-consistent; exact presence and parameters for this sheet are not yet proven from original pixels. | **HOLD** |
| Current `1pt #111827` border and `0 2pt 8pt / .75` shadow | Arbitrary CSS values. | **REJECT** as historical constants |

No CSS `box-shadow`, gradient, or border value should be reverse-legitimized from the current rendering.

### 5. Title and sender structure

The localization result is more nuanced than a fixed three-line reconstruction:

| Item | Finding | Classification |
| --- | --- | --- |
| String `Text Message` | Exact English `SMS_ALERT_TITLE` value exists. | **READY** |
| Sender-aware strings | Exact `Text from %@`, two-line `Text from\n%@`, and `Text from Unknown` variants exist. | **READY** |
| Target alert always shows `Text Message` then a separate `Mom` line | Static evidence does not prove this branch. The sender-aware title variants directly show that SpringBoard can compose sender into the title region. | **HOLD** |
| Separate sender and body labels | The binary exposes tagline/body labels and name/address logic, but static metadata does not map every visible line for this exact payload. | Structural labels **READY**; exact line assignment **HOLD** |
| Title/sender font family, point size, weight, color, baseline, and padding | Not encoded in localized strings and not measured from an original frame. | **HOLD** |
| Long-name behavior | One-line and explicit two-line localized forms plus title line-count APIs prove adaptive wrapping. Exact truncation threshold is unknown. | Adaptive behavior **READY**; thresholds **HOLD** |

Consequently, the current `Text Message` + bold `Mom` + body structure must remain an approximation. It must not be cited as the recovered 8B117 layout.

### 6. Message body and help text

- Preview body display with Show Preview enabled: **READY**.
- `Good. Sleep early.` as the runtime payload: project narrative content, not historical system content.
- Exact body font, color, line height, maximum width, wrapping, and alignment: **HOLD**.
- Dynamic line-count and alignment handling: **READY**, established by `bodyTextAlignmentForAlertSheet:displayedLineCount:` and body max-line/truncation APIs.
- Exact help string `Touch View to see entire message`: **READY**.
- Help/tagline is conditional rather than an unconditional fixed line: **READY**, established by `_showingTagline`, `updateTagline`, and truncation/display-entire-message state.
- The exact condition under which the target short payload displays the helper: **HOLD** without runtime execution or instruction-complete control-flow recovery.
- Current unconditional helper rendering: **REJECT** as a faithful model of the dynamic alert, although the text itself is authentic.

### 7. Buttons

| Property | Finding | Classification |
| --- | --- | --- |
| Labels | `Close` and `View` are exact 8B117 localized strings for the SMS alert path. | **READY** |
| `Cancel` | Not the target standard SMS action label. | **REJECT** |
| Two actions at the alert bottom | Corroborated by exact alert callback/action path and period evidence. | **READY** |
| Close left / View right | Consistent with the classic cancel/action contract and period descriptions. | **READY** at control-order level |
| Equal-width buttons | Not directly measured for this target sheet. | **HOLD** |
| Button height, separator width/color, font, highlight/pressed state, gradient, gloss | Not recovered to exact values. | **HOLD** |
| Current flat `#4e6583`, `43pt`, `16px bold` HTML controls | Project approximation only. | **REJECT** as historical constants |

### 8. Background dimming and interruption hierarchy

- The SMS alert is modal and visually interrupts the current SpringBoard/app surface: **READY**.
- The underlying foreground owner remains in place rather than being replaced by MobileSMS until View is selected: **READY** behaviorally.
- Exact dim color/opacity, whether the Status Bar receives identical dimming, and whether UIKit applies any transition-specific alpha: **HOLD**.
- Current full-screen `.28` black overlay: **REJECT** as an exact historical value.
- Status Bar movement or layout reflow when the alert appears: **REJECT**. The shared Status Bar coordinate layer should remain fixed.

## Current versus target summary

| Area | Current implementation | Evidence-based target | Result |
| --- | --- | --- | --- |
| System model | Custom React modal | SpringBoard `SBSMSAlertItem` using `SMSAlertSheet : UIAlertView` | Structure broadly aligned; chrome not final |
| Body material | Single translucent CSS color | Period UIKit alert composition | Current value **HOLD/unsupported** |
| Geometry | Fixed width, centered CSS grid | Dynamic custom layout based on line count/truncation/tagline/image | Current fixed constants not verified |
| Title/sender | Three fixed lines | Multiple localized sender/title branches and adaptive line count | Current line assignment **HOLD** |
| Helper | Always visible | Conditional tagline | Current behavior **REJECT** for fidelity |
| Buttons | Equal flat CSS columns | Classic Close/View UIAlert controls | Labels/order **READY**; visuals **HOLD** |
| Dimming | Full-screen black `.28` | Modal suppression verified; exact composition unknown | Numeric value **HOLD** |

## Recommended future implementation changes

No implementation change is authorized by this audit. A later correction should:

1. Preserve the device-owned modal and exact `Close` / `View` behavior.
2. Model title/sender selection and tagline visibility as stateful branches rather than three unconditional HTML lines.
3. Decode or runtime-capture the 8B117 `UIAlertView` composition before replacing material, radius, border, shadow, button, or dim constants.
4. Measure an original 640 × 960 alert frame before assigning final width, height, X, Y, or typography.
5. Keep the shared Status Bar fixed; do not let the overlay alter its coordinates.
6. Never copy OldOS gradients, dimensions, assets, or SwiftUI values into the provenance chain.

## READY / HOLD / REJECT summary

### READY

- Modal pre-iOS 5 alert model.
- SpringBoard ownership and `SMSAlertSheet : UIAlertView` class family.
- Custom/dynamic layout rather than one fixed-height panel.
- Exact localized strings `Text Message`, `Close`, `View`, `Touch View to see entire message`, and sender-title variants.
- Conditional tagline capability.
- Dynamic title/body line handling and truncation detection.
- Two bottom actions with Close/View control relationship.
- Fixed Status Bar coordinate relationship.

### HOLD

- Exact alert width, height for this payload, X/Y, and vertical bias.
- Exact material color, alpha, gradient, texture, and raster/drawing split.
- Exact corner radius, border, inner highlight, and shadow.
- Exact title/sender/body line assignment for `Mom` in the target branch.
- All font metrics, colors, baselines, padding, wrapping thresholds, and truncation limits.
- Whether this short payload shows the helper line.
- Exact button geometry and pressed/highlight states.
- Exact dim coverage, opacity, and transition.

### REJECT

- iOS 5+ banners or Notification Center chrome.
- Modern notification cards, blur, glassmorphism, and large modern radii.
- Treating current CSS constants as Apple-original measurements.
- Unconditionally rendering the help tagline.
- Using `Cancel` instead of `Close` for the standard target alert.
- Promoting OldOS or another later reconstruction to historical evidence.

## Remaining unknowns

- Semantic map and cap-inset metadata for the exact `UIAlertView` records inside `Shared@2x~iphone.artwork`.
- Instruction-complete mapping from each SMS content branch to title, body, tagline, image, and button layout.
- A provenance-controlled iPhone 4 640 × 960 screenshot or video frame of this exact unlocked SMS alert state.
- Font identity/metrics and UIKit appearance values used by build 8B117.
- Exact target-payload height and whether `Good. Sleep early.` triggers the help tagline.

Until one of those gaps is closed, exact pixel and material claims remain HOLD.

