import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { CoreSocialCharacterId } from "../data/coreSocialFriends";

export type InstagramView = "feed" | "profile" | "source" | "filter" | "share";
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
  photoCount: number;
  classification: "CURATED";
  discoveryUiStatus: "HOLD";
  followUiStatus: "HOLD";
  origin: "seed";
};

export type InstagramState = {
  currentView: InstagramView;
  photos: InstagramPhoto[];
  followers: number;
  following: number;
  knownAccounts: InstagramKnownAccount[];
  selectedPhotoId: string | null;
  scrollPosition: number;
  draft: InstagramDraft;
};

export type InstagramEvent =
  | { type: "SHOW_FEED" }
  | { type: "SHOW_PROFILE" }
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
    following: SESSION_SEED_CONTENT.instagram.following,
    knownAccounts: SESSION_SEED_CONTENT.instagram.knownAccounts.map(account => ({ ...account })),
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
      return { ...state, currentView: "feed", selectedPhotoId: null };
    case "SHOW_PROFILE":
      return { ...state, currentView: "profile", selectedPhotoId: null };
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
