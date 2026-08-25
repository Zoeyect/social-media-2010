# Twitter 2010 Profile Stats & Search Return Correction v0.6.1

## Result

Two Twitter-local defects were corrected:

1. Suggested Users and Following now retain their own scroll positions through Profile navigation.
2. Profile statistics now use the period 2×2 information architecture and show full, comma-grouped integers for every real Suggested User account.

No scheduler, System Foundation, cross-app timeline, notification, battery, lock-routing, avatar, or sibling-app change was introduced.

## Search-return bug: root cause and fix

### Root cause

`profileOriginView` correctly remembered whether Profile came from `suggestedUsers`, `following`, `timeline`, or `tweetDetail`, but the two people lists kept scrollTop only in their transient DOM nodes. Opening Profile unmounted the list; Back reconstructed it at browser-default scrollTop `0`.

### Correction

TwitterState now retains two independent coordinates:

- `suggestedUsersScrollPosition`;
- `followingScrollPosition`.

Each list continuously records its scrollTop through `SET_PEOPLE_SCROLL_POSITION`. Immediately before a row opens Profile, the actual list element scrollTop is also included in `OPEN_USER_PROFILE_BY_ID`, preventing a stale React-state frame from losing the final position. When Back restores the origin view, `useLayoutEffect` reapplies that view's retained coordinate.

Origins remain separate:

| Origin | Back destination | Restored state |
| --- | --- | --- |
| Suggested Users | Suggested Users | `suggestedUsersScrollPosition` |
| Following | Following | `followingScrollPosition` |
| Timeline | Timeline | existing `scrollPosition` |
| Tweet Detail | same Tweet Detail | existing selected Tweet/detail route |

Reset restores both people-list positions to zero for the new Hero session.

## Profile IA correction

Before v0.6.1 the profile used one modern-looking four-column strip:

`following | followers | tweets | favorites`

The corrected period structure is a two-column grid:

```text
following | tweets
followers | favorites
```

The owner `following` cell remains the entry to the Following list. Public-profile Follow/Unfollow stays below the grid and continues to use the single Twitter-local Follow graph. Exact borders, background rasters, typography, and row heights remain visual HOLD items.

## Numeric formatting

`formatProfileCount` now uses full en-US integer grouping:

- `5200000` → `5,200,000`
- `620000` → `620,000`

No `K`/`M` abbreviation, decimal shortening, compact notation, or modern metric rendering is used.

## Evidence sources and anchors

The account registry retains source date, URL, confidence, and notes per evidenced/estimated field.

