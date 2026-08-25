import { Dispatch, useLayoutEffect, useRef } from "react";
import { FacebookEvent, FacebookFeedItem, FacebookState } from "../state/facebookState";
import { useSessionIdentity } from "../state/sessionIdentity";

type FacebookContainerProps = {
  state: FacebookState;
  dispatch: Dispatch<FacebookEvent>;
};

export function FacebookContainer({ state, dispatch }: FacebookContainerProps) {
  const sessionIdentity = useSessionIdentity();
  const feedRef = useRef<HTMLDivElement>(null);
  const selectedItem = state.feed.find(item => item.id === state.selectedFeedItemId) ?? null;
  const selectedMessage = state.inboxThreads.find(message => message.id === state.selectedMessageId) ?? null;

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
        <button type="button" aria-expanded={state.commentComposerItemId === selectedItem.id} onClick={() => dispatch({ type: "BEGIN_COMMENT", itemId: selectedItem.id })}>Comment</button>
      </div>
      {state.comments.filter(comment => comment.itemId === selectedItem.id).map(comment => <article className="facebook-comment" key={comment.id}>
        <strong>{comment.author}</strong>
        <span>{comment.text}</span>
      </article>)}
      {state.commentComposerItemId === selectedItem.id && <form className="facebook-comment-composer" onSubmit={event => {
        event.preventDefault();
        dispatch({ type: "SUBMIT_COMMENT", displayName: sessionIdentity.name });
      }}>
        <textarea aria-label="Comment" value={state.commentDraft} onChange={event => dispatch({ type: "EDIT_COMMENT", value: event.currentTarget.value })} />
        <div>
          <button type="button" onClick={() => dispatch({ type: "CANCEL_COMMENT" })}>Cancel</button>
          <button type="submit" disabled={!state.commentDraft.trim()}>Post</button>
        </div>
      </form>}
    </article>}

    {state.currentView === "friendRequests" && <div className="facebook-request-list">
      {state.friendRequestState === "pending" && <section className="facebook-request-row">
        <strong>Jack</strong>
        <div><button type="button" onClick={() => dispatch({ type: "ACCEPT_JACK" })}>Accept</button><button type="button" onClick={() => dispatch({ type: "IGNORE_JACK" })}>Ignore</button></div>
      </section>}
      {state.friends.length > 0 && <section className="facebook-friends" aria-label="Friends">
        <h2>Friends</h2>
        {state.friends.map(friend => <div key={friend.id}><strong>{friend.name}</strong></div>)}
      </section>}
    </div>}

    {state.currentView === "messages" && <div className="facebook-message-list">
      {state.inboxThreads.map(message => <button key={message.id} type="button" onClick={() => dispatch({ type: "OPEN_MESSAGE", messageId: message.id })}>
        <strong>{message.sender}</strong>
        <span>{message.preview}</span>
        {message.status === "unread" && <i aria-label="Unread" />}
      </button>)}
    </div>}

    {state.currentView === "messageDetail" && selectedMessage && <article className="facebook-message-detail">
      <strong>{selectedMessage.sender}</strong>
      <p>{selectedMessage.preview}</p>
      {selectedMessage.id === "june-live-message"
        ? <>
          {state.juneReplies.map(reply => <section className="facebook-message-reply" key={reply.id}>
            <strong>{reply.author}</strong>
            <p>{reply.text}</p>
          </section>)}
          <form className="facebook-message-composer" onSubmit={event => {
            event.preventDefault();
            dispatch({ type: "SUBMIT_JUNE_REPLY", displayName: sessionIdentity.name });
          }}>
            <textarea aria-label="Reply to June" value={state.juneReplyDraft} onChange={event => dispatch({ type: "EDIT_JUNE_REPLY", value: event.currentTarget.value })} />
            <button type="submit" disabled={!state.juneReplyDraft.trim()}>Reply</button>
          </form>
        </>
        : <span data-reply-status="HOLD">Reply unavailable in v0.2</span>}
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
    case "messageDetail": return "Message";
  }
}
