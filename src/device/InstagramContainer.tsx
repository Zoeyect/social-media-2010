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

  useLayoutEffect(() => {
    if (state.currentView !== "feed" || !feedRef.current) return;
    feedRef.current.scrollTop = state.scrollPosition;
  }, [state.currentView, state.scrollPosition]);

  return <section className="instagram-container" aria-label="Instagram" data-chrome-status="HOLD">
    <header className="instagram-navigation-bar">
      <strong>{state.currentView === "feed" ? "Feed" : identity.name}</strong>
    </header>

    {state.currentView === "feed" && <div
      ref={feedRef}
      className="instagram-empty-feed"
      onScroll={event => dispatch({ type: "SET_SCROLL_POSITION", scrollPosition: event.currentTarget.scrollTop })}
    >
      <p>No photos yet.</p>
      <span data-copy-status="HOLD">This new account has an empty feed.</span>
    </div>}

    {state.currentView === "profile" && <section className="instagram-empty-profile">
      <header>
        <strong>{identity.name}</strong>
        <dl>
          <div><dt>Photos</dt><dd>{state.photos.length}</dd></div>
          <div><dt>Followers</dt><dd>{state.followers}</dd></div>
          <div><dt>Following</dt><dd>{state.following}</dd></div>
        </dl>
      </header>
      <p>No Photos</p>
    </section>}

    <nav className="instagram-development-navigation" aria-label="Instagram sections" data-layout-status="HOLD">
      <button type="button" aria-current={state.currentView === "feed" ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_FEED" })}>Feed</button>
      <button type="button" disabled data-control-status="HOLD">Popular</button>
      <button type="button" disabled data-control-status="HOLD">Camera</button>
      <button type="button" disabled data-control-status="HOLD">News</button>
      <button type="button" aria-current={state.currentView === "profile" ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_PROFILE" })}>Profile</button>
    </nav>
  </section>;
}
