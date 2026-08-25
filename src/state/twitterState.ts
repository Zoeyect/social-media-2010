import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export type TwitterView = "timeline" | "tweetDetail";

export type TwitterTweet = {
  id: string;
  displayName: string;
  text: string;
  timestamp: string;
  contentStatus: "HOLD-fictional";
  origin: ContentOrigin;
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
  | { type: "DELIVER_TIMELINE_TWEET"; tweet: Omit<TwitterTweet, "contentStatus" | "origin"> }
  | { type: "RESET"; displayName?: string };

export function createInitialTwitterState(sessionDisplayName: string): TwitterState {
  return {
    currentView: "timeline",
    timeline: SESSION_SEED_CONTENT.twitter.map(tweet => ({
      ...tweet,
      displayName: tweet.displayName === "session-owner" ? sessionDisplayName : tweet.displayName,
      contentStatus: "HOLD-fictional",
    })),
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
    case "DELIVER_TIMELINE_TWEET":
      if (state.timeline.some(tweet => tweet.id === event.tweet.id)) return state;
      return {
        ...state,
        timeline: [...state.timeline, { ...event.tweet, contentStatus: "HOLD-fictional" as const, origin: "live" as const }]
          .sort((a, b) => twitterTimestampOrder(b.timestamp) - twitterTimestampOrder(a.timestamp)),
      };
    case "RESET":
      return createInitialTwitterState(event.displayName ?? "");
  }
}

function twitterTimestampOrder(timestamp: string): number {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(timestamp);
  if (!match) return 0;
  const hour = Number(match[1]) % 12 + (match[3] === "PM" ? 12 : 0);
  const minute = Number(match[2]);
  const dayOffset = match[3] === "PM" ? -24 * 60 : 0;
  return dayOffset + hour * 60 + minute;
}
