import type { HeroPhase, HeroState } from "./heroTypes";

export const HERO_DETACH_DURATION_SECONDS = 1.15;
export const HERO_POWER_DURATION_SECONDS = 1.05;
export const HERO_POWER_LOSS_SECONDS = 0.8;
export const HERO_RETURN_SECONDS = 1.4;
export const HERO_RECHARGE_SECONDS = 0.45;

export type HeroAction =
  | { type: "CONFIRM_IDENTITY"; name: string }
  | { type: "DETACH_COMPLETE" }
  | { type: "PRESS_POWER" }
  | { type: "ALIGN_COMPLETE" }
  | { type: "ENTER_EXPERIENCE" }
  | { type: "EXPERIENCE_ENDED" }
  | { type: "ADVANCE_RETURN"; from: HeroPhase }
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
      return action.phase === "identity" ? initialHeroState : { ...state, phase: action.phase };
    case "ENTER_EXPERIENCE":
      return state.phase === "front-aligned" ? { ...state, phase: "experience" } : state;
    case "EXPERIENCE_ENDED":
      return state.phase === "experience" ? { ...state, phase: "power-loss" } : state;
    case "ADVANCE_RETURN":
      if (state.phase !== action.from) return state;
      if (state.phase === "power-loss") return { ...state, phase: "returning" };
      if (state.phase === "returning") return { ...state, phase: "recharging" };
      return state.phase === "recharging" ? initialHeroState : state;
    case "RESET":
      return initialHeroState;
  }
}

export function restrainedEase(progress: number): number {
  const t = Math.max(0, Math.min(1, progress));
  return t * t * (3 - 2 * t);
}
