export type MultitaskingBarState = "closed" | "opening" | "open" | "editing";

export type MultitaskingBarEvent = "OPEN" | "ANIMATION_COMPLETE" | "ENTER_EDITING" | "CLOSE" | "RESET";

export function multitaskingBarStateTransition(
  state: MultitaskingBarState,
  event: MultitaskingBarEvent,
): MultitaskingBarState {
  switch (event) {
    case "OPEN":
      return state === "closed" ? "opening" : state;
    case "ANIMATION_COMPLETE":
      return state === "opening" ? "open" : state;
    case "ENTER_EDITING":
      return state === "open" ? "editing" : state;
    case "CLOSE":
    case "RESET":
      return "closed";
  }
}
