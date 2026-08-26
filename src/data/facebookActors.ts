import type { CoreSocialCharacterId } from "./coreSocialFriends";

export const FACEBOOK_AUTHOR_EASTER_EGG_ID = "author-z-tokyo" as const;
export type FacebookAuthorEasterEggId = typeof FACEBOOK_AUTHOR_EASTER_EGG_ID;
export const FACEBOOK_EPHEMERAL_FRIEND_OF_FRIEND_ID = "fof-ryan-001" as const;

export const FACEBOOK_EPHEMERAL_FRIENDS_OF_FRIENDS = Object.freeze({
  [FACEBOOK_EPHEMERAL_FRIEND_OF_FRIEND_ID]: Object.freeze({
    id: FACEBOOK_EPHEMERAL_FRIEND_OF_FRIEND_ID,
    displayName: "Ryan",
    classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const,
  }),
});

export type FacebookFeedActor =
  | Readonly<{ kind: "canonical"; characterId: CoreSocialCharacterId }>
  | Readonly<{ kind: "author-easter-egg"; authorId: FacebookAuthorEasterEggId }>
  | Readonly<{ kind: "ephemeral-friend-of-friend"; ephemeralId: typeof FACEBOOK_EPHEMERAL_FRIEND_OF_FRIEND_ID }>;

export const FACEBOOK_AUTHOR_EASTER_EGGS = Object.freeze({
  [FACEBOOK_AUTHOR_EASTER_EGG_ID]: Object.freeze({
    id: FACEBOOK_AUTHOR_EASTER_EGG_ID,
    displayName: "Z.tokyo",
    classification: "AUTHOR_EASTER_EGG" as const,
    profileMediaId: "z-tokyo-profile-picture" as const,
  }),
});

export function getFacebookAuthorEasterEggByDisplayName(displayName: string) {
  return Object.values(FACEBOOK_AUTHOR_EASTER_EGGS).find(identity => identity.displayName === displayName) ?? null;
}
