import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { CoreSocialCharacterId } from "../data/coreSocialFriends";
import type { SharedCharacterMediaId } from "../data/sharedCharacterMedia";
import { INSTAGRAM_POPULAR_POSTS } from "../data/instagramPopularContent";
import type { InstagramPopularPostId } from "../data/instagramPopularContent";

export type InstagramView = "feed" | "popular" | "popularPhotoDetail" | "news" | "profile" | "following" | "facebookFriends" | "knownProfile" | "knownConnections" | "source" | "filter" | "share";
export type InstagramKnownProfileOrigin = "feed" | "following" | "facebookFriends";
export type InstagramPhotoSource = "dev-fixture";
export type InstagramFilter = "Original";

export type InstagramPhoto = {
  id: string;
  owner: string;
  source: InstagramPhotoSource;
  filter: InstagramFilter;
  createdAt: number;
  origin: "user";
};

export type InstagramDraft = {
  source: InstagramPhotoSource | null;
  filter: InstagramFilter | null;
};

export type InstagramKnownAccount = {
  canonicalCharacterId: CoreSocialCharacterId;
  username: string;
  displayName: string;
  followersBaseline: number;
  followingBaseline: number;
  classification: "CURATED";
  discoveryUiStatus: "READY";
  followUiStatus: "READY";
  profileUiStatus: "HOLD";
  origin: "seed";
};

export type InstagramKnownAccountStats = {
  posts: number;
  followers: number;
  following: number;
};

export type InstagramKnownAccountPost = {
  id: "june-ig-01" | "june-ig-02" | "june-ig-03" | "june-ig-04";
  canonicalCharacterId: CoreSocialCharacterId;
  username: string;
  mediaId: SharedCharacterMediaId;
  caption: null;
  timestamp: string;
  status: "visible" | "deleted";
  classification: "CURATED";
  origin: "seed" | "live";
};

export type InstagramState = {
  currentView: InstagramView;
  photos: InstagramPhoto[];
  followers: number;
  knownAccounts: InstagramKnownAccount[];
  knownAccountPosts: InstagramKnownAccountPost[];
  followedCharacterIds: CoreSocialCharacterId[];
  selectedKnownCharacterId: CoreSocialCharacterId | null;
  knownProfileOrigin: InstagramKnownProfileOrigin | null;
  knownConnectionsKind: "followers" | "following" | null;
  popularScrollPosition: number;
  selectedPopularPostId: InstagramPopularPostId | null;
  popularRefreshCount: number;
  selectedPhotoId: string | null;
  scrollPosition: number;
  draft: InstagramDraft;
};

export type InstagramEvent =
  | { type: "SHOW_FEED" }
  | { type: "SHOW_POPULAR" }
  | { type: "REFRESH_POPULAR" }
  | { type: "OPEN_POPULAR_PHOTO"; postId: InstagramPopularPostId }
  | { type: "BACK_FROM_POPULAR_PHOTO" }
  | { type: "SET_POPULAR_SCROLL_POSITION"; scrollPosition: number }
  | { type: "SHOW_NEWS" }
  | { type: "SHOW_PROFILE" }
  | { type: "SHOW_FOLLOWING" }
  | { type: "SHOW_FACEBOOK_FRIENDS" }
  | { type: "OPEN_KNOWN_PROFILE"; characterId: CoreSocialCharacterId }
  | { type: "SHOW_KNOWN_CONNECTIONS"; kind: "followers" | "following" }
  | { type: "BACK_FROM_DISCOVERY" }
  | { type: "SET_KNOWN_ACCOUNT_FOLLOWING"; characterId: CoreSocialCharacterId; following: boolean }
  | { type: "DELIVER_KNOWN_ACCOUNT_POST"; post: Omit<InstagramKnownAccountPost, "status" | "classification" | "origin" | "caption" | "canonicalCharacterId" | "username"> }
  | { type: "DELETE_KNOWN_ACCOUNT_POST"; postId: InstagramKnownAccountPost["id"] }
  | { type: "BEGIN_FIRST_PHOTO" }
  | { type: "SELECT_SOURCE"; source: InstagramPhotoSource }
  | { type: "SELECT_FILTER"; filter: InstagramFilter }
  | { type: "CONTINUE_TO_SHARE" }
  | { type: "POST_FIRST_PHOTO"; owner: string; createdAt: number }
  | { type: "CANCEL_FIRST_PHOTO" }
  | { type: "SET_SCROLL_POSITION"; scrollPosition: number }
  | { type: "RESET" };

