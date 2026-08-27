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
export const FACEBOOK_EPHEMERAL_ERIC_ID = "facebook-ephemeral-eric" as const;
export const FACEBOOK_EPHEMERAL_DANIEL_ID = "facebook-ephemeral-daniel" as const;
export const FACEBOOK_EPHEMERAL_SAM_ID = "facebook-ephemeral-sam" as const;
export const FACEBOOK_EPHEMERAL_SOPHIE_ID = "facebook-ephemeral-sophie" as const;
export const FACEBOOK_EPHEMERAL_NICOLE_ID = "facebook-ephemeral-nicole" as const;
export const FACEBOOK_EPHEMERAL_DEREK_ID = "facebook-ephemeral-derek" as const;
export const FACEBOOK_EPHEMERAL_MEGAN_ID = "facebook-ephemeral-megan" as const;
export const FACEBOOK_EPHEMERAL_EVAN_ID = "facebook-ephemeral-evan" as const;

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
  [FACEBOOK_EPHEMERAL_ERIC_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_ERIC_ID, displayName: "Eric", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_DANIEL_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_DANIEL_ID, displayName: "Daniel", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_SAM_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_SAM_ID, displayName: "Sam", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_SOPHIE_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_SOPHIE_ID, displayName: "Sophie Miller", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_NICOLE_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_NICOLE_ID, displayName: "Nicole", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_DEREK_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_DEREK_ID, displayName: "Derek", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_MEGAN_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_MEGAN_ID, displayName: "Megan", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
  [FACEBOOK_EPHEMERAL_EVAN_ID]: Object.freeze({ id: FACEBOOK_EPHEMERAL_EVAN_ID, displayName: "Evan", classification: "EPHEMERAL_FRIEND_OF_FRIEND" as const }),
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
