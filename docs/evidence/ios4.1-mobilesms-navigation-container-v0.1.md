# iOS 4.1 MobileSMS Navigation Container v0.1

## Scope

This change creates only the MobileSMS application shell. Conversation rows, bubbles, timestamps, composer, keyboard interaction, Send behavior, and conversation copy are deliberately absent.

The existing SMS notification, Badge, App Runtime, suspension/resume, Lock Screen, and Audio systems remain authoritative.

## Container structure

```text
shared device Status Bar
MobileSMS navigation bar
empty MobileSMS content surface
```

The shared App Runtime continues to reserve the top 20pt Status Bar relationship. The MobileSMS container occupies the existing 320×460pt application surface beneath it.

## Navigation states

### Application list context

Launching Messages normally presents:

```text
Messages
────────
[empty content surface]
```

The title is centered in the 44pt navigation bar.

### Notification conversation context

The existing SMS View / Lock Screen slide-to-view action still dispatches `OPEN_CONVERSATION` before launching or resuming Messages. The shell therefore presents:

```text
Messages     Mom
────────────────
[empty content surface]
```

`Messages` is the back-navigation label and `Mom` is the target conversation title. Returning changes only the existing Messages navigation state; it does not change notification, Badge, Audio, or device lifecycle state.

No input receives focus, so notification entry does not open a keyboard.

## Navigation chrome

Implemented structural values:

- navigation bar height: 44pt;
- centered white title with dark lower text edge;
- pre-iOS-7 blue, vertically modeled chrome;
- left back control at x=7pt, y=7pt, h=30pt;
- white application content surface below the bar.

The blue chrome reuses the project's existing structural CSS treatment. No raster, SVG, icon, SF Symbol, or generated image is added. Exact 8B117 MobileSMS navigation-bar rasters, cap insets, title font metrics, back-button silhouette, colors, gloss, and pixel geometry remain **HOLD** and are not claimed as recovered Apple artwork.

## Content boundary

The runtime DOM contains only `mobilesms-content-surface` beneath the navigation bar. Removed from the active MobileSMS implementation:

- conversation-list rows;
- incoming/outgoing message bubbles;
- Mom narrative messages;
- timestamps;
- text input;
- keyboard sound dispatch;
- Send button and sent-message sound dispatch.

The underlying Messages reducer and delivered SMS content are retained for later UI work; they are not rendered by this container.

## Integration preservation

```text
SMS alert View / slide to view
  → notification state: viewing
  → existing App Runtime launch/resume
  → Messages conversation navigation state
  → MobileSMS shell
  → notification state: opened
```

The existing effect still marks the SMS read only after the conversation navigation state becomes active. This task does not change that lifecycle.

## READY / HOLD

### READY

- Shared Status Bar above a dedicated application surface.
- 44pt blue navigation-bar structure characteristic of the target-era UIKit hierarchy.
- Center-title and left-back-control relationship.
- Normal Messages title and targeted Mom conversation navigation contexts.
- Empty content surface and keyboard-hidden notification entry.

### HOLD

- Exact 8B117 navigation/background assets and cap-inset composition.
- Exact title/back-button fonts, gradients, borders, gloss, shadows, dimensions, and baselines.
- Conversation list and transcript UI, including all content geometry and artwork.

## Files changed

- Added `src/device/MobileSMSContainer.tsx`.
- Removed the content-bearing `src/device/MessagesExperience.tsx`.
- Updated the Messages runtime mount in `src/device/App.tsx`.
- Replaced unused conversation/content CSS with container/navigation/empty-surface rules in `src/styles/device.css`.
- Added this evidence document.

## Validation boundary

- No historical asset bytes are added or modified.
- No generated image artwork is introduced.
- No notification, Badge, Audio, Lock Screen, suspension, or App Runtime reducer is changed.
- No conversation content UI is implemented.
