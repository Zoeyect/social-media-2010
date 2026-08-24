# iOS 4.1 App Launch Container v0.1

## Scope

This change establishes one shared application-runtime boundary between SpringBoard and all future social applications. It does not add a third-party icon, application screen, loading message, placeholder, or interaction surface.

## State model

Application runtime state is independent of the device session state:

```text
none
  → LAUNCH(appId)
launching
  → animation complete
running
  → Home / CLOSE
closing
  → animation complete
none
```

The state retains only `activeAppId` while an application is launching, running, or closing. `RESET` clears runtime state when the existing device lifecycle leaves its `app` phase through sleep, locking, or shutdown. A Power-off confirmation temporarily covers the app without clearing it, so cancelling that existing flow can return to the same runtime.

## Registry connection

Each entry in `socialFolderApps.ts` now supplies:

- stable application `id`;
- application name;
- icon READY/HOLD status;
- provenance statement;
- narrative installation state;
- visual availability;
- future launch target (`social-app-runtime`).

Architecture does not require a READY icon: the launch callback accepts an application ID independently. Visual activation remains provenance-gated. A Folder icon and click target are emitted only when `iconStatus === READY`, `available === true`, and an authentic `iconSrc` exists. All six current third-party entries remain invisible and non-interactive.

## Container layering

The shared container occupies `(0,0,320,480)` logical points / `(0,0,640,960)` Retina pixels inside the existing device screen.

Layer order while active:

1. application container root;
2. existing Status Bar renderer at Y=0–20;
3. empty application runtime surface at Y=20–480.

The surface is deliberately empty and black. There is no browser chrome, card, rounded panel, application title, loading text, or fabricated UI.

## Launch and close flow

The generic SpringBoard callback dispatches `LAUNCH(appId)` and enters the already-existing device `app` phase. The container's launch animation completion advances the reducer to `running`.

When Home is pressed during `launching` or `running`, the reducer enters `closing`. Animation completion resets application state and restores the device to `springboard`. `springBoardPage` is independent state and is not changed, so the current page is preserved. Folder, Dock, and page-indicator state are not rewritten by the application reducer.

The container uses only opacity and a flat 2D scale. Open duration 180ms, close duration 160ms, scale `.94 ↔ 1`, and CSS easing are **HOLD functional approximations** pending verified iOS 4.1 runtime evidence. There is no spring, bounce, blur, parallax, or 3D transform.

## Sleep and device lifecycle

The existing device machine remains authoritative:

- its `app` phase remains eligible for the existing 60-second idle sleep;
- short Power and idle timeout still transition `app → sleeping`;
- waking still enters the existing Lock Screen path;
- unlocking returns to the preserved SpringBoard page;
- runtime state is reset after leaving `app`, preventing an application surface from reappearing after unlock.

No battery, timer, Power, Lock Screen, boot, shutdown, or persistence rule was redesigned.

## Remaining HOLD items

- Verified iOS 4.1 launch and close duration, scale, opacity curve, and UIKit easing.
- Icon-origin expansion geometry once a provenance-complete launchable icon exists.
- Application-specific runtime renderers and content.
- Runtime restoration policy if a later experience requires resuming directly into an application.

## Preservation confirmation

- No third-party UI or generated artwork was added.
- No historical PNG was added or modified.
- SpringBoard page geometry/navigation, Dock, and page indicator are unchanged.
- Folder reducer, raster composition, geometry, and animation are unchanged.
- Existing device lifecycle decisions remain in `deviceMachine.ts` unchanged.
