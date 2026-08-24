# iOS 4.1 App Suspension Runtime Correction v0.1

## Scope

This correction changes application runtime ownership and state transitions only. It adds no application experience, audio playback, artwork, or modern app-switching behavior.

Historical behavior established in `ios4.1-app-suspension-resume-v0.1.md` is treated as **READY**. Simulation-specific timing, eviction, and persistence choices remain **HOLD**.

## Old behavior

The previous runtime used:

```text
none → launching → running → closing → none
```

A single Home press dispatched `CLOSE`; leaving the app device phase reset the runtime. Sleep therefore lost `activeAppId`, and unlock always returned to SpringBoard. The multitasking bar could derive only the currently running app.

## Corrected state model

The runtime now uses:

```text
none | launching | running | suspended | resuming | closing
```

It also retains three distinct facts:

- `activeAppId`: the current foreground owner, including an owner retained while suspended;
- `suspendedAppIds`: in-memory runtime records not currently foreground;
- `recentAppIds`: recency order used by the multitasking relationship.

`closing` is retained for explicit termination. It is no longer the ordinary Home-button path.

## Corrected transitions

### Launch — READY

```text
none or suspended
  → LAUNCH(appId)
launching
  → animation complete
running
```

Launching another app retains the former foreground owner as suspended and moves the selected app to the front of the recent order.

### Home — READY behavior, HOLD timing

```text
running / launching / resuming
  → SUSPEND
suspended + retained activeAppId
  → SpringBoard on the existing page
```

The existing 300 ms single-versus-double Home recognition window is unchanged and remains a timing approximation. Double Home keeps the foreground application alive and opens the existing multitasking bar.

### Sleep and lock — READY

When an app owns the foreground, idle sleep or a short Power press records that app as the unlock return owner and dispatches `SUSPEND`. Runtime records are no longer reset merely because the visible device phase becomes sleeping or locked. The existing sleep, Power, Lock Screen, battery, and timer machinery remains responsible for the device transition.

### Wake and unlock — READY behavior, HOLD persistence

```text
retained app owner
  → Lock Screen unlock
resuming
  → animation complete
running
```

If no retained owner exists, unlock returns to SpringBoard as before. The owner marker is intentionally separate from the Lock Screen. It currently survives React state transitions but not a full page reload; durable reload restoration remains **HOLD**.

### Multitasking selection — READY relationship

The bar reads the recency list and intersects it with foreground/suspended runtime records. Selecting a retained record dispatches `RESUME`; the selected ID becomes foreground and is moved to the front of recency order. Any previously running owner becomes suspended.

Existing provenance rules still gate rendering: unavailable or HOLD-icon apps produce no icon and no placeholder. Terminated-but-recent cold launching is not implemented in this correction.

## Layer and system preservation

The shared application container remains above the device runtime surface and below the existing system overlays. `resuming` reuses the same short, flat 2D opening transition as `launching`; exact historical timing remains **HOLD**.

This correction does not alter:

- SpringBoard page state, icon geometry, Dock, or page indicator;
- Folder state, geometry, raster composition, or contents;
- Status Bar, Lock Screen artwork, battery curve, timeline, Power behavior, or sleep duration;
- audio architecture or playback;
- application UI or content;
- historical asset bytes.

## READY / HOLD

### READY

- Normal Home usage suspends rather than destroys the runtime.
- Sleep/lock retains a foreground owner.
- Unlock resumes a retained owner; otherwise it returns to SpringBoard.
- Recent ordering and suspended process records are represented separately.
- Multitasking selection can resume a retained runtime.

### HOLD

- Exact iOS 4.1 Home recognition and resume animation timings.
- Background-task grace periods and per-application multitasking eligibility.
- Memory-pressure eviction and cold-launch fallback.
- Durable suspended state and unlock owner restoration across a browser reload.
- Maximum recent-app capacity and terminated-but-recent bar membership.
- Exact third-party application registry entries while their icons remain provenance HOLD.

## Validation boundary

Validation requires `npm run build` and `git diff --check`. Repository asset paths must show no changes. No application UI, audio playback, generated artwork, or modern switching gesture is introduced.
