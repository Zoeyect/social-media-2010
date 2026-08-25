import { FormEvent, PointerEvent, useEffect, useReducer, useRef, useState } from "react";
import bootLogoSrc from "../assets/historical/ios4.1/applelogo-iphone3,1-8B117.png?inline";
import lowBatterySrc from "../assets/device/low-battery-iphone4.png";
import { DeviceAudio } from "../audio/deviceAudio";
import { appRuntimeStateTransition, initialAppRuntimeState } from "../state/appRuntimeState";
import { DEVICE_CARRIER_CONFIG } from "../state/carrierConfig";
import { cameraRuntimeTransition, initialCameraRuntimeState } from "../state/cameraRuntime";
import type { CameraOwner } from "../state/cameraRuntime";
import { nextDueDeviceEvent, removeDeviceEvent, scheduleDeviceEvent } from "../state/deviceEventScheduler";
import { batteryPercent, BOOT_DURATION_MS, currentWarning, elapsedMs, formatDeviceDate, formatDeviceTime, formatLockScreenTime, hasReachedSessionTerminal, homeButtonTransition, initialSession, loadSession, longPowerTransition, POWER_HOLD_MS, saveSession, SESSION_DURATION_MS, Session, shortPowerTransition, simulatedDeviceDateTime } from "../state/deviceMachine";
import { folderStateTransition } from "../state/folderState";
import { multitaskingBarStateTransition } from "../state/multitaskingBarState";
import { initialMessagesState, messagesStateTransition } from "../state/messagesState";
import { createLockScreenModel } from "../state/lockScreenModel";
import { initialLockNotificationState, lockNotificationStateTransition } from "../state/lockNotificationState";
import type { ActiveLockNotification } from "../state/lockNotificationState";
import { messagesBadgeStateTransition } from "../state/messagesBadgeState";
import { initialSMSNotificationState, smsNotificationStateTransition } from "../state/smsNotificationState";
import { createSessionIdentity, SessionIdentityContext } from "../state/sessionIdentity";
import { createStatusBarState } from "../state/statusBarModel";
import { createSMSLockNotification, smsMessageReceived } from "../system/smsNotification";
import { LockScreen } from "./LockScreen";
import { CameraContainer } from "./CameraContainer";
import { LockScreenStatusPresentation } from "./LockScreenStatusPresentation";
import { AppLaunchContainer } from "./AppLaunchContainer";
import { MultitaskingBar } from "./MultitaskingBar";
import { MobileSMSContainer } from "./MobileSMSContainer";
import { SMSAlertOverlay } from "./SMSAlertOverlay";
import { SpringBoard } from "./SpringBoard";
import { StatusBar } from "./StatusBar";

const TERMINAL_DEPLETED_DISPLAY_MS = 1_500;
const AUTO_SLEEP_DELAY_MS = 60_000;
const AUTO_SLEEP_PHASES = new Set<Session["phase"]>(["locked", "springboard", "app"]);
const HOME_DOUBLE_PRESS_MS = 300;
const INITIAL_SMS_DELAY_MS = 60_000;
const MOM_REPLY_DELAY_MS = 30_000;
const SHUTDOWN_BLACK_SCREEN_MS = 500;
const TERMINAL_POWERED_OFF_MS = 500;
const INITIAL_SMS = { id: "mom-home-yet", sender: "Mom", message: "Home yet?", timestamp: "12:03 AM" } as const;
const MOM_REPLY_SMS = { id: "mom-sleep-early", sender: "Mom", message: "Good. Sleep early." } as const;

function loadRuntimeSession(): Session {
  const persisted = loadSession();
  if (persisted.phase === "shutdown" || persisted.returnToHeroPending) return initialSession;
  if (persisted.sessionStartEpochMs === null && persisted.phase !== "locked" && persisted.phase !== "booting") return persisted;
  return {
    ...initialSession,
    sessionIdentity: persisted.sessionIdentity,
    phase: persisted.sessionIdentity.name ? "booting" : "hero",
  };
}

