import { Dispatch, useLayoutEffect, useRef } from "react";
import { FacebookEvent, FacebookFeedItem, FacebookState, selectFacebookInboxUnreadCount, selectFacebookRequestCount } from "../state/facebookState";
import { useSessionIdentity } from "../state/sessionIdentity";

type FacebookContainerProps = { state: FacebookState; dispatch: Dispatch<FacebookEvent> };

export function FacebookContainer({ state, dispatch }: FacebookContainerProps) {
  const sessionIdentity = useSessionIdentity();
  const feedRef = useRef<HTMLDivElement>(null);
  const selectedItem = state.feed.find(item => item.id === state.selectedFeedItemId) ?? null;
  const selectedMessage = state.inboxThreads.find(message => message.id === state.selectedMessageId) ?? null;
  const requestCount = selectFacebookRequestCount(state);
  const inboxUnreadCount = selectFacebookInboxUnreadCount(state);
  const selectedProfileName = state.selectedProfileName ?? sessionIdentity.name;

  useLayoutEffect(() => {
    if (state.currentView !== "feed" || !feedRef.current) return;
    feedRef.current.scrollTop = state.scrollPosition;
  }, [state.currentView, state.scrollPosition]);

  return <section className="facebook-container" aria-label="Facebook" data-chrome-status="HOLD">
    <header className="facebook-navigation-bar">
      {state.navigationStack.length > 1 && <button type="button" className="facebook-back-control" onClick={() => dispatch({ type: "GO_BACK" })}>Back</button>}
      <button type="button" className="facebook-title-control" onClick={() => dispatch({ type: "SHOW_HOME" })}>{viewTitle(state.currentView)}</button>
    </header>

    {state.currentView === "home" && <FacebookHome displayName={sessionIdentity.name} requestCount={requestCount} inboxUnreadCount={inboxUnreadCount} dispatch={dispatch} />}

    {state.currentView === "feed" && <div ref={feedRef} className="facebook-feed" onScroll={event => dispatch({ type: "SET_SCROLL_POSITION", scrollPosition: event.currentTarget.scrollTop })}>
      {state.feed.map(item => <FeedRow
        key={item.id}
        item={item}
        liked={state.likedItemIds.includes(item.id)}
        onOpenProfile={() => dispatch({ type: "OPEN_PROFILE", profileName: item.author })}
        onOpen={() => dispatch({ type: "OPEN_FEED_ITEM", itemId: item.id, scrollPosition: feedRef.current?.scrollTop ?? state.scrollPosition })}
        onToggleLike={() => dispatch({ type: "TOGGLE_LIKE", itemId: item.id })}
        onComment={() => {
          dispatch({ type: "OPEN_FEED_ITEM", itemId: item.id, scrollPosition: feedRef.current?.scrollTop ?? state.scrollPosition });
          dispatch({ type: "BEGIN_COMMENT", itemId: item.id });
        }}
      />)}
    </div>}

    {state.currentView === "feedDetail" && selectedItem && <article className="facebook-feed-detail" data-content-status={selectedItem.contentStatus}>
      <button type="button" className="facebook-author-link" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: selectedItem.author })}>{selectedItem.author}</button>
      <p>{selectedItem.text}</p>
      <time>October 20, 2010 · {selectedItem.timestamp}</time>
      <div className="facebook-detail-actions">
        <button type="button" aria-pressed={state.likedItemIds.includes(selectedItem.id)} onClick={() => dispatch({ type: "TOGGLE_LIKE", itemId: selectedItem.id })}>{state.likedItemIds.includes(selectedItem.id) ? "Unlike" : "Like"}</button>
        <button type="button" aria-expanded={state.commentComposerItemId === selectedItem.id} onClick={() => dispatch({ type: "BEGIN_COMMENT", itemId: selectedItem.id })}>Comment</button>
      </div>
      {state.comments.filter(comment => comment.itemId === selectedItem.id).map(comment => <article className="facebook-comment" key={comment.id}><strong>{comment.author}</strong><span>{comment.text}</span></article>)}
      {state.commentComposerItemId === selectedItem.id && <form className="facebook-comment-composer" onSubmit={event => {
        event.preventDefault();
        dispatch({ type: "SUBMIT_COMMENT", displayName: sessionIdentity.name });
      }}>
        <textarea aria-label="Comment" value={state.commentDraft} onChange={event => dispatch({ type: "EDIT_COMMENT", value: event.currentTarget.value })} />
        <div><button type="button" onClick={() => dispatch({ type: "CANCEL_COMMENT" })}>Cancel</button><button type="submit" disabled={!state.commentDraft.trim()}>Post</button></div>
      </form>}
    </article>}

    {state.currentView === "profile" && <FacebookProfile profileName={selectedProfileName} currentUserName={sessionIdentity.name} state={state} dispatch={dispatch} />}

    {state.currentView === "friends" && <div className="facebook-friend-list" aria-label="Friends">
      {state.friends.map(friend => <button key={friend.id} type="button" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: friend.name })}><span className="facebook-avatar-hold" aria-hidden="true" /><strong>{friend.name}</strong></button>)}
    </div>}

    {state.currentView === "requests" && <div className="facebook-request-list">
      {state.friendRequestState === "pending" && <section className="facebook-request-row">
        <button type="button" className="facebook-request-person" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: "Jack" })}>Jack</button>
        <div><button type="button" onClick={() => dispatch({ type: "ACCEPT_JACK" })}>Accept</button><button type="button" onClick={() => dispatch({ type: "IGNORE_JACK" })}>Ignore</button></div>
      </section>}
    </div>}

    {state.currentView === "inbox" && <div className="facebook-message-list" aria-label="Inbox">
      {state.inboxThreads.map(message => <button key={message.id} type="button" onClick={() => dispatch({ type: "OPEN_MESSAGE", messageId: message.id })}>
        <strong>{message.sender}</strong><span>{message.preview}</span><time>{message.timestamp}</time>{message.status === "unread" && <i aria-label="Unread" />}
      </button>)}
    </div>}

    {state.currentView === "messageDetail" && selectedMessage && <article className="facebook-message-detail">
      <strong>{selectedMessage.sender}</strong><p>{selectedMessage.preview}</p>
      {selectedMessage.id === "june-live-message" ? <>
        {state.juneReplies.map(reply => <section className="facebook-message-reply" key={reply.id}><strong>{reply.author}</strong><p>{reply.text}</p></section>)}
        <form className="facebook-message-composer" onSubmit={event => { event.preventDefault(); dispatch({ type: "SUBMIT_JUNE_REPLY", displayName: sessionIdentity.name }); }}>
          <textarea aria-label="Reply to June" value={state.juneReplyDraft} onChange={event => dispatch({ type: "EDIT_JUNE_REPLY", value: event.currentTarget.value })} />
          <button type="submit" disabled={!state.juneReplyDraft.trim()}>Reply</button>
        </form>
      </> : <span data-reply-status="HOLD">Reply unavailable in v0.2</span>}
    </article>}
  </section>;
}

