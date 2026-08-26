import { Dispatch, useLayoutEffect, useRef } from "react";
import {
  FACEBOOK_CHAT_ROSTER,
  FACEBOOK_FRIEND_CHECK_INS,
  FACEBOOK_PLACE_OPTIONS,
  FacebookEvent,
  FacebookFeedItem,
  FacebookState,
  selectFacebookInboxUnreadCount,
  selectFacebookNotifications,
  selectFacebookNotificationUnreadCount,
  selectFacebookPeopleSearchResults,
  selectFacebookRequestCount,
} from "../state/facebookState";
import { useSessionIdentity } from "../state/sessionIdentity";
import { getFacebookAuthorEasterEggByDisplayName } from "../data/facebookActors";
import { FACEBOOK_MEDIA_IDS, getFacebookMedia } from "../data/facebookMedia";

type FacebookContainerProps = { state: FacebookState; dispatch: Dispatch<FacebookEvent>; currentDeviceTime: string };

export function FacebookContainer({ state, dispatch, currentDeviceTime }: FacebookContainerProps) {
  const sessionIdentity = useSessionIdentity();
  const feedRef = useRef<HTMLDivElement>(null);
  const selectedItem = state.feed.find(item => item.id === state.selectedFeedItemId) ?? null;
  const selectedMessage = state.inboxThreads.find(message => message.id === state.selectedMessageId) ?? null;
  const requestCount = selectFacebookRequestCount(state);
  const inboxUnreadCount = selectFacebookInboxUnreadCount(state);
  const notifications = selectFacebookNotifications(state);
  const notificationUnreadCount = selectFacebookNotificationUnreadCount(state);
  const selectedProfileName = state.selectedProfileName ?? sessionIdentity.name;
  const selectedPhoto = state.selectedPhotoMediaId ? getFacebookMedia(state.selectedPhotoMediaId) : null;

  useLayoutEffect(() => {
    if (state.currentView !== "feed" || !feedRef.current) return;
    feedRef.current.scrollTop = state.scrollPosition;
  }, [state.currentView, state.scrollPosition]);

  return <section className="facebook-container" aria-label="Facebook" data-chrome-status="HOLD">
    <FacebookNavigationHeader state={state} displayName={sessionIdentity.name} dispatch={dispatch} />

    {state.currentView === "home" && <FacebookHome state={state} displayName={sessionIdentity.name} requestCount={requestCount} inboxUnreadCount={inboxUnreadCount} notificationUnreadCount={notificationUnreadCount} dispatch={dispatch} />}

    {state.currentView === "feed" && <>
      <nav className="facebook-feed-composer-strip" aria-label="Create">
        <button type="button" disabled data-provenance-status="HOLD">Photo</button>
        <button type="button" aria-expanded={state.statusComposerOpen} onClick={() => dispatch({ type: "OPEN_STATUS_COMPOSER" })}>Status</button>
        <button type="button" onClick={() => dispatch({ type: "SHOW_PLACES" })}>Check In</button>
      </nav>
      {state.statusComposerOpen && <form className="facebook-status-composer" onSubmit={event => {
        event.preventDefault();
        dispatch({ type: "SUBMIT_STATUS", displayName: sessionIdentity.name, timestamp: currentDeviceTime });
      }}>
        <textarea aria-label="Status" autoFocus value={state.statusDraft} onChange={event => dispatch({ type: "EDIT_STATUS", value: event.currentTarget.value })} />
        <div><button type="button" onClick={() => dispatch({ type: "CANCEL_STATUS" })}>Cancel</button><button type="submit" disabled={!state.statusDraft.trim()}>Share</button></div>
      </form>}
      <div ref={feedRef} className="facebook-feed" onScroll={event => dispatch({ type: "SET_SCROLL_POSITION", scrollPosition: event.currentTarget.scrollTop })}>
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
      </div>
    </>}

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

    {state.currentView === "friends" && <FacebookFriends state={state} requestCount={requestCount} dispatch={dispatch} />}

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

    {state.currentView === "events" && <FacebookEvents state={state} dispatch={dispatch} />}
    {state.currentView === "eventDetail" && <FacebookPartyEvent state={state} dispatch={dispatch} />}
    {state.currentView === "places" && <FacebookPlaces state={state} displayName={sessionIdentity.name} currentDeviceTime={currentDeviceTime} dispatch={dispatch} />}
    {state.currentView === "photos" && <FacebookPhotos dispatch={dispatch} />}
    {state.currentView === "photoDetail" && selectedPhoto && <article className="facebook-photo-viewer">
      <img src={selectedPhoto.src} alt="Z.tokyo profile" />
      <strong>Z.tokyo</strong>
      <span>Profile Pictures</span>
    </article>}
    {state.currentView === "chat" && <div className="facebook-chat-roster" aria-label="Facebook Chat">
      {FACEBOOK_CHAT_ROSTER.map(person => <button key={person.characterId} type="button" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: person.displayName })}>
        <span className={`facebook-presence is-${person.presence}`} aria-label={person.presence} /><strong>{person.displayName}</strong><small>{person.presence}</small>
      </button>)}
    </div>}
    {state.currentView === "notifications" && <div className="facebook-notification-list" aria-label="Notifications">
      {notifications.length === 0 && <p>No new notifications.</p>}
      {notifications.map(notification => <button key={notification.id} type="button" className={notification.unread ? "is-unread" : undefined} onClick={() => dispatch({ type: "OPEN_NOTIFICATION", notificationId: notification.id })}>
        <span>{notification.text}</span>{notification.unread && <i aria-label="Unread" />}
      </button>)}
    </div>}
    {state.currentView === "account" && <section className="facebook-account-shell" data-provenance-status="HOLD">
      <strong>{sessionIdentity.name}</strong>
      <p>Account details are intentionally sparse.</p>
      <button type="button" onClick={() => dispatch({ type: "SHOW_PROFILE", profileName: sessionIdentity.name })}>View Profile</button>
    </section>}
  </section>;
}

