import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export type TwitterTab = "timeline" | "mentions" | "messages" | "search" | "more";
export type TwitterView = "timeline" | "tweetDetail" | "composer";
export type TwitterComposerKind = "new" | "reply";

export type TwitterTweet = {
  id: string;
  displayName: string;
  text: string;
  timestamp: string;
  contentStatus: "HOLD-fictional";
  origin: ContentOrigin;
};

export type TwitterReply = {
  id: string;
  targetTweetId: string;
  displayName: string;
  text: string;
};

export type TwitterRetweetActivity = {
  id: string;
  sourceTweetId: string;
  retweetedBy: string;
  originalTweetTimestamp: string;
  retweetActionTimestamp: number;
};

export type TwitterState = {
  activeTab: TwitterTab;
  currentView: TwitterView;
  timeline: TwitterTweet[];
  selectedTweetId: string | null;
  scrollPosition: number;
  favoriteTweetIds: string[];
  retweetedTweetIds: string[];
  retweetActivities: TwitterRetweetActivity[];
  replies: TwitterReply[];
  replyComposerTweetId: string | null;
  replyDraft: string;
  composerKind: TwitterComposerKind | null;
  revealedTweetId: string | null;
};

export type TwitterEvent =
  | { type: "OPEN_TWEET"; tweetId: string; scrollPosition: number }
  | { type: "BACK_TO_TIMELINE" }
  | { type: "SHOW_TAB"; tab: TwitterTab }
  | { type: "TOGGLE_TWEET_ACTIONS"; tweetId: string; timelineItemId?: string }
  | { type: "BEGIN_NEW_TWEET" }
  | { type: "SET_SCROLL_POSITION"; scrollPosition: number }
  | { type: "TOGGLE_FAVORITE"; tweetId: string }
  | { type: "TOGGLE_RETWEET"; tweetId: string; retweetedBy: string; retweetActionTimestamp: number }
  | { type: "BEGIN_REPLY"; tweetId: string }
  | { type: "EDIT_REPLY"; value: string }
  | { type: "CANCEL_REPLY" }
  | { type: "SUBMIT_REPLY"; displayName: string }
  | { type: "DELIVER_TIMELINE_TWEET"; tweet: Omit<TwitterTweet, "contentStatus" | "origin"> }
  | { type: "RESET"; displayName?: string };

export function createInitialTwitterState(sessionDisplayName: string): TwitterState {
  return {
    activeTab: "timeline",
    currentView: "timeline",
    timeline: SESSION_SEED_CONTENT.twitter.map(tweet => ({
      ...tweet,
      displayName: tweet.displayName === "session-owner" ? sessionDisplayName : tweet.displayName,
      contentStatus: "HOLD-fictional",
    })),
    selectedTweetId: null,
    scrollPosition: 0,
    favoriteTweetIds: [],
    retweetedTweetIds: [],
    retweetActivities: [],
    replies: [],
    replyComposerTweetId: null,
    replyDraft: "",
    composerKind: null,
    revealedTweetId: null,
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
        revealedTweetId: null,
      };
    case "BACK_TO_TIMELINE":
      return { ...state, currentView: "timeline", selectedTweetId: null };
    case "SHOW_TAB":
      return { ...state, activeTab: event.tab };
    case "TOGGLE_TWEET_ACTIONS":
      if (!state.timeline.some(tweet => tweet.id === event.tweetId)) return state;
      {
        const timelineItemId = event.timelineItemId ?? event.tweetId;
        return { ...state, revealedTweetId: state.revealedTweetId === timelineItemId ? null : timelineItemId };
      }
    case "BEGIN_NEW_TWEET":
      return {
        ...state,
        currentView: "composer",
        composerKind: "new",
        replyComposerTweetId: null,
        replyDraft: "",
        revealedTweetId: null,
      };
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: Math.max(0, event.scrollPosition) };
    case "TOGGLE_FAVORITE":
      return state.favoriteTweetIds.includes(event.tweetId)
        ? { ...state, favoriteTweetIds: state.favoriteTweetIds.filter(id => id !== event.tweetId) }
        : { ...state, favoriteTweetIds: [...state.favoriteTweetIds, event.tweetId] };
    case "TOGGLE_RETWEET":
      {
        const sourceTweet = state.timeline.find(tweet => tweet.id === event.tweetId);
        if (!sourceTweet) return state;
        const activityId = `user-retweet:${event.tweetId}`;
        if (state.retweetedTweetIds.includes(event.tweetId)) {
          return {
            ...state,
            retweetedTweetIds: state.retweetedTweetIds.filter(id => id !== event.tweetId),
            retweetActivities: state.retweetActivities.filter(activity => activity.id !== activityId),
          };
        }
        return {
          ...state,
          retweetedTweetIds: [...state.retweetedTweetIds, event.tweetId],
          retweetActivities: [{
            id: activityId,
            sourceTweetId: sourceTweet.id,
            retweetedBy: event.retweetedBy,
            originalTweetTimestamp: sourceTweet.timestamp,
            retweetActionTimestamp: event.retweetActionTimestamp,
          }, ...state.retweetActivities.filter(activity => activity.id !== activityId)],
        };
      }
    case "BEGIN_REPLY":
      {
        const tweet = state.timeline.find(candidate => candidate.id === event.tweetId);
        if (!tweet) return state;
        const sameReply = state.composerKind === "reply" && state.replyComposerTweetId === event.tweetId;
        return {
          ...state,
          currentView: "composer",
          composerKind: "reply",
          replyComposerTweetId: event.tweetId,
          replyDraft: sameReply ? state.replyDraft : `${twitterReplyHandle(tweet.displayName)} `,
          revealedTweetId: null,
        };
      }
    case "EDIT_REPLY":
      return state.composerKind === null
        ? state
        : { ...state, replyDraft: event.value.slice(0, 140) };
    case "CANCEL_REPLY":
      return { ...state, currentView: state.selectedTweetId ? "tweetDetail" : "timeline", composerKind: null, replyComposerTweetId: null, replyDraft: "" };
    case "SUBMIT_REPLY": {
      const text = state.replyDraft.trim();
      const targetTweetId = state.replyComposerTweetId;
      if (!text || targetTweetId === null || !state.timeline.some(tweet => tweet.id === targetTweetId)) return state;
      return {
        ...state,
        replies: [...state.replies, {
          id: `twitter-reply-${state.replies.length + 1}`,
          targetTweetId,
          displayName: event.displayName,
          text,
        }],
        currentView: state.selectedTweetId ? "tweetDetail" : "timeline",
        composerKind: null,
        replyComposerTweetId: null,
        replyDraft: "",
      };
    }
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

export function twitterReplyHandle(displayName: string): string {
  const normalized = displayName.normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
  return `@${normalized || "user"}`;
}

function twitterTimestampOrder(timestamp: string): number {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(timestamp);
  if (!match) return 0;
  const hour = Number(match[1]) % 12 + (match[3] === "PM" ? 12 : 0);
  const minute = Number(match[2]);
  const dayOffset = match[3] === "PM" ? -24 * 60 : 0;
  return dayOffset + hour * 60 + minute;
}