function FacebookHome({ displayName, requestCount, inboxUnreadCount, dispatch }: { displayName: string; requestCount: number; inboxUnreadCount: number; dispatch: Dispatch<FacebookEvent> }) {
  return <div className="facebook-home" aria-label="Facebook Home" data-layout-evidence="PERIOD-EVIDENCE">
    <div className="facebook-home-grid">
      <HomeDestination label="News Feed" onClick={() => dispatch({ type: "SHOW_FEED" })} />
      <HomeDestination label="Profile" onClick={() => dispatch({ type: "SHOW_PROFILE", profileName: displayName })} />
      <HomeDestination label="Friends" onClick={() => dispatch({ type: "SHOW_FRIENDS" })} />
      <HomeDestination label="Inbox" count={inboxUnreadCount} onClick={() => dispatch({ type: "SHOW_INBOX" })} />
      <HomeDestination label="Requests" count={requestCount} onClick={() => dispatch({ type: "SHOW_REQUESTS" })} />
    </div>
    <div className="facebook-home-notifications-hold" data-provenance-status="HOLD" aria-label="Notifications area unavailable" />
  </div>;
}

function HomeDestination({ label, count = 0, onClick }: { label: string; count?: number; onClick: () => void }) {
  return <button type="button" className="facebook-home-destination" onClick={onClick}>
    <span className="facebook-home-icon-hold" aria-hidden="true" /><strong>{label}</strong>
    {count > 0 && <span className="facebook-internal-count" aria-label={`${count} unread`}>{count}</span>}
  </button>;
}

