import { Dispatch, useLayoutEffect, useRef } from "react";
import { FlickrEvent, FlickrPhoto, FlickrState } from "../state/flickrState";
import { useSessionIdentity } from "../state/sessionIdentity";

type FlickrContainerProps = {
  state: FlickrState;
  dispatch: Dispatch<FlickrEvent>;
};

export function FlickrContainer({ state, dispatch }: FlickrContainerProps) {
  const photostreamRef = useRef<HTMLDivElement>(null);
  const identity = useSessionIdentity();
  const selected = state.photos.find(photo => photo.id === state.selectedPhotoId) ?? null;

  useLayoutEffect(() => {
    if (state.currentView !== "photostream" || !photostreamRef.current) return;
    photostreamRef.current.scrollTop = state.photostreamScrollPosition;
  }, [state.currentView, state.photostreamScrollPosition]);

  const isFavorite = Boolean(state.selectedPhotoId && state.favoritePhotoIds.includes(state.selectedPhotoId));

  return <section className="flickr-container" aria-label="Flickr" data-chrome-status="HOLD">
    <header className="flickr-navigation-bar">
      <strong>{state.currentView === "photostream" ? "Photostream" : "Photo"}</strong>
      <span>{identity.name || "Owner"}</span>
    </header>

    {state.currentView === "photostream" && <div
      ref={photostreamRef}
      className="flickr-photo-stream"
      onScroll={event => dispatch({ type: "SET_SCROLL_POSITION", photostreamScrollPosition: event.currentTarget.scrollTop })}
    >
      {state.photos.length === 0
        ? <p className="flickr-empty-state" data-content-status="HOLD">No photos yet.</p>
        : state.photos.map(photo => <PhotoRow
            key={photo.id}
            photo={photo}
            checked={state.favoritePhotoIds.includes(photo.id)}
            onOpen={photoId => dispatch({ type: "OPEN_PHOTO", photoId, photostreamScrollPosition: photostreamRef.current?.scrollTop ?? state.photostreamScrollPosition })}
          />)}
    </div>}

    {state.currentView === "photo" && selected && <article className="flickr-photo-detail">
      <div className="flickr-photo-frame" role="img" aria-label={selected.title} />
      <header>
        <strong>{selected.title}</strong>
        <p>{selected.timestamp}</p>
      </header>
      <dl>
        <div><dt>Owner</dt><dd>{identity.name || selected.owner}</dd></div>
        <div><dt>Comments</dt><dd>{selected.comments?.length ? `${selected.comments.length}` : "0"}</dd></div>
      </dl>
      <button type="button" className="flickr-favorite" onClick={() => dispatch({ type: "TOGGLE_FAVORITE", photoId: selected.id })}>
        {isFavorite ? "Unfavorite" : "Favorite"}
      </button>
      <button type="button" className="flickr-back" onClick={() => dispatch({ type: "BACK_TO_PHOTOSTREAM" })}>Back</button>
    </article>}
  </section>;
}

function PhotoRow({ photo, checked, onOpen }: { photo: FlickrPhoto; checked: boolean; onOpen: (photoId: string) => void }) {
  return <button
    type="button"
    className="flickr-photo-row"
    onClick={() => onOpen(photo.id)}
  >
    <span className="flickr-photo-placeholder" aria-hidden="true" />
    <strong>{photo.title}</strong>
    <small>{checked ? "Favorited" : "Open"}</small>
  </button>;
}
