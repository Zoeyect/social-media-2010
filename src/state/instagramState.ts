import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";

export type InstagramView = "feed" | "profile";

export type InstagramPhoto = {
  id: string;
  source: string;
};

export type InstagramState = {
  currentView: InstagramView;
  photos: InstagramPhoto[];
  followers: number;
  following: number;
  selectedPhotoId: string | null;
  scrollPosition: number;
};

export type InstagramEvent =
  | { type: "SHOW_FEED" }
  | { type: "SHOW_PROFILE" }
  | { type: "SET_SCROLL_POSITION"; scrollPosition: number }
  | { type: "RESET" };

export function createInitialInstagramState(): InstagramState {
  return {
    currentView: "feed",
    photos: [...SESSION_SEED_CONTENT.instagram.photos],
    followers: SESSION_SEED_CONTENT.instagram.followers,
    following: SESSION_SEED_CONTENT.instagram.following,
    selectedPhotoId: null,
    scrollPosition: 0,
  };
}

export const initialInstagramState: InstagramState = createInitialInstagramState();

export function instagramStateTransition(state: InstagramState, event: InstagramEvent): InstagramState {
  switch (event.type) {
    case "SHOW_FEED":
      return { ...state, currentView: "feed", selectedPhotoId: null };
    case "SHOW_PROFILE":
      return { ...state, currentView: "profile", selectedPhotoId: null };
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: Math.max(0, event.scrollPosition) };
    case "RESET":
      return createInitialInstagramState();
  }
}