const emptyDraft = (): InstagramDraft => ({ source: null, filter: null });

export function createInitialInstagramState(): InstagramState {
  return {
    currentView: "feed",
    photos: [...SESSION_SEED_CONTENT.instagram.photos],
    followers: SESSION_SEED_CONTENT.instagram.followers,
    knownAccounts: SESSION_SEED_CONTENT.instagram.knownAccounts.map(account => ({ ...account })),
    knownAccountPosts: SESSION_SEED_CONTENT.instagram.knownAccountPosts.map(post => ({ ...post })),
    followedCharacterIds: [...SESSION_SEED_CONTENT.instagram.followedCharacterIds],
    selectedKnownCharacterId: null,
    knownProfileOrigin: null,
    knownConnectionsKind: null,
    popularScrollPosition: 0,
    selectedPopularPostId: null,
    popularRefreshCount: 0,
    selectedPhotoId: null,
    scrollPosition: 0,
    draft: emptyDraft(),
  };
}

export function selectInstagramKnownAccountByUsername(state: InstagramState, username: string): InstagramKnownAccount | null {
  const normalizedUsername = username.trim().replace(/^@/, "").toLowerCase();
  return state.knownAccounts.find(account => account.username.toLowerCase() === normalizedUsername) ?? null;
}

export const initialInstagramState: InstagramState = createInitialInstagramState();

export function instagramStateTransition(state: InstagramState, event: InstagramEvent): InstagramState {
  switch (event.type) {
    case "SHOW_FEED":
      return { ...state, currentView: "feed", selectedPhotoId: null, selectedKnownCharacterId: null, knownProfileOrigin: null };
    case "SHOW_POPULAR":
      return { ...state, currentView: "popular", selectedPopularPostId: null };
    case "REFRESH_POPULAR":
      return state.currentView === "popular" ? { ...state, popularRefreshCount: state.popularRefreshCount + 1 } : state;
    case "OPEN_POPULAR_PHOTO":
      return INSTAGRAM_POPULAR_POSTS.some(post => post.id === event.postId)
        ? { ...state, currentView: "popularPhotoDetail", selectedPopularPostId: event.postId }
        : state;
    case "BACK_FROM_POPULAR_PHOTO":
      return state.currentView === "popularPhotoDetail" ? { ...state, currentView: "popular", selectedPopularPostId: null } : state;
    case "SET_POPULAR_SCROLL_POSITION":
      return state.currentView === "popular" ? { ...state, popularScrollPosition: Math.max(0, event.scrollPosition) } : state;
    case "SHOW_NEWS":
      return { ...state, currentView: "news", selectedPopularPostId: null };
    case "SHOW_PROFILE":
      return { ...state, currentView: "profile", selectedPhotoId: null, selectedKnownCharacterId: null, knownProfileOrigin: null };
    case "SHOW_FOLLOWING":
      return { ...state, currentView: "following", selectedKnownCharacterId: null, knownProfileOrigin: null };
    case "SHOW_FACEBOOK_FRIENDS":
      return { ...state, currentView: "facebookFriends", selectedKnownCharacterId: null, knownProfileOrigin: null };
    case "OPEN_KNOWN_PROFILE":
      return state.knownAccounts.some(account => account.canonicalCharacterId === event.characterId)
        ? {
            ...state,
            currentView: "knownProfile",
            selectedKnownCharacterId: event.characterId,
            knownProfileOrigin: state.currentView === "following" || state.currentView === "facebookFriends" || state.currentView === "feed"
              ? state.currentView
              : state.knownProfileOrigin,
          }
        : state;
    case "SHOW_KNOWN_CONNECTIONS":
      return state.currentView === "knownProfile" && state.selectedKnownCharacterId
        ? { ...state, currentView: "knownConnections", knownConnectionsKind: event.kind }
        : state;
    case "BACK_FROM_DISCOVERY":
      return state.currentView === "knownConnections"
        ? { ...state, currentView: "knownProfile", knownConnectionsKind: null }
        : state.currentView === "knownProfile"
        ? { ...state, currentView: state.knownProfileOrigin ?? "facebookFriends", selectedKnownCharacterId: null, knownProfileOrigin: null }
        : state.currentView === "following"
          ? { ...state, currentView: "profile", selectedKnownCharacterId: null, knownProfileOrigin: null }
        : state.currentView === "facebookFriends"
          ? { ...state, currentView: "profile", selectedKnownCharacterId: null, knownProfileOrigin: null }
          : state;
    case "SET_KNOWN_ACCOUNT_FOLLOWING":
      if (!state.knownAccounts.some(account => account.canonicalCharacterId === event.characterId)) return state;
      return event.following
        ? state.followedCharacterIds.includes(event.characterId)
          ? state
          : { ...state, followedCharacterIds: [...state.followedCharacterIds, event.characterId] }
        : state.followedCharacterIds.includes(event.characterId)
          ? { ...state, followedCharacterIds: state.followedCharacterIds.filter(id => id !== event.characterId) }
          : state;
    case "DELIVER_KNOWN_ACCOUNT_POST": {
      if (state.knownAccountPosts.some(post => post.id === event.post.id)) return state;
      const june = state.knownAccounts.find(account => account.canonicalCharacterId === "june");
      if (!june) return state;
      return { ...state, knownAccountPosts: [...state.knownAccountPosts, {
        ...event.post,
        canonicalCharacterId: june.canonicalCharacterId,
        username: june.username,
        caption: null,
        status: "visible",
        classification: "CURATED",
        origin: "live",
      }] };
    }
    case "DELETE_KNOWN_ACCOUNT_POST":
      return state.knownAccountPosts.some(post => post.id === event.postId && post.status === "visible")
        ? { ...state, knownAccountPosts: state.knownAccountPosts.map(post => post.id === event.postId ? { ...post, status: "deleted" } : post) }
        : state;
    case "BEGIN_FIRST_PHOTO":
      return state.photos.length === 0
        ? { ...state, currentView: "source", selectedPhotoId: null, draft: emptyDraft() }
        : state;
    case "SELECT_SOURCE":
      return state.currentView === "source"
        ? { ...state, currentView: "filter", draft: { source: event.source, filter: "Original" } }
        : state;
    case "SELECT_FILTER":
      return state.currentView === "filter" && state.draft.source
        ? { ...state, draft: { ...state.draft, filter: event.filter } }
        : state;
    case "CONTINUE_TO_SHARE":
      return state.currentView === "filter" && state.draft.source && state.draft.filter
        ? { ...state, currentView: "share" }
        : state;
    case "POST_FIRST_PHOTO":
      if (state.currentView !== "share" || state.photos.length > 0 || !state.draft.source || !state.draft.filter) return state;
      return {
        ...state,
        currentView: "feed",
        photos: [{
          id: "instagram-first-photo",
          owner: event.owner,
          source: state.draft.source,
          filter: state.draft.filter,
          createdAt: event.createdAt,
          origin: "user",
        }],
        selectedPhotoId: "instagram-first-photo",
        draft: emptyDraft(),
      };
    case "CANCEL_FIRST_PHOTO":
      return state.currentView === "source" || state.currentView === "filter" || state.currentView === "share"
        ? { ...state, currentView: "feed", draft: emptyDraft() }
        : state;
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: Math.max(0, event.scrollPosition) };
    case "RESET":
      return createInitialInstagramState();
  }
}

