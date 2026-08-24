export type AppRuntimePhase = "none" | "launching" | "running" | "suspended" | "resuming" | "closing";

export type AppRuntimeState = {
  phase: AppRuntimePhase;
  activeAppId: string | null;
  suspendedAppIds: string[];
  recentAppIds: string[];
};

export type AppRuntimeEvent =
  | { type: "LAUNCH"; appId: string }
  | { type: "SUSPEND" }
  | { type: "RESUME"; appId: string }
  | { type: "CLOSE" }
  | { type: "ANIMATION_COMPLETE" }
  | { type: "RESET" };

export const initialAppRuntimeState: AppRuntimeState = {
  phase: "none",
  activeAppId: null,
  suspendedAppIds: [],
  recentAppIds: [],
};

const moveToFront = (ids: string[], appId: string) => [appId, ...ids.filter(id => id !== appId)];

export function appRuntimeStateTransition(state: AppRuntimeState, event: AppRuntimeEvent): AppRuntimeState {
  switch (event.type) {
    case "LAUNCH": {
      if (state.phase !== "none" && state.phase !== "suspended") return state;
      const suspendedAppIds = state.activeAppId && state.activeAppId !== event.appId
        ? moveToFront(state.suspendedAppIds, state.activeAppId)
        : state.suspendedAppIds;
      return {
        phase: "launching",
        activeAppId: event.appId,
        suspendedAppIds: suspendedAppIds.filter(id => id !== event.appId),
        recentAppIds: moveToFront(state.recentAppIds, event.appId),
      };
    }
    case "SUSPEND":
      if (!state.activeAppId || (state.phase !== "running" && state.phase !== "resuming" && state.phase !== "launching")) return state;
      return {
        ...state,
        phase: "suspended",
        suspendedAppIds: moveToFront(state.suspendedAppIds, state.activeAppId),
        recentAppIds: moveToFront(state.recentAppIds, state.activeAppId),
      };
    case "RESUME": {
      const isRetained = state.activeAppId === event.appId || state.suspendedAppIds.includes(event.appId);
      if (!isRetained || state.phase === "launching" || state.phase === "closing") return state;
      const suspendedAppIds = state.activeAppId && state.activeAppId !== event.appId && state.phase === "running"
        ? moveToFront(state.suspendedAppIds, state.activeAppId)
        : state.suspendedAppIds;
      return {
        ...state,
        phase: "resuming",
        activeAppId: event.appId,
        suspendedAppIds: suspendedAppIds.filter(id => id !== event.appId),
        recentAppIds: moveToFront(state.recentAppIds, event.appId),
      };
    }
    case "CLOSE":
      return state.activeAppId && state.phase !== "none" && state.phase !== "closing"
        ? { ...state, phase: "closing" }
        : state;
    case "ANIMATION_COMPLETE":
      if (state.phase === "launching" || state.phase === "resuming") return { ...state, phase: "running" };
      if (state.phase !== "closing" || !state.activeAppId) return state;
      return {
        ...state,
        phase: "none",
        activeAppId: null,
        suspendedAppIds: state.suspendedAppIds.filter(id => id !== state.activeAppId),
      };
    case "RESET":
      return initialAppRuntimeState;
  }
}
