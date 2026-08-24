# iOS 4.1 SpringBoard Folder Container v0.1

## Implemented foundation

- Four-state folder model: `closed`, `opening`, `open`, `closing`.
- `OPEN`, `CLOSE`, and `ANIMATION_COMPLETE` transitions.
- SpringBoard overlay layer above pages, indicator, and dock.
- Minimal dark translucent structural panel without blur, gradient, texture, or replacement artwork.
- Flat 2D open/close animation using only opacity and scale.
- Empty three-row, four-column internal grid using 59×74 presentation slots.
- Outside-panel close handling for the future reachable `open` state.

## Deliberate HOLD boundary

There is no active Folder icon and no `OPEN` event source. This is deliberate: Page 1 and Page 2 remain unchanged, and no click target exists without a corresponding SpringBoard element. A later provenance-controlled Folder Icon Integration task must supply the verified icon, its page position, and its on-screen origin before opening can become reachable.

Because no Folder icon origin exists yet, origin-bound translation from that icon is also **HOLD**. The foundation supplies the short flat scale/opacity transition and centered container, but does not fabricate an origin coordinate.

Authentic Folder interior/background artwork and its exact 8B117 composition remain **HOLD**. The current panel is structure only and must not be treated as recovered artwork.

## Preserved behavior

- Page 1 and Page 2 slot registries are unchanged.
- Page navigation state and swipe handlers are unchanged.
- Dock geometry and contents are unchanged.
- No icon, label, placeholder, hidden click target, or historical asset was added.
- Device state, Home/Power behavior, sleep timer, Lock Screen, Status Bar, Battery, and boot sequence are unchanged.
