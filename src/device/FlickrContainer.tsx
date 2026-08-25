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
  const selectedSet = state.sets.find(set => set.id === state.currentSetId) ?? null;
  const selectedComments = selected ? state.commentsState.filter(comment => comment.photoId === selected.id) : [];

  useLayoutEffect(() => {
    if (state.currentView !== "photostream" || !photostreamRef.current) return;
    photostreamRef.current.scrollTop = state.photostreamScrollPosition;
  }, [state.currentView, state.photostreamScrollPosition]);

  const isFavorite = Boolean(state.selectedPhotoId && state.favoritePhotoIds.includes(state.selectedPhotoId));

  return <section className="flickr-container" aria-label="Flickr" data-chrome-status="HOLD">
    <header className="flickr-navigation-bar">
      {state.currentView === "photo" && <button type="button" onClick={() => dispatch({ type: "BACK_FROM_PHOTO" })}>Back</button>}
      {state.currentView === "comments" && <button type="button" onClick={() => dispatch({ type: "BACK_TO_PHOTO" })}>Photo</button>}
      {state.currentView === "set" && <button type="button" onClick={() => dispatch({ type: "SHOW_SETS" })}>Sets</button>}
      <strong>{viewTitle(state, selectedSet?.title)}</strong>
      <span>{identity.name || "Owner"}</span>
    </header>

    {(state.currentView === "photostream" || state.currentView === "sets") && <nav className="flickr-section-strip" aria-label="Flickr sections">
      <button type="button" aria-current={state.currentView === "photostream" ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_PHOTOSTREAM" })}>Photostream</button>
      <button type="button" aria-current={state.currentView === "sets" ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_SETS" })}>Sets</button>
    </nav>}

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
            onOpen={photoId => dispatch({
              type: "OPEN_PHOTO",
              photoId,
              origin: { view: "photostream" },
              photostreamScrollPosition: photostreamRef.current?.scrollTop ?? state.photostreamScrollPosition,
            })}
          />)}
    </div>}

    {state.currentView === "sets" && <div className="flickr-set-list">
      {state.sets.map(set => <button type="button" key={set.id} onClick={() => dispatch({ type: "OPEN_SET", setId: set.id })}>
        <strong>{set.title}</strong>
        <span>{set.photoIds.length} {set.photoIds.length === 1 ? "photo" : "photos"}</span>
      </button>)}
    </div>}

    {state.currentView === "set" && selectedSet && <div className="flickr-photo-stream">
      {selectedSet.photoIds.map(photoId => state.photos.find(photo => photo.id === photoId)).filter((photo): photo is FlickrPhoto => Boolean(photo)).map(photo => <PhotoRow
        key={photo.id}
        photo={photo}
        checked={state.favoritePhotoIds.includes(photo.id)}
        onOpen={photoId => dispatch({ type: "OPEN_PHOTO", photoId, origin: { view: "set", setId: selectedSet.id } })}
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
        <div><dt>Comments</dt><dd>{selectedComments.length}</dd></div>
      </dl>
      <button type="button" className="flickr-comments-button" onClick={() => dispatch({ type: "OPEN_COMMENTS" })}>Comments</button>
      <button type="button" className="flickr-favorite" onClick={() => dispatch({ type: "TOGGLE_FAVORITE", photoId: selected.id })}>
        {isFavorite ? "Unfavorite" : "Favorite"}
      </button>
      <button type="button" className="flickr-back" onClick={() => dispatch({ type: "BACK_FROM_PHOTO" })}>Back</button>
    </article>}

    {state.currentView === "comments" && selected && <section className="flickr-comments">
      <div className="flickr-comment-list">
        {selectedComments.length === 0
          ? <p>No comments.</p>
          : selectedComments.map(comment => <article key={comment.id} data-origin={comment.origin}>
            {comment.author && <strong>{comment.author}</strong>}
            <p>{comment.text}</p>
          </article>)}
      </div>
      <form className="flickr-comment-composer" onSubmit={event => {
        event.preventDefault();
        dispatch({ type: "SUBMIT_COMMENT", author: identity.name });
      }}>
        <textarea aria-label="Comment" value={state.commentDraft} onChange={event => dispatch({ type: "EDIT_COMMENT", value: event.currentTarget.value })} />
        <button type="submit" disabled={!state.commentDraft.trim()}>Post</button>
      </form>
    </section>}
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

function viewTitle(state: FlickrState, setTitle?: string): string {
  switch (state.currentView) {
    case "photostream": return "Photostream";
    case "sets": return "Sets";
    case "set": return setTitle ?? "Set";
    case "photo": return "Photo";
    case "comments": return "Comments";
  }
}
