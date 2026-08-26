import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";
import { CORE_SOCIAL_CHARACTERS } from "../data/coreSocialFriends";
import type { CoreSocialCharacterId } from "../data/coreSocialFriends";
import { FACEBOOK_AUTHOR_EASTER_EGG_ID, FACEBOOK_AUTHOR_EASTER_EGGS } from "../data/facebookActors";
import type { FacebookFeedActor } from "../data/facebookActors";
import type { FacebookMediaId } from "../data/facebookMedia";

export type FacebookView = "home" | "feed" | "feedDetail" | "profile" | "friends" | "inbox" | "messageDetail" | "events" | "eventDetail" | "places" | "photos" | "photoDetail" | "chat" | "notifications" | "account";
export type FacebookProfileSection = "wall" | "info" | "photos" | "friends";
export type FacebookFriendsSection = "friends" | "pages" | "requests";
export type FacebookFriendRequestState = "none" | "pending" | "accepted" | "ignored";
export type FacebookMessageState = "none" | "unread" | "read" | "replied";
export type FacebookPartyInviteState = "none" | "eligible" | "delivered" | "opened" | "dismissed";
export type FacebookPartyRsvp = "yes" | "maybe" | "no" | null;

export const FACEBOOK_PARTY_INVITE_EVENT_ID = "facebook-party-invite";

export const FACEBOOK_BASELINE_FRIEND_IDS = Object.freeze(["katie", "matt", "alex", "chris", "jay", "june", "ben", "luca"] as const);

export const FACEBOOK_PLACE_OPTIONS = Object.freeze([
  Object.freeze({ id: "downtown-coffee", name: "Downtown Coffee", classification: "CURATED/HOLD" as const }),
  Object.freeze({ id: "community-courts", name: "Community Courts", classification: "CURATED/HOLD" as const }),
  Object.freeze({ id: "main-street-diner", name: "Main Street Diner", classification: "CURATED/HOLD" as const }),
]);

export const FACEBOOK_FRIEND_CHECK_INS = Object.freeze([
  Object.freeze({ id: "ben-coffee-checkin", characterId: "ben" as const, displayName: "Ben", venueName: "Downtown Coffee", classification: "CURATED" as const }),
  Object.freeze({ id: "chris-courts-checkin", characterId: "chris" as const, displayName: "Chris", venueName: "Community Courts", classification: "CURATED" as const }),
  Object.freeze({ id: "luca-diner-checkin", characterId: "luca" as const, displayName: "Luca", venueName: "Main Street Diner", classification: "CURATED" as const }),
]);

export const FACEBOOK_CHAT_ROSTER = Object.freeze([
  Object.freeze({ characterId: "katie" as const, displayName: "Katie", presence: "online" as const }),
  Object.freeze({ characterId: "chris" as const, displayName: "Chris", presence: "online" as const }),
  Object.freeze({ characterId: "jay" as const, displayName: "Jay", presence: "offline" as const }),
]);

export type FacebookFriend = {
  id: CoreSocialCharacterId;
  name: string;
};

export type FacebookUserText = {
  id: string;
  author: string;
  text: string;
};

export type FacebookFeedItem = {
  id: string;
  actor?: FacebookFeedActor;
  friendId?: CoreSocialCharacterId;
  author: string;
  text: string;
  timestamp: string;
  createdAt?: string;
  mediaId?: FacebookMediaId;
  kind: "status" | "photoActivity" | "socialActivity";
  visibility?: "friends" | "friends-of-friends" | "everyone" | "custom";
  photoCount?: number;
  relatedCharacterIds?: readonly CoreSocialCharacterId[];
  tagUiStatus?: "HOLD";
  contentStatus: "HOLD-fictional" | "USER-GENERATED";
  origin: ContentOrigin | "user";
};

export type FacebookMessageThread = {
  id: string;
  friendId?: CoreSocialCharacterId;
  sender: string;
  preview: string;
  timestamp: string;
  status: "unread" | "read";
  origin: ContentOrigin;
};

export type FacebookEphemeralIdentity = {
  id: string;
  displayName: string;
  classification: "EPHEMERAL_FRIEND_OF_FRIEND";
};

