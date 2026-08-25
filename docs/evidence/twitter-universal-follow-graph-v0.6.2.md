# Twitter Universal Follow Graph v0.6.2

## Result

The Twitter-local follow relationship now applies to every known non-self profile, independent of the route used to open it. The implementation remains a functional period-appropriate approximation; exact 2010 button chrome and transitions remain HOLD.

## Shared graph architecture

- `TwitterState.followedUserIds` is the sole mutable follow-membership source.
- Suggested Users derives each button state from that set.
- Profile derives `following` from that set for Suggested Users, Timeline authors, Tweet Detail authors, fictional users, and public/official accounts.
- Following derives its rows from the same set. It is not separately editable state.
- `SET_FOLLOW` accepts known suggested or profile-registry users, is idempotent, and rejects `session-owner` at the reducer boundary.
- A new session recreates the designed baseline graph; current-session choices do not cross the Hero/session reset boundary.

The previous `suggestedUsers[].following` membership field was removed. Keeping membership inside Suggested Users made Timeline-only profiles impossible to follow and allowed route-specific state to diverge.

## Profile rule and entry routes

Every selected profile other than `session-owner` receives FOLLOW or UNFOLLOW from the shared graph. The existing navigation paths cover Timeline author/avatar, Tweet Detail author, Suggested Users, Following, and other navigable authors that resolve through the Twitter profile registry. The session owner's own profile receives no action button.

Manual-RT source navigation remains conditional on whether that source is exposed as an existing profile link; this change does not invent a new route.

## Count policy

- The current user's `followingCount` is derived from `followedUserIds.length`, so a successful graph insertion/removal changes it exactly once.
- Repeated Follow/Unfollow requests return unchanged state.
- Target accounts' follower/following/tweet/favorite statistics remain historical or curated snapshots. They are not incremented when the session user follows them, avoiding false precision such as `5,200,000` becoming `5,200,001`.

## Navigation regression coverage

State-level checks confirm:

- Suggested Users → Profile → Back restores the captured Suggested Users scroll position.
- Following → Profile → Back restores the captured Following scroll position.
- Following rows appear/disappear directly from graph changes.
- Timeline-only profile `June` can be followed, is visible in Following, can be unfollowed, and updates owner count exactly once.
- self-follow is rejected even if a faulty UI dispatch is attempted.
- reset removes Zoey's universal follow choices and restores the designed baseline for Alex.

Browser-level pointer/visual verification was not performed in this change; exact visual chrome and interaction animation remain HOLD.

## A/B/C findings

- A/B fixed: follow membership was scoped to Suggested Users instead of universal profile identity.
- A/B fixed: Following could list only Suggested User records.
- A/B fixed: owner count was stored separately rather than derived from membership.
- A/B fixed: reducer now provides a self-follow guard.
- C/HOLD: exact 2010 FOLLOW/UNFOLLOW artwork, typography, pressed state, and animation.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Scheduler, System Foundation, other apps, battery, and lock-notification routing were not changed by v0.6.2.
