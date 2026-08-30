# iOS 4.1 shared software keyboard v0.1 evidence

## Target

- Device: iPhone 4
- OS/build family: iOS 4.1 (2010)
- Locale: en-US
- Orientation: portrait only
- Logical screen: 320 x 480 points; the status bar remains outside the app's 460-point runtime surface

## Sources

1. Apple, *iPhone User Guide (For iOS 4.1 Software)*, listed on the official 2010 iPhone 4 manuals page: <https://support.apple.com/es-co/docs/iphone/132927>. Direct Apple PDF: <https://cdsassets.apple.com/live/6GJYWVAV/user/locale/es-mx/ma1539_iphone_ios4_user_guide.pdf>.
2. Impress / Dekiru.net, “iPhone 4のキーボードを覚えよう,” published 2010-10-04: <https://dekiru.net/article/1571/>. The embedded screenshots show the raised light QWERTY caps, dark function caps, Shift/Delete silhouettes, `123`, globe, `space`, and `return` in the target hardware generation.
3. Impress / Dekiru.net, “iPhone 4のSMSやMMSでメッセージをやり取りするには,” published 2010-10-19: <https://dekiru.net/article/1590/>. This is contemporary evidence for the keyboard being system input below the Messages conversation/composer rather than app-themed chrome.
4. Engadget, “International keyboard changes in iOS 4,” published 2010-06-22: <https://www.engadget.com/2010-06-22-international-keyboard-changes-in-ios-4.html>. It documents that the globe appears beside Space after another international keyboard is enabled.
5. Apple UIKit documentation, `UITextField`, keyboard traits, Return-key configuration, first-responder show/dismiss behavior, and UI adjustment when the keyboard obscures content: <https://developer.apple.com/documentation/uikit/uitextfield>.
6. Apple *iOS Human Interface Guidelines* 7.4-era metric table mirror, keyboard height 216 points on the original-resolution iPhone coordinate system: <https://developer.bag-xml.com/assets/docs/MobileHIG.pdf>. This mirror is supporting evidence only; the value is consistent with UIKit's historical portrait keyboard frame.

## Evidence classification

### CONFIRMED

- The portrait English keyboard uses three QWERTY letter rows and a bottom function row.
- Alphabet key legends remain uppercase while Shift controls the case of inserted text.
- The alphabet page exposes Shift, Delete, `123`, Space, and Return.
- `123` switches to numbers/punctuation and `ABC` returns to alphabet input.
- Letter caps are light raised gray; the backing and function caps are darker gray; labels are dark on letter keys and light on function keys.
- The portrait keyboard consumes 216 points of vertical app space on the 320-point-wide iPhone layout.
- UIKit lets the active text surface select a Return-key role and requires the app view to respond to the keyboard frame so the editor stays visible.
- A globe is conditional on additional enabled keyboards. It is not an unconditional en-US key.

### PROBABLE

- The standard iOS 4 numbers page also exposes the secondary `#+=` symbol page. It is retained because it is part of the contemporary standard layout, not as a later feature.
- Search/Send action keys use the same keyboard system and a blue-emphasized Return cap when configured by a text surface.
- A press sound uses the existing recovered iOS 4.1 `Tock.caf` system sound.

### RECONSTRUCTED

- Total frame: 320 x 216 points.
- Internal layout: four 50-point row bands, 6-point top inset, 2-point band gaps, and 42-point visible keycaps.
- QWERTY row gaps are 3 points; the second row uses a 14-point horizontal inset.
- Third-row Shift and Delete caps are 42 points wide. The no-globe bottom row uses 54 points for `123`/`ABC`, a flexible Space cap, 70 points for Return/action, and 5-point gaps.
- The frame transition is a conservative 210 ms ease-out slide/resize. Exact iOS 4.1 animation timing was not isolated from the available evidence.
- The symbol-page punctuation set and currency ordering are a conservative reconstruction of the standard Latin keyboard.
- SMS `send` Return behavior is reconstructed around the project's existing single-line Messages draft model. The surrounding recovered Messages Send button remains authoritative.
- Key gradients, border softness, shadows, and font optical alignment are CSS reconstructions from the contemporary screenshots; no later blur, flat caps, safe-area treatment, or suggestion row is used.

### HOLD

- Magnified key-preview artwork and its exact iOS 4.1 release timing/geometry. Contemporary system behavior supports previews, but the available cropped evidence is insufficient for a pixel-safe bubble in v0.1.
- Full autocorrection, replacement bubbles, dictionary state, and double-space punctuation.
- Double-tap Shift / Caps Lock.
- Long-press alternates and international-keyboard selection UI.
- Text-selection loupe, copy/paste menu, and arbitrary drag selection.
- Landscape, email, URL, phone, password, emoji, Japanese, and other keyboard layouts.

