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
  storyId: string;
  timestamp: string;
  classification: "CURATED";
};

export const FACEBOOK_ALBUMS: readonly FacebookAlbum[] = Object.freeze([
  Object.freeze({ id: "z-tokyo-profile-pictures", ownerActor: Object.freeze({ kind: "author-easter-egg" as const, authorId: "author-z-tokyo" as const, displayName: "Z.tokyo" }), title: "Profile Pictures", mediaIds: Object.freeze(["z-tokyo-profile-picture" as const]), storyId: "z-tokyo-profile-picture-update", timestamp: "October 18, 2010", classification: "CURATED" as const }),
  Object.freeze({ id: "luca-pickup-basketball", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "luca" as const, displayName: "Luca" }), title: "Pickup Basketball", mediaIds: Object.freeze(["chris-luca-basketball" as const]), storyId: "luca-pickup-basketball-photos", timestamp: "October 19, 2010", classification: "CURATED" as const }),
  Object.freeze({ id: "katie-photos", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "katie" as const, displayName: "Katie" }), title: "Photos", mediaIds: Object.freeze(["katie-ben-family" as const]), storyId: "katie-photo-with-ben", timestamp: "October 18, 2010", classification: "CURATED" as const }),
  Object.freeze({ id: "jay-music", ownerActor: Object.freeze({ kind: "canonical" as const, characterId: "jay" as const, displayName: "Jay" }), title: "Music", mediaIds: Object.freeze(["jay-guitar" as const]), storyId: "jay-guitar-photo", timestamp: "October 17, 2010", classification: "CURATED" as const }),
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
  return FACEBOOK_ALBUMS.find(album => album.storyId === storyId);
}
