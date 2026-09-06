import { SESSION_START_ISO } from "../state/deviceMachine";
import { CORE_SOCIAL_CHARACTERS, type CoreSocialCharacterId } from "./coreSocialFriends";
import { FOURSQUARE_FRIENDS_FEED_HISTORY_IDS, FOURSQUARE_HISTORICAL_CHECKINS, type FoursquareHistoricalCheckin } from "./foursquareHistoricalActivity";

export type FoursquareFriendId = CoreSocialCharacterId | "foursquare-mia";

export const FOURSQUARE_F1_PERIPHERAL_PEOPLE = Object.freeze({
  "foursquare-mia": Object.freeze({ id: "foursquare-mia" as const, displayName: "Mia", classification: "HOLD-fictional" as const }),
});

export type FoursquareCheckinActivity = Readonly<{
  id: string;
  friendId: FoursquareFriendId;
  venueId: string;
  simulatedCreatedAt: string;
  shout?: string;
  mayorStatus?: "mayor";
  source: "seed" | "live";
  visible: boolean;
}>;

export const FOURSQUARE_F1_CHECKIN_ACTIVITIES: readonly FoursquareCheckinActivity[] = Object.freeze([
  Object.freeze({ id: "mia-cedar-books", friendId: "foursquare-mia", venueId: "cedar-books", simulatedCreatedAt: "2010-10-19T20:42:00-07:00", source: "seed", visible: true }),
]);

const FOURSQUARE_HISTORY_BY_ID: ReadonlyMap<string, FoursquareHistoricalCheckin> = new Map(
  FOURSQUARE_HISTORICAL_CHECKINS.map(record => [record.id, record]),
);

type FoursquareHistoricalProjectedFriendId = Extract<
  FoursquareHistoricalCheckin["characterId"],
  FoursquareFriendId
>;

const FOURSQUARE_HISTORICAL_PROJECTED_FRIEND_IDS: ReadonlySet<string> = new Set([
  "june",
  "alex",
  "katie",
  "luca",
]);

function isFoursquareHistoricalProjectedFriendId(
  characterId: FoursquareHistoricalCheckin["characterId"],
): characterId is FoursquareHistoricalProjectedFriendId {
  return FOURSQUARE_HISTORICAL_PROJECTED_FRIEND_IDS.has(characterId);
}

export function projectFoursquareHistoricalFriendsActivity(historicalId: string): FoursquareCheckinActivity {
  const record = FOURSQUARE_HISTORY_BY_ID.get(historicalId);
  if (!record) throw new Error(`[foursquare-content] unresolved historical Friends-feed ID: ${historicalId}`);
  if (!isFoursquareHistoricalProjectedFriendId(record.characterId)) {
    throw new Error(`[foursquare-content] unsupported historical Friends-feed character: ${record.characterId}`);
  }
  return Object.freeze({
    id: record.id,
    friendId: record.characterId,
    venueId: record.venueId,
    simulatedCreatedAt: record.simulatedCreatedAt,
    ...(record.shout === null ? {} : { shout: record.shout }),
    source: "seed" as const,
    visible: true,
  });
}

export const FOURSQUARE_HISTORICAL_FRIENDS_FEED_ACTIVITIES: readonly FoursquareCheckinActivity[] = Object.freeze(
  FOURSQUARE_FRIENDS_FEED_HISTORY_IDS.map(projectFoursquareHistoricalFriendsActivity),
);

export function createInitialFoursquareFriendsActivities(): FoursquareCheckinActivity[] {
  return [...FOURSQUARE_HISTORICAL_FRIENDS_FEED_ACTIVITIES, ...FOURSQUARE_F1_CHECKIN_ACTIVITIES]
    .filter(activity => activity.visible)
    .sort((left, right) => Date.parse(right.simulatedCreatedAt) - Date.parse(left.simulatedCreatedAt))
    .map(activity => ({ ...activity }));
}

export const FOURSQUARE_HIDDEN_LIVE_ACTIVITIES: Readonly<Record<string, FoursquareCheckinActivity>> = Object.freeze({
  "june-night-owl-checkin": Object.freeze({ id: "june-night-owl-checkin", friendId: "june", venueId: "night-owl", simulatedCreatedAt: "2010-10-20T00:10:30-07:00", source: "live", visible: false }),
});

export const FOURSQUARE_F1_REFERENCE_NOW = SESSION_START_ISO;

export type FoursquareVenueTip = Readonly<{
  id: string;
  venueId: string;
  authorId: CoreSocialCharacterId;
  authorDisplayName: string;
  text: string;
  source: "seed";
  classification: "HOLD-fictional";
}>;

export const FOURSQUARE_VENUE_TIPS: readonly FoursquareVenueTip[] = Object.freeze([
  Object.freeze({ id: "night-owl-tip", venueId: "night-owl", authorId: CORE_SOCIAL_CHARACTERS.june.id, authorDisplayName: "June", text: "The coffee is strongest after ten.", source: "seed", classification: "HOLD-fictional" }),
]);

export function selectFoursquareVenueTips(venueId: string): readonly FoursquareVenueTip[] {
  return FOURSQUARE_VENUE_TIPS.filter(tip => tip.venueId === venueId);
}
