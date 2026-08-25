# App Playability Expansion v0.2

## Scope

This phase adds session-local interaction inside existing applications. The shared System Foundation, App Runtime, session clock, scheduler, battery lifecycle, lock-notification routing, and identity ownership remain frozen.

Curated live events and user-generated session actions remain separate. All mutations reset with a new simulation session.

## App sequence

| App | Planned interaction | Status | A/B findings | C backlog / HOLD | Checkpoint |
| --- | --- | --- | --- | --- | --- |
| Twitter | Reply, native Retweet timeline activity; preserve Favorite | v0.3 implemented and code-tested | None found | Exact immediate client insertion, attribution chrome, and geometry remain C/HOLD; browser interaction NOT TESTED | `Integrate Twitter Retweets into the timeline` |
| Facebook | Jack friend outcome, June reply thread, one plain Feed comment interaction | Implemented and code-tested | None found | Exact Facebook 2010 Friends/message/comment chrome remains C/HOLD; browser interaction NOT TESTED | `Add Facebook v0.2 friend, message, and comment playability` |
| Foursquare | Optional check-in shout, per-venue record, open/close Tip | Implemented and code-tested | None found | Exact shout limit/timestamp chrome and To-Do interaction remain HOLD; Mayor read-only and badges excluded | `Add Foursquare v0.2 shout and Tip playability` |
| Flickr | Seed/user comments and two ID-based Sets with origin-aware Back routing | Implemented and code-tested | None found | Exact 2010 comments/Sets chrome, seed commenter identity, and imagery remain C/HOLD | `Add Flickr v0.2 comments and Sets playability` |
| Tumblr | Confirmed Reblog relation with optional text; seed/user Notes | Implemented and code-tested | None found | Exact 2010 Reblog/Notes chrome, wording, timing, and seed blog identities remain C/HOLD | `Add Tumblr v0.2 Reblog and Notes playability` |
| Instagram | Camera/first-photo flow only if launch-era evidence is sufficient | HOLD | Not assessed | Do not populate or fabricate the empty account | Pending |
| Messages | No expansion in this phase unless explicitly requested | Unchanged | None | Additional scripted replies remain out of scope | Existing freeze retained |

## Twitter v0.2 result

- Replies are limited to 140 characters in both the UI and state transition layer.
- Replies use the shared `sessionIdentity.name` and are stored as Twitter-local activity.
- Native Retweet state uses the period term “Retweet”; Quote Tweet is absent.
- A current-user Retweet creates one stable `user-retweet:<sourceTweetId>` activity at the top of the rendered timeline while retaining the untouched source tweet.
- Retweet activities record the source ID, current session identity, original tweet timestamp, and a separate action timestamp; unretweet removes only that user activity.
- Reply, Retweet, and Favorite are independent.
- Twitter-local mutations survive retained runtime state and live timeline deliveries.
- A new-session reset removes replies, reply drafts, Retweets, Favorites, and live additions while restoring the seed timeline.
- The global live-event scheduler and all other app state modules were left unchanged.

## Facebook v0.2 result

- Accepting the scheduled Jack request removes it from pending and creates one minimal session-local Jack friend record.
- Ignoring the request removes it without adding Jack; later duplicate delivery cannot recreate either resolved request.
- The scheduled June message remains absent before delivery, becomes unread on delivery, read on opening, and replied after a successful plain-text response.
- June replies use the shared `sessionIdentity.name`; there is no scripted June response or modern Messenger behavior.
- A Feed detail can accept plain session-local comments attributed to the shared session identity.
- Like, Comment, Friend Request, and June Message mutations remain independent and retain feed scroll state.
- Reset removes Friends, June state/replies/draft, comments/draft, Likes, and the scheduled live records, then restores the Facebook seed baseline with the new identity.
- Global timeline definitions, scheduler code, frozen System modules, Messages, and Twitter were not modified.

## Foursquare v0.2 result

- Each successful check-in now stores the current session identity, action timestamp, optional trimmed shout, and points awarded for its venue.
- Empty shout remains valid; a compact 140-character functional limit prevents the local composer from becoming long-form, while the exact historical limit remains HOLD.
- A venue may award points only once in the current session. Repeated check-in returns the unchanged state.
- The existing seed Tip can be opened and closed without affecting check-in, points, Mayor, badges, or ambient activity.
- To-Dos remain unimplemented: project evidence verifies the historical feature but still classifies the exact interaction as HOLD.
- Mayor stays assigned to the seeded other user and no badge is awarded.
- Reset clears check-ins, shout drafts, points, venue/Tip selection, and live activity, restoring the immutable ambient seed baseline.
- Global scheduler/timeline definitions, frozen System modules, Twitter, Facebook, and other apps were not modified.

## Flickr v0.2 result

- Existing seed comment strings are cloned into session-local records with `origin: "seed"`; no unsupported seed author is invented.
- User comments use `sessionIdentity.name`, remain plain text and session-local, and carry `origin: "user"`.
- Two small CURATED Sets reference existing photo IDs instead of duplicating photo records.
- Photo Detail is reused from both Photostream and Set navigation. A local navigation-origin record returns Back to the correct source while retaining Photostream scroll.
- Favorite, Comments, and Set membership remain independent.
- Reset removes user comments, Favorites, selected photo/Set, navigation origin, drafts, and scroll, then recreates the seed comment and Set baseline.
- Upload, Camera Roll, camera capture, EXIF, and maps remain HOLD; Camera Runtime was not modified.
- Global scheduler/timeline definitions, frozen System modules, Twitter, Facebook, Foursquare, and other apps were not modified.

## Tumblr v0.2 result

- Reblog now opens a separate minimal confirmation flow that preserves the source post and accepts optional session-local text.
- Confirm creates one stable `user-reblog:<sourcePostId>` relation with the current identity and an independent action timestamp; Cancel creates nothing.
- Unreblog removes only the current-user relation and its local Note, preserving the source post, live/seed content, and Like state.
- Notes provides a simple chronological state list containing CURATED/HOLD seed Notes and local Like/Reblog Notes with explicit `seed`/`user` origin.
- Like, Reblog, and Notes remain independent. A post can remain Liked while its Reblog is removed.
- Reset clears Likes, Reblogs, drafts, selection, scroll, user Notes, and live posts while restoring the seed Dashboard/Notes baseline.
- Full posting/composer types remain HOLD and were not introduced.
- Global scheduler/timeline definitions, frozen System modules, Twitter, Facebook, Foursquare, Flickr, and other apps were not modified.

## Phase status

**IN PROGRESS.** Twitter is the only app expanded in this checkpoint. The phase must not be declared complete until each selected app receives its own implementation and functional sweep.
