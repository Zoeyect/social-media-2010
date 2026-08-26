import type { CoreSocialCharacterId } from "./coreSocialFriends";

export const FACEBOOK_AUTHOR_EASTER_EGG_ID = "author-z-tokyo" as const;
export type FacebookAuthorEasterEggId = typeof FACEBOOK_AUTHOR_EASTER_EGG_ID;

export type FacebookFeedActor =
  | Readonly<{ kind: "canonical"; characterId: CoreSocialCharacterId }>
  | Readonly<{ kind: "author-easter-egg"; authorId: FacebookAuthorEasterEggId }>;

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
