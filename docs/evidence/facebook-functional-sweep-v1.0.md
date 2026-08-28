# Facebook Functional Sweep v1.0

## Scope and environment

- Target session: `2010-10-20T00:02:00-07:00`
- Target timezone: `America/Los_Angeles`
- Scope: Facebook function, IA, state, navigation contracts, media relationships, and regressions
- Runtime changes made during sweep: none
- Narrative/content changes made during sweep: none
- Browser status: unavailable; browser discovery returned no connected instances
- Manual-result policy: no browser-dependent path is reported as PASS

## Surface results

| Surface | Result | Severity | Finding | Action |
|---|---|---|---|---|
| Fresh session state model | PASS | NONE | Automated reset assertions clear user content, Chat, friendship, party, RSVP, notification-read, and delivered-live state while retaining seed content. | KEEP |
| Canonical session clock and future gate | PASS | NONE | Seed validation locks the canonical session start and rejects premature future stories. | KEEP |
| Facebook launch and first render | NOT_TESTED | NONE | No browser instance was available to inspect the rendered launch path. | MANUAL TEST |
| Home Page 1 IA contract | PASS | NONE | Strict launcher data contains exactly News Feed, Profile, Friends, Inbox, Places, Requests, Events, Photos, and Chat; Groups and empty slots are absent. | KEEP |
| Home Page 1 rendered layout and tap targets | NOT_TESTED | NONE | Exact rendering, badge overlap, and all nine live tap targets require browser interaction. | MANUAL TEST |
| Home Page 2 grid contract | PASS | NONE | Notes occupies the first item of the same fixed three-row grid used by Page 1. | KEEP |
| Home paging state and direction guard | PASS | NONE | Automated assertions cover dot state, 40 px horizontal threshold, left/right direction, no wrap, and vertical rejection. | KEEP |
| Home swipe from rendered empty space | NOT_TESTED | NONE | Pointer delivery and host/device gesture interference require a connected browser. | MANUAL TEST |
| Notes route and return snapshot | PASS | NONE | State transition opens a biography-free Notes surface and Back restores Home Page 2. | KEEP |
| Notes rendered position and Back control | NOT_TESTED | NONE | Pixel position and live Back behavior were not browser-tested. | MANUAL TEST |
| Search state and canonical result resolver | PASS | NONE | Empty queries are safe and intended canonical/author identities use the existing resolver. | KEEP |
| Search rendered interaction | NOT_TESTED | NONE | Typing, result tapping, and rendered navigation were not browser-tested. | MANUAL TEST |
| News Feed eligibility | PASS | NONE | Strict validation covers the 2010 hard gate, visibility, future delivery, and deleted/hidden state. | KEEP |
| News Feed chronology | PASS | NONE | Canonical timestamps drive deterministic newest-first order across the locked 2010 baseline. | KEEP |
| News Feed scroll stability | NOT_TESTED | NONE | Idle stability, live insertion anchoring, Like/Comment position, and Detail/Profile Back require browser scrolling. | MANUAL TEST |
| Feed interaction state | PASS | NONE | Reducer assertions cover Like toggles, real comment records, counts, actor routing contracts, structured mentions, and shared story IDs. | KEEP |
| Feed interaction rendered flows | NOT_TESTED | NONE | Representative status/photo/album/check-in/live story taps were not browser-tested. | MANUAL TEST |
| Core Profile data and route contracts | PASS | NONE | Canonical, sparse, ephemeral, session-user, and author actors resolve without broad identity fallback. | KEEP |
| Core Profile rendered navigation | NOT_TESTED | NONE | Jack, June, Matt, Jay, Ben, Luca, Katie, Chris, and Alex were not manually traversed. | MANUAL TEST |
| Profile Wall canonical histories | PASS | NONE | Wall selectors preserve owner stories, historical ordering, sparse-profile rules, and canonical story identity. | KEEP |
| Profile Wall scroll restoration | NOT_TESTED | NONE | Ben/Jack/June/Matt long-wall scrolling and exact Back restoration require browser interaction. | MANUAL TEST |
| Canonical media relationship resolver | PASS | NONE | Automated audit covers owner, album, photo, story, timestamp, caption, and tags through the joined resolver. | KEEP |
| Albums | PASS | NONE | Strict IDs, membership, ordering, counts, story-scoped batches, and no `Me` fallback are validated. | KEEP |
| Jay Music album | PASS | NONE | The locked eight-photo newest-first album baseline and historical story relationships remain strict. | KEEP |
| Album and Photo Detail rendered navigation | NOT_TESTED | NONE | Thumbnail selection, displayed uploader, and Back path require browser interaction. | MANUAL TEST |
| Photos of Jack, June, Matt, and Z.tokyo | PASS | NONE | Central tagged-photo selectors preserve true ownership, shared media IDs, and the Anil no-account boundary. | KEEP |
| Friends | PASS | NONE | Canonical friend state, actor identities, and Jack's initial non-friend boundary are validated. | KEEP |
| Requests | PASS | NONE | Pending Jack request drives the badge; Accept/Ignore clear it; only Accept updates friends and Chat visibility. | KEEP |
| Requests rendered flow | NOT_TESTED | NONE | Live badge placement and request-row interaction were not browser-tested. | MANUAL TEST |
| Inbox state | PASS | NONE | Seed/live threads, reply state, unread counts, and reset behavior remain separate from Chat. | KEEP |
| Inbox rendered flow | NOT_TESTED | NONE | Historical threads, reply composer, and Back behavior were not browser-tested. | MANUAL TEST |
| Chat roster | PASS | NONE | Friendship-gated roster is exact; Jack is hidden before Accept and visible/offline afterward. | KEEP |
| Chat conversation state | PASS | NONE | Online peers have isolated session-local threads, trimmed outgoing messages, simulated timestamps, no auto-reply, no Inbox mutation, and reset semantics. | KEEP |
| Chat rendered conversations | NOT_TESTED | NONE | Send, composer clearing, scroll, reopen persistence, and disabled offline rows were not browser-tested. | MANUAL TEST |
| Places | PASS | NONE | Canonical venues, newest-first friend check-ins, user Check In, Feed eligibility, and Foursquare independence are asserted. | KEEP |
| Places rendered flow | NOT_TESTED | NONE | Venue rows and live Check In interaction were not browser-tested. | MANUAL TEST |
| Events state | PASS | NONE | One canonical Jack Party invitation drives one Events badge; opening Events acknowledges the badge without RSVP or deletion. | KEEP |
| Event RSVP | PASS | NONE | Yes, Maybe, and No use one session-local canonical RSVP state. | KEEP |
| Events rendered flow | NOT_TESTED | NONE | Event list, detail, RSVP controls, and Home return were not browser-tested. | MANUAL TEST |
| Notifications state | PASS | NONE | Request, Messages, and event notification counts derive independently from unread state; party notification is deduped. | KEEP |
| Notifications rendered flow | NOT_TESTED | NONE | Notification list navigation and live badge presentation were not browser-tested. | MANUAL TEST |
| Profile Picture relationship invariant | PASS | NONE | Uploaded profile pictures retain exactly one owner story and shared album/avatar/media resolution where applicable. | KEEP |
| Jack birthday regression | PASS | NONE | Ownership, English copy, tags, social engagement, Photos of Jack, and ambiguity boundaries remain strictly validated. | KEEP |
| Jay 2009 music regression | PASS | NONE | Four exact 2009 seeds remain Jay-owned historical content, excluded from the 2010 Feed, with Anil outside SNS identity. | KEEP |
| Live Facebook narrative schedule | PASS | NONE | Frozen event IDs, timestamps, ordering, dedupe, future gating, and reset semantics pass automated validation. | KEEP |
| Sleep/wake lifecycle | NOT_TESTED | NONE | Auto sleep, screen off, Lock Screen wake, unlock, clock continuity, and deep-view recovery require browser/device runtime interaction. | MANUAL TEST |
| Home button and app resume | NOT_TESTED | NONE | SpringBoard transition and current intended Facebook runtime preservation require browser/device controls. | MANUAL TEST |
| Session reset | PASS | NONE | Strict reset assertions clear session-local mutations without changing historical seed or canonical media. | KEEP |
| Cross-surface story interaction identity | PASS | NONE | Feed, Wall, Post Detail, Album, Photo Detail, and tagged paths share canonical story/media interaction keys. | KEEP |
| Cross-surface rendered persistence | NOT_TESTED | NONE | A browser is required to interact on one surface and visually confirm the same state on another. | MANUAL TEST |
| Historical IA boundary | PASS | NONE | Required October 20 features are present in the canonical launcher model and Groups remains absent. | KEEP |

