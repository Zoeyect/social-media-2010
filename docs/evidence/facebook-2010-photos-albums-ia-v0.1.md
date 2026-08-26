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
- Jay: Music

Album and photo counts derive from registered media IDs. Each album currently contains one approved image. No placeholders are fabricated to match narrative copy.

## Shared story state

Each album points to the existing Facebook story ID that introduced its media. Photo Detail Like and Comment actions use that story ID, so counts and user interactions remain shared with News Feed and Post Detail. Comment authors continue to use the existing navigable Facebook actor model.

## Sparse profiles and exclusions

Other canonical profiles and Ryan may expose an empty Photos section. Anil does not receive a Facebook profile or album. June, Jack, Matt, Alex, and Ben remain support-only until approved Facebook media exists. Instagram IG04 is not duplicated into Facebook Photos.

## Historical and HOLD boundaries

Classification: CURATED IA / CURATED media binding.

Modern Memories, Stories, Reels, automatic face grouping, and contemporary gallery chrome are rejected. Exact 2010 pixel-level album and photo-detail chrome remains HOLD for a later visual-fidelity pass.
