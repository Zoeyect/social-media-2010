# Facebook Cross-Profile Navigation Stack v0.1

## Route-stack model

Facebook keeps its existing local view-depth stack and pairs every actor-profile push with a complete origin snapshot. The snapshot records the originating view, selected story/message/album/photo, Profile and Friends sections, actor identity, and route-instance scroll position. `GO_BACK` pops both in lockstep and restores the exact prior Facebook surface.

Duplicate actors are intentionally retained. A traversal such as June -> Sophie -> June is three distinct route instances and backs out through Sophie before reaching the original June route.

Likes, comments, reply drafts, unread state, RSVP, live growth, media, and narrative state remain outside route snapshots and are therefore preserved rather than cloned or reset.

## Entry-point audit

| Entry point | Navigation | Expected restoration | Fixed |
| --- | --- | --- | --- |
| Feed/Wall actor | Profile push | Feed or Wall story and scroll | Yes |
| Post Detail actor/comment | Profile push | Same story and interaction state | Yes |
| Photo Detail owner/comment/mention | Profile push | Same album photo and story ID | Yes |
| Structured mention | Actor-profile push | Exact originating surface | Yes |
| Friends row | Profile push | Friends section/search/scroll | Yes |
| Requests person | Profile push | Requests with current request state | Yes |
| Message sender | Profile push | Same thread, draft, read state | Yes |
| Event host | Profile push | Same Event and RSVP | Yes |
| Album/Profile actor | Profile push | Album/Profile section and scroll | Yes |
| Ephemeral actor | Actor-profile push | Exact origin; no special Back path | Yes |
| Z.tokyo | Actor-profile push | Exact origin; no canonical promotion | Yes |
| Session user | Actor-profile push | Exact comment origin | Yes |

## Profile Wall scroll restoration

Profile Wall uses `.facebook-profile-wall` as its scroll container. Opening Post Detail captures the live `scrollTop` before route navigation; the Facebook-local route state preserves the profile actor, Wall section, originating story, and scroll position.

On Back, the Wall restores the saved value with `useLayoutEffect` after the Wall list renders. No timer or story-anchor fallback is currently required because this path restores the exact container offset.

## HOLD boundary

Manual browser confirmation of DOM scroll restoration across every long list remains pending. The reducer stores route-instance scroll values; exact 2010 transition animation and visual chrome remain HOLD.
