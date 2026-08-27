# Facebook 2010 Photos / Albums IA v0.1

## Scope

This pass implements the period-appropriate route `Profile -> Photos -> Albums -> Photo Detail`. It is an IA and media-binding reconstruction and does not add narrative media.

## Root Photos boundary

The Facebook Home launcher Photos destination represents the current user's own photos. The session-user baseline is intentionally empty. It is not a Friends' Photos aggregation surface. Character media is discoverable from that character's Profile Photos section.

## Registry-driven albums

Albums and media membership are declared in the centralized Facebook album registry. Components resolve media through the centralized Facebook story-media resolver and do not import image assets directly.

Implemented albums:

- Z.tokyo: Profile Pictures
- Luca: Pickup Basketball; Photos
- Alex: Profile Pictures; Dogs
- Ben: Profile Pictures; Photos
- Katie: Photos
- Jay: Music, with the Oct 19 performance, Oct 17 Jay guitar photo, and May guitar still life ordered by in-world timestamp

Album and photo counts derive from registered media IDs. No placeholders are fabricated to match narrative copy.

Luca's current profile image is the centralized `luca-profile-picture` record backed by unchanged `Luca.png`. `Pickup Basketball` contains exactly `guys.png`, `guys02.PNG`, and `guys03.png`; the Feed's “added 3 new photos” copy and album count derive from that same media-ID array. A separate generic `Photos` album contains unchanged `Luca-work.png`, dated March 20, 2010, with canonical venue ID `main-street-diner`. The historical work photo is excluded from the current Feed through the existing custom-audience visibility boundary.

The Pickup Basketball story owns one real Chris Like and four chronological seed comments from Chris, Luca, Chris, and ephemeral friend-of-friend Frank. Feed, Post Detail, album photos, and Photo Detail all select counts and interaction records by the shared `luca-pickup-basketball-photos` story ID; no nested modern comment chrome is introduced.

Jay's existing band-performance photo/story owns 48 deterministic seed Like records and 11 chronological comments. Canonical Katie, Alex, and Jack participate alongside a sparse external music circle. Mike's comment carries structured `@Matt` metadata through the shared inline-entity renderer; Matt does not comment. The drummer question remains plain discussion and does not create an Anil actor. Jay, Ryan, and Frank resolve `01.png` through centralized Facebook actor media while Jay's Music album media remains unchanged.

Alex has a centralized `Profile Pictures` album backed by unchanged `Alex.png` and a `Dogs` album backed by unchanged `Alex-dogs.PNG` and `Alex01.PNG`. The dog album sorts May 8, 2009 before October 3, 2007 and preserves caption `旺財&BB`. Both historical photos use the shared Photo Detail interaction path and are excluded from the current October 2010 Feed through custom-audience visibility.

Ben has a two-photo `Profile Pictures` history and a four-photo `Photos` history. Current `Ben01.JPG` is timestamped October 15, 2010 at 10:12 PM; the older `Ben0.png` entry is dated September 18, 2005. The same unchanged `Ben01.JPG` source is also referenced by a distinct ordinary photo at 9:49 PM with caption `happy friday. finally.`. `Ben-car.JPG` retains `new truck :)`; `Ben-coffee02.JPG` and `Ben-coffee.PNG` remain uncaptioned. All six records open through shared Photo Detail and remain outside the current News Feed.

Katie's implementation uses `Katie03.PNG` as one shared current avatar/Profile Pictures media record. `Katie01.jpg`, `Katie02.jpg`, `Katie04.jpg`, and `Katie05.jpg` form a separate `Photos` album ordered September 2010, July 2010, August 2009, July 2009. Only the August 2009 image has the caption `summer :)`. The former Katie/Ben family-context asset and album were intentionally removed; Ben's `do you own any other shirts?` response remains a canonical seed comment on the September photo, so sibling continuity, counts, and Profile navigation use shared comment/actor state without replacement media.

Jay's `Music` chronology reuses `10-18.JPG`, `Jay01.PNG`, and `Jay02.PNG` without changing the files. `10-18.JPG` is an asset filename and the source image contains an October 18 event sign; the curated Facebook record is intentionally timestamped October 19 at 10:00 PM PDT per the narrative continuity specification. This source/in-world date distinction is documented rather than hidden or corrected through image alteration. Structured inline entities make `@Matt` and `@Z.tokyo` navigable through their existing Facebook actors. `@Anil` remains plain caption text because Anil is offline-only and has no SNS identity. Composer tagging UX remains HOLD.

## Shared story state

Each album points to the existing Facebook story ID that introduced its media. Photo Detail Like and Comment actions use that story ID, so counts and user interactions remain shared with News Feed and Post Detail. Comment authors continue to use the existing navigable Facebook actor model.

## Sparse profiles and exclusions

Other canonical profiles and Ryan may expose an empty Photos section. Anil does not receive a Facebook profile or album. June, Jack, and Matt remain support-only until approved Facebook media exists. Instagram IG04 is not duplicated into Facebook Photos.

## Historical and HOLD boundaries

Classification: CURATED IA / CURATED media binding.

Modern Memories, Stories, Reels, automatic face grouping, and contemporary gallery chrome are rejected. Exact 2010 pixel-level album and photo-detail chrome remains HOLD for a later visual-fidelity pass.
