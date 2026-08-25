import { Dispatch, PointerEvent, useLayoutEffect, useRef } from "react";
import {
  selectTwitterFollowingUsers,
  selectTwitterDirectMessagesUnreadCount,
  selectTwitterMentionsUnreadCount,
  selectTwitterUserProfile,
  selectTwitterTimelineActivities,
  TwitterEvent,
  TwitterState,
  TwitterTab,
  TwitterTweet,
  TwitterSuggestedUser,
  twitterReplyHandle,
  TwitterUserProfile,
} from "../state/twitterState";
import { useSessionIdentity } from "../state/sessionIdentity";
import { SESSION_START_ISO } from "../state/deviceMachine";

type TwitterContainerProps = {
  state: TwitterState;
  dispatch: Dispatch<TwitterEvent>;
  currentDeviceDateTime: Date;
  currentDeviceTime: string;
};

export function TwitterContainer({ state, dispatch, currentDeviceDateTime, currentDeviceTime }: TwitterContainerProps) {
  const sessionIdentity = useSessionIdentity();
  const timelineRef = useRef<HTMLDivElement>(null);
  const selectedTweet = [...state.timeline, ...state.mentionTweets, ...state.linkedTweets].find(tweet => tweet.id === state.selectedTweetId) ?? null;
  const composerTarget = [...state.timeline, ...state.mentionTweets, ...state.linkedTweets].find(tweet => tweet.id === state.replyComposerTweetId) ?? null;
  const composerHandle = composerTarget ? (composerTarget.authorHandle || twitterReplyHandle(composerTarget.displayName)) : null;
  const composerValue = state.composerKind === "new" ? state.newTweetDraft : state.replyDraft;
  const composerCanSend = state.composerKind === "new"
    ? composerValue.trim().length > 0
    : state.composerKind === "reply" && Boolean(composerHandle) && composerValue.trim() !== composerHandle;
  const timelineActivities = selectTwitterTimelineActivities(state);
  const suggestedPeople = state.suggestedUsers.map(user => ({
    ...user,
    following: state.followedUserIds.includes(user.id),
  }));
  const followingPeople = selectTwitterFollowingUsers(state, sessionIdentity.name).map(user => ({
    ...user,
    following: true,
  }));
  const simulatedSecond = Math.max(0, Math.floor((currentDeviceDateTime.getTime() - Date.parse(SESSION_START_ISO)) / 1000));
  const selectedProfile: TwitterUserProfile = selectTwitterUserProfile(
    state,
    state.selectedUserId || "session-owner",
    sessionIdentity.name,
    simulatedSecond,
  );

  useLayoutEffect(() => {
    if (state.activeTab !== "timeline" || state.currentView !== "timeline" || !timelineRef.current) return;
    timelineRef.current.scrollTop = state.scrollPosition;
  }, [state.activeTab, state.currentView, state.scrollPosition]);

  const toggleRetweet = (tweetId: string) => dispatch({
    type: "TOGGLE_RETWEET",
    tweetId,
    retweetedBy: sessionIdentity.name,
    retweetActionTimestamp: currentDeviceDateTime.getTime(),
  });

  return <section className="twitter-container" aria-label="Twitter" data-chrome-status="HOLD">
    <header className="twitter-navigation-bar">
      {state.activeTab === "timeline" && state.currentView === "timeline" && <>
        <button type="button" className="twitter-account-button" onClick={() => dispatch({ type: "SHOW_TAB", tab: "more" })}>Accounts</button>
        <strong>{sessionIdentity.name || "Tweets"}</strong>
        <button type="button" className="twitter-compose-button" onClick={() => dispatch({ type: "BEGIN_NEW_TWEET" })}>Compose</button>
      </>}
      {state.activeTab === "timeline" && state.currentView === "tweetDetail" && <>
        <button type="button" className="twitter-back-button" onClick={() => dispatch({ type: "BACK_TO_TIMELINE" })}>Tweets</button>
        <strong>Tweet</strong>
      </>}
      {(state.activeTab === "mentions" || state.activeTab === "messages") && state.currentView === "tweetDetail" && <>
        <button type="button" className="twitter-back-button" onClick={() => dispatch({ type: "BACK_TO_TIMELINE" })}>Back</button><strong>Tweet</strong>
      </>}
      {state.activeTab === "messages" && state.currentView === "dmThread" && <>
        <button type="button" className="twitter-back-button" onClick={() => dispatch({ type: "BACK_TO_MESSAGES" })}>Messages</button>
        <strong>{state.directMessages.find(thread => thread.id === state.selectedDirectMessageId)?.sender ?? "Message"}</strong>
      </>}
      {state.activeTab === "timeline" && state.currentView === "userProfile" && <>
        <button type="button" className="twitter-back-button" onClick={() => dispatch({ type: "BACK_FROM_PROFILE" })}>Back</button>
        <strong>Profile</strong>
      </>}
      {state.activeTab === "search" && state.currentView === "searchLanding" && <strong>Search</strong>}
      {state.activeTab === "search" && (state.currentView === "suggestedUsers" || state.currentView === "following") && <>
        <button type="button" className="twitter-back-button" onClick={() => dispatch({ type: "BACK_TO_SEARCH" })}>Search</button>
        <strong>{state.currentView === "following" ? "Following" : "Suggested Users"}</strong>
      </>}
      {state.activeTab === "search" && state.currentView === "userProfile" && <>
        <button type="button" className="twitter-back-button" onClick={() => dispatch({ type: "BACK_FROM_PROFILE" })}>Back</button>
        <strong>Profile</strong>
      </>}
      {state.activeTab === "timeline" && state.currentView === "composer" && <>
        <button type="button" className="twitter-close-button" onClick={() => dispatch({ type: "CANCEL_REPLY" })}>Close</button>
        <strong>New Tweet</strong>
        <button type="submit" form="twitter-composer-form" className="twitter-send-button" disabled={!composerCanSend}>Send</button>
      </>}
      {state.activeTab !== "timeline" && state.activeTab !== "search" && <strong>{tabTitle(state.activeTab)}</strong>}
    </header>

    {state.activeTab === "timeline" && state.currentView === "timeline" && <div
      ref={timelineRef}
      className="twitter-timeline"
      onScroll={event => dispatch({ type: "SET_SCROLL_POSITION", scrollPosition: event.currentTarget.scrollTop })}
    >
      {timelineActivities.map(activity => <TimelineTweet
        key={activity.id}
        itemId={activity.id}
        tweet={activity.tweet}
        retweetAttribution={activity.retweetAttribution}
        favorite={state.favoriteTweetIds.includes(activity.tweet.id)}
        retweeted={state.retweetedTweetIds.includes(activity.tweet.id)}
        revealed={state.revealedTweetId === activity.id}
        userActivity={activity.retweetActivity || activity.tweet.origin === "user"}
        retweetAllowed={activity.tweet.origin !== "user"}
        onReveal={() => dispatch({ type: "TOGGLE_TWEET_ACTIONS", tweetId: activity.tweet.id, timelineItemId: activity.id })}
        onOpen={() => dispatch({ type: "OPEN_TWEET", tweetId: activity.tweet.id, scrollPosition: timelineRef.current?.scrollTop ?? state.scrollPosition })}
        onReply={() => dispatch({ type: "BEGIN_REPLY", tweetId: activity.tweet.id })}
        onRetweet={() => toggleRetweet(activity.tweet.id)}
        onFavorite={() => dispatch({ type: "TOGGLE_FAVORITE", tweetId: activity.tweet.id })}
        onOpenProfile={(displayNameOrHandle) => activity.tweet.origin === "user"
          ? dispatch({ type: "OPEN_USER_PROFILE_BY_ID", profileId: "session-owner", originView: "timeline" })
          : dispatch({ type: "OPEN_USER_PROFILE", displayName: displayNameOrHandle, originView: "timeline" })}
      />)}
    </div>}

    {state.currentView === "tweetDetail" && selectedTweet && <TweetDetail
      tweet={selectedTweet}
      favorite={state.favoriteTweetIds.includes(selectedTweet.id)}
      retweeted={state.retweetedTweetIds.includes(selectedTweet.id)}
      replies={state.replies.filter(reply => reply.targetTweetId === selectedTweet.id)}
      retweetAllowed={selectedTweet.origin !== "user"}
      onReply={() => dispatch({ type: "BEGIN_REPLY", tweetId: selectedTweet.id })}
      onRetweet={() => toggleRetweet(selectedTweet.id)}
      onFavorite={() => dispatch({ type: "TOGGLE_FAVORITE", tweetId: selectedTweet.id })}
      onOpenLinkedTweet={selectedTweet.linkedTweetId ? () => dispatch({ type: "OPEN_LINKED_TWEET", tweetId: selectedTweet.linkedTweetId!, origin: state.activeTab === "mentions" ? "mentions" : "timeline" }) : undefined}
      onOpenProfile={(displayNameOrHandle) => selectedTweet.origin === "user"
        ? dispatch({ type: "OPEN_USER_PROFILE_BY_ID", profileId: "session-owner", originView: "tweetDetail" })
        : dispatch({ type: "OPEN_USER_PROFILE", displayName: displayNameOrHandle, originView: "tweetDetail" })}
    />}

    {state.activeTab === "mentions" && state.currentView === "mentions" && <TwitterMentions mentions={state.mentions} tweets={state.mentionTweets} scrollPosition={state.mentionsScrollPosition} onScroll={scrollPosition => dispatch({ type: "SET_SOCIAL_SCROLL_POSITION", view: "mentions", scrollPosition })} onOpen={(mentionId, scrollPosition) => dispatch({ type: "OPEN_MENTION", mentionId, scrollPosition })} />}
    {state.activeTab === "messages" && state.currentView === "messagesList" && <TwitterMessages threads={state.directMessages} scrollPosition={state.messagesScrollPosition} onScroll={scrollPosition => dispatch({ type: "SET_SOCIAL_SCROLL_POSITION", view: "messages", scrollPosition })} onOpen={(threadId, scrollPosition) => dispatch({ type: "OPEN_DIRECT_MESSAGE", threadId, scrollPosition })} />}
    {state.activeTab === "messages" && state.currentView === "dmThread" && <TwitterDMThread thread={state.directMessages.find(thread => thread.id === state.selectedDirectMessageId) ?? null} onOpenLinkedTweet={tweetId => dispatch({ type: "OPEN_LINKED_TWEET", tweetId, origin: "dmThread" })} />}

    {state.currentView === "userProfile" && (state.activeTab === "timeline" || state.activeTab === "search") && <TwitterProfile
      profile={selectedProfile}
      sessionOwner={state.selectedUserId === "session-owner"}
      onToggleFollow={state.selectedUserId && state.selectedUserId !== "session-owner"
        ? () => dispatch({ type: "SET_FOLLOW", profileId: state.selectedUserId!, following: !selectedProfile.following })
        : undefined}
      onOpenFollowing={() => dispatch({ type: "OPEN_FOLLOWING" })}
    />}

    {state.activeTab === "timeline" && state.currentView === "composer" && <TwitterComposer
      identity={sessionIdentity.name}
      value={composerValue}
      replyTarget={composerTarget}
      canSend={composerCanSend}
      onChange={value => dispatch({ type: "EDIT_COMPOSER", value })}
      onSubmit={() => state.composerKind === "new"
        ? dispatch({
          type: "SUBMIT_NEW_TWEET",
          displayName: sessionIdentity.name,
          createdAt: currentDeviceDateTime.getTime(),
          timestamp: currentDeviceTime,
        })
        : dispatch({ type: "SUBMIT_REPLY", displayName: sessionIdentity.name })}
    />}

    {state.activeTab === "search" && state.currentView === "searchLanding" && <TwitterSearchLanding
      onOpenSuggested={() => dispatch({ type: "OPEN_SUGGESTED_USERS" })}
      onOpenProfile={() => dispatch({ type: "OPEN_USER_PROFILE_BY_ID", profileId: "session-owner", originView: "searchLanding" })}
    />}

    {state.activeTab === "search" && state.currentView === "suggestedUsers" && <TwitterPeopleList
      label="Suggested Users"
      users={suggestedPeople}
      scrollPosition={state.suggestedUsersScrollPosition}
      onScroll={scrollPosition => dispatch({ type: "SET_PEOPLE_SCROLL_POSITION", view: "suggestedUsers", scrollPosition })}
      onOpenProfile={(profileId, scrollPosition) => dispatch({ type: "OPEN_USER_PROFILE_BY_ID", profileId, originView: "suggestedUsers", scrollPosition })}
      onToggleFollow={profileId => {
        dispatch({ type: "SET_FOLLOW", profileId, following: !state.followedUserIds.includes(profileId) });
      }}
    />}

    {state.activeTab === "search" && state.currentView === "following" && <TwitterPeopleList
      label="Following"
      users={followingPeople}
      scrollPosition={state.followingScrollPosition}
      onScroll={scrollPosition => dispatch({ type: "SET_PEOPLE_SCROLL_POSITION", view: "following", scrollPosition })}
      onOpenProfile={(profileId, scrollPosition) => dispatch({ type: "OPEN_USER_PROFILE_BY_ID", profileId, originView: "following", scrollPosition })}
      onToggleFollow={profileId => {
        dispatch({ type: "SET_FOLLOW", profileId, following: !state.followedUserIds.includes(profileId) });
      }}
    />}

    {state.activeTab !== "timeline" && state.activeTab !== "search" && state.activeTab !== "mentions" && state.activeTab !== "messages" && <section className="twitter-tab-shell" aria-label={`${tabTitle(state.activeTab)} shell`} data-content-status="HOLD" />}

    {state.currentView !== "composer" && <TwitterTabBar
      activeTab={state.activeTab}
      mentionsUnreadCount={selectTwitterMentionsUnreadCount(state)}
      messagesUnreadCount={selectTwitterDirectMessagesUnreadCount(state)}
      onSelect={tab => dispatch({ type: "SHOW_TAB", tab })}
    />}
  </section>;
}

