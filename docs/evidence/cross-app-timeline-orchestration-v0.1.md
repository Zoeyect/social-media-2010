# Cross-App Timeline Orchestration v0.1

## Result

One scheduler now coordinates the existing app slices from the device session clock that begins when boot completes and the Lock Screen appears. The scheduler changes app-owned state through semantic reducer events. It does not render app UI, manufacture notifications, or create a second clock.

Production time remains 1:1. No time acceleration or timeline debug surface was added in v0.1.

## Global schedule

All exact timings and fictional content below are **CURATED / HOLD**, not historical claims. The existing pre-iOS 5 SMS delivery mechanism remains **HISTORICAL READY** to the extent recorded in the SMS evidence documents.

| Elapsed | Device time | Stable event ID | App | State effect | Delivery policy |
| ---: | --- | --- | --- | --- | --- |
| T+60s | 12:03 AM | `initial-sms-mom-home-yet` | Messages | Add `Mom / Home yet?`, unread + badge | Existing SMS notification path |
| T+150s | 12:04:30 AM | `facebook-jack-request` | Facebook | Jack request becomes `pending` | Internal, silent |
| T+270s | 12:06:30 AM | `facebook-june-message` | Facebook | June message becomes `unread` | Internal, silent |
| T+390s | 12:08:30 AM | `twitter-late-night-update` | Twitter | Add one deterministic late-night tweet | Internal, silent |
| T+510s | 12:10:30 AM | `foursquare-friend-checkin` | Foursquare | Add one activity record and increment the local unread activity count | Internal, silent |
| T+630s | 12:12:30 AM | `tumblr-background-post` | Tumblr | Add one quiet text post | Internal, silent |

Instagram receives no timeline event. Its zero-photo, zero-follower, zero-following state remains intentional.

Tumblr was selected instead of Flickr for the single quiet background update because a text-only post can reuse the existing verified functional dashboard model without introducing unverified photography or new raster provenance. Flickr remains unchanged.

## Architecture

`src/data/sessionTimeline.ts` is the centralized narrative definition. It supplies event ID, elapsed-time boundary, source app, semantic type, payload, delivery policy, and provenance classification.

The existing `DeviceEventScheduler` remains the only scheduler:

```text
sessionStartEpochMs
        ↓
sessionTimeline definitions
        ↓
DeviceEventScheduler
        ↓
semantic reducer action
        ↓
app-owned state
```

Implemented adapters are reducer actions:

- Facebook: `DELIVER_JACK_REQUEST`, `DELIVER_JUNE_MESSAGE`
- Twitter: `DELIVER_TIMELINE_TWEET`
- Foursquare: `DELIVER_SOCIAL_ACTIVITY`
- Tumblr: `DELIVER_BACKGROUND_POST`

Messages continues through `smsMessageReceived`. The existing dynamic `momReply` event remains on the same scheduler and is not part of the fixed session timeline.

## App timing boundaries

Facebook now starts with `friendRequestState: none` and `juneMessageState: none`. Its existing request and message rows become available only after their semantic delivery events. Opening Facebook early does not reveal Jack or June; leaving it open at the due boundary updates the reducer state without reloading the app.

Twitter inserts the scheduled tweet idempotently and keeps deterministic chronological ordering. The scheduled tweet contains no Apple-event reference, so the existing single Apple-related item remains the only one.

Foursquare stores one local activity record plus an unread count. It does not auto-check-in the user, award points or badges, change mayor state, or expose a new UI surface.

Tumblr appends one text post. It does not notify, sound, or take foreground ownership.

## Idempotency and catch-up

Exactly-once delivery has three guards:

1. The scheduler rejects duplicate scheduled IDs.
2. `deliveredTimelineEventIds` records completed fixed-timeline events in session state.
3. An in-memory claim set prevents React effect replay from dispatching the same semantic event twice before the session update commits.

When elapsed time jumps forward, the earliest due event is delivered and removed. The next render repeats this for every remaining due event. Internal events catch up silently; they are not replayed as a sequence of alerts. Stable IDs and reducer-level duplicate checks protect app state during catch-up.

## Lock, sleep, and notification boundary

The scheduler reads the shared elapsed clock and is independent of current surface, user input, Home, app ownership, Lock Screen, and sleep. Internal Facebook, Twitter, Foursquare, and Tumblr events do not wake the device and never write `activeLockNotification`.

Messages preserves the existing behavior: the initial SMS may wake a sleeping device, use the locked preview or unlocked alert, play the verified SMS sound, and update the Messages badge. The exact cross-app notification replacement policy remains **HOLD** and is intentionally not exercised here.

## Reset behavior

Confirmed manual shutdown and terminal battery shutdown already pass through the shared `shutdown` phase. That phase now also clears the in-memory delivery claims; `initialSession` clears scheduled events and `deliveredTimelineEventIds`. Existing app reducer resets clear all delivered local state. A new identity therefore receives a fresh schedule beginning at T+0.

## Evidence classification

| Item | Classification | Rationale |
| --- | --- | --- |
| Shared clock begins at Lock Screen availability | HISTORICAL/PROJECT READY | Existing frozen session-clock boundary |
| Pre-iOS 5 SMS alert/lock-preview delivery path | HISTORICAL READY | Existing audited Messages system path |
| Mom at +60s | CURATED / HOLD | Narrative timing and copy |
| Jack, June, Twitter, Foursquare, Tumblr events | CURATED / HOLD | Narrative content and timing |
| Silent non-SMS delivery | CURATED safety boundary | Avoids unsupported notification behavior |
| Cross-app lock-notification priority/replacement | HOLD | Not implemented |
| Exact third-party badge presentation | HOLD | No new badge artwork or chrome added |

## Bug classification

- **B fixed:** Jack and June were present in Facebook's initial state before their scheduled times. They now begin at `none` and arrive through reducer events.
- **A protected:** catch-up and React effect replay are guarded against duplicate event delivery.
- **A protected:** shutdown resets scheduler events, delivery IDs, reducer state, and in-memory claims.
- **C/HOLD:** production third-party badge chrome, third-party push presentation, and exact notification priority remain untouched.

No additional A or B issue was found in code-level validation.

## Validation

- `npm run build`: PASS
- `git diff --check`: PASS
- TypeScript exhaustively validates event types and payload discrimination: PASS
- Direct scheduler/reducer boundary checks (duplicate scheduling, exact due boundary, removal, and Facebook/Twitter/Foursquare/Tumblr reducer idempotency): PASS
- No second scheduler or clock added: PASS
- No new lock-notification ownership added: PASS
- No new sounds, artwork, icons, modal alerts, or modern notification system added: PASS
- Existing SMS event is defined once in the shared timeline: PASS
- Instagram initial state remains unchanged and empty: PASS
- Battery curve and terminal shutdown logic unchanged: PASS

There is no repository test runner, so no unexecuted test suite was added. A local browser smoke test was attempted, but no browser connection was available in the environment. The long-duration browser matrix (real-time boundaries, background-tab throttling, and full 15-minute shutdown) therefore remains a manual runtime verification item; it is not claimed as observed here.