function FacebookNavigationHeader({ state, displayName, dispatch }: { state: FacebookState; displayName: string; dispatch: Dispatch<FacebookEvent> }) {
  if (state.currentView === "home") return <header className="facebook-navigation-bar is-home">
    <button type="button" className="facebook-account-control" onClick={() => dispatch({ type: "SHOW_ACCOUNT", profileName: displayName })}>Account</button>
    <strong>facebook</strong>
    <button type="button" className="facebook-shortcut-control" disabled aria-label="Shortcut customization HOLD">+</button>
  </header>;
  const nested = state.navigationStack.length > 2;
  return <header className="facebook-navigation-bar">
    <button type="button" className="facebook-back-control" onClick={() => dispatch(nested ? { type: "GO_BACK" } : { type: "SHOW_HOME" })}>{nested ? "Back" : "Home"}</button>
    <strong>{state.currentView === "feed" || state.currentView === "friends" ? "facebook" : viewTitle(state.currentView)}</strong>
    {state.currentView === "feed" && <span className="facebook-navigation-context">Live Feed</span>}
    {state.currentView === "friends" && <button type="button" className="facebook-navigation-context" disabled data-provenance-status="HOLD">Sync</button>}
  </header>;
}

function FacebookHome({ state, displayName, requestCount, inboxUnreadCount, notificationUnreadCount, dispatch }: { state: FacebookState; displayName: string; requestCount: number; inboxUnreadCount: number; notificationUnreadCount: number; dispatch: Dispatch<FacebookEvent> }) {
  const searchResults = selectFacebookPeopleSearchResults(state.homeSearchQuery);
  return <div className="facebook-home" aria-label="Facebook Home" data-layout-evidence="PERIOD-EVIDENCE">
    <label className="facebook-home-search"><span className="facebook-search-glyph" aria-hidden="true" />
      <input aria-label="Search Facebook people" placeholder="Search" value={state.homeSearchQuery} onChange={event => dispatch({ type: "EDIT_HOME_SEARCH", value: event.currentTarget.value })} />
    </label>
    {state.homeSearchQuery.trim() ? <div className="facebook-people-search-results">
      {searchResults.length === 0 && <p>No people found.</p>}
      {searchResults.map(result => <button key={result.kind === "canonical" ? result.characterId : result.authorId} type="button" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: result.displayName })}>{result.displayName}</button>)}
    </div> : state.homeLauncherPage === 0 ? <div className="facebook-home-grid">
      <HomeDestination iconLabel="NF" label="News Feed" onClick={() => dispatch({ type: "SHOW_FEED" })} />
      <HomeDestination iconLabel="PR" label="Profile" onClick={() => dispatch({ type: "SHOW_PROFILE", profileName: displayName })} />
      <HomeDestination iconLabel="FR" label="Friends" onClick={() => dispatch({ type: "SHOW_FRIENDS" })} />
      <HomeDestination iconLabel="MS" label="Messages" count={inboxUnreadCount} onClick={() => dispatch({ type: "SHOW_INBOX" })} />
      <HomeDestination iconLabel="PL" label="Places" onClick={() => dispatch({ type: "SHOW_PLACES" })} />
      <span className="facebook-home-empty-slot" data-provenance-status="REJECTED-FOR-TARGET-DATE" aria-label="Empty launcher position" />
      <HomeDestination iconLabel="EV" label="Events" onClick={() => dispatch({ type: "SHOW_EVENTS" })} />
      <HomeDestination iconLabel="PH" label="Photos" onClick={() => dispatch({ type: "SHOW_PHOTOS" })} />
      <HomeDestination iconLabel="CH" label="Chat" onClick={() => dispatch({ type: "SHOW_CHAT" })} />
    </div> : <div className="facebook-home-secondary-page" data-provenance-status="HOLD"><p>No shortcuts added.</p></div>}
    <nav className="facebook-home-page-dots" aria-label="Launcher pages">
      <button type="button" aria-current={state.homeLauncherPage === 0 ? "page" : undefined} aria-label="Launcher page 1" onClick={() => dispatch({ type: "SET_HOME_LAUNCHER_PAGE", page: 0 })} />
      <button type="button" aria-current={state.homeLauncherPage === 1 ? "page" : undefined} aria-label="Launcher page 2" onClick={() => dispatch({ type: "SET_HOME_LAUNCHER_PAGE", page: 1 })} />
    </nav>
    <button type="button" className="facebook-home-notifications" onClick={() => dispatch({ type: "SHOW_NOTIFICATIONS" })}><span>Notifications</span>{notificationUnreadCount > 0 && <b>{notificationUnreadCount}</b>}</button>
  </div>;
}

