import { FACEBOOK_MEDIA_IDS, getFacebookMedia } from "./facebookMedia";
import type { FacebookMediaId } from "./facebookMedia";
import { SHARED_CHARACTER_MEDIA_IDS, getSharedCharacterMedia } from "./sharedCharacterMedia";
import type { SharedCharacterMediaId } from "./sharedCharacterMedia";

export type FacebookStoryMediaId = FacebookMediaId | SharedCharacterMediaId;

export function getFacebookStoryMedia(mediaId: FacebookStoryMediaId) {
  if ((SHARED_CHARACTER_MEDIA_IDS as readonly string[]).includes(mediaId)) {
    return getSharedCharacterMedia(mediaId as SharedCharacterMediaId);
  }
  if ((FACEBOOK_MEDIA_IDS as readonly string[]).includes(mediaId)) {
    return getFacebookMedia(mediaId as FacebookMediaId);
  }
  return undefined;
}
