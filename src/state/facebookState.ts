export type FacebookView = "feed" | "feedDetail" | "friendRequests" | "messages" | "messageDetail";
export type FacebookFriendRequestState = "none" | "pending" | "accepted" | "ignored";
export type FacebookMessageState = "none" | "unread" | "read";

export type FacebookFeedItem = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  kind: "status" | "photoActivity" | "socialActivity";
  contentStatus: "HOLD-fictional";
};

export type FacebookState = {
  currentView: FacebookView;
  feed: FacebookFeedItem[];
  selectedFeedItemId: string | null;
  scrollPosition: number;
  likedItemIds: string[];
  friendRequestState: FacebookFriendRequestState;
  juneMessageState: FacebookMessageState;
};

export type FacebookEvent =
  | { type: "SHOW_FEED" }
  | { type: "OPEN_FEED_ITEM"; itemId: string; scrollPosition: number }
  | { type: "SET_SCROLL_POSITION"; scrollPosition: number }
  | { type: "TOGGLE_LIKE"; itemId: string }
  | { type: "SHOW_FRIEND_REQUESTS" }
  | { type: "ACCEPT_JACK" }
  | { type: "IGNORE_JACK" }
  | { type: "SHOW_MESSAGES" }
  | { type: "OPEN_JUNE_MESSAGE" }
  | { type: "DELIVER_JACK_REQUEST" }
  | { type: "DELIVER_JUNE_MESSAGE" }
  | { type: "RESET"; displayName?: string };

const periodFeed = (sessionDisplayName: string): FacebookFeedItem[] => [
  {
    id: "owner-home",
    author: sessionDisplayName,
    text: "finally home.",
    timestamp: "12:10 AM",
    kind: "status",
    contentStatus: "HOLD-fictional",
  },
  {
    id: "june-photo",
    author: "June",
    text: "added a new photo.",
    timestamp: "12:04 AM",
    kind: "photoActivity",
    contentStatus: "HOLD-fictional",
  },
  {
    id: "jack-movie",
    author: "Jack",
    text: "That movie was better than I expected.",
    timestamp: "11:52 PM",
    kind: "status",
    contentStatus: "HOLD-fictional",
  },
  {
    id: "mia-coffee",
    author: "Mia",
    text: "likes a coffee shop downtown.",
    timestamp: "11:41 PM",
    kind: "socialActivity",
    contentStatus: "HOLD-fictional",
  },
  {
    id: "eli-reading",
    author: "Eli",
    text: "One more chapter before bed.",
    timestamp: "11:33 PM",
    kind: "status",
    contentStatus: "HOLD-fictional",
  },
];

export function createInitialFacebookState(displayName: string): FacebookState {
  return {
    currentView: "feed",
    feed: periodFeed(displayName),
    selectedFeedItemId: null,
    scrollPosition: 0,
    likedItemIds: [],
    friendRequestState: "none",
    juneMessageState: "none",
  };
}

export function facebookStateTransition(state: FacebookState, event: FacebookEvent): FacebookState {
  switch (event.type) {
    case "SHOW_FEED":
      return { ...state, currentView: "feed", selectedFeedItemId: null };
    case "OPEN_FEED_ITEM":
      if (!state.feed.some(item => item.id === event.itemId)) return state;
      return {
        ...state,
        currentView: "feedDetail",
        selectedFeedItemId: event.itemId,
        scrollPosition: Math.max(0, event.scrollPosition),
      };
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: Math.max(0, event.scrollPosition) };
    case "TOGGLE_LIKE":
      if (!state.feed.some(item => item.id === event.itemId)) return state;
      return state.likedItemIds.includes(event.itemId)
        ? { ...state, likedItemIds: state.likedItemIds.filter(id => id !== event.itemId) }
        : { ...state, likedItemIds: [...state.likedItemIds, event.itemId] };
    case "SHOW_FRIEND_REQUESTS":
      return { ...state, currentView: "friendRequests", selectedFeedItemId: null };
    case "ACCEPT_JACK":
      return state.friendRequestState === "pending" ? { ...state, friendRequestState: "accepted" } : state;
    case "IGNORE_JACK":
      return state.friendRequestState === "pending" ? { ...state, friendRequestState: "ignored" } : state;
    case "SHOW_MESSAGES":
      return { ...state, currentView: "messages", selectedFeedItemId: null };
    case "OPEN_JUNE_MESSAGE":
      if (state.juneMessageState === "none") return state;
      return { ...state, currentView: "messageDetail", juneMessageState: "read", selectedFeedItemId: null };
    case "DELIVER_JACK_REQUEST":
      return state.friendRequestState === "none" ? { ...state, friendRequestState: "pending" } : state;
    case "DELIVER_JUNE_MESSAGE":
      return state.juneMessageState === "none" ? { ...state, juneMessageState: "unread" } : state;
    case "RESET":
      return createInitialFacebookState(event.displayName ?? "");
  }
}
