import zTokyoProfilePictureSrc from "../assets/facebook/characters/z-tokyo/profile/IMG_1423.JPG";
import { FACEBOOK_AUTHOR_EASTER_EGG_ID } from "./facebookActors";
import facebookDefaultAvatarSrc from "../assets/facebook/characters/photos/01.png";

export const FACEBOOK_MEDIA_IDS = ["z-tokyo-profile-picture", "facebook-default-avatar"] as const;
export type FacebookMediaId = typeof FACEBOOK_MEDIA_IDS[number];

export const FACEBOOK_MEDIA = Object.freeze({
  "z-tokyo-profile-picture": Object.freeze({
    id: "z-tokyo-profile-picture" as const,
    kind: "photo" as const,
    owner: Object.freeze({ kind: "author-easter-egg" as const, authorId: FACEBOOK_AUTHOR_EASTER_EGG_ID }),
    src: zTokyoProfilePictureSrc,
    originalFilename: "IMG_1423.JPG",
    sha256: "46c233ae6b8425ba90008df67e64a3bbe8066457c4d12c524d7576efc5419021",
    classification: "CURATED / AUTHOR_EASTER_EGG" as const,
    intendedUses: Object.freeze(["profile-picture", "wall-activity", "photos", "profile-pictures-album"] as const),
    surfaceStatus: Object.freeze({
      profilePicture: "READY" as const,
      wallActivity: "READY" as const,
      photos: "READY" as const,
      profilePicturesAlbum: "READY" as const,
    }),
  }),
  "facebook-default-avatar": Object.freeze({
    id: "facebook-default-avatar" as const,
    kind: "photo" as const,
    owner: Object.freeze({ kind: "facebook-default" as const }),
    src: facebookDefaultAvatarSrc,
    originalFilename: "01.png",
    classification: "CURATED / FACEBOOK_DEFAULT" as const,
    intendedUses: Object.freeze(["profile-picture", "actor-avatar"] as const),
  }),
});

export function getFacebookMedia(mediaId: FacebookMediaId | undefined) {
  return mediaId ? FACEBOOK_MEDIA[mediaId] : null;
}
