# Twitter Retweet Timeline Integration v0.3

## Scope

This implementation makes current-user Retweets visible in Twitter's timeline. It is Twitter-local session activity: no scheduled event, delivered-event ID, or global timeline definition is created.

## State model

Each active current-user Retweet has one relation:

```ts
{
  id: `user-retweet:${sourceTweetId}`,
  sourceTweetId,
  retweetedBy: sessionIdentity.name,
  originalTweetTimestamp,
  retweetActionTimestamp
}
```

`originalTweetTimestamp` remains the source tweet's historical display string. `retweetActionTimestamp` is captured independently at interaction time for the session activity and does not rewrite or re-sort the source record.

## Timeline insertion

- The reducer prepends a new relation to `retweetActivities` on the first Retweet.
- The Twitter timeline renders these user activities before live and seed tweets.
- The activity resolves its content from `sourceTweetId`; it therefore displays the original author and original text rather than cloning them as user-authored content.
- The original tweet remains in its normal chronological position.
- Opening the activity routes to the original tweet detail.
- Existing `scrollPosition` is unchanged by Retweet or live delivery. Returning from detail restores that value; position `0` naturally exposes the new top item.

The exact immediate insertion behavior of the historical client is HOLD; this is a functional period-appropriate approximation.

## Unretweet and duplicate prevention

- Toggling an active Retweet removes its source ID and only the matching `user-retweet:<sourceTweetId>` activity.
- The original seed/live tweet, Favorite, and user replies remain untouched.
- A stable relation ID plus replacement filtering guarantees at most one active current-user Retweet activity per source tweet.
- Re-retweeting after removal restores one relation with a new action timestamp, never a duplicate pair.

## Persistence and reset

Retweet activities live in the existing Twitter reducer, so they survive retained runtime state across detail/back, Home suspension, app switching, lock/sleep/resume, and live Twitter event delivery.

`RESET` rebuilds the seed baseline and clears both active Retweet IDs and activity relations. Zoey's Retweets therefore cannot appear in Alex's session.

## Interaction independence

Automated state checks verify:

- Favorite and Retweet can both remain active.
- Replies remain after Retweet and unretweet.
- Unretweet does not remove Favorite.
- Live tweet delivery preserves exactly one active Retweet activity and existing scroll state.

## Evidence classification

### READY

- Retweet existed in the target-era Twitter product.
- Retweeted source content preserves its original author/text relationship.

### HOLD

- Exact immediate insertion behavior in the October 2010 iPhone client.
- Exact “Retweeted by” wording, location, typography, icon, chrome, and animation.
- Pixel/runtime exactness of the activity row.

No HOLD item is represented as historical fact.

## Findings

### A — Architecture / Blocker

None found. The global scheduler remains outside the user action path.

### B — Functional

None found by state tests, build validation, or diff inspection.

### C — Polish

- Exact Retweet arrow artwork and attribution placement.
- Exact font, gradient, row geometry, and animation timing.

These were not changed.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Duplicate active Retweet relations: prevented and tested
- New-session Retweet reset: tested
- Seed/live Twitter definitions: unchanged
- Global scheduler: unchanged
- Facebook state/commit: unchanged
