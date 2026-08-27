import type { CoreSocialCharacterId } from "./coreSocialFriends";
import type { FacebookAuthorEasterEggId, FacebookEphemeralFriendOfFriendId } from "./facebookActors";
import type { FacebookStoryMediaId } from "./facebookStoryMedia";
import type { CanonicalVenueId } from "./canonicalVenues";
import { getFacebookStoryMedia } from "./facebookStoryMedia";

export const FACEBOOK_ALBUM_IDS = Object.freeze([
  "z-tokyo-profile-pictures",
  "sophie-photos",
  "june-profile-pictures",
  "june-show-10-18",
  "june-18th-birthday",
  "june-girls",
  "june-senior-year",
  "june-mobile-uploads",
  "jack-profile-pictures",
  "jack-football",
  "jack-summer",
  "jack-photos",
  "luca-profile-pictures",
  "luca-pickup-basketball",
  "luca-photos",
  "alex-profile-pictures",
  "alex-dogs",
  "ben-profile-pictures",
  "ben-photos",
  "chris-profile-pictures",
  "matt-profile-pictures",
  "matt-photos",
  "katie-profile-pictures",
  "katie-photo-history",
  "jay-music",
] as const);

export type FacebookAlbumId = typeof FACEBOOK_ALBUM_IDS[number];

export type FacebookAlbumActor =
  | { kind: "canonical"; characterId: CoreSocialCharacterId; displayName: string }
  | { kind: "ephemeral-friend-of-friend"; ephemeralId: FacebookEphemeralFriendOfFriendId; displayName: string; classification: "EPHEMERAL_FRIEND_OF_FRIEND" }
  | { kind: "session-user"; displayName: string }
  | { kind: "author-easter-egg"; authorId: FacebookAuthorEasterEggId; displayName: string };

export type FacebookAlbum = {
  id: FacebookAlbumId;
  ownerActor: FacebookAlbumActor;
  title: string;
  mediaIds: readonly FacebookStoryMediaId[];
  photos: readonly FacebookAlbumPhoto[];
  classification: "CURATED";
};

export type FacebookAlbumPhoto = {
  mediaId: FacebookStoryMediaId;
  storyId: string;
  uploadStoryId?: string;
  timestamp: string;
  caption?: string;
  venueId?: CanonicalVenueId;
  taggedCharacterIds?: readonly CoreSocialCharacterId[];
  taggedActors?: readonly FacebookPhotoTagActor[];
  classification: "CURATED";
};

export type FacebookPhotoTagActor =
  | { kind: "canonical"; characterId: CoreSocialCharacterId }
  | { kind: "author-easter-egg"; authorId: FacebookAuthorEasterEggId };

export type FacebookTaggedPhotoRecord = {
  album: FacebookAlbum;
  photo: FacebookAlbumPhoto;
};

export const LUCA_PICKUP_BASKETBALL_MEDIA_IDS = Object.freeze([
  "luca-basketball-01",
  "luca-basketball-02",
  "luca-basketball-03",
] as const satisfies readonly FacebookStoryMediaId[]);

export const JUNE_SHOW_MEDIA_IDS = Object.freeze([
  "june-fb-F",
  "june-fb-10-18-01",
  "june-fb-10-18-02",
] as const satisfies readonly FacebookStoryMediaId[]);

export const JUNE_BIRTHDAY_MEDIA_IDS = Object.freeze([
  "june-birthday-bag",
  "june-birthday-gift",
  "june-birthday-main",
] as const satisfies readonly FacebookStoryMediaId[]);

const JUNE_BIRTHDAY_PHOTO_STORY_IDS = Object.freeze({
  "june-birthday-bag": "june-birthday-bag-photo",
  "june-birthday-gift": "june-birthday-gift-photo",
  "june-birthday-main": "june-birthday-main-photo",
} as const satisfies Record<typeof JUNE_BIRTHDAY_MEDIA_IDS[number], string>);

function defineFacebookAlbum(definition: Omit<FacebookAlbum, "mediaIds">): FacebookAlbum {
  const photos = Object.freeze([...definition.photos].sort((left, right) => right.timestamp.localeCompare(left.timestamp)));
  return Object.freeze({ ...definition, photos, mediaIds: Object.freeze(photos.map(photo => photo.mediaId)) });
}

