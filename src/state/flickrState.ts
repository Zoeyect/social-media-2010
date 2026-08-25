import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export type FlickrView = "photostream" | "photo" | "comments" | "sets" | "set";

export type FlickrPhoto = {
  id: string;
  title: string;
  timestamp: string;
  owner: string;
  comments?: string[];
  origin: ContentOrigin;
};

export type FlickrComment = {
  id: string;
  photoId: string;
  author: string | null;
  text: string;
  origin: "seed" | "user";
};

export type FlickrSet = {
  id: string;
  title: string;
  photoIds: readonly string[];
};

export type FlickrPhotoNavigationOrigin =
  | { view: "photostream" }
  | { view: "set"; setId: string };

export type FlickrState = {
  currentView: FlickrView;
  selectedPhotoId: string | null;
  photoNavigationOrigin: FlickrPhotoNavigationOrigin | null;
  photostreamScrollPosition: number;
  favoritePhotoIds: string[];
  currentSetId: string | null;
  commentsState: FlickrComment[];
  commentDraft: string;
  sets: FlickrSet[];
  photos: readonly FlickrPhoto[];
};

export type FlickrEvent =
  | { type: "SHOW_PHOTOSTREAM" }
  | { type: "SHOW_SETS" }
  | { type: "OPEN_SET"; setId: string }
  | { type: "OPEN_PHOTO"; photoId: string; origin: FlickrPhotoNavigationOrigin; photostreamScrollPosition?: number }
  | { type: "BACK_FROM_PHOTO" }
  | { type: "OPEN_COMMENTS" }
  | { type: "BACK_TO_PHOTO" }
  | { type: "EDIT_COMMENT"; value: string }
  | { type: "SUBMIT_COMMENT"; author: string }
  | { type: "TOGGLE_FAVORITE"; photoId: string }
  | { type: "SET_SCROLL_POSITION"; photostreamScrollPosition: number }
  | { type: "RESET" };

const FLICKR_SETS: ReadonlyArray<FlickrSet> = Object.freeze([
  Object.freeze({ id: "late-night", title: "Late Night", photoIds: Object.freeze(["sunset-brooklyn", "platform"]) }),
  Object.freeze({ id: "everyday", title: "Everyday", photoIds: Object.freeze(["coffee-table"]) }),
]);

export function createInitialFlickrState(): FlickrState {
  const photos = SESSION_SEED_CONTENT.flickr.map(photo => ({
    ...photo,
    comments: "comments" in photo ? [...photo.comments] : undefined,
  }));
  return {
    currentView: "photostream",
    selectedPhotoId: null,
    photoNavigationOrigin: null,
    photostreamScrollPosition: 0,
    favoritePhotoIds: [],
    currentSetId: null,
    commentsState: photos.flatMap(photo => photo.comments?.map((text, index) => ({
      id: `flickr-seed-comment:${photo.id}:${index + 1}`,
      photoId: photo.id,
      author: null,
      text,
      origin: "seed" as const,
    })) ?? []),
    commentDraft: "",
    sets: FLICKR_SETS.map(set => ({ ...set, photoIds: [...set.photoIds] })),
    photos,
  };
}

export const initialFlickrState: FlickrState = createInitialFlickrState();

export function flickrStateTransition(state: FlickrState, event: FlickrEvent): FlickrState {
  switch (event.type) {
    case "SHOW_PHOTOSTREAM":
      return { ...state, currentView: "photostream", selectedPhotoId: null, photoNavigationOrigin: null, currentSetId: null, commentDraft: "" };
    case "SHOW_SETS":
      return { ...state, currentView: "sets", selectedPhotoId: null, photoNavigationOrigin: null, currentSetId: null, commentDraft: "" };
    case "OPEN_SET":
      return state.sets.some(set => set.id === event.setId)
        ? { ...state, currentView: "set", currentSetId: event.setId, selectedPhotoId: null, photoNavigationOrigin: null }
        : state;
    case "OPEN_PHOTO": {
      const target = state.photos.find(photo => photo.id === event.photoId);
      let validOrigin = event.origin.view === "photostream";
      if (event.origin.view === "set") {
        const originSetId = event.origin.setId;
        validOrigin = state.sets.some(set => set.id === originSetId && set.photoIds.includes(event.photoId));
      }
      if (!target || !validOrigin) return state;
      return {
        ...state,
        currentView: "photo",
        selectedPhotoId: event.photoId,
        photoNavigationOrigin: event.origin,
        currentSetId: event.origin.view === "set" ? event.origin.setId : null,
        photostreamScrollPosition: event.origin.view === "photostream"
          ? Math.max(0, event.photostreamScrollPosition ?? state.photostreamScrollPosition)
          : state.photostreamScrollPosition,
        commentDraft: "",
      };
    }
    case "BACK_FROM_PHOTO":
      return state.photoNavigationOrigin?.view === "set"
        ? { ...state, currentView: "set", selectedPhotoId: null, currentSetId: state.photoNavigationOrigin.setId, photoNavigationOrigin: null, commentDraft: "" }
        : { ...state, currentView: "photostream", selectedPhotoId: null, currentSetId: null, photoNavigationOrigin: null, commentDraft: "" };
    case "OPEN_COMMENTS":
      return state.selectedPhotoId && state.photos.some(photo => photo.id === state.selectedPhotoId)
        ? { ...state, currentView: "comments" }
        : state;
    case "BACK_TO_PHOTO":
      return state.selectedPhotoId ? { ...state, currentView: "photo", commentDraft: "" } : state;
    case "EDIT_COMMENT":
      return state.currentView === "comments" && state.selectedPhotoId
        ? { ...state, commentDraft: event.value }
        : state;
    case "SUBMIT_COMMENT": {
      const text = state.commentDraft.trim();
      if (!text || state.currentView !== "comments" || !state.selectedPhotoId) return state;
      const userCommentCount = state.commentsState.filter(comment => comment.origin === "user").length;
      return {
        ...state,
        commentsState: [...state.commentsState, {
          id: `flickr-user-comment-${userCommentCount + 1}`,
          photoId: state.selectedPhotoId,
          author: event.author,
          text,
          origin: "user",
        }],
        commentDraft: "",
      };
    }
    case "TOGGLE_FAVORITE": {
      if (!state.photos.some(photo => photo.id === event.photoId)) return state;
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
  }
}
