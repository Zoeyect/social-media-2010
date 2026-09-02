import apartmentLightOff01 from "./camera-video/apartment-light-off-01.mp4";
import apartmentLightOff02 from "./camera-video/apartment-light-off-02.mp4";
import dinerClosingShift02 from "./camera-video/diner-closing-shift-02.mp4";
import dinerClosingShift03 from "./camera-video/diner-closing-shift-03.mp4";
import nothingHappens01 from "./camera-video/nothing-happens-01.mp4";
import parkingLotCarUnlock01 from "./camera-video/parking-lot-car-unlock-01.mp4";
import residentialCat01 from "./camera-video/residential-cat-01.mp4";
import residentialCat02 from "./camera-video/residential-cat-02.mp4";
import streetPassingBus01 from "./camera-video/street-passing-bus-01.mp4";
import streetPassingCar01 from "./camera-video/street-passing-car-01.mp4";
import yardSprinkler01 from "./camera-video/yard-sprinkler-01.mp4";

export const CAMERA_VIDEO_EVENT_TYPES = Object.freeze([
  "nothing", "cat", "passing-car", "passing-bus", "diner-closing",
  "apartment-light", "parking-unlock", "yard",
] as const);

export type CameraVideoEventType = typeof CAMERA_VIDEO_EVENT_TYPES[number];
export type CameraVideoSceneId =
  | "apartment-light-off-01" | "apartment-light-off-02"
  | "diner-closing-shift-02" | "diner-closing-shift-03"
  | "nothing-happens-01" | "parking-lot-car-unlock-01"
  | "residential-cat-01" | "residential-cat-02"
  | "street-passing-bus-01" | "street-passing-car-01" | "yard-sprinkler-01";

export type CameraVideoScene = Readonly<{
  id: CameraVideoSceneId;
  eventType: CameraVideoEventType;
  src: string;
  variant: number;
  runtimeCompatible: true;
  loop: false;
  muted: true;
  cropOffsetX?: number;
  cropOffsetY?: number;
  eventSafeZone?: Readonly<{ xMin: number; xMax: number; yMin?: number; yMax?: number }>;
  expectedDuration?: number;
}>;

export type CameraVideoSelectionOverride = "cameraVideo" | "cameraScene" | "cameraEvent" | null;
export type CameraVideoSceneSelection = Readonly<{
  eventType: CameraVideoEventType;
  sceneId: CameraVideoSceneId;
  videoDisabled: boolean;
  forcedByQuery: CameraVideoSelectionOverride;
}>;
export type CameraVideoSelectionOptions = Readonly<{
  cameraVideo?: string | null;
  cameraScene?: string | null;
  cameraEvent?: string | null;
  random?: () => number;
}>;

export const defaultCameraVideoSceneId: CameraVideoSceneId = "residential-cat-01";
export const staticCameraVideoPlaceholderSceneId: CameraVideoSceneId = "nothing-happens-01";
export const CAMERA_VIDEO_EVENT_WEIGHTS = Object.freeze([
  { eventType: "nothing", weight: 45 },
  { eventType: "cat", weight: 20 },
  { eventType: "passing-car", weight: 15 },
  { eventType: "diner-closing", weight: 8 },
  { eventType: "apartment-light", weight: 5 },
  { eventType: "passing-bus", weight: 3 },
  { eventType: "parking-unlock", weight: 2 },
  { eventType: "yard", weight: 2 },
] satisfies readonly Readonly<{ eventType: CameraVideoEventType; weight: number }>[]);

export const cameraVideoScenes: readonly CameraVideoScene[] = Object.freeze([
  { id: "apartment-light-off-01", eventType: "apartment-light", src: apartmentLightOff01, variant: 1, runtimeCompatible: true, loop: false, muted: true },
  { id: "apartment-light-off-02", eventType: "apartment-light", src: apartmentLightOff02, variant: 2, runtimeCompatible: true, loop: false, muted: true },
  { id: "diner-closing-shift-02", eventType: "diner-closing", src: dinerClosingShift02, variant: 2, runtimeCompatible: true, loop: false, muted: true },
  { id: "diner-closing-shift-03", eventType: "diner-closing", src: dinerClosingShift03, variant: 3, runtimeCompatible: true, loop: false, muted: true },
  { id: "nothing-happens-01", eventType: "nothing", src: nothingHappens01, variant: 1, runtimeCompatible: true, loop: false, muted: true },
  { id: "parking-lot-car-unlock-01", eventType: "parking-unlock", src: parkingLotCarUnlock01, variant: 1, runtimeCompatible: true, loop: false, muted: true },
  { id: "residential-cat-01", eventType: "cat", src: residentialCat01, variant: 1, runtimeCompatible: true, loop: false, muted: true, cropOffsetX: 0, cropOffsetY: 0 },
  { id: "residential-cat-02", eventType: "cat", src: residentialCat02, variant: 2, runtimeCompatible: true, loop: false, muted: true, cropOffsetX: 0, cropOffsetY: 0 },
  { id: "street-passing-bus-01", eventType: "passing-bus", src: streetPassingBus01, variant: 1, runtimeCompatible: true, loop: false, muted: true },
  { id: "street-passing-car-01", eventType: "passing-car", src: streetPassingCar01, variant: 1, runtimeCompatible: true, loop: false, muted: true },
  { id: "yard-sprinkler-01", eventType: "yard", src: yardSprinkler01, variant: 1, runtimeCompatible: true, loop: false, muted: true },
]);

export const excludedCameraVideoAssets = Object.freeze([
  { filename: "diner-closing-shift-01.mp4", reason: "Apple QuickTime/MOV container; excluded until transcoded to runtime-compatible MP4." },
  { filename: "street-passing-car-02.mp4", reason: "Apple QuickTime/MOV container; excluded until transcoded to runtime-compatible MP4." },
] as const);