- [ClickZ, October 25, 2010](https://clickz.com/nasa-hopes-gen-x-and-y-follow-its-social-media-lift-off/54178/): NASA had 626,700 followers and was gaining about 10,000 per week. The target-date UI uses a conservative rounded 620,000 estimate.
- [Fast Company, October 13, 2010](https://www.fastcompany.com/1694565/conan-obrien-king-social-media): Conan had more than 1.7 million followers; 1,700,000 is retained as a rounded near-date lower bound.
- [Stephen Fry, November 30, 2010](https://www.stephenfry.com/2010/11/two-million-reasons-to-be-cheerful/): first-party record of reaching two million; October is conservatively estimated at 1,850,000.
- [TechCrunch, August 24, 2010](https://techcrunch.com/2010/08/24/gaga-queen-twitter/): Lady Gaga at 5,777,492 and Britney Spears at 5,721,702.
- [China Daily, December 17, 2010](https://www.chinadaily.com.cn/entertainment/2010-12/17/content_11717955_2.htm): Britney Spears at 6,361,290, providing a second side of the October estimate.
- [NME, August 24, 2010](https://www.nme.com/news/music/lady-gaga-468-1289814): Barack Obama at 5,077,349.
- [The Independent/AFP, July 7, 2010](https://www.independent.co.uk/news/media/10-million-on-facebook-for-obama-but-lady-gaga-there-first-2020501.html): Barack Obama at 4.47 million, supporting the scale and growth direction.
- [Europe 1, August 23, 2010](https://www.europe1.fr/medias-tele/Lady-Gaga-reine-de-Twitter-285478): Ashton Kutcher at 5,580,122.

No present-day Twitter/X data is used.

## Complete real-account statistics table

Every field is explicitly classified. `CURATED-FILL` means no defensible target-period snapshot was recovered; the rounded value exists only to complete the simulated profile IA and must not be cited as historical fact.

| Account | Following | Tweets | Followers | Favorites |
| --- | ---: | ---: | ---: | ---: |
| CNN | 45 (CURATED-FILL) | 42,000 (CURATED-FILL) | 1,200,000 (CURATED-FILL) | 0 (CURATED-FILL) |
| The New York Times | 120 (CURATED-FILL) | 50,000 (CURATED-FILL) | 2,300,000 (CURATED-FILL) | 0 (CURATED-FILL) |
| NASA | 70 (CURATED-FILL) | 6,000 (CURATED-FILL) | 620,000 (ESTIMATED) | 0 (CURATED-FILL) |
| NPR | 70 (CURATED-FILL) | 30,000 (CURATED-FILL) | 850,000 (CURATED-FILL) | 0 (CURATED-FILL) |
| TIME | 90 (CURATED-FILL) | 18,000 (CURATED-FILL) | 1,100,000 (CURATED-FILL) | 0 (CURATED-FILL) |
| BBC World | 80 (CURATED-FILL) | 45,000 (CURATED-FILL) | 1,400,000 (CURATED-FILL) | 0 (CURATED-FILL) |
| TechCrunch | 850 (CURATED-FILL) | 29,000 (CURATED-FILL) | 1,600,000 (CURATED-FILL) | 120 (CURATED-FILL) |
| Mashable | 2,200 (CURATED-FILL) | 55,000 (CURATED-FILL) | 2,300,000 (CURATED-FILL) | 300 (CURATED-FILL) |
| WIRED | 400 (CURATED-FILL) | 21,000 (CURATED-FILL) | 800,000 (CURATED-FILL) | 45 (CURATED-FILL) |
| Barack Obama | 700,000 (CURATED-FILL) | 1,500 (CURATED-FILL) | 5,200,000 (ESTIMATED) | 0 (CURATED-FILL) |
| Oprah Winfrey | 25 (CURATED-FILL) | 1,100 (CURATED-FILL) | 4,400,000 (CURATED-FILL) | 4 (CURATED-FILL) |
| Conan O'Brien | 1 (CURATED-FILL) | 150 (CURATED-FILL) | 1,700,000 (NEAR-DATE) | 0 (CURATED-FILL) |
| Kanye West | 1 (CURATED-FILL) | 400 (CURATED-FILL) | 1,300,000 (CURATED-FILL) | 0 (CURATED-FILL) |
| Lady Gaga | 140,000 (CURATED-FILL) | 700 (CURATED-FILL) | 6,500,000 (ESTIMATED) | 0 (CURATED-FILL) |
| Ashton Kutcher | 500 (CURATED-FILL) | 8,000 (CURATED-FILL) | 5,700,000 (ESTIMATED) | 40 (CURATED-FILL) |
| Britney Spears | 350,000 (CURATED-FILL) | 800 (CURATED-FILL) | 5,900,000 (ESTIMATED) | 0 (CURATED-FILL) |
| Stephen Fry | 50,000 (CURATED-FILL) | 6,000 (CURATED-FILL) | 1,850,000 (ESTIMATED) | 50 (CURATED-FILL) |
| Starbucks Coffee | 8,500 (CURATED-FILL) | 16,000 (CURATED-FILL) | 950,000 (CURATED-FILL) | 250 (CURATED-FILL) |
| Whole Foods Market | 14,000 (CURATED-FILL) | 24,000 (CURATED-FILL) | 1,100,000 (CURATED-FILL) | 800 (CURATED-FILL) |
| YouTube | 600 (CURATED-FILL) | 9,000 (CURATED-FILL) | 2,400,000 (CURATED-FILL) | 20 (CURATED-FILL) |

No field currently meets the stricter `EXACT` target-date classification. Conan is `NEAR-DATE`; NASA and the large-account milestone-derived values are `ESTIMATED`; all unsupported fields are explicitly `CURATED-FILL`.

## Estimation and fill discipline

- Values based on milestones are rounded; no fake unit-level precision is introduced.
- Institution following counts remain relatively modest while their Tweet volumes vary.
- Celebrity follower scales are large, but following/Tweet/Favorite patterns are deliberately non-identical.
- Zero Favorite values are permitted as a CURATED representation of accounts that did not visibly use the feature; they are not asserted as measured facts.
- The target account follower snapshots remain static when the local session owner follows/unfollows. Adding an imperceptible ±1 to million-scale historical/estimated snapshots would add complexity without improving the artwork. Only the owner's dynamic `followingCount` changes.

## Fictional users and session owner

June, Nora, Eva, Mia, Eli, Sam, Jack, and the work-life authors retain varied, small CURATED personal-account counts. The session owner continues to derive identity from `sessionIdentity.name`; user Tweets/Favorites extend its baseline, and Follow/Unfollow changes its following count exactly once.

## Remaining HOLD items

- Exact Twitter 3.0.2 profile chrome, raster backgrounds, fonts, row heights, and separators.
- Exact October 20 values for fields represented by estimates or curated fills.
- Avatar images; all remain neutral `DEV-HOLD` initials fixtures.
- Manual browser observation of very long Following-list scroll after following enough accounts; reducer/DOM restoration paths are covered by code-level tests.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Suggested Users and Following origins retain independent exact scroll values.
- Timeline and Tweet Detail Profile return paths remain separate.
- Grid source is 2 columns in the required following/tweets/followers/favorites order.
- Every real Suggested User has four nonnegative integer values with per-field provenance.
- Follow/Unfollow remains idempotent and new-session reset restores baseline graph/count/scroll state.
- Scheduler, System, other apps, and avatar assets are unchanged.
