import juneIg01Src from "../assets/characters/June/IG01.JPG";
import juneIg02Src from "../assets/characters/June/IG02.JPG";
import juneIg03Src from "../assets/characters/June/IG03.JPG";
import juneIg04Src from "../assets/characters/June/IG04.JPG";
import juneProfileAvatarSrc from "../assets/characters/June/June01.PNG";
import katieBenFamilySrc from "../assets/characters/Ben/Katie-Ben.JPG";
import jayGuitarSrc from "../assets/characters/Jay/Jay01.PNG";
import jayGuitarMaySrc from "../assets/characters/Jay/Jay02.PNG";
import jayBandPerformanceSrc from "../assets/characters/Jay/10-18.JPG";
import katieJuly2009Src from "../assets/characters/Katie/Katie01.jpg";
import katieAugust2009Src from "../assets/characters/Katie/Katie02.jpg";
import katieProfilePictureSrc from "../assets/characters/Katie/Katie03.PNG";
import katieJuly2010Src from "../assets/characters/Katie/Katie04.jpg";
import katieSeptember2010Src from "../assets/characters/Katie/Katie05.jpg";
import lucaProfilePictureSrc from "../assets/characters/Luca/Luca.png";
import lucaBasketball01Src from "../assets/characters/Luca/guys.png";
import lucaBasketball02Src from "../assets/characters/Luca/guys02.PNG";
import lucaBasketball03Src from "../assets/characters/Luca/guys03.png";
import lucaWorkSrc from "../assets/characters/Luca/Luca-work.png";
import alexProfilePictureSrc from "../assets/characters/Alex/Alex.png";
import alexGoldenDog2007Src from "../assets/characters/Alex/Alex01.PNG";
import alexDogs2009Src from "../assets/characters/Alex/Alex-dogs.PNG";
import type { CoreSocialCharacterId } from "./coreSocialFriends";

export const SHARED_CHARACTER_MEDIA_IDS = ["june-ig-01", "june-ig-02", "june-ig-03", "june-ig-04", "june-profile-avatar", "katie-ben-family", "jay-guitar", "jay-guitar-may", "jay-band-performance", "katie-selfie-july-2009", "katie-selfie-august-2009", "katie-profile-picture", "katie-selfie-july-2010", "katie-selfie-september-2010", "luca-profile-picture", "luca-basketball-01", "luca-basketball-02", "luca-basketball-03", "luca-work-main-street-diner", "alex-profile-picture", "alex-dog-golden-2007", "alex-dogs-wangcai-bb-2009"] as const;
export type SharedCharacterMediaId = typeof SHARED_CHARACTER_MEDIA_IDS[number];