## Runtime architecture

`IOS4KeyboardSystem` is mounted once inside the device app-runtime surface. It owns one active registration, visibility, input type, Return role, letter/number/symbol mode, Shift state, text snapshot, and caret-aware edits. `IOS4Input` and `IOS4Textarea` register existing app-controlled values and callbacks; app reducers remain the source of truth.

The visible app viewport changes from 460 to 244 points when the 216-point keyboard is open. The device shell, status bar, and app header are not scaled. Flex/grid app roots inherit the reduced viewport so bottom composers remain directly above the keyboard; the nearest authoritative scroll container is adjusted only when a focused control would otherwise be clipped.

The host fields use `inputmode="none"` to suppress a mobile browser keyboard where supported while remaining real focusable controls. Desktop physical-keyboard edits continue through normal React change handlers. Browser support for suppressing the host keyboard is an environment limitation, not an app-specific fallback keyboard.

The keyboard is destroyed outside device app phase and explicitly suspended for the multitasking tray and camera picker. Route changes unmount their registered input, which clears ownership. Home, app switching, sleep, lock, shutdown, and session reset therefore cannot leave the keyboard above system UI.

## Dismissal semantics

| Behavior | Classification | v0.1.1 decision |
| --- | --- | --- |
| A text field becomes first responder and the keyboard appears | PERIOD-EVIDENCE / UIKit | Every shared input registers on focus. Auto-focused controls also verify/register ownership during layout so focus cannot exist without the simulated keyboard. |
| Return can resign first responder when the app handles it | PERIOD-EVIDENCE | Search/action fields may submit or end editing and dismiss with reason `submit`. Multiline Return inserts a newline and retains ownership. |
| An arbitrary outside tap automatically dismisses the system keyboard | REJECTED AS UNIVERSAL SYSTEM RULE | No document, screen, app-background, or generic pointer listener closes the keyboard. |
| An app may explicitly resign first responder on a supported background action | PERIOD-EVIDENCE / APP-SPECIFIC | Reserved for a surface with explicit evidence; none is generalized in v0.1.1. |
| Navigation/unmount ends editing | IMPLEMENTATION-CANON / PERIOD-CONSISTENT | Registered input cleanup closes with `navigation`; app switching, multitasking, and camera takeover use explicit lifecycle reasons. |
| Drag or scroll dismisses the keyboard | NOT ADOPTED / insufficient target-period basis | No system-wide drag-to-dismiss or `keyboardDismissMode` behavior is implemented. |

Dismissal reasons are typed as `submit`, `cancel`, `navigation`, `device-home`, `app-switch`, `lock`, `sleep`, `shutdown`, `session-reset`, `input-switch`, or `explicit`. There is deliberately no `tap-anywhere` reason. Switching directly between registered inputs changes owner and Return label without first setting keyboard visibility false.

## Integration matrix

| App / surface | Editable control | Shared owner | Return type | Integrated |
| --- | --- | --- | --- | --- |
| Facebook Home Search | single-line input | `facebook-home-search` | search | yes |
| Facebook Friends Search | single-line input | `facebook-friends-search` | search | yes |
| Facebook Pages Search | single-line input | `facebook-pages-search` | search | yes |
| Facebook News Feed status | textarea | `facebook-status` | return/newline | yes; auto-focus invariant |
| Facebook Comments Detail | single-line input | `facebook-comments-{story}` | return / existing Post form | yes |
| Facebook Feed comment editor | textarea | `facebook-feed-comment-{story}` | return/newline | yes |
| Facebook Photo comment editor | textarea | `facebook-photo-comment-{story}` | return/newline | yes |
| Facebook Chat | single-line input | `facebook-chat-{peer}` | send | yes; continuous compose |
| Facebook Inbox reply | textarea | `facebook-inbox-{thread}` | return/newline | yes |
| Facebook Places status | textarea | `facebook-place-{venue}` | return/newline | yes |
| Messages / SMS compose | single-line input | `messages-compose` | send (reconstructed) | yes; continuous compose |
| Twitter tweet / reply | textarea | `twitter-compose` / `twitter-reply-{tweet}` | return/newline | yes; explicit header Send |
| Foursquare check-in shout | textarea | `foursquare-shout-{venue}` | return/newline | yes |
| Flickr comment | textarea | `flickr-comment-{photo}` | return/newline | yes |
| Tumblr optional reblog text | textarea | `tumblr-reblog-{post}` | return/newline | yes |
| Instagram | no current editable control | n/a | n/a | not invented |

Foursquare Search/tips, Twitter Search, Instagram comments/captions, and Facebook Notes inputs are not currently implemented controls, so this pass does not invent them.