function HomeDestination({ iconLabel, label, count = 0, onClick }: { iconLabel: string; label: string; count?: number; onClick: () => void }) {
  return <button type="button" className="facebook-home-destination" onClick={onClick}>
    <span className="facebook-home-icon-hold" aria-hidden="true">{iconLabel}</span><strong>{label}</strong>
    {count > 0 && <span className="facebook-internal-count" aria-label={`${count} unread`}>{count}</span>}
  </button>;
}

function FacebookFriends({ state, requestCount, dispatch }: { state: FacebookState; requestCount: number; dispatch: Dispatch<FacebookEvent> }) {
  const normalizedQuery = state.friendSearchQuery.trim().toLowerCase();
  const visibleFriends = state.friends
    .filter(friend => !normalizedQuery || friend.name.toLowerCase().includes(normalizedQuery))
    .sort((left, right) => left.name.localeCompare(right.name));
  return <section className="facebook-friends-screen">
    <label className="facebook-friends-search"><input aria-label="Search Friends" placeholder="Search Friends" value={state.friendSearchQuery} onChange={event => dispatch({ type: "EDIT_FRIEND_SEARCH", value: event.currentTarget.value })} /></label>
    <div className="facebook-friends-content">
      {state.friendsSection === "friends" && <div className="facebook-friend-list" aria-label="Friends">
        {visibleFriends.map(friend => <button key={friend.id} type="button" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: friend.name })}><span className="facebook-avatar-hold" aria-hidden="true" /><strong>{friend.name}</strong></button>)}
        <span className="facebook-alphabet-index" aria-hidden="true">A B C J K L M</span>
      </div>}
      {state.friendsSection === "pages" && <div className="facebook-empty-list" data-provenance-status="HOLD">No Pages.</div>}
      {state.friendsSection === "requests" && <div className="facebook-request-list">
        {state.friendRequestState !== "pending" && <div className="facebook-empty-list">No pending requests.</div>}
        {state.friendRequestState === "pending" && <section className="facebook-request-row">
          <button type="button" className="facebook-request-person" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: "Jack" })}>Jack</button>
          <div><button type="button" onClick={() => dispatch({ type: "ACCEPT_JACK" })}>Accept</button><button type="button" onClick={() => dispatch({ type: "IGNORE_JACK" })}>Ignore</button></div>
        </section>}
      </div>}
    </div>
    <nav className="facebook-friends-segments" aria-label="Friends sections">
      {(["friends", "pages", "requests"] as const).map(section => <button key={section} type="button" aria-current={state.friendsSection === section ? "page" : undefined} onClick={() => dispatch({ type: "SET_FRIENDS_SECTION", section })}>{section[0].toUpperCase() + section.slice(1)}{section === "requests" && requestCount > 0 ? ` ${requestCount}` : ""}</button>)}
    </nav>
  </section>;
}

