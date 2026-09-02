import type { CoreSocialCharacterId } from "./coreSocialFriends";

export type FoursquareLeaderboardSeedEntry = Readonly<{
  characterId: Extract<CoreSocialCharacterId, "alex" | "katie" | "june" | "luca"> | "foursquare-mia";
  baseWeeklyPoints: number;
  stableTieOrder: number;
}>;

export const FOURSQUARE_PLAYER_BASE_WEEKLY_POINTS = 0;
export const FOURSQUARE_PLAYER_STABLE_TIE_ORDER = 5;

export const FOURSQUARE_LEADERBOARD_SEED: readonly FoursquareLeaderboardSeedEntry[] = Object.freeze([
  Object.freeze({ characterId: "alex", baseWeeklyPoints: 18, stableTieOrder: 0 }),
  Object.freeze({ characterId: "katie", baseWeeklyPoints: 15, stableTieOrder: 1 }),
  Object.freeze({ characterId: "june", baseWeeklyPoints: 9, stableTieOrder: 2 }),
  Object.freeze({ characterId: "luca", baseWeeklyPoints: 4, stableTieOrder: 3 }),
  Object.freeze({ characterId: "foursquare-mia", baseWeeklyPoints: 2, stableTieOrder: 4 }),
]);
