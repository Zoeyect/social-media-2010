import { Dispatch, PointerEvent, useEffect, useRef } from "react";
import { SPRINGBOARD_SOCIAL_APPS, SpringBoardSocialApp } from "../data/springBoardSocialApps";
import { AppRuntimeState } from "../state/appRuntimeState";
import { MultitaskingBarEvent, MultitaskingBarState } from "../state/multitaskingBarState";

const EDITING_HOLD_MS = 500;

type MultitaskingBarProps = {
  state: MultitaskingBarState;
  appRuntime: AppRuntimeState;
  dispatch: Dispatch<MultitaskingBarEvent>;
  onSelectApp: (appId: string) => void;
};

export function MultitaskingBar({ state, appRuntime, dispatch, onSelectApp }: MultitaskingBarProps) {
  const editingTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (editingTimer.current !== null) window.clearTimeout(editingTimer.current);
  }, []);
  if (state === "closed") return null;

  const retainedIds = new Set([
    ...appRuntime.suspendedAppIds,
    ...(appRuntime.activeAppId ? [appRuntime.activeAppId] : []),
  ]);
  const visibleApps = appRuntime.recentAppIds
    .filter(appId => retainedIds.has(appId))
    .map(appId => SPRINGBOARD_SOCIAL_APPS.find(app => app.id === appId))
    .filter((app): app is SpringBoardSocialApp & { iconSrc: string } => Boolean(
      app?.iconStatus === "READY" && app.available && app.iconSrc,
    ));

  const cancelEditingTimer = () => {
    if (editingTimer.current !== null) window.clearTimeout(editingTimer.current);
    editingTimer.current = null;
  };
  const beginEditingTimer = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || state !== "open") return;
    cancelEditingTimer();
    editingTimer.current = window.setTimeout(() => {
      editingTimer.current = null;
      dispatch("ENTER_EDITING");
    }, EDITING_HOLD_MS);
  };

  return <div
    className={`multitasking-bar is-${state}`}
    aria-label="Multitasking bar"
    onAnimationEnd={event => {
      if (event.target === event.currentTarget && state === "opening") dispatch("ANIMATION_COMPLETE");
    }}
  >
    <div className="multitasking-icon-strip">
      {visibleApps.map(app => <div
        className="multitasking-icon-slot"
        data-app-id={app.id}
        key={app.id}
        onPointerDown={beginEditingTimer}
        onPointerUp={cancelEditingTimer}
        onPointerCancel={cancelEditingTimer}
        onPointerLeave={cancelEditingTimer}
        onClick={() => {
          if (state !== "editing") onSelectApp(app.id);
        }}
      >
        <img className="multitasking-app-icon" src={app.iconSrc} alt={app.name} />
        {state === "editing" && <button
          className="multitasking-delete-control"
          aria-label={`Remove ${app.name} from multitasking`}
          onClick={event => event.preventDefault()}
        >−</button>}
      </div>)}
    </div>
  </div>;
}
