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

export const initialInstagramState: InstagramState = {
  currentView: "feed",
  photos: [],
  followers: 0,
  following: 0,
  selectedPhotoId: null,
  scrollPosition: 0,
};

export function instagramStateTransition(state: InstagramState, event: InstagramEvent): InstagramState {
  switch (event.type) {
    case "SHOW_FEED":
      return { ...state, currentView: "feed", selectedPhotoId: null };
    case "SHOW_PROFILE":
      return { ...state, currentView: "profile", selectedPhotoId: null };
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: Math.max(0, event.scrollPosition) };
    case "RESET":
      return initialInstagramState;
  }
}