export type SharedCharacterMedia = Readonly<{
  id: SharedCharacterMediaId;
  src: string;
  originalFilename: string;
  canonicalCharacterId: CoreSocialCharacterId;
  characterIds: readonly CoreSocialCharacterId[];
  platform: "instagram" | "facebook";
  timestamp: string;
  role: "replacement" | "nightclub-dancing" | "party" | "accidental-intimate" | "profile-avatar" | "basketball-friends" | "family-context" | "music-context" | "music-guitar-still-life" | "band-performance" | "facebook-profile-picture" | "facebook-selfie" | "restaurant-work" | "dog-history";
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
  "katie-selfie-july-2009": Object.freeze({ id: "katie-selfie-july-2009", src: katieJuly2009Src, originalFilename: "Katie01.jpg", canonicalCharacterId: "katie", characterIds: Object.freeze(["katie"] as const), platform: "facebook", timestamp: "2009-07-18T17:00:00-07:00", role: "facebook-selfie", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "katie-selfie-august-2009": Object.freeze({ id: "katie-selfie-august-2009", src: katieAugust2009Src, originalFilename: "Katie02.jpg", canonicalCharacterId: "katie", characterIds: Object.freeze(["katie"] as const), platform: "facebook", timestamp: "2009-08-22T16:00:00-07:00", role: "facebook-selfie", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "katie-profile-picture": Object.freeze({ id: "katie-profile-picture", src: katieProfilePictureSrc, originalFilename: "Katie03.PNG", canonicalCharacterId: "katie", characterIds: Object.freeze(["katie"] as const), platform: "facebook", timestamp: "2010-10-10T16:00:00-07:00", role: "facebook-profile-picture", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "katie-selfie-july-2010": Object.freeze({ id: "katie-selfie-july-2010", src: katieJuly2010Src, originalFilename: "Katie04.jpg", canonicalCharacterId: "katie", characterIds: Object.freeze(["katie"] as const), platform: "facebook", timestamp: "2010-07-17T15:00:00-07:00", role: "facebook-selfie", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "katie-selfie-september-2010": Object.freeze({ id: "katie-selfie-september-2010", src: katieSeptember2010Src, originalFilename: "Katie05.jpg", canonicalCharacterId: "katie", characterIds: Object.freeze(["katie"] as const), platform: "facebook", timestamp: "2010-09-11T14:00:00-07:00", role: "facebook-selfie", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "luca-profile-picture": Object.freeze({ id: "luca-profile-picture", src: lucaProfilePictureSrc, originalFilename: "Luca.png", canonicalCharacterId: "luca", characterIds: Object.freeze(["luca"] as const), platform: "facebook", timestamp: "2010-10-20", role: "facebook-profile-picture", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-album"] as const) }),
  "luca-basketball-01": Object.freeze({ id: "luca-basketball-01", src: lucaBasketball01Src, originalFilename: "guys.png", canonicalCharacterId: "luca", characterIds: Object.freeze(["luca", "chris"] as const), platform: "facebook", timestamp: "2010-10-19T22:58:00-07:00", role: "basketball-friends", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "luca-basketball-02": Object.freeze({ id: "luca-basketball-02", src: lucaBasketball02Src, originalFilename: "guys02.PNG", canonicalCharacterId: "luca", characterIds: Object.freeze(["luca", "chris"] as const), platform: "facebook", timestamp: "2010-10-19T22:58:00-07:00", role: "basketball-friends", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "luca-basketball-03": Object.freeze({ id: "luca-basketball-03", src: lucaBasketball03Src, originalFilename: "guys03.png", canonicalCharacterId: "luca", characterIds: Object.freeze(["luca", "chris"] as const), platform: "facebook", timestamp: "2010-10-19T22:58:00-07:00", role: "basketball-friends", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "luca-work-main-street-diner": Object.freeze({ id: "luca-work-main-street-diner", src: lucaWorkSrc, originalFilename: "Luca-work.png", canonicalCharacterId: "luca", characterIds: Object.freeze(["luca"] as const), platform: "facebook", timestamp: "2010-03-20T22:30:00-07:00", role: "restaurant-work", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "alex-profile-picture": Object.freeze({ id: "alex-profile-picture", src: alexProfilePictureSrc, originalFilename: "Alex.png", canonicalCharacterId: "alex", characterIds: Object.freeze(["alex"] as const), platform: "facebook", timestamp: "2010-10-01T16:00:00-07:00", role: "facebook-profile-picture", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "alex-dog-golden-2007": Object.freeze({ id: "alex-dog-golden-2007", src: alexGoldenDog2007Src, originalFilename: "Alex01.PNG", canonicalCharacterId: "alex", characterIds: Object.freeze(["alex"] as const), platform: "facebook", timestamp: "2007-10-03T16:00:00-07:00", role: "dog-history", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
  "alex-dogs-wangcai-bb-2009": Object.freeze({ id: "alex-dogs-wangcai-bb-2009", src: alexDogs2009Src, originalFilename: "Alex-dogs.PNG", canonicalCharacterId: "alex", characterIds: Object.freeze(["alex"] as const), platform: "facebook", timestamp: "2009-05-08T16:00:00-07:00", role: "dog-history", initialVisibility: "visible", classification: "CURATED", approvedUses: Object.freeze(["character-photo", "facebook-story", "facebook-album"] as const) }),
});

export function getSharedCharacterMedia(mediaId: SharedCharacterMediaId) {
  return SHARED_CHARACTER_MEDIA[mediaId];
}
