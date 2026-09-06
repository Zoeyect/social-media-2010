import type { CanonicalVenueId } from "./canonicalVenues";

export const FOURSQUARE_HISTORY_WINDOW_START = "2010-08-21T00:00:00-07:00" as const;
export const FOURSQUARE_HISTORY_WINDOW_END = "2010-10-19T22:02:00-07:00" as const;
export const FOURSQUARE_HISTORY_TIME_ZONE = "America/Los_Angeles" as const;

export const FOURSQUARE_NPC_IDS = Object.freeze(["alex", "katie", "june", "luca", "mia"] as const);
export type FoursquareNpcId = typeof FOURSQUARE_NPC_IDS[number];

export const FOURSQUARE_HISTORICAL_VENUE_IDS = Object.freeze([
  "main-street-diner",
  "riverside-park",
  "downtown-coffee",
  "community-courts",
  "westside-library",
  "gelato-roma",
] as const satisfies readonly CanonicalVenueId[]);
export type FoursquareHistoricalVenueId = typeof FOURSQUARE_HISTORICAL_VENUE_IDS[number];

export type FoursquareHistoricalCheckin = Readonly<{
  id: string;
  characterId: FoursquareNpcId;
  venueId: FoursquareHistoricalVenueId;
  simulatedCreatedAt: string;
  shout: string | null;
  source: "seed";
  classification: "PROJECT-CURATED-FICTION";
  validForGameMechanics: boolean;
  validityClassification: "PROJECT-RECONSTRUCTED-VALID" | "NARRATIVE-ONLY";
}>;

export type FoursquareHistoryCompletenessLevel = "display-selected" | "complete-for-game-window";
export type FoursquareMechanicsCoverage =
  | "rolling-visit-days"
  | "weekly-repeat-visits"
  | "consecutive-nights"
  | "same-night-stops";

export type FoursquareHistoryCompleteness = Readonly<{
  characterId: FoursquareNpcId;
  windowStart: string;
  windowEnd: string;
  level: FoursquareHistoryCompletenessLevel;
  mechanicsCoverage: readonly FoursquareMechanicsCoverage[];
  lifetimeHistoryComplete: false;
}>;

