import type { HeroPhase } from "./heroTypes";

const phases: HeroPhase[] = ["identity", "detaching", "inspect", "powering-on", "front-aligned", "experience", "power-loss", "returning", "recharging"];

export function HeroDebug({ phase, onJump, onReset, onEnterExperience, onExperienceEnd, productionLifecycle = false }: Readonly<{
  productionLifecycle?: boolean;
  phase: HeroPhase;
  onJump: (phase: HeroPhase) => void;
  onReset: () => void;
  onEnterExperience: () => void;
  onExperienceEnd: () => void;
}>) {
  if (!import.meta.env.DEV) return null;
  if (productionLifecycle) return phase === "experience" ? <nav className="hero-debug" aria-label="Hero lifecycle QA">
    <button type="button" onClick={onExperienceEnd}>Simulate 15-minute end</button>
  </nav> : null;
  return (
    <nav className="hero-debug" aria-label="Hero sandbox phase controls">
      {phases.map((item) => (
        <button key={item} type="button" data-active={phase === item} onClick={() => onJump(item)}>{item}</button>
      ))}
      <button type="button" onClick={onReset}>reset</button>
      {phase === "front-aligned" && <button type="button" onClick={onEnterExperience}>Enter sandbox experience</button>}
      {phase === "experience" && <button type="button" onClick={onExperienceEnd}>Simulate 15-minute end</button>}
    </nav>
  );
}
