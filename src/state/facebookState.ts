import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export type FacebookView = "feed" | "feedDetail" | "friendRequests" | "messages" | "messageDetail";
export type FacebookFriendRequestState = "none" | "pending" | "accepted" | "ignored";
export type FacebookMessageState = "none" | "unread" | "read" | "replied";

export type FacebookFriend = {
  id: string;
  name: string;
};

export type FacebookUserText = {
  id: string;
  author: string;
  text: string;
};

export type FacebookFeedItem = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  kind: "status" | "photoActivity" | "socialActivity";
  contentStatus: "HOLD-fictional";
  origin: ContentOrigin;
};

export type FacebookMessageThread = {
  id: string;
  sender: string;
  preview: string;
  timestamp: string;
  status: "unread" | "read";
  origin: ContentOrigin;
};

export type FacebookState = {
  currentView: FacebookView;
  feed: FacebookFeedItem[];
  selectedFeedItemId: string | null;
  scrollPosition: number;
  likedItemIds: string[];
  friendRequestState: FacebookFriendRequestState;
  friends: FacebookFriend[];
  juneMessageState: FacebookMessageState;
  inboxThreads: FacebookMessageThread[];
  selectedMessageId: string | null;
  juneReplies: FacebookUserText[];
  juneReplyDraft: string;
  comments: Array<FacebookUserText & { itemId: string }>;
  commentComposerItemId: string | null;
  commentDraft: string;
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
  | { type: "OPEN_MESSAGE"; messageId: string }
  | { type: "OPEN_JUNE_MESSAGE" }
  | { type: "EDIT_JUNE_REPLY"; value: string }
  | { type: "SUBMIT_JUNE_REPLY"; displayName: string }
  | { type: "BEGIN_COMMENT"; itemId: string }
  | { type: "EDIT_COMMENT"; value: string }
  | { type: "CANCEL_COMMENT" }
  | { type: "SUBMIT_COMMENT"; displayName: string }
  | { type: "DELIVER_JACK_REQUEST" }
  | { type: "DELIVER_JUNE_MESSAGE" }
  | { type: "RESET"; displayName?: string };

export function createInitialFacebookState(displayName: string): FacebookState {
  return {
    currentView: "feed",
    feed: SESSION_SEED_CONTENT.facebook.feed.map(item => ({
      ...item,
      author: item.author === "session-owner" ? displayName : item.author,
      contentStatus: "HOLD-fictional",
    })),
    selectedFeedItemId: null,
    scrollPosition: 0,
    likedItemIds: [],
    friendRequestState: "none",
    friends: [],
    juneMessageState: "none",
    inboxThreads: SESSION_SEED_CONTENT.facebook.inbox.map(message => ({ ...message })),
    selectedMessageId: null,
    juneReplies: [],
    juneReplyDraft: "",
    comments: [],
    commentComposerItemId: null,
    commentDraft: "",
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
      return state.friendRequestState === "pending" ? {
        ...state,
        friendRequestState: "accepted",
        friends: state.friends.some(friend => friend.id === "jack")
          ? state.friends
          : [...state.friends, { id: "jack", name: "Jack" }],
      } : state;
    case "IGNORE_JACK":
      return state.friendRequestState === "pending" ? { ...state, friendRequestState: "ignored" } : state;
    case "SHOW_MESSAGES":
      return { ...state, currentView: "messages", selectedFeedItemId: null };
    case "OPEN_MESSAGE": {
      const message = state.inboxThreads.find(thread => thread.id === event.messageId);
      if (!message) return state;
      return {
        ...state,
        currentView: "messageDetail",
        selectedMessageId: message.id,
        inboxThreads: state.inboxThreads.map(thread => thread.id === message.id ? { ...thread, status: "read" } : thread),
        juneMessageState: message.id === "june-live-message" && state.juneMessageState === "unread"
          ? "read"
          : state.juneMessageState,
        selectedFeedItemId: null,
      };
    }
    case "OPEN_JUNE_MESSAGE":
      if (state.juneMessageState === "none") return state;
      return facebookStateTransition(state, { type: "OPEN_MESSAGE", messageId: "june-live-message" });
    case "EDIT_JUNE_REPLY":
      return state.juneMessageState === "none" ? state : { ...state, juneReplyDraft: event.value };
    case "SUBMIT_JUNE_REPLY": {
      const text = state.juneReplyDraft.trim();
      if (!text || state.juneMessageState === "none") return state;
      return {
        ...state,
        juneMessageState: "replied",
        juneReplies: [...state.juneReplies, {
          id: `facebook-june-reply-${state.juneReplies.length + 1}`,
          author: event.displayName,
          text,
        }],
        juneReplyDraft: "",
      };
    }
    case "BEGIN_COMMENT":
      if (!state.feed.some(item => item.id === event.itemId)) return state;
      return {
        ...state,
        commentComposerItemId: event.itemId,
        commentDraft: state.commentComposerItemId === event.itemId ? state.commentDraft : "",
      };
    case "EDIT_COMMENT":
      return state.commentComposerItemId === null ? state : { ...state, commentDraft: event.value };
    case "CANCEL_COMMENT":
      return { ...state, commentComposerItemId: null, commentDraft: "" };
    case "SUBMIT_COMMENT": {
      const text = state.commentDraft.trim();
      const itemId = state.commentComposerItemId;
      if (!text || itemId === null || !state.feed.some(item => item.id === itemId)) return state;
      return {
        ...state,
        comments: [...state.comments, {
          id: `facebook-comment-${state.comments.length + 1}`,
          itemId,
          author: event.displayName,
          text,
        }],
        commentComposerItemId: null,
        commentDraft: "",
      };
    }
    case "DELIVER_JACK_REQUEST":
      return state.friendRequestState === "none" ? { ...state, friendRequestState: "pending" } : state;
    case "DELIVER_JUNE_MESSAGE":
      return state.juneMessageState === "none" ? {
        ...state,
        juneMessageState: "unread",
        inboxThreads: [{ id: "june-live-message", sender: "June", preview: "Hey, are you online?", timestamp: "12:06 AM", status: "unread", origin: "live" }, ...state.inboxThreads],
      } : state;
    case "RESET":
      return createInitialFacebookState(event.displayName ?? "");
  }
}
