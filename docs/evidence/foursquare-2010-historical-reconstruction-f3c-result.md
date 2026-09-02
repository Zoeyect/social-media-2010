# Foursquare 2010 F3c — Post-check-in Result

## F3c-1 deterministic result integrity

The global `latestCheckinResult` is insufficient for reopening an older checked venue: after check-ins at Venue A and Venue B, it necessarily describes Venue B. F3c-1 therefore stores the canonical frozen `FoursquareCheckinResult` directly on the existing venue-keyed `FoursquareCheckInRecord`.

Each successful `CHECK_IN` creates one result snapshot. The reducer assigns that same snapshot to both `checkIns[venueId].result` and `latestCheckinResult`; it does not recalculate rank or weekly points for either destination. `latestCheckinResult` remains the latest-only snapshot, while an older venue resolves its own historical result from `checkIns[venueId].result`.

Per-venue snapshots are never recomputed after later point events. Duplicate check-ins return the existing state unchanged. `pointsAwarded` remains compatibility-only presentation data derived from the snapshot's `pointDelta`, and point events remain the sole scoring authority. `RESET` removes every check-in, per-venue snapshot, point event, and latest result.

F3c-1 is deterministic state correctness, not a historical UI claim. It changes no visible result presentation, route, copy, geometry, material, standalone Leaderboard behavior, or cross-app state. Historical result reconstruction remains deferred to F3c-2.

## F3c-2 historical result surface

F3c-2 replaces the temporary green confirmation with a dedicated result subview inside the selected venue route. An unchecked venue opens the preserved F2c form; successful submission enters result directly; a checked venue reopens its result directly. The confirmed period `Close` label returns to the same venue summary as a `RECONSTRUCTED / route-correct` destination. The centered title remains blank because exact target-build title behavior is `HOLD`. The existing five bottom tabs remain visible as a `RECONSTRUCTED / HOLD` choice and preserve strict root navigation.

The result reads exclusively from `checkIns[selectedVenueId].result`, never from the global latest-only snapshot. It shows the period-supported venue confirmation, then `Points`, the confirmed earned-points phrase, one reconstructed `Check-in` reason, and a `Leaderboard` section containing one frozen player row. Rank, avatar, name, numeric score, `#N`, the Points section, itemized reasons, Leaderboard section, venue-specific confirmation, and Close control are `CONFIRMED / PERIOD-SUPPORTED` elements.

The confirmation, section, and row dimensions; colors and separators; base reason label; same-venue Close destination; result subview mapping; and retained bottom tabs are `RECONSTRUCTED` or `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`. Exact nav title, result raster, visit count, movement wording, shout placement, separate weekly-total label, Mayor/Badge treatment, and transition animation remain `HOLD`.

The stored shout remains part of the check-in record but is not displayed on the result. With `mayorshipChange: null` and an empty `badgeIdsUnlocked`, no Mayor, Badge, Specials, empty-state, or reserved placeholder section is rendered. F3c-2 does not alter F3a scoring or the F3b standalone Leaderboard.
