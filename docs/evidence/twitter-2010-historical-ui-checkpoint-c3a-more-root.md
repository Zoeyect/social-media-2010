# Twitter Historical UI — Checkpoint C3a More Root

## Scope

Checkpoint C3a adds only the historically confirmed `More → My Profile` route. It preserves Checkpoint A chrome, Checkpoints B1–B4a, the five root tabs, Search, Profile presentation, Twitter content/state semantics, scheduler delivery, and every existing social record.

Target: iPhone 4, iOS 4.1, Twitter for iPhone 3.0.x circa October 2010.

## Evidence and confidence

Twitter's first-party May 19, 2010 Profile capture shows `More` as the Profile Back destination. Contemporary Tweetie 2 lineage material independently places `My Profile` in More.

| Decision | Classification |
| --- | --- |
| `My Profile` belongs under More | `CONFIRMED` |
| More contains a navigable Profile row | `CONFIRMED` |
| 44px row, 15px text inset, 17/20 primary text, separator, disclosure treatment | `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT` |
| Exact original row raster, RGB, pressed state, and disclosure artwork | `HOLD` |

The More background uses a restrained local secondary-screen pinstripe reconstruction. It does not alter Timeline, Mentions, Messages, Search, Profile, or global Twitter chrome.

## Runtime structure

The More root contains exactly one implemented row:

1. `My Profile`

The row dispatches the existing `OPEN_USER_PROFILE_BY_ID` event for `session-owner`, with `originView: "more"`. No second Profile renderer or identity model is introduced.

`TwitterProfileOrigin` now includes `"more"`. `BACK_FROM_PROFILE` restores `activeTab: "more"` and `currentView: "more"`, while clearing `selectedUserId` and `profileOriginView`. Selecting a bottom root tab continues to use the existing strict `SHOW_TAB` normalization instead of the Back origin.

## Compatibility boundary

`Search → My Profile` is no longer rendered on the Search root after canonical `More → My Profile` validation confirmed the intended origin. The Search root now preserves only the Suggested Users discovery route for local profile access.

The historical profile-local toolbar remains `HOLD`. C3a preserves the existing five root tabs on Profile.

## Intentionally absent More rows

C3a does not render Favorites, Drafts, Lists, Accounts & Settings, Go to User, Settings, Help, or About. Their historical presence does not establish a truthful implemented route in the current project.

## Preserved invariants

- Timeline, Mentions, DMs, linked Tweets, unread state, Favorites, Retweets, replies, Follow graph, and all scroll positions remain unchanged through More/Profile navigation.
- Search-origin Profile Back behavior remains unchanged.
- Timeline and Mentions root-tab selection from a More-origin Profile remains strict root navigation.
- Reset restores the canonical Timeline root and baseline social state.
- Profile avatar, typography, verification text, metadata, statistics, controls, background, and toolbar are unchanged.
- No assets or seed content are added or modified.
