export type FlickrView = "photostream" | "photo";

export type FlickrPhoto = {
  id: string;
  title: string;
  timestamp: string;
  owner: string;
  comments?: string[];
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

const initialPhotos: FlickrPhoto[] = [
  { id: "sunset-brooklyn", title: "Evening Streetlight", owner: "flickr.demo", timestamp: "2010-10-20 12:01 AM", comments: ["Nice shot"] },
  { id: "coffee-table", title: "Cup and Notepad", owner: "flickr.demo", timestamp: "2010-10-20 12:04 AM" },
  { id: "platform", title: "Platform", owner: "flickr.demo", timestamp: "2010-10-20 12:09 AM" },
];

export const initialFlickrState: FlickrState = {
  currentView: "photostream",
  selectedPhotoId: null,
  photostreamScrollPosition: 0,
  favoritePhotoIds: [],
  currentSetId: null,
  commentsState: [],
  photos: initialPhotos,
};

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
      return {
        ...initialFlickrState,
      };
    default:
      return state;
  }
}
