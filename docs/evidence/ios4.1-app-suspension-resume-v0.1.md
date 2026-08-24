# iOS 4.1 App Suspension & Resume Behavior v0.1

## Scope and evidence standard

Target: iPhone 4, iOS 4.1, 20 October 2010. This is an audit and implementation recommendation only; no runtime or UI file is changed.

- **READY** — behavior established by Apple platform documentation applicable to the iOS 4 lifecycle.
- **HOLD** — project policy, timing, or application-specific behavior that requires target-bundle or runtime evidence.

Primary Apple evidence:

- Apple documents that pressing Home moves an iOS application to the background: [UIApplicationMain](https://developer.apple.com/documentation/uikit/uiapplicationmain%28_%3A_%3A_%3A_%3A%29-1yub7/).
- `UIApplicationExitsOnSuspend`, available from iOS 4.0, explicitly distinguishes normal background/suspension from opting into termination: [Information Property List Key Reference](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/iPhoneOSKeys.html).
- Apple describes background entry, eventual suspension, limited background-task completion, and foreground callbacks: [Energy Efficiency Guide — Work Less in the Background](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/EnergyGuide-iOS/WorkLessInTheBackground.html).
- Apple describes Home-button app switching as a list of recently used apps and notes that apps may run briefly before suspension: [Switch apps on iPhone](https://support.apple.com/en-us/118408).

The last support article describes later releases as well as the durable Home-button model. It supports the distinction between “recently used” and “currently executing,” but is not evidence for exact iOS 4 bar geometry or timing.

## 1. Home button behavior

### Historical behavior

For an iOS 4-aware application using the normal lifecycle, pressing Home does not imply destruction. The application moves from foreground active/inactive to background, receives a short opportunity to finish permitted work, and is then commonly suspended. A suspended process remains in memory but executes no application code. This default background/suspension path is **READY**.

Important exceptions:

- An app with `UIApplicationExitsOnSuspend = YES` terminates instead of remaining suspended.
- An app not built/adapted for the iOS 4 multitasking lifecycle may follow legacy termination behavior.
- An eligible app may continue limited work under one of the iOS 4 background services or a finite task-completion allowance before suspension.
- The system may terminate a background or suspended app under memory pressure. Suspension is therefore not a persistence guarantee.

The system-level distinction is **READY**. Eligibility for each proposed October 2010 Facebook, Twitter, Foursquare, Tumblr, Flickr, or Instagram build is **HOLD** until its exact bundle metadata and executable provenance are recovered.

### Current project behavior

Current single-Home behavior is:

```text
running
  → CLOSE
closing
  → animation complete
none + SpringBoard
```

`AppLaunchContainer` unmounts, `activeAppId` becomes null, and no retained runtime record remains. This models destruction, not iOS 4 fast app switching. It is a **HOLD implementation approximation** and should be corrected before application experiences depend on retained state.

## 2. Sleep behavior

Locking the display is not equivalent to choosing SpringBoard. The foreground app resigns active; ordinary work stops as the app moves to background/suspension unless it has a permitted background mode. When the device is awakened and unlocked, the previously foreground application normally returns to the foreground if its process survived. This lifecycle direction is **READY**.

It is not valid to promise memory survival through every lock interval. Under memory pressure, the process can be terminated; recovery then becomes a cold launch using whatever state the application itself persisted. Exact per-app restoration after termination is **HOLD**.

### Current project behavior

Both idle timeout and short Power currently change device phase from `app` to `sleeping`. An effect then dispatches app-runtime `RESET`, destroying `activeAppId`. Wake enters `locked`, and unlock always enters `springboard`. Therefore the project currently cannot resume the previously active app after lock. This diverges from the normal iOS 4 foreground restoration path.

## 3. Lock / unlock behavior

Recommended distinction:

```text
running
  → screen lock / idle lock
suspended (foreground owner retained)
  → unlock
resuming
  → running
```

The runtime should retain both the application identity and its in-memory experience state through the simulated lock. The Lock Screen must remain the visible wake destination, but successful unlock should restore the retained foreground owner rather than unconditionally selecting SpringBoard.

If the system deliberately models memory eviction while locked, the app should transition to `none`/terminated and later cold-launch; it must not claim byte-for-byte memory restoration. Eviction policy and per-application saved-state fidelity remain **HOLD**.

## 4. Multitasking Bar relationship

The iOS 4 bar should not be treated as a process monitor. It represents recently used applications in recency order. An icon can correspond to:

- the foreground application;
- an app briefly executing a permitted background task;
- a suspended in-memory process;
- a recent app whose process has already been terminated.

Consequently, “appears in the bar” and “is suspended” are not equivalent facts. Selecting an icon resumes/foregrounds a retained process when possible; otherwise it launches the application again. This behavioral distinction is **READY**. Exact October 2010 per-app eligibility and retained ordering are **HOLD**.

The current `MultitaskingBar` only derives one item from `appRuntime.phase === running`. It has no recent-app collection, suspended records, terminated-but-recent entries, or selection/resume callback. It also provenance-gates visual icons correctly, so current HOLD artwork remains invisible.

## 5. Runtime state recommendation

Recommended minimum foreground lifecycle:

```text
none
  → icon selection
launching
  → launch transition complete
running

running
  → Home or screen lock
suspending
  → lifecycle boundary complete
suspended

suspended
  → unlock or multitasking icon selection
resuming
  → foreground transition complete
running

running / suspended
  → explicit termination or simulated memory eviction
closing
  → transition complete
none
```

The user-requested six-state model can omit an explicit `suspending` visual phase if suspension is synchronous in the simulation:

```text
none | launching | running | suspended | resuming | closing
```

Recommended accompanying data:

- `activeAppId`: currently foreground or foreground-owned app;
- `suspendedApps`: retained runtime records keyed by app ID;
- `recentAppIds`: recency-ordered bar membership independent of process survival;
- `returnAfterUnlock`: `springboard` or an app ID;
- an explicit termination/eviction event distinct from Home.

`closing` should mean actual runtime termination or removal, not ordinary Home-button backgrounding. Application data persistence and suspended in-memory state should also remain separate concepts.

## 6. Project implementation impact

### `appRuntimeState.ts`

- Add `suspended` and `resuming`; optionally add `suspending`.
- Replace Home-triggered `CLOSE` with a suspension event.
- Retain `activeAppId` while suspended.
- Add resume and explicit termination/eviction events.
- Keep app-memory state separate from recent-bar membership.

### `App.tsx`

- Change single Home from destroy-and-reset to suspend-and-show SpringBoard.
- Stop resetting runtime merely because device phase becomes `sleeping` or `locked`.
- Record whether SpringBoard or an application owned the foreground before lock.
- On unlock, resume the retained app when appropriate; otherwise return to SpringBoard.
- Preserve the existing Lock Screen, Power, battery, and timer decisions while changing only the post-unlock destination.

### `MultitaskingBar.tsx`

- Consume a recency list rather than only the current `running` app.
- Allow entries for suspended and terminated-but-recent apps when their icons are READY.
- Route icon selection to resume or cold launch based on runtime state.
- Continue hiding HOLD icons without placeholders or click targets.
- Keep long-press removal separate from permanent app-data deletion.

## Current vs target summary

| Scenario | Current project | Recommended iOS 4.1 model | Classification |
| --- | --- | --- | --- |
| Home from app | Destroys runtime, returns SpringBoard | Background then suspend; SpringBoard visible | Historical behavior **READY**; correction pending |
| Idle/Power lock | Resets runtime | Retain/suspend unless evicted | Normal path **READY**; eviction policy **HOLD** |
| Unlock after app-owned lock | Always SpringBoard | Resume previous app if retained | Normal path **READY** |
| Bar membership | Current running app only | Recently used ordering, independent of exact process state | Historical distinction **READY** |
| Bar selection | Not implemented | Resume retained app or cold-launch terminated app | Behavior **READY**; transition details **HOLD** |
| Memory survival | No retained state | Suspended memory may survive but can be purged | **READY** non-guarantee |

## Remaining HOLD items

- Exact target IPA metadata and multitasking eligibility for each third-party app version.
- Exact iOS 4.1 transition timing between background and suspension.
- Memory-pressure/eviction policy for the 15-minute narrative simulation.
- Exact recent-app ordering and maximum retained collection for this experience.
- Cold-launch restoration fidelity for each future application.
- Multitasking-bar selection and termination animation geometry.

## Validation boundary

This audit adds only this evidence document. It does not modify application code, UI, app experiences, or assets.
