import { Dispatch, useLayoutEffect, useRef, type ReactNode } from "react";
import {
  FACEBOOK_CHAT_ROSTER,
  FACEBOOK_FRIEND_CHECK_INS,
  FACEBOOK_PLACE_OPTIONS,
  FacebookEvent,
  FacebookFeedItem,
  FacebookState,
  selectFacebookInboxUnreadCount,
  selectFacebookComments,
  selectFacebookLikes,
  selectFacebookNotifications,
  selectFacebookNotificationUnreadCount,
  selectFacebookPeopleSearchResults,
  selectFacebookRequestCount,
  selectFacebookThreadMessages,
  resolveFacebookCommentActor,
  selectFacebookVisibleFeed,
  formatFacebookCommentCount,
  formatFacebookLikeCount,
} from "../state/facebookState";
import { useSessionIdentity } from "../state/sessionIdentity";
import { getFacebookAuthorEasterEggByDisplayName } from "../data/facebookActors";
import { getFacebookMedia } from "../data/facebookMedia";
import { CORE_SOCIAL_CHARACTERS } from "../data/coreSocialFriends";
import { getFacebookAlbum, getFacebookAlbumByStoryId, getFacebookAlbumPhoto, getFacebookAlbumsForActor } from "../data/facebookAlbums";
import type { FacebookAlbum, FacebookAlbumActor } from "../data/facebookAlbums";
import { getFacebookStoryMedia } from "../data/facebookStoryMedia";

type FacebookContainerProps = { state: FacebookState; dispatch: Dispatch<FacebookEvent>; currentDeviceTime: string; elapsedMs: number };

export function FacebookContainer({ state, dispatch, currentDeviceTime, elapsedMs }: FacebookContainerProps) {
  const sessionIdentity = useSessionIdentity();
  const feedRef = useRef<HTMLDivElement>(null);
  const selectedItem = state.feed.find(item => item.id === state.selectedFeedItemId) ?? null;
  const selectedMessage = state.inboxThreads.find(message => message.id === state.selectedMessageId) ?? null;
  const selectedThreadMessages = selectedMessage ? selectFacebookThreadMessages(state, selectedMessage.id) : [];
  const requestCount = selectFacebookRequestCount(state);
  const inboxUnreadCount = selectFacebookInboxUnreadCount(state);
  const notifications = selectFacebookNotifications(state);
  const notificationUnreadCount = selectFacebookNotificationUnreadCount(state);
  const selectedProfileName = state.selectedProfileName ?? sessionIdentity.name;
  const selectedAlbum = state.selectedAlbumId ? getFacebookAlbum(state.selectedAlbumId) : null;
  const selectedPhoto = state.selectedPhotoMediaId ? getFacebookStoryMedia(state.selectedPhotoMediaId) : null;
  const visibleFeed = selectFacebookVisibleFeed(state);
  const elapsedSeconds = Math.floor(elapsedMs / 1_000);

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
        {visibleFeed.map(item => <FeedRow
          key={item.id}
          item={item}
          liked={state.likedItemIds.includes(item.id)}
          onOpenProfile={() => dispatch({ type: "OPEN_PROFILE", profileName: item.author })}
          onOpen={() => dispatch({ type: "OPEN_FEED_ITEM", itemId: item.id, scrollPosition: feedRef.current?.scrollTop ?? state.scrollPosition })}
          commentCount={selectFacebookComments(state, item.id).length}
          likeCount={selectFacebookLikes(state, item.id, elapsedSeconds).length}
          onToggleLike={() => dispatch({ type: "TOGGLE_LIKE", itemId: item.id, displayName: sessionIdentity.name })}
          onComment={() => {
            dispatch({ type: "OPEN_FEED_ITEM", itemId: item.id, scrollPosition: feedRef.current?.scrollTop ?? state.scrollPosition });
            dispatch({ type: "BEGIN_COMMENT", itemId: item.id });
          }}
          dispatch={dispatch}
        />)}
      </div>
    </>}

    {state.currentView === "feedDetail" && selectedItem && <article className="facebook-feed-detail" data-content-status={selectedItem.contentStatus}>
      <button type="button" className="facebook-author-link" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: selectedItem.author })}>{selectedItem.author}</button>
      <p><FacebookInlineEntityText text={selectedItem.text} mentions={selectedItem.mentions} dispatch={dispatch} /></p>
      <FacebookStoryMedia item={selectedItem} dispatch={dispatch} />
      <time>October 20, 2010 · {selectedItem.timestamp}</time>
      <FacebookStoryCounts commentCount={selectFacebookComments(state, selectedItem.id).length} likeCount={selectFacebookLikes(state, selectedItem.id, elapsedSeconds).length} />
      <div className="facebook-detail-actions">
        <button type="button" aria-pressed={state.likedItemIds.includes(selectedItem.id)} onClick={() => dispatch({ type: "TOGGLE_LIKE", itemId: selectedItem.id, displayName: sessionIdentity.name })}>{state.likedItemIds.includes(selectedItem.id) ? "Unlike" : "Like"}</button>
        <button type="button" aria-expanded={state.commentComposerItemId === selectedItem.id} onClick={() => dispatch({ type: "BEGIN_COMMENT", itemId: selectedItem.id })}>Comment</button>
      </div>
      {state.comments.filter(comment => comment.itemId === selectedItem.id).map(comment => <FacebookCommentRow key={comment.id} comment={comment} sessionUserName={sessionIdentity.name} dispatch={dispatch} />)}
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
      <strong>{selectedMessage.sender}</strong>
      <div className="facebook-message-history" aria-label={`${selectedMessage.sender} message history`}>
        {selectedThreadMessages.map(message => <section className={`facebook-message-reply is-${message.authorType}`} key={message.id}>
          <strong>{message.author}</strong><p>{message.body}</p><time>{message.timestamp}</time>
        </section>)}
      </div>
      <form className="facebook-message-composer" onSubmit={event => { event.preventDefault(); dispatch({ type: "SUBMIT_MESSAGE_REPLY", displayName: sessionIdentity.name, timestamp: currentDeviceTime }); }}>
        <textarea aria-label={`Reply to ${selectedMessage.sender}`} value={state.messageReplyDraft} onChange={event => dispatch({ type: "EDIT_MESSAGE_REPLY", value: event.currentTarget.value })} />
        <button type="submit" disabled={!state.messageReplyDraft.trim()}>Send</button>
      </form>
    </article>}

    {state.currentView === "events" && <FacebookEvents state={state} dispatch={dispatch} />}
    {state.currentView === "eventDetail" && <FacebookPartyEvent state={state} dispatch={dispatch} />}
    {state.currentView === "places" && <FacebookPlaces state={state} displayName={sessionIdentity.name} currentDeviceTime={currentDeviceTime} dispatch={dispatch} />}
    {state.currentView === "photos" && <FacebookPhotos currentUserName={sessionIdentity.name} dispatch={dispatch} />}
    {state.currentView === "album" && selectedAlbum && <FacebookAlbumGallery album={selectedAlbum} dispatch={dispatch} />}
    {state.currentView === "photoDetail" && selectedAlbum && selectedPhoto && <FacebookPhotoDetail album={selectedAlbum} media={selectedPhoto} state={state} currentUserName={sessionIdentity.name} elapsedSeconds={elapsedSeconds} dispatch={dispatch} />}
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

