# Instagram 1.0 Profile Historical Reconstruction v0.1

## Scope

This reconstruction targets Instagram 1.0-era iPhone profile structure on October 20, 2010, at a 320 by 480 logical viewport. The supplied period screenshot is the primary structural reference. Character behavior remains governed by `docs/CHARACTER_BIBLE_v1.0.md`.

## Screenshot anatomy

The evidenced hierarchy is:

1. Blue top navigation with Back, centered username and a context-sensitive right area.
2. Dark profile summary with a square avatar, display identity and three blue count blocks.
3. Photos, Followers and Following displayed as full integers.
4. A chronological vertical stream of large photos below the summary.

The reconstruction targets this hierarchy at B-level. Unsupported texture rasters and micro-geometry are not fabricated.

## June implementation

June uses `junepark` as the navigation title and `June` as the display name. `June01.PNG` is referenced without modification through shared media ID `june-profile-avatar` and displayed in a square crop container.

Her deterministic `CURATED DISPLAY` baselines are 118 Followers and 236 Following. Photos is derived from currently visible June posts, producing 3 at session start, 2 after IG04 deletion at T+200, and 3 after IG01 replacement at T+210.

The photo stream is newest-first and reuses the same canonical state from Following, Facebook-friend discovery and Feed-author navigation. Every post renders a small June avatar, `junepark`, a period-safe timestamp label and the existing 1:1 media surface.

## Rejected for target date

- Profile photo grid
- Profile biography
- Story rings and Highlights
- Reels or tagged-photo tabs
- Modern Follow, Message and Contact button rows
- Suggested users and modern menus

Profile grid and biography behavior belong to later Instagram versions and are not part of the October 2010 surface.

## Relationship and list boundaries

The user-to-June Follow relationship remains in the shared Instagram relationship graph. The current user's Following list contains the canonical June account. June's Followers and Following blocks expose list navigation semantics, but individual 118/236 account rows remain HOLD because no approved identities exist and filler accounts would fabricate her social graph.

## HOLD

- Exact other-user Follow/Following control artwork and placement
- Exact dark texture raster
- Exact timestamp typography
- Exact right-navigation action chrome
- Complete June follower/following row data

## Validation state

Automated state, chronology, source-structure and build checks are required. Manual visual confirmation remains pending and the June narrative must not be marked FROZEN until the browser path is inspected.