function TimelineTweet({ itemId, tweet, retweetAttribution, favorite, retweeted, revealed, userActivity = false, retweetAllowed, onReveal, onOpen, onReply, onRetweet, onFavorite, onOpenProfile }: {
  itemId: string;
  tweet: TwitterTweet;
  retweetAttribution?: string;
  favorite: boolean;
  retweeted: boolean;
  revealed: boolean;
  userActivity?: boolean;
  retweetAllowed: boolean;
  onReveal: () => void;
  onOpen: () => void;
  onReply: () => void;
  onRetweet: () => void;
  onFavorite: () => void;
  onOpenProfile: (displayNameOrHandle: string) => void;
}) {
  const gesture = useRef({ x: 0, y: 0, swiped: false });
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    gesture.current = { x: event.clientX, y: event.clientY, swiped: false };
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const dx = event.clientX - gesture.current.x;
    const dy = event.clientY - gesture.current.y;
    if (dx >= 36 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      gesture.current.swiped = true;
      onReveal();
    }
  };

  return <article className={`twitter-timeline-item${revealed ? " is-revealed" : ""}`} data-user-activity={userActivity || undefined} data-item-id={itemId}>
    <div
      className="twitter-timeline-row"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { gesture.current.swiped = false; }}
      onClick={event => {
        const raw = event.target as HTMLElement | null;
        if (raw && raw.closest(".twitter-profile-link")) return;
        if (gesture.current.swiped) {
          gesture.current.swiped = false;
          return;
        }
        onOpen();
      }}
      role="button"
      tabIndex={0}
      aria-expanded={revealed}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          onOpen();
        }
      }}
      data-content-status={tweet.contentStatus}
    >
      <span
        role="button"
        aria-label={`Open ${tweet.displayName} profile`}
        className="twitter-avatar-fixture twitter-profile-link twitter-timeline-avatar"
        onClick={event => {
          event.stopPropagation();
          onOpenProfile(tweet.displayName);
        }}
      >
        {initials(tweet.displayName)}
      </span>
      <span className="twitter-tweet-copy">
        <strong
          role="button"
          aria-label={`Open ${tweet.displayName} profile`}
          className="twitter-tweet-profile-name twitter-profile-link"
          onClick={event => {
            event.stopPropagation();
            onOpenProfile(tweet.displayName);
          }}
        >
          {tweet.displayName}
        </strong>
        <time>{tweet.timestamp}</time>
        <span>{tweet.text}</span>
        {retweetAttribution && <small>{retweetAttribution}</small>}
      </span>
      {favorite && <span className="twitter-favorite-marker">Favorite</span>}
    </div>
    {revealed && <div className="twitter-tweet-action-row" aria-label="Tweet actions" data-chrome-status="HOLD">
      <button type="button" onClick={onReply}>Reply</button>
      <button type="button" aria-pressed={retweeted} disabled={!retweetAllowed} onClick={onRetweet}>{retweetAllowed ? (retweeted ? "Retweeted" : "Retweet") : "Retweet"}</button>
      <button type="button" aria-pressed={favorite} onClick={onFavorite}>{favorite ? "Favorited" : "Favorite"}</button>
    </div>}
  </article>;
}

