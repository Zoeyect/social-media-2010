import { Dispatch, useLayoutEffect, useRef } from "react";
import { TwitterEvent, TwitterState, TwitterTweet } from "../state/twitterState";

type TwitterContainerProps = {
  state: TwitterState;
  dispatch: Dispatch<TwitterEvent>;
};

export function TwitterContainer({ state, dispatch }: TwitterContainerProps) {
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
        onToggleFavorite={() => dispatch({ type: "TOGGLE_FAVORITE", tweetId: selectedTweet.id })}
      />}
  </section>;
}

function TimelineTweet({ tweet, onOpen }: { tweet: TwitterTweet; onOpen: () => void }) {
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
    </span>
  </button>;
}

function TweetDetail({ tweet, favorite, onToggleFavorite }: {
  tweet: TwitterTweet;
  favorite: boolean;
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
      <button type="button" disabled data-control-status="HOLD">Reply</button>
      <button type="button" disabled data-control-status="HOLD">Retweet</button>
      <button
        type="button"
        aria-pressed={favorite}
        onClick={onToggleFavorite}
        data-control-status="PERIOD-EVIDENCE"
      >{favorite ? "Favorited" : "Favorite"}</button>
    </div>
  </article>;
}
