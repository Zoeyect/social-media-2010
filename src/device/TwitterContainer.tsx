import { Dispatch, PointerEvent, useLayoutEffect, useRef } from "react";
import { TwitterEvent, TwitterState, TwitterTab, TwitterTweet, twitterReplyHandle } from "../state/twitterState";
import { useSessionIdentity } from "../state/sessionIdentity";

type TwitterContainerProps = {
  state: TwitterState;
  dispatch: Dispatch<TwitterEvent>;
};

export function TwitterContainer({ state, dispatch }: TwitterContainerProps) {
  const sessionIdentity = useSessionIdentity();
  const timelineRef = useRef<HTMLDivElement>(null);
  const selectedTweet = state.timeline.find(tweet => tweet.id === state.selectedTweetId) ?? null;
  const composerTarget = state.timeline.find(tweet => tweet.id === state.replyComposerTweetId) ?? null;
  const composerHandle = composerTarget ? twitterReplyHandle(composerTarget.displayName) : null;
  const replyCanSend = state.composerKind === "reply" && Boolean(composerHandle) && state.replyDraft.trim() !== composerHandle;

  useLayoutEffect(() => {
    if (state.activeTab !== "timeline" || state.currentView !== "timeline" || !timelineRef.current) return;
    timelineRef.current.scrollTop = state.scrollPosition;
  }, [state.activeTab, state.currentView, state.scrollPosition]);

  const toggleRetweet = (tweetId: string) => dispatch({
    type: "TOGGLE_RETWEET",
    tweetId,
    retweetedBy: sessionIdentity.name,
    retweetActionTimestamp: Date.now(),
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
      {state.activeTab === "timeline" && state.currentView === "composer" && <>
        <button type="button" className="twitter-close-button" onClick={() => dispatch({ type: "CANCEL_REPLY" })}>Close</button>
        <strong>New Tweet</strong>
        <button type="submit" form="twitter-composer-form" className="twitter-send-button" disabled={!replyCanSend}>Send</button>
      </>}
      {state.activeTab !== "timeline" && <strong>{tabTitle(state.activeTab)}</strong>}
    </header>

    {state.activeTab === "timeline" && state.currentView === "timeline" && <div
      ref={timelineRef}
      className="twitter-timeline"
      onScroll={event => dispatch({ type: "SET_SCROLL_POSITION", scrollPosition: event.currentTarget.scrollTop })}
    >
      {state.retweetActivities.map(activity => {
        const sourceTweet = state.timeline.find(tweet => tweet.id === activity.sourceTweetId);
        return sourceTweet ? <TimelineTweet
          key={activity.id}
          itemId={activity.id}
          tweet={sourceTweet}
          retweetAttribution={`Retweeted by ${activity.retweetedBy}`}
          favorite={state.favoriteTweetIds.includes(sourceTweet.id)}
          retweeted={state.retweetedTweetIds.includes(sourceTweet.id)}
          revealed={state.revealedTweetId === activity.id}
          userActivity
          onReveal={() => dispatch({ type: "TOGGLE_TWEET_ACTIONS", tweetId: sourceTweet.id, timelineItemId: activity.id })}
          onOpen={() => dispatch({ type: "OPEN_TWEET", tweetId: sourceTweet.id, scrollPosition: timelineRef.current?.scrollTop ?? state.scrollPosition })}
          onReply={() => dispatch({ type: "BEGIN_REPLY", tweetId: sourceTweet.id })}
          onRetweet={() => toggleRetweet(sourceTweet.id)}
          onFavorite={() => dispatch({ type: "TOGGLE_FAVORITE", tweetId: sourceTweet.id })}
        /> : null;
      })}
      {state.timeline.map(tweet => <TimelineTweet
        key={tweet.id}
        itemId={tweet.id}
        tweet={tweet}
        favorite={state.favoriteTweetIds.includes(tweet.id)}
        retweeted={state.retweetedTweetIds.includes(tweet.id)}
        revealed={state.revealedTweetId === tweet.id}
        onReveal={() => dispatch({ type: "TOGGLE_TWEET_ACTIONS", tweetId: tweet.id })}
        onOpen={() => dispatch({ type: "OPEN_TWEET", tweetId: tweet.id, scrollPosition: timelineRef.current?.scrollTop ?? state.scrollPosition })}
        onReply={() => dispatch({ type: "BEGIN_REPLY", tweetId: tweet.id })}
        onRetweet={() => toggleRetweet(tweet.id)}
        onFavorite={() => dispatch({ type: "TOGGLE_FAVORITE", tweetId: tweet.id })}
      />)}
    </div>}

    {state.activeTab === "timeline" && state.currentView === "tweetDetail" && selectedTweet && <TweetDetail
      tweet={selectedTweet}
      favorite={state.favoriteTweetIds.includes(selectedTweet.id)}
      retweeted={state.retweetedTweetIds.includes(selectedTweet.id)}
      replies={state.replies.filter(reply => reply.targetTweetId === selectedTweet.id)}
      onReply={() => dispatch({ type: "BEGIN_REPLY", tweetId: selectedTweet.id })}
      onRetweet={() => toggleRetweet(selectedTweet.id)}
      onFavorite={() => dispatch({ type: "TOGGLE_FAVORITE", tweetId: selectedTweet.id })}
    />}

    {state.activeTab === "timeline" && state.currentView === "composer" && <TwitterComposer
      identity={sessionIdentity.name}
      value={state.replyDraft}
      replyTarget={composerTarget}
      canSend={replyCanSend}
      onChange={value => dispatch({ type: "EDIT_REPLY", value })}
      onSubmit={() => dispatch({ type: "SUBMIT_REPLY", displayName: sessionIdentity.name })}
    />}

    {state.activeTab !== "timeline" && <section className="twitter-tab-shell" aria-label={`${tabTitle(state.activeTab)} shell`} data-content-status="HOLD" />}

    {state.currentView !== "composer" && <TwitterTabBar activeTab={state.activeTab} onSelect={tab => dispatch({ type: "SHOW_TAB", tab })} />}
  </section>;
}

function TimelineTweet({ itemId, tweet, retweetAttribution, favorite, retweeted, revealed, userActivity = false, onReveal, onOpen, onReply, onRetweet, onFavorite }: {
  itemId: string;
  tweet: TwitterTweet;
  retweetAttribution?: string;
  favorite: boolean;
  retweeted: boolean;
  revealed: boolean;
  userActivity?: boolean;
  onReveal: () => void;
  onOpen: () => void;
  onReply: () => void;
  onRetweet: () => void;
  onFavorite: () => void;
}) {
  const gesture = useRef({ x: 0, y: 0, swiped: false });
  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    gesture.current = { x: event.clientX, y: event.clientY, swiped: false };
  };
  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const dx = event.clientX - gesture.current.x;
    const dy = event.clientY - gesture.current.y;
    if (dx >= 36 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      gesture.current.swiped = true;
      onReveal();
    }
  };

  return <article className={`twitter-timeline-item${revealed ? " is-revealed" : ""}`} data-user-activity={userActivity || undefined} data-item-id={itemId}>
    <button
      type="button"
      className="twitter-timeline-row"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={() => {
        if (gesture.current.swiped) {
          gesture.current.swiped = false;
          return;
        }
        onOpen();
      }}
      data-content-status={tweet.contentStatus}
      aria-expanded={revealed}
    >
      <span className="twitter-avatar-fixture" aria-label={`${tweet.displayName} avatar development fixture`} data-avatar-status="DEV">{initials(tweet.displayName)}</span>
      <span className="twitter-tweet-copy">
        <strong>{tweet.displayName}</strong>
        <time>{tweet.timestamp}</time>
        <span>{tweet.text}</span>
        {retweetAttribution && <small>{retweetAttribution}</small>}
      </span>
      {favorite && <span className="twitter-favorite-marker">Favorite</span>}
    </button>
    {revealed && <div className="twitter-tweet-action-row" aria-label="Tweet actions" data-chrome-status="HOLD">
      <button type="button" onClick={onReply}>Reply</button>
      <button type="button" aria-pressed={retweeted} onClick={onRetweet}>{retweeted ? "Retweeted" : "Retweet"}</button>
      <button type="button" aria-pressed={favorite} onClick={onFavorite}>{favorite ? "Favorited" : "Favorite"}</button>
    </div>}
  </article>;
}

