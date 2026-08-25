# Twitter Follow / Follower Count Sync v0.6.3

## Result

Target-profile follower counts now reflect the current session user's Follow/Unfollow relationship while preserving every historical or curated baseline value unchanged.

## Baseline and session delta

The displayed value is derived as:

`displayFollowerCount = baselineFollowerCount + sessionFollowerDelta`

`sessionFollowerDelta` is determined only from the difference between the immutable designed baseline graph and the current `followedUserIds` graph:

- not followed at baseline, not followed now: `0`
- not followed at baseline, followed now: `+1`
- followed at baseline, followed now: `0`
- followed at baseline, unfollowed now: `-1`

No counter is incremented imperatively. Consequently repeated Follow/Unfollow requests cannot stack deltas.

## Baseline-followed handling

CNN, The New York Times, and NASA are the designed initially-followed accounts. Their initial displayed follower values remain their exact stored baselines; initial membership does not add another follower. Unfollow displays baseline minus one, and following again restores baseline.

Initially-unfollowed profiles, including fictional Timeline users such as June, start at baseline, display baseline plus one while followed, and return to baseline when unfollowed.

## Shared-route consistency

All Profile routes use `selectTwitterUserProfile`, which combines the shared follow graph with the target account baseline. Suggested Users, Timeline authors, Tweet Detail authors, Search/Following navigation, fictional users, and public accounts therefore resolve the same displayed count for the same state.

Self Profile remains excluded. The existing reducer guard continues to reject self-follow, so no self follower delta can be created.

## Provenance separation

The stored account statistic and its `EXACT`, `NEAR-DATE`, `ESTIMATED`, or `CURATED-FILL` provenance remain unchanged. A displayed baseline ±1 is explicitly simulated session interaction state, not a revised historical measurement or claim.

## Functional checks

- June: `220 → Follow → 221`.
- repeated June Follow: remains `221` and returns the same state object.
- June Unfollow: `221 → 220`.
- repeated June Unfollow: remains `220`.
- NASA, initially followed: starts at its current registry baseline, Unfollow displays baseline minus one, and Follow restores the baseline. v0.6.4 later naturalizes that deterministic display baseline without changing the delta rule.
- owner `followingCount` continues to derive from graph size and changes exactly once.
- reset restores June `220`, NASA's current registry baseline, and the designed baseline graph for the new identity.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Scheduler, System Foundation, sibling apps, battery, and lock notification routing were not changed.
