import zTokyoProfilePictureSrc from "../assets/facebook/characters/z-tokyo/profile/IMG_1423.JPG";
import { FACEBOOK_AUTHOR_EASTER_EGG_ID } from "./facebookActors";
import facebookDefaultAvatarSrc from "../assets/facebook/characters/photos/01.png";
import facebookAvatar00Src from "../assets/facebook/characters/photos/00.png";
import facebookAvatar02Src from "../assets/facebook/characters/photos/02.png";
import facebookAvatar03Src from "../assets/facebook/characters/photos/03.png";
import facebookAvatar05Src from "../assets/facebook/characters/photos/05.png";
import facebookAvatar06Src from "../assets/facebook/characters/photos/06.png";
import facebookAvatar07Src from "../assets/facebook/characters/photos/07.png";

export const FACEBOOK_MEDIA_IDS = ["z-tokyo-profile-picture", "facebook-default-avatar", "facebook-avatar-00", "facebook-avatar-02", "facebook-avatar-03", "facebook-avatar-05", "facebook-avatar-06", "facebook-avatar-07"] as const;
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
  "facebook-avatar-00": Object.freeze({ id: "facebook-avatar-00" as const, kind: "photo" as const, owner: Object.freeze({ kind: "facebook-ephemeral" as const }), src: facebookAvatar00Src, originalFilename: "00.png", classification: "CURATED / FACEBOOK_EPHEMERAL_AVATAR" as const, intendedUses: Object.freeze(["profile-picture", "actor-avatar"] as const) }),
  "facebook-avatar-02": Object.freeze({ id: "facebook-avatar-02" as const, kind: "photo" as const, owner: Object.freeze({ kind: "facebook-ephemeral" as const }), src: facebookAvatar02Src, originalFilename: "02.png", classification: "CURATED / FACEBOOK_EPHEMERAL_AVATAR" as const, intendedUses: Object.freeze(["profile-picture", "actor-avatar"] as const) }),
  "facebook-avatar-03": Object.freeze({ id: "facebook-avatar-03" as const, kind: "photo" as const, owner: Object.freeze({ kind: "facebook-ephemeral" as const }), src: facebookAvatar03Src, originalFilename: "03.png", classification: "CURATED / FACEBOOK_EPHEMERAL_AVATAR" as const, intendedUses: Object.freeze(["profile-picture", "actor-avatar"] as const) }),
  "facebook-avatar-05": Object.freeze({ id: "facebook-avatar-05" as const, kind: "photo" as const, owner: Object.freeze({ kind: "facebook-ephemeral" as const }), src: facebookAvatar05Src, originalFilename: "05.png", classification: "CURATED / FACEBOOK_EPHEMERAL_AVATAR" as const, intendedUses: Object.freeze(["profile-picture", "actor-avatar"] as const) }),
  "facebook-avatar-06": Object.freeze({ id: "facebook-avatar-06" as const, kind: "photo" as const, owner: Object.freeze({ kind: "facebook-ephemeral" as const }), src: facebookAvatar06Src, originalFilename: "06.png", classification: "CURATED / FACEBOOK_EPHEMERAL_AVATAR" as const, intendedUses: Object.freeze(["profile-picture", "actor-avatar"] as const) }),
  "facebook-avatar-07": Object.freeze({ id: "facebook-avatar-07" as const, kind: "photo" as const, owner: Object.freeze({ kind: "facebook-ephemeral" as const }), src: facebookAvatar07Src, originalFilename: "07.png", classification: "CURATED / FACEBOOK_EPHEMERAL_AVATAR" as const, intendedUses: Object.freeze(["profile-picture", "actor-avatar"] as const) }),
});

export function getFacebookMedia(mediaId: FacebookMediaId | undefined) {
  return mediaId ? FACEBOOK_MEDIA[mediaId] : null;
}
