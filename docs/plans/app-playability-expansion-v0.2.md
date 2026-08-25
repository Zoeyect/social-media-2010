# App Playability Expansion v0.2

## Scope

This phase adds session-local interaction inside existing applications. The shared System Foundation, App Runtime, session clock, scheduler, battery lifecycle, lock-notification routing, and identity ownership remain frozen.

Curated live events and user-generated session actions remain separate. All mutations reset with a new simulation session.

## App sequence

| App | Planned interaction | Status | A/B findings | C backlog / HOLD | Checkpoint |
| --- | --- | --- | --- | --- | --- |
| Twitter | Reply, native Retweet; preserve Favorite | Implemented and code-tested | None found | Exact 2010 reply/Retweet chrome and geometry remain C/HOLD; browser interaction NOT TESTED because no browser session was available | `Add Twitter v0.2 reply and retweet playability` |
| Facebook | Friend-request downstream state; June thread; optional historically safe comment | Planned | Not assessed | Messaging/comment fidelity must be audited before expansion | Pending |
| Foursquare | Optional check-in shout; Tip/To-Do only if verified | Planned | Not assessed | To-Do, mayor, and badge behavior remain HOLD | Pending |
| Flickr | Plain comments; minimal Sets path if architecture supports it | Planned | Not assessed | Exact comments/Sets chrome remains HOLD | Pending |
| Tumblr | Reblog confirmation with optional short text; Notes only if evidenced | Planned | Not assessed | Exact reblog and Notes behavior remains HOLD | Pending |
| Instagram | Camera/first-photo flow only if launch-era evidence is sufficient | HOLD | Not assessed | Do not populate or fabricate the empty account | Pending |
| Messages | No expansion in this phase unless explicitly requested | Unchanged | None | Additional scripted replies remain out of scope | Existing freeze retained |

## Twitter v0.2 result

- Replies are limited to 140 characters in both the UI and state transition layer.
- Replies use the shared `sessionIdentity.name` and are stored as Twitter-local activity.
- Native Retweet state uses the period term “Retweet”; Quote Tweet is absent.
- Reply, Retweet, and Favorite are independent.
- Twitter-local mutations survive retained runtime state and live timeline deliveries.
- A new-session reset removes replies, reply drafts, Retweets, Favorites, and live additions while restoring the seed timeline.
- The global live-event scheduler and all other app state modules were left unchanged.

## Phase status

**IN PROGRESS.** Twitter is the only app expanded in this checkpoint. The phase must not be declared complete until each selected app receives its own implementation and functional sweep.
