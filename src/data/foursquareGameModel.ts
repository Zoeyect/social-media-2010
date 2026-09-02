import { FOURSQUARE_LEADERBOARD_SEED, FOURSQUARE_PLAYER_BASE_WEEKLY_POINTS, FOURSQUARE_PLAYER_STABLE_TIE_ORDER } from "./foursquareGameSeed";

export type FoursquarePointReason = "check_in";

export type FoursquarePointEvent = Readonly<{
  id: string;
  reason: FoursquarePointReason;
  delta: number;
  venueId: string;
  simulatedCreatedAt: number;
}>;

export type FoursquareLeaderboardEntry = Readonly<{
  identityId: string;
  weeklyPoints: number;
  stableTieOrder: number;
  rank: number;
  isPlayer: boolean;
}>;

type UnrankedLeaderboardEntry = Omit<FoursquareLeaderboardEntry, "rank">;

export type FoursquareCheckinResult = Readonly<{
  venueId: string;
  simulatedCreatedAt: number;
  pointEventIds: readonly string[];
  pointDelta: number;
  weeklyPointsAfter: number;
  rankBefore: number | null;
  rankAfter: number;
  badgeIdsUnlocked: readonly [];
  mayorshipChange: null;
}>;

export const getSessionPoints = (pointEvents: readonly FoursquarePointEvent[]): number => pointEvents.reduce((total, event) => total + event.delta, 0);

export const getPlayerWeeklyPoints = (pointEvents: readonly FoursquarePointEvent[]): number => FOURSQUARE_PLAYER_BASE_WEEKLY_POINTS + getSessionPoints(pointEvents);

export function buildLeaderboard(pointEvents: readonly FoursquarePointEvent[]): readonly FoursquareLeaderboardEntry[] {
  const unranked: UnrankedLeaderboardEntry[] = FOURSQUARE_LEADERBOARD_SEED.map(entry => ({ identityId: entry.characterId, weeklyPoints: entry.baseWeeklyPoints, stableTieOrder: entry.stableTieOrder, isPlayer: false }));
  if (pointEvents.length > 0) unranked.push({ identityId: "session-owner", weeklyPoints: getPlayerWeeklyPoints(pointEvents), stableTieOrder: FOURSQUARE_PLAYER_STABLE_TIE_ORDER, isPlayer: true });
  return unranked
    .sort((left, right) => right.weeklyPoints - left.weeklyPoints || left.stableTieOrder - right.stableTieOrder || left.identityId.localeCompare(right.identityId))
    .map((entry, index) => Object.freeze({ ...entry, rank: index + 1 }));
}

export function getPlayerRank(pointEvents: readonly FoursquarePointEvent[]): number | null {
  return buildLeaderboard(pointEvents).find(entry => entry.isPlayer)?.rank ?? null;
}

export function createCheckInPointEvent(venueId: string, simulatedCreatedAt: number): FoursquarePointEvent {
  return Object.freeze({ id: `check-in:${venueId}`, reason: "check_in", delta: 1, venueId, simulatedCreatedAt });
}

export function buildCheckinResult(pointEventsBefore: readonly FoursquarePointEvent[], pointEvent: FoursquarePointEvent): FoursquareCheckinResult {
  const pointEventsAfter = [...pointEventsBefore, pointEvent];
  const rankAfter = getPlayerRank(pointEventsAfter);
  if (rankAfter === null) throw new Error("A successful check-in must rank the player");
  return Object.freeze({
    venueId: pointEvent.venueId,
    simulatedCreatedAt: pointEvent.simulatedCreatedAt,
    pointEventIds: Object.freeze([pointEvent.id]),
    pointDelta: pointEvent.delta,
    weeklyPointsAfter: getPlayerWeeklyPoints(pointEventsAfter),
    rankBefore: getPlayerRank(pointEventsBefore),
    rankAfter,
    badgeIdsUnlocked: Object.freeze([]) as readonly [],
    mayorshipChange: null,
  });
}
