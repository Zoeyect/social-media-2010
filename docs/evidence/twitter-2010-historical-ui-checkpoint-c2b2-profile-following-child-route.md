# Twitter Historical UI — Checkpoint C2b-2 Profile-Owned Following Child Route

## Scope

Checkpoint C2b-2 changes only the ownership and return semantics of the session owner's Following destination. Following is now a Profile-local child instead of a destructive Search-owned route. The existing follow graph, account ordering, account-list row geometry, placeholder avatars, Follow controls, button terminology, and count synchronization remain unchanged.

Target: Twitter for iPhone 3.0.x, iPhone 4, iOS 4.1, October 2010.

## Evidence and classifications

Twitter's direct 2010 owner-Profile capture confirms the four-cell Following/Tweets/Followers/Favorites statistics structure. Contemporary Tweetie 2 reviews support drilling from Profile into account relationship and Tweet lists. Exact target-build child Back wording is not directly recovered.

| Decision | Classification |
| --- | --- |
| Following is Profile-local information architecture | `PERIOD-SUPPORTED` |
| Session-owner Following identities come only from the canonical local follow graph | `CONFIRMED` project state invariant |
| Child title `Following` | `PROBABLE` |
| Child Back label `Profile` | `RECONSTRUCTED`; exact target-build label `HOLD` |
| Existing account-list row geometry and Follow-control artwork | unchanged `HOLD` |
| Profile-local four-icon toolbar | `HOLD`; unrendered |

Primary period sources remain the first-party May 19, 2010 Twitter for iPhone launch capture and the project C2a evidence record. Tweetie 2 reviews are lineage/category evidence only and are not treated as exact Twitter 3.0.x interaction specifications.

## State and navigation

The narrow child state is `currentView = "profileFollowing"`. Entering it is allowed only while the selected Profile is `session-owner`. The transition deliberately preserves:

- `activeTab`;
- `selectedUserId = "session-owner"`;
- the original `profileOriginView`;
- the canonical `followedUserIds` graph;
- the existing Following scroll position.

`BACK_FROM_PROFILE_FOLLOWING` changes only `currentView` back to `userProfile`. The existing `BACK_FROM_PROFILE` transition then performs the second Back step to More, Search, Timeline, or Tweet Detail according to the retained origin.

Bottom-tab selection remains strict root navigation and clears transient Profile state through the existing `SHOW_TAB` normalization.

## Truthful collection boundary

The child renders `selectTwitterFollowingUsers`, whose stable IDs map one-to-one to the session owner's `followedUserIds`. The displayed owner Following count is derived from that same graph, so the canonical baseline has no count/list mismatch and no missing rows are synthesized.

External Profile Following counts remain inert because the project has no account-scoped Following identity collections for those users.

Following rows omit Suggested Users category subtitles and the generic `Twitter user` fallback because neither is canonical Profile/account metadata. Names, handles, avatar fixtures, ordering, Follow/Unfollow controls, and graph behavior are preserved. An empty graph produces an empty list field; unsupported empty-state prose is not rendered.

## Preserved HOLD boundaries

- Profile Follow/Following visual reconstruction is not part of C2b-2.
- `FOLLOW` / `UNFOLLOW`, the 27px controls, and current gradients/material remain unchanged.
- Tweets, Followers, and Favorites statistics remain inert.
- No Profile Tweets, Followers, or Favorites child route is added.
- The historical Profile-local toolbar remains unimplemented.
- No account, seed, scheduler, avatar, or other asset data changes are introduced.

## Regression invariants

- More → My Profile → Following → Profile → More remains a two-step Back chain.
- Search → My Profile → Following → Profile → Search remains a two-step Back chain.
- Timeline-origin owner Profile returns through the same Profile to its original Timeline/detail origin.
- Every root tab selected from Following reaches that tab's root and clears Profile-child state.
- External Profile Following remains noninteractive at both renderer and reducer boundaries.
- Follow adds exactly one graph-backed row; Unfollow removes only that row; repeated operations remain idempotent.
- RESET restores the canonical follow graph and list.
- Timeline, Mentions, Messages, Tweets, DMs, unread state, scheduler, and canonical content remain unchanged.

