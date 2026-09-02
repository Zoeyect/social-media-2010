import { CORE_SOCIAL_CHARACTERS, type CoreSocialCharacterId } from "./coreSocialFriends";

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
  Object.freeze({ id: "june-main-street-diner", friendId: "june", venueId: "main-street-diner", simulatedCreatedAt: "2010-10-19T22:52:00-07:00", shout: "Late dinner.", source: "seed", visible: true }),
  Object.freeze({ id: "mia-cedar-books", friendId: "foursquare-mia", venueId: "cedar-books", simulatedCreatedAt: "2010-10-19T20:42:00-07:00", source: "seed", visible: true }),
  Object.freeze({ id: "alex-riverside-evening", friendId: "alex", venueId: "riverside-park", simulatedCreatedAt: "2010-10-19T20:41:00-07:00", shout: "Evening walk with the dogs.", source: "seed", visible: true }),
  Object.freeze({ id: "katie-riverside-afternoon", friendId: "katie", venueId: "riverside-park", simulatedCreatedAt: "2010-10-19T17:18:00-07:00", source: "seed", visible: true }),
  Object.freeze({ id: "luca-main-street-diner", friendId: "luca", venueId: "main-street-diner", simulatedCreatedAt: "2010-10-19T15:06:00-07:00", source: "seed", visible: true }),
]);

export const FOURSQUARE_HIDDEN_LIVE_ACTIVITIES: Readonly<Record<string, FoursquareCheckinActivity>> = Object.freeze({
  "june-night-owl-checkin": Object.freeze({ id: "june-night-owl-checkin", friendId: "june", venueId: "night-owl", simulatedCreatedAt: "2010-10-20T00:10:30-07:00", source: "live", visible: false }),
});

export const FOURSQUARE_F1_REFERENCE_NOW = "2010-10-20T00:02:00-07:00";

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
