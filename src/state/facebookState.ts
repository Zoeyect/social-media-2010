import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";
import type { CoreSocialFriendId } from "../data/coreSocialFriends";

export type FacebookView = "home" | "feed" | "feedDetail" | "profile" | "friends" | "requests" | "inbox" | "messageDetail";
export type FacebookProfileSection = "wall" | "info" | "photos" | "friends";
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
  friendId?: CoreSocialFriendId;
  author: string;
  text: string;
  timestamp: string;
  kind: "status" | "photoActivity" | "socialActivity";
  contentStatus: "HOLD-fictional";
  origin: ContentOrigin;
};

export type FacebookMessageThread = {
  id: string;
  friendId?: CoreSocialFriendId;
  sender: string;
  preview: string;
  timestamp: string;
  status: "unread" | "read";
  origin: ContentOrigin;
};

export type FacebookState = {
  currentView: FacebookView;
  navigationStack: FacebookView[];
  feed: FacebookFeedItem[];
  selectedFeedItemId: string | null;
  selectedProfileName: string | null;
  profileSection: FacebookProfileSection;
  scrollPosition: number;
  likedItemIds: string[];
  friendRequestState: FacebookFriendRequestState;
  friends: FacebookFriend[];
  inboxThreads: FacebookMessageThread[];
  selectedMessageId: string | null;
  juneReplies: FacebookUserText[];
  juneReplyDraft: string;
  comments: Array<FacebookUserText & { itemId: string }>;
  commentComposerItemId: string | null;
  commentDraft: string;
};

export type FacebookEvent =
  | { type: "SHOW_HOME" }
  | { type: "SHOW_FEED" }
  | { type: "SHOW_PROFILE"; profileName: string }
  | { type: "OPEN_PROFILE"; profileName: string }
  | { type: "SET_PROFILE_SECTION"; section: FacebookProfileSection }
  | { type: "SHOW_FRIENDS" }
  | { type: "SHOW_REQUESTS" }
  | { type: "SHOW_INBOX" }
  | { type: "GO_BACK" }
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
    currentView: "home",
    navigationStack: ["home"],
    feed: SESSION_SEED_CONTENT.facebook.feed.map(item => ({
      ...item,
      author: item.author === "session-owner" ? displayName : item.author,
      contentStatus: "HOLD-fictional",
    })),
    selectedFeedItemId: null,
    selectedProfileName: null,
    profileSection: "wall",
    scrollPosition: 0,
    likedItemIds: [],
    friendRequestState: "none",
    friends: [],
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
    case "SHOW_HOME":
      return {
        ...state,
        currentView: "home",
        navigationStack: ["home"],
        selectedFeedItemId: null,
        selectedMessageId: null,
      };
    case "SHOW_FEED":
      return { ...state, currentView: "feed", navigationStack: ["home", "feed"], selectedFeedItemId: null };
    case "SHOW_PROFILE":
      return {
        ...state,
        currentView: "profile",
        navigationStack: ["home", "profile"],
        selectedProfileName: event.profileName,
        profileSection: "wall",
      };
    case "OPEN_PROFILE":
      return {
        ...state,
        currentView: "profile",
        navigationStack: [...state.navigationStack, "profile"],
        selectedProfileName: event.profileName,
        profileSection: "wall",
      };
    case "SET_PROFILE_SECTION":
      return state.currentView === "profile" ? { ...state, profileSection: event.section } : state;
    case "SHOW_FRIENDS":
      return { ...state, currentView: "friends", navigationStack: ["home", "friends"] };
    case "SHOW_REQUESTS":
    case "SHOW_FRIEND_REQUESTS":
      return { ...state, currentView: "requests", navigationStack: ["home", "requests"], selectedFeedItemId: null };
    case "SHOW_INBOX":
    case "SHOW_MESSAGES":
      return { ...state, currentView: "inbox", navigationStack: ["home", "inbox"], selectedFeedItemId: null };
    case "GO_BACK": {
      if (state.navigationStack.length <= 1) return state;
      const navigationStack = state.navigationStack.slice(0, -1);
      return { ...state, currentView: navigationStack[navigationStack.length - 1], navigationStack };
    }
    case "OPEN_FEED_ITEM":
      if (!state.feed.some(item => item.id === event.itemId)) return state;
      return {
        ...state,
        currentView: "feedDetail",
        navigationStack: [...state.navigationStack, "feedDetail"],
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
    case "OPEN_MESSAGE": {
      const message = state.inboxThreads.find(thread => thread.id === event.messageId);
      if (!message) return state;
      return {
        ...state,
        currentView: "messageDetail",
        navigationStack: [...state.navigationStack, "messageDetail"],
        selectedMessageId: message.id,
        inboxThreads: state.inboxThreads.map(thread => thread.id === message.id ? { ...thread, status: "read" } : thread),
        selectedFeedItemId: null,
      };
    }
    case "OPEN_JUNE_MESSAGE":
      if (selectFacebookJuneMessageState(state) === "none") return state;
      return facebookStateTransition(state, { type: "OPEN_MESSAGE", messageId: "june-live-message" });
    case "EDIT_JUNE_REPLY":
      return selectFacebookJuneMessageState(state) === "none" ? state : { ...state, juneReplyDraft: event.value };
    case "SUBMIT_JUNE_REPLY": {
      const text = state.juneReplyDraft.trim();
      if (!text || selectFacebookJuneMessageState(state) === "none") return state;
      return {
        ...state,
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
      return selectFacebookJuneMessageState(state) === "none" ? {
        ...state,
        inboxThreads: [{ id: "june-live-message", sender: "June", preview: "Hey, are you online?", timestamp: "12:06 AM", status: "unread", origin: "live" }, ...state.inboxThreads],
      } : state;
    case "RESET":
      return createInitialFacebookState(event.displayName ?? "");
  }
}

export function selectFacebookRequestCount(state: FacebookState): number {
  return state.friendRequestState === "pending" ? 1 : 0;
}

export function selectFacebookInboxUnreadCount(state: FacebookState): number {
  return state.inboxThreads.filter(thread => thread.status === "unread").length;
}

export function selectFacebookJuneMessageState(state: FacebookState): FacebookMessageState {
  const juneThread = state.inboxThreads.find(thread => thread.id === "june-live-message");
  if (!juneThread) return "none";
  if (state.juneReplies.length > 0) return "replied";
  return juneThread.status;
}
