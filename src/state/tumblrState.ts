import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export type TumblrView = "dashboard" | "post";

export type TumblrPostType = "text" | "photo" | "quote";

export type TumblrPost = {
  id: string;
  type: TumblrPostType;
  blog: string;
  title: string;
  content: string;
  timestamp: string;
  origin: ContentOrigin;
};

export type TumblrState = {
  currentView: TumblrView;
  selectedPostId: string | null;
  dashboardScrollPosition: number;
  likedPostIds: string[];
  rebloggedPostIds: string[];
  posts: readonly TumblrPost[];
};

export type TumblrEvent =
  | { type: "OPEN_POST"; postId: string; dashboardScrollPosition: number }
  | { type: "BACK_TO_DASHBOARD" }
  | { type: "TOGGLE_LIKE"; postId: string }
  | { type: "TOGGLE_REBLOG"; postId: string }
  | { type: "SET_DASHBOARD_SCROLL_POSITION"; dashboardScrollPosition: number }
  | { type: "DELIVER_BACKGROUND_POST"; post: Omit<TumblrPost, "origin"> }
  | { type: "RESET" };

export function createInitialTumblrState(): TumblrState {
  return {
    currentView: "dashboard",
    selectedPostId: null,
    dashboardScrollPosition: 0,
    likedPostIds: [],
    rebloggedPostIds: [],
    posts: SESSION_SEED_CONTENT.tumblr.map(post => ({ ...post })),
  };
}

export const initialTumblrState: TumblrState = createInitialTumblrState();

export function tumblrStateTransition(state: TumblrState, event: TumblrEvent): TumblrState {
  switch (event.type) {
    case "OPEN_POST": {
      const exists = state.posts.some(post => post.id === event.postId);
      if (!exists) return state;
      return {
        ...state,
        currentView: "post",
        selectedPostId: event.postId,
        dashboardScrollPosition: Math.max(0, event.dashboardScrollPosition),
      };
    }
    case "BACK_TO_DASHBOARD":
      return {
        ...state,
        currentView: "dashboard",
        selectedPostId: null,
      };
    case "TOGGLE_LIKE": {
      const liked = state.likedPostIds.includes(event.postId);
      return {
        ...state,
        likedPostIds: liked
          ? state.likedPostIds.filter(id => id !== event.postId)
          : [...state.likedPostIds, event.postId],
      };
    }
    case "TOGGLE_REBLOG": {
      const reblogged = state.rebloggedPostIds.includes(event.postId);
      return {
        ...state,
        rebloggedPostIds: reblogged
          ? state.rebloggedPostIds.filter(id => id !== event.postId)
          : [...state.rebloggedPostIds, event.postId],
      };
    }
    case "SET_DASHBOARD_SCROLL_POSITION":
      return {
        ...state,
        dashboardScrollPosition: Math.max(0, event.dashboardScrollPosition),
      };
    case "DELIVER_BACKGROUND_POST":
      return state.posts.some(post => post.id === event.post.id)
        ? state
        : { ...state, posts: [...state.posts, { ...event.post, origin: "live" }] };
    case "RESET":
      return createInitialTumblrState();
    default:
      return state;
  }
}
