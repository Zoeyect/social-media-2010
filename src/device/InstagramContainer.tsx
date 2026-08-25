import { Dispatch, useLayoutEffect, useRef } from "react";
import { InstagramEvent, InstagramState } from "../state/instagramState";
import { useSessionIdentity } from "../state/sessionIdentity";

type InstagramContainerProps = {
  state: InstagramState;
  dispatch: Dispatch<InstagramEvent>;
};

export function InstagramContainer({ state, dispatch }: InstagramContainerProps) {
  const identity = useSessionIdentity();
  const feedRef = useRef<HTMLDivElement>(null);
  const isWorkflow = state.currentView === "source" || state.currentView === "filter" || state.currentView === "share";

  useLayoutEffect(() => {
    if (state.currentView !== "feed" || !feedRef.current) return;
    feedRef.current.scrollTop = state.scrollPosition;
  }, [state.currentView, state.scrollPosition]);

  return <section className="instagram-container" aria-label="Instagram" data-chrome-status="HOLD">
    <header className="instagram-navigation-bar">
      {isWorkflow && <button className="instagram-navigation-cancel" type="button" onClick={() => dispatch({ type: "CANCEL_FIRST_PHOTO" })}>Cancel</button>}
      <strong>{viewTitle(state.currentView)}</strong>
      {state.currentView === "filter" && <button className="instagram-navigation-next" type="button" onClick={() => dispatch({ type: "CONTINUE_TO_SHARE" })}>Next</button>}
    </header>

    {state.currentView === "feed" && <div
      ref={feedRef}
      className="instagram-feed"
      onScroll={event => dispatch({ type: "SET_SCROLL_POSITION", scrollPosition: event.currentTarget.scrollTop })}
    >
      {state.photos.length === 0
        ? <div className="instagram-empty-feed">
            <p>No photos yet.</p>
            <span>This account is intentionally empty.</span>
          </div>
        : state.photos.map(photo => <article className="instagram-photo-record" key={photo.id} data-origin={photo.origin}>
            <header><strong>{photo.owner}</strong><span>{photo.filter}</span></header>
            <div className="instagram-dev-photo-surface" role="img" aria-label="Development-only non-photographic fixture">
              <strong>DEV fixture</strong>
              <span>No photographic asset</span>
            </div>
          </article>)}
    </div>}

    {state.currentView === "profile" && <section className="instagram-empty-profile">
      <header>
        <strong>{identity.name || "Owner"}</strong>
        <dl>
          <div><dt>Photos</dt><dd>{state.photos.length}</dd></div>
          <div><dt>Followers</dt><dd>{state.followers}</dd></div>
          <div><dt>Following</dt><dd>{state.following}</dd></div>
        </dl>
      </header>
      <p>{state.photos.length === 0 ? "No photos yet." : "1 photo"}</p>
    </section>}

    {state.currentView === "source" && <section className="instagram-first-photo-step">
      <h2>Choose a source</h2>
      <p>No approved photographic fixture is installed.</p>
      <button type="button" onClick={() => dispatch({ type: "SELECT_SOURCE", source: "dev-fixture" })}>Use DEV Fixture</button>
      <small>DEV-ONLY · source artwork HOLD</small>
    </section>}

    {state.currentView === "filter" && <section className="instagram-first-photo-step">
      <div className="instagram-dev-photo-surface" role="img" aria-label="Development-only non-photographic fixture preview">
        <strong>DEV fixture</strong>
        <span>No photographic asset</span>
      </div>
      <h2>Filter</h2>
      <button type="button" aria-pressed={state.draft.filter === "Original"} onClick={() => dispatch({ type: "SELECT_FILTER", filter: "Original" })}>Original</button>
      <small>Additional launch-era filter names remain HOLD.</small>
    </section>}

    {state.currentView === "share" && <section className="instagram-first-photo-step">
      <div className="instagram-dev-photo-surface" role="img" aria-label="Development-only non-photographic fixture preview">
        <strong>DEV fixture</strong>
        <span>No photographic asset</span>
      </div>
      <p>{identity.name || "Owner"} · {state.draft.filter ?? "Original"}</p>
      <button type="button" onClick={() => dispatch({ type: "POST_FIRST_PHOTO", owner: identity.name || "Owner", createdAt: Date.now() })}>Post</button>
    </section>}

    {!isWorkflow && <nav className="instagram-development-navigation" aria-label="Instagram sections">
      <button type="button" aria-current={state.currentView === "feed" ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_FEED" })}>Feed</button>
      <button type="button" disabled>Popular</button>
      <button type="button" disabled={state.photos.length > 0} onClick={() => dispatch({ type: "BEGIN_FIRST_PHOTO" })}>Camera</button>
      <button type="button" disabled>News</button>
      <button type="button" aria-current={state.currentView === "profile" ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_PROFILE" })}>Profile</button>
    </nav>}
  </section>;
}

function viewTitle(view: InstagramState["currentView"]): string {
  switch (view) {
    case "feed": return "Instagram";
    case "profile": return "Profile";
    case "source": return "Photo";
    case "filter": return "Filter";
    case "share": return "Share";
  }
}