## A Blockers

No A-level blocker was found by the executed automated and static sweep.

Browser-dependent A-level paths, especially launch, sleep/wake, and app resume, remain unverified rather than passed.

## B Functional Issues

No B-level functional defect was reproduced by the executed automated and static sweep.

Browser-dependent navigation, gesture, scroll, and rendered interaction paths remain unverified rather than passed.

## C Visual Fidelity Backlog

| Item | Result | Severity | Finding | Action |
|---|---|---|---|---|
| Historical launcher and feature icons | HOLD | C | Letter placeholders remain in use. | FACEBOOK VISUAL FIDELITY V1 |
| Account control evidence | HOLD | C | Exact October 2010 Account treatment remains unverified. | FACEBOOK VISUAL FIDELITY V1 |
| Gradients, gloss, and bevels | HOLD | C | Current chrome is structural rather than pixel-authenticated. | FACEBOOK VISUAL FIDELITY V1 |
| Typography | HOLD | C | Exact period font metrics and weights remain open. | FACEBOOK VISUAL FIDELITY V1 |
| Pixel spacing and dimensions | HOLD | C | Fine spacing and alignment remain outside the functional freeze. | FACEBOOK VISUAL FIDELITY V1 |
| Feed chrome | HOLD | C | Final period-specific story-cell styling remains open. | FACEBOOK VISUAL FIDELITY V1 |
| Profile, album, and Photo Detail chrome | HOLD | C | Final historical visual treatment remains open. | FACEBOOK VISUAL FIDELITY V1 |
| Pull-to-refresh | HOLD | C | Historical interaction enhancement remains deferred. | FACEBOOK VISUAL FIDELITY V1 |

