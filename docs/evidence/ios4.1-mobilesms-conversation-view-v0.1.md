# iOS 4.1 MobileSMS Conversation View v0.1

## Scope

This change adds conversation rendering beneath the existing MobileSMS navigation container. It does not add a composer, input, keyboard, Send control, avatars, timestamps in the UI, read receipts, typing indicators, iMessage behavior, or modern chat features.

## Initial narrative state

The first open state contains only the delivered incoming SMS:

```text
Mom

[incoming gray bubble]
Home yet?
```

`Got home` is not pre-seeded. The outgoing bubble renderer and state shape exist for the future input task, but an outgoing message appears only after a real `SEND` event. No control in this version can dispatch that event.

## Message data model

Messages are stored as ordered objects:

```ts
{
  id,
  sender,
  text,
  direction: "incoming" | "outgoing",
  timestamp: string | null,
  status: "unread" | "read" | "sent"
}
```

The delivered `Home yet?` payload becomes:

```text
sender: Mom
direction: incoming
status: unread → read when the conversation opens
timestamp: null
```

Timestamp storage is present but remains null until the shared device timeline is connected in a later task. No timestamp is fabricated or rendered.

The retained future reducer path creates an outgoing `sent` object only after `SEND`, and the later Mom reply becomes another incoming object. Neither path is reachable from the v0.1 conversation UI.

## Conversation rendering

The conversation surface:

- fills the application area below the existing 44pt navigation bar;
- scrolls vertically when message content exceeds the surface;
- clips horizontal overflow;
- preserves message order;
- uses natural 9pt vertical separation;
- constrains bubble width to 226pt;
- aligns incoming bubbles left and outgoing bubbles right.

The scroll surface is exposed as an accessibility log. Each bubble carries its state as `data-message-status`; status is not rendered as modern read-receipt UI.

## Bubble system

### Incoming

- left aligned;
- neutral gray/silver structural treatment;
- dark neutral border;
- no avatar or sender badge inside the transcript.

### Outgoing

- right aligned;
- green SMS structural treatment;
- green border;
- never blue.

The current CSS models the broad iOS 4-era bubble distinction. Exact 8B117 MobileSMS balloon rasters, cap insets, tails, gradients, border pixels, shadows, font rasterization, padding, and maximum width remain **HOLD**. The CSS must not be classified as recovered Apple artwork.

## Integration

```text
SMS notification View / Lock Screen slide to view
  → notification: viewing
  → App Runtime launches/resumes Messages
  → Messages view becomes conversation
  → delivered message marked read / Badge cleared
  → notification: opened
  → Mom conversation rendered
```

The existing SMS notification reducer, source selection, audio dispatch, Badge rules, Lock Screen behavior, and App Runtime transitions are unchanged. `App.tsx` now resolves the delivered message ID from the ordered message collection when committing read state.

No keyboard is focused or opened automatically.

## Files changed

- `src/state/messagesState.ts` — ordered message-object model.
- `src/device/MobileSMSContainer.tsx` — conversation scroll/bubble rendering.
- `src/styles/device.css` — conversation surface and incoming/outgoing bubble layout.
- `src/device/App.tsx` — read-state lookup updated for the message collection.
- this evidence document.

## Confirmation

- No keyboard or input control.
- No Send button or sent-message audio trigger.
- No new visual/audio asset.
- No avatar, read receipt, typing indicator, emoji, blue bubble, or iMessage UI.
- No Status Bar, Lock Screen geometry, notification presentation, Audio registry, or App Runtime state-machine change.
- Initial conversation contains only `Mom: Home yet?`.

## HOLD

- Authentic bubble raster/cap-inset composition and exact geometry.
- Device-timeline timestamp assignment and historical timestamp grouping rules.
- Composer, keyboard, Send button, user-triggered `Got home`, and later Mom reply interaction.
