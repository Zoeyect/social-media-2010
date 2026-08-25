export const CORE_SOCIAL_FRIEND_IDS = ["katie", "matt", "alex", "chris", "jay"] as const;

export type CoreSocialFriendId = typeof CORE_SOCIAL_FRIEND_IDS[number];

export type CoreSocialFriend = Readonly<{
  id: CoreSocialFriendId;
  displayName: string;
  initials: string;
  relationship: "friend";
  fictional: true;
}>;

export const CORE_SOCIAL_FRIENDS = Object.freeze({
  katie: Object.freeze({ id: "katie", displayName: "Katie", initials: "K", relationship: "friend", fictional: true }),
  matt: Object.freeze({ id: "matt", displayName: "Matt", initials: "M", relationship: "friend", fictional: true }),
  alex: Object.freeze({ id: "alex", displayName: "Alex", initials: "A", relationship: "friend", fictional: true }),
  chris: Object.freeze({ id: "chris", displayName: "Chris", initials: "C", relationship: "friend", fictional: true }),
  jay: Object.freeze({ id: "jay", displayName: "Jay", initials: "J", relationship: "friend", fictional: true }),
}) satisfies Readonly<Record<CoreSocialFriendId, CoreSocialFriend>>;
