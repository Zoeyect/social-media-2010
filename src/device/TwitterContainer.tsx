import { Dispatch, useLayoutEffect, useRef } from "react";
import { TwitterEvent, TwitterState, TwitterTweet } from "../state/twitterState";
import { useSessionIdentity } from "../state/sessionIdentity";

type TwitterContainerProps = {
  state: TwitterState;
  dispatch: Dispatch<TwitterEvent>;
};

export function TwitterContainer({ state, dispatch }: TwitterContainerProps) {
  const sessionIdentity = useSessionIdentity();
  const timelineRef = useRef<HTMLDivElement>(null);
  const selectedTweet = state.timeline.find(tweet => tweet.id === state.selectedTweetId) ?? null;

  useLayoutEffect(() => {
    if (state.currentView !== "timeline" || !timelineRef.current) return;
    timelineRef.current.scrollTop = state.scrollPosition;
  }, [state.currentView, state.scrollPosition]);

  return <section className="twitter-container" aria-label="Twitter" data-chrome-status="HOLD">
    <header className="twitter-navigation-bar">
      {state.currentView === "tweetDetail" && <button
        type="button"
        className="twitter-back-button"
        onClick={() => dispatch({ type: "BACK_TO_TIMELINE" })}
      >Home</button>}
      <strong>{state.currentView === "timeline" ? "Twitter" : "Tweet"}</strong>
    </header>

    {state.currentView === "timeline"
      ? <div
        ref={timelineRef}
        className="twitter-timeline"
        onScroll={event => dispatch({
          type: "SET_SCROLL_POSITION",
          scrollPosition: event.currentTarget.scrollTop,
        })}
      >
        {state.timeline.map(tweet => <TimelineTweet
          key={tweet.id}
          tweet={tweet}
          retweetedBySession={state.retweetedTweetIds.includes(tweet.id)}
          sessionDisplayName={sessionIdentity.name}
          onOpen={() => dispatch({
            type: "OPEN_TWEET",
            tweetId: tweet.id,
            scrollPosition: timelineRef.current?.scrollTop ?? state.scrollPosition,
          })}
        />)}
      </div>
      : selectedTweet && <TweetDetail
        tweet={selectedTweet}
        favorite={state.favoriteTweetIds.includes(selectedTweet.id)}
        retweeted={state.retweetedTweetIds.includes(selectedTweet.id)}
        replies={state.replies.filter(reply => reply.targetTweetId === selectedTweet.id)}
        replying={state.replyComposerTweetId === selectedTweet.id}
        replyDraft={state.replyDraft}
        sessionDisplayName={sessionIdentity.name}
        onBeginReply={() => dispatch({ type: "BEGIN_REPLY", tweetId: selectedTweet.id })}
        onEditReply={value => dispatch({ type: "EDIT_REPLY", value })}
        onCancelReply={() => dispatch({ type: "CANCEL_REPLY" })}
        onSubmitReply={() => dispatch({ type: "SUBMIT_REPLY", displayName: sessionIdentity.name })}
        onToggleRetweet={() => dispatch({ type: "TOGGLE_RETWEET", tweetId: selectedTweet.id })}
        onToggleFavorite={() => dispatch({ type: "TOGGLE_FAVORITE", tweetId: selectedTweet.id })}
      />}
  </section>;
}

function TimelineTweet({ tweet, retweetedBySession, sessionDisplayName, onOpen }: {
  tweet: TwitterTweet;
  retweetedBySession: boolean;
  sessionDisplayName: string;
  onOpen: () => void;
}) {
  return <button
    type="button"
    className="twitter-timeline-row"
    onClick={onOpen}
    data-content-status={tweet.contentStatus}
  >
    <span className="twitter-avatar-hold" aria-hidden="true" />
    <span className="twitter-tweet-copy">
      <strong>{tweet.displayName}</strong>
      <span>{tweet.text}</span>
      <time>{tweet.timestamp}</time>
      {retweetedBySession && <small>Retweeted by {sessionDisplayName}</small>}
    </span>
  </button>;
}

function TweetDetail({
  tweet,
  favorite,
  retweeted,
  replies,
  replying,
  replyDraft,
  sessionDisplayName,
  onBeginReply,
  onEditReply,
  onCancelReply,
  onSubmitReply,
  onToggleRetweet,
  onToggleFavorite,
}: {
  tweet: TwitterTweet;
  favorite: boolean;
  retweeted: boolean;
  replies: TwitterState["replies"];
  replying: boolean;
  replyDraft: string;
  sessionDisplayName: string;
  onBeginReply: () => void;
  onEditReply: (value: string) => void;
  onCancelReply: () => void;
  onSubmitReply: () => void;
  onToggleRetweet: () => void;
  onToggleFavorite: () => void;
}) {
  return <article className="twitter-tweet-detail" data-content-status={tweet.contentStatus}>
    <header>
      <span className="twitter-avatar-hold" aria-hidden="true" />
      <strong>{tweet.displayName}</strong>
    </header>
    <p>{tweet.text}</p>
    <time>October 20, 2010 · {tweet.timestamp}</time>
    <div className="twitter-detail-actions" aria-label="Tweet actions">
      <button
        type="button"
        aria-expanded={replying}
        onClick={onBeginReply}
        data-control-status="FUNCTIONAL"
      >Reply</button>
      <button
        type="button"
        aria-pressed={retweeted}
        onClick={onToggleRetweet}
        data-control-status="FUNCTIONAL"
      >{retweeted ? "Retweeted" : "Retweet"}</button>
      <button
        type="button"
        aria-pressed={favorite}
        onClick={onToggleFavorite}
        data-control-status="PERIOD-EVIDENCE"
      >{favorite ? "Favorited" : "Favorite"}</button>
    </div>
    {replying && <form
      className="twitter-reply-composer"
      onSubmit={event => {
        event.preventDefault();
        onSubmitReply();
      }}
    >
      <textarea
        aria-label="Reply"
        value={replyDraft}
        maxLength={140}
        onChange={event => onEditReply(event.currentTarget.value)}
      />
      <div>
        <span>{140 - replyDraft.length}</span>
        <button type="button" onClick={onCancelReply}>Cancel</button>
        <button type="submit" disabled={!replyDraft.trim()}>Reply</button>
      </div>
    </form>}
    {replies.length > 0 && <section className="twitter-reply-activity" aria-label="Your replies">
      {replies.map(reply => <article key={reply.id}>
        <strong>{reply.displayName || sessionDisplayName}</strong>
        <p>{reply.text}</p>
      </article>)}
    </section>}
  </article>;
}
