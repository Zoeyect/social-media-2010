# User Identity Session Loop v0.1

## Previous behavior

The root `Session` stored identity as the flat field `userName`. Battery shutdown cleanup deliberately copied that name into the post-shutdown session and set the phase to `poweredOff`. No transition returned that terminal session to Hero, so the experience ended at the powered-off device and the previous identity remained persisted.

Manual and battery shutdown originally shared the same undifferentiated `shutdown` phase. A later cause field made their triggers explicit, and Manual Power-Off Session Reset v0.2 establishes that both confirmed terminal paths end the current experience session.

## Shared identity source

Identity is now represented once at the root:

```ts
type SessionIdentity = {
  name: string;
};
```

The live value is `session.sessionIdentity`. `SessionIdentityContext` publishes that exact object, and future Facebook, Twitter, Instagram, Foursquare, or Messages modules may consume it through `useSessionIdentity()` rather than create app-specific copies.

An old persisted `userName` is accepted only as a migration input and converted to `sessionIdentity.name`. New state no longer writes a separate `userName` field.

## Session scope

The identity remains part of the root session across:

- lock and unlock;
- SpringBoard pages;
- application launch, suspension, and switching;
- Messages and notification flows;
- Camera and MobileSMS camera-picker ownership;
- sleep and wake.

It is not copied into any application state.

## Shutdown loop

Shutdown now records its cause:

```text
manual shutdown  → shutdown → poweredOff → Hero (identity cleared)
battery terminal → shutdown → poweredOff → Hero (identity cleared)
```

Both confirmed terminal paths use the existing 500 ms shutdown interval, enter a short black powered-off boundary that cannot be rebooted, and then restore `initialSession`. Exact powered-off-to-Hero transition timing is a functional experience value rather than a historical iOS behavior. Cancelling `powerOffConfirm` never enters this path.

Reloading while a battery-terminal shutdown or Hero return is pending also resolves to a fresh Hero session, so persisted state cannot rescue the previous identity from a completed run.

## New-session reset

The terminal cleanup resets:

- `sessionIdentity`;
- device clock epoch and battery lifecycle fields;
- scheduled device events;
- Messages runtime, draft, notification, and badge state;
- App Runtime;
- standalone Camera and MobileSMS camera picker;
- multitasking bar and Folder overlay;
- SpringBoard page to page 1;
- saved unlock return ownership and interaction revision.

Entering a new name creates a new `SessionIdentity`; `Zoey` from a completed session cannot flow into a later `Alex` session.

## Preservation

No battery curve, fifteen-minute timing, Messages UI, notification behavior, Camera runtime transition, Lock Screen geometry, Status Bar geometry, PNG, CAF, or historical asset was changed.
