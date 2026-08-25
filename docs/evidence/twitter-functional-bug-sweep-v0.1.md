# Twitter Functional Bug Sweep v0.1

## Result

No A-class architecture blocker or B-class functional defect was found by the
available build, reducer, state-transition, and source-boundary checks.

No Twitter or shared runtime code was changed during this sweep. Exact visual
chrome remains outside scope. A real browser was not available, so pointer,
scroll, Home-button, Power-button, and unlock-gesture behavior is recorded as a
manual acceptance gate rather than falsely reported as observed.

Freeze recommendation: **conditionally ready**. The implementation is ready for
freeze after the manual runtime matrix at the end of this document passes.

## Tests performed

### Build and repository checks

- `npm run build`: **PASS**
- TypeScript strict compilation: **PASS**
- Vite production build: **PASS**
- `git diff --check`: **PASS**
- Twitter icon remains absent from Social Folder production UI: **PASS**
- No modern Twitter/X feature or artwork added by this sweep: **PASS**

### Direct Twitter reducer sweep

Executed the real `twitterStateTransition` module with Node's TypeScript
stripping support. The test performed:

```text
create Zoey session state
→ set scrollPosition = 96
→ open apple-event tweet
→ Favorite tweet
→ Back
→ verify scroll and Favorite retained
→ reset as Alex
→ verify clean timeline/selection/scroll/Favorite state
→ verify exactly one Apple-related item
→ verify no “tomorrow” wording
```

Result: **PASS**.

### App Runtime integration sweep

Executed the real `appRuntimeStateTransition` and `twitterStateTransition`
modules together:

```text
launch Twitter
→ running
→ open/favorite a tweet
→ suspend Twitter
→ launch Messages
→ suspend Messages
→ resume Twitter
```

Verified:

- Twitter appears in retained/suspended app IDs;
- Messages uses the same App Runtime rather than creating a parallel runtime;
- Twitter becomes the active app again through `RESUME`;
- selected tweet and Favorite remain in the independent Twitter state;
- the App Runtime never imports or mutates Twitter content state.

Result: **PASS**.

## Functional matrix

### 1. Launch

| Check | Evidence/result |
| --- | --- |
| DEV-only route gated by `?devApp=twitter` | **PASS — source/build inspection** |
| Route absent from production | **PASS — `import.meta.env.DEV` guard** |
| Uses existing App Runtime `LAUNCH` | **PASS** |
| No second runtime | **PASS** |
| Shared Status Bar remains outside Twitter container | **PASS** |
| Messages/System stores untouched by launch | **PASS** |
| Actual click launch | **MANUAL — browser unavailable** |

The DEV control is explicit and device-external. No hidden SpringBoard click
target or unverified Twitter icon exists.

### 2. Timeline

The timeline is a deterministic array with newest-first ordering:

```text
12:11 AM
12:07 AM
12:01 AM
11:56 PM
11:48 PM
11:39 PM
```

This sequence is correctly descending across midnight. Stable tweet IDs are
used as React keys; ordinary rendering does not duplicate or reorder tweet
records.

| Check | Result |
| --- | --- |
| Timeline data renders through one `.map()` | **PASS — source inspection** |
| Deterministic chronological order | **PASS** |
| Content exceeds the timeline viewport | **PASS** |
| Vertical overflow enabled | **PASS** |
| Scroll event stores current position | **PASS — source/reducer** |
| Real pointer/touch scroll has no jump | **MANUAL** |

### 3. Tweet detail and Back

`OPEN_TWEET` first validates the requested ID against the existing timeline,
then stores the ID and scroll position. It does not copy or append a tweet.

`BACK_TO_TIMELINE` clears only `selectedTweetId` and changes the view. It retains
the timeline, scroll position, and interaction state. The mounted timeline
restores `scrollTop` from state in `useLayoutEffect`.

| Check | Result |
| --- | --- |
| Correct ID selects the correct tweet | **PASS — reducer test** |
| Invalid ID cannot create detail state | **PASS — reducer guard** |
| No duplicate tweet state | **PASS** |
| Back returns to timeline | **PASS — reducer test** |
| Stored scroll survives detail/Back | **PASS — reducer test** |
| DOM scroll visually restores exactly | **MANUAL** |

### 4. Favorite

Favorite IDs live only in `TwitterState.favoriteTweetIds`. Toggle uses an
ID-set-style add/remove operation and never dispatches Messages, SMS, Device,
Camera, Folder, Battery, Clock, or notification events.

| Check | Result |
| --- | --- |
| First tap adds Favorite | **PASS — reducer test** |
| Second tap removes Favorite | **PASS — reducer logic inspection** |
| Survives detail → Back | **PASS — reducer test** |
| Survives Twitter component unmount | **PASS — state owned by root reducer** |
| Survives Home/app switching/lock logically | **PASS — combined runtime test** |
| Visual pressed-state behavior | **MANUAL / C-polish** |

Reply and Retweet remain disabled `HOLD`; no behavior was added.

### 5. Suspension, resume, and app switching

