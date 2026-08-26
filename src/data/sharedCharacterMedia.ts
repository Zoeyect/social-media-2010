import juneIg01Src from "../assets/characters/June/IG01.JPG";
import juneIg02Src from "../assets/characters/June/IG02.JPG";
import juneIg03Src from "../assets/characters/June/IG03.JPG";
import juneIg04Src from "../assets/characters/June/IG04.JPG";
import juneProfileAvatarSrc from "../assets/characters/June/June01.PNG";
import chrisLucaBasketballSrc from "../assets/characters/Chris/Chris-Luca.PNG";
import katieBenFamilySrc from "../assets/characters/Ben/Katie-Ben.JPG";
import jayGuitarSrc from "../assets/characters/Jay/Jay01.PNG";
import jayGuitarMaySrc from "../assets/characters/Jay/Jay02.PNG";
import jayBandPerformanceSrc from "../assets/characters/Jay/10-18.JPG";
import type { CoreSocialCharacterId } from "./coreSocialFriends";

export const SHARED_CHARACTER_MEDIA_IDS = ["june-ig-01", "june-ig-02", "june-ig-03", "june-ig-04", "june-profile-avatar", "chris-luca-basketball", "katie-ben-family", "jay-guitar", "jay-guitar-may", "jay-band-performance"] as const;
export type SharedCharacterMediaId = typeof SHARED_CHARACTER_MEDIA_IDS[number];

export type SharedCharacterMedia = Readonly<{
  id: SharedCharacterMediaId;
  src: string;
  originalFilename: string;
  canonicalCharacterId: CoreSocialCharacterId;
  characterIds: readonly CoreSocialCharacterId[];
  platform: "instagram" | "facebook";
  timestamp: string;
  role: "replacement" | "nightclub-dancing" | "party" | "accidental-intimate" | "profile-avatar" | "basketball-friends" | "family-context" | "music-context" | "music-guitar-still-life" | "band-performance";
  initialVisibility: "visible" | "hidden";
  classification: "CURATED";
  approvedUses: readonly ("instagram-post" | "character-photo" | "facebook-story" | "facebook-album")[];
}>;

export const SHARED_CHARACTER_MEDIA: Readonly<Record<SharedCharacterMediaId, SharedCharacterMedia>> = Object.freeze({
  "june-ig-01": Object.freeze({
    id: "june-ig-01",
    src: juneIg01Src,
    originalFilename: "IG01.JPG",
    canonicalCharacterId: "june",
    characterIds: Object.freeze(["june"] as const),
    platform: "instagram",
    timestamp: "2010-10-20T00:05:30-07:00",
    role: "replacement",
    initialVisibility: "hidden",
    classification: "CURATED",
    approvedUses: Object.freeze(["instagram-post", "character-photo"] as const),
  }),
  "june-ig-02": Object.freeze({
    id: "june-ig-02",
    src: juneIg02Src,
    originalFilename: "IG02.JPG",
    canonicalCharacterId: "june",
    characterIds: Object.freeze(["june"] as const),
    platform: "instagram",
    timestamp: "2010-10-15",
    role: "nightclub-dancing",
    initialVisibility: "visible",
    classification: "CURATED",
    approvedUses: Object.freeze(["instagram-post", "character-photo"] as const),
  }),
  "june-ig-03": Object.freeze({
    id: "june-ig-03",
    src: juneIg03Src,
    originalFilename: "IG03.JPG",
    canonicalCharacterId: "june",
    characterIds: Object.freeze(["june"] as const),
    platform: "instagram",
    timestamp: "2010-10-16",
    role: "party",
    initialVisibility: "visible",
    classification: "CURATED",
    approvedUses: Object.freeze(["instagram-post", "character-photo"] as const),
  }),
  "june-ig-04": Object.freeze({
    id: "june-ig-04",
    src: juneIg04Src,
    originalFilename: "IG04.JPG",
    canonicalCharacterId: "june",
    characterIds: Object.freeze(["june", "jack"] as const),
    platform: "instagram",
    timestamp: "2010-10-20T00:00:00-07:00",
    role: "accidental-intimate",
    initialVisibility: "visible",
    classification: "CURATED",
    approvedUses: Object.freeze(["instagram-post", "character-photo"] as const),
  }),
  "june-profile-avatar": Object.freeze({
    id: "june-profile-avatar",
    src: juneProfileAvatarSrc,
    originalFilename: "June01.PNG",
    canonicalCharacterId: "june",
    characterIds: Object.freeze(["june"] as const),
    platform: "instagram",
    timestamp: "2010-10-20",
    role: "profile-avatar",
    initialVisibility: "visible",
    classification: "CURATED",
    approvedUses: Object.freeze(["character-photo"] as const),
  }),
  "chris-luca-basketball": Object.freeze({
    id: "chris-luca-basketball",
    src: chrisLucaBasketballSrc,
    originalFilename: "Chris-Luca.PNG",
    canonicalCharacterId: "luca",
    characterIds: Object.freeze(["luca", "chris"] as const),
    platform: "facebook",
    timestamp: "2010-10-19T22:58:00-07:00",
    role: "basketball-friends",
    initialVisibility: "visible",
    classification: "CURATED",
    approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const),
  }),
  "katie-ben-family": Object.freeze({
    id: "katie-ben-family",
    src: katieBenFamilySrc,
    originalFilename: "Katie-Ben.JPG",
    canonicalCharacterId: "katie",
    characterIds: Object.freeze(["katie", "ben"] as const),
    platform: "facebook",
    timestamp: "2010-10-18T19:24:00-07:00",
    role: "family-context",
    initialVisibility: "visible",
    classification: "CURATED",
    approvedUses: Object.freeze(["character-photo", "facebook-story"] as const),
  }),
  "jay-guitar": Object.freeze({
    id: "jay-guitar",
    src: jayGuitarSrc,
    originalFilename: "Jay01.PNG",
    canonicalCharacterId: "jay",
    characterIds: Object.freeze(["jay"] as const),
    platform: "facebook",
    timestamp: "2010-10-17T21:12:00-07:00",
    role: "music-context",
    initialVisibility: "visible",
    classification: "CURATED",
    approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const),
  }),
  "jay-guitar-may": Object.freeze({
    id: "jay-guitar-may",
    src: jayGuitarMaySrc,
    originalFilename: "Jay02.PNG",
    canonicalCharacterId: "jay",
    characterIds: Object.freeze(["jay"] as const),
    platform: "facebook",
    timestamp: "2010-05-15T18:00:00-07:00",
    role: "music-guitar-still-life",
    initialVisibility: "visible",
    classification: "CURATED",
    approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const),
  }),
  "jay-band-performance": Object.freeze({
    id: "jay-band-performance",
    src: jayBandPerformanceSrc,
    originalFilename: "10-18.JPG",
    canonicalCharacterId: "jay",
    characterIds: Object.freeze(["jay", "matt"] as const),
    platform: "facebook",
    timestamp: "2010-10-19T22:00:00-07:00",
    role: "band-performance",
    initialVisibility: "visible",
    classification: "CURATED",
    approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const),
  }),
});

export function getSharedCharacterMedia(mediaId: SharedCharacterMediaId) {
  return SHARED_CHARACTER_MEDIA[mediaId];
}
