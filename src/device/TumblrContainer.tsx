import { Dispatch, useLayoutEffect, useRef } from "react";
import { TumblrEvent, TumblrPost, TumblrState } from "../state/tumblrState";
import { useSessionIdentity } from "../state/sessionIdentity";
import { IOS4Textarea } from "./IOS4KeyboardSystem";

type TumblrContainerProps = {
  state: TumblrState;
  dispatch: Dispatch<TumblrEvent>;
};

export function TumblrContainer({ state, dispatch }: TumblrContainerProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const identity = useSessionIdentity();
  const selected = state.posts.find(post => post.id === state.selectedPostId) ?? null;
  const selectedReblog = selected ? state.reblogs.find(reblog => reblog.sourcePostId === selected.id) ?? null : null;
  const selectedNotes = selected ? state.notes.filter(note => note.sourcePostId === selected.id) : [];

  useLayoutEffect(() => {
    if (state.currentView !== "dashboard" || !dashboardRef.current) return;
    dashboardRef.current.scrollTop = state.dashboardScrollPosition;
  }, [state.currentView, state.dashboardScrollPosition]);

  return <section className="tumblr-container" aria-label="Tumblr" data-chrome-status="HOLD">
    <header className="tumblr-navigation-bar">
      {(state.currentView === "reblog" || state.currentView === "notes") && <button type="button" onClick={() => dispatch({ type: "BACK_TO_POST" })}>Post</button>}
      <strong>{viewTitle(state, selected?.title)}</strong>
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
      <PostContent post={selected} />
      {selectedReblog?.optionalUserText && <section className="tumblr-reblog-summary">
        <strong>Reblogged by {selectedReblog.rebloggedBy}</strong>
        <p>{selectedReblog.optionalUserText}</p>
      </section>}
      <div className="tumblr-actions">
        <button type="button" onClick={() => dispatch({ type: "TOGGLE_LIKE", postId: selected.id, blogName: identity.name })}>
          {state.likedPostIds.includes(selected.id) ? "Unlike" : "Like"}
        </button>
        <button type="button" onClick={() => dispatch(state.rebloggedPostIds.includes(selected.id)
          ? { type: "REMOVE_REBLOG", postId: selected.id }
          : { type: "OPEN_REBLOG", postId: selected.id })}>
          {state.rebloggedPostIds.includes(selected.id) ? "Unreblog" : "Reblog"}
        </button>
        <button type="button" onClick={() => dispatch({ type: "OPEN_NOTES", postId: selected.id })}>Notes ({selectedNotes.length})</button>
        <button type="button" onClick={() => dispatch({ type: "BACK_TO_DASHBOARD" })}>Back</button>
      </div>
    </article>}

    {state.currentView === "reblog" && selected && <section className="tumblr-reblog-flow">
      <PostContent post={selected} />
      <form onSubmit={event => {
        event.preventDefault();
        dispatch({ type: "CONFIRM_REBLOG", rebloggedBy: identity.name, actionTimestamp: Date.now() });
      }}>
        <label htmlFor={`tumblr-reblog-${selected.id}`}>Add text (optional)</label>
        <IOS4Textarea
          keyboardInputId={`tumblr-reblog-${selected.id}`}
          id={`tumblr-reblog-${selected.id}`}
          maxLength={140}
          value={state.reblogDraft}
          onValueChange={value => dispatch({ type: "EDIT_REBLOG_TEXT", value })}
        />
        <div>
          <button type="button" onClick={() => dispatch({ type: "CANCEL_REBLOG" })}>Cancel</button>
          <button type="submit">Reblog</button>
        </div>
      </form>
    </section>}

    {state.currentView === "notes" && selected && <section className="tumblr-notes" data-copy-status="CURATED/HOLD">
      {selectedNotes.length === 0
        ? <p>No notes.</p>
        : selectedNotes.map(note => <article key={note.id} data-origin={note.origin}>
          <strong>@{note.blogName}</strong>
          <span>{note.type === "liked" ? "liked this" : "reblogged this"}</span>
        </article>)}
    </section>}
  </section>;
}

function PostContent({ post }: { post: TumblrPost }) {
  return <>
    <header className="tumblr-post-author">
      <strong>@{post.blog}</strong>
      <p>{post.timestamp}</p>
    </header>
    <section className={`tumblr-post-body is-${post.type}`}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </section>
  </>;
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
    <span>{[isLiked ? "Liked" : "", isReblogged ? "Reblogged" : ""].filter(Boolean).join(" · ") || "Open"}</span>
  </button>;
}

function viewTitle(state: TumblrState, postTitle?: string): string {
  switch (state.currentView) {
    case "dashboard": return "Dashboard";
    case "post": return postTitle ?? "Post";
    case "reblog": return "Reblog";
    case "notes": return "Notes";
  }
}
