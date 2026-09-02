# Foursquare 2010 F3 — Deterministic Game Layer

## Evidence boundary

Period evidence supports points as check-in feedback, leaderboard competition, itemized point reasons, and a weekly leaderboard context. The complete September–October 2010 scoring formula has not been recovered and remains `HOLD`.

F3a is architecture only. It does not reconstruct or change any visible interface.

## Active deterministic model

The only active point reason is `check_in`, worth one point. Points on check-in are `PERIOD-SUPPORTED`; treating every currently eligible successful check-in as exactly `+1` is `RECONSTRUCTED`.

A period new-place bonus is supported, but the project cannot truthfully infer that a player's first visit during this experience is their first-ever visit. F3 therefore creates no `new_place` event. First-of-day, streak, repeat-visit, friend, mayorship, and badge bonuses also remain `HOLD`.

Point events are the single scoring authority. The previous independently mutable aggregate has been removed. `FoursquareCheckInRecord.pointsAwarded` remains temporarily as a compatibility presentation value for the unchanged F2c confirmation; it is derived from the frozen result and is not used for scoring.

## Frozen weekly seed and ranking

The immutable project-deterministic baseline is Alex 18, Katie 15, June 9, Luca 4, and Mia 2. The player starts at zero and is unranked until the first successful session check-in. No weekly reset, timezone cutoff, host-calendar computation, or persistence mechanism is introduced.

Ranking sorts by weekly points descending, then frozen `stableTieOrder`, then stable identity ID. This tie behavior and every baseline value are `RECONSTRUCTED / project-deterministic`, not historical Foursquare rules.

Expected player outcomes are: first unique venue, 1 point and rank 6; second, 2 points and rank 6 because Mia wins the frozen tie; third, 3 points and rank 5.

## Atomic result and lifecycle

Each successful `CHECK_IN` creates exactly one deterministic `check-in:${venueId}` event and one frozen latest result using the same F2c simulated timestamp. The result captures the point event, delta, weekly total after, rank before and after, empty badge IDs, and `mayorshipChange: null`. Duplicate check-ins create neither.

Reducer lifetime preserves events and the latest result across Home, lock, app switching, and resume. `RESET` restores the immutable baseline, no point events, player weekly score zero, player rank null, and no latest result.

F3a does not insert player check-ins into `socialActivities`, mutate friend baselines, add badge or mayorship behavior, or affect another application.

## HOLD

- complete historical scoring formula
- new-place applicability to the player
- first-of-day, streak, repeat, and friend bonuses
- exact weekly reset boundary
- mayorship bonuses and rules
- badge rules and artwork
- leaderboard, result, and Profile UI
- player Friends-feed insertion
