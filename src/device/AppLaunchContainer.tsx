import { Dispatch, ReactNode } from "react";
import { AppRuntimeEvent, AppRuntimeState } from "../state/appRuntimeState";

type AppLaunchContainerProps = {
  runtime: AppRuntimeState;
  statusBar: ReactNode;
  dispatch: Dispatch<AppRuntimeEvent>;
  onClosed: () => void;
};

export function AppLaunchContainer({ runtime, statusBar, dispatch, onClosed }: AppLaunchContainerProps) {
  if (runtime.phase === "none") return null;

  return <div
    className={`app-launch-container is-${runtime.phase}`}
    data-app-id={runtime.activeAppId ?? undefined}
    onAnimationEnd={event => {
      if (event.target !== event.currentTarget) return;
      if (runtime.phase === "closing") {
        dispatch({ type: "ANIMATION_COMPLETE" });
        onClosed();
      } else if (runtime.phase === "launching" || runtime.phase === "resuming") {
        dispatch({ type: "ANIMATION_COMPLETE" });
      }
    }}
  >
    {statusBar}
    <div className="app-runtime-surface" aria-hidden="true" />
  </div>;
}
