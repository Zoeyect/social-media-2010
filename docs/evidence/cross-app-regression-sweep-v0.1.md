# Cross-App Regression Sweep v0.1

## Scope and method

This is an A/B-only regression audit after the Facebook, Instagram, June narrative, and shared-character-state changes. No runtime, seed, timeline, scheduler, or UI code was changed during the sweep.

Automated evidence:

- `npm run test:seed`: PASS
- `npm run build`: PASS
- Production build emitted all 20 registered Instagram Popular assets.

Manual browser control returned `No browser is available`. Every interaction or visual item that required direct observation is therefore marked `NOT MANUALLY OBSERVED`; no manual PASS is claimed.

## 1. Baseline/reset

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Session baseline | Fresh-state seed model, 12:02 baseline, reset constructors | AUTOMATED PASS | None | KEEP |
| Messages | Dad unread baseline and session reset | AUTOMATED PASS | None | KEEP |
| Instagram | June baseline and user-owned state reset | AUTOMATED PASS | None | KEEP |
| Facebook | Live narrative events absent before eligibility/time | AUTOMATED PASS | None | KEEP |
| Full terminal reset | End-to-end shutdown and new Hero-session interaction | NOT MANUALLY OBSERVED | Unclassified | Manual sweep pending |

## 2. 12:03 collision

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Messages | Mom `Home yet?` scheduled once through SMS state | AUTOMATED PASS | None | KEEP |
| Facebook | June `finally got instagram lol @junepark` delivered once | AUTOMATED PASS | None | KEEP |
| Ownership | Facebook does not replace the direct SMS interruption model | AUTOMATED PASS at state/model level | None | KEEP |
| Lock/badge presentation | Actual simultaneous notification presentation | NOT MANUALLY OBSERVED | Unclassified | Manual sweep pending |
| Twitter | Matt/Jay remain ambient without intrusive notification | AUTOMATED PASS at timeline/model level | None | KEEP |

## 3. June Instagram

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Identity | One canonical `junepark` account | AUTOMATED PASS | None | KEEP |
| Social stats | Followers/following are deterministic and account-owned | AUTOMATED PASS | None | KEEP |
| Initial media | Newest-first IG04 / IG03 / IG02 | AUTOMATED PASS | None | KEEP |
| Drama timing | Katie T+120, Chris T+145, Katie message T+155, deletion T+200, replacement T+210 | AUTOMATED PASS | None | KEEP |
| Final media | IG01 / IG03 / IG02, with IG04 absent | AUTOMATED PASS | None | KEEP |
| Profile navigation | Current Profile to Following to June and Back behavior | AUTOMATED PASS at reducer level | None | KEEP |
| Media geometry | All June images visibly render 1:1 without `No photos.` | NOT MANUALLY OBSERVED | Unclassified | Manual sweep pending |

## 4. Facebook Jack/June/Katie

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Independence | June Instagram drama leaves Jack request, party eligibility, RSVP, and invite deduplication unchanged | AUTOMATED PASS | None | KEEP |
| Jack request | Scheduled appearance, Accept/Ignore resolution, and no duplicate delivery | AUTOMATED PASS | None | KEEP |
| June thread | Existing unread/read/reply state remains Facebook-local | AUTOMATED PASS | None | KEEP |
| Katie thread | T+155 arrival and thread-derived unread state | AUTOMATED PASS | None | KEEP |
| Message routing | Facebook Messages remains separate from MobileSMS | AUTOMATED PASS at state/model level | None | KEEP |
| Interactive thread chrome | Visual route and unread transition in browser | NOT MANUALLY OBSERVED | Unclassified | Manual sweep pending |

## 5. Events/Notifications

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Party invite | Shared eligibility, one invite, no auto-RSVP, session reset | AUTOMATED PASS | None | KEEP |
| RSVP | Yes/Maybe/No is explicit user state and survives navigation state | AUTOMATED PASS | None | KEEP |
| Notification derivation | Request/message/event records derive from current Facebook state | AUTOMATED PASS at model level | None | KEEP |
| Notification routes | Jack to Requests, June/Katie to thread, party to Events | NOT MANUALLY OBSERVED end to end | Unclassified | Manual sweep pending |

## 6. User-created Facebook state

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Status | User-origin status uses session identity and resets | AUTOMATED PASS | None | KEEP |
| Places baseline | No seeded owner location | AUTOMATED PASS | None | KEEP |
| Check-in | Explicit session-local check-in resets without redefining identity | AUTOMATED PASS | None | KEEP |
| Creation UI | Manual Status and Places entry flow | NOT MANUALLY OBSERVED | Unclassified | Manual sweep pending |

## 7. Instagram Popular/first-photo

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Popular registry | 20 unique local media records in explicit deterministic order | AUTOMATED PASS | None | KEEP |
| Popular detail | Thumbnail and detail resolve the same media record; Back retains scroll/order | AUTOMATED PASS | None | KEEP |
| Narrative boundary | Popular does not contain June or mutate June timeline | AUTOMATED PASS | None | KEEP |
| Profile IA | Profile remains stream-based rather than using the Popular grid | AUTOMATED PASS at source/model level | None | KEEP |
| First photo | User-created photo remains user-owned and resettable | AUTOMATED PASS | None | KEEP |
| Asset rendering | No visually broken image, square crop, fixed footer, and route interaction | NOT MANUALLY OBSERVED | Unclassified | Manual sweep pending |

## 8. Suspend/catch-up

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Scheduler catch-up | Elapsed event delivery remains exactly once after time advances | AUTOMATED PASS | None | KEEP |
| June catch-up | IG04 deletion and IG01 replacement converge to final state | AUTOMATED PASS | None | KEEP |
| Message deduplication | Mom and Katie delivery IDs remain deduplicated | AUTOMATED PASS | None | KEEP |
| App state | Facebook/Instagram reducer state survives navigation transitions | AUTOMATED PASS | None | KEEP |
| Device interaction | Home, lock, wait, resume sequence in a real browser | NOT MANUALLY OBSERVED | Unclassified | Manual sweep pending |

## 9. A/B findings

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Automated regression suite | Seed/state/timeline assertions | No failure found | None | No fix |
| Type/runtime build | TypeScript and Vite production build | No failure found | None | No fix |
| Manual interaction coverage | Browser unavailable | Incomplete evidence, not a discovered defect | Unclassified | Complete later browser sweep |

`NO A/B BLOCKERS FOUND`

This conclusion is limited to automated state/model/build coverage. The unobserved manual routes remain residual test risk rather than confirmed PASS results.

## 10. C backlog observations

| Area | Test | Result | Severity | Action |
|---|---|---|---|---|
| Visual polish | Cross-app browser inspection | NOT MANUALLY OBSERVED | C/unclassified | No change; retain existing HOLD items |

No new C issue was recorded because no browser image was available to inspect. Existing historical chrome, typography, gradients, icons, and pixel-level HOLD items remain outside this A/B sweep.
