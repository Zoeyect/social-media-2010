import type { PublicVisitorTweet } from "../data/publicTwitterRepository";

export type PublicTwitterStatus = "idle" | "loading" | "ready" | "error";

export type PublicTwitterState = Readonly<{
  status: PublicTwitterStatus;
  approvedPosts: readonly PublicVisitorTweet[];
  selectedArchiveIds: readonly string[];
  revealedArchiveId: string | null;
  publicHandle: string | null;
  error: string | null;
}>;

export type PublicTwitterEvent =
  | { type: "LOAD_STARTED" }
  | { type: "LOAD_SUCCEEDED"; posts: readonly PublicVisitorTweet[]; selectedArchiveIds: readonly string[] }
  | { type: "LOAD_FAILED"; error: string }
  | { type: "TOGGLE_ARCHIVE_ACTIONS"; archiveId: string }
  | { type: "RESET_PUBLIC_SESSION" };

const EMPTY_POSTS: readonly PublicVisitorTweet[] = Object.freeze([]);
const EMPTY_IDS: readonly string[] = Object.freeze([]);

export const initialPublicTwitterState: PublicTwitterState = Object.freeze({
  status: "idle",
  approvedPosts: EMPTY_POSTS,
  selectedArchiveIds: EMPTY_IDS,
  revealedArchiveId: null,
  publicHandle: null,
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
    case "RESET_PUBLIC_SESSION":
      // This clears only local public-layer state. It never represents archive deletion.
      return initialPublicTwitterState;
  }
}
