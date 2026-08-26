# Facebook Narrative Content Lock v0.4

## Status

`FACEBOOK NARRATIVE CONTENT = LOCKED`

This is the final systematic Facebook narrative-content pass before Photos/Albums placement and interaction refinement. Later work may fix bugs, correct historical IA, place locked content within Photos/Albums, refine interactions, improve visual fidelity, or make small copy corrections. New drama, central characters, parties, romantic arcs, or surprise events require explicitly reopening this lock.

## Visibility and News Feed inclusion

Every canonical story carries one `FacebookVisibility`: `friends`, `friends-of-friends`, `everyone`, or `custom`. Friends-only stories require current graph membership; friend-of-friend and everyone stories may enter Feed through wider social context; custom stories require an explicit audience match. User-created stories are always visible to their author.

Jack's ordinary friends-only status is hidden before acceptance. Before then, Jack remains discoverable only through the friend request, Alex's friends-of-friends party story, event context, comments, June, and gossip. Accepting Jack adds him to Friends and makes his friends-only story eligible without cloning it.

News Feed selects high-signal recent stories from the relationship/visibility model. It does not automatically render every canonical character.

## Locked story architecture

The shared Feed record supports `status`, `photo`, `album`, `checkin`, and `activity`. A record owns its actor, copy, timestamp, visibility, media references, relationship metadata, comments, and likes. Feed, Profile/Wall, Event Wall, and later album activity routes reference the same story ID, so interaction state is never cloned.

Photo stories use one centralized media ID. Album stories use an ordered media-ID list, album title, and actual total photo count; a story may show only the approved available thumbnails. Check-ins remain Places-compatible, and no owner check-in is seeded.

## Comment and Like semantics

Comments are records in Facebook session state. Zero produces no summary, one produces `1 comment`, and two or more produce `N comments`. User submissions store the current session identity, update immediately, remain visible in the canonical detail thread, and reset with a new session.

Likes are also actor records. User Like/Unlike adds or removes one session-local record. Summaries use `1 person likes this` or `N people like this`; no independent cosmetic count exists.

## Facebook Messages replies

Every open Facebook Messages thread uses one shared `threadMessages` model and one reply composer. Seed, live incoming, and session-user messages retain thread ID, author type, body, simulated timestamp, and origin. User text is checked with `trim()` only for empty validation; accepted content is preserved exactly, remains session-local across navigation/lock/suspend, creates no self-notification, and resets with the Hero session.

Only a user reply in the canonical June `Hey, are you online?` thread activates the existing party-eligibility path. Katie and all other thread replies are expression-only and cannot mutate Jack, party, RSVP, Instagram, scheduler, or global timeline state. Exact 2010 message-thread chrome remains visual HOLD.

## Navigable comment authors

Comment authors participate in the navigable Facebook social graph through one typed actor resolver. Canonical identities route to their canonical Profile/Wall, Facebook-local `EPHEMERAL_FRIEND_OF_FRIEND` identities such as Ryan route to sparse local Profiles, session-user comments route to the current user's Profile, and author-easter-egg comments can reuse the existing Z.tokyo route. Back returns to the same canonical Post and preserves scroll, comment, Like, gossip, and party state. Exact profile and comment-row visual chrome remains subject to the existing historical-fidelity HOLD rules.

June's live Instagram announcement uses deterministic liker records visible at these elapsed times:

| Elapsed | Visible Likes |
|---|---:|
| T+60 | 1 |
| T+90 | 3 |
| T+120 | 5 |
| T+150 | 7 |
| T+210 | 9 |
| T+300 | 11 |

The mix includes canonical friends and ephemeral Facebook contacts. Jay's Like is generic Instagram-announcement engagement and is not gossip. Like growth creates no notifications and adds no scheduler events.

## Final narrative map

1. June's T+60 `finally got instagram lol @junepark` announcement.
2. Katie's `june + jack???` and Chris's `lol no way` public comments.
3. Ryan's one friends-of-friends `june + jack??? lol` standalone Feed story at T+135.
4. Katie's private `Do you know Jack????` message.
5. Jack's Friend Request and post-acceptance friend boundary.
6. One shared Jack Party invitation/Event with explicit Yes/Maybe/No RSVP.
7. Alex's friends-of-friends `anyone going to jack's party friday?` story.
8. Jay's `yeah probably` reply and Ryan's `EPHEMERAL_FRIEND_OF_FRIEND` reply.
9. Ben's sparse `Long day.` office-life anchor.
10. Luca's basketball album clue with Chris.
11. Katie's family-context photo clue with Ben.
12. Jay's restrained guitar photo, Z.tokyo's existing peripheral profile activity, and the broader offline band context.

Jay and Matt have zero June/Jack gossip records. IG04 remains Instagram-only and is never duplicated into Facebook.

Ryan is one Facebook-local `EPHEMERAL_FRIEND_OF_FRIEND`, not a canonical character or recurring contact. His standalone story remains after IG04 deletion, creates no private-message or Instagram identity, and exists only to leave a broader-network trace for late discovery.

## Shared media placement

- `chris-luca-basketball` uses the existing `Chris-Luca.PNG` as Luca's album thumbnail and implies the basketball relationship without explanatory copy.
- `katie-ben-family` uses `Katie-Ben.JPG` as Katie's ordinary photo activity and leaves the sibling relationship implicit in UI.
- `jay-guitar` uses `Jay01.PNG` as a sparse music-context photo.
- Z.tokyo continues to use the Facebook-local author media registry.
- June's accidental `june-ig-04` is excluded from Facebook stories.

The current approved Jay media shows only Jay and a guitar. It does not prove that Matt, Z.tokyo, or Anil appears in the image. The story model permits `offlineSubjectIds: ["anil"]` for a future approved group photograph without creating an Anil SNS identity, but actual Anil group media remains HOLD.

## Relationship and user-projection boundaries

Only Katie/Ben siblings and Chris/Luca basketball friends are hard canonical relationships. Other overlaps remain flexible. The content does not define the user's gender, age, school, job, hobbies, party preference, gossip interest, or relationship with June or Jack. User comments, status, RSVP, Like, and check-in may define only what the user explicitly chooses during the session.

## Remaining HOLD

- Full Photos/Albums IA and placement
- Exact 2010 photo-tag chrome
- Additional approved band/group media containing Anil, Matt, and Z.tokyo
- Pixel-level Feed, comment, Like, and album-thumbnail fidelity
- Exact historical privacy-control editor chrome
