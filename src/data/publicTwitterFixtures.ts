import type { PublicTwitterPostDto } from "./publicTwitterRepository";

// DEV / MOCK / NON-CANONICAL. These records exercise repository boundaries only.
export const PUBLIC_TWITTER_MOCK_DTOS: readonly PublicTwitterPostDto[] = Object.freeze([
  Object.freeze({
    id: "visitor-dev-0001",
    public_handle: "nightowl",
    display_name: "Night Owl",
    body: "anyone still awake?",
    real_created_at: "2026-08-01T04:00:00.000Z",
    simulated_2010_created_at: "2010-10-20T00:04:00-07:00",
    simulated_elapsed_ms: 120_000,
    origin: "public_visitor",
    moderation_status: "approved",
    deleted_at: null,
  }),
  Object.freeze({
    id: "visitor-dev-0002",
    public_handle: "studybreak",
    display_name: null,
    body: "this homework is killing me",
    real_created_at: "2026-08-01T03:59:00.000Z",
    simulated_2010_created_at: "2010-10-20T00:07:00-07:00",
    simulated_elapsed_ms: 300_000,
    origin: "public_visitor",
    moderation_status: "approved",
    deleted_at: null,
  }),
  Object.freeze({
    id: "visitor-dev-0003",
    public_handle: "@coffeerun",
    display_name: "Coffee Run",
    body: "need coffee",
    real_created_at: "2026-08-01T03:58:00.000Z",
    simulated_2010_created_at: "2010-10-20T00:11:00-07:00",
    simulated_elapsed_ms: 540_000,
    origin: "public_visitor",
    moderation_status: "approved",
    deleted_at: null,
  }),
]);
