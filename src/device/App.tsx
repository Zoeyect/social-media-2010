import { FormEvent, PointerEvent, useEffect, useReducer, useRef, useState } from "react";
import bootLogoSrc from "../assets/historical/ios4.1/applelogo-iphone3,1-8B117.png?inline";
import lowBatterySrc from "../assets/device/low-battery-iphone4.png";
import { DeviceAudio } from "../audio/deviceAudio";
import { appRuntimeStateTransition, initialAppRuntimeState } from "../state/appRuntimeState";
import { DEVICE_CARRIER_CONFIG } from "../state/carrierConfig";
import { batteryPercent, BOOT_DURATION_MS, elapsedMs, formatDeviceDate, formatDeviceTime, formatLockScreenTime, homeButtonTransition, initialSession, loadSession, longPowerTransition, POWER_HOLD_MS, saveSession, SESSION_DURATION_MS, Session, shortPowerTransition, simulatedDeviceDateTime } from "../state/deviceMachine";
import { folderStateTransition } from "../state/folderState";
import { multitaskingBarStateTransition } from "../state/multitaskingBarState";
import { initialMessagesState, messagesStateTransition } from "../state/messagesState";
import { createLockScreenModel } from "../state/lockScreenModel";
import { messagesBadgeStateTransition } from "../state/messagesBadgeState";
import { smsNotificationStateTransition } from "../state/smsNotificationState";
import { createStatusBarState } from "../state/statusBarModel";
import { smsMessageReceived } from "../system/smsNotification";
import { LockScreen } from "./LockScreen";
import { LockScreenStatusPresentation } from "./LockScreenStatusPresentation";
import { AppLaunchContainer } from "./AppLaunchContainer";
import { MultitaskingBar } from "./MultitaskingBar";
import { MessagesExperience } from "./MessagesExperience";
import { SMSAlertOverlay } from "./SMSAlertOverlay";
import { SpringBoard } from "./SpringBoard";
import { StatusBar } from "./StatusBar";

const LOW_BATTERY_REVEAL_DELAY_MS = 1_500;
const AUTO_SLEEP_DELAY_MS = 60_000;
const AUTO_SLEEP_PHASES = new Set<Session["phase"]>(["locked", "springboard", "app"]);
const HOME_DOUBLE_PRESS_MS = 300;
const INITIAL_SMS_DELAY_MS = 3 * 60_000;
const INITIAL_SMS = { id: "mom-home-yet", sender: "Mom", message: "Home yet?" } as const;