export type FacebookComment = {
  id: string;
  itemId: string;
  author: string;
  text: string;
  origin: "seed" | "user";
  characterId?: CoreSocialCharacterId;
  classification?: "CURATED";
  ephemeralAuthor?: FacebookEphemeralIdentity;
};

export type FacebookUserCheckIn = {
  venueId: typeof FACEBOOK_PLACE_OPTIONS[number]["id"];
  venueName: string;
  author: string;
  timestamp: string;
  origin: "user";
};

export type FacebookNotification = {
  id: "facebook-notification-jack-request" | "facebook-notification-june-message" | "facebook-notification-party-event";
  text: string;
  target: "requests" | "message" | "event";
  unread: boolean;
};

export type FacebookSearchIdentity =
  | { kind: "canonical"; characterId: CoreSocialCharacterId; displayName: string }
  | { kind: "author-easter-egg"; authorId: typeof FACEBOOK_AUTHOR_EASTER_EGG_ID; displayName: string };

export type FacebookState = {
  currentView: FacebookView;
  navigationStack: FacebookView[];
  homeLauncherPage: 0 | 1;
  homeSearchQuery: string;
  feed: FacebookFeedItem[];
  selectedFeedItemId: string | null;
  selectedProfileName: string | null;
  profileSection: FacebookProfileSection;
  scrollPosition: number;
  likedItemIds: string[];
  friendRequestState: FacebookFriendRequestState;
  friends: FacebookFriend[];
  friendsSection: FacebookFriendsSection;
  friendSearchQuery: string;
  statusComposerOpen: boolean;
  statusDraft: string;
  partyInviteState: FacebookPartyInviteState;
  partyRsvp: FacebookPartyRsvp;
  partyInviteEligibleFromJune: boolean;
  partyInviteEligibleFromJack: boolean;
  inboxThreads: FacebookMessageThread[];
  selectedMessageId: string | null;
  juneReplies: FacebookUserText[];
  juneReplyDraft: string;
  comments: FacebookComment[];
  commentComposerItemId: string | null;
  commentDraft: string;
  selectedPhotoMediaId: FacebookMediaId | null;
  userCheckIn: FacebookUserCheckIn | null;
  readNotificationIds: string[];
};

export type FacebookEvent =
  | { type: "SHOW_HOME" }
  | { type: "SET_HOME_LAUNCHER_PAGE"; page: 0 | 1 }
  | { type: "EDIT_HOME_SEARCH"; value: string }
  | { type: "SHOW_FEED" }
  | { type: "SHOW_PROFILE"; profileName: string }
  | { type: "OPEN_PROFILE"; profileName: string }
  | { type: "SET_PROFILE_SECTION"; section: FacebookProfileSection }
  | { type: "SHOW_FRIENDS" }
  | { type: "SET_FRIENDS_SECTION"; section: FacebookFriendsSection }
  | { type: "EDIT_FRIEND_SEARCH"; value: string }
  | { type: "SHOW_REQUESTS" }
  | { type: "SHOW_INBOX" }
  | { type: "SHOW_EVENTS" }
  | { type: "OPEN_PARTY_EVENT" }
  | { type: "SET_PARTY_RSVP"; value: Exclude<FacebookPartyRsvp, null> }
  | { type: "SHOW_PLACES" }
  | { type: "CHECK_IN"; venueId: FacebookUserCheckIn["venueId"]; displayName: string; timestamp: string }
  | { type: "SHOW_PHOTOS" }
  | { type: "OPEN_PHOTO"; mediaId: FacebookMediaId }
  | { type: "SHOW_CHAT" }
  | { type: "SHOW_NOTIFICATIONS" }
  | { type: "OPEN_NOTIFICATION"; notificationId: FacebookNotification["id"] }
  | { type: "SHOW_ACCOUNT"; profileName: string }
  | { type: "OPEN_STATUS_COMPOSER" }
  | { type: "EDIT_STATUS"; value: string }
  | { type: "CANCEL_STATUS" }
  | { type: "SUBMIT_STATUS"; displayName: string; timestamp: string }
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
  | { type: "DELIVER_PARTY_INVITE"; timestamp: string }
  | { type: "RESET"; displayName?: string };

