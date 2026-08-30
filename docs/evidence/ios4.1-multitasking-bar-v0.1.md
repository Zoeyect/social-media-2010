# iOS 4.1 Multitasking Bar Foundation v0.1

## Scope

This change adds a system-level iOS 4-style bottom multitasking bar foundation. It does not add application previews, cards, screenshots, swipe-up dismissal, application-specific behavior, or third-party UI.

## State model

The independent multitasking state machine is:

```text
closed
  → OPEN
opening
  → animation complete
open
  → long press a visible icon
editing

opening / open / editing
  → Home, sleep, lock, or lifecycle reset
closed
```

Editing is state-only. The delete control does not delete application data, uninstall an application, or terminate the runtime.

## Home button behavior

Double-press detection is active only while an application runtime is `running`:

- first Home release starts a 300ms **HOLD approximation** window;
- a second release inside the window cancels the pending single action and opens the bar;
- expiration performs the existing application close transition and returns to SpringBoard;
- one Home release while the bar is opening, open, or editing closes only the bar and preserves the current application.

The delay is necessary to distinguish the two physical-button gestures. It changes single-press timing by at most the unresolved detection window, not its final state transition.

## Layer structure

While open, the structure is:

1. existing application runtime and Status Bar;
2. absolute bottom overlay at system-layer Z=30;
3. black 320×96pt bar;
4. horizontal 59×74pt icon slots.

The bar uses no blur, screenshots, application cards, reflection, 3D transform, or modern switcher gesture. Its 96pt height, 180ms entrance duration, easing, and slide distance are **HOLD structural approximations** pending exact iOS 4.1 runtime evidence.

## Registry and icon rules

The bar reads the existing app runtime and the social-app registry in `springBoardSocialApps.ts`. An entry is eligible only when:

- it matches the currently running `activeAppId`;
- runtime phase is `running`;
- `iconStatus` is `READY`;
- `available` is true;
- an authentic `iconSrc` exists.

All current social icons remain HOLD. Therefore the bar foundation opens with no icon, label, placeholder, or fabricated target. No unavailable application is exposed merely to test the architecture.

The component includes the future long-press path and red-minus editing control, but neither is rendered while there is no READY retained icon. Exact historical delete-control artwork and icon compositor connection remain **HOLD**.

## Closing and lifecycle behavior

Closing the bar does not change `activeAppId`, app runtime phase, SpringBoard page, Folder state, Dock, or page-indicator state. Sleep and short Power continue through the existing device machine. Leaving the app phase resets the bar; wake continues to the existing Lock Screen, and unlock returns to the preserved SpringBoard page.

Power-off confirmation may temporarily cover the app and bar. Cancelling it restores both unchanged; confirming shutdown follows the existing reset path.

## READY / HOLD

### READY implementation behavior

- Separate `closed / opening / open / editing` state model.
- Double-Home arbitration without closing the running app on the second press.
- Bottom bar and horizontal slot architecture; no card switcher.
- Registry/runtime provenance gating.
- State-only long-press editing path.
- Home closes the bar while preserving the previous runtime.

### HOLD

- Exact double-press interval.
- Exact bar height, internal margins, icon spacing, and background artwork/composition.
- Entrance duration and UIKit animation curve.
- Exact edit-mode wobble and red-minus raster treatment.
- Background-process retention order beyond the single current runtime.
- Authentic icon rendering in the bar once a provenance-complete third-party icon exists.

## Preservation confirmation

- No application-specific behavior or third-party UI was added.
- No modern card switcher or swipe-up close behavior exists.
- No historical PNG was added or modified.
- Boot, Lock Screen, Status Bar, battery, Power machine, idle timer, SpringBoard navigation, Dock, Folder, and App Runtime reducer are unchanged.
