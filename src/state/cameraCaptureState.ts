import type { CameraDevice, CameraLookOffset, CameraMode } from "./cameraRuntime";

export const CAMERA_CAPTURE_WIDTH = 1936;
export const CAMERA_CAPTURE_HEIGHT = 2592;
export const CAMERA_CAPTURE_MIME_TYPE = "image/jpeg" as const;
export const CAMERA_CAPTURE_JPEG_QUALITY = 0.9;
export const CAMERA_CAPTURE_GRAIN_SCALE = 2.5;
export const CAMERA_CAPTURE_SCENE_ID = "ambient-world-production-v0.1" as const;

export type CameraCaptureSceneSnapshot = Readonly<{
  timeSeconds: number;
  swayOffset: CameraLookOffset;
  zoom: number;
  luminance: number;
  color: number;
  ring: number;
  grainSeed: number;
}>;

export type CameraCaptureFramingSnapshot = Readonly<{
  pointerOffset: CameraLookOffset;
  orientationOffset: CameraLookOffset;
  effectiveLookOffset: CameraLookOffset;
  sharedScene: CameraCaptureSceneSnapshot;
}>;

export type CameraCaptureSnapshot = Readonly<{
  createdAt: string;
  sceneId: typeof CAMERA_CAPTURE_SCENE_ID;
  width: typeof CAMERA_CAPTURE_WIDTH;
  height: typeof CAMERA_CAPTURE_HEIGHT;
  mimeType: typeof CAMERA_CAPTURE_MIME_TYPE;
  cameraFacing: CameraDevice;
  cameraMode: CameraMode;
  framing: CameraCaptureFramingSnapshot;
}>;

export type CameraCapturedArtifact = Readonly<{
  snapshot: CameraCaptureSnapshot;
  blob: Blob;
}>;

export type CameraPhotoRecord = Readonly<{
  id: string;
  filename: string;
  createdAt: string;
  sceneId: typeof CAMERA_CAPTURE_SCENE_ID;
  width: typeof CAMERA_CAPTURE_WIDTH;
  height: typeof CAMERA_CAPTURE_HEIGHT;
  mimeType: typeof CAMERA_CAPTURE_MIME_TYPE;
  byteSize: number;
  blob: Blob;
  objectUrl: string;
  cameraFacing: CameraDevice;
  cameraMode: CameraMode;
  framing: CameraCaptureFramingSnapshot;
}>;

const CAMERA_FILENAME_PATTERN = /^IMG_(\d{4})\.JPG$/;

export function nextCameraPhotoNumber(records: readonly CameraPhotoRecord[]) {
  const allocated = new Set(records.flatMap(record => {
    const match = CAMERA_FILENAME_PATTERN.exec(record.filename);
    return match ? [Number(match[1])] : [];
  }));
  for (let number = 1; number <= 9999; number += 1) {
    if (!allocated.has(number)) return number;
  }
  throw new Error("The in-memory Camera filename namespace is exhausted.");
}

export function createCameraPhotoRecord(
  artifact: CameraCapturedArtifact,
  records: readonly CameraPhotoRecord[],
): CameraPhotoRecord {
  const number = nextCameraPhotoNumber(records);
  const serial = String(number).padStart(4, "0");
  const objectUrl = URL.createObjectURL(artifact.blob);
  try {
    return Object.freeze({
      id: `camera-photo-${serial}`,
      filename: `IMG_${serial}.JPG`,
      createdAt: artifact.snapshot.createdAt,
      sceneId: artifact.snapshot.sceneId,
      width: artifact.snapshot.width,
      height: artifact.snapshot.height,
      mimeType: artifact.snapshot.mimeType,
      byteSize: artifact.blob.size,
      blob: artifact.blob,
      objectUrl,
      cameraFacing: artifact.snapshot.cameraFacing,
      cameraMode: artifact.snapshot.cameraMode,
      framing: artifact.snapshot.framing,
    });
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

export function releaseCameraPhotoRecords(records: readonly CameraPhotoRecord[]) {
  records.forEach(record => URL.revokeObjectURL(record.objectUrl));
}
