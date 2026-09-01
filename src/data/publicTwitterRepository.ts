export const PUBLIC_TWITTER_ORIGIN = "public_visitor" as const;
export const PUBLIC_TWITTER_BODY_MAX_CODE_UNITS = 140;
export const PUBLIC_TWITTER_SIMULATED_START_MS = Date.parse("2010-10-20T00:02:00-07:00");
export const PUBLIC_TWITTER_SIMULATED_END_MS = PUBLIC_TWITTER_SIMULATED_START_MS + 15 * 60_000;

export type PublicTwitterOrigin = typeof PUBLIC_TWITTER_ORIGIN;

export type PublicVisitorTweet = Readonly<{
  id: string;
  publicHandle: string;
  displayName?: string;
  body: string;
  realCreatedAt: string;
  simulated2010CreatedAt: string;
  simulatedElapsedMs: number;
  origin: PublicTwitterOrigin;
}>;

export type PublicTwitterPostDto = Readonly<{
  id: unknown;
  public_handle: unknown;
  display_name?: unknown;
  body: unknown;
  real_created_at: unknown;
  simulated_2010_created_at: unknown;
  simulated_elapsed_ms: unknown;
  origin: unknown;
  moderation_status: unknown;
  deleted_at: unknown;
}>;

export type PublicTwitterListOptions = Readonly<{
  limit?: number;
}>;

export interface PublicTwitterRepository {
  listApprovedPosts(options?: PublicTwitterListOptions): Promise<readonly PublicVisitorTweet[]>;
}

export type PublicTwitterMappingDiagnostic = (message: string, value: unknown) => void;

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizedPublicHandle(value: unknown) {
  if (!nonEmptyString(value)) return null;
  const normalized = value.trim().replace(/^@+/, "");
  return normalized.length > 0 ? normalized : null;
}

function validIsoTimestamp(value: unknown): value is string {
  return nonEmptyString(value) && Number.isFinite(Date.parse(value));
}

export function mapApprovedPublicTwitterPostDto(
  value: unknown,
  diagnostic?: PublicTwitterMappingDiagnostic,
): PublicVisitorTweet | null {
  const reject = (reason: string) => {
    diagnostic?.(reason, value);
    return null;
  };
  if (!value || typeof value !== "object") return reject("Public Twitter record is not an object.");
  const dto = value as PublicTwitterPostDto;
  if (!nonEmptyString(dto.id)) return reject("Public Twitter record has no stable id.");
  const publicHandle = normalizedPublicHandle(dto.public_handle);
  if (!publicHandle) return reject("Public Twitter record has no public handle.");
  if (!nonEmptyString(dto.body) || dto.body.trim().length > PUBLIC_TWITTER_BODY_MAX_CODE_UNITS) {
    return reject("Public Twitter record body violates the current 140 UTF-16 code-unit contract.");
  }
  if (!validIsoTimestamp(dto.real_created_at) || !validIsoTimestamp(dto.simulated_2010_created_at)) {
    return reject("Public Twitter record has an invalid timestamp.");
  }
  const simulatedTime = Date.parse(dto.simulated_2010_created_at);
  if (simulatedTime < PUBLIC_TWITTER_SIMULATED_START_MS || simulatedTime > PUBLIC_TWITTER_SIMULATED_END_MS) {
    return reject("Public Twitter record falls outside the canonical simulated experience window.");
  }
  const simulatedElapsedMs = typeof dto.simulated_elapsed_ms === "number"
    && Number.isInteger(dto.simulated_elapsed_ms)
    ? dto.simulated_elapsed_ms
    : null;
  if (simulatedElapsedMs === null
    || simulatedElapsedMs < 0
    || simulatedElapsedMs > 15 * 60_000
    || simulatedTime !== PUBLIC_TWITTER_SIMULATED_START_MS + simulatedElapsedMs) {
    return reject("Public Twitter record has inconsistent simulated elapsed time.");
  }
  if (dto.origin !== PUBLIC_TWITTER_ORIGIN) return reject("Public Twitter record has the wrong provenance.");
  if (dto.moderation_status !== "approved") return reject("Public Twitter record is not approved.");
  if (dto.deleted_at !== null && dto.deleted_at !== undefined) return reject("Public Twitter record is deleted.");
  if (dto.display_name !== undefined && dto.display_name !== null && !nonEmptyString(dto.display_name)) {
    return reject("Public Twitter record has an invalid display name.");
  }

  return Object.freeze({
    id: dto.id.trim(),
    publicHandle,
    ...(nonEmptyString(dto.display_name) ? { displayName: dto.display_name.trim() } : {}),
    body: dto.body.trim(),
    realCreatedAt: dto.real_created_at,
    simulated2010CreatedAt: dto.simulated_2010_created_at,
    simulatedElapsedMs,
    origin: PUBLIC_TWITTER_ORIGIN,
  });
}

export function mapApprovedPublicTwitterPostDtos(
  values: readonly unknown[],
  diagnostic?: PublicTwitterMappingDiagnostic,
) {
  return Object.freeze(values.flatMap(value => {
    const mapped = mapApprovedPublicTwitterPostDto(value, diagnostic);
    return mapped ? [mapped] : [];
  }));
}
