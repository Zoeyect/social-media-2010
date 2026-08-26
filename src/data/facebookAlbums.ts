import type { CoreSocialCharacterId } from "./coreSocialFriends";
import type { FacebookAuthorEasterEggId } from "./facebookActors";
import type { FacebookStoryMediaId } from "./facebookStoryMedia";

export const FACEBOOK_ALBUM_IDS = Object.freeze([
  "z-tokyo-profile-pictures",
  "luca-pickup-basketball",
  "katie-photos",
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
  classification: "CURATED";
};

function defineFacebookAlbum(definition: Omit<FacebookAlbum, "mediaIds">): FacebookAlbum {
  const photos = Object.freeze([...definition.photos].sort((left, right) => right.timestamp.localeCompare(left.timestamp)));
  return Object.freeze({ ...definition, photos, mediaIds: Object.freeze(photos.map(photo => photo.mediaId)) });
}

export const FACEBOOK_ALBUMS: readonly FacebookAlbum[] = Object.freeze([
  defineFacebookAlbum({ id: "z-tokyo-profile-pictures", ownerActor: Object.freeze({ kind: "author-easter-egg" as const, authorId: "author-z-tokyo" as const, displayName: "Z.tokyo" }), title: "Profile Pictures", photos: Object.freeze([{ mediaId: "z-tokyo-profile-picture" as const, storyId: "z-tokyo-profile-picture-update", timestamp: "2010-10-18T20:52:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "luca-pickup-basketball", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "luca" as const, displayName: "Luca" }), title: "Pickup Basketball", photos: Object.freeze([{ mediaId: "chris-luca-basketball" as const, storyId: "luca-pickup-basketball-photos", timestamp: "2010-10-19T22:58:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
  defineFacebookAlbum({ id: "katie-photos", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "katie" as const, displayName: "Katie" }), title: "Photos", photos: Object.freeze([{ mediaId: "katie-ben-family" as const, storyId: "katie-photo-with-ben", timestamp: "2010-10-18T19:24:00-07:00", classification: "CURATED" as const }]), classification: "CURATED" as const }),
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
