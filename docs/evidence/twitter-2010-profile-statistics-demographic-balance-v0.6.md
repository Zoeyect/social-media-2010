# Twitter 2010 Profile Statistics & Demographic Balance v0.6

## Result

Twitter now keeps provenance on every real-account statistics field and displays only values supported by a near-date source or an explicitly documented estimate. Unknown fields remain `HOLD` and render as `—`. Five CURATED work-life Tweets expand the pre-session seed from 9 to 14 items without changing the live scheduler.

This is Twitter-local. No avatar, historical artwork, scheduler event, notification, or cross-app state was added.

## Evidence and method

Target date: October 20, 2010. A value is retained only under one of these labels:

- `EXACT`: direct target-date or extremely close exact snapshot.
- `NEAR-DATE`: a dated value close to the target. Rounded wording such as “more than” remains rounded.
- `ESTIMATED`: conservative rounded target-date value derived from documented period anchors.
- `HOLD`: insufficient evidence; no number is shown.

Primary period anchors used:

- [Stephen Fry, “Two Million Reasons To Be Cheerful,” November 30, 2010](https://www.stephenfry.com/2010/11/two-million-reasons-to-be-cheerful/): Fry records his two-millionth follower himself.
- [Fast Company, “Conan O'Brien: King of Social Media,” October 13, 2010](https://www.fastcompany.com/1694565/conan-obrien-king-social-media): reports more than 1.7 million followers.
- [ClickZ, “NASA Hopes Gen X And Y ‘Follow’ Its Social Media Lift-Off,” October 25, 2010](https://clickz.com/nasa-hopes-gen-x-and-y-follow-its-social-media-lift-off/54178/): reports 626,700 followers and about 10,000 new followers per week.
- [TechCrunch, August 24, 2010](https://techcrunch.com/2010/08/24/gaga-queen-twitter/): reports Lady Gaga at 5,777,492 and Britney Spears at 5,721,702.
- [NME, August 24, 2010](https://www.nme.com/news/music/lady-gaga-468-1289814): corroborates Gaga/Britney and reports Barack Obama at 5,077,349.
- [Europe 1, August 23, 2010](https://www.europe1.fr/medias-tele/Lady-Gaga-reine-de-Twitter-285478): reports Ashton Kutcher at 5,580,122.

No current Twitter/X count or modern profile snapshot is used.

## Real-account statistics table

All unlisted following/tweet/favorite values are explicitly `HOLD`; their UI cells show `—`. The account registry stores the provenance, confidence, source date, and source note per field.

| Account | Followers shown | Class | Source date | Confidence / reasoning | Following / Tweets / Favorites |
| --- | ---: | --- | --- | --- | --- |
| CNN | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |
| The New York Times | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |
| NASA | 626,700 | NEAR-DATE | 2010-10-25 | High; direct report five days after target | HOLD / HOLD / HOLD |
| NPR | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |
| TIME | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |
| BBC World | — | HOLD | — | Exact handle/account snapshot also remains HOLD | HOLD / HOLD / HOLD |
| TechCrunch | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |
| Mashable | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |
| WIRED | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |
| Barack Obama | 5,200,000 | ESTIMATED | 2010-08-24 anchor | Low; conservative rounded value from 5,077,349 | HOLD / HOLD / HOLD |
| Oprah Winfrey | — | HOLD | — | No defensible target-date estimate recovered | HOLD / HOLD / HOLD |
| Conan O'Brien | 1,700,000 | NEAR-DATE | 2010-10-13 | Medium; period source says “more than 1.7 million”; displayed as rounded lower bound | HOLD / HOLD / HOLD |
| Kanye West | — | HOLD | — | Tweet provenance exists, but no target-date account count was recovered | HOLD / HOLD / HOLD |
| Lady Gaga | 6,500,000 | ESTIMATED | 2010-08-24 anchor | Low; rounded conservative estimate from 5,777,492 and documented rapid growth | HOLD / HOLD / HOLD |
| Ashton Kutcher | 5,700,000 | ESTIMATED | 2010-08-23 anchor | Low; rounded conservative estimate from 5,580,122 | HOLD / HOLD / HOLD |
| Britney Spears | 5,900,000 | ESTIMATED | 2010-08-24 anchor | Low; rounded conservative estimate from 5,721,702 | HOLD / HOLD / HOLD |
| Stephen Fry | 1,850,000 | ESTIMATED | 2010-11-30 anchor | Medium; conservative value below his documented 2,000,000 milestone six weeks later | HOLD / HOLD / HOLD |
| Starbucks Coffee | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |
| Whole Foods Market | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |
| YouTube | — | HOLD | — | No target-period numeric snapshot recovered | HOLD / HOLD / HOLD |

There are no values classified `EXACT` in v0.6. This is deliberate: the recovered sources do not provide an exact October 20 four-field profile snapshot.

## Estimation restraint

The estimates do not linearly project a full year. They use rounded values and remain visibly classified in the registry:

- Stephen Fry: 1.85M is below the self-documented 2M on November 30 and is not presented as a measured October count.
- Lady Gaga, Britney Spears, Ashton Kutcher, and Barack Obama: August period counts establish scale only. October display values are conservative, rounded, low-confidence estimates.
- NASA and Conan use near-date reported values without manufacturing additional digits.

If a later archive supplies exact October snapshots, these records can be replaced field by field without altering the Follow graph.

## Fictional-user count policy

Fictional users retain `CURATED` small-account profiles. Counts vary rather than sharing a template:

- following: 49–211;
- followers: 34–327;
- tweets: 155–1,894;
- favorites: 9–215.

June, Nora, Mia, Eli, Sam, Jack, and Eva plus the five work-life authors follow that range. These are narrative values, not historical claims. The session owner's name still derives from `sessionIdentity.name`; its CURATED baseline remains 3 following, 12 followers, 34 Tweets, and 7 Favorites before session-local actions.

## Five work-life seed Tweets

| Time | Author | Text | Origin / provenance |
| --- | --- | --- | --- |
| 11:49 PM | Dana | `still at the office. this deck is never going to end` | seed / CURATED |
| 11:09 PM | Marcus | `client approved the first version. honestly kind of suspicious` | seed / CURATED |
| 10:22 PM | Priya | `sent the file and immediately found a typo. perfect.` | seed / CURATED |
| 9:47 PM | Claire | `promotion talk went way better than i expected` | seed / CURATED |
| 9:08 PM | Ben | `home from work. not opening my laptop again tonight` | seed / CURATED |

They are interleaved with the existing late-night, celebrity, manual-RT, school, everyday, and Apple-reference records. None is a scheduler event.

## Final seed composition

| Type | Count |
| --- | ---: |
| Ordinary / late-night social | 5 |
| Work-life | 5 |
| Manual celebrity Retweets | 2 |
| Celebrity discussion | 1 |
| Apple / Back to the Mac reference | 1 |
| **Total** | **14** |

The three existing live Twitter events remain unchanged:

- `twitter-eva-school-tomorrow` — 12:07 AM / T+300s;
- `twitter-late-night-update` — displayed as 12:08 AM by the existing T+390s event;
- `twitter-nora-homework` — 12:13 AM / T+690s.

## Apple invariant

The only Apple-related Twitter record remains `apple-event`. The five new records contain no Apple, Mac, launch, or event copy. Seed plus live Twitter therefore retains exactly one Apple / Back to the Mac reference.

## Follow graph consistency

Statistics are attached to the same session-local Suggested User records that drive Suggested Users, Profile, and Following. Follow/Unfollow changes only the current owner's graph and `followingCount`; it never mutates the public account's statistics or the owner's follower count. Repeated Set-Follow actions remain idempotent, and new-session reset rebuilds both the follow baseline and statistics records.

## Remaining HOLD

- Followers for 13 of 20 suggested accounts.
- Following, Tweets, and Favorites for all 20 public/official accounts.
- Exact target-day counts for every account.
- Exact 2010 Suggested Users roster/order and all avatar artwork.
- Exact historical counts for fictional users, which are intentionally CURATED rather than presented as fact.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Five new records are `seed` / `CURATED`, not scheduler events.
- Scheduler event IDs and timing remain unchanged.
- No avatars or modern Twitter/X values were added.