export const FOURSQUARE_HISTORICAL_CHECKINS: readonly FoursquareHistoricalCheckin[] = Object.freeze([
  { id: "foursquare-history-alex-2010-08-22-riverside-park", characterId: "alex", venueId: "riverside-park", simulatedCreatedAt: "2010-08-22T11:20:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-08-24-westside-library", characterId: "katie", venueId: "westside-library", simulatedCreatedAt: "2010-08-24T16:10:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-08-27-downtown-coffee", characterId: "alex", venueId: "downtown-coffee", simulatedCreatedAt: "2010-08-27T08:10:00-07:00", shout: "Needed coffee.", source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-08-29-riverside-park", characterId: "katie", venueId: "riverside-park", simulatedCreatedAt: "2010-08-29T13:40:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-09-01-main-street-diner", characterId: "alex", venueId: "main-street-diner", simulatedCreatedAt: "2010-09-01T12:35:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-09-02-gelato-roma", characterId: "katie", venueId: "gelato-roma", simulatedCreatedAt: "2010-09-02T16:25:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-june-2010-09-03-downtown-coffee", characterId: "june", venueId: "downtown-coffee", simulatedCreatedAt: "2010-09-03T12:20:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-09-04-downtown-coffee", characterId: "alex", venueId: "downtown-coffee", simulatedCreatedAt: "2010-09-04T10:15:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-luca-2010-09-05-community-courts", characterId: "luca", venueId: "community-courts", simulatedCreatedAt: "2010-09-05T16:30:00-07:00", shout: "One more game.", source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-09-07-westside-library", characterId: "katie", venueId: "westside-library", simulatedCreatedAt: "2010-09-07T17:05:00-07:00", shout: "Finally done studying.", source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-09-09-community-courts", characterId: "alex", venueId: "community-courts", simulatedCreatedAt: "2010-09-09T18:10:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-09-11-downtown-coffee", characterId: "katie", venueId: "downtown-coffee", simulatedCreatedAt: "2010-09-11T12:15:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-june-2010-09-12-main-street-diner", characterId: "june", venueId: "main-street-diner", simulatedCreatedAt: "2010-09-12T18:30:00-07:00", shout: "Dinner with everyone.", source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-09-14-riverside-park", characterId: "alex", venueId: "riverside-park", simulatedCreatedAt: "2010-09-14T18:35:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-09-16-riverside-park", characterId: "katie", venueId: "riverside-park", simulatedCreatedAt: "2010-09-16T16:45:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-09-18-main-street-diner", characterId: "alex", venueId: "main-street-diner", simulatedCreatedAt: "2010-09-18T19:20:00-07:00", shout: "Food then home.", source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-luca-2010-09-20-riverside-park", characterId: "luca", venueId: "riverside-park", simulatedCreatedAt: "2010-09-20T18:20:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-09-22-main-street-diner", characterId: "katie", venueId: "main-street-diner", simulatedCreatedAt: "2010-09-22T18:10:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-09-24-downtown-coffee", characterId: "alex", venueId: "downtown-coffee", simulatedCreatedAt: "2010-09-24T08:45:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-09-26-westside-library", characterId: "katie", venueId: "westside-library", simulatedCreatedAt: "2010-09-26T15:20:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-june-2010-09-27-riverside-park", characterId: "june", venueId: "riverside-park", simulatedCreatedAt: "2010-09-27T17:25:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-09-29-westside-library", characterId: "alex", venueId: "westside-library", simulatedCreatedAt: "2010-09-29T17:40:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-10-01-westside-library", characterId: "katie", venueId: "westside-library", simulatedCreatedAt: "2010-10-01T16:05:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-10-02-gelato-roma", characterId: "alex", venueId: "gelato-roma", simulatedCreatedAt: "2010-10-02T21:05:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-luca-2010-10-03-gelato-roma", characterId: "luca", venueId: "gelato-roma", simulatedCreatedAt: "2010-10-03T19:00:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-june-2010-10-04-downtown-coffee", characterId: "june", venueId: "downtown-coffee", simulatedCreatedAt: "2010-10-04T13:05:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-10-05-gelato-roma", characterId: "katie", venueId: "gelato-roma", simulatedCreatedAt: "2010-10-05T17:35:00-07:00", shout: "Getting gelato :)", source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-10-06-main-street-diner", characterId: "alex", venueId: "main-street-diner", simulatedCreatedAt: "2010-10-06T18:50:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-10-09-riverside-park", characterId: "alex", venueId: "riverside-park", simulatedCreatedAt: "2010-10-09T16:10:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-10-10-main-street-diner", characterId: "katie", venueId: "main-street-diner", simulatedCreatedAt: "2010-10-10T18:15:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-luca-2010-10-11-community-courts", characterId: "luca", venueId: "community-courts", simulatedCreatedAt: "2010-10-11T17:45:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-june-2010-10-12-gelato-roma", characterId: "june", venueId: "gelato-roma", simulatedCreatedAt: "2010-10-12T19:10:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-10-13-downtown-coffee", characterId: "alex", venueId: "downtown-coffee", simulatedCreatedAt: "2010-10-13T12:25:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-10-15-gelato-roma", characterId: "katie", venueId: "gelato-roma", simulatedCreatedAt: "2010-10-15T18:40:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-10-16-community-courts", characterId: "alex", venueId: "community-courts", simulatedCreatedAt: "2010-10-16T15:30:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-luca-2010-10-19-main-street-diner", characterId: "luca", venueId: "main-street-diner", simulatedCreatedAt: "2010-10-19T15:06:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-katie-2010-10-19-riverside-park", characterId: "katie", venueId: "riverside-park", simulatedCreatedAt: "2010-10-19T17:18:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-alex-2010-10-19-riverside-park", characterId: "alex", venueId: "riverside-park", simulatedCreatedAt: "2010-10-19T20:41:00-07:00", shout: "Evening walk with the dogs.", source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
  { id: "foursquare-history-june-2010-10-19-main-street-diner", characterId: "june", venueId: "main-street-diner", simulatedCreatedAt: "2010-10-19T21:12:00-07:00", shout: null, source: "seed", classification: "PROJECT-CURATED-FICTION", validForGameMechanics: true, validityClassification: "PROJECT-RECONSTRUCTED-VALID" },
]);
export const FOURSQUARE_HISTORY_COMPLETENESS: readonly FoursquareHistoryCompleteness[] = Object.freeze([
  {
    characterId: "alex",
    windowStart: FOURSQUARE_HISTORY_WINDOW_START,
    windowEnd: FOURSQUARE_HISTORY_WINDOW_END,
    level: "complete-for-game-window",
    mechanicsCoverage: Object.freeze<FoursquareMechanicsCoverage[]>(["rolling-visit-days", "weekly-repeat-visits", "consecutive-nights", "same-night-stops"]),
    lifetimeHistoryComplete: false,
  },
  {
    characterId: "katie",
    windowStart: FOURSQUARE_HISTORY_WINDOW_START,
    windowEnd: FOURSQUARE_HISTORY_WINDOW_END,
    level: "complete-for-game-window",
    mechanicsCoverage: Object.freeze<FoursquareMechanicsCoverage[]>(["rolling-visit-days", "weekly-repeat-visits", "consecutive-nights", "same-night-stops"]),
    lifetimeHistoryComplete: false,
  },
  {
    characterId: "june",
    windowStart: FOURSQUARE_HISTORY_WINDOW_START,
    windowEnd: FOURSQUARE_HISTORY_WINDOW_END,
    level: "complete-for-game-window",
    mechanicsCoverage: Object.freeze<FoursquareMechanicsCoverage[]>(["rolling-visit-days", "weekly-repeat-visits", "consecutive-nights", "same-night-stops"]),
    lifetimeHistoryComplete: false,
  },
  {
    characterId: "luca",
    windowStart: FOURSQUARE_HISTORY_WINDOW_START,
    windowEnd: FOURSQUARE_HISTORY_WINDOW_END,
    level: "complete-for-game-window",
    mechanicsCoverage: Object.freeze<FoursquareMechanicsCoverage[]>(["rolling-visit-days", "weekly-repeat-visits", "consecutive-nights", "same-night-stops"]),
    lifetimeHistoryComplete: false,
  },
]);
export const FOURSQUARE_FRIENDS_FEED_HISTORY_IDS: readonly string[] = Object.freeze([]);

