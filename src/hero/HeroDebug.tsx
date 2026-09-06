import type { HeroPhase } from "./heroTypes";

const phases: HeroPhase[] = ["identity", "detaching", "inspect", "powering-on", "front-aligned"];

export function HeroDebug({ phase, onJump, onReset }: Readonly<{
  phase: HeroPhase;
  onJump: (phase: HeroPhase) => void;
  onReset: () => void;
}>) {
  if (!import.meta.env.DEV) return null;
  return (
    <nav className="hero-debug" aria-label="Hero sandbox phase controls">
      {phases.map((item) => (
        <button key={item} type="button" data-active={phase === item} onClick={() => onJump(item)}>{item}</button>
      ))}
      <button type="button" onClick={onReset}>reset</button>
    </nav>
  );
}
