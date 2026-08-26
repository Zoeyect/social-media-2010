# Facebook 2010 Photos / Albums IA v0.1

## Scope

This pass implements the period-appropriate route `Profile -> Photos -> Albums -> Photo Detail`. It is an IA and media-binding reconstruction and does not add narrative media.

## Root Photos boundary

The Facebook Home launcher Photos destination represents the current user's own photos. The session-user baseline is intentionally empty. It is not a Friends' Photos aggregation surface. Character media is discoverable from that character's Profile Photos section.

## Registry-driven albums

Albums and media membership are declared in the centralized Facebook album registry. Components resolve media through the centralized Facebook story-media resolver and do not import image assets directly.

Implemented albums:

- Z.tokyo: Profile Pictures
- Luca: Pickup Basketball
- Katie: Photos
- Jay: Music, with the Oct 19 performance, Oct 17 Jay guitar photo, and May guitar still life ordered by in-world timestamp

Album and photo counts derive from registered media IDs. No placeholders are fabricated to match narrative copy.

Katie's implementation uses `Katie03.PNG` as one shared current avatar/Profile Pictures media record. `Katie01.jpg`, `Katie02.jpg`, `Katie04.jpg`, and `Katie05.jpg` form a separate `Photos` album ordered September 2010, July 2010, August 2009, July 2009. Only the August 2009 image has the caption `summer :)`. The existing Katie/Ben media remains a separate `Family Photos` album. Ben's `do you own any other shirts?` response is a canonical seed comment on the September photo, so counts and Profile navigation use shared comment/actor state.

Jay's `Music` chronology reuses `10-18.JPG`, `Jay01.PNG`, and `Jay02.PNG` without changing the files. `10-18.JPG` is an asset filename and the source image contains an October 18 event sign; the curated Facebook record is intentionally timestamped October 19 at 10:00 PM PDT per the narrative continuity specification. This source/in-world date distinction is documented rather than hidden or corrected through image alteration. Structured inline entities make `@Matt` and `@Z.tokyo` navigable through their existing Facebook actors. `@Anil` remains plain caption text because Anil is offline-only and has no SNS identity. Composer tagging UX remains HOLD.

## Shared story state

Each album points to the existing Facebook story ID that introduced its media. Photo Detail Like and Comment actions use that story ID, so counts and user interactions remain shared with News Feed and Post Detail. Comment authors continue to use the existing navigable Facebook actor model.

## Sparse profiles and exclusions

Other canonical profiles and Ryan may expose an empty Photos section. Anil does not receive a Facebook profile or album. June, Jack, Matt, Alex, and Ben remain support-only until approved Facebook media exists. Instagram IG04 is not duplicated into Facebook Photos.

## Historical and HOLD boundaries

Classification: CURATED IA / CURATED media binding.

Modern Memories, Stories, Reels, automatic face grouping, and contemporary gallery chrome are rejected. Exact 2010 pixel-level album and photo-detail chrome remains HOLD for a later visual-fidelity pass.