function TweetDetail({ tweet, favorite, retweeted, replies, retweetAllowed, onReply, onRetweet, onFavorite, onOpenLinkedTweet, onOpenProfile }: {
  tweet: TwitterTweet;
  favorite: boolean;
  retweeted: boolean;
  replies: TwitterState["replies"];
  retweetAllowed: boolean;
  onReply: () => void;
  onRetweet: () => void;
  onFavorite: () => void;
  onOpenLinkedTweet?: () => void;
  onOpenProfile: (displayNameOrHandle: string) => void;
}) {
  return <article className="twitter-tweet-detail" data-content-status={tweet.contentStatus}>
    <header>
      <span
        role="button"
        aria-label={`Open ${tweet.displayName} profile`}
        className="twitter-avatar-fixture twitter-profile-link"
        onClick={() => onOpenProfile(tweet.displayName)}
      >{initials(tweet.displayName)}</span>
      <div>
        <strong
          role="button"
          aria-label={`Open ${tweet.displayName} profile`}
          className="twitter-tweet-profile-name twitter-profile-link"
          onClick={() => onOpenProfile(tweet.displayName)}
        >{tweet.displayName}</strong>
        <span
          role="button"
          className="twitter-tweet-handle twitter-profile-link"
          onClick={() => onOpenProfile(tweet.authorHandle || twitterReplyHandle(tweet.displayName))}
        >{tweet.authorHandle || twitterReplyHandle(tweet.displayName)}</span>
      </div>
    </header>
    <p>{tweet.text}</p>
    {onOpenLinkedTweet && <button type="button" className="twitter-linked-status" onClick={onOpenLinkedTweet}>View linked Tweet</button>}
    <time>October 20, 2010 · {tweet.timestamp}</time>
    <div className="twitter-detail-actions" aria-label="Tweet actions" data-chrome-status="HOLD">
      <button type="button" onClick={onReply}>Reply</button>
      <button type="button" aria-pressed={retweeted} disabled={!retweetAllowed} onClick={onRetweet}>{retweetAllowed ? (retweeted ? "Retweeted" : "Retweet") : "Retweet"}</button>
      <button type="button" aria-pressed={favorite} onClick={onFavorite}>{favorite ? "Favorited" : "Favorite"}</button>
    </div>
    {replies.length > 0 && <section className="twitter-reply-activity" aria-label="Your replies">
      {replies.map(reply => <article key={reply.id}><strong>{reply.displayName}</strong><p>{reply.text}</p></article>)}
    </section>}
  </article>;
}

