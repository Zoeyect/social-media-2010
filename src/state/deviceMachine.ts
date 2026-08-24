export const BOOT_DURATION_MS = 30_000;
export const POWER_HOLD_MS = 1_000;
export const SESSION_DURATION_MS = 15 * 60_000;
export const SESSION_KEY = "social-media-2010.session.v1";
export const SESSION_START_ISO = "2010-10-20T22:02:00+09:00";

export type DevicePhase = "hero" | "poweredOff" | "booting" | "locked" | "springboard" | "app" | "sleeping" | "powerOffConfirm" | "shutdown" | "lowBatteryWarning";
export type WarningLevel = 20 | 10;
export type Session = {
  userName: string;
  phase: DevicePhase;
  previousPhase: DevicePhase | null;
  activeWarning: WarningLevel | 1 | null;
  batteryCriticalPending: boolean;
  batteryCriticalRevealAtMs: number | null;
  unlockEpochMs: number | null;
  dismissedWarnings: WarningLevel[];
  badges: Record<string, number>;
};

export const initialSession: Session = {
  userName: "",
  phase: "hero",
  previousPhase: null,
  activeWarning: null,
  batteryCriticalPending: false,
  batteryCriticalRevealAtMs: null,
  unlockEpochMs: null,
  dismissedWarnings: [],
  badges: { Facebook: 3, Twitter: 12, Instagram: 1, Foursquare: 1 },
};

export function homeButtonTransition(session: Session): Partial<Session> | null {
  switch (session.phase) {
    case "sleeping":
      return { phase: "locked" };
    case "app":
      return { phase: "springboard" };
    case "locked":
    case "springboard":
    case "booting":
    case "hero":
    case "poweredOff":
    case "powerOffConfirm":
    case "shutdown":
    case "lowBatteryWarning":
      return null;
  }
}

export function shortPowerTransition(session: Session): Partial<Session> | null {
  switch (session.phase) {
    case "locked":
    case "springboard":
    case "app":
      return { phase: "sleeping" };
    case "sleeping":
      return { phase: "locked" };
    default:
      return null;
  }
}

export function longPowerTransition(session: Session): Partial<Session> | null {
  switch (session.phase) {
    case "locked":
    case "springboard":
    case "app":
    case "sleeping":
    case "lowBatteryWarning":
      return { previousPhase: session.phase, phase: "powerOffConfirm" };
    default:
      return null;
  }
}

export function loadSession(): Session {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return initialSession;
    const session: Session = { ...initialSession, ...JSON.parse(raw) };
    if (session.phase === "lowBatteryWarning" && session.activeWarning === 1) {
      const safePhase = session.previousPhase === "locked" || session.previousPhase === "springboard" || session.previousPhase === "app" || session.previousPhase === "sleeping"
        ? session.previousPhase
        : "locked";
      return {
        ...session,
        phase: safePhase,
        previousPhase: null,
        activeWarning: null,
        batteryCriticalPending: true,
        batteryCriticalRevealAtMs: null,
      };
    }
    return session;
  } catch { return initialSession; }
}

export function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function elapsedMs(session: Session, now: number) {
  return session.unlockEpochMs ? Math.max(0, now - session.unlockEpochMs) : 0;
}

export function batteryPercent(elapsed: number) {
  const progress = Math.min(Math.max(elapsed, 0), SESSION_DURATION_MS) / SESSION_DURATION_MS;
  return 22 - progress * 21;
}

export function currentWarning(elapsed: number, dismissed: WarningLevel[]): WarningLevel | null {
  const battery = batteryPercent(elapsed);
  if (battery <= 10 && !dismissed.includes(10)) return 10;
  if (battery <= 20 && !dismissed.includes(20)) return 20;
  return null;
}

export function simulatedDeviceDateTime(elapsed: number) {
  const base = Date.parse(SESSION_START_ISO);
  return new Date(base + elapsed);
}

export function formatDeviceTime(deviceDateTime: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit", hour12: false }).format(deviceDateTime);
}

export function formatDeviceDate(deviceDateTime: Date) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tokyo", weekday: "long", month: "long", day: "numeric" }).format(deviceDateTime);
}

export function simulatedClock(elapsed: number) {
  return formatDeviceTime(simulatedDeviceDateTime(elapsed));
}
