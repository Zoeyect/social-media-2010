# App Playability Expansion v0.2

## Scope

This phase adds session-local interaction inside existing applications. The shared System Foundation, App Runtime, session clock, scheduler, battery lifecycle, lock-notification routing, and identity ownership remain frozen.

Curated live events and user-generated session actions remain separate. All mutations reset with a new simulation session.

## App sequence

| App | Planned interaction | Status | A/B findings | C backlog / HOLD | Checkpoint |
| --- | --- | --- | --- | --- | --- |
| Twitter | Reply, native Retweet timeline activity; preserve Favorite | v0.3 implemented and code-tested | None found | Exact immediate client insertion, attribution chrome, and geometry remain C/HOLD; browser interaction NOT TESTED | `Integrate Twitter Retweets into the timeline` |
| Facebook | Jack friend outcome, June reply thread, one plain Feed comment interaction | Implemented and code-tested | None found | Exact Facebook 2010 Friends/message/comment chrome remains C/HOLD; browser interaction NOT TESTED | `Add Facebook v0.2 friend, message, and comment playability` |
| Foursquare | Optional check-in shout; Tip/To-Do only if verified | Planned | Not assessed | To-Do, mayor, and badge behavior remain HOLD | Pending |
| Flickr | Plain comments; minimal Sets path if architecture supports it | Planned | Not assessed | Exact comments/Sets chrome remains HOLD | Pending |
| Tumblr | Reblog confirmation with optional short text; Notes only if evidenced | Planned | Not assessed | Exact reblog and Notes behavior remains HOLD | Pending |
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

## Phase status

**IN PROGRESS.** Twitter is the only app expanded in this checkpoint. The phase must not be declared complete until each selected app receives its own implementation and functional sweep.
