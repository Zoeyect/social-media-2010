import {
  FOURSQUARE_HISTORICAL_CHECKINS,
  FOURSQUARE_HISTORICAL_VENUE_IDS,
  FOURSQUARE_HISTORY_COMPLETENESS,
  FOURSQUARE_NPC_IDS,
  filterValidFoursquareHistoricalCheckins,
  getFoursquarePacificLocalDateKey,
  type FoursquareHistoricalVenueId,
  type FoursquareHistoryCompleteness,
  type FoursquareMechanicsCoverage,
  type FoursquareNpcId,
} from "./foursquareHistoricalActivity";

export type FoursquareWeeklyRepeatVisitFact = Readonly<{
  venueId: FoursquareHistoricalVenueId;
  weekStartDate: string;
  visitDays: readonly string[];
}>;

export type FoursquareHistoricalGameFacts = Readonly<{
  characterId: FoursquareNpcId;
  recordCount: number;
  validRecordCount: number;
  uniqueVenueIds: readonly FoursquareHistoricalVenueId[];
  uniqueValidVisitDays: readonly string[];
  validVisitDaysByVenue: Readonly<Record<FoursquareHistoricalVenueId, number>>;
  weeklyRepeatVisitFacts: readonly FoursquareWeeklyRepeatVisitFact[];
  consecutiveNightFacts: Readonly<{ maximumRunLength: number; longestRuns: readonly (readonly string[])[] }>;
  sameNightDistinctStopFacts: Readonly<{ maximumDistinctStops: number; dates: readonly string[] }>;
  completeness: FoursquareHistoryCompleteness | null;
}>;

function getPacificWeekStart(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date.toISOString().slice(0, 10);
}

function getConsecutiveNightFacts(dateKeys: readonly string[]) {
  if (dateKeys.length === 0) return Object.freeze({ maximumRunLength: 0, longestRuns: Object.freeze([]) });
  const runs: string[][] = [];
  let current = [dateKeys[0]];
  for (const dateKey of dateKeys.slice(1)) {
    const previousMs = Date.parse(`${current[current.length - 1]}T00:00:00Z`);
    const currentMs = Date.parse(`${dateKey}T00:00:00Z`);
    if (currentMs - previousMs === 86_400_000) current.push(dateKey);
    else {
      runs.push(current);
      current = [dateKey];
    }
  }
  runs.push(current);
  const maximumRunLength = Math.max(...runs.map(run => run.length));
  return Object.freeze({ maximumRunLength, longestRuns: Object.freeze(runs.filter(run => run.length === maximumRunLength).map(run => Object.freeze(run))) });
}

export function deriveFoursquareHistoricalGameFacts(characterId: FoursquareNpcId): FoursquareHistoricalGameFacts {
  const records = FOURSQUARE_HISTORICAL_CHECKINS.filter(record => record.characterId === characterId);
  const validRecords = filterValidFoursquareHistoricalCheckins(records);
  const uniqueValidVisitDays = [...new Set(validRecords.map(record => getFoursquarePacificLocalDateKey(record.simulatedCreatedAt)))].sort();
  const uniqueVenueIds = [...new Set(validRecords.map(record => record.venueId))].sort() as FoursquareHistoricalVenueId[];
  const validVisitDaysByVenue = Object.freeze(Object.fromEntries(FOURSQUARE_HISTORICAL_VENUE_IDS.map(venueId => [venueId, new Set(validRecords.filter(record => record.venueId === venueId).map(record => getFoursquarePacificLocalDateKey(record.simulatedCreatedAt))).size])) as Record<FoursquareHistoricalVenueId, number>);

  const weeklyGroups = new Map<string, Set<string>>();
  for (const record of validRecords) {
    const dateKey = getFoursquarePacificLocalDateKey(record.simulatedCreatedAt);
    const groupKey = `${record.venueId}:${getPacificWeekStart(dateKey)}`;
    const days = weeklyGroups.get(groupKey) ?? new Set<string>();
    days.add(dateKey);
    weeklyGroups.set(groupKey, days);
  }
  const weeklyRepeatVisitFacts = [...weeklyGroups.entries()]
    .filter(([, days]) => days.size > 1)
    .map(([groupKey, days]) => {
      const [venueId, weekStartDate] = groupKey.split(":") as [FoursquareHistoricalVenueId, string];
      return Object.freeze({ venueId, weekStartDate, visitDays: Object.freeze([...days].sort()) });
    })
    .sort((left, right) => left.weekStartDate.localeCompare(right.weekStartDate) || left.venueId.localeCompare(right.venueId));

  const stopsByDate = new Map<string, Set<FoursquareHistoricalVenueId>>();
  for (const record of validRecords) {
    const dateKey = getFoursquarePacificLocalDateKey(record.simulatedCreatedAt);
    const stops = stopsByDate.get(dateKey) ?? new Set<FoursquareHistoricalVenueId>();
    stops.add(record.venueId);
    stopsByDate.set(dateKey, stops);
  }
  const maximumDistinctStops = stopsByDate.size === 0 ? 0 : Math.max(...[...stopsByDate.values()].map(stops => stops.size));

  return Object.freeze({
    characterId,
    recordCount: records.length,
    validRecordCount: validRecords.length,
    uniqueVenueIds: Object.freeze(uniqueVenueIds),
    uniqueValidVisitDays: Object.freeze(uniqueValidVisitDays),
    validVisitDaysByVenue,
    weeklyRepeatVisitFacts: Object.freeze(weeklyRepeatVisitFacts),
    consecutiveNightFacts: getConsecutiveNightFacts(uniqueValidVisitDays),
    sameNightDistinctStopFacts: Object.freeze({ maximumDistinctStops, dates: Object.freeze([...stopsByDate.entries()].filter(([, stops]) => stops.size === maximumDistinctStops).map(([dateKey]) => dateKey).sort()) }),
    completeness: FOURSQUARE_HISTORY_COMPLETENESS.find(entry => entry.characterId === characterId) ?? null,
  });
}

export function isFoursquareHistoricalMechanicsCoverageComplete(characterId: FoursquareNpcId, coverage: FoursquareMechanicsCoverage): boolean {
  const completeness = FOURSQUARE_HISTORY_COMPLETENESS.find(entry => entry.characterId === characterId);
  return completeness?.level === "complete-for-game-window" && completeness.mechanicsCoverage.includes(coverage);
}

export const FOURSQUARE_HISTORICAL_GAME_FACTS: readonly FoursquareHistoricalGameFacts[] = Object.freeze(
  FOURSQUARE_NPC_IDS.map(deriveFoursquareHistoricalGameFacts),
);