export function App() {
  const [session, setSession] = useState<Session>(loadSession);
  const [springBoardPage, setSpringBoardPage] = useState<0 | 1>(0);
  const [folderState, dispatchFolderEvent] = useReducer(folderStateTransition, "closed");
  const [appRuntime, dispatchAppRuntime] = useReducer(appRuntimeStateTransition, initialAppRuntimeState);
  const [multitaskingBar, dispatchMultitaskingBar] = useReducer(multitaskingBarStateTransition, "closed");
  const [messagesState, dispatchMessages] = useReducer(messagesStateTransition, initialMessagesState);
  const [messagesUnreadIds, dispatchMessagesBadge] = useReducer(messagesBadgeStateTransition, []);
  const [smsNotification, dispatchSMSNotification] = useReducer(smsNotificationStateTransition, null);
  const [now, setNow] = useState(Date.now());
  const [powerProgress, setPowerProgress] = useState(0);
  const [homePressed, setHomePressed] = useState(false);
  const [activityRevision, setActivityRevision] = useState(0);
  const [unlockReturnAppId, setUnlockReturnAppId] = useState<string | null>(null);
  const powerStarted = useRef<number | null>(null);
  const powerFrame = useRef<number | null>(null);
  const homePointer = useRef<number | null>(null);
  const pendingAppHomePress = useRef<number | null>(null);
  const elapsed = elapsedMs(session, now);
  const deviceDateTime = simulatedDeviceDateTime(elapsed);
  const deviceStatusTime = formatDeviceTime(deviceDateTime);
  const lockScreenTime = formatLockScreenTime(deviceDateTime);
  const deviceDate = formatDeviceDate(deviceDateTime);
  const statusBarState = createStatusBarState({
    signalStrength: 5,
    network: DEVICE_CARRIER_CONFIG.networkType,
    bluetoothEnabled: false,
    batteryPercentage: batteryPercent(elapsed),
    charging: false,
    carrier: DEVICE_CARRIER_CONFIG.carrier,
    carrierArtworkSrc: DEVICE_CARRIER_CONFIG.carrierArtworkSrc,
    clock: deviceStatusTime,
  });
  const lockScreenModel = createLockScreenModel(lockScreenTime, deviceDate, statusBarState);

  const update = (change: Partial<Session>) => setSession(s => ({ ...s, ...change }));

  useEffect(() => saveSession(session), [session]);
  useEffect(() => () => {
    if (pendingAppHomePress.current !== null) window.clearTimeout(pendingAppHomePress.current);
  }, []);
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 250); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (!session.unlockEpochMs || elapsed < INITIAL_SMS_DELAY_MS || smsNotification !== null) return;
    const source = session.phase === "sleeping" || session.phase === "locked" ? "lockscreen" : "foreground";
    smsMessageReceived(INITIAL_SMS, source, {
      notificationDispatch: dispatchSMSNotification,
      badgeDispatch: dispatchMessagesBadge,
      messagesDispatch: dispatchMessages,
    });
    if (session.phase === "sleeping") update({ phase: "locked" });
  }, [elapsed, session.phase, session.unlockEpochMs, smsNotification]);
  useEffect(() => {
    if (messagesState.momReply !== "pending") return;
    const id = window.setTimeout(() => {
      dispatchMessages({ type: "RECEIVE_MOM_REPLY" });
      DeviceAudio.notificationReceived("message");
    }, 1_000);
    return () => window.clearTimeout(id);
  }, [messagesState.momReply]);
  useEffect(() => {
    if (!session.unlockEpochMs || session.phase === "hero" || session.phase === "poweredOff" || session.phase === "booting" || session.phase === "powerOffConfirm" || session.phase === "shutdown") return;
    if (elapsed >= SESSION_DURATION_MS && session.activeWarning !== 1 && !session.batteryCriticalPending) {
      update({ batteryCriticalPending: true });
    }
  }, [elapsed, session.activeWarning, session.batteryCriticalPending, session.phase, session.unlockEpochMs]);
  useEffect(() => {
    if (session.phase !== "springboard" || !session.batteryCriticalPending || session.batteryCriticalRevealAtMs === null) return;
    const delay = Math.max(0, session.batteryCriticalRevealAtMs - Date.now());
    const id = window.setTimeout(() => update({
      previousPhase: "springboard",
      phase: "lowBatteryWarning",
      activeWarning: 1,
      batteryCriticalPending: false,
      batteryCriticalRevealAtMs: null,
    }), delay);
    return () => window.clearTimeout(id);
  }, [session.batteryCriticalPending, session.batteryCriticalRevealAtMs, session.phase]);
  useEffect(() => {
    if (session.phase !== "booting") return;
    const id = window.setTimeout(() => update({ phase: "locked" }), BOOT_DURATION_MS);
    return () => clearTimeout(id);
  }, [session.phase]);
  useEffect(() => {
    if (session.phase !== "shutdown") return;
    const id = window.setTimeout(() => setSession({ ...initialSession }), 500);
    return () => clearTimeout(id);
  }, [session.phase]);
  useEffect(() => {
    if (!AUTO_SLEEP_PHASES.has(session.phase)) return;
    const id = window.setTimeout(() => {
      const returnAppId = session.phase === "app" ? appRuntime.activeAppId : null;
      setUnlockReturnAppId(returnAppId);
      if (returnAppId) dispatchAppRuntime({ type: "SUSPEND" });
      dispatchMultitaskingBar("RESET");
      DeviceAudio.lock();
      setSession(current => AUTO_SLEEP_PHASES.has(current.phase) ? { ...current, phase: "sleeping" } : current);
    }, AUTO_SLEEP_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [activityRevision, appRuntime.activeAppId, session.phase]);
  useEffect(() => {
    const appTemporarilyCoveredByPowerConfirmation = session.phase === "powerOffConfirm" && session.previousPhase === "app";
    const runtimeMustReset = session.phase === "hero" || session.phase === "poweredOff" || session.phase === "booting" || session.phase === "shutdown";
    if (runtimeMustReset && appRuntime.phase !== "none") {
      dispatchAppRuntime({ type: "RESET" });
    }
    if (session.phase !== "app" && !appTemporarilyCoveredByPowerConfirmation && multitaskingBar !== "closed") {
      dispatchMultitaskingBar("RESET");
    }
    if (session.phase !== "app" && !appTemporarilyCoveredByPowerConfirmation && pendingAppHomePress.current !== null) {
      window.clearTimeout(pendingAppHomePress.current);
      pendingAppHomePress.current = null;
    }
  }, [appRuntime.phase, multitaskingBar, session.phase, session.previousPhase]);

  const recordInteraction = () => setActivityRevision(revision => revision + 1);
  const openMessagesConversation = () => {
    dispatchMessages({ type: "OPEN_CONVERSATION" });
    if (messagesState.initialMessage) {
      dispatchMessagesBadge({ type: "MARK_READ", messageId: messagesState.initialMessage.id });
    }
    if (smsNotification) dispatchSMSNotification({ type: "VIEW" });

    if (appRuntime.activeAppId === "messages") {
      if (appRuntime.phase === "suspended") dispatchAppRuntime({ type: "RESUME", appId: "messages" });
      else if (appRuntime.phase === "none") dispatchAppRuntime({ type: "LAUNCH", appId: "messages" });
    } else {
      if (appRuntime.phase === "running" || appRuntime.phase === "launching" || appRuntime.phase === "resuming") {
        dispatchAppRuntime({ type: "SUSPEND" });
      }
      dispatchAppRuntime({ type: "LAUNCH", appId: "messages" });
    }
    setUnlockReturnAppId(null);
    update({ phase: "app" });
  };
  const continueDeviceInteraction = (event: PointerEvent<HTMLElement>) => {
    if (event.buttons !== 0) recordInteraction();
  };

  const submitName = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    if (name) update({ userName: name, phase: "poweredOff" });
  };

  const beginPower = () => {
    if (session.phase === "hero" || session.phase === "booting" || session.phase === "powerOffConfirm" || session.phase === "shutdown") return;
    powerStarted.current = performance.now();
    const tick = () => {
      if (powerStarted.current === null) return;
      const progress = Math.min(1, (performance.now() - powerStarted.current) / POWER_HOLD_MS);
      if (session.phase === "poweredOff") setPowerProgress(progress);
      if (progress === 1) {
        powerStarted.current = null;
        if (session.phase === "poweredOff") update({ phase: "booting" });
        else {
          const transition = longPowerTransition(session);
          if (transition) update(transition);
        }
        return;
      }
      powerFrame.current = requestAnimationFrame(tick);
    };
    powerFrame.current = requestAnimationFrame(tick);
  };

  const endPower = () => {
    if (powerStarted.current !== null && session.phase !== "poweredOff") {
      const transition = shortPowerTransition(session);
      if (transition) {
        if (transition.phase === "sleeping") {
          const returnAppId = session.phase === "app" ? appRuntime.activeAppId : null;
          setUnlockReturnAppId(returnAppId);
          if (returnAppId) dispatchAppRuntime({ type: "SUSPEND" });
          dispatchMultitaskingBar("RESET");
          DeviceAudio.lock();
        }
        update(transition);
      }
    }
    powerStarted.current = null;
    if (powerFrame.current) cancelAnimationFrame(powerFrame.current);
    if (session.phase === "poweredOff") setPowerProgress(0);
  };
  const cancelPower = () => {
    powerStarted.current = null;
    if (powerFrame.current) cancelAnimationFrame(powerFrame.current);
    if (session.phase === "poweredOff") setPowerProgress(0);
  };

  const homeEnabled = session.phase === "locked" || session.phase === "springboard" || session.phase === "app" || session.phase === "sleeping";
  const beginHomePress = (event: PointerEvent<HTMLButtonElement>) => {
    if (!homeEnabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    homePointer.current = event.pointerId;
    setHomePressed(true);
  };
  const cancelHomePress = () => {
    homePointer.current = null;
    setHomePressed(false);
  };
  const endHomePress = (event: PointerEvent<HTMLButtonElement>) => {
    if (homePointer.current !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    homePointer.current = null;
    setHomePressed(false);
    if (session.phase === "springboard" && (folderState === "open" || folderState === "opening")) {
      dispatchFolderEvent("CLOSE");
      return;
    }
    if (session.phase === "app" && multitaskingBar !== "closed") {
      dispatchMultitaskingBar("CLOSE");
      return;
    }
    if (session.phase === "app" && appRuntime.phase === "running") {
      if (pendingAppHomePress.current !== null) {
        window.clearTimeout(pendingAppHomePress.current);
        pendingAppHomePress.current = null;
        dispatchMultitaskingBar("OPEN");
        return;
      }
      pendingAppHomePress.current = window.setTimeout(() => {
        pendingAppHomePress.current = null;
        dispatchAppRuntime({ type: "SUSPEND" });
        update({ phase: "springboard" });
      }, HOME_DOUBLE_PRESS_MS);
      return;
    }
    if (session.phase === "app" && (appRuntime.phase === "launching" || appRuntime.phase === "resuming")) {
      dispatchAppRuntime({ type: "SUSPEND" });
      update({ phase: "springboard" });
      return;
    }
    const transition = homeButtonTransition(session);
    if (transition) update(transition);
  };

  if (session.phase === "hero") return <main className="hero"><form onSubmit={submitName}><label htmlFor="name">What was your name?</label><input id="name" name="name" autoFocus autoComplete="name" /><span>Press Enter</span></form></main>;

  return <main className="stage">
    <section
      className="device"
      aria-label="Black iPhone 4"
      onPointerDownCapture={recordInteraction}
      onPointerMoveCapture={continueDeviceInteraction}
      onPointerUpCapture={recordInteraction}
      onPointerCancelCapture={recordInteraction}
    >
      <button className="power" aria-label="Power button" onPointerDown={beginPower} onPointerUp={endPower} onPointerCancel={cancelPower} onPointerLeave={cancelPower} />
      <div className="speaker" /><div className="camera" />
      <div className={`screen ${session.phase}`}>
        {(session.phase === "locked" || session.phase === "springboard" || session.phase === "app") && <div className="device-status-bar-layer">
          {session.phase === "locked"
            ? <LockScreenStatusPresentation model={lockScreenModel} />
            : <StatusBar state={statusBarState} />}
        </div>}
        {session.phase === "poweredOff" && <div className="off"><p>Press and hold the power button.</p><div className="hold"><i style={{ width: `${powerProgress * 100}%` }} /></div></div>}
        {session.phase === "booting" && <div className="boot"><BootLogo /></div>}
        {session.phase === "locked" && <LockScreen
          model={lockScreenModel}
          smsNotification={smsNotification}
          onViewSMS={openMessagesConversation}
          onUnlock={() => {
            const canResume = unlockReturnAppId !== null
              && (appRuntime.activeAppId === unlockReturnAppId || appRuntime.suspendedAppIds.includes(unlockReturnAppId));
            if (canResume && unlockReturnAppId) dispatchAppRuntime({ type: "RESUME", appId: unlockReturnAppId });
            DeviceAudio.unlock();
            update({
              phase: canResume ? "app" : "springboard",
              unlockEpochMs: session.unlockEpochMs ?? Date.now(),
              batteryCriticalRevealAtMs: !canResume && session.batteryCriticalPending
                ? Date.now() + LOW_BATTERY_REVEAL_DELAY_MS
                : null,
            });
            setUnlockReturnAppId(null);
          }}
        />}
        {session.phase === "springboard" && <SpringBoard
          currentPage={springBoardPage}
          onPageChange={setSpringBoardPage}
          folderState={folderState}
          dispatchFolderEvent={dispatchFolderEvent}
          messagesBadgeCount={messagesUnreadIds.length}
          onLaunchApp={appId => {
            if (appRuntime.phase !== "none" && appRuntime.phase !== "suspended") return;
            dispatchAppRuntime({ type: "LAUNCH", appId });
            update({ phase: "app" });
          }}
        />}
        {session.phase === "app" && <AppLaunchContainer
          runtime={appRuntime}
          dispatch={dispatchAppRuntime}
          onClosed={() => update({ phase: "springboard" })}
        >
          {appRuntime.activeAppId === "messages" && <MessagesExperience
            state={messagesState}
            dispatch={dispatchMessages}
            onOpenConversation={openMessagesConversation}
          />}
        </AppLaunchContainer>}
        {session.phase === "app" && <MultitaskingBar
          state={multitaskingBar}
          appRuntime={appRuntime}
          dispatch={dispatchMultitaskingBar}
          onSelectApp={appId => {
            dispatchMultitaskingBar("CLOSE");
            if (appRuntime.activeAppId !== appId || appRuntime.phase !== "running") {
              dispatchAppRuntime({ type: "RESUME", appId });
            }
          }}
        />}
        {session.phase === "sleeping" && <div className="dead" />}
        {session.phase === "powerOffConfirm" && <PowerOffConfirm onCancel={() => update({ phase: session.previousPhase ?? "locked", previousPhase: null })} onConfirm={() => update({ phase: "shutdown" })} />}
        {session.phase === "shutdown" && <div className="dead" />}
        {session.phase === "lowBatteryWarning" && <img className="low-battery-screen" src={lowBatterySrc} alt="" aria-hidden="true" />}
        {smsNotification?.status === "presenting" && session.phase !== "locked" && session.phase !== "sleeping" && <SMSAlertOverlay
          notification={smsNotification}
          onClose={() => dispatchSMSNotification({ type: "DISMISS" })}
          onView={openMessagesConversation}
        />}
      </div>
      <button
        className={`home${homePressed ? " is-pressed" : ""}`}
        aria-label="Home button"
        aria-disabled={!homeEnabled}
        tabIndex={-1}
        onPointerDown={beginHomePress}
        onPointerUp={endHomePress}
        onPointerCancel={cancelHomePress}
        onPointerLeave={cancelHomePress}
        onKeyDown={event => event.preventDefault()}
        onKeyUp={event => event.preventDefault()}
      ><i /></button>
    </section>
    <aside><strong>SOCIAL MEDIA, 2010</strong><span>Z.tokyo</span></aside>
  </main>;
}

function BootLogo() {
  return <img className="boot-logo" src={bootLogoSrc} alt="" aria-hidden="true" />;
}

function PowerOffConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return <div className="modal-shade"><div className="battery-alert"><strong>Power Off</strong><p>Power-off UI artwork: HOLD.</p><button onClick={onConfirm}>Confirm power off</button><button onClick={onCancel}>Cancel</button></div></div>;
}