function FacebookPhotos({ currentUserName, dispatch }: { currentUserName: string; dispatch: Dispatch<FacebookEvent> }) {
  return <FacebookAlbumList actor={{ kind: "session-user", displayName: currentUserName }} dispatch={dispatch} />;
}

function FacebookAlbumList({ actor, dispatch }: { actor: FacebookAlbumActor | null; dispatch: Dispatch<FacebookEvent> }) {
  const albums = getFacebookAlbumsForActor(actor);
  return <section className="facebook-photo-albums">
    <h2>Albums</h2>
    {albums.length === 0 && <p className="facebook-empty-list">No photos.</p>}
    {albums.map(album => {
      const cover = getFacebookStoryMedia(album.photos[0].mediaId);
      return <button key={album.id} type="button" onClick={() => dispatch({ type: "OPEN_ALBUM", albumId: album.id })}>{cover && <img src={cover.src} alt="" />}<span><strong>{album.title}</strong><small>{album.mediaIds.length} photo{album.mediaIds.length === 1 ? "" : "s"}</small></span></button>;
    })}
  </section>;
}

function FacebookAlbumGallery({ album, dispatch }: { album: FacebookAlbum; dispatch: Dispatch<FacebookEvent> }) {
  return <section className="facebook-album-gallery" aria-label={`${album.title} album`}>
    <header><strong>{album.title}</strong><span>{album.ownerActor.displayName} · {album.photos.length} photo{album.photos.length === 1 ? "" : "s"}</span></header>
    <div>{album.photos.map(photo => {
      const media = getFacebookStoryMedia(photo.mediaId);
      return media ? <button key={photo.mediaId} type="button" onClick={() => dispatch({ type: "OPEN_ALBUM_PHOTO", albumId: album.id, mediaId: photo.mediaId })}><img src={media.src} alt={`${album.ownerActor.displayName} photo`} /></button> : null;
    })}</div>
  </section>;
}