export const FACEBOOK_ALBUMS: readonly FacebookAlbum[] = Object.freeze([
  defineFacebookAlbum({ id: "z-tokyo-profile-pictures", ownerActor: Object.freeze({ kind: "author-easter-egg" as const, authorId: "author-z-tokyo" as const, displayName: "Z.tokyo" }), title: "Profile Pictures", photos: Object.freeze([{ mediaId: "z-tokyo-profile-picture" as const, storyId: "z-tokyo-profile-picture-update", timestamp: "2010-10-18T20:52:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "sophie-photos", ownerActor: Object.freeze({ kind: "ephemeral-friend-of-friend" as const, ephemeralId: "facebook-ephemeral-sophie", displayName: "Sophie Miller", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }), title: "Photos", photos: Object.freeze([{ mediaId: "sophie-june-club-photo" as const, storyId: "sophie-june-club-photo-story", timestamp: "2010-10-16T02:57:00-07:00", caption: "bestie ♥ @June", taggedCharacterIds: Object.freeze(["june"] as const), classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "june-profile-pictures", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "june" as const, displayName: "June" }), title: "Profile Pictures", photos: Object.freeze([{ mediaId: "june-facebook-profile-picture" as const, storyId: "june-profile-picture-update", timestamp: "2010-10-10T16:00:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "june-show-10-18", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "june" as const, displayName: "June" }), title: "10/18", photos: Object.freeze(JUNE_SHOW_MEDIA_IDS.map(mediaId => Object.freeze({
    mediaId,
    storyId: "june-show-photos-oct19",
    timestamp: "2010-10-19T23:51:00-07:00",
    ...(mediaId === "june-fb-10-18-01"
      ? { taggedActors: Object.freeze([{ kind: "canonical" as const, characterId: "matt" as const }]) }
      : mediaId === "june-fb-10-18-02"
        ? { taggedActors: Object.freeze([{ kind: "canonical" as const, characterId: "matt" as const }, { kind: "author-easter-egg" as const, authorId: "author-z-tokyo" as const }]) }
        : {}),
    classification: "CURATED" as const,
  }))), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "june-18th-birthday", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "june" as const, displayName: "June" }), title: "18th Birthday", photos: Object.freeze(JUNE_BIRTHDAY_MEDIA_IDS.map(mediaId => Object.freeze({ mediaId, storyId: JUNE_BIRTHDAY_PHOTO_STORY_IDS[mediaId], uploadStoryId: "june-18th-birthday-photos", timestamp: "2010-06-06T21:08:00-07:00", ...(mediaId === "june-birthday-main" ? { caption: "happy 18th, June ♥ 생일 축하해" } : {}), classification: "CURATED" as const }))), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "june-girls", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "june" as const, displayName: "June" }), title: "Girls ♥", photos: Object.freeze([{ mediaId: "june-sophie-girls" as const, storyId: "june-sophie-photo", timestamp: "2010-08-14T22:30:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "june-senior-year", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "june" as const, displayName: "June" }), title: "Senior Year", photos: Object.freeze([{ mediaId: "june-family-graduation" as const, storyId: "june-graduation-photo", timestamp: "2010-06-12T17:00:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "june-mobile-uploads", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "june" as const, displayName: "June" }), title: "Me", photos: Object.freeze([
    { mediaId: "june-home-mobile" as const, storyId: "june-home-photo", timestamp: "2010-09-26T19:30:00-07:00", caption: "my sister took this lol / 책 읽는 중", classification: "CURATED" as const },
    { mediaId: "june-starbucks-mobile" as const, storyId: "june-starbucks-photo", timestamp: "2010-10-18T14:10:00-07:00", caption: "starbucks saved my life today", classification: "CURATED" as const },
  ]), classification: "CURATED" as const }),
