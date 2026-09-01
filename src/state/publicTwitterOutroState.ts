export type PublicTwitterOutroPhase = "idle" | "selecting" | "entering_handle" | "confirming" | "submitting" | "success" | "failed" | "withdrawn" | "complete";

export type PublicTwitterOutroState = Readonly<{
  phase: PublicTwitterOutroPhase;
  eligibleTweetIds: readonly string[];
  selectedTweetId: string | null;
  handleInput: string;
  publicHandle: string | null;
  submissionId: string | null;
  error: string | null;
}>;

export type PublicTwitterOutroEvent =
  | { type: "START"; eligibleTweetIds: readonly string[] }
  | { type: "SELECT"; tweetId: string }
  | { type: "ENTER_HANDLE" }
  | { type: "EDIT_HANDLE"; value: string }
  | { type: "HANDLE_INVALID" }
  | { type: "CONFIRM_HANDLE"; publicHandle: string }
  | { type: "SUBMIT" }
  | { type: "SUBMIT_SUCCEEDED"; submissionId: string }
  | { type: "SUBMIT_FAILED"; error: string }
  | { type: "RETRY" }
  | { type: "WITHDRAW" }
  | { type: "COMPLETE" }
  | { type: "RESET" };

export const initialPublicTwitterOutroState: PublicTwitterOutroState = Object.freeze({
  phase: "idle", eligibleTweetIds: Object.freeze([]), selectedTweetId: null,
  handleInput: "", publicHandle: null, submissionId: null, error: null,
});

export function selectEligibleLocalTweetIds(tweets: readonly { id: string; origin: string }[]): readonly string[] {
  return Object.freeze(tweets.filter(tweet => tweet.origin === "user").map(tweet => tweet.id));
}

export function publicTwitterOutroTransition(state: PublicTwitterOutroState, event: PublicTwitterOutroEvent): PublicTwitterOutroState {
  switch (event.type) {
    case "START": return event.eligibleTweetIds.length ? { ...initialPublicTwitterOutroState, phase: "selecting", eligibleTweetIds: Object.freeze([...event.eligibleTweetIds]) } : { ...initialPublicTwitterOutroState, phase: "complete" };
    case "SELECT": return state.phase === "selecting" && state.eligibleTweetIds.includes(event.tweetId) ? { ...state, selectedTweetId: event.tweetId } : state;
    case "ENTER_HANDLE": return state.phase === "selecting" && state.selectedTweetId ? { ...state, phase: "entering_handle" } : state;
    case "EDIT_HANDLE": return state.phase === "entering_handle" ? { ...state, handleInput: event.value, error: null } : state;
    case "HANDLE_INVALID": return state.phase === "entering_handle" ? { ...state, error: "Use 1–15 letters, numbers, or underscores." } : state;
    case "CONFIRM_HANDLE": return state.phase === "entering_handle" && state.selectedTweetId ? { ...state, phase: "confirming", publicHandle: event.publicHandle, error: null } : state;
    case "SUBMIT": return state.phase === "confirming" ? { ...state, phase: "submitting", error: null } : state;
    case "SUBMIT_SUCCEEDED": return state.phase === "submitting" ? { ...state, phase: "success", submissionId: event.submissionId } : state;
    case "SUBMIT_FAILED": return state.phase === "submitting" ? { ...state, phase: "failed", error: event.error } : state;
    case "RETRY": return state.phase === "failed" ? { ...state, phase: "submitting", error: null } : state;
    case "WITHDRAW": return state.phase === "success" ? { ...state, phase: "withdrawn" } : state;
    case "COMPLETE": return { ...state, phase: "complete" };
    case "RESET": return initialPublicTwitterOutroState;
  }
}
