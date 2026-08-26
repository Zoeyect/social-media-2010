import type { CoreSocialCharacterId } from "./coreSocialFriends";
import type { FacebookEphemeralFriendOfFriendId } from "./facebookActors";
import type { FacebookStoryMediaId } from "./facebookStoryMedia";

export const FACEBOOK_CANONICAL_ACTOR_MEDIA: Readonly<Partial<Record<CoreSocialCharacterId, Readonly<{ profileMediaId: FacebookStoryMediaId }>>>> = Object.freeze({
  katie: Object.freeze({ profileMediaId: "katie-profile-picture" as const }),
  luca: Object.freeze({ profileMediaId: "luca-profile-picture" as const }),
  jay: Object.freeze({ profileMediaId: "facebook-default-avatar" as const }),
  alex: Object.freeze({ profileMediaId: "alex-profile-picture" as const }),
});

export const FACEBOOK_EPHEMERAL_ACTOR_MEDIA: Readonly<Partial<Record<FacebookEphemeralFriendOfFriendId, Readonly<{ profileMediaId: FacebookStoryMediaId }>>>> = Object.freeze({
  "fof-ryan-001": Object.freeze({ profileMediaId: "facebook-default-avatar" as const }),
  "facebook-ephemeral-frank": Object.freeze({ profileMediaId: "facebook-default-avatar" as const }),
  "facebook-ephemeral-mike": Object.freeze({ profileMediaId: "facebook-avatar-02" as const }),
  "facebook-ephemeral-sarah": Object.freeze({ profileMediaId: "facebook-avatar-00" as const }),
  "facebook-ephemeral-kevin": Object.freeze({ profileMediaId: "facebook-avatar-05" as const }),
  "facebook-ephemeral-emily": Object.freeze({ profileMediaId: "facebook-avatar-03" as const }),
  "facebook-ephemeral-nick": Object.freeze({ profileMediaId: "facebook-avatar-06" as const }),
  "facebook-ephemeral-rachel": Object.freeze({ profileMediaId: "facebook-avatar-07" as const }),
});

export function getFacebookCanonicalProfileMediaId(characterId: CoreSocialCharacterId) {
  return FACEBOOK_CANONICAL_ACTOR_MEDIA[characterId]?.profileMediaId ?? null;
}

export function getFacebookEphemeralProfileMediaId(ephemeralId: FacebookEphemeralFriendOfFriendId) {
  return FACEBOOK_EPHEMERAL_ACTOR_MEDIA[ephemeralId]?.profileMediaId ?? null;
}
