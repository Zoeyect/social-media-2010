export const CORE_SOCIAL_CHARACTER_IDS = ["katie", "matt", "alex", "chris", "jay", "june", "jack", "ben", "luca"] as const;

export type CoreSocialCharacterId = typeof CORE_SOCIAL_CHARACTER_IDS[number];
export type CoreSocialCharacterCategory = "core-friend" | "extended-friend" | "narrative-contact";
export type CoreSocialCharacterLifeStage = "young-social-circle" | "working-adult";
export type CanonicalSocialEntityId = CoreSocialCharacterId | "facebook-ephemeral-sophie" | "author-z-tokyo" | "offline-anil";
export type CoreSocialRelationshipKind = "SIBLINGS" | "BASKETBALL_FRIENDS" | "LONGTIME_NEIGHBORS_FAMILY_FRIENDS" | "BEST_FRIENDS";
export type CoreSocialActivityLevel = "VERY_LOW" | "LOW" | "LOW_MEDIUM" | "MEDIUM" | "MEDIUM_HIGH" | "HIGH" | "VERY_HIGH" | "INTERACTION_FIRST";

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
  june: Object.freeze({ id: "june", displayName: "June", initials: "J", category: "narrative-contact", lifeStage: "young-social-circle", fictional: true, classification: "CURATED FICTIONAL", socialHandles: Object.freeze({ instagram: "junepark" }) }),
  jack: Object.freeze({ id: "jack", displayName: "Jack", initials: "J", category: "narrative-contact", lifeStage: "young-social-circle", fictional: true, classification: "CURATED FICTIONAL" }),
  ben: Object.freeze({ id: "ben", displayName: "Ben", initials: "B", category: "extended-friend", lifeStage: "working-adult", fictional: true, classification: "CURATED FICTIONAL" }),
  luca: Object.freeze({ id: "luca", displayName: "Luca", initials: "L", category: "extended-friend", lifeStage: "working-adult", fictional: true, classification: "CURATED FICTIONAL" }),
}) satisfies Readonly<Record<CoreSocialCharacterId, CoreSocialCharacter>>;

export const CORE_SOCIAL_RELATIONSHIPS = Object.freeze([
  Object.freeze({ id: "katie-ben-siblings", participantIds: Object.freeze(["katie", "ben"] as const), kind: "SIBLINGS" as const, detail: "Ben is Katie's older brother." }),
  Object.freeze({ id: "chris-luca-basketball-friends", participantIds: Object.freeze(["chris", "luca"] as const), kind: "BASKETBALL_FRIENDS" as const, detail: "Chris and Luca are friends who play basketball together." }),
  Object.freeze({ id: "jack-matt-neighbors-family-friends", participantIds: Object.freeze(["jack", "matt"] as const), kind: "LONGTIME_NEIGHBORS_FAMILY_FRIENDS" as const, detail: "Jack and Matt are longtime neighbors whose families know each other well." }),
  Object.freeze({ id: "june-sophie-best-friends", participantIds: Object.freeze(["june", "facebook-ephemeral-sophie"] as const), kind: "BEST_FRIENDS" as const, detail: "June and Sophie Miller are best friends." }),
]);

export const CORE_SOCIAL_BAND = Object.freeze({
  id: "jay-matt-z-tokyo-anil-band",
  members: Object.freeze([
    Object.freeze({ entityId: "jay" as const, role: "GUITAR" as const, accountBoundary: "CORE_SOCIAL_CHARACTER" as const }),
    Object.freeze({ entityId: "matt" as const, role: "BASS" as const, accountBoundary: "CORE_SOCIAL_CHARACTER" as const }),
    Object.freeze({ entityId: "author-z-tokyo" as const, role: "KEYBOARD" as const, accountBoundary: "AUTHOR_EASTER_EGG" as const }),
    Object.freeze({ entityId: "offline-anil" as const, role: "DRUMS" as const, accountBoundary: "OFFLINE_NO_SNS" as const }),
  ]),
});

export const CORE_SOCIAL_BEHAVIOR = Object.freeze({
  jack: Object.freeze({ selfPosting: "MEDIUM", taggedPresence: "VERY_HIGH", engagement: "HIGH" }),
  june: Object.freeze({ selfPosting: "HIGH", taggedPresence: "HIGH", engagement: "HIGH" }),
  luca: Object.freeze({ selfPosting: "MEDIUM_HIGH", taggedPresence: "MEDIUM", engagement: "MEDIUM_HIGH" }),
  jay: Object.freeze({ selfPosting: "MEDIUM", taggedPresence: "MEDIUM", engagement: "MEDIUM" }),
  katie: Object.freeze({ selfPosting: "MEDIUM", taggedPresence: "MEDIUM", engagement: "MEDIUM" }),
  alex: Object.freeze({ selfPosting: "MEDIUM", taggedPresence: "LOW_MEDIUM", engagement: "MEDIUM" }),
  ben: Object.freeze({ selfPosting: "LOW_MEDIUM", taggedPresence: "LOW", engagement: "LOW_MEDIUM" }),
  matt: Object.freeze({ selfPosting: "LOW", taggedPresence: "MEDIUM_HIGH", engagement: "LOW_MEDIUM", personalityBoundary: "INTROVERTED_NOT_STEREOTYPE" as const }),
  chris: Object.freeze({ selfPosting: "VERY_LOW", taggedPresence: "MEDIUM_HIGH", engagement: "INTERACTION_FIRST", presenceModel: "INTERACTION_FIRST" as const }),
}) satisfies Readonly<Record<CoreSocialCharacterId, Readonly<{
  selfPosting: CoreSocialActivityLevel;
  taggedPresence: CoreSocialActivityLevel;
  engagement: CoreSocialActivityLevel;
  personalityBoundary?: "INTROVERTED_NOT_STEREOTYPE";
  presenceModel?: "INTERACTION_FIRST";
}>>>;

export const CORE_SOCIAL_INTENTIONAL_AMBIGUITIES = Object.freeze([
  Object.freeze({ id: "june-jack-relationship", participantIds: Object.freeze(["june", "jack"] as const), kind: "INTENTIONAL_AMBIGUITY" as const }),
  Object.freeze({ id: "sophie-jack-history-interest", participantIds: Object.freeze(["facebook-ephemeral-sophie", "jack"] as const), kind: "INTENTIONAL_AMBIGUITY" as const }),
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