Twitter has no custom suspension path. Generic Home, lock, and auto-sleep paths
dispatch the existing App Runtime `SUSPEND`. Root-owned Twitter state remains
mounted independently of `TwitterContainer`.

Reopening from SpringBoard through the DEV control sends the app through the
same generic `LAUNCH` path permitted for retained/suspended applications.
Selecting it through a future provenance-complete multitasking entry would use
the existing generic `RESUME` path.

State expectation:

```text
timeline view  → same view/scroll/Favorite
detail view    → same selected tweet/Favorite
```

Combined reducer result: **PASS**. Physical Home and multitasking interaction:
**MANUAL**.

### 6. Lock, sleep, and notification routing

#### Case A — ordinary unlock

Existing system flow captures `appRuntime.activeAppId` as
`unlockReturnAppId`, suspends the generic runtime, then resumes that retained ID
on ordinary unlock. No app allow-list excludes `twitter`.

Result: **PASS — source/state-path inspection**. Gesture observation: **MANUAL**.

#### Case B — SMS owns slide-to-view

While Twitter is suspended, the existing lock notification target routes to
`openMessagesConversation(true)`. The App Runtime `LAUNCH messages` transition
retains the previous Twitter app ID in `suspendedAppIds`. Twitter state is not
reset or mutated.

Result: **PASS — source/state-path inspection**. End-to-end 60-second locked
delivery and slide gesture: **MANUAL**.

The `activeLockNotification` reducer and replacement policy were not changed.

### 7. Session identity and reset

Twitter's user entry is seeded from the shared session identity. It does not
create a Twitter account/username store.

Both manual and battery shutdown enter the existing common `shutdown` effect,
which dispatches Twitter `RESET` alongside other ephemeral session cleanup.
The next Hero submission dispatches a second reset with the new display name.

Direct test:

```text
Zoey + selected tweet + scroll + Favorite
→ RESET(displayName: Alex)
→ Alex timeline
→ timeline view
→ no selected tweet
→ scroll = 0
→ no Favorites
```

Result: **PASS**.

Full manual-shutdown slider and 15-minute battery endpoint remain **MANUAL**;
their shared system behavior was not changed during this sweep.

### 8. Timeline copy invariant

Exactly one item contains an Apple-event reference:

```text
Wonder what Apple has planned for later today.
```

- Apple-related item count: **1 — PASS**
- Uses same-day anticipation: **PASS**
- Contains “tomorrow”: **no — PASS**
- Remaining five entries are unrelated everyday content: **PASS**
- Historical wording fidelity: **HOLD**, intentionally unchanged

### 9. Cross-app isolation

Static import and dispatch inspection confirms Twitter code depends only on:

- `TwitterState` / `TwitterEvent`;
- React rendering primitives;
- the generic App Runtime integration in `App.tsx`.

Twitter interaction does not dispatch into:

- Messages conversation or badge state;
- SMS notification or Mom scheduler;
- Camera runtime;
- Battery/session state;
- Folder state;
- Device clock;
- lock-notification ownership.

Result: **PASS**.

## Bugs

### A — Blocker / Architecture

None found.

### B — Functional

None found by build, reducer execution, combined-runtime execution, and source
boundary inspection.

### C — Polish / Cosmetic backlog

Recorded only; not fixed:

- exact October 2010 Twitter navigation chrome;
- Twitter icon provenance and production entry;
- exact font metrics and row/avatar geometry;
- avatar assets, currently omitted;
- precise gradients, shadows, separators, offsets, and animation timing;
- exact Favorite pressed/selected feedback;
- exact Reply/Retweet control chrome and behavior;
- fictional timeline wording provenance;
- interactive screenshots and pixel comparison.

## Manual runtime acceptance gate

No controllable browser was available during the sweep. Before tagging Twitter
v0.1, manually verify:

1. Start Vite and open `/?devApp=twitter`.
2. Enter `Zoey`, boot, unlock, and use `DEV · Open Twitter`.
3. Confirm the Status Bar does not move.
4. Scroll to a nonzero position, open a tweet, Favorite it, and Back.
5. Confirm the exact prior scroll position and Favorite state.
6. Open a detail again, Home to SpringBoard, and reopen from the DEV control.
7. Confirm the same detail and Favorite state.
8. Lock and ordinarily unlock; confirm Twitter restores.
9. Lock before the initial SMS arrives; use `slide to view`; confirm Messages
   opens while Twitter remains retained.
10. Return to Twitter and confirm state remains.
11. Confirm manual shutdown and battery terminal shutdown each return to Hero.
12. Start `Alex`; confirm no Zoey detail, scroll, or Favorite state remains.

Any failure in steps 2–12 is B-functional (or A if ownership/runtime is broken)
and blocks the tag. Pure pixel differences remain C-polish.

## Preservation confirmation

- SYSTEM FOUNDATION v1 state-machine behavior was not changed by this sweep.
- MESSAGES v1 code/state was not changed by this sweep.
- `activeLockNotification` replacement policy is unchanged.
- No modern Twitter/X behavior was added.
- No application or historical asset was added or modified.