export function selectInstagramVisibleKnownPosts(state: InstagramState, characterId: CoreSocialCharacterId): InstagramKnownAccountPost[] {
  return state.knownAccountPosts
    .filter(post => post.canonicalCharacterId === characterId && post.status === "visible")
    .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp));
}

export function selectInstagramVisibleFollowedPosts(state: InstagramState): InstagramKnownAccountPost[] {
  return state.knownAccountPosts
    .filter(post => post.status === "visible" && state.followedCharacterIds.includes(post.canonicalCharacterId))
    .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp));
}

export function selectInstagramFollowedAccounts(state: InstagramState): InstagramKnownAccount[] {
  return state.knownAccounts.filter(account => state.followedCharacterIds.includes(account.canonicalCharacterId));
}

export function selectInstagramFollowingCount(state: InstagramState): number {
  return state.followedCharacterIds.length;
}

export function selectInstagramKnownAccountStats(state: InstagramState, characterId: CoreSocialCharacterId): InstagramKnownAccountStats | null {
  const account = state.knownAccounts.find(candidate => candidate.canonicalCharacterId === characterId);
  if (!account) return null;
  const baselineFollowed = SESSION_SEED_CONTENT.instagram.followedCharacterIds.some(id => id === characterId);
  const currentlyFollowed = state.followedCharacterIds.includes(characterId);
  return {
    posts: selectInstagramVisibleKnownPosts(state, characterId).length,
    followers: account.followersBaseline + Number(currentlyFollowed) - Number(baselineFollowed),
    following: account.followingBaseline,
  };
}
