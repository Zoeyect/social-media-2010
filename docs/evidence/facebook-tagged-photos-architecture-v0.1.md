# Facebook Tagged Photos Architecture v0.1

## Photos by vs Photos of

Facebook-owned albums are selected by `ownerActor`. `Photos of [Name]` is a separate aggregation over strict photo-level actor references. The tag actor model supports canonical characters and the Z.tokyo author-easter-egg identity; captions and visible `@Name` tokens are never tag sources. Legacy canonical `taggedCharacterIds` remain normalized through the same selector.

For v0.5.48, tagged aggregation includes only resolvable Facebook photo records whose owner differs from the tagged canonical character. This prevents an owned, self-tagged photo from appearing twice across the same Profile's owned and tagged surfaces.

## Canonical test cases

June's tagged view contains the single Sophie-owned `sophie-june-club-photo` record. Sophie remains owner in her Album, Wall, and Photo Detail; June receives only a tagged reference to the same `sophie-june-club-photo-story` interaction state.

Matt's tagged view exposes five Jack-owned media records across four historical stories from 2007–2010 plus two June-owned `10/18` show photos where he is visibly playing bass. These records remain absent from Matt-owned albums. Z.tokyo's tagged view exposes the June-owned backstage show photo where she is visibly present; she remains `AUTHOR_EASTER_EGG` and receives no owned show album. Jack's currently safe structured tags are self-owned, so `Photos of Jack` is omitted rather than populated with duplicates or invented content.

## Navigation and interaction sharing

Tagged gallery navigation records the tagged character but opens Photo Detail through the real owning album. Owner and tagged-person links reuse the Facebook-local profile stack, so Back returns through Photo Detail, `Photos of [Name]`, and the originating Profile Photos section. Likes and Comments remain keyed by the canonical photo `storyId`.

## Boundaries

Anil has no Facebook account and cannot receive a tagged-profile surface or structured actor tag, even where he is visible or named. Instagram-only June media is not represented by Facebook album photo records and is therefore ineligible. No physical media is copied.

Automatic “was tagged in a photo” Wall stories, face-region overlays, exact 2010 tagged-photo chrome, and additional inferred tags remain HOLD.
