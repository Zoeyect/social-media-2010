import type { CoreSocialCharacterId } from "./coreSocialFriends";

export const FACEBOOK_AUTHOR_EASTER_EGG_ID = "author-z-tokyo" as const;
export type FacebookAuthorEasterEggId = typeof FACEBOOK_AUTHOR_EASTER_EGG_ID;
export const FACEBOOK_EPHEMERAL_FRIEND_OF_FRIEND_ID = "fof-ryan-001" as const;
export const FACEBOOK_EPHEMERAL_FRANK_ID = "facebook-ephemeral-frank" as const;
export const FACEBOOK_EPHEMERAL_MIKE_ID = "facebook-ephemeral-mike" as const;
export const FACEBOOK_EPHEMERAL_SARAH_ID = "facebook-ephemeral-sarah" as const;
export const FACEBOOK_EPHEMERAL_KEVIN_ID = "facebook-ephemeral-kevin" as const;
export const FACEBOOK_EPHEMERAL_EMILY_ID = "facebook-ephemeral-emily" as const;
export const FACEBOOK_EPHEMERAL_NICK_ID = "facebook-ephemeral-nick" as const;
export const FACEBOOK_EPHEMERAL_RACHEL_ID = "facebook-ephemeral-rachel" as const;

export const FACEBOOK_EPHEMERAL_FRIENDS_OF_FRIENDS = Object.freeze({
  [FACEBOOK_EPHEMERAL_FRIEND_OF_FRIEND_ID]: Object.freeze({
    id: FACEBOOK_EPHEMERAL_FRIEND_OF_FRIEND_ID,
    displayName: "Ryan",
    classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const,
  }),
  [FACEBOOK_EPHEMERAL_FRANK_ID]: Object.freeze({
    id: FACEBOOK_EPHEMERAL_FRANK_ID,
    displayName: "Frank",
    classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const,
  }),
  [FACEBOOK_EPHEMERAL_MIKE_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_MIKE_ID, displayName: "Mike", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_SARAH_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_SARAH_ID, displayName: "Sarah", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_KEVIN_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_KEVIN_ID, displayName: "Kevin", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_EMILY_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_EMILY_ID, displayName: "Emily", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_NICK_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_NICK_ID, displayName: "Nick", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_RACHEL_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_RACHEL_ID, displayName: "Rachel", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
});

export type FacebookEphemeralFriendOfFriendId = keyof typeof FACEBOOK_EPHEMERAL_FRIENDS_OF_FRIENDS;

export type FacebookFeedActor =
  | Readonly<{ kind: "canonical"; characterId: CoreSocialCharacterId }>
  | Readonly<{ kind: "author-easter-egg"; authorId: FacebookAuthorEasterEggId }>
  | Readonly<{ kind: "ephemeral-friend-of-friend"; ephemeralId: FacebookEphemeralFriendOfFriendId }>;

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
