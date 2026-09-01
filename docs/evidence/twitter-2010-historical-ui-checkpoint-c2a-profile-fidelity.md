# Twitter Historical UI — Checkpoint C2a Profile Fidelity

## Scope

Checkpoint C2a changes only the Profile content presentation: its secondary-screen material, identity geometry and typography, conditional metadata group, four-cell statistics group, and removal of visible developer/provenance copy. It does not change Twitter state, canonical account records, navigation events, Profile content/Tweets, Follow behavior, Search, More, or any other root surface.

Target: Twitter for iPhone 3.0.x, iPhone 4, iOS 4.1, October 2010.

## Evidence and classifications

The primary visual source is Twitter's direct 2010 first-party Profile capture. Tweetie 2 / close-period material is supporting lineage evidence only.

| Decision | Classification |
| --- | --- |
| Profile secondary-screen pinstripe material | `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT` |
| 48×48 avatar at content x=12/y=13; 74px identity region | `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT` |
| Display name 17/20 bold; handle 14/17 subdued | `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT` |
| Verification feature and compact period presentation existed | `CONFIRMED` / `PERIOD-SUPPORTED` |
| Badge state for current Kanye West and Conan O'Brien records | `HOLD`; no visible badge rendered |
| Additional user-ID/account line existed | `CONFIRMED`; project data unavailable, therefore `HOLD` and omitted |
| Grouped biography/location/web structure | `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT` |
| Statistics order: Following/Tweets, Followers/Favorites | `CONFIRMED` |
| 300×90 statistics geometry and typography | `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT` |

Initial avatars remain project placeholders. Their initials and source identity are unchanged; they are not authenticated profile portraits.

## Presentation

The 74px identity region places the existing 48px avatar at x=12/y=13 and starts identity text at x=70. The name uses 17/20 period Helvetica-family typography; the unchanged handle uses 14/17 subdued text. No visible verification marker is rendered because account-specific target-date badge evidence remains unresolved. Underlying `verified` data is preserved.

Metadata is rendered only from approved Profile metadata. Existing fictional biography/location/web strings are preserved exactly. The session-owner fallback biography/location is suppressed in presentation, Suggested Users category subtitles are not reinterpreted as Profile biography, and the public-figure provenance subtitle is omitted. No empty row, fabricated location, website, or user ID is introduced.

The metadata group uses a 300px-wide rounded period container at x=9. Biography rows have a 56px minimum; location and web rows have a 44px minimum. Thin internal separators divide only present rows. Web text uses a subdued period-blue treatment without a modern external-link glyph.

The statistics group remains ordered Following/Tweets, Followers/Favorites. It is 300×90px at x=9, divided into two 150px columns and two 45px rows. Existing count values and `formatProfileCount` behavior are unchanged. Only the existing owner Following route remains interactive.

## Visible leakage removed

The Profile renderer no longer exposes session-owner explanation copy, CURATED-count provenance, public-figure partial-metadata provenance, literal verification text, or the owner location fallback. Those underlying records and fields are unchanged because C2a is a presentation-only checkpoint.

## Architecture locks and HOLD items

The direct historical Profile reference uses a Profile-local four-icon toolbar. The implementation continues to render the existing five root tabs. This mismatch is `CONFIRMED`; the implementation remains `HOLD` pending a later navigation-architecture decision. C2a does not style around or reinterpret that mismatch.

The existing Follow/Unfollow control dimensions and behavior are unchanged and remain reserved for C2b. Exact original Profile raster colors, metadata labels/icons, grouped-container cap/stretch artwork, user-ID values, verification badge state, and profile-local toolbar behavior remain `HOLD`.

## Preserved invariants

- More → My Profile → Back restores More.
- Search → My Profile → Back restores Search.
- Timeline-origin Profile Back and strict root-tab navigation are unchanged.
- Follow graph, statistics, Tweets, Mentions, DMs, unread state, scroll state, scheduler delivery, and RESET behavior are unchanged.
- The 44px Twitter navigation bar and 43px five-tab root bar are unchanged.
- No state, seed, scheduler, or asset file changes are part of C2a.
