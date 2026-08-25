import { Dispatch, useLayoutEffect, useRef } from "react";
import { TumblrEvent, TumblrPost, TumblrState } from "../state/tumblrState";

type TumblrContainerProps = {
  state: TumblrState;
  dispatch: Dispatch<TumblrEvent>;
};

export function TumblrContainer({ state, dispatch }: TumblrContainerProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const selected = state.posts.find(post => post.id === state.selectedPostId) ?? null;

  useLayoutEffect(() => {
    if (state.currentView !== "dashboard" || !dashboardRef.current) return;
    dashboardRef.current.scrollTop = state.dashboardScrollPosition;
  }, [state.currentView, state.dashboardScrollPosition]);

  return <section className="tumblr-container" aria-label="Tumblr" data-chrome-status="HOLD">
    <header className="tumblr-navigation-bar">
      <strong>{state.currentView === "dashboard" ? "Dashboard" : selected?.title ?? "Post"}</strong>
      <span>iOS 4.1</span>
    </header>

    {state.currentView === "dashboard" && <div
      ref={dashboardRef}
      className="tumblr-dashboard"
      onScroll={event => dispatch({ type: "SET_DASHBOARD_SCROLL_POSITION", dashboardScrollPosition: event.currentTarget.scrollTop })}
    >
      {state.posts.map(post => <PostRow
        key={post.id}
        post={post}
        isLiked={state.likedPostIds.includes(post.id)}
        isReblogged={state.rebloggedPostIds.includes(post.id)}
        onOpen={() => dispatch({
          type: "OPEN_POST",
          postId: post.id,
          dashboardScrollPosition: dashboardRef.current?.scrollTop ?? state.dashboardScrollPosition,
        })}
      />)}
    </div>}

    {state.currentView === "post" && selected && <article className="tumblr-post-detail">
      <header>
        <strong>@{selected.blog}</strong>
        <p>{selected.timestamp}</p>
      </header>
      <section className={`tumblr-post-body is-${selected.type}`}>
        <h2>{selected.title}</h2>
        <p>{selected.content}</p>
      </section>
      <div className="tumblr-actions">
        <button type="button" onClick={() => dispatch({ type: "TOGGLE_LIKE", postId: selected.id })}>
          {state.likedPostIds.includes(selected.id) ? "Unlike" : "Like"}
        </button>
        <button type="button" onClick={() => dispatch({ type: "TOGGLE_REBLOG", postId: selected.id })}>
          {state.rebloggedPostIds.includes(selected.id) ? "Unreblog" : "Reblog"}
        </button>
        <button type="button" onClick={() => dispatch({ type: "BACK_TO_DASHBOARD" })}>Back</button>
      </div>
    </article>}
  </section>;
}

function PostRow({ post, isLiked, isReblogged, onOpen }: {
  post: TumblrPost;
  isLiked: boolean;
  isReblogged: boolean;
  onOpen: () => void;
}) {
  return <button
    type="button"
    className="tumblr-post-row"
    onClick={onOpen}
  >
    <small>{post.type.toUpperCase()}</small>
    <strong>{post.title}</strong>
    <p>{post.content}</p>
    <span>{isReblogged ? "Reblogged" : isLiked ? "Liked" : "Open"}</span>
  </button>;
}
