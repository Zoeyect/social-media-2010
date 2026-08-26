export const CORE_SOCIAL_CHARACTER_IDS = ["katie", "matt", "alex", "chris", "jay", "june", "jack", "ben", "luca"] as const;

export type CoreSocialCharacterId = typeof CORE_SOCIAL_CHARACTER_IDS[number];
export type CoreSocialCharacterCategory = "core-friend" | "extended-friend" | "narrative-contact";
export type CoreSocialCharacterLifeStage = "young-social-circle" | "working-adult";

export type CoreSocialCharacter = Readonly<{
  id: CoreSocialCharacterId;
  displayName: string;
  initials: string;
  category: CoreSocialCharacterCategory;
  lifeStage: CoreSocialCharacterLifeStage;
  fictional: true;
  classification: "CURATED FICTIONAL";
  socialHandles?: Readonly<{
    instagram?: string;
  }>;
}>;

export const CORE_SOCIAL_CHARACTERS = Object.freeze({
  katie: Object.freeze({ id: "katie", displayName: "Katie", initials: "K", category: "core-friend", lifeStage: "young-social-circle", fictional: true, classification: "CURATED FICTIONAL" }),
  matt: Object.freeze({ id: "matt", displayName: "Matt", initials: "M", category: "core-friend", lifeStage: "young-social-circle", fictional: true, classification: "CURATED FICTIONAL" }),
  alex: Object.freeze({ id: "alex", displayName: "Alex", initials: "A", category: "core-friend", lifeStage: "young-social-circle", fictional: true, classification: "CURATED FICTIONAL" }),
  chris: Object.freeze({ id: "chris", displayName: "Chris", initials: "C", category: "core-friend", lifeStage: "young-social-circle", fictional: true, classification: "CURATED FICTIONAL" }),
  jay: Object.freeze({ id: "jay", displayName: "Jay", initials: "J", category: "core-friend", lifeStage: "young-social-circle", fictional: true, classification: "CURATED FICTIONAL" }),
  june: Object.freeze({ id: "june", displayName: "June", initials: "J", category: "narrative-contact", lifeStage: "young-social-circle", fictional: true, classification: "CURATED FICTIONAL", socialHandles: Object.freeze({ instagram: "junephoto" }) }),
  jack: Object.freeze({ id: "jack", displayName: "Jack", initials: "J", category: "narrative-contact", lifeStage: "young-social-circle", fictional: true, classification: "CURATED FICTIONAL" }),
  ben: Object.freeze({ id: "ben", displayName: "Ben", initials: "B", category: "extended-friend", lifeStage: "working-adult", fictional: true, classification: "CURATED FICTIONAL" }),
  luca: Object.freeze({ id: "luca", displayName: "Luca", initials: "L", category: "extended-friend", lifeStage: "working-adult", fictional: true, classification: "CURATED FICTIONAL" }),
}) satisfies Readonly<Record<CoreSocialCharacterId, CoreSocialCharacter>>;

export const CORE_SOCIAL_RELATIONSHIPS = Object.freeze([
  Object.freeze({ id: "katie-ben-siblings", characterIds: Object.freeze(["katie", "ben"] as const), kind: "siblings" as const, detail: "Ben is Katie's older brother." }),
  Object.freeze({ id: "chris-luca-basketball-friends", characterIds: Object.freeze(["chris", "luca"] as const), kind: "friends" as const, detail: "Chris and Luca sometimes play basketball together." }),
]);

export const CORE_SOCIAL_FRIEND_IDS = ["katie", "matt", "alex", "chris", "jay"] as const;

export type CoreSocialFriendId = typeof CORE_SOCIAL_FRIEND_IDS[number];

export type CoreSocialFriend = Readonly<{
  id: CoreSocialFriendId;
  displayName: string;
  initials: string;
  category: "core-friend";
  lifeStage: "young-social-circle";
  fictional: true;
  classification: "CURATED FICTIONAL";
}>;

export const CORE_SOCIAL_FRIENDS = Object.freeze({
  katie: CORE_SOCIAL_CHARACTERS.katie,
  matt: CORE_SOCIAL_CHARACTERS.matt,
  alex: CORE_SOCIAL_CHARACTERS.alex,
  chris: CORE_SOCIAL_CHARACTERS.chris,
  jay: CORE_SOCIAL_CHARACTERS.jay,
}) satisfies Readonly<Record<CoreSocialFriendId, CoreSocialFriend>>;
