import { useCallback, useEffect, useReducer, useState } from "react";
import { HeroDebug } from "./HeroDebug";
import { HeroIdentity } from "./HeroIdentity";
import { HeroScene } from "./HeroScene";
import { heroTransition, initialHeroState } from "./HeroController";
import type { HeroScreenGeometry } from "./heroTypes";

export function HeroSandbox() {
  const [state, dispatch] = useReducer(heroTransition, initialHeroState);
  const [draftName, setDraftName] = useState("");
  const [identityRevision, setIdentityRevision] = useState(0);
  const [screenGeometry, setScreenGeometry] = useState<HeroScreenGeometry | null>(null);
  const onScreenGeometry = useCallback((geometry: HeroScreenGeometry) => setScreenGeometry(geometry), []);
  // Local sandbox reset only: the persistent HeroScene is never keyed/remounted.
  useEffect(() => {
    if (state.phase !== "identity") return;
    setDraftName("");
    setIdentityRevision(revision => revision + 1);
    setScreenGeometry(null);
  }, [state.phase]);
  const simulateExperienceEnd = useCallback(() => dispatch({ type: "EXPERIENCE_ENDED" }), []);

  return (
    <main className="hero-sandbox" data-phase={state.phase}>
      <HeroIdentity
        key={identityRevision}
        active={state.phase === "identity"}
        name={draftName}
        onNameChange={setDraftName}
        onConfirm={(name) => dispatch({ type: "CONFIRM_IDENTITY", name })}
      />
      <HeroScene
        phase={state.phase}
        onDetachComplete={() => dispatch({ type: "DETACH_COMPLETE" })}
        onPowerPress={() => dispatch({ type: "PRESS_POWER" })}
        onAlignmentComplete={() => dispatch({ type: "ALIGN_COMPLETE" })}
        onScreenGeometry={onScreenGeometry}
        onLifecycleAdvance={() => dispatch({ type: "ADVANCE_RETURN", from: state.phase })}
      />
      <p className="hero-inspect-instruction" aria-live="polite">
        {state.phase === "inspect" ? "Drag to inspect. Press the top button to power on." : ""}
      </p>
      <HeroDebug
        phase={state.phase}
        onEnterExperience={() => dispatch({ type: "ENTER_EXPERIENCE" })}
        onExperienceEnd={simulateExperienceEnd}
        onJump={(phase) => dispatch({ type: "JUMP_TO_PHASE", phase })}
        onReset={() => {
          setDraftName("");
          setIdentityRevision((revision) => revision + 1);
          setScreenGeometry(null);
          dispatch({ type: "RESET" });
        }}
      />
      {import.meta.env.DEV && screenGeometry ? (
        <output className="hero-bounds" aria-label="Measured screen bounds">
          Screen {Math.round(screenGeometry.projectedRect.width)} × {Math.round(screenGeometry.projectedRect.height)} · {screenGeometry.aspectRatio.toFixed(3)}
        </output>
      ) : null}
    </main>
  );
}
