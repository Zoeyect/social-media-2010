import type { CoreSocialCharacterId } from "./coreSocialFriends";
import { getSharedCharacterMedia, type SharedCharacterMediaId } from "./sharedCharacterMedia";
import twitterDefaultEggSrc from "../assets/twitter/avatar/twitter-default-egg-2010-reconstructed.svg";

export type TwitterAvatarRecord = Readonly<{
  identityId: CoreSocialCharacterId;
  mediaId: SharedCharacterMediaId;
  classification: "CANONICAL_AVATAR_CANDIDATE";
  objectPosition: string;
}>;

export const TWITTER_AVATAR_REGISTRY: Readonly<Partial<Record<CoreSocialCharacterId, TwitterAvatarRecord>>> = Object.freeze({
  june: Object.freeze({ identityId: "june", mediaId: "june-profile-avatar", classification: "CANONICAL_AVATAR_CANDIDATE", objectPosition: "50% 35%" }),
  matt: Object.freeze({ identityId: "matt", mediaId: "matt-profile-current", classification: "CANONICAL_AVATAR_CANDIDATE", objectPosition: "50% 34%" }),
  jack: Object.freeze({ identityId: "jack", mediaId: "jack-profile-picture", classification: "CANONICAL_AVATAR_CANDIDATE", objectPosition: "50% 35%" }),
  alex: Object.freeze({ identityId: "alex", mediaId: "alex-profile-picture", classification: "CANONICAL_AVATAR_CANDIDATE", objectPosition: "50% 24%" }),
  ben: Object.freeze({ identityId: "ben", mediaId: "ben-profile-current", classification: "CANONICAL_AVATAR_CANDIDATE", objectPosition: "50% 30%" }),
  katie: Object.freeze({ identityId: "katie", mediaId: "katie-profile-picture", classification: "CANONICAL_AVATAR_CANDIDATE", objectPosition: "50% 35%" }),
  chris: Object.freeze({ identityId: "chris", mediaId: "chris-profile-picture", classification: "CANONICAL_AVATAR_CANDIDATE", objectPosition: "50% 30%" }),
  luca: Object.freeze({ identityId: "luca", mediaId: "luca-profile-picture", classification: "CANONICAL_AVATAR_CANDIDATE", objectPosition: "50% 50%" }),
});

const TEMPORARY_NAME_BRIDGE: Readonly<Record<string, CoreSocialCharacterId>> = Object.freeze({
  june: "june",
  "june park": "june",
  matt: "matt",
  "matt ricci": "matt",
  jack: "jack",
  "jack keller": "jack",
  alex: "alex",
  "alex wong": "alex",
  ben: "ben",
  "ben dawson": "ben",
  katie: "katie",
  "katie dawson": "katie",
  chris: "chris",
  "chris morgan": "chris",
  luca: "luca",
  "luca bennett": "luca",
});

export type ResolvedTwitterAvatar = Readonly<{
  identityId: CoreSocialCharacterId | "twitter-default";
  src: string;
  mediaId: SharedCharacterMediaId | "twitter-default-egg-2010-reconstructed";
  classification: "CANONICAL_AVATAR_CANDIDATE" | "RECONSTRUCTED_FROM_PERIOD_SCREENSHOT";
  objectPosition: string;
}>;

export const TWITTER_DEFAULT_AVATAR: ResolvedTwitterAvatar = Object.freeze({
  identityId: "twitter-default",
  src: twitterDefaultEggSrc,
  mediaId: "twitter-default-egg-2010-reconstructed",
  classification: "RECONSTRUCTED_FROM_PERIOD_SCREENSHOT",
  objectPosition: "50% 50%",
});

export function resolveTwitterAvatar({ identityId, displayName, allowNameBridge = true }: {
  identityId?: string | null;
  displayName?: string | null;
  allowNameBridge?: boolean;
}): ResolvedTwitterAvatar {
  const stableIdentity = identityId && identityId in TWITTER_AVATAR_REGISTRY
    ? identityId as CoreSocialCharacterId
    : null;
  const bridgedIdentity = !stableIdentity && allowNameBridge && displayName
    ? TEMPORARY_NAME_BRIDGE[displayName.trim().replace(/^@/, "").toLowerCase()] ?? null
    : null;
  const resolvedIdentity = stableIdentity ?? bridgedIdentity;
  if (!resolvedIdentity) return TWITTER_DEFAULT_AVATAR;
  const record = TWITTER_AVATAR_REGISTRY[resolvedIdentity];
  if (!record) return TWITTER_DEFAULT_AVATAR;
  return Object.freeze({
    identityId: record.identityId,
    src: getSharedCharacterMedia(record.mediaId).src,
    mediaId: record.mediaId,
    classification: record.classification,
    objectPosition: record.objectPosition,
  });
}
