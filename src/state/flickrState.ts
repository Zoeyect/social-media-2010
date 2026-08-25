import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export type FlickrView = "photostream" | "photo";

export type FlickrPhoto = {
  id: string;
  title: string;
  timestamp: string;
  owner: string;
  comments?: string[];
  origin: ContentOrigin;
};

export type FlickrState = {
  currentView: FlickrView;
  selectedPhotoId: string | null;
  photostreamScrollPosition: number;
  favoritePhotoIds: string[];
  currentSetId: string | null;
  commentsState: string[];
  photos: readonly FlickrPhoto[];
};

export type FlickrEvent =
  | { type: "OPEN_PHOTO"; photoId: string; photostreamScrollPosition: number }
  | { type: "BACK_TO_PHOTOSTREAM" }
  | { type: "TOGGLE_FAVORITE"; photoId: string }
  | { type: "SET_SCROLL_POSITION"; photostreamScrollPosition: number }
  | { type: "RESET" };

export function createInitialFlickrState(): FlickrState {
  return {
    currentView: "photostream",
    selectedPhotoId: null,
    photostreamScrollPosition: 0,
    favoritePhotoIds: [],
    currentSetId: null,
    commentsState: [],
    photos: SESSION_SEED_CONTENT.flickr.map(photo => ({
      ...photo,
      comments: "comments" in photo ? [...photo.comments] : undefined,
    })),
  };
}

export const initialFlickrState: FlickrState = createInitialFlickrState();

export function flickrStateTransition(state: FlickrState, event: FlickrEvent): FlickrState {
  switch (event.type) {
    case "OPEN_PHOTO": {
      const target = state.photos.find(photo => photo.id === event.photoId);
      if (!target) return state;
      return {
        ...state,
        currentView: "photo",
        selectedPhotoId: event.photoId,
        photostreamScrollPosition: Math.max(0, event.photostreamScrollPosition),
      };
    }
    case "BACK_TO_PHOTOSTREAM":
      return {
        ...state,
        currentView: "photostream",
        selectedPhotoId: null,
      };
    case "TOGGLE_FAVORITE": {
      const alreadyFavorite = state.favoritePhotoIds.includes(event.photoId);
      return {
        ...state,
        favoritePhotoIds: alreadyFavorite
          ? state.favoritePhotoIds.filter(id => id !== event.photoId)
          : [...state.favoritePhotoIds, event.photoId],
      };
    }
    case "SET_SCROLL_POSITION":
      return {
        ...state,
        photostreamScrollPosition: Math.max(0, event.photostreamScrollPosition),
      };
    case "RESET":
      return createInitialFlickrState();
    default:
      return state;
  }
}
