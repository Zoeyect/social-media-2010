import { DeviceAudio } from "../audio/deviceAudio";

export type CameraRuntimePhase =
  | "none"
  | "launching"
  | "previewing"
  | "capturing"
  | "processing"
  | "reviewing"
  | "returning";

export type CameraOwner = "cameraApp" | "cameraPicker";
export type CameraLaunchMode = "standaloneCamera" | "mobileSMSPicker";
export type CameraMode = "photo" | "video";
export type CameraDevice = "rear" | "front";
export type CameraFlashMode = "auto" | "on" | "off";
export type CameraLookOffset = { x: number; y: number };
export type CameraLookState = {
  pointerOffset: CameraLookOffset;
  orientationOffset: CameraLookOffset;
};

export const CAMERA_LOOK_NOMINAL_LIMITS: CameraLookOffset = { x: 0.06, y: 0.04 };

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function clampCameraLookPointerOffset(offset: CameraLookOffset): CameraLookOffset {
  return {
    x: clamp(offset.x, -CAMERA_LOOK_NOMINAL_LIMITS.x, CAMERA_LOOK_NOMINAL_LIMITS.x),
    y: clamp(offset.y, -CAMERA_LOOK_NOMINAL_LIMITS.y, CAMERA_LOOK_NOMINAL_LIMITS.y),
  };
}

const initialCameraLookState = (): CameraLookState => ({
  pointerOffset: { x: 0, y: 0 },
  orientationOffset: { x: 0, y: 0 },
});

export type CameraSession = {
  phase: CameraRuntimePhase;
  cameraLaunchMode: CameraLaunchMode;
  suspended: boolean;
  mode: CameraMode;
  cameraDevice: CameraDevice;
  flashMode: CameraFlashMode;
  hdrEnabled: boolean;
  cameraLook: CameraLookState;
};

export type CameraRuntimeState = Record<CameraOwner, CameraSession>;

export type CameraRuntimeEvent =
  | { type: "LAUNCH"; owner: CameraOwner }
  | { type: "LAUNCH_COMPLETE"; owner: CameraOwner }
  | { type: "SUSPEND"; owner: CameraOwner }
  | { type: "RESUME"; owner: CameraOwner }
  | { type: "CAPTURE"; owner: CameraOwner }
  | { type: "CAPTURE_COMPLETE"; owner: CameraOwner }
  | { type: "PROCESSING_COMPLETE"; owner: CameraOwner }
  | { type: "CAPTURE_FAILED"; owner: CameraOwner }
  | { type: "REVIEW"; owner: CameraOwner }
  | { type: "CANCEL"; owner: CameraOwner }
  | { type: "RETURN"; owner: CameraOwner }
  | { type: "RETURN_COMPLETE"; owner: CameraOwner }
  | { type: "SET_LOOK_POINTER_OFFSET"; owner: CameraOwner; offset: CameraLookOffset }
  | { type: "RESET"; owner: CameraOwner };

const initialCameraSession = (cameraLaunchMode: CameraLaunchMode): CameraSession => ({
  phase: "none",
  cameraLaunchMode,
  suspended: false,
  mode: "photo",
  cameraDevice: "rear",
  flashMode: "auto",
  hdrEnabled: false,
  cameraLook: initialCameraLookState(),
});

export const initialCameraRuntimeState: CameraRuntimeState = {
  cameraApp: initialCameraSession("standaloneCamera"),
  cameraPicker: initialCameraSession("mobileSMSPicker"),
};

export function cameraRuntimeTransition(
  state: CameraRuntimeState,
  event: CameraRuntimeEvent,
): CameraRuntimeState {
  const session = state[event.owner];
  const replace = (next: CameraSession): CameraRuntimeState => ({ ...state, [event.owner]: next });

  switch (event.type) {
    case "LAUNCH":
      return session.phase === "none"
        ? replace({ ...initialCameraSession(session.cameraLaunchMode), phase: "launching" })
        : replace({ ...session, suspended: false });
    case "LAUNCH_COMPLETE":
      return session.phase === "launching" ? replace({ ...session, phase: "previewing" }) : state;
    case "SUSPEND":
      return session.phase !== "none" ? replace({ ...session, suspended: true }) : state;
    case "RESUME":
      return session.phase !== "none" ? replace({ ...session, suspended: false }) : state;
    case "CAPTURE":
      return event.owner === "cameraApp" && session.phase === "previewing" && !session.suspended
        ? replace({ ...session, phase: "capturing" })
        : state;
    case "CAPTURE_COMPLETE":
      return session.phase === "capturing" ? replace({ ...session, phase: "processing" }) : state;
    case "PROCESSING_COMPLETE":
      return session.phase === "processing" ? replace({ ...session, phase: "previewing" }) : state;
    case "CAPTURE_FAILED":
      return session.phase === "capturing" || session.phase === "processing"
        ? replace({ ...session, phase: "previewing" })
        : state;
    case "REVIEW":
      return session.phase === "previewing" ? replace({ ...session, phase: "reviewing" }) : state;
    case "CANCEL":
      return event.owner === "cameraPicker"
        && (session.phase === "launching" || session.phase === "previewing")
        ? replace({ ...session, phase: "returning" })
        : state;
    case "RETURN":
      return session.phase === "reviewing"
        ? replace({ ...session, phase: "returning" })
        : state;
    case "RETURN_COMPLETE":
      return session.phase === "returning"
        ? event.owner === "cameraPicker"
          ? replace(initialCameraSession("mobileSMSPicker"))
          : replace({ ...session, phase: "previewing" })
        : state;
    case "SET_LOOK_POINTER_OFFSET":
      return session.phase !== "none"
        ? replace({
          ...session,
          cameraLook: {
            ...session.cameraLook,
            pointerOffset: clampCameraLookPointerOffset(event.offset),
          },
        })
        : state;
    case "RESET":
      return replace(initialCameraSession(event.owner === "cameraPicker"
        ? "mobileSMSPicker"
        : "standaloneCamera"));
  }
}

export function requestCameraCapture(
  state: CameraRuntimeState,
  owner: CameraOwner,
  dispatch: (event: CameraRuntimeEvent) => void,
): boolean {
  const session = state[owner];
  if (owner !== "cameraApp" || session.phase !== "previewing" || session.suspended) return false;
  DeviceAudio.cameraShutter();
  dispatch({ type: "CAPTURE", owner });
  return true;
}