## Manual Tests Not Executed

- Initial Facebook launch and fresh-session rendered baseline
- Home Page 1 and Page 2 rendered geometry, tap targets, dots, and swipe from empty space
- Search typing and result navigation
- Full Feed scroll, idle stability, live insertion, and Back restoration
- Representative rendered Like, Comment, mention, and actor-navigation flows
- All core Profile sections and long Wall scrolling
- Album, Photo Detail, and Photos of X rendered ownership paths
- Requests, Inbox, Chat, Places, Events, Notifications, and Notes rendered interactions
- Sleep/wake, Lock Screen, Home button, SpringBoard resume, and deep-view runtime preservation
- Cross-surface rendered Like/Comment persistence

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS

## Freeze recommendation

Automated function, IA, content, scheduler, and canonical-state gates are satisfied with zero reproduced A or B findings.

`FACEBOOK FUNCTION / IA / CONTENT FREEZE` should remain pending until the browser-dependent manual paths above are executed, especially launch, Home paging, Feed/Wall scroll restoration, cross-surface interaction persistence, and sleep/wake. Remaining known implementation work after that manual gate is C-level input for `Facebook Visual Fidelity v1`.

## Post-sweep manual correction: Home interaction and badges

The automated-only sweep was followed by a browser report that all Facebook Home launcher destinations were visible but not tappable. This is one B-level functional finding and supersedes the earlier unqualified statement that no B issue had been reproduced.

Root cause:

- The launcher grid called `setPointerCapture()` on every `pointerdown`.
- A tap beginning on a destination button therefore ended with `pointerup` retargeted to the ancestor grid.
- The resulting click no longer targeted the original button, so its route handler did not run.

Correction:

- Ordinary pointerdown no longer captures the pointer.
- Pointer capture begins only after pointer movement crosses the 40 px horizontal threshold and exceeds vertical movement.
- Only a confirmed drag suppresses its synthetic click.
- Launcher buttons, page dots, Notes, and the Notifications bar retain ordinary click behavior.

Badge investigation:

| State point | Inbox | Requests | Events | Notifications | Result |
|---|---:|---:|---:|---:|---|
| Fresh session before live delivery | 0 | 0 | 0 | 0 | Expected |
| Jack request delivered | 0 | 1 | 0 | 1 | Expected |
| Jack request accepted, before other delivery | 0 | 0 | 0 | 0 | Expected |
| Party invite delivered after eligibility | 1 | 0 | 1 | 1 | Expected |
| Events list opened | 1 | 0 | 0 | 1 | Expected; event badge acknowledged independently |

The badge selectors and launcher count mapping were intact. The apparent fresh-session absence was correct pre-delivery behavior, not a paging-refactor data regression. The dead launcher prevented normal inspection of later states and made the two symptoms appear coupled.

Updated blocker status:

- A blockers: 0
- B findings: 1 fixed in code, pending browser confirmation
- Freeze: blocked until the required launcher tap, paging, Notifications, and Jack badge-flow manual retest passes