function TweetDetail({ tweet, favorite, retweeted, replies, onReply, onRetweet, onFavorite }: {
  tweet: TwitterTweet;
  favorite: boolean;
  retweeted: boolean;
  replies: TwitterState["replies"];
  onReply: () => void;
  onRetweet: () => void;
  onFavorite: () => void;
}) {
  return <article className="twitter-tweet-detail" data-content-status={tweet.contentStatus}>
    <header>
      <span className="twitter-avatar-fixture" aria-label={`${tweet.displayName} avatar development fixture`} data-avatar-status="DEV">{initials(tweet.displayName)}</span>
      <strong>{tweet.displayName}</strong>
    </header>
    <p>{tweet.text}</p>
    <time>October 20, 2010 · {tweet.timestamp}</time>
    <div className="twitter-detail-actions" aria-label="Tweet actions" data-chrome-status="HOLD">
      <button type="button" onClick={onReply}>Reply</button>
      <button type="button" aria-pressed={retweeted} onClick={onRetweet}>{retweeted ? "Retweeted" : "Retweet"}</button>
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
    <div className="twitter-composer-identity">
      <span className="twitter-avatar-fixture" aria-hidden="true" data-avatar-status="DEV">{initials(identity || "Owner")}</span>
      <strong>{identity || "Owner"}</strong>
      {replyTarget && <small>Reply to {twitterReplyHandle(replyTarget.displayName)}</small>}
    </div>
    <textarea autoFocus={false} aria-label="Tweet" maxLength={140} value={value} onChange={event => onChange(event.currentTarget.value)} />
    <span className="twitter-character-count">{140 - value.length}</span>
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

function TwitterTabBar({ activeTab, onSelect }: { activeTab: TwitterTab; onSelect: (tab: TwitterTab) => void }) {
  const tabs: Array<[TwitterTab, string]> = [
    ["timeline", "Timeline"],
    ["mentions", "Mentions"],
    ["messages", "Messages"],
    ["search", "Search"],
    ["more", "More"],
  ];
  return <nav className="twitter-tab-bar" aria-label="Twitter sections" data-chrome-status="HOLD">
    {tabs.map(([tab, label]) => <button type="button" key={tab} aria-current={activeTab === tab ? "page" : undefined} onClick={() => onSelect(tab)}>{label}</button>)}
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
