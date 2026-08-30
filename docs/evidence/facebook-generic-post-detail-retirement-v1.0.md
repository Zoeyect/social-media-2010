# Facebook Generic Post Detail Legacy Route Audit + Retirement v1.0

Canonical target: Facebook native iPhone app, iPhone 4 / iOS 4.1, 2010-10-20 U.S. Pacific Time.

Generic Post Detail as a primary 2010 iPhone route is `NOT_EVIDENCED / REJECTED AS PRIMARY`. The retained `feedDetail` implementation is `LEGACY_UNUSED`; its state transition is deprecated and remains only as an `INTERNAL_FALLBACK` until a separate dead-code cleanup can safely remove the state, markup, CSS, and legacy validator scenarios together.

## Caller inventory

| Caller / surface | Old target | New target | Classification | Action |
| --- | --- | --- | --- | --- |
| News Feed generic story body / whitespace | No action | No action | `NO_ACTION` | Kept inert; no Post caller existed. |
| News Feed actor / avatar | Profile | Profile | `HISTORICALLY_REQUIRED` | Preserved. |
| News Feed structured mention | Profile | Profile | `HISTORICALLY_REQUIRED` | Preserved. |
| News Feed Comment action | Comments Detail | Comments Detail | `COMMENTS_ROUTE` | Preserved. |
| News Feed single photo | Exact Photo Detail | Exact Photo Detail | `PHOTO_ROUTE` | Preserved. |
| News Feed multi-photo thumbnail | Exact selected Photo Detail | Exact selected Photo Detail | `PHOTO_ROUTE` | Preserved. |
| Profile Wall generic story body / whitespace | Generic Post Detail | No action | `NO_ACTION` | Retired `onOpen`, button role, keyboard target, and Post dispatch. |
| Profile Wall actor / avatar | Profile | Profile | `HISTORICALLY_REQUIRED` | Preserved with Wall scroll capture. |
| Profile Wall structured mention | Profile | Profile | `HISTORICALLY_REQUIRED` | Preserved with Wall scroll capture. |
| Profile Wall Comment action | Generic Post Detail + legacy composer | Comments Detail | `COMMENTS_ROUTE` | Rerouted with `profileWall`, profile name, and exact Wall scroll context. |
| Profile Wall photo / album thumbnail | Exact Photo Detail | Exact Photo Detail | `PHOTO_ROUTE` | Preserved. |
| Event Wall Alex story row | Generic Post Detail | No action | `NO_ACTION` | Replaced the interactive story-body button with presentation-identical inert story markup. |
| Event host name | Profile | Profile | `HISTORICALLY_REQUIRED` | Preserved. |
| Notifications: friend request | Friends / Requests | Friends / Requests | `HISTORICALLY_REQUIRED` | Preserved. |
| Notifications: June or Katie message | Message Detail | Message Detail | `HISTORICALLY_REQUIRED` | Preserved. |
| Notifications: event invitation | Event Detail | Event Detail | `HISTORICALLY_REQUIRED` | Preserved. |
| Notification comment / tag / photo convenience target | No implemented caller | No invented target | `LEGACY_UNUSED` | No Generic Post fallback exists; unresolved future types remain omitted rather than guessed. |
| Album photo grid | Exact selected Photo Detail | Exact selected Photo Detail | `PHOTO_ROUTE` | Preserved. |
| Tagged-photo collection entry | Tagged Photos collection | Tagged Photos collection | `PHOTO_ROUTE` | Preserved. |
| Tagged-photo thumbnail | Exact selected Photo Detail | Exact selected Photo Detail | `PHOTO_ROUTE` | Preserved. |
| Direct production `OPEN_FEED_ITEM` dispatch | Wall body, Wall Comment, Event Wall | None | `LEGACY_UNUSED` | All three normal UI callers retired or rerouted. |
| `OPEN_FEED_ITEM` state transition | Generic Post Detail | Generic Post Detail | `INTERNAL_FALLBACK` | Retained and explicitly deprecated; not reachable through normal Facebook UI. |
| `feedDetail` render branch and CSS | Generic Post Detail | Unchanged, unreachable normally | `LEGACY_UNUSED` | Retained to avoid broad state/markup/CSS deletion in this route-access pass. |

## Legacy validator-only callers

The source validator still invokes the deprecated transition directly for isolated legacy state and cross-profile restoration coverage. These are not runtime UI callers:

| Story fixture | Existing validator purpose | Classification |
| --- | --- | --- |
| Luca thread | comment-author Profile/Back restoration | `INTERNAL_FALLBACK` |
| Jay band thread | structured mention Profile/Back restoration | `INTERNAL_FALLBACK` |
| Jack movie | legacy detail Like/comment playability | `INTERNAL_FALLBACK` |
| June Instagram announcement | ephemeral actor and interaction continuity | `INTERNAL_FALLBACK` |
| Alex party story | comment-author and user-comment continuity | `INTERNAL_FALLBACK` |
| Ben Wall `Long day.` | legacy Post/Wall scroll isolation | `INTERNAL_FALLBACK` |
| Jay performance photo | structured mention and shared interaction identity | `INTERNAL_FALLBACK` |

Those scenarios should be migrated or removed only with the later dead-code deletion pass. New runtime callers are prohibited by a focused source guard.

## Route decision

```text
Actor / avatar       -> Profile
Structured mention  -> Profile
+                    -> reveal Like / Comment
Comment              -> Comments Detail
Single photo         -> exact Photo Detail
Multi-photo thumb    -> exact Photo Detail
Generic story body   -> NO_ACTION / HOLD
```

No whole-row click target remains on Feed, Profile Wall, or Event Wall. Specific actor, mention, media, Like, and Comment controls retain their independent targets, so broad event-propagation suppression was neither necessary nor added.

## Dead-code status and confidence

- Generic Post Detail primary route: `NOT_EVIDENCED / REJECTED AS PRIMARY`.
- Actor, Comment, and Photo destinations: `PERIOD-EVIDENCE` under the current project route map.
- Generic story body: `HOLD`; retired conservatively to `NO_ACTION` rather than redirected speculatively.
- `feedDetail`, `OPEN_FEED_ITEM`, Generic Post markup, and Post CSS: retained as deprecated dead-end implementation because deletion would expand into unrelated legacy tests and shared detail code.
- Remaining production Generic Post callers: none.
- Remaining internal fallback: the deprecated reducer transition and validator-only direct invocations listed above.

No story record, ID, comment, Like, media binding, timestamp, ownership, tag, friendship, notification payload, scheduler, or global-time state changed.
