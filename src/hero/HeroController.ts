import type { HeroPhase, HeroState } from "./heroTypes";

export const HERO_DETACH_DURATION_SECONDS = 1.15;
export const HERO_POWER_DURATION_SECONDS = 1.05;

export type HeroAction =
  | { type: "CONFIRM_IDENTITY"; name: string }
  | { type: "DETACH_COMPLETE" }
  | { type: "PRESS_POWER" }
  | { type: "ALIGN_COMPLETE" }
  | { type: "JUMP_TO_PHASE"; phase: HeroPhase }
  | { type: "RESET" };

export const initialHeroState: HeroState = {
  phase: "identity",
  name: "",
};

export function heroTransition(state: HeroState, action: HeroAction): HeroState {
  switch (action.type) {
    case "CONFIRM_IDENTITY": {
      const name = action.name.trim();
      return state.phase === "identity" && name
        ? { name, phase: "detaching" }
        : state;
    }
    case "DETACH_COMPLETE":
      return state.phase === "detaching" ? { ...state, phase: "inspect" } : state;
    case "PRESS_POWER":
      return state.phase === "inspect" ? { ...state, phase: "powering-on" } : state;
    case "ALIGN_COMPLETE":
      return state.phase === "powering-on" ? { ...state, phase: "front-aligned" } : state;
    case "JUMP_TO_PHASE":
      return { ...state, phase: action.phase };
    case "RESET":
      return initialHeroState;
  }
}

export function restrainedEase(progress: number): number {
  const t = Math.max(0, Math.min(1, progress));
  return t * t * (3 - 2 * t);
}