export function createInitialFacebookState(displayName: string): FacebookState {
  return {
    currentView: "home",
    navigationStack: ["home"],
    homeLauncherPage: 0,
    homeSearchQuery: "",
    feed: SESSION_SEED_CONTENT.facebook.feed.map(item => ({
      ...item,
      contentStatus: "HOLD-fictional",
    })),
    selectedFeedItemId: null,
    selectedProfileName: null,
    profileSection: "wall",
    scrollPosition: 0,
    likedItemIds: [],
    friendRequestState: "none",
    friends: FACEBOOK_BASELINE_FRIEND_IDS.map(id => ({ id, name: CORE_SOCIAL_CHARACTERS[id].displayName })),
    friendsSection: "friends",
    friendSearchQuery: "",
    statusComposerOpen: false,
    statusDraft: "",
    partyInviteState: "none",
    partyRsvp: null,
    partyInviteEligibleFromJune: false,
    partyInviteEligibleFromJack: false,
    inboxThreads: SESSION_SEED_CONTENT.facebook.inbox.map(message => ({ ...message })),
    selectedMessageId: null,
    juneReplies: [],
    juneReplyDraft: "",
    comments: SESSION_SEED_CONTENT.facebook.comments.map(comment => ({
      id: comment.id,
      itemId: comment.itemId,
      author: comment.author.displayName,
      text: comment.text,
      origin: comment.origin,
      ...(comment.author.type === "canonical"
        ? { characterId: comment.author.characterId, classification: comment.author.classification }
        : { ephemeralAuthor: { id: comment.author.id, displayName: comment.author.displayName, classification: comment.author.classification } }),
    })),
    commentComposerItemId: null,
    commentDraft: "",
    selectedPhotoMediaId: null,
    userCheckIn: null,
    readNotificationIds: [],
  };
}

