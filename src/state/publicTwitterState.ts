import type { PublicVisitorTweet } from "../data/publicTwitterRepository";

export type PublicTwitterStatus = "idle" | "loading" | "ready" | "error";

export type PublicTwitterState = Readonly<{
  status: PublicTwitterStatus;
  approvedPosts: readonly PublicVisitorTweet[];
  selectedArchiveIds: readonly string[];
  publicHandle: string | null;
  error: string | null;
}>;

export type PublicTwitterEvent =
  | { type: "LOAD_STARTED" }
  | { type: "LOAD_SUCCEEDED"; posts: readonly PublicVisitorTweet[] }
  | { type: "LOAD_FAILED"; error: string }
  | { type: "RESET_PUBLIC_SESSION" };

const EMPTY_POSTS: readonly PublicVisitorTweet[] = Object.freeze([]);
const EMPTY_IDS: readonly string[] = Object.freeze([]);

export const initialPublicTwitterState: PublicTwitterState = Object.freeze({
  status: "idle",
  approvedPosts: EMPTY_POSTS,
  selectedArchiveIds: EMPTY_IDS,
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
      return { ...state, status: "ready", approvedPosts: Object.freeze([...event.posts]), error: null };
    case "LOAD_FAILED":
      return { ...state, status: "error", approvedPosts: EMPTY_POSTS, error: event.error };
    case "RESET_PUBLIC_SESSION":
      // This clears only local public-layer state. It never represents archive deletion.
      return initialPublicTwitterState;
  }
}
