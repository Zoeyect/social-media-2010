export type TwitterView = "timeline" | "tweetDetail";

export type TwitterTweet = {
  id: string;
  displayName: string;
  text: string;
  timestamp: string;
  contentStatus: "HOLD-fictional";
};

export type TwitterState = {
  currentView: TwitterView;
  timeline: TwitterTweet[];
  selectedTweetId: string | null;
  scrollPosition: number;
  favoriteTweetIds: string[];
};

export type TwitterEvent =
  | { type: "OPEN_TWEET"; tweetId: string; scrollPosition: number }
  | { type: "BACK_TO_TIMELINE" }
  | { type: "SET_SCROLL_POSITION"; scrollPosition: number }
  | { type: "TOGGLE_FAVORITE"; tweetId: string }
  | { type: "RESET"; displayName?: string };

const periodTimeline = (sessionDisplayName: string): TwitterTweet[] => [
  {
    id: "late-night-user",
    displayName: sessionDisplayName,
    text: "can't sleep",
    timestamp: "12:11 AM",
    contentStatus: "HOLD-fictional",
  },
  {
    id: "late-coffee",
    displayName: "Mia",
    text: "Coffee was probably a bad idea this late.",
    timestamp: "12:07 AM",
    contentStatus: "HOLD-fictional",
  },
  {
    id: "apple-event",
    displayName: "Sam",
    text: "Wonder what Apple has planned for later today.",
    timestamp: "12:01 AM",
    contentStatus: "HOLD-fictional",
  },
  {
    id: "late-bus",
    displayName: "Nora",
    text: "The bus was late again.",
    timestamp: "11:56 PM",
    contentStatus: "HOLD-fictional",
  },
  {
    id: "last-chapter",
    displayName: "Eli",
    text: "Finished the last chapter.",
    timestamp: "11:48 PM",
    contentStatus: "HOLD-fictional",
  },
  {
    id: "rain-stopped",
    displayName: "June",
    text: "The rain finally stopped.",
    timestamp: "11:39 PM",
    contentStatus: "HOLD-fictional",
  },
];

export function createInitialTwitterState(sessionDisplayName: string): TwitterState {
  return {
    currentView: "timeline",
    timeline: periodTimeline(sessionDisplayName),
    selectedTweetId: null,
    scrollPosition: 0,
    favoriteTweetIds: [],
  };
}

export function twitterStateTransition(state: TwitterState, event: TwitterEvent): TwitterState {
  switch (event.type) {
    case "OPEN_TWEET":
      if (!state.timeline.some(tweet => tweet.id === event.tweetId)) return state;
      return {
        ...state,
        currentView: "tweetDetail",
        selectedTweetId: event.tweetId,
        scrollPosition: Math.max(0, event.scrollPosition),
      };
    case "BACK_TO_TIMELINE":
      return { ...state, currentView: "timeline", selectedTweetId: null };
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: Math.max(0, event.scrollPosition) };
    case "TOGGLE_FAVORITE":
      return state.favoriteTweetIds.includes(event.tweetId)
        ? { ...state, favoriteTweetIds: state.favoriteTweetIds.filter(id => id !== event.tweetId) }
        : { ...state, favoriteTweetIds: [...state.favoriteTweetIds, event.tweetId] };
    case "RESET":
      return createInitialTwitterState(event.displayName ?? "");
  }
}
