# Twitter Footer Stability and Live Follower Drift v0.6.5

## Result

The Twitter tab bar now occupies one invariant shell row across every view. Eligible public-account follower counts also receive a quiet deterministic session-local drift derived from simulated device time, without timers or scheduler events.

## Footer root cause

The Twitter container previously used a column flex layout, while the new Mentions and DM content surfaces used absolute positioning. Those surfaces no longer consumed the flexible content height, so the following tab bar could rise directly beneath the navigation bar and appear detached from the bottom.

## Stable app shell

The 320×460pt Twitter application surface now uses three explicit grid rows:

- navigation: 44pt;
- bounded content: `minmax(0, 1fr)` / 367pt;
- tab bar: 49pt, beginning at application Y=411pt.

Header is assigned to row 1, every direct content section to row 2, and tab navigation to row 3. Mentions and DM thread/list surfaces now participate in row 2 rather than using viewport-like absolute insets. Long content scrolls inside that row; short or empty content cannot move the footer.

This rule applies equally to Timeline, Mentions, Messages, Search, Suggested Users, Profile, Following, Tweet Detail, Composer, and HOLD shells. No margin or content-height compensation is used.

## Live follower drift model

Displayed eligible Profile followers are:

`baselineFollowerCount + currentUserFollowDelta + liveFollowerDelta`

- baseline retains its existing `EXACT`, `NEAR-DATE`, `ESTIMATED-DISPLAY`, or `CURATED-FILL` evidence metadata;
- current-user Follow delta remains the v0.6.3 `-1 / 0 / +1` relationship layer;
- live drift is `CURATED SIMULATION`, not a historical record.

Only the 20 real/public Suggested User accounts are eligible. Fictional Timeline, Mention, and DM identities always receive zero drift.

## Deterministic PRNG rule

For every completed simulated second, an FNV-1a-style stable 32-bit hash is calculated from:

`session identity seed | account ID | simulated second`

An account participates only when its hash falls into a 20% selection bucket. With 20 eligible accounts this changes a small subset each second rather than every account. Selected updates use a weighted deterministic distribution:

- 70% bucket: `0…+8`;
- 23% bucket: `-1…-5`;
- 7% bucket: `+9…+20`.

Cumulative per-account drift is capped at ±500 for the 15-minute session. Counts remain bounded by their large positive public-account baselines.

The selector clamps elapsed time to `0…900` seconds. At T0 drift is zero. The same identity/account/second always reproduces the same result, so rendering has no `Math.random()`, flicker, or stored mutation.

## Lifecycle behavior

The Twitter container derives elapsed seconds from the existing `currentDeviceDateTime` and shared `SESSION_START_ISO`. It creates no interval, timeout, device event, or scheduler registration. Therefore lock, sleep, suspension, and later resume naturally show the count corresponding to the current shared simulated time.

A new session returns to simulated T0, where drift is zero. Previous accumulated values are not stored and cannot leak between sessions.

## Verification

- public NASA drift is zero at T0, nonzero later, and deterministic on repeated selection;
- fictional June drift remains zero;
- the same elapsed drift combined with Follow/Unfollow differs by exactly one;
- the 900-second public-account drift respects the ±500 cap;
- CSS assertions verify the fixed `44px / minmax(0,1fr) / 49px` shell, tab bar row 3, and bounded social-list scrolling.

Browser screenshot/pixel measurement was not performed. Exact historical follower volatility and the chosen ±500 cap remain CURATED/HOLD; no visual animation was added.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Global scheduler architecture/timings, System Foundation, other apps, battery, and lock routing were not modified.
