export type FolderState = "closed" | "opening" | "open" | "closing";

export type FolderEvent = "OPEN" | "CLOSE" | "ANIMATION_COMPLETE";

export function folderStateTransition(state: FolderState, event: FolderEvent): FolderState {
  switch (state) {
    case "closed":
      return event === "OPEN" ? "opening" : state;
    case "opening":
      if (event === "CLOSE") return "closing";
      return event === "ANIMATION_COMPLETE" ? "open" : state;
    case "open":
      return event === "CLOSE" ? "closing" : state;
    case "closing":
      if (event === "OPEN") return "opening";
      return event === "ANIMATION_COMPLETE" ? "closed" : state;
  }
}
