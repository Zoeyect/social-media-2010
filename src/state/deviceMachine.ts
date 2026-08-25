import type { DeviceEvent } from "./deviceEventScheduler";
import { emptySessionIdentity } from "./sessionIdentity";
import type { SessionIdentity } from "./sessionIdentity";

export const BOOT_DURATION_MS = 30_000;
export const POWER_HOLD_MS = 1_000;
export const SESSION_DURATION_MS = 15 * 60_000;
export const SESSION_KEY = "social-media-2010.session.v1";
export const SESSION_START_ISO = "2010-10-20T00:02:00-07:00";
export const DEVICE_TIME_ZONE = "America/Los_Angeles";
export const DEVICE_LOCALE = "en-US";

export type DevicePhase = "hero" | "poweredOff" | "booting" | "locked" | "springboard" | "app" | "sleeping" | "powerOffConfirm" | "shutdown" | "lowBatteryWarning";
export type WarningLevel = 20 | 10;
export type ShutdownReason = "battery" | "manual" | null;
export type Session = {
  sessionIdentity: SessionIdentity;
  phase: DevicePhase;
  shutdownReason: ShutdownReason;
  returnToHeroPending: boolean;
  previousPhase: DevicePhase | null;
  activeWarning: WarningLevel | 1 | null;
  batteryCriticalPending: boolean;
  batteryCriticalRevealAtMs: number | null;
  sessionStartEpochMs: number | null;
  deviceEvents: DeviceEvent[];
  deliveredTimelineEventIds: string[];
  dismissedWarnings: WarningLevel[];
  badges: Record<string, number>;
};

export const initialSession: Session = {
  sessionIdentity: emptySessionIdentity,
  phase: "hero",
  shutdownReason: null,
  returnToHeroPending: false,
  previousPhase: null,
  activeWarning: null,
  batteryCriticalPending: false,
  batteryCriticalRevealAtMs: null,
  sessionStartEpochMs: null,
  deviceEvents: [],
  deliveredTimelineEventIds: [],
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
    const parsed = JSON.parse(raw) as Partial<Session> & { userName?: string; unlockEpochMs?: number | null };
    const { userName: legacyUserName, unlockEpochMs: legacyUnlockEpochMs, ...persistedSession } = parsed;
    const migratesUnlockBasedClock = parsed.sessionStartEpochMs === undefined && legacyUnlockEpochMs !== undefined;
    const session: Session = {
      ...initialSession,
      ...persistedSession,
      sessionIdentity: parsed.sessionIdentity ?? { name: legacyUserName?.trim() ?? "" },
      sessionStartEpochMs: migratesUnlockBasedClock ? null : (parsed.sessionStartEpochMs ?? null),
      phase: migratesUnlockBasedClock && (parsed.sessionIdentity?.name || legacyUserName?.trim())
        ? "booting"
        : (parsed.phase ?? initialSession.phase),
    };
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
  return session.sessionStartEpochMs ? Math.max(0, now - session.sessionStartEpochMs) : 0;
}

export function hasReachedSessionTerminal(session: Session, now: number) {
  return session.sessionStartEpochMs !== null
    && now - session.sessionStartEpochMs >= SESSION_DURATION_MS;
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

const deviceTimeFormatter = new Intl.DateTimeFormat(DEVICE_LOCALE, {
  timeZone: DEVICE_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatDeviceTime(deviceDateTime: Date) {
  return deviceTimeFormatter.format(deviceDateTime);
}

export function formatLockScreenTime(deviceDateTime: Date) {
  return deviceTimeFormatter.formatToParts(deviceDateTime)
    .filter(part => part.type !== "dayPeriod")
    .map(part => part.value)
    .join("")
    .trim();
}

export function formatDeviceDate(deviceDateTime: Date) {
  return new Intl.DateTimeFormat(DEVICE_LOCALE, {
    timeZone: DEVICE_TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(deviceDateTime);
}

export function simulatedClock(elapsed: number) {
  return formatDeviceTime(simulatedDeviceDateTime(elapsed));
}
