# Twitter Live Activity Expansion v0.2

## Outcome

Twitter now receives three silent live additions during the 15-minute session, making it the most active scheduled social app while preserving the existing nine-item seed timeline.

No Twitter runtime or scheduler architecture was added. The expansion is expressed entirely as additional definitions consumed by the existing Cross-App Timeline Orchestration and the existing `DELIVER_TIMELINE_TWEET` reducer event.

## Deterministic live activity pool

| Stable event ID | Elapsed | Display time | Author | Text | Classification |
|---|---:|---|---|---|---|
| `twitter-eva-school-tomorrow` | T+300s | 12:07 AM | Eva | “ugh I really don't want to go to school tomorrow” | `CURATED` |
| `twitter-late-night-update` | T+390s | 12:08 AM | Mia | “Still awake. The diner line is moving slowly.” | `CURATED` |
| `twitter-nora-homework` | T+690s | 12:13 AM | Nora | “finally starting the homework I ignored all night” | `CURATED` |

The pool is static and deterministic. It does not use `Math.random`, browser state, component timers, or session identity, so every new session receives the same designed activity sequence.

The existing Mia event retains its original stable event ID, elapsed time, and content. Eva and Nora are additions.

## Activity balance

Scheduled social-app additions per session:

| App | Additions |
|---|---:|
| Twitter | 3 |
| Facebook | 2 |
| Foursquare | 1 |
| Tumblr | 1 |

Messages is excluded from this social-feed comparison because its events use the SMS notification/message lifecycle rather than silent ambient social activity.

Twitter therefore has more scheduled live activity than every other social app without producing a tweet every minute.

## Seed preservation

The Twitter seed source remains unchanged:

- 9 initial seed tweets
- 2 curated manual RT wrappers
- 1 celebrity-discussion item
- 1 Apple-related item
- 5 mundane/night posts

All three live post IDs are absent from the seed. They enter state only through scheduled `twitterBackgroundTweet` events.

## Apple rule

The live pool contains no Apple, Back to the Mac, event-rumor, or live-coverage reference.

Across the nine seed tweets and all three live additions, the only Apple-related item remains the existing seed item `apple-event`. The total is exactly one.

## Celebrity retweet option

Not used.

The seed already contains two manual RT wrappers whose public-figure sources remain separately classified. Adding another live celebrity RT was optional and would have weakened the ordinary late-night balance. All new v0.2 live additions are mundane curated posts.

## Delivery behavior

Every Twitter live definition uses:

- `sourceApp: "twitter"`
- `type: "twitterBackgroundTweet"`
- `deliveryPolicy: "internal"`
- `provenanceStatus: "CURATED"`

Consequences:

- no sound
- no modal alert
- no Lock Screen ownership
- no wake-screen request
- no foreground-app interruption

The user discovers the activity by opening or returning to Twitter.

## Exactly-once and catch-up

The existing scheduler provides the behavior:

1. stable IDs prevent duplicate registration;
2. elapsed-time lookup exposes due events even after inactivity;
3. delivered timeline IDs prevent repeated delivery;
4. processed events are removed from the queue;
5. session reset rebuilds the original event set and clears the previous session's live Twitter state.

Regression tests register the entire timeline twice and confirm that only one instance of every stable ID remains. They also consume all due events at T+900s and confirm that each event appears once in chronological scheduler order.

Because due-event selection depends on shared elapsed time rather than foreground interaction, the additions remain eligible while the device is locked, sleeping, or inside another app.

## Timeline ordering and scroll preservation

The existing Twitter reducer sorts delivered posts by their displayed 12-hour timestamps. After all three additions, the live portion is ordered:

1. Nora — 12:13 AM
2. Mia — 12:08 AM
3. Eva — 12:07 AM
4. previous-evening seed content

Duplicate delivery attempts leave one record per post ID.

`DELIVER_TIMELINE_TWEET` does not alter `scrollPosition`, `currentView`, or `selectedTweetId`. The regression test sets a nonzero scroll position, delivers all three posts, and confirms that the position is retained. A new-item indicator remains `HOLD`.

## Session reset

After the three posts are delivered, Twitter reset returns to the same nine-item seed baseline:

- all live post IDs are absent;
- Favorite IDs are empty;
- selected detail and scroll state reset through the existing state path;
- the next session receives fresh scheduled events with the same stable definitions.

## Architecture boundary

Unchanged:

- Twitter state model and runtime container
- `DELIVER_TIMELINE_TWEET` behavior
- global scheduler functions
- App Runtime
- notification and Lock Screen routing
- seed content
- battery/session timing
- all non-Twitter event IDs and timings

Changed:

- timeline data definitions: two new Twitter events
- exported deterministic Twitter live pool used by the existing timeline
- seed regression tests and this evidence document

## Remaining HOLD items

- New-tweet indicator while reading older content
- Randomized candidate selection; deliberately omitted for reproducibility
- Live celebrity RT; deliberately omitted in v0.2
- Exact historical copy/timing beyond the explicit `CURATED` classification

## Validation coverage

- Eva exists at T+300s / 12:07 AM with exact curated copy.
- Twitter has 3 live additions, more than any other scheduled social app.
- All Twitter live events are silent internal deliveries.
- Apple-reference count across seed and live is exactly 1.
- Live IDs do not occur in seed.
- Every live tweet delivers once despite duplicate attempts.
- Catch-up exposes all due events without interaction.
- Live tweets sort above seed newest-first.
- Current Twitter scroll position survives delivery.
- Session reset removes every live addition.
- Existing Mia event and all non-Twitter timeline timing remain unchanged.