function FacebookPhotoDetail({ album, media, state, currentUserName, elapsedSeconds, dispatch }: { album: FacebookAlbum; media: NonNullable<ReturnType<typeof getFacebookStoryMedia>>; state: FacebookState; currentUserName: string; elapsedSeconds: number; dispatch: Dispatch<FacebookEvent> }) {
  const photo = getFacebookAlbumPhoto(album, media.id);
  if (!photo) return null;
  const story = state.feed.find(item => item.id === photo.storyId);
  const comments = selectFacebookComments(state, photo.storyId);
  const likes = selectFacebookLikes(state, photo.storyId, elapsedSeconds);
  return <article className="facebook-photo-viewer">
    <img src={media.src} alt={`${album.ownerActor.displayName} photo`} />
    <strong>{album.ownerActor.displayName}</strong>
    <span>{album.title} · {new Date(photo.timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" })}</span>
    {photo.caption && <p><FacebookInlineEntityText text={photo.caption} mentions={story?.mentions} dispatch={dispatch} /></p>}
    <FacebookStoryCounts commentCount={comments.length} likeCount={likes.length} />
    <div className="facebook-detail-actions">
      <button type="button" aria-pressed={state.likedItemIds.includes(photo.storyId)} onClick={() => dispatch({ type: "TOGGLE_LIKE", itemId: photo.storyId, displayName: currentUserName })}>{state.likedItemIds.includes(photo.storyId) ? "Unlike" : "Like"}</button>
      <button type="button" aria-expanded={state.commentComposerItemId === photo.storyId} onClick={() => dispatch({ type: "BEGIN_COMMENT", itemId: photo.storyId })}>Comment</button>
    </div>
    {comments.map(comment => <FacebookCommentRow key={comment.id} comment={comment} sessionUserName={currentUserName} dispatch={dispatch} />)}
    {state.commentComposerItemId === photo.storyId && <form className="facebook-comment-composer" onSubmit={event => { event.preventDefault(); dispatch({ type: "SUBMIT_COMMENT", displayName: currentUserName }); }}>
      <textarea aria-label="Comment" value={state.commentDraft} onChange={event => dispatch({ type: "EDIT_COMMENT", value: event.currentTarget.value })} />
      <div><button type="button" onClick={() => dispatch({ type: "CANCEL_COMMENT" })}>Cancel</button><button type="submit" disabled={!state.commentDraft.trim()}>Post</button></div>
    </form>}
  </article>;
}

function FacebookProfile({ profileName, currentUserName, state, dispatch }: { profileName: string; currentUserName: string; state: FacebookState; dispatch: Dispatch<FacebookEvent> }) {
  const isCurrentUser = profileName === currentUserName;
  const isFriend = state.friends.some(friend => friend.name === profileName);
  const wallItems = selectFacebookVisibleFeed(state).filter(item => item.author === profileName);
  const authorIdentity = getFacebookAuthorEasterEggByDisplayName(profileName);
  const profileMedia = authorIdentity ? getFacebookMedia(authorIdentity.profileMediaId) : null;
  const canonicalCharacter = Object.values(CORE_SOCIAL_CHARACTERS).find(character => character.displayName === profileName);
  const albumActor: FacebookAlbumActor | null = state.selectedProfileActor
    ?? (isCurrentUser
      ? { kind: "session-user", displayName: profileName }
      : authorIdentity
        ? { kind: "author-easter-egg", authorId: authorIdentity.id, displayName: authorIdentity.displayName }
        : canonicalCharacter
          ? { kind: "canonical", characterId: canonicalCharacter.id, displayName: canonicalCharacter.displayName }
          : null);
  return <section className="facebook-profile" aria-label={`${profileName} Profile`} data-identity-kind={state.selectedProfileActor?.kind ?? "name-route"}>
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
    {state.profileSection === "photos" && <FacebookAlbumList actor={albumActor} dispatch={dispatch} />}
    {state.profileSection === "friends" && <div className="facebook-friend-list" aria-label={`${profileName} Friends`}>
      {isCurrentUser && state.friends.map(friend => <button key={friend.id} type="button" onClick={() => dispatch({ type: "OPEN_PROFILE", profileName: friend.name })}><strong>{friend.name}</strong></button>)}
    </div>}
  </section>;
}

function FacebookCommentRow({ comment, sessionUserName, dispatch }: { comment: FacebookState["comments"][number]; sessionUserName: string; dispatch: Dispatch<FacebookEvent> }) {
  const actor = resolveFacebookCommentActor(comment, sessionUserName);
  return <article className="facebook-comment">
    {actor
      ? <button type="button" className="facebook-comment-author" onClick={() => dispatch({ type: "OPEN_COMMENT_AUTHOR", actor })}>{actor.displayName}</button>
      : <strong>{comment.author}</strong>}
    <span>{comment.text}</span>
  </article>;
}

function FeedRow({ item, liked, commentCount, likeCount, onOpenProfile, onOpen, onToggleLike, onComment, dispatch }: { item: FacebookFeedItem; liked: boolean; commentCount: number; likeCount: number; onOpenProfile: () => void; onOpen: () => void; onToggleLike: () => void; onComment: () => void; dispatch: Dispatch<FacebookEvent> }) {
  const avatarMedia = item.actor?.kind === "author-easter-egg" && item.mediaId ? getFacebookStoryMedia(item.mediaId) : null;
  return <article className="facebook-feed-row" data-content-status={item.contentStatus}>
    <button type="button" className="facebook-avatar-link" aria-label={`${item.author} Profile`} onClick={onOpenProfile}>{avatarMedia
      ? <img className="facebook-avatar-image" src={avatarMedia.src} alt="" aria-hidden="true" />
      : <span className="facebook-avatar-hold" aria-hidden="true" />}</button>
    <span className="facebook-feed-copy">
      <button type="button" className="facebook-author-link" onClick={onOpenProfile}>{item.author}</button>
      <span className="facebook-story-link" role="button" tabIndex={0} onClick={onOpen} onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) onOpen(); }}><FacebookInlineEntityText text={item.text} mentions={item.mentions} dispatch={dispatch} /></span>
      <FacebookStoryMedia item={item} dispatch={dispatch} />
      <time>{item.timestamp}</time>
      <FacebookStoryCounts commentCount={commentCount} likeCount={likeCount} />
      <span className="facebook-feed-actions"><button type="button" aria-pressed={liked} onClick={onToggleLike}>{liked ? "Unlike" : "Like"}</button><button type="button" onClick={onComment}>Comment</button></span>
    </span>
  </article>;
}