function FacebookProfile({ profileName, currentUserName, state, dispatch }: { profileName: string; currentUserName: string; state: FacebookState; dispatch: Dispatch<FacebookEvent> }) {
  const isCurrentUser = profileName === currentUserName;
  const isFriend = state.friends.some(friend => friend.name === profileName);
  const wallItems = state.feed.filter(item => item.author === profileName);
  return <section className="facebook-profile" aria-label={`${profileName} Profile`}>
    <header className="facebook-profile-header"><span className="facebook-profile-photo-hold" aria-hidden="true" /><div><strong>{profileName}</strong>{!isCurrentUser && isFriend && <span>Friend</span>}</div></header>
    <nav className="facebook-profile-sections" aria-label="Profile sections">
      {(["wall", "info", "photos", "friends"] as const).map(section => <button key={section} type="button" aria-current={state.profileSection === section ? "page" : undefined} onClick={() => dispatch({ type: "SET_PROFILE_SECTION", section })}>{section[0].toUpperCase() + section.slice(1)}</button>)}
    </nav>
    {state.profileSection === "wall" && <div className="facebook-profile-wall">
      {wallItems.map(item => <button key={item.id} type="button" onClick={() => dispatch({ type: "OPEN_FEED_ITEM", itemId: item.id, scrollPosition: state.scrollPosition })}><span>{item.text}</span><time>{item.timestamp}</time></button>)}
    </div>}
    {state.profileSection === "info" && <div className="facebook-profile-empty" data-provenance-status="HOLD" aria-label="Profile Info unavailable" />}
    {state.profileSection === "photos" && <div className="facebook-profile-empty" data-provenance-status="HOLD" aria-label="Profile Photos unavailable" />}
    {state.profileSection === "friends" && <div className="facebook-friend-list" aria-label={`${profileName} Friends`}>
      {isCurrentUser && state.friends.map(friend => <button key={friend.id} type="button" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: friend.name })}><strong>{friend.name}</strong></button>)}
    </div>}
  </section>;
}

function FeedRow({ item, liked, onOpenProfile, onOpen, onToggleLike, onComment }: { item: FacebookFeedItem; liked: boolean; onOpenProfile: () => void; onOpen: () => void; onToggleLike: () => void; onComment: () => void }) {
  return <article className="facebook-feed-row" data-content-status={item.contentStatus}>
    <button type="button" className="facebook-avatar-link" aria-label={`${item.author} Profile`} onClick={onOpenProfile}><span className="facebook-avatar-hold" aria-hidden="true" /></button>
    <span className="facebook-feed-copy">
      <button type="button" className="facebook-author-link" onClick={onOpenProfile}>{item.author}</button>
      <button type="button" className="facebook-story-link" onClick={onOpen}>{item.text}</button>
      <time>{item.timestamp}</time>
      <span className="facebook-feed-actions"><button type="button" aria-pressed={liked} onClick={onToggleLike}>{liked ? "Unlike" : "Like"}</button><button type="button" onClick={onComment}>Comment</button></span>
    </span>
  </article>;
}

function viewTitle(view: FacebookState["currentView"]): string {
  switch (view) {
    case "home": return "facebook";
    case "feed": return "News Feed";
    case "feedDetail": return "Post";
    case "profile": return "Profile";
    case "friends": return "Friends";
    case "requests": return "Requests";
    case "inbox": return "Inbox";
    case "messageDetail": return "Message";
  }
}
