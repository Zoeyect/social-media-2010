import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export type TumblrView = "dashboard" | "post" | "reblog" | "notes";
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

export type TumblrReblog = {
  id: string;
  sourcePostId: string;
  reblogged: true;
  rebloggedBy: string;
  optionalUserText: string | null;
  actionTimestamp: number;
};

export type TumblrNote = {
  id: string;
  sourcePostId: string;
  blogName: string;
  type: "liked" | "reblogged";
  origin: "seed" | "user";
};

export type TumblrState = {
  currentView: TumblrView;
  selectedPostId: string | null;
  dashboardScrollPosition: number;
  likedPostIds: string[];
  rebloggedPostIds: string[];
  reblogs: TumblrReblog[];
  reblogDraft: string;
  notes: TumblrNote[];
  posts: readonly TumblrPost[];
};

export type TumblrEvent =
  | { type: "OPEN_POST"; postId: string; dashboardScrollPosition: number }
  | { type: "BACK_TO_DASHBOARD" }
  | { type: "TOGGLE_LIKE"; postId: string; blogName: string }
  | { type: "OPEN_REBLOG"; postId: string }
  | { type: "EDIT_REBLOG_TEXT"; value: string }
  | { type: "CANCEL_REBLOG" }
  | { type: "CONFIRM_REBLOG"; rebloggedBy: string; actionTimestamp: number }
  | { type: "REMOVE_REBLOG"; postId: string }
  | { type: "OPEN_NOTES"; postId: string }
  | { type: "BACK_TO_POST" }
  | { type: "SET_DASHBOARD_SCROLL_POSITION"; dashboardScrollPosition: number }
  | { type: "DELIVER_BACKGROUND_POST"; post: Omit<TumblrPost, "origin"> }
  | { type: "RESET" };

const TUMBLR_SEED_NOTES: ReadonlyArray<TumblrNote> = Object.freeze([
  Object.freeze({ id: "tumblr-seed-note:corner-photo:1", sourcePostId: "corner-photo", blogName: "nightreader", type: "liked", origin: "seed" }),
  Object.freeze({ id: "tumblr-seed-note:sunset-note:1", sourcePostId: "sunset-note", blogName: "smallhours", type: "reblogged", origin: "seed" }),
]);

export function createInitialTumblrState(): TumblrState {
  return {
    currentView: "dashboard",
    selectedPostId: null,
    dashboardScrollPosition: 0,
    likedPostIds: [],
    rebloggedPostIds: [],
    reblogs: [],
    reblogDraft: "",
    notes: TUMBLR_SEED_NOTES.map(note => ({ ...note })),
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
        reblogDraft: "",
      };
    }
    case "BACK_TO_DASHBOARD":
      return {
        ...state,
        currentView: "dashboard",
        selectedPostId: null,
        reblogDraft: "",
      };
    case "TOGGLE_LIKE": {
      if (!state.posts.some(post => post.id === event.postId)) return state;
      const liked = state.likedPostIds.includes(event.postId);
      const noteId = `user-like:${event.postId}`;
      return liked
        ? {
            ...state,
            likedPostIds: state.likedPostIds.filter(id => id !== event.postId),
            notes: state.notes.filter(note => note.id !== noteId),
          }
        : {
            ...state,
            likedPostIds: [...state.likedPostIds, event.postId],
            notes: [...state.notes.filter(note => note.id !== noteId), {
              id: noteId,
              sourcePostId: event.postId,
              blogName: event.blogName,
              type: "liked",
              origin: "user",
            }],
          };
    }
    case "OPEN_REBLOG": {
      if (!state.posts.some(post => post.id === event.postId) || state.rebloggedPostIds.includes(event.postId)) return state;
      return { ...state, currentView: "reblog", selectedPostId: event.postId, reblogDraft: "" };
    }
    case "EDIT_REBLOG_TEXT":
      return state.currentView === "reblog" ? { ...state, reblogDraft: event.value.slice(0, 140) } : state;
    case "CANCEL_REBLOG":
      return state.selectedPostId ? { ...state, currentView: "post", reblogDraft: "" } : state;
    case "CONFIRM_REBLOG": {
      const sourcePostId = state.selectedPostId;
      if (state.currentView !== "reblog" || !sourcePostId || state.rebloggedPostIds.includes(sourcePostId)) return state;
      const relationId = `user-reblog:${sourcePostId}`;
      return {
        ...state,
        currentView: "post",
        rebloggedPostIds: [...state.rebloggedPostIds, sourcePostId],
        reblogs: [...state.reblogs.filter(reblog => reblog.id !== relationId), {
          id: relationId,
          sourcePostId,
          reblogged: true,
          rebloggedBy: event.rebloggedBy,
          optionalUserText: state.reblogDraft.trim() || null,
          actionTimestamp: event.actionTimestamp,
        }],
        notes: [...state.notes.filter(note => note.id !== relationId), {
          id: relationId,
          sourcePostId,
          blogName: event.rebloggedBy,
          type: "reblogged",
          origin: "user",
        }],
        reblogDraft: "",
      };
    }
    case "REMOVE_REBLOG": {
      if (!state.rebloggedPostIds.includes(event.postId)) return state;
      const relationId = `user-reblog:${event.postId}`;
      return {
        ...state,
        rebloggedPostIds: state.rebloggedPostIds.filter(id => id !== event.postId),
        reblogs: state.reblogs.filter(reblog => reblog.id !== relationId),
        notes: state.notes.filter(note => note.id !== relationId),
      };
    }
    case "OPEN_NOTES":
      return state.selectedPostId === event.postId && state.posts.some(post => post.id === event.postId)
        ? { ...state, currentView: "notes" }
        : state;
    case "BACK_TO_POST":
      return state.selectedPostId ? { ...state, currentView: "post", reblogDraft: "" } : state;
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
  }
}