function FacebookEvents({ state, dispatch }: { state: FacebookState; dispatch: Dispatch<FacebookEvent> }) {
  const available = state.partyInviteState === "delivered" || state.partyInviteState === "opened" || state.partyInviteState === "dismissed";
  return <div className="facebook-event-list">
    {!available && <p>No upcoming events.</p>}
    {available && <button type="button" onClick={() => dispatch({ type: "OPEN_PARTY_EVENT" })}><strong>Jack's Party</strong><span>Friday</span>{state.partyRsvp && <small>{state.partyRsvp === "yes" ? "Attending" : state.partyRsvp[0].toUpperCase() + state.partyRsvp.slice(1)}</small>}</button>}
  </div>;
}

function FacebookPartyEvent({ state, dispatch }: { state: FacebookState; dispatch: Dispatch<FacebookEvent> }) {
  const alexPost = state.feed.find(item => item.id === "alex-jacks-party-friday");
  return <section className="facebook-event-detail">
    <header><strong>Jack's Party</strong><span>Friday</span><small>Hosted by Jack · Location HOLD</small></header>
    <fieldset><legend>RSVP</legend>{(["yes", "maybe", "no"] as const).map(value => <button key={value} type="button" aria-pressed={state.partyRsvp === value} onClick={() => dispatch({ type: "SET_PARTY_RSVP", value })}>{value === "yes" ? "Yes" : value[0].toUpperCase() + value.slice(1)}</button>)}</fieldset>
    <section className="facebook-event-wall"><h2>Event Wall</h2>{alexPost && <button type="button" onClick={() => dispatch({ type: "OPEN_FEED_ITEM", itemId: alexPost.id, scrollPosition: state.scrollPosition })}><strong>{alexPost.author}</strong><span>{alexPost.text}</span></button>}</section>
  </section>;
}

function FacebookPlaces({ state, displayName, currentDeviceTime, dispatch }: { state: FacebookState; displayName: string; currentDeviceTime: string; dispatch: Dispatch<FacebookEvent> }) {
  return <section className="facebook-places">
    <h2>Recent Check-Ins</h2>
    {FACEBOOK_FRIEND_CHECK_INS.map(checkIn => <article key={checkIn.id}><strong>{checkIn.displayName}</strong><span>{checkIn.venueName}</span></article>)}
    <h2>Check In</h2>
    {FACEBOOK_PLACE_OPTIONS.map(venue => <button key={venue.id} type="button" onClick={() => dispatch({ type: "CHECK_IN", venueId: venue.id, displayName, timestamp: currentDeviceTime })}><span>{venue.name}</span><strong>Check In</strong></button>)}
    {state.userCheckIn && <div className="facebook-checkin-confirmation"><strong>{state.userCheckIn.author}</strong><span>checked in at {state.userCheckIn.venueName} · {state.userCheckIn.timestamp}</span></div>}
  </section>;
}

function FacebookPhotos({ dispatch }: { dispatch: Dispatch<FacebookEvent> }) {
  const media = FACEBOOK_MEDIA_IDS.flatMap(id => {
    const item = getFacebookMedia(id);
    return item?.surfaceStatus.photos === "READY" ? [item] : [];
  });
  return <section className="facebook-photo-albums">
    <h2>Albums</h2>
    {media.map(item => <button key={item.id} type="button" onClick={() => dispatch({ type: "OPEN_PHOTO", mediaId: item.id })}><img src={item.src} alt="" /><span><strong>Profile Pictures</strong><small>Z.tokyo · 1 photo</small></span></button>)}
  </section>;
}

function FacebookProfile({ profileName, currentUserName, state, dispatch }: { profileName: string; currentUserName: string; state: FacebookState; dispatch: Dispatch<FacebookEvent> }) {
  const isCurrentUser = profileName === currentUserName;
  const isFriend = state.friends.some(friend => friend.name === profileName);
  const wallItems = state.feed.filter(item => item.author === profileName);
  const authorIdentity = getFacebookAuthorEasterEggByDisplayName(profileName);
  const profileMedia = authorIdentity ? getFacebookMedia(authorIdentity.profileMediaId) : null;
  return <section className="facebook-profile" aria-label={`${profileName} Profile`}>
    <header className="facebook-profile-header">{profileMedia
      ? <img className="facebook-profile-photo" src={profileMedia.src} alt={`${profileName} profile`} />
      : <span className="facebook-profile-photo-hold" aria-hidden="true" />}<div><strong>{profileName}</strong>{!isCurrentUser && isFriend && <span>Friend</span>}</div></header>
    <nav className="facebook-profile-sections" aria-label="Profile sections">
      {(["wall", "info", "photos", "friends"] as const).map(section => <button key={section} type="button" aria-current={state.profileSection === section ? "page" : undefined} onClick={() => dispatch({ type: "SET_PROFILE_SECTION", section })}>{section[0].toUpperCase() + section.slice(1)}</button>)}
    </nav>
    {state.profileSection === "wall" && <div className="facebook-profile-wall">
      {wallItems.map(item => <button key={item.id} type="button" onClick={() => dispatch({ type: "OPEN_FEED_ITEM", itemId: item.id, scrollPosition: state.scrollPosition })}><span>{item.text}</span><time>{item.timestamp}</time></button>)}
    </div>}
    {state.profileSection === "info" && <div className="facebook-profile-empty" data-provenance-status="HOLD" aria-label="Profile Info unavailable" />}
    {state.profileSection === "photos" && (profileMedia?.surfaceStatus.photos === "READY"
      ? <button type="button" className="facebook-profile-photo-entry" onClick={() => dispatch({ type: "OPEN_PHOTO", mediaId: profileMedia.id })}><img src={profileMedia.src} alt="" /><span>Profile Pictures</span></button>
      : <div className="facebook-profile-empty" data-provenance-status="HOLD" aria-label="Profile Photos unavailable" />)}
    {state.profileSection === "friends" && <div className="facebook-friend-list" aria-label={`${profileName} Friends`}>
      {isCurrentUser && state.friends.map(friend => <button key={friend.id} type="button" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: friend.name })}><strong>{friend.name}</strong></button>)}
    </div>}
  </section>;
}

function FeedRow({ item, liked, onOpenProfile, onOpen, onToggleLike, onComment }: { item: FacebookFeedItem; liked: boolean; onOpenProfile: () => void; onOpen: () => void; onToggleLike: () => void; onComment: () => void }) {
  const media = getFacebookMedia(item.mediaId);
  return <article className="facebook-feed-row" data-content-status={item.contentStatus}>
    <button type="button" className="facebook-avatar-link" aria-label={`${item.author} Profile`} onClick={onOpenProfile}>{media
      ? <img className="facebook-avatar-image" src={media.src} alt="" aria-hidden="true" />
      : <span className="facebook-avatar-hold" aria-hidden="true" />}</button>
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
    case "inbox": return "Messages";
    case "messageDetail": return "Message";
    case "events": return "Events";
    case "eventDetail": return "Event";
    case "places": return "Places";
    case "photos": return "Photos";
    case "photoDetail": return "Photo";
    case "chat": return "Chat";
    case "notifications": return "Notifications";
    case "account": return "Account";
  }
}