function FacebookStoryMedia({ item, dispatch }: { item: FacebookFeedItem; dispatch: Dispatch<FacebookEvent> }) {
  const mediaIds = item.mediaIds ?? (item.mediaId ? [item.mediaId] : []);
  const media = mediaIds.flatMap(mediaId => {
    const record = getFacebookStoryMedia(mediaId);
    return record ? [record] : [];
  });
  if (media.length === 0) return null;
  const album = getFacebookAlbumByStoryId(item.id);
  return <button type="button" disabled={!album} onClick={() => album && dispatch(item.kind === "album" ? { type: "OPEN_ALBUM", albumId: album.id } : { type: "OPEN_ALBUM_PHOTO", albumId: album.id, mediaId: mediaIds[0] })} className={item.kind === "album" ? "facebook-story-album-media" : "facebook-story-photo-media"} aria-label={item.albumTitle ?? `${item.author} photo`}>
    {media.map(record => <img key={record.id} src={record.src} alt="" />)}
    {item.kind === "album" && item.albumTitle && <span>{item.albumTitle}{item.photoCount ? ` · ${item.photoCount} photos` : ""}</span>}
  </button>;
}

function FacebookInlineEntityText({ text, mentions, dispatch }: { text: string; mentions?: FacebookFeedItem["mentions"]; dispatch: Dispatch<FacebookEvent> }) {
  if (!mentions?.length) return <>{text}</>;
  const pieces: ReactNode[] = [];
  let cursor = 0;
  mentions.forEach((mention, mentionIndex) => {
    const tokenIndex = text.indexOf(mention.token, cursor);
    if (tokenIndex < 0) return;
    if (tokenIndex > cursor) pieces.push(text.slice(cursor, tokenIndex));
    pieces.push(<button key={`${mention.token}-${mentionIndex}`} type="button" className="facebook-inline-mention" onClick={event => { event.stopPropagation(); dispatch({ type: "OPEN_COMMENT_AUTHOR", actor: mention.actor }); }}>{mention.token}</button>);
    cursor = tokenIndex + mention.token.length;
  });
  if (cursor < text.length) pieces.push(text.slice(cursor));
  return <>{pieces}</>;
}

function FacebookStoryCounts({ commentCount, likeCount }: { commentCount: number; likeCount: number }) {
  const commentLabel = formatFacebookCommentCount(commentCount);
  const likeLabel = formatFacebookLikeCount(likeCount);
  if (!commentLabel && !likeLabel) return null;
  return <span className="facebook-story-counts">{likeLabel && <span>{likeLabel}</span>}{commentLabel && <span>{commentLabel}</span>}</span>;
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
    case "album": return "Album";
    case "photoDetail": return "Photo";
    case "chat": return "Chat";
    case "notifications": return "Notifications";
    case "account": return "Account";
  }
}
