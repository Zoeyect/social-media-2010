export type TumblrView = "dashboard" | "post";

export type TumblrPostType = "text" | "photo" | "quote";

export type TumblrPost = {
  id: string;
  type: TumblrPostType;
  blog: string;
  title: string;
  content: string;
  timestamp: string;
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
  | { type: "RESET" };

const initialPosts: TumblrPost[] = [
  {
    id: "sunset-note",
    type: "text",
    blog: "dayonejournal",
    title: "Evening walk",
    content: "The lights on the avenue feel older than we used to remember.",
    timestamp: "2010-10-20 12:06 AM",
  },
  {
    id: "corner-photo",
    type: "photo",
    blog: "streetlog",
    title: "Corner shot",
    content: "Photo post (placeholder, no fixture image in v0.1).",
    timestamp: "2010-10-20 12:08 AM",
  },
  {
    id: "quote-post",
    type: "quote",
    blog: "tinyquotes",
    title: "Quote",
    content: "“The long night begins with one silent decision.”",
    timestamp: "2010-10-20 12:10 AM",
  },
];

export const initialTumblrState: TumblrState = {
  currentView: "dashboard",
  selectedPostId: null,
  dashboardScrollPosition: 0,
  likedPostIds: [],
  rebloggedPostIds: [],
  posts: initialPosts,
};

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
    case "RESET":
      return {
        ...initialTumblrState,
      };
    default:
      return state;
  }
}
