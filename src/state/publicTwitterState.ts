import type { PublicVisitorTweet } from "../data/publicTwitterRepository";

export type PublicTwitterStatus = "idle" | "loading" | "ready" | "error";
export type PublicTwitterSubmissionStatus = "idle" | "awaiting_handle" | "submitting" | "submitted" | "failed";
export type PublicTwitterPendingSubmission = Readonly<{
  localTweetId: string;
  body: string;
  simulated2010CreatedAt: string;
  simulatedElapsedMs: number;
  idempotencyKey: string;
}>;

export type PublicTwitterState = Readonly<{
  status: PublicTwitterStatus;
  approvedPosts: readonly PublicVisitorTweet[];
  selectedArchiveIds: readonly string[];
  revealedArchiveId: string | null;
  publicHandle: string | null;
  submissionStatus: PublicTwitterSubmissionStatus;
  pendingSubmission: PublicTwitterPendingSubmission | null;
  lastSubmissionId: string | null;
  lastSubmissionError: string | null;
  error: string | null;
}>;

export type PublicTwitterEvent =
  | { type: "LOAD_STARTED" }
  | { type: "LOAD_SUCCEEDED"; posts: readonly PublicVisitorTweet[]; selectedArchiveIds: readonly string[] }
  | { type: "LOAD_FAILED"; error: string }
  | { type: "TOGGLE_ARCHIVE_ACTIONS"; archiveId: string }
  | { type: "BEGIN_PUBLIC_INTENT"; snapshot: PublicTwitterPendingSubmission }
  | { type: "SET_PUBLIC_HANDLE"; publicHandle: string }
  | { type: "SUBMISSION_STARTED" }
  | { type: "SUBMISSION_SUCCEEDED"; submissionId: string }
  | { type: "SUBMISSION_FAILED"; error: string }
  | { type: "RESET_PUBLIC_SESSION" };

const EMPTY_POSTS: readonly PublicVisitorTweet[] = Object.freeze([]);
const EMPTY_IDS: readonly string[] = Object.freeze([]);

export const initialPublicTwitterState: PublicTwitterState = Object.freeze({
  status: "idle",
  approvedPosts: EMPTY_POSTS,
  selectedArchiveIds: EMPTY_IDS,
  revealedArchiveId: null,
  publicHandle: null,
  submissionStatus: "idle",
  pendingSubmission: null,
  lastSubmissionId: null,
  lastSubmissionError: null,
  error: null,
});

export function publicTwitterStateTransition(
  state: PublicTwitterState,
  event: PublicTwitterEvent,
): PublicTwitterState {
  switch (event.type) {
    case "LOAD_STARTED":
      return { ...state, status: "loading", error: null };
    case "LOAD_SUCCEEDED":
      return { ...state, status: "ready", approvedPosts: Object.freeze([...event.posts]), selectedArchiveIds: Object.freeze([...event.selectedArchiveIds]), revealedArchiveId: null, error: null };
    case "LOAD_FAILED":
      return { ...state, status: "error", approvedPosts: EMPTY_POSTS, selectedArchiveIds: EMPTY_IDS, revealedArchiveId: null, error: event.error };
    case "TOGGLE_ARCHIVE_ACTIONS":
      if (!state.selectedArchiveIds.includes(event.archiveId)) return state;
      return { ...state, revealedArchiveId: state.revealedArchiveId === event.archiveId ? null : event.archiveId };
    case "BEGIN_PUBLIC_INTENT":
      return { ...state, pendingSubmission: Object.freeze({ ...event.snapshot }), submissionStatus: state.publicHandle ? "idle" : "awaiting_handle", lastSubmissionId: null, lastSubmissionError: null };
    case "SET_PUBLIC_HANDLE":
      return { ...state, publicHandle: event.publicHandle, submissionStatus: state.pendingSubmission ? "idle" : state.submissionStatus, lastSubmissionError: null };
    case "SUBMISSION_STARTED":
      return state.pendingSubmission && state.publicHandle ? { ...state, submissionStatus: "submitting", lastSubmissionError: null } : state;
    case "SUBMISSION_SUCCEEDED":
      return { ...state, submissionStatus: "submitted", lastSubmissionId: event.submissionId, lastSubmissionError: null };
    case "SUBMISSION_FAILED":
      return { ...state, submissionStatus: "failed", lastSubmissionError: event.error };
    case "RESET_PUBLIC_SESSION":
      // This clears only local public-layer state. It never represents archive deletion.
      return initialPublicTwitterState;
  }
}

export function normalizePublicTwitterHandle(input: string): string | null {
  const normalized = input.trim().replace(/^@/, "").toLowerCase();
  return /^[a-z0-9_]{1,15}$/.test(normalized) ? normalized : null;
}
