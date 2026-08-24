import { FormEvent, PointerEvent, useEffect, useReducer, useRef, useState } from "react";
import bootLogoSrc from "../assets/historical/ios4.1/applelogo-iphone3,1-8B117.png?inline";
import lowBatterySrc from "../assets/device/low-battery-iphone4.png";
import { batteryPercent, BOOT_DURATION_MS, elapsedMs, formatDeviceDate, formatDeviceTime, homeButtonTransition, initialSession, loadSession, longPowerTransition, POWER_HOLD_MS, saveSession, SESSION_DURATION_MS, Session, shortPowerTransition, simulatedDeviceDateTime } from "../state/deviceMachine";
import { folderStateTransition } from "../state/folderState";
import { createStatusBarState } from "../state/statusBarModel";
import { LockScreen } from "./LockScreen";
import { SpringBoard } from "./SpringBoard";
import { StatusBar } from "./StatusBar";

const LOW_BATTERY_REVEAL_DELAY_MS = 1_500;
const AUTO_SLEEP_DELAY_MS = 60_000;
const AUTO_SLEEP_PHASES = new Set<Session["phase"]>(["locked", "springboard", "app"]);

export function App() {
  const [session, setSession] = useState<Session>(loadSession);
  const [springBoardPage, setSpringBoardPage] = useState<0 | 1>(0);
  const [folderState, dispatchFolderEvent] = useReducer(folderStateTransition, "closed");
  const [now, setNow] = useState(Date.now());
  const [powerProgress, setPowerProgress] = useState(0);
  const [homePressed, setHomePressed] = useState(false);
  const [activityRevision, setActivityRevision] = useState(0);
  const powerStarted = useRef<number | null>(null);
  const powerFrame = useRef<number | null>(null);
  const homePointer = useRef<number | null>(null);
  const elapsed = elapsedMs(session, now);
  const deviceDateTime = simulatedDeviceDateTime(elapsed);
  const deviceTime = formatDeviceTime(deviceDateTime);
  const deviceDate = formatDeviceDate(deviceDateTime);
  const statusBarState = createStatusBarState({
    signalStrength: 5,
    network: "3G",
    bluetoothEnabled: false,
    batteryPercentage: batteryPercent(elapsed),
    charging: false,
    carrier: "SoftBank",
    clock: deviceTime,
  });

  const update = (change: Partial<Session>) => setSession(s => ({ ...s, ...change }));

  useEffect(() => saveSession(session), [session]);
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 250); return () => clearInterval(id); }, []);
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
      setSession(current => AUTO_SLEEP_PHASES.has(current.phase) ? { ...current, phase: "sleeping" } : current);
    }, AUTO_SLEEP_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [activityRevision, session.phase]);

  const recordInteraction = () => setActivityRevision(revision => revision + 1);
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
      if (transition) update(transition);
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
        {session.phase === "poweredOff" && <div className="off"><p>Press and hold the power button.</p><div className="hold"><i style={{ width: `${powerProgress * 100}%` }} /></div></div>}
        {session.phase === "booting" && <div className="boot"><BootLogo /></div>}
        {session.phase === "locked" && <LockScreen
          statusBar={<StatusBar state={statusBarState} />}
          deviceTime={deviceTime}
          deviceDate={deviceDate}
          onUnlock={() => update({
            phase: "springboard",
            unlockEpochMs: session.unlockEpochMs ?? Date.now(),
            batteryCriticalRevealAtMs: session.batteryCriticalPending ? Date.now() + LOW_BATTERY_REVEAL_DELAY_MS : null,
          })}
        />}
        {session.phase === "springboard" && <SpringBoard
          statusBar={<StatusBar state={statusBarState} />}
          currentPage={springBoardPage}
          onPageChange={setSpringBoardPage}
          folderState={folderState}
          dispatchFolderEvent={dispatchFolderEvent}
        />}
        {session.phase === "sleeping" && <div className="dead" />}
        {session.phase === "powerOffConfirm" && <PowerOffConfirm onCancel={() => update({ phase: session.previousPhase ?? "locked", previousPhase: null })} onConfirm={() => update({ phase: "shutdown" })} />}
        {session.phase === "shutdown" && <div className="dead" />}
        {session.phase === "lowBatteryWarning" && <img className="low-battery-screen" src={lowBatterySrc} alt="" aria-hidden="true" />}
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