defineFacebookAlbum({ id: "jack-profile-pictures", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "jack" as const, displayName: "Jack" }), title: "Profile Pictures", photos: Object.freeze([{ mediaId: "jack-profile-picture" as const, storyId: "jack-profile-picture-update", timestamp: "2010-09-05T18:00:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
defineFacebookAlbum({ id: "jack-football", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "jack" as const, displayName: "Jack" }), title: "Football", photos: Object.freeze([{ mediaId: "jack-football-game" as const, storyId: "jack-football-game-photo", timestamp: "2010-10-15T22:45:00-07:00", caption: "good win", taggedCharacterIds: Object.freeze(["jack"] as const), classification: "CURATED" as const }]), classification: "CURATED" as const }),
defineFacebookAlbum({ id: "jack-summer", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "jack" as const, displayName: "Jack" }), title: "Summer", photos: Object.freeze([
  { mediaId: "jack-summer-party" as const, storyId: "jack-summer-photos", timestamp: "2010-08-22T17:30:00-07:00", caption: "summer", taggedCharacterIds: Object.freeze(["jack"] as const), classification: "CURATED" as const },
  { mediaId: "jack-beach-10" as const, storyId: "jack-summer-photos", timestamp: "2010-08-22T17:30:00-07:00", taggedCharacterIds: Object.freeze(["jack"] as const), classification: "CURATED" as const },
  { mediaId: "jack-beach-8" as const, storyId: "jack-summer-photos", timestamp: "2010-08-22T17:30:00-07:00", taggedCharacterIds: Object.freeze(["jack"] as const), classification: "CURATED" as const },
]), classification: "CURATED" as const }),
defineFacebookAlbum({ id: "jack-photos", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "jack" as const, displayName: "Jack" }), title: "Photos", photos: Object.freeze([
    { mediaId: "jack-matt-01" as const, storyId: "jack-matt-2010-photo", timestamp: "2010-10-18T22:34:00-07:00", caption: "@Matt Ciao, bello", taggedCharacterIds: Object.freeze(["matt"] as const), classification: "CURATED" as const },
    { mediaId: "jack-car" as const, storyId: "jack-car-matt-2009-photos", timestamp: "2009-11-14T21:10:00-08:00", caption: "@Matt get off the computer and get your license already lol", taggedCharacterIds: Object.freeze(["matt"] as const), classification: "CURATED" as const },
    { mediaId: "jack-matt-02" as const, storyId: "jack-car-matt-2009-photos", timestamp: "2009-11-14T21:10:00-08:00", caption: "@Matt get off the computer and get your license already lol", taggedCharacterIds: Object.freeze(["matt"] as const), classification: "CURATED" as const },
    { mediaId: "jack-matt-03" as const, storyId: "jack-matt-2008-photo", timestamp: "2008-09-20T19:32:00-07:00", caption: "@Matt your dad still makes the best lasagna btw lol", taggedCharacterIds: Object.freeze(["matt"] as const), classification: "CURATED" as const },
    { mediaId: "jack-matt-family" as const, storyId: "jack-matt-family-2007-photo", timestamp: "2007-06-16T18:40:00-07:00", caption: "@Matt", taggedCharacterIds: Object.freeze(["matt"] as const), classification: "CURATED" as const },
  ]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "luca-profile-pictures", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "luca" as const, displayName: "Luca" }), title: "Profile Pictures", photos: Object.freeze([{ mediaId: "luca-profile-picture" as const, storyId: "luca-profile-picture-current", timestamp: "2010-10-20T00:00:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "luca-pickup-basketball", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "luca" as const, displayName: "Luca" }), title: "Pickup Basketball", photos: Object.freeze(LUCA_PICKUP_BASKETBALL_MEDIA_IDS.map(mediaId => Object.freeze({ mediaId, storyId: "luca-pickup-basketball-photos", timestamp: "2010-10-19T22:58:00-07:00", classification: "CURATED" as const }))), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "luca-photos", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "luca" as const, displayName: "Luca" }), title: "Photos", photos: Object.freeze([{ mediaId: "luca-work-main-street-diner" as const, storyId: "luca-work-main-street-diner", timestamp: "2010-03-20T22:30:00-07:00", venueId: "main-street-diner" as const, classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "alex-profile-pictures", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "alex" as const, displayName: "Alex" }), title: "Profile Pictures", photos: Object.freeze([{ mediaId: "alex-profile-picture" as const, storyId: "alex-profile-picture-update", timestamp: "2010-10-01T16:00:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "alex-dogs", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "alex" as const, displayName: "Alex" }), title: "Dogs", photos: Object.freeze([
    { mediaId: "alex-dog-golden-2007" as const, storyId: "alex-dog-golden-2007", timestamp: "2007-10-03T16:00:00-07:00", classification: "CURATED" as const },
    { mediaId: "alex-dogs-wangcai-bb-2009" as const, storyId: "alex-dogs-wangcai-bb-2009", timestamp: "2009-05-08T16:00:00-07:00", caption: "旺財&BB", classification: "CURATED" as const },
  ]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "ben-profile-pictures", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "ben" as const, displayName: "Ben" }), title: "Profile Pictures", photos: Object.freeze([
    { mediaId: "ben-profile-current" as const, storyId: "ben-profile-current-update", timestamp: "2010-10-15T22:12:00-07:00", classification: "CURATED" as const },
    { mediaId: "ben-profile-2005" as const, storyId: "ben-profile-2005-update", timestamp: "2005-09-18T16:00:00-07:00", classification: "CURATED" as const },
  ]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "ben-photos", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "ben" as const, displayName: "Ben" }), title: "Photos", photos: Object.freeze([
    { mediaId: "ben-photo-friday-2010" as const, storyId: "ben-photo-friday-2010", timestamp: "2010-10-15T21:49:00-07:00", caption: "happy friday. finally.", classification: "CURATED" as const },
    { mediaId: "ben-car-2010" as const, storyId: "ben-car-2010", timestamp: "2010-07-10T16:00:00-07:00", caption: "new truck :)", classification: "CURATED" as const },
    { mediaId: "ben-coffee-2009" as const, storyId: "ben-coffee-2009", timestamp: "2009-02-14T16:00:00-08:00", classification: "CURATED" as const },
    { mediaId: "ben-coffee-2006" as const, storyId: "ben-coffee-2006", timestamp: "2006-08-12T16:00:00-07:00", classification: "CURATED" as const },
  ]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "chris-profile-pictures", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "chris" as const, displayName: "Chris" }), title: "Profile Pictures", photos: Object.freeze([
    { mediaId: "chris-profile-picture" as const, storyId: "chris-profile-picture-update", timestamp: "2009-11-14T20:30:00-08:00", classification: "CURATED" as const },
  ]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "matt-profile-pictures", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "matt" as const, displayName: "Matt" }), title: "Profile Pictures", photos: Object.freeze([
    { mediaId: "matt-profile-current" as const, storyId: "matt-profile-current-update", timestamp: "2010-10-02T21:18:00-07:00", classification: "CURATED" as const },
    { mediaId: "matt-profile-2007" as const, storyId: "matt-profile-2007-update", timestamp: "2007-08-18T20:10:00-07:00", classification: "CURATED" as const },
  ]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "matt-photos", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "matt" as const, displayName: "Matt" }), title: "Photos", photos: Object.freeze([
    { mediaId: "matt-code-2010" as const, storyId: "matt-code-photo-2010", timestamp: "2010-10-15T23:03:00-07:00", classification: "CURATED" as const },
    { mediaId: "matt-photo-2007" as const, storyId: "matt-photo-2007", timestamp: "2007-09-25T21:14:00-07:00", classification: "CURATED" as const },
  ]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "katie-profile-pictures", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "katie" as const, displayName: "Katie" }), title: "Profile Pictures", photos: Object.freeze([{ mediaId: "katie-profile-picture" as const, storyId: "katie-profile-picture-update", timestamp: "2010-10-10T16:00:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "katie-photo-history", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "katie" as const, displayName: "Katie" }), title: "Photos", photos: Object.freeze([
    { mediaId: "katie-selfie-july-2009" as const, storyId: "katie-selfie-july-2009", timestamp: "2009-07-18T17:00:00-07:00", classification: "CURATED" as const },
    { mediaId: "katie-selfie-august-2009" as const, storyId: "katie-selfie-august-2009", timestamp: "2009-08-22T16:00:00-07:00", caption: "summer :)", classification: "CURATED" as const },
    { mediaId: "katie-selfie-july-2010" as const, storyId: "katie-selfie-july-2010", timestamp: "2010-07-17T15:00:00-07:00", classification: "CURATED" as const },
    { mediaId: "katie-selfie-september-2010" as const, storyId: "katie-selfie-september-2010", timestamp: "2010-09-11T14:00:00-07:00", classification: "CURATED" as const },
  ]), classification: "CURATED" as const }),
  defineFacebookAlbum({
    id: "jay-music",
    ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "jay" as const, displayName: "Jay" }),
    title: "Music",
    photos: Object.freeze([
      { mediaId: "jay-guitar-may" as const, storyId: "jay-may-guitar-photo", timestamp: "2010-05-15T18:00:00-07:00", caption: "hey baby", classification: "CURATED" as const },
      { mediaId: "jay-guitar" as const, storyId: "jay-guitar-photo", timestamp: "2010-10-17T21:12:00-07:00", classification: "CURATED" as const },
      { mediaId: "jay-band-performance" as const, storyId: "jay-band-performance-photo", timestamp: "2010-10-19T22:00:00-07:00", caption: "last night was awesome. thx @Matt @Z.tokyo @Anil", classification: "CURATED" as const },
    ]),
    classification: "CURATED" as const,
  }),
]);