function TwitterComposer({ identity, value, replyTarget, canSend, onChange, onSubmit }: {
  identity: string;
  value: string;
  replyTarget: TwitterTweet | null;
  canSend: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return <form id="twitter-composer-form" className="twitter-composer" onSubmit={event => {
    event.preventDefault();
    if (canSend) onSubmit();
  }}>
    <div className="twitter-composer-account">
      <strong>{twitterReplyHandle(identity || "owner")}</strong>
      {replyTarget && <small>Reply to {twitterReplyHandle(replyTarget.displayName)}</small>}
    </div>
    <textarea autoFocus={false} aria-label="Tweet" maxLength={140} value={value} onChange={event => onChange(event.currentTarget.value)} />
    <div className="twitter-composer-disclosure" data-chrome-status="HOLD">
      <button type="button" disabled>attachments (...)</button>
      <span className="twitter-character-count">{140 - value.length}</span>
    </div>
    <div className="twitter-composer-tools" aria-label="Compose tools" data-chrome-status="HOLD">
      <button type="button" disabled>Camera</button>
      <button type="button" disabled>Photo Library</button>
      <button type="button" disabled>Geotag</button>
      <button type="button" disabled>Usernames</button>
      <button type="button" disabled>Hashtags</button>
      <button type="button" disabled>Shrink URLs</button>
    </div>
  </form>;
}

function TwitterProfile({ profile, sessionOwner, onToggleFollow, onOpenFollowing }: {
  profile: TwitterUserProfile;
  sessionOwner: boolean;
  onToggleFollow?: () => void;
  onOpenFollowing: () => void;
}) {
  return <section className="twitter-profile-view" aria-label="User profile">
    <header className="twitter-profile-header">
      <span className="twitter-avatar-fixture" aria-label={`${profile.displayName} avatar fixture`} data-avatar-status="DEV">{profile.avatarSeed}</span>
      <div>
        <h2>{profile.displayName}</h2>
        <p className="twitter-profile-handle">{profile.handle}</p>
        {profile.verified ? <p className="twitter-profile-verified">✓ verified</p> : null}
      </div>
    </header>
    {(profile.bio || profile.location || profile.web) && <section className="twitter-profile-metadata">
      {profile.bio && <p>{profile.bio}</p>}
      <div className="twitter-profile-metadata-grid">
        {profile.location && <span>location</span>}
        {profile.location && <strong>{profile.location}</strong>}
        {profile.web && <span>web</span>}
        {profile.web && <strong>{profile.web}</strong>}
      </div>
    </section>}
    <section className="twitter-profile-stats" aria-label="Profile statistics">
      <button type="button" disabled={!sessionOwner} onClick={sessionOwner ? onOpenFollowing : undefined}>
        <strong>{formatProfileCount(profile.followingCount)}</strong>
        <span>following</span>
      </button>
      <div>
        <strong>{formatProfileCount(profile.tweetCount)}</strong>
        <span>tweets</span>
      </div>
      <div>
        <strong>{formatProfileCount(profile.followerCount)}</strong>
        <span>followers</span>
      </div>
      <div>
        <strong>{formatProfileCount(profile.favoriteCount)}</strong>
        <span>favorites</span>
      </div>
    </section>
    <section className="twitter-profile-control" aria-label="Profile controls" data-chrome-status="HOLD">
      {sessionOwner
        ? <p>Account counts are session-local CURATED values.</p>
        : onToggleFollow && <button type="button" onClick={onToggleFollow}>{profile.following ? "UNFOLLOW" : "FOLLOW"}</button>}
    </section>
  </section>;
}

function TwitterSearchLanding({ onOpenSuggested, onOpenProfile }: { onOpenSuggested: () => void; onOpenProfile: () => void }) {
  return <section className="twitter-search-landing" aria-label="Search and discovery">
    <button type="button" onClick={onOpenSuggested}><strong>Suggested Users</strong><span>Browse accounts</span></button>
    <button type="button" onClick={onOpenProfile}><strong>My Profile</strong><span>Account and Following</span></button>
  </section>;
}

function TwitterMentions({ mentions, tweets, scrollPosition, onScroll, onOpen }: { mentions: TwitterState["mentions"]; tweets: TwitterState["mentionTweets"]; scrollPosition: number; onScroll: (position: number) => void; onOpen: (id: string, position: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => { if (ref.current) ref.current.scrollTop = scrollPosition; }, [scrollPosition]);
  return <section ref={ref} className="twitter-social-list" aria-label="Mentions" onScroll={event => onScroll(event.currentTarget.scrollTop)}>{mentions.map(item => {
    const tweet = tweets.find(candidate => candidate.id === item.tweetId);
    if (!tweet) return null;
    return <button key={item.id} type="button" className={`twitter-social-row ${item.unread ? "is-unread" : ""}`} onClick={() => onOpen(item.id, ref.current?.scrollTop ?? scrollPosition)}><span className="twitter-avatar-fixture">{initials(tweet.displayName)}</span><span><strong>{tweet.displayName}</strong><small>{tweet.timestamp}</small><span>{tweet.text}</span>{tweet.linkedTweetId && <em>View Tweet</em>}</span></button>;
  })}</section>;
}

function TwitterMessages({ threads, scrollPosition, onScroll, onOpen }: { threads: TwitterState["directMessages"]; scrollPosition: number; onScroll: (position: number) => void; onOpen: (id: string, position: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => { if (ref.current) ref.current.scrollTop = scrollPosition; }, [scrollPosition]);
  return <section ref={ref} className="twitter-social-list" aria-label="Direct Messages" onScroll={event => onScroll(event.currentTarget.scrollTop)}>{threads.map(thread => <button key={thread.id} type="button" className={`twitter-social-row ${thread.unread ? "is-unread" : ""}`} onClick={() => onOpen(thread.id, ref.current?.scrollTop ?? scrollPosition)}><span className="twitter-avatar-fixture">{initials(thread.sender)}</span><span><strong>{thread.sender}</strong><small>{thread.timestamp}</small><span>{thread.messages[thread.messages.length - 1]?.text}</span></span></button>)}</section>;
}

function TwitterDMThread({ thread, onOpenLinkedTweet }: { thread: TwitterState["directMessages"][number] | null; onOpenLinkedTweet: (id: string) => void }) {
  if (!thread) return <section className="twitter-tab-shell" />;
  return <section className="twitter-dm-thread" aria-label={`Direct messages with ${thread.sender}`}>{thread.messages.map(message => <article key={message.id}><p>{message.text}</p>{message.linkedTweetId && <button type="button" onClick={() => onOpenLinkedTweet(message.linkedTweetId!)}>View Tweet</button>}</article>)}</section>;
}

function TwitterPeopleList({ label, users, scrollPosition, onScroll, onOpenProfile, onToggleFollow }: {
  label: string;
  users: Array<TwitterSuggestedUser & { following: boolean }>;
  scrollPosition: number;
  onScroll: (scrollPosition: number) => void;
  onOpenProfile: (profileId: string, scrollPosition: number) => void;
  onToggleFollow: (profileId: string) => void;
}) {
  const listRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (listRef.current) listRef.current.scrollTop = scrollPosition;
  }, [scrollPosition]);
  return <section
    ref={listRef}
    className="twitter-people-list"
    aria-label={label}
    onScroll={event => onScroll(event.currentTarget.scrollTop)}
  >
    {users.length === 0 && <p className="twitter-people-empty">No accounts followed.</p>}
    {users.map(user => <article key={user.id} className="twitter-person-row" data-provenance={user.provenance}>
      <button type="button" className="twitter-person-profile" onClick={() => onOpenProfile(user.id, listRef.current?.scrollTop ?? scrollPosition)}>
        <span className="twitter-avatar-fixture" data-avatar-status={user.avatarStatus}>{user.avatarSeed}</span>
        <span className="twitter-person-copy">
          <strong>{user.displayName}</strong>
          <small>{user.handle}</small>
          <span>{user.subtitle}</span>
        </span>
      </button>
      <button type="button" className="twitter-follow-button" aria-pressed={user.following} onClick={() => onToggleFollow(user.id)}>
        {user.following ? "UNFOLLOW" : "FOLLOW"}
      </button>
    </article>)}
  </section>;
}

function formatProfileCount(value?: number): string {
  if (typeof value !== "number") return "—";
  return value.toLocaleString("en-US", { useGrouping: true, maximumFractionDigits: 0 });
}

function TwitterTabBar({ activeTab, mentionsUnreadCount, messagesUnreadCount, onSelect }: { activeTab: TwitterTab; mentionsUnreadCount: number; messagesUnreadCount: number; onSelect: (tab: TwitterTab) => void }) {
  const tabs: Array<[TwitterTab, string]> = [
    ["timeline", "Timeline"],
    ["mentions", "Mentions"],
    ["messages", "Messages"],
    ["search", "Search"],
    ["more", "More"],
  ];
  return <nav className="twitter-tab-bar" aria-label="Twitter sections" data-chrome-status="HOLD">
    {tabs.map(([tab, label]) => {
      const unread = tab === "mentions" ? mentionsUnreadCount : tab === "messages" ? messagesUnreadCount : 0;
      return <button type="button" key={tab} aria-current={activeTab === tab ? "page" : undefined} onClick={() => onSelect(tab)}>{label}{unread > 0 && <span className="twitter-tab-unread-indicator" aria-label={`${label} has unread items`} />}</button>;
    })}
  </nav>;
}

function tabTitle(tab: TwitterTab): string {
  switch (tab) {
    case "timeline": return "Tweets";
    case "mentions": return "Mentions";
    case "messages": return "Messages";
    case "search": return "Search";
    case "more": return "More";
  }
}

function initials(displayName: string): string {
  return displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("") || "?";
}
