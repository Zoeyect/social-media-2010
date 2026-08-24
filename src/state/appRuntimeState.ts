export type AppRuntimePhase = "none" | "launching" | "running" | "closing";

export type AppRuntimeState = {
  phase: AppRuntimePhase;
  activeAppId: string | null;
};

export type AppRuntimeEvent =
  | { type: "LAUNCH"; appId: string }
  | { type: "CLOSE" }
  | { type: "ANIMATION_COMPLETE" }
  | { type: "RESET" };

export const initialAppRuntimeState: AppRuntimeState = {
  phase: "none",
  activeAppId: null,
};

export function appRuntimeStateTransition(state: AppRuntimeState, event: AppRuntimeEvent): AppRuntimeState {
  switch (event.type) {
    case "LAUNCH":
      return state.phase === "none" ? { phase: "launching", activeAppId: event.appId } : state;
    case "CLOSE":
      return state.phase === "launching" || state.phase === "running"
        ? { ...state, phase: "closing" }
        : state;
    case "ANIMATION_COMPLETE":
      if (state.phase === "launching") return { ...state, phase: "running" };
      return state.phase === "closing" ? initialAppRuntimeState : state;
    case "RESET":
      return initialAppRuntimeState;
  }
}