function actorsMatch(left: FacebookAlbumActor, right: FacebookAlbumActor) {
  if (left.kind !== right.kind) return false;
  if (left.kind === "canonical" && right.kind === "canonical") return left.characterId === right.characterId;
  if (left.kind === "author-easter-egg" && right.kind === "author-easter-egg") return left.authorId === right.authorId;
  if (left.kind === "ephemeral-friend-of-friend" && right.kind === "ephemeral-friend-of-friend") return left.ephemeralId === right.ephemeralId;
  return left.kind === "session-user" && right.kind === "session-user";
}

export function getFacebookAlbum(albumId: FacebookAlbumId) {
  return FACEBOOK_ALBUMS.find(album => album.id === albumId);
}

export function getFacebookAlbumsForActor(actor: FacebookAlbumActor | null) {
  if (!actor) return [];
  return FACEBOOK_ALBUMS.filter(album => actorsMatch(album.ownerActor, actor));
}

export function getFacebookAlbumForMediaId(mediaId: FacebookStoryMediaId) {
  return FACEBOOK_ALBUMS.find(album => album.mediaIds.includes(mediaId));
}

export function getFacebookAlbumByStoryId(storyId: string) {
  return FACEBOOK_ALBUMS.find(album => album.photos.some(photo => photo.storyId === storyId || photo.uploadStoryId === storyId));
}

