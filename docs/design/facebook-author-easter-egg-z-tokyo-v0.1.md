# Facebook Author Easter Egg: Z.tokyo v0.1

## Purpose

Z.tokyo is a quiet author self-cameo within the audited 2010 Facebook experience. The identity appears as an ordinary peripheral person and is never labeled author, creator or easter egg in UI. It is not required to understand June, Jack, the party storyline or any other narrative.

## Identity classification

The Facebook-local identity is:

| Field | Value |
| --- | --- |
| ID | `author-z-tokyo` |
| Display name | Z.tokyo |
| Classification | `AUTHOR_EASTER_EGG` |
| Content provenance | `CURATED / AUTHOR_EASTER_EGG` |

`facebookActors.ts` keeps this identity outside `CORE_SOCIAL_CHARACTERS`. Facebook Feed actors use a discriminated `author-easter-egg` branch rather than weakening canonical character IDs to unrestricted strings.

## Feed appearance

One older pre-session seed story appears at October 18, 2010, 8:52 PM:

> Z.tokyo updated her profile picture.

It is a normal `photoActivity` story, consumes no scheduler event and has no special badge, explanation or visual treatment.

## Profile route

The existing Feed avatar and author-name controls both open the existing Facebook Profile route. Z.tokyo's profile uses the same Wall, Info, Photos and Friends sections as other profiles. Wall selects the same single seed story by author name; no duplicate wall record is created.

Info and Friends remain sparse. Photos remains an empty HOLD surface apart from the current profile image shown in the profile header. No school, employer, hometown, birthday, relationship or canonical-character relationship is invented.

## Avatar asset provenance

The supplied original was located at `/Users/zoey/Downloads/IMG_1423.JPG`. The project copy is stored at `src/assets/facebook/characters/z-tokyo/profile/IMG_1423.JPG`.

Both files produced SHA-256:

```text
46c233ae6b8425ba90008df67e64a3bbe8066457c4d12c524d7576efc5419021
```

Because the bytes were already identical, the existing project file was retained without overwrite. No resize, conversion, regeneration, stylization or AI alteration was performed. CSS displays the original local asset within period-sized avatar/profile slots without creating a derivative.

## Centralized media model

`facebookMedia.ts` is the only source import for the portrait. Feed and Profile components resolve the same `z-tokyo-profile-picture` media ID through `getFacebookMedia`.

The record reserves four semantic uses:

- Profile Picture: READY
- Wall activity: READY
- Photos: HOLD
- Profile Pictures album: HOLD

This allows future Photos work to reuse one media entity without independently importing or copying the image. Full Photos and Profile Pictures album UI are not built in v0.1.

## Historical and HOLD boundaries

The Z.tokyo account is intentional meta fiction, not historical evidence. The surrounding Feed activity wording and Facebook IA follow the existing 2010 audit. Exact image crop behavior, a full photo detail route, albums, additional photos and richer profile data remain HOLD.

The nine canonical character IDs, June/Jack logic, scheduler, Cross-App Timeline, other apps and global device behavior remain unchanged.