export function facebookStateTransition(state: FacebookState, event: FacebookEvent): FacebookState {
  switch (event.type) {
    case "SHOW_HOME":
      return {
        ...state,
        currentView: "home",
        navigationStack: ["home"],
        homeLauncherPage: 0,
        homeSearchQuery: "",
        selectedFeedItemId: null,
        selectedMessageId: null,
      };
    case "SET_HOME_LAUNCHER_PAGE":
      return state.currentView === "home" ? { ...state, homeLauncherPage: event.page, homeSearchQuery: "" } : state;
    case "EDIT_HOME_SEARCH":
      return state.currentView === "home" ? { ...state, homeSearchQuery: event.value } : state;
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
      return { ...state, currentView: "friends", navigationStack: ["home", "friends"], friendsSection: "friends", friendSearchQuery: "" };
    case "SET_FRIENDS_SECTION":
      if (state.currentView !== "friends") return state;
      return {
        ...state,
        friendsSection: event.section,
        readNotificationIds: event.section === "requests" && !state.readNotificationIds.includes("facebook-notification-jack-request")
          ? [...state.readNotificationIds, "facebook-notification-jack-request"]
          : state.readNotificationIds,
      };
    case "EDIT_FRIEND_SEARCH":
      return state.currentView === "friends" ? { ...state, friendSearchQuery: event.value } : state;
    case "SHOW_REQUESTS":
    case "SHOW_FRIEND_REQUESTS":
      return {
        ...state,
        currentView: "friends",
        navigationStack: ["home", "friends"],
        friendsSection: "requests",
        selectedFeedItemId: null,
        readNotificationIds: state.readNotificationIds.includes("facebook-notification-jack-request")
          ? state.readNotificationIds
          : [...state.readNotificationIds, "facebook-notification-jack-request"],
      };
    case "SHOW_INBOX":
    case "SHOW_MESSAGES":
      return { ...state, currentView: "inbox", navigationStack: ["home", "inbox"], selectedFeedItemId: null };
    case "SHOW_EVENTS":
      return { ...state, currentView: "events", navigationStack: ["home", "events"] };
    case "OPEN_PARTY_EVENT":
      if (state.partyInviteState !== "delivered" && state.partyInviteState !== "opened" && state.partyInviteState !== "dismissed") return state;
      return {
        ...state,
        currentView: "eventDetail",
        navigationStack: [...state.navigationStack, "eventDetail"],
        partyInviteState: state.partyInviteState === "delivered" ? "opened" : state.partyInviteState,
        readNotificationIds: state.readNotificationIds.includes("facebook-notification-party-event")
          ? state.readNotificationIds
          : [...state.readNotificationIds, "facebook-notification-party-event"],
        inboxThreads: state.inboxThreads.map(thread => thread.id === FACEBOOK_PARTY_INVITE_EVENT_ID ? { ...thread, status: "read" } : thread),
      };
    case "SET_PARTY_RSVP":
      return state.currentView === "eventDetail" ? { ...state, partyRsvp: event.value } : state;
    case "SHOW_PLACES":
      return { ...state, currentView: "places", navigationStack: ["home", "places"] };
    case "CHECK_IN": {
      const venue = FACEBOOK_PLACE_OPTIONS.find(option => option.id === event.venueId);
      if (!venue) return state;
      return { ...state, userCheckIn: { venueId: venue.id, venueName: venue.name, author: event.displayName, timestamp: event.timestamp, origin: "user" } };
    }
    case "SHOW_PHOTOS":
      return { ...state, currentView: "photos", navigationStack: ["home", "photos"], selectedPhotoMediaId: null };
    case "OPEN_PHOTO":
      return { ...state, currentView: "photoDetail", navigationStack: [...state.navigationStack, "photoDetail"], selectedPhotoMediaId: event.mediaId };
    case "SHOW_CHAT":
      return { ...state, currentView: "chat", navigationStack: ["home", "chat"] };
    case "SHOW_NOTIFICATIONS":
      return { ...state, currentView: "notifications", navigationStack: ["home", "notifications"] };
    case "OPEN_NOTIFICATION": {
      const readNotificationIds = state.readNotificationIds.includes(event.notificationId)
        ? state.readNotificationIds
        : [...state.readNotificationIds, event.notificationId];
      if (event.notificationId === "facebook-notification-jack-request") {
        return { ...state, readNotificationIds, currentView: "friends", navigationStack: [...state.navigationStack, "friends"], friendsSection: "requests" };
      }
      if (event.notificationId === "facebook-notification-june-message") {
        return facebookStateTransition({ ...state, readNotificationIds }, { type: "OPEN_MESSAGE", messageId: "june-live-message" });
      }
      return facebookStateTransition({ ...state, readNotificationIds }, { type: "OPEN_PARTY_EVENT" });
    }
    case "SHOW_ACCOUNT":
      return { ...state, currentView: "account", navigationStack: ["home", "account"], selectedProfileName: event.profileName };
    case "OPEN_STATUS_COMPOSER":
      return state.currentView === "feed" ? { ...state, statusComposerOpen: true } : state;
    case "EDIT_STATUS":
      return state.statusComposerOpen ? { ...state, statusDraft: event.value } : state;
    case "CANCEL_STATUS":
      return { ...state, statusComposerOpen: false, statusDraft: "" };
    case "SUBMIT_STATUS": {
      const text = state.statusDraft.trim();
      if (!state.statusComposerOpen || !text) return state;
      const userStatusCount = state.feed.filter(item => item.origin === "user" && item.kind === "status").length;
      return {
        ...state,
        feed: [{
          id: `facebook-user-status-${userStatusCount + 1}`,
          author: event.displayName,
          text,
          timestamp: event.timestamp,
          kind: "status",
          visibility: "friends",
          contentStatus: "USER-GENERATED",
          origin: "user",
        }, ...state.feed],
        statusComposerOpen: false,
        statusDraft: "",
      };
    }
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
        partyInviteEligibleFromJack: true,
        partyInviteState: state.partyInviteState === "none" ? "eligible" : state.partyInviteState,
        friends: state.friends.some(friend => friend.id === "jack")
          ? state.friends
          : [...state.friends, { id: "jack", name: "Jack" }],
        readNotificationIds: state.readNotificationIds.includes("facebook-notification-jack-request")
          ? state.readNotificationIds
          : [...state.readNotificationIds, "facebook-notification-jack-request"],
      } : state;
    case "IGNORE_JACK":
      return state.friendRequestState === "pending" ? {
        ...state,
        friendRequestState: "ignored",
        readNotificationIds: state.readNotificationIds.includes("facebook-notification-jack-request")
          ? state.readNotificationIds
          : [...state.readNotificationIds, "facebook-notification-jack-request"],
      } : state;
    case "OPEN_MESSAGE": {
      const message = state.inboxThreads.find(thread => thread.id === event.messageId);
      if (!message) return state;
      return {
        ...state,
        partyInviteState: message.id === FACEBOOK_PARTY_INVITE_EVENT_ID && state.partyInviteState === "delivered"
          ? "opened"
          : state.partyInviteState,
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
        partyInviteEligibleFromJune: true,
        partyInviteState: state.partyInviteState === "none" ? "eligible" : state.partyInviteState,
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
          id: `facebook-comment-${state.comments.filter(comment => comment.origin === "user").length + 1}`,
          itemId,
          author: event.displayName,
          text,
          origin: "user",
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
    case "DELIVER_PARTY_INVITE":
      if (state.partyInviteState !== "eligible") return state;
      return {
        ...state,
        partyInviteState: "delivered",
        inboxThreads: state.inboxThreads.some(thread => thread.id === FACEBOOK_PARTY_INVITE_EVENT_ID)
          ? state.inboxThreads
          : [{
              id: FACEBOOK_PARTY_INVITE_EVENT_ID,
              friendId: "june",
              sender: "June",
              preview: "Party at Jack's Friday. You coming?",
              timestamp: event.timestamp,
              status: "unread",
              origin: "live",
            }, ...state.inboxThreads],
      };
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

export function selectFacebookPeopleSearchResults(query: string): FacebookSearchIdentity[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];
  const canonicalResults: FacebookSearchIdentity[] = Object.values(CORE_SOCIAL_CHARACTERS)
    .filter(character => character.displayName.toLowerCase().includes(normalizedQuery))
    .map(character => ({ kind: "canonical", characterId: character.id, displayName: character.displayName }));
  const author = FACEBOOK_AUTHOR_EASTER_EGGS[FACEBOOK_AUTHOR_EASTER_EGG_ID];
  return author.displayName.toLowerCase().includes(normalizedQuery)
    ? [...canonicalResults, { kind: "author-easter-egg", authorId: author.id, displayName: author.displayName }]
    : canonicalResults;
}

export function selectFacebookNotifications(state: FacebookState): FacebookNotification[] {
  const notifications: FacebookNotification[] = [];
  if (state.friendRequestState !== "none") {
    notifications.push({
      id: "facebook-notification-jack-request",
      text: "Jack sent you a friend request.",
      target: "requests",
      unread: state.friendRequestState === "pending" && !state.readNotificationIds.includes("facebook-notification-jack-request"),
    });
  }
  const juneMessage = state.inboxThreads.find(thread => thread.id === "june-live-message");
  if (juneMessage) {
    notifications.push({
      id: "facebook-notification-june-message",
      text: "June sent you a message.",
      target: "message",
      unread: juneMessage.status === "unread" && !state.readNotificationIds.includes("facebook-notification-june-message"),
    });
  }
  const partyMessage = state.inboxThreads.find(thread => thread.id === FACEBOOK_PARTY_INVITE_EVENT_ID);
  if (partyMessage && (state.partyInviteState === "delivered" || state.partyInviteState === "opened" || state.partyInviteState === "dismissed")) {
    notifications.push({
      id: "facebook-notification-party-event",
      text: "June invited you to Jack's Party.",
      target: "event",
      unread: partyMessage.status === "unread" && !state.readNotificationIds.includes("facebook-notification-party-event"),
    });
  }
  return notifications;
}

export function selectFacebookNotificationUnreadCount(state: FacebookState): number {
  return selectFacebookNotifications(state).filter(notification => notification.unread).length;
}

export function selectFacebookJuneMessageState(state: FacebookState): FacebookMessageState {
  const juneThread = state.inboxThreads.find(thread => thread.id === "june-live-message");
  if (!juneThread) return "none";
  if (state.juneReplies.length > 0) return "replied";
  return juneThread.status;
}

export function deterministicFacebookPartyInviteDelayMs(sessionIdentity: string): number {
  const seed = `${FACEBOOK_PARTY_INVITE_EVENT_ID}|${sessionIdentity.trim().toLowerCase()}`;
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return 20_000 + ((hash >>> 0) % 40_001);
}