export function getFacebookAlbumPhoto(album: FacebookAlbum, mediaId: FacebookStoryMediaId) {
  return album.photos.find(photo => photo.mediaId === mediaId);
}

function photoTagActors(photo: FacebookAlbumPhoto): FacebookPhotoTagActor[] {
  const legacyCanonicalTags = photo.taggedCharacterIds?.map(characterId => ({ kind: "canonical" as const, characterId })) ?? [];
  return [...legacyCanonicalTags, ...(photo.taggedActors ?? [])].filter((actor, index, actors) => actors.findIndex(candidate =>
    candidate.kind === actor.kind &&
    (actor.kind === "canonical"
      ? candidate.kind === "canonical" && candidate.characterId === actor.characterId
      : candidate.kind === "author-easter-egg" && candidate.authorId === actor.authorId)) === index);
}

function ownerMatchesTagActor(owner: FacebookAlbumActor, actor: FacebookPhotoTagActor) {
  if (owner.kind === "canonical" && actor.kind === "canonical") return owner.characterId === actor.characterId;
  if (owner.kind === "author-easter-egg" && actor.kind === "author-easter-egg") return owner.authorId === actor.authorId;
  return false;
}

function tagActorsMatch(left: FacebookPhotoTagActor, right: FacebookPhotoTagActor) {
  if (left.kind === "canonical" && right.kind === "canonical") return left.characterId === right.characterId;
  if (left.kind === "author-easter-egg" && right.kind === "author-easter-egg") return left.authorId === right.authorId;
  return false;
}

export function getFacebookPhotoTagActors(photo: FacebookAlbumPhoto) {
  return photoTagActors(photo);
}

export function getFacebookPhotosOfActor(actor: FacebookPhotoTagActor): FacebookTaggedPhotoRecord[] {
  return FACEBOOK_ALBUMS.flatMap(album => album.photos.map(photo => ({ album, photo })))
    .filter(({ album, photo }) =>
      photoTagActors(photo).some(taggedActor => tagActorsMatch(taggedActor, actor)) &&
      !ownerMatchesTagActor(album.ownerActor, actor) &&
      getFacebookStoryMedia(photo.mediaId) !== undefined)
    .sort((left, right) => right.photo.timestamp.localeCompare(left.photo.timestamp));
}

export function getFacebookPhotosOfCharacter(characterId: CoreSocialCharacterId): FacebookTaggedPhotoRecord[] {
  return getFacebookPhotosOfActor({ kind: "canonical", characterId });
}
