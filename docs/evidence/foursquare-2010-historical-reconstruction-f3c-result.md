# Foursquare 2010 F3c — Post-check-in Result

## F3c-1 deterministic result integrity

The global `latestCheckinResult` is insufficient for reopening an older checked venue: after check-ins at Venue A and Venue B, it necessarily describes Venue B. F3c-1 therefore stores the canonical frozen `FoursquareCheckinResult` directly on the existing venue-keyed `FoursquareCheckInRecord`.

Each successful `CHECK_IN` creates one result snapshot. The reducer assigns that same snapshot to both `checkIns[venueId].result` and `latestCheckinResult`; it does not recalculate rank or weekly points for either destination. `latestCheckinResult` remains the latest-only snapshot, while an older venue resolves its own historical result from `checkIns[venueId].result`.

Per-venue snapshots are never recomputed after later point events. Duplicate check-ins return the existing state unchanged. `pointsAwarded` remains compatibility-only presentation data derived from the snapshot's `pointDelta`, and point events remain the sole scoring authority. `RESET` removes every check-in, per-venue snapshot, point event, and latest result.

F3c-1 is deterministic state correctness, not a historical UI claim. It changes no visible result presentation, route, copy, geometry, material, standalone Leaderboard behavior, or cross-app state. Historical result reconstruction remains deferred to F3c-2.
