import type { CoreSocialCharacterId } from "./coreSocialFriends";
import type { FacebookAuthorEasterEggId } from "./facebookActors";
import type { FacebookStoryMediaId } from "./facebookStoryMedia";
import type { CanonicalVenueId } from "./canonicalVenues";

export const FACEBOOK_ALBUM_IDS = Object.freeze([
  "z-tokyo-profile-pictures",
  "luca-pickup-basketball",
  "luca-photos",
  "alex-profile-pictures",
  "alex-dogs",
  "ben-profile-pictures",
  "ben-photos",
  "chris-profile-pictures",
  "katie-profile-pictures",
  "katie-photo-history",
  "jay-music",
] as const);

export type FacebookAlbumId = typeof FACEBOOK_ALBUM_IDS[number];

export type FacebookAlbumActor =
  | { kind: "canonical"; characterId: CoreSocialCharacterId; displayName: string }
  | { kind: "ephemeral-friend-of-friend"; ephemeralId: string; displayName: string; classification: "EPHEMERAL_FRIEND_OF_FRIEND" }
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
  timestamp: string;
  caption?: string;
  venueId?: CanonicalVenueId;
  classification: "CURATED";
};

export const LUCA_PICKUP_BASKETBALL_MEDIA_IDS = Object.freeze([
  "luca-basketball-01",
  "luca-basketball-02",
  "luca-basketball-03",
] as const satisfies readonly FacebookStoryMediaId[]);

function defineFacebookAlbum(definition: Omit<FacebookAlbum, "mediaIds">): FacebookAlbum {
  const photos = Object.freeze([...definition.photos].sort((left, right) => right.timestamp.localeCompare(left.timestamp)));
  return Object.freeze({ ...definition, photos, mediaIds: Object.freeze(photos.map(photo => photo.mediaId)) });
}

export const FACEBOOK_ALBUMS: readonly FacebookAlbum[] = Object.freeze([
  defineFacebookAlbum({ id: "z-tokyo-profile-pictures", ownerActor: Object.freeze({ kind: "author-easter-egg" as const, authorId: "author-z-tokyo" as const, displayName: "Z.tokyo" }), title: "Profile Pictures", photos: Object.freeze([{ mediaId: "z-tokyo-profile-picture" as const, storyId: "z-tokyo-profile-picture-update", timestamp: "2010-10-18T20:52:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
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
  return FACEBOOK_ALBUMS.find(album => album.photos.some(photo => photo.storyId === storyId));
}

export function getFacebookAlbumPhoto(album: FacebookAlbum, mediaId: FacebookStoryMediaId) {
  return album.photos.find(photo => photo.mediaId === mediaId);
}