const totalWeight = CAMERA_VIDEO_EVENT_WEIGHTS.reduce((sum, entry) => sum + entry.weight, 0);
const sceneById = new Map(cameraVideoScenes.map(scene => [scene.id, scene] as const));
const validEventTypes = new Set<string>(CAMERA_VIDEO_EVENT_TYPES);
const warningKeys = new Set<string>();

if (import.meta.env.DEV && totalWeight !== 100) {
  console.warn(`[CameraVideo] CAMERA_VIDEO_EVENT_WEIGHTS must total 100; currently ${totalWeight}.`);
}

function warnOnce(key: string, message: string) {
  if (!import.meta.env.DEV || warningKeys.has(key)) return;
  warningKeys.add(key);
  console.warn(message);
}

function normalizedRandom(random: () => number) {
  const value = random();
  if (!Number.isFinite(value)) return 0;
  return Math.min(1 - Number.EPSILON, Math.max(0, value));
}

export function resolveCameraVideoEventType(rawEventType: string | null): CameraVideoEventType | null {
  if (rawEventType === null) return null;
  const normalized = rawEventType.trim().toLowerCase();
  return validEventTypes.has(normalized) ? normalized as CameraVideoEventType : null;
}

export function getScenesByEventType(eventType: CameraVideoEventType): readonly CameraVideoScene[] {
  return cameraVideoScenes.filter(scene => scene.runtimeCompatible && scene.eventType === eventType);
}

export function selectEventByWeight(randomValue: number): CameraVideoEventType {
  const value = Math.min(1 - Number.EPSILON, Math.max(0, randomValue)) * totalWeight;
  let cumulative = 0;
  for (const { eventType, weight } of CAMERA_VIDEO_EVENT_WEIGHTS) {
    cumulative += weight;
    if (value < cumulative) return eventType;
  }
  return CAMERA_VIDEO_EVENT_WEIGHTS[CAMERA_VIDEO_EVENT_WEIGHTS.length - 1]!.eventType;
}

function pickSceneForEvent(eventType: CameraVideoEventType, random: () => number): CameraVideoSceneId | null {
  const candidates = getScenesByEventType(eventType);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0]!.id;
  return candidates[Math.floor(normalizedRandom(random) * candidates.length)]!.id;
}

function warnIfLargeFramingOffset(scene: CameraVideoScene) {
  if (Math.abs(scene.cropOffsetX ?? 0) <= 0.06 && Math.abs(scene.cropOffsetY ?? 0) <= 0.05) return;
  warnOnce(`framing-offset:${scene.id}`, `[CameraVideo] Scene ${scene.id} has large framing offset (${scene.cropOffsetX ?? 0}, ${scene.cropOffsetY ?? 0}); review before activation.`);
}

export function resolveCameraVideoSceneId(rawSceneId: string | null): CameraVideoSceneId {
  return rawSceneId !== null && sceneById.has(rawSceneId as CameraVideoSceneId)
    ? rawSceneId as CameraVideoSceneId
    : defaultCameraVideoSceneId;
}

export function getCameraVideoScene(id: CameraVideoSceneId): CameraVideoScene {
  return sceneById.get(id) ?? sceneById.get(defaultCameraVideoSceneId)!;
}

export function selectCameraVideoScene(options: CameraVideoSelectionOptions = {}): CameraVideoSceneSelection {
  const random = options.random ?? Math.random;
  if (options.cameraVideo === "off") {
    return { eventType: "nothing", sceneId: staticCameraVideoPlaceholderSceneId, videoDisabled: true, forcedByQuery: "cameraVideo" };
  }

  let useEventOverride = true;
  if (options.cameraScene !== null && options.cameraScene !== undefined) {
    const scene = sceneById.get(options.cameraScene as CameraVideoSceneId);
    if (scene?.runtimeCompatible) {
      warnIfLargeFramingOffset(scene);
      return { eventType: scene.eventType, sceneId: scene.id, videoDisabled: false, forcedByQuery: "cameraScene" };
    }
    warnOnce(`invalid-camera-scene:${options.cameraScene}`, `[CameraVideo] Unknown or unsupported cameraScene "${options.cameraScene}" (falling back to weighted selection).`);
    useEventOverride = false;
  }

  if (useEventOverride && options.cameraEvent !== null && options.cameraEvent !== undefined) {
    const eventType = resolveCameraVideoEventType(options.cameraEvent);
    const sceneId = eventType ? pickSceneForEvent(eventType, random) : null;
    if (eventType && sceneId) {
      const scene = getCameraVideoScene(sceneId);
      warnIfLargeFramingOffset(scene);
      return { eventType, sceneId, videoDisabled: false, forcedByQuery: "cameraEvent" };
    }
    warnOnce(`invalid-camera-event:${options.cameraEvent}`, `[CameraVideo] Unknown or unsupported cameraEvent "${options.cameraEvent}" (falling back to weighted selection).`);
  }

  const eventType = selectEventByWeight(normalizedRandom(random));
  const sceneId = pickSceneForEvent(eventType, random);
  if (sceneId) {
    const scene = getCameraVideoScene(sceneId);
    warnIfLargeFramingOffset(scene);
    return { eventType, sceneId, videoDisabled: false, forcedByQuery: null };
  }

  const fallback = sceneById.get(staticCameraVideoPlaceholderSceneId) ?? sceneById.get(defaultCameraVideoSceneId)!;
  warnOnce(`missing-event-scenes:${eventType}`, `[CameraVideo] Event "${eventType}" has no runtime-compatible scenes; using ${fallback.id}.`);
  return { eventType: fallback.eventType, sceneId: fallback.id, videoDisabled: false, forcedByQuery: null };
}
