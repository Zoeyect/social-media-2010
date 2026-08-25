# Manual Power-Off Session Reset Fix v0.2

## Root cause

The power-off confirmation correctly set `shutdownReason: "manual"`, but the shared shutdown completion effect applied session reset only when the reason was `"battery"`:

```text
sessionIdentity = battery ? empty : existing identity
returnToHeroPending = battery only
```

Confirmed manual shutdown therefore retained identity, stopped at `poweredOff`, and remained rebootable into the same simulation session. A reload during the manual `shutdown` phase could also pass through runtime recovery and restore the previous identity because only battery reason/pending state was treated as terminal.

## Corrected routing

Trigger paths remain different:

```text
manual:  long Power → powerOffConfirm → Confirm → shutdown
battery: terminal condition → shutdown
```

Once `shutdown` is reached, both are completed-session boundaries:

```text
shutdown
  → transient runtime cleanup
  → short black poweredOff boundary
  → Hero
  → initial clean session
```

The reason remains recorded during the black boundary for diagnostics, but it no longer controls whether identity or runtime data is preserved.

## Cancel preservation

Cancel still performs only:

```text
powerOffConfirm
  → previousPhase
```

It never sets `shutdownReason`, never enters `shutdown`, and therefore never invokes terminal cleanup. Existing App/Messages ownership, identity, messages, draft, scheduler events, battery clock, and suspended state remain intact.

## Reset boundary

Confirmed manual shutdown now clears the same root and reducer state as battery completion:

- `sessionIdentity`;
- `sessionStartEpochMs`, battery lifecycle fields, and device events;
- Messages content, draft, Mom reply state, notification, and badge;
- App Runtime active/suspended/recent records;
- standalone Camera and MobileSMS camera picker;
- multitasking bar and Folder overlay;
- SpringBoard page;
- unlock return owner and temporary interaction state.

The powered-off boundary is non-interactive and cannot be used to reboot the completed session before Hero appears.

## Reload safety

A persisted root whose phase is already `shutdown`, or whose powered-off Hero return is pending, loads as `initialSession`. This prevents a refresh during either manual or battery shutdown from restoring the abandoned identity.

## Preservation

- Long-press timing is unchanged.
- `powerOffConfirm` visual chrome and Cancel behavior are unchanged.
- Battery curve and terminal timing are unchanged.
- Messages, Camera picker, Lock Screen, Status Bar, audio, PNG, CAF, and historical assets are unchanged.

## Result

```text
Zoey → Confirm manual power off → shutdown → black boundary → Hero
Alex → new clean session with no Zoey state
```