const NPC_ID_SET: ReadonlySet<string> = new Set(FOURSQUARE_NPC_IDS);
const HISTORICAL_VENUE_ID_SET: ReadonlySet<string> = new Set(FOURSQUARE_HISTORICAL_VENUE_IDS);
const COMPLETENESS_LEVEL_SET: ReadonlySet<string> = new Set(["display-selected", "complete-for-game-window"]);
const MECHANICS_COVERAGE_SET: ReadonlySet<string> = new Set([
  "rolling-visit-days",
  "weekly-repeat-visits",
  "consecutive-nights",
  "same-night-stops",
]);
const EXPLICIT_PDT_ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})-07:00$/;
const WINDOW_START_MS = Date.parse(FOURSQUARE_HISTORY_WINDOW_START);
const WINDOW_END_MS = Date.parse(FOURSQUARE_HISTORY_WINDOW_END);
const PACIFIC_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: FOURSQUARE_HISTORY_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function fail(message: string): never {
  throw new Error(`[foursquare-history] ${message}`);
}

function pacificDateTimeParts(epochMs: number) {
  const values = Object.fromEntries(
    PACIFIC_DATE_TIME_FORMATTER.formatToParts(epochMs)
      .filter(part => part.type !== "literal")
      .map(part => [part.type, part.value]),
  );
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

export function isFoursquareNpcId(value: unknown): value is FoursquareNpcId {
  return typeof value === "string" && NPC_ID_SET.has(value);
}

export function isFoursquareHistoricalVenueId(value: unknown): value is FoursquareHistoricalVenueId {
  return typeof value === "string" && HISTORICAL_VENUE_ID_SET.has(value);
}

export function parseFoursquareHistoricalTimestamp(value: string): number {
  const match = EXPLICIT_PDT_ISO_PATTERN.exec(value);
  if (!match) fail(`timestamp must use YYYY-MM-DDTHH:mm:ss-07:00: ${value}`);
  const epochMs = Date.parse(value);
  if (!Number.isFinite(epochMs)) fail(`timestamp is not parseable: ${value}`);
  const [, year, month, day, hour, minute, second] = match;
  const derived = pacificDateTimeParts(epochMs);
  if (
    derived.year !== year
    || derived.month !== month
    || derived.day !== day
    || derived.hour !== hour
    || derived.minute !== minute
    || derived.second !== second
  ) fail(`timestamp is not a real Pacific local date/time: ${value}`);
  return epochMs;
}

export function getFoursquarePacificLocalDateKey(simulatedCreatedAt: string): string {
  const derived = pacificDateTimeParts(parseFoursquareHistoricalTimestamp(simulatedCreatedAt));
  return `${derived.year}-${derived.month}-${derived.day}`;
}

export function getFoursquareHistoricalVisitDayKey(record: FoursquareHistoricalCheckin): string {
  return `${record.characterId}:${record.venueId}:${getFoursquarePacificLocalDateKey(record.simulatedCreatedAt)}`;
}

export function isFoursquareHistoricalCheckinId(value: string, record: Pick<FoursquareHistoricalCheckin, "characterId" | "venueId" | "simulatedCreatedAt">): boolean {
  const localDate = getFoursquarePacificLocalDateKey(record.simulatedCreatedAt);
  const prefix = `foursquare-history-${record.characterId}-${localDate}-${record.venueId}`;
  return value === prefix || new RegExp(`^${prefix}-[a-z0-9]+$`).test(value);
}

export function assertValidFoursquareHistoricalCheckin(value: unknown): asserts value is FoursquareHistoricalCheckin {
  if (typeof value !== "object" || value === null) fail("check-in must be an object");
  const record = value as Record<string, unknown>;
  if (!isFoursquareNpcId(record.characterId)) fail(`characterId must be an approved NPC: ${String(record.characterId)}`);
  if (!isFoursquareHistoricalVenueId(record.venueId)) fail(`venueId must be an approved historical venue: ${String(record.venueId)}`);
  if (typeof record.simulatedCreatedAt !== "string") fail("simulatedCreatedAt must be a string");
  const epochMs = parseFoursquareHistoricalTimestamp(record.simulatedCreatedAt);
  if (epochMs < WINDOW_START_MS || epochMs > WINDOW_END_MS) fail(`timestamp is outside the F6 window: ${record.simulatedCreatedAt}`);
  if (typeof record.id !== "string" || !isFoursquareHistoricalCheckinId(record.id, record as unknown as FoursquareHistoricalCheckin)) fail(`id does not follow the deterministic convention: ${String(record.id)}`);
  if (record.shout !== null && typeof record.shout !== "string") fail("shout must be a string or null");
  if (record.source !== "seed") fail("source must be seed");
  if (record.classification !== "PROJECT-CURATED-FICTION") fail("classification must be PROJECT-CURATED-FICTION");
  if (typeof record.validForGameMechanics !== "boolean") fail("validForGameMechanics must be boolean");
  const expectedValidity = record.validForGameMechanics ? "PROJECT-RECONSTRUCTED-VALID" : "NARRATIVE-ONLY";
  if (record.validityClassification !== expectedValidity) fail(`validityClassification must be ${expectedValidity}`);
}

export function assertValidFoursquareHistoricalCheckins(records: readonly unknown[]): asserts records is readonly FoursquareHistoricalCheckin[] {
  const ids = new Set<string>();
  for (const record of records) {
    assertValidFoursquareHistoricalCheckin(record);
    if (ids.has(record.id)) fail(`duplicate historical check-in id: ${record.id}`);
    ids.add(record.id);
  }
}

export function assertValidFoursquareHistoryCompleteness(value: unknown): asserts value is FoursquareHistoryCompleteness {
  if (typeof value !== "object" || value === null) fail("completeness entry must be an object");
  const entry = value as Record<string, unknown>;
  if (!isFoursquareNpcId(entry.characterId)) fail(`completeness characterId must be an approved NPC: ${String(entry.characterId)}`);
  if (entry.windowStart !== FOURSQUARE_HISTORY_WINDOW_START || entry.windowEnd !== FOURSQUARE_HISTORY_WINDOW_END) fail("completeness window must equal the canonical F6 window");
  if (typeof entry.level !== "string" || !COMPLETENESS_LEVEL_SET.has(entry.level)) fail(`invalid completeness level: ${String(entry.level)}`);
  if (!Array.isArray(entry.mechanicsCoverage) || entry.mechanicsCoverage.some(value => typeof value !== "string" || !MECHANICS_COVERAGE_SET.has(value))) fail("invalid mechanics coverage");
  if (entry.lifetimeHistoryComplete !== false) fail("lifetimeHistoryComplete must remain false");
}

export function sortFoursquareHistoricalCheckinsOldestFirst(records: readonly FoursquareHistoricalCheckin[]): FoursquareHistoricalCheckin[] {
  assertValidFoursquareHistoricalCheckins(records);
  return [...records].sort((left, right) => {
    const chronological = parseFoursquareHistoricalTimestamp(left.simulatedCreatedAt) - parseFoursquareHistoricalTimestamp(right.simulatedCreatedAt);
    return chronological || left.id.localeCompare(right.id);
  });
}

export function filterValidFoursquareHistoricalCheckins(records: readonly FoursquareHistoricalCheckin[]): FoursquareHistoricalCheckin[] {
  assertValidFoursquareHistoricalCheckins(records);
  return sortFoursquareHistoricalCheckinsOldestFirst(records.filter(record => record.validForGameMechanics));
}

export function getUniqueValidFoursquareVenueIds(records: readonly FoursquareHistoricalCheckin[], characterId?: FoursquareNpcId): FoursquareHistoricalVenueId[] {
  const valid = filterValidFoursquareHistoricalCheckins(records)
    .filter(record => characterId === undefined || record.characterId === characterId)
    .map(record => record.venueId);
  return [...new Set(valid)].sort();
}

export function getUniqueValidVisitDaysForVenue(
  records: readonly FoursquareHistoricalCheckin[],
  characterId: FoursquareNpcId,
  venueId: FoursquareHistoricalVenueId,
): string[] {
  const dateKeys = filterValidFoursquareHistoricalCheckins(records)
    .filter(record => record.characterId === characterId && record.venueId === venueId)
    .map(record => getFoursquarePacificLocalDateKey(record.simulatedCreatedAt));
  return [...new Set(dateKeys)].sort();
}
