import { Dispatch, useLayoutEffect, useRef } from "react";
import { FacebookEvent, FacebookFeedItem, FacebookState } from "../state/facebookState";

type FacebookContainerProps = {
  state: FacebookState;
  dispatch: Dispatch<FacebookEvent>;
};

export function FacebookContainer({ state, dispatch }: FacebookContainerProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const selectedItem = state.feed.find(item => item.id === state.selectedFeedItemId) ?? null;

  useLayoutEffect(() => {
    if (state.currentView !== "feed" || !feedRef.current) return;
    feedRef.current.scrollTop = state.scrollPosition;
  }, [state.currentView, state.scrollPosition]);

  return <section className="facebook-container" aria-label="Facebook" data-chrome-status="HOLD">
    <header className="facebook-navigation-bar">
      {state.currentView !== "feed" && <button type="button" onClick={() => dispatch({ type: "SHOW_FEED" })}>News Feed</button>}
      <strong>{viewTitle(state.currentView)}</strong>
    </header>
    <nav className="facebook-section-strip" aria-label="Facebook sections" data-layout-status="HOLD">
      <button type="button" aria-current={state.currentView === "feed" || state.currentView === "feedDetail" ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_FEED" })}>Feed</button>
      <button type="button" aria-current={state.currentView === "friendRequests" ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_FRIEND_REQUESTS" })}>Requests{state.friendRequestState === "pending" ? " 1" : ""}</button>
      <button type="button" aria-current={state.currentView === "messages" || state.currentView === "messageDetail" ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_MESSAGES" })}>Messages{state.juneMessageState === "unread" ? " 1" : ""}</button>
    </nav>

    {state.currentView === "feed" && <div
      ref={feedRef}
      className="facebook-feed"
      onScroll={event => dispatch({ type: "SET_SCROLL_POSITION", scrollPosition: event.currentTarget.scrollTop })}
    >
      {state.feed.map(item => <FeedRow
        key={item.id}
        item={item}
        liked={state.likedItemIds.includes(item.id)}
        onOpen={() => dispatch({
          type: "OPEN_FEED_ITEM",
          itemId: item.id,
          scrollPosition: feedRef.current?.scrollTop ?? state.scrollPosition,
        })}
      />)}
    </div>}

    {state.currentView === "feedDetail" && selectedItem && <article className="facebook-feed-detail" data-content-status={selectedItem.contentStatus}>
      <strong>{selectedItem.author}</strong>
      <p>{selectedItem.text}</p>
      <time>October 20, 2010 · {selectedItem.timestamp}</time>
      <div className="facebook-detail-actions">
        <button type="button" aria-pressed={state.likedItemIds.includes(selectedItem.id)} onClick={() => dispatch({ type: "TOGGLE_LIKE", itemId: selectedItem.id })}>{state.likedItemIds.includes(selectedItem.id) ? "Unlike" : "Like"}</button>
        <button type="button" disabled data-control-status="HOLD">Comment</button>
      </div>
    </article>}

    {state.currentView === "friendRequests" && <div className="facebook-request-list">
      {state.friendRequestState !== "none" && <section className="facebook-request-row">
        <strong>Jack</strong>
        {state.friendRequestState === "pending"
          ? <div><button type="button" onClick={() => dispatch({ type: "ACCEPT_JACK" })}>Accept</button><button type="button" onClick={() => dispatch({ type: "IGNORE_JACK" })}>Ignore</button></div>
          : <span>{state.friendRequestState === "accepted" ? "Request accepted" : "Request ignored"}</span>}
      </section>}
    </div>}

    {state.currentView === "messages" && <div className="facebook-message-list">
      {state.juneMessageState !== "none" && <button type="button" onClick={() => dispatch({ type: "OPEN_JUNE_MESSAGE" })}>
        <strong>June</strong>
        <span>Hey, are you online?</span>
        {state.juneMessageState === "unread" && <i aria-label="Unread" />}
      </button>}
    </div>}

    {state.currentView === "messageDetail" && <article className="facebook-message-detail">
      <strong>June</strong>
      <p>Hey, are you online?</p>
      <span data-reply-status="HOLD">Reply unavailable in v0.1</span>
    </article>}
  </section>;
}

function FeedRow({ item, liked, onOpen }: { item: FacebookFeedItem; liked: boolean; onOpen: () => void }) {
  return <button type="button" className="facebook-feed-row" onClick={onOpen} data-content-status={item.contentStatus}>
    <span className="facebook-avatar-hold" aria-hidden="true" />
    <span className="facebook-feed-copy">
      <strong>{item.author}</strong>
      <span>{item.text}</span>
      <time>{item.timestamp}{liked ? " · You like this" : ""}</time>
    </span>
  </button>;
}

function viewTitle(view: FacebookState["currentView"]): string {
  switch (view) {
    case "feed": return "News Feed";
    case "feedDetail": return "Post";
    case "friendRequests": return "Friend Requests";
    case "messages": return "Messages";
    case "messageDetail": return "June";
  }
}
