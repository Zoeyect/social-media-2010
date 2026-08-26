import type { CoreSocialCharacterId } from "./coreSocialFriends";
import type { FacebookEphemeralFriendOfFriendId } from "./facebookActors";
import type { FacebookStoryMediaId } from "./facebookStoryMedia";

export const FACEBOOK_CANONICAL_ACTOR_MEDIA: Readonly<Partial<Record<CoreSocialCharacterId, Readonly<{ profileMediaId: FacebookStoryMediaId }>>>> = Object.freeze({
  katie: Object.freeze({ profileMediaId: "katie-profile-picture" as const }),
  luca: Object.freeze({ profileMediaId: "luca-profile-picture" as const }),
  jay: Object.freeze({ profileMediaId: "facebook-default-avatar" as const }),
});

export const FACEBOOK_EPHEMERAL_ACTOR_MEDIA: Readonly<Partial<Record<FacebookEphemeralFriendOfFriendId, Readonly<{ profileMediaId: FacebookStoryMediaId }>>>> = Object.freeze({
  "fof-ryan-001": Object.freeze({ profileMediaId: "facebook-default-avatar" as const }),
  "facebook-ephemeral-frank": Object.freeze({ profileMediaId: "facebook-default-avatar" as const }),
});

export function getFacebookCanonicalProfileMediaId(characterId: CoreSocialCharacterId) {
  return FACEBOOK_CANONICAL_ACTOR_MEDIA[characterId]?.profileMediaId ?? null;
}

export function getFacebookEphemeralProfileMediaId(ephemeralId: FacebookEphemeralFriendOfFriendId) {
  return FACEBOOK_EPHEMERAL_ACTOR_MEDIA[ephemeralId]?.profileMediaId ?? null;
}
