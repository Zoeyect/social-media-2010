# Facebook Tagged Photos Architecture v0.1

## Photos by vs Photos of

Facebook-owned albums are selected by `ownerActor`. `Photos of [Name]` is a separate aggregation over strict photo-level actor references. The tag actor model supports canonical characters and the Z.tokyo author-easter-egg identity; captions and visible `@Name` tokens are never tag sources. Legacy canonical `taggedCharacterIds` remain normalized through the same selector.

For v0.5.48, tagged aggregation includes only resolvable Facebook photo records whose owner differs from the tagged canonical character. This prevents an owned, self-tagged photo from appearing twice across the same Profile's owned and tagged surfaces.

## Canonical test cases

June's tagged view contains the single Sophie-owned `sophie-june-club-photo` record. Sophie remains owner in her Album, Wall, and Photo Detail; June receives only a tagged reference to the same `sophie-june-club-photo-story` interaction state.

Matt's tagged view exposes five Jack-owned media records across four historical stories from 2007–2010 plus two June-owned `10/18` show photos where he is visibly playing bass. These records remain absent from Matt-owned albums. Z.tokyo's tagged view exposes the June-owned backstage show photo where she is visibly present; she remains `AUTHOR_EASTER_EGG` and receives no owned show album.

Jack's external-owner test set now contains exactly nine tagged records. Mike owns `jack-football-game`; Sarah owns `jack-beach-10` and `jack-beach-8`; Sophie owns `jack-tagged-sophie-02` and `jack-tagged-sophie-03`; Luca owns `jack-tagged-luca-01`; Ryan owns `jack-tagged-ryan`; June owns `jack-tagged-june`; and Matt owns `jack-tagged-matt-02`. All structurally tag canonical Jack, retain their real uploader in Photo Detail, and appear only through `Photos of Jack`, never in Jack-owned albums. Jack-owned `jack-owned-j-2009` remains in Jack's `Photos` album and is deliberately excluded from `Photos of Jack`. No automatic “was tagged” Wall activity is added.

## Navigation and interaction sharing

Tagged gallery navigation records the tagged character but opens Photo Detail through the real owning album. Owner and tagged-person links reuse the Facebook-local profile stack, so Back returns through Photo Detail, `Photos of [Name]`, and the originating Profile Photos section. Likes and Comments remain keyed by the canonical photo `storyId`.

## Owner upload story distribution

Facebook photo distribution now keeps four concepts distinct: media ownership, tagged-photo membership, uploader Wall-story authorship, and tagged-person activity. The implemented pipeline is `owner uploads media → owner upload story → owner Wall → News Feed eligibility`; structured tags independently feed `Photos of [Character]`.

The model uses explicit seed story records because Wall and News Feed already share `FacebookFeedItem` state rather than deriving stories directly from album membership. Each story reuses its album photo's canonical `storyId`, media ID, owner, timestamp, caption, and tags, so Wall, Feed, Album, Photo Detail, and tagged-photo navigation converge on one interaction identity. Sophie's two August 24 photos remain two single-photo events because their existing records already have separate story IDs; no one-off grouped upload model was introduced.

No external upload creates an owner-style story on Jack's Wall. `Photos of Jack` remains a nine-photo external-owner aggregation, while Jack-owned `J.png` receives Jack's own distributable photo story and remains excluded from tagged aggregation. Automatic `Jack was tagged in a photo` Wall activity remains a separate HOLD layer.

## Canonical media relationships

Every registered Facebook album photo now carries its canonical `albumId` as part of the resolved photo record. Album membership comes only from the explicit album registry; it is never inferred from owner identity or tags. June's `Me` remains a real curated album for the home and Starbucks records, not a fallback bucket. `jack-tagged-june` belongs to June's separate `Photos` source album.

Profile Wall selection recognizes an owner upload story through `storyId → owning album → ownerActor`, in addition to ordinary visibility rules. News Feed and Wall still share the same canonical feed item rather than maintaining route-specific copies. Tags continue to affect only `Photos of [Character]`; they cannot rewrite owner, album, or story author. Existing Mike, Sarah, Sophie, Ryan, June, Luca, Matt, and Jack-owned photo records all follow this same relationship model.

## Boundaries

Anil has no Facebook account and cannot receive a tagged-profile surface or structured actor tag, even where he is visible or named. Instagram-only June media is not represented by Facebook album photo records and is therefore ineligible. No physical media is copied.

Automatic “was tagged in a photo” Wall stories, face-region overlays, exact 2010 tagged-photo chrome, and additional inferred tags remain HOLD.