export function App() {
  const [session, setSession] = useState<Session>(loadRuntimeSession);
  const [springBoardPage, setSpringBoardPage] = useState<0 | 1>(0);
  const [folderState, dispatchFolderEvent] = useReducer(folderStateTransition, "closed");
  const [appRuntime, dispatchAppRuntime] = useReducer(appRuntimeStateTransition, initialAppRuntimeState);
  const [cameraRuntime, dispatchCameraRuntime] = useReducer(cameraRuntimeTransition, initialCameraRuntimeState);
  const [multitaskingBar, dispatchMultitaskingBar] = useReducer(multitaskingBarStateTransition, "closed");
  const [messagesState, dispatchMessages] = useReducer(messagesStateTransition, initialMessagesState);
  const [messagesUnreadIds, dispatchMessagesBadge] = useReducer(messagesBadgeStateTransition, []);
  const [smsNotification, dispatchSMSNotification] = useReducer(smsNotificationStateTransition, initialSMSNotificationState);
  const [activeLockNotification, dispatchLockNotification] = useReducer(lockNotificationStateTransition, initialLockNotificationState);
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
  const cameraOwnerForApp = (appId: string | null): CameraOwner | null => appId === "camera"
    ? "cameraApp"
    : appId === "messages" && cameraRuntime.cameraPicker.phase !== "none"
      ? "cameraPicker"
      : null;

  useEffect(() => saveSession(session), [session]);
  useEffect(() => () => {
    if (pendingAppHomePress.current !== null) window.clearTimeout(pendingAppHomePress.current);
  }, []);
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 250); return () => clearInterval(id); }, []);
  useEffect(() => {
    const event = nextDueDeviceEvent(session.deviceEvents, elapsed);
    if (!event) return;
    const source = session.phase === "sleeping" || session.phase === "locked" ? "lockscreen" : "foreground";
    const displayingMomConversation = session.phase === "app"
      && appRuntime.activeAppId === "messages"
      && messagesState.view === "conversation";

    if (event.type === "initialSMS") {
      smsMessageReceived(INITIAL_SMS, source, {
        notificationDispatch: dispatchSMSNotification,
        badgeDispatch: dispatchMessagesBadge,
        messagesDispatch: dispatchMessages,
        lockNotificationDispatch: dispatchLockNotification,
      });
    } else if (messagesState.momReply === "pending" && displayingMomConversation) {
      dispatchMessages({ type: "DELIVER_MOM_REPLY" });
    } else if (messagesState.momReply === "pending") {
      smsMessageReceived(MOM_REPLY_SMS, source, {
        notificationDispatch: dispatchSMSNotification,
        badgeDispatch: dispatchMessagesBadge,
        messagesDispatch: dispatchMessages,
        lockNotificationDispatch: dispatchLockNotification,
      });
      dispatchMessages({ type: "MARK_MOM_REPLY_DELIVERED" });
    }
    update({
      deviceEvents: removeDeviceEvent(session.deviceEvents, event.id),
      ...(session.phase === "sleeping" ? { phase: "locked" as const } : {}),
    });
  }, [appRuntime.activeAppId, elapsed, messagesState.momReply, messagesState.view, session.deviceEvents, session.phase]);
  useEffect(() => {
    if ((session.phase !== "sleeping" && session.phase !== "locked") || smsNotification.status !== "alert-visible") return;
    dispatchSMSNotification({ type: "SHOW_PREVIEW" });
    dispatchLockNotification({
      type: "PRESENT",
      notification: createSMSLockNotification({
        id: smsNotification.notification.id,
        sender: smsNotification.notification.sender,
        message: smsNotification.notification.message,
      }),
    });
  }, [session.phase, smsNotification.status]);
  useEffect(() => {
    const displayingConversation = session.phase === "app"
      && appRuntime.activeAppId === "messages"
      && messagesState.view === "conversation";
    if (!displayingConversation || !smsNotification.notification) return;
    const messageId = smsNotification.notification.id;
    if (!messagesState.messages.some(message => message.id === messageId)) return;
    if (messagesUnreadIds.includes(messageId)) {
      dispatchMessagesBadge({ type: "MARK_READ", messageId });
    }
    if (smsNotification.notification?.id === messageId && smsNotification.status !== "opened") {
      dispatchSMSNotification({ type: "OPEN" });
    }
  }, [appRuntime.activeAppId, messagesState.messages, messagesState.view, messagesUnreadIds, session.phase, smsNotification.notification, smsNotification.status]);
  useEffect(() => {
    if (cameraRuntime.cameraApp.phase === "launching"
      && appRuntime.activeAppId === "camera"
      && appRuntime.phase === "running") {
      dispatchCameraRuntime({ type: "LAUNCH_COMPLETE", owner: "cameraApp" });
    }
    if (cameraRuntime.cameraPicker.phase === "launching"
      && appRuntime.activeAppId === "messages"
      && session.phase === "app") {
      dispatchCameraRuntime({ type: "LAUNCH_COMPLETE", owner: "cameraPicker" });
    }
  }, [appRuntime.activeAppId, appRuntime.phase, cameraRuntime.cameraApp.phase, cameraRuntime.cameraPicker.phase, session.phase]);
  useEffect(() => {
    if (cameraRuntime.cameraPicker.phase !== "returning") return;
    const frame = window.requestAnimationFrame(() => {
      dispatchCameraRuntime({ type: "RETURN_COMPLETE", owner: "cameraPicker" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [cameraRuntime.cameraPicker.phase]);
  useEffect(() => {
    if (session.sessionStartEpochMs === null || session.phase === "hero" || session.phase === "poweredOff" || session.phase === "booting" || session.phase === "shutdown") return;
    if (hasReachedSessionTerminal(session, now) && session.activeWarning !== 1 && !session.batteryCriticalPending) {
      update({ batteryCriticalPending: true });
    }
  }, [now, session.activeWarning, session.batteryCriticalPending, session.phase, session.sessionStartEpochMs]);
  useEffect(() => {
    if (!session.batteryCriticalPending || session.phase === "shutdown" || session.phase === "poweredOff") return;
    if (session.phase === "springboard" || session.phase === "app") {
      DeviceAudio.lowBatteryWarning();
      update({
        previousPhase: session.phase,
        phase: "lowBatteryWarning",
        activeWarning: 1,
        batteryCriticalPending: false,
        batteryCriticalRevealAtMs: null,
      });
      return;
    }
    if (session.phase === "locked" || session.phase === "sleeping" || session.phase === "lowBatteryWarning" || session.phase === "powerOffConfirm") {
      update({
        previousPhase: null,
        phase: "shutdown",
        shutdownReason: "battery",
        activeWarning: null,
        batteryCriticalPending: false,
        batteryCriticalRevealAtMs: null,
      });
    }
  }, [session.batteryCriticalPending, session.phase]);
  useEffect(() => {
    if (session.sessionStartEpochMs === null || elapsed >= SESSION_DURATION_MS || session.activeWarning !== null) return;
    if (session.phase !== "springboard" && session.phase !== "app") return;
    const warning = currentWarning(elapsed, session.dismissedWarnings);
    if (warning === null) return;
    DeviceAudio.lowBatteryWarning();
    update({
      activeWarning: warning,
    });
  }, [elapsed, session.activeWarning, session.dismissedWarnings, session.phase, session.sessionStartEpochMs]);
  useEffect(() => {
    if (session.phase !== "lowBatteryWarning" || session.activeWarning !== 1) return;
    const id = window.setTimeout(() => {
      update({
        previousPhase: null,
        phase: "shutdown",
        shutdownReason: "battery",
        activeWarning: null,
        batteryCriticalPending: false,
        batteryCriticalRevealAtMs: null,
      });
    }, TERMINAL_DEPLETED_DISPLAY_MS);
    return () => window.clearTimeout(id);
  }, [session.activeWarning, session.phase]);
  useEffect(() => {
    if (session.phase !== "booting") return;
    const id = window.setTimeout(() => setSession(current => {
      if (current.phase !== "booting") return current;
      const startsSession = current.sessionStartEpochMs === null;
      return {
        ...current,
        phase: "locked",
        sessionStartEpochMs: startsSession ? Date.now() : current.sessionStartEpochMs,
        deviceEvents: startsSession
          ? scheduleDeviceEvent(current.deviceEvents, {
              id: "initial-sms-mom-home-yet",
              type: "initialSMS",
              dueElapsedMs: INITIAL_SMS_DELAY_MS,
            })
          : current.deviceEvents,
      };
    }), BOOT_DURATION_MS);
    return () => clearTimeout(id);
  }, [session.phase]);
  useEffect(() => {
    if (session.phase !== "shutdown") return;
    dispatchMessages({ type: "RESET_RUNTIME" });
    dispatchMessagesBadge({ type: "RESET" });
    dispatchSMSNotification({ type: "RESET" });
    dispatchLockNotification({ type: "RESET" });
    dispatchAppRuntime({ type: "RESET" });
    dispatchCameraRuntime({ type: "RESET", owner: "cameraApp" });
    dispatchCameraRuntime({ type: "RESET", owner: "cameraPicker" });
    dispatchMultitaskingBar("RESET");
    dispatchFolderEvent("CLOSE");
    dispatchFolderEvent("ANIMATION_COMPLETE");
    setUnlockReturnAppId(null);
    setSpringBoardPage(0);
    setActivityRevision(0);
    const shutdownReason = session.shutdownReason;
    const id = window.setTimeout(() => setSession({
      ...initialSession,
      sessionIdentity: initialSession.sessionIdentity,
      phase: "poweredOff",
      shutdownReason,
      returnToHeroPending: true,
    }), SHUTDOWN_BLACK_SCREEN_MS);
    return () => clearTimeout(id);
  }, [session.phase, session.shutdownReason]);
  useEffect(() => {
    if (session.phase !== "poweredOff" || !session.returnToHeroPending) return;
    const id = window.setTimeout(() => setSession({ ...initialSession }), TERMINAL_POWERED_OFF_MS);
    return () => window.clearTimeout(id);
  }, [session.phase, session.returnToHeroPending]);
  useEffect(() => {
    if (!AUTO_SLEEP_PHASES.has(session.phase)) return;
    const id = window.setTimeout(() => {
      const returnAppId = session.phase === "app" ? appRuntime.activeAppId : null;
      setUnlockReturnAppId(returnAppId);
      if (returnAppId) {
        const cameraOwner = cameraOwnerForApp(returnAppId);
        if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
        dispatchAppRuntime({ type: "SUSPEND" });
      }
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
    if (runtimeMustReset && cameraRuntime.cameraApp.phase !== "none") {
      dispatchCameraRuntime({ type: "RESET", owner: "cameraApp" });
    }
    if (runtimeMustReset && cameraRuntime.cameraPicker.phase !== "none") {
      dispatchCameraRuntime({ type: "RESET", owner: "cameraPicker" });
    }
    if (session.phase !== "app" && !appTemporarilyCoveredByPowerConfirmation && multitaskingBar !== "closed") {
      dispatchMultitaskingBar("RESET");
    }
    if (session.phase !== "app" && !appTemporarilyCoveredByPowerConfirmation && pendingAppHomePress.current !== null) {
      window.clearTimeout(pendingAppHomePress.current);
      pendingAppHomePress.current = null;
    }
  }, [appRuntime.phase, cameraRuntime.cameraApp.phase, cameraRuntime.cameraPicker.phase, multitaskingBar, session.phase, session.previousPhase]);

  const recordInteraction = () => setActivityRevision(revision => revision + 1);
  const launchSpringBoardApp = (appId: string) => {
    if (appRuntime.phase !== "none" && appRuntime.phase !== "suspended") return;
    const cameraOwner = cameraOwnerForApp(appId);
    if (cameraOwner) {
      dispatchCameraRuntime({
        type: cameraRuntime[cameraOwner].phase === "none" ? "LAUNCH" : "RESUME",
        owner: cameraOwner,
      });
    }
    dispatchAppRuntime({ type: "LAUNCH", appId });
    update({ phase: "app" });
  };
  const openLockNotificationTarget = (notification: ActiveLockNotification) => {
    dispatchLockNotification({ type: "CLEAR" });
    if (notification.target.type === "messagesConversation") {
      openMessagesConversation(true);
      return;
    }
    const targetAppId = notification.target.appId;
    const targetIsRetained = appRuntime.activeAppId === targetAppId
      || appRuntime.suspendedAppIds.includes(targetAppId);
    if (targetIsRetained) {
      const cameraOwner = cameraOwnerForApp(targetAppId);
      if (cameraOwner) dispatchCameraRuntime({ type: "RESUME", owner: cameraOwner });
      dispatchAppRuntime({ type: "RESUME", appId: targetAppId });
      update({ phase: "app" });
    } else {
      launchSpringBoardApp(targetAppId);
    }
    setUnlockReturnAppId(null);
  };
  const openMessagesConversation = (fromNotification = false) => {
    if (fromNotification) dispatchSMSNotification({ type: "BEGIN_VIEW" });
    dispatchMessages({ type: "OPEN_CONVERSATION" });

    if (appRuntime.activeAppId === "messages") {
      if (appRuntime.phase === "suspended") dispatchAppRuntime({ type: "RESUME", appId: "messages" });
      else if (appRuntime.phase === "none") dispatchAppRuntime({ type: "LAUNCH", appId: "messages" });
    } else {
      if (appRuntime.phase === "running" || appRuntime.phase === "launching" || appRuntime.phase === "resuming") {
        const cameraOwner = cameraOwnerForApp(appRuntime.activeAppId);
        if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
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
    if (name) update({
      sessionIdentity: createSessionIdentity(name),
      phase: "poweredOff",
      shutdownReason: null,
      returnToHeroPending: false,
    });
  };

  const beginPower = () => {
    if (session.returnToHeroPending || session.phase === "hero" || session.phase === "booting" || session.phase === "powerOffConfirm" || session.phase === "shutdown") return;
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
          if (returnAppId) {
            const cameraOwner = cameraOwnerForApp(returnAppId);
            if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
            dispatchAppRuntime({ type: "SUSPEND" });
          }
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
        const cameraOwner = cameraOwnerForApp(appRuntime.activeAppId);
        if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
        dispatchAppRuntime({ type: "SUSPEND" });
        update({ phase: "springboard" });
      }, HOME_DOUBLE_PRESS_MS);
      return;
    }
    if (session.phase === "app" && (appRuntime.phase === "launching" || appRuntime.phase === "resuming")) {
      const cameraOwner = cameraOwnerForApp(appRuntime.activeAppId);
      if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
      dispatchAppRuntime({ type: "SUSPEND" });
      update({ phase: "springboard" });
      return;
    }
    const transition = homeButtonTransition(session);
    if (transition) update(transition);
  };

  if (session.phase === "hero") return <main className="hero"><form onSubmit={submitName}><label htmlFor="name">What was your name?</label><input id="name" name="name" autoFocus autoComplete="name" /><span>Press Enter</span></form></main>;

  return <SessionIdentityContext.Provider value={session.sessionIdentity}><main className="stage">
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
        {session.phase === "poweredOff" && (session.returnToHeroPending
          ? <div className="dead" />
          : <div className="off"><p>Press and hold the power button.</p><div className="hold"><i style={{ width: `${powerProgress * 100}%` }} /></div></div>)}
        {session.phase === "booting" && <div className="boot"><BootLogo /></div>}
        {session.phase === "locked" && <LockScreen
          model={lockScreenModel}
          activeLockNotification={activeLockNotification}
          onViewNotification={openLockNotificationTarget}
          onUnlock={() => {
            const canResume = unlockReturnAppId !== null
              && (appRuntime.activeAppId === unlockReturnAppId || appRuntime.suspendedAppIds.includes(unlockReturnAppId));
            if (canResume && unlockReturnAppId) {
              const cameraOwner = cameraOwnerForApp(unlockReturnAppId);
              if (cameraOwner) dispatchCameraRuntime({ type: "RESUME", owner: cameraOwner });
              dispatchAppRuntime({ type: "RESUME", appId: unlockReturnAppId });
            }
            DeviceAudio.unlock();
            update({
              phase: canResume ? "app" : "springboard",
              batteryCriticalRevealAtMs: null,
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
          onLaunchApp={launchSpringBoardApp}
        />}
        {session.phase === "app" && <AppLaunchContainer
          runtime={appRuntime}
          dispatch={dispatchAppRuntime}
          onClosed={() => update({ phase: "springboard" })}
        >
          {appRuntime.activeAppId === "camera" && cameraRuntime.cameraApp.phase !== "none" && <CameraContainer
            owner="cameraApp"
            session={cameraRuntime.cameraApp}
          />}
          {appRuntime.activeAppId === "messages" && <MobileSMSContainer
            state={messagesState}
            dispatch={dispatchMessages}
            cameraPickerActive={cameraRuntime.cameraPicker.phase !== "none"}
            onOpenCameraPicker={() => dispatchCameraRuntime({ type: "LAUNCH", owner: "cameraPicker" })}
            onScheduleMomReply={() => setSession(current => ({
              ...current,
              deviceEvents: scheduleDeviceEvent(current.deviceEvents, {
                id: "mom-reply-good-sleep-early",
                type: "momReply",
                dueElapsedMs: elapsedMs(current, Date.now()) + MOM_REPLY_DELAY_MS,
              }),
            }))}
          />}
          {appRuntime.activeAppId === "messages" && cameraRuntime.cameraPicker.phase !== "none" && <CameraContainer
            owner="cameraPicker"
            session={cameraRuntime.cameraPicker}
            onCancel={() => {
              dispatchCameraRuntime({ type: "CANCEL", owner: "cameraPicker" });
            }}
          />}
        </AppLaunchContainer>}
        {session.phase === "app" && <MultitaskingBar
          state={multitaskingBar}
          appRuntime={appRuntime}
          dispatch={dispatchMultitaskingBar}
          onSelectApp={appId => {
            dispatchMultitaskingBar("CLOSE");
            if (appRuntime.activeAppId !== appId || appRuntime.phase !== "running") {
              const cameraOwner = cameraOwnerForApp(appId);
              if (cameraOwner) dispatchCameraRuntime({ type: "RESUME", owner: cameraOwner });
              dispatchAppRuntime({ type: "RESUME", appId });
            }
          }}
        />}
        {session.phase === "sleeping" && <div className="dead" />}
        {session.phase === "powerOffConfirm" && <PowerOffConfirm onCancel={() => update({ phase: session.previousPhase ?? "locked", previousPhase: null })} onConfirm={() => update({ phase: "shutdown", shutdownReason: "manual" })} />}
        {session.phase === "shutdown" && <div className="dead" />}
        {session.phase === "lowBatteryWarning" && <img className="low-battery-screen" src={lowBatterySrc} alt="" aria-hidden="true" />}
        {(session.activeWarning === 20 || session.activeWarning === 10) && (session.phase === "springboard" || session.phase === "app") && <LowBatteryAlert
          level={session.activeWarning}
          onDismiss={() => setSession(current => {
            const warning = current.activeWarning;
            if (warning !== 20 && warning !== 10) return current;
            return {
              ...current,
              activeWarning: null,
              dismissedWarnings: current.dismissedWarnings.includes(warning)
                ? current.dismissedWarnings
                : [...current.dismissedWarnings, warning],
            };
          })}
        />}
        {smsNotification.status === "alert-visible" && session.phase !== "locked" && session.phase !== "sleeping" && <SMSAlertOverlay
          notificationState={smsNotification}
          onClose={() => dispatchSMSNotification({ type: "DISMISS" })}
          onView={() => openMessagesConversation(true)}
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
  </main></SessionIdentityContext.Provider>;
}

function LowBatteryAlert({ level, onDismiss }: { level: 20 | 10; onDismiss: () => void }) {
  return <div className="sms-system-alert-layer low-battery-alert-layer" role="presentation">
    <section className="sms-alert-sheet low-battery-alert" role="alertdialog" aria-modal="true" aria-labelledby="low-battery-alert-title" aria-describedby="low-battery-alert-message">
      <strong id="low-battery-alert-title" className="sms-alert-title">Low Battery</strong>
      <div className="sms-alert-content">
        <p id="low-battery-alert-message" className="sms-alert-body">{level}% of battery remaining</p>
      </div>
      <div className="sms-alert-actions low-battery-alert-actions">
        <button type="button" onClick={onDismiss}>Dismiss</button>
      </div>
    </section>
  </div>;
}

function BootLogo() {
  return <img className="boot-logo" src={bootLogoSrc} alt="" aria-hidden="true" />;
}

function PowerOffConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return <div className="modal-shade"><div className="battery-alert"><strong>Power Off</strong><p>Power-off UI artwork: HOLD.</p><button onClick={onConfirm}>Confirm power off</button><button onClick={onCancel}>Cancel</button></div></div>;
}
