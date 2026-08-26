const FACEBOOK_TIME_ZONE = "America/Los_Angeles";
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export type FacebookStoryTimeInput = {
  storyId?: string;
  storyTimestamp: string;
  simulatedNowMs: number;
  storyType: "status" | "photo" | "album" | "checkin" | "activity";
  sourceApp?: string;
  surface?: "feed" | "detail";
};

function parseFacebookStoryTimestamp(storyTimestamp: string) {
  const clockMatch = storyTimestamp.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (clockMatch) {
    const [, hourText, minuteText, meridiem] = clockMatch;
    const hour12 = Number(hourText);
    const hour24 = hour12 % 12 + (meridiem === "PM" ? 12 : 0);
    return Date.parse(`2010-10-20T${String(hour24).padStart(2, "0")}:${minuteText}:00-07:00`);
  }

  const monthDayMatch = storyTimestamp.match(/^([A-Z][a-z]{2}) (\d{1,2})$/);
  if (monthDayMatch) return Date.parse(`${monthDayMatch[1]} ${monthDayMatch[2]}, 2010 12:00:00 GMT-0700`);
  return Date.parse(storyTimestamp);
}

function appendSource(metadata: string, sourceApp?: string) {
  return sourceApp ? `${metadata} via ${sourceApp}` : metadata;
}

function formatConciseAbsolute(storyTimeMs: number, simulatedNowMs: number) {
  const distanceMs = Math.abs(simulatedNowMs - storyTimeMs);
  if (distanceMs < 7 * DAY_MS) {
    return new Intl.DateTimeFormat("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", timeZone: FACEBOOK_TIME_ZONE }).format(storyTimeMs);
  }
  const storyYear = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: FACEBOOK_TIME_ZONE }).format(storyTimeMs);
  const currentYear = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: FACEBOOK_TIME_ZONE }).format(simulatedNowMs);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", ...(storyYear === currentYear ? {} : { year: "numeric" as const }), timeZone: FACEBOOK_TIME_ZONE }).format(storyTimeMs);
}

function facebookCalendarDateKey(timestampMs: number) {
  const parts = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: FACEBOOK_TIME_ZONE }).formatToParts(timestampMs);
  const part = (type: "year" | "month" | "day") => parts.find(value => value.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function isFacebookSeedStoryTimestampValid(storyTimestamp: string, sessionStartMs: number) {
  const storyTimeMs = parseFacebookStoryTimestamp(storyTimestamp);
  return Number.isFinite(storyTimeMs) && storyTimeMs < sessionStartMs;
}

export function formatFacebookStoryTime({ storyId, storyTimestamp, simulatedNowMs, storyType, sourceApp, surface = "feed" }: FacebookStoryTimeInput) {
  const storyTimeMs = parseFacebookStoryTimestamp(storyTimestamp);
  if (!Number.isFinite(storyTimeMs)) return appendSource(storyTimestamp, sourceApp);

  if (surface === "detail") {
    const detail = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: FACEBOOK_TIME_ZONE }).format(storyTimeMs);
    return appendSource(detail, sourceApp);
  }

  const deltaMs = simulatedNowMs - storyTimeMs;
  if (deltaMs < 0) {
    if (import.meta.env.DEV) console.warn(`[facebook-story-time] Future story ${storyId ?? "unknown"}: story=${storyTimestamp}; simulatedNow=${new Date(simulatedNowMs).toISOString()}`);
    return appendSource(formatConciseAbsolute(storyTimeMs, simulatedNowMs), sourceApp);
  }
  const ageMs = deltaMs;
  const isSameCalendarDate = facebookCalendarDateKey(storyTimeMs) === facebookCalendarDateKey(simulatedNowMs);
  const supportsRelativeTime = storyType === "status" || storyType === "photo" || storyType === "album" || storyType === "checkin" || storyType === "activity";
  if (isSameCalendarDate && supportsRelativeTime && ageMs < MINUTE_MS) return appendSource("just now", sourceApp);
  if (isSameCalendarDate && supportsRelativeTime && ageMs < 2 * MINUTE_MS) return appendSource("1 minute ago", sourceApp);
  if (isSameCalendarDate && supportsRelativeTime && ageMs < HOUR_MS) return appendSource(`${Math.floor(ageMs / MINUTE_MS)} minutes ago`, sourceApp);
  if (isSameCalendarDate && supportsRelativeTime && ageMs < 2 * HOUR_MS) return appendSource("1 hour ago", sourceApp);
  if (isSameCalendarDate && supportsRelativeTime && ageMs < DAY_MS) return appendSource(`${Math.floor(ageMs / HOUR_MS)} hours ago`, sourceApp);

  return appendSource(formatConciseAbsolute(storyTimeMs, simulatedNowMs), sourceApp);
}
