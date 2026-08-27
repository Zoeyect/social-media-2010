# Facebook Wall / Photos / Albums Consistency Audit v0.1

## Scope

This audit checks the canonical Facebook path `Wall -> Album -> Photo Detail`. It distinguishes Wall activity copy, album titles, individual captions, and comments instead of forcing those semantic layers to use identical text. No image, new drama, Tagged Photos surface, or visual-fidelity treatment was added.

## Repairs

- June `10/18` and `18th Birthday` now use shared ordered media-ID constants in both Wall and Album data. Their visible `N photos` values derive from those arrays.
- June birthday Wall copy remains `added 3 new photos. best night ever ♥`; the main-photo caption remains independently `happy 18th, June ♥ 생일 축하해`.
- Batch-upload Photo Detail records use the same upload timestamp as their Wall story. Per-file asset identity remains unchanged.
- Album-story media counts render from successfully resolved media records, not a cosmetic count field.
- Luca's approved current `Luca.png` media now appears in an album-only `Profile Pictures` record. No unsupported profile-picture Wall story was invented.
- Strict validation now covers album counts, ordered media membership, centralized media resolution, Photo Detail routing, album-story copy/count/title bindings, shared timestamps, and the existing June Facebook asset exclusion.

## Interaction ownership

June's show engagement belongs to `june-show-photos-oct19`; all three Photo Detail entries intentionally address that one upload-story state. Birthday engagement similarly belongs to `june-18th-birthday-photos`, not to three independent photo stories. Single-photo histories use their registered photo story IDs. Sharing a physical image does not merge story state: Ben's ordinary `ben-photo-friday-2010` and profile update `ben-profile-current-update` remain independent.

## Final matrix

| Actor | Wall | Albums | Detail | Interaction | Result |
|---|---|---|---|---|---|
| June | Show and birthday upload stories bind exact media sets; daily-life and history stories remain scoped by visibility | Six owned albums; `Me` is the visible daily-life title | Caption, album, owner, timestamp, and media derive from photo records | Show and birthday use explicit upload-story IDs | CONSISTENT / REPAIRED |
| Ben | Ordinary Ben01 and profile update remain separate stories | Profile Pictures and Photos | Same physical source resolves through distinct usages | Separate story IDs | CONSISTENT |
| Katie | September photo owns Ben's sibling-banter thread | Profile Pictures and Photos | Canonical September record | Comment stays on `katie-selfie-september-2010` | CONSISTENT |
| Alex | Historical dog stories remain outside the current Feed | Profile Pictures and Dogs | `旺財&BB` and dates remain canonical | Per-photo story IDs | CONSISTENT |
| Luca | Pickup Basketball is three photos; work history remains scoped; no invented avatar Wall story | Profile Pictures, Pickup Basketball, Photos | Venue and album records are canonical | Basketball shares `luca-pickup-basketball-photos` | CONSISTENT / REPAIRED |
| Jay | Band post and historical guitar activities stay distinct | Music | Captions and Oct 19 timestamp derive from photo records | Band engagement stays on band story | CONSISTENT |
| Matt | Code photo and profile-picture histories stay distinct | Profile Pictures and Photos | Code media resolves from `matt-code-2010` | Coder comments stay on `matt-code-photo-2010` | CONSISTENT |
| Chris | Sparse profile-picture history only | Profile Pictures | One approved image | Profile-picture story key only | CONSISTENT |
| Z.tokyo | Existing profile-picture update remains peripheral | Profile Pictures | Central author media resolver | Existing story key | CONSISTENT |
| Jack | Implemented owned Wall history plus externally owned tagged presence | Profile Pictures, Summer, 18th Birthday, Photos | Canonical owner/album/story resolution | Shared story IDs | CONSISTENT / SUPERSEDED OLD HOLD |

## Historical archive and HOLD boundaries

Album-only history is valid and does not require a new Wall story. Instagram `IG01` through `IG04`, `June-Jack-club.png`, and `June-Jack-kiss.png` remain excluded from Facebook. **DEPRECATED:** the former Tagged Photos deferral is superseded by implemented owner-safe tagged aggregation.

## Unified rendering resolution

Profile Wall now renders the same canonical story component as News Feed. Existing Wall stories therefore expose their registered media, structured mentions, current timestamp formatting, real Like/Comment summaries, and shared actions instead of a text-only activity row. Post Detail and Photo Detail both use the single actor-aware comment row and centralized avatar resolver.

June's birthday batch upload retains engagement on `june-18th-birthday-photos`; its three individual Photo Detail records use separate `june-birthday-*-photo` interaction IDs linked through `uploadStoryId`. June show and Luca basketball remain intentionally upload-story-owned interactions. These policies are explicit rather than inferred from physical media reuse.
