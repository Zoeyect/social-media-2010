import type {
  CameraCapturedArtifact,
  CameraPhotoDurableRecord,
} from "./cameraCaptureState";

export const CAMERA_ROLL_DATABASE_NAME = "social-media-2010.camera-roll";
export const CAMERA_ROLL_DATABASE_VERSION = 1;
export const CAMERA_ROLL_PHOTO_STORE = "photos";
export const CAMERA_ROLL_METADATA_STORE = "metadata";

const CAPTURE_SEQUENCE_METADATA_KEY = "capture-sequence";
const MAX_CAPTURE_SEQUENCE = 9999;

type CaptureSequenceMetadata = Readonly<{
  key: typeof CAPTURE_SEQUENCE_METADATA_KEY;
  nextSequence: number;
}>;

let databasePromise: Promise<IDBDatabase> | null = null;

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function transactionComplete(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("IndexedDB transaction was aborted."));
    transaction.onerror = () => reject(transaction.error ?? new Error("IndexedDB transaction failed."));
  });
}

function openCameraRollDatabase() {
  if (!databasePromise) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB is unavailable; durable Camera Roll cannot initialize."));
        return;
      }
      const request = window.indexedDB.open(CAMERA_ROLL_DATABASE_NAME, CAMERA_ROLL_DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(CAMERA_ROLL_PHOTO_STORE)) {
          database.createObjectStore(CAMERA_ROLL_PHOTO_STORE, { keyPath: "id" });
        }
        if (!database.objectStoreNames.contains(CAMERA_ROLL_METADATA_STORE)) {
          database.createObjectStore(CAMERA_ROLL_METADATA_STORE, { keyPath: "key" });
        }
      };
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => {
          database.close();
          databasePromise = null;
        };
        resolve(database);
      };
      request.onerror = () => {
        databasePromise = null;
        reject(request.error ?? new Error("Unable to open durable Camera Roll."));
      };
      request.onblocked = () => {
        databasePromise = null;
        reject(new Error("Durable Camera Roll upgrade is blocked by another simulator tab."));
      };
    });
  }
  return databasePromise;
}

function isPlayerCameraRecord(value: unknown): value is CameraPhotoDurableRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<CameraPhotoDurableRecord>;
  return record.origin === "player-camera"
    && typeof record.id === "string"
    && typeof record.filename === "string"
    && Number.isInteger(record.captureSequence)
    && typeof record.createdAt === "string"
    && typeof record.width === "number"
    && typeof record.height === "number"
    && record.mimeType === "image/jpeg"
    && typeof record.byteSize === "number"
    && record.blob instanceof Blob;
}

function maximumCaptureSequence(records: readonly CameraPhotoDurableRecord[]) {
  return records.reduce((maximum, record) => Math.max(maximum, record.captureSequence), 0);
}

export async function initializeCameraRollPersistence() {
  const database = await openCameraRollDatabase();
  const transaction = database.transaction(
    [CAMERA_ROLL_PHOTO_STORE, CAMERA_ROLL_METADATA_STORE],
    "readwrite",
  );
  const completion = transactionComplete(transaction);
  const photoStore = transaction.objectStore(CAMERA_ROLL_PHOTO_STORE);
  const metadataStore = transaction.objectStore(CAMERA_ROLL_METADATA_STORE);
  const storedValues = await requestResult(photoStore.getAll());
  const records = storedValues.filter(isPlayerCameraRecord);
  const storedMetadata = await requestResult(
    metadataStore.get(CAPTURE_SEQUENCE_METADATA_KEY) as IDBRequest<CaptureSequenceMetadata | undefined>,
  );
  const derivedNextSequence = maximumCaptureSequence(records) + 1;
  const nextSequence = Math.max(storedMetadata?.nextSequence ?? 1, derivedNextSequence);
  metadataStore.put({ key: CAPTURE_SEQUENCE_METADATA_KEY, nextSequence });
  await completion;
  return records;
}

export async function persistCameraCapturedArtifact(
  artifact: CameraCapturedArtifact,
): Promise<CameraPhotoDurableRecord> {
  const database = await openCameraRollDatabase();
  const transaction = database.transaction(
    [CAMERA_ROLL_PHOTO_STORE, CAMERA_ROLL_METADATA_STORE],
    "readwrite",
  );
  const completion = transactionComplete(transaction);
  const photoStore = transaction.objectStore(CAMERA_ROLL_PHOTO_STORE);
  const metadataStore = transaction.objectStore(CAMERA_ROLL_METADATA_STORE);
  const metadata = await requestResult(
    metadataStore.get(CAPTURE_SEQUENCE_METADATA_KEY) as IDBRequest<CaptureSequenceMetadata | undefined>,
  );
  const sequence = metadata?.nextSequence;
  if (!Number.isInteger(sequence) || !sequence || sequence < 1 || sequence > MAX_CAPTURE_SEQUENCE) {
    transaction.abort();
    await completion.catch(() => undefined);
    throw new Error("The durable Camera filename namespace is unavailable or exhausted.");
  }

  const serial = String(sequence).padStart(4, "0");
  const record: CameraPhotoDurableRecord = Object.freeze({
    id: `camera-photo-${serial}`,
    filename: `IMG_${serial}.JPG`,
    captureSequence: sequence,
    createdAt: artifact.snapshot.createdAt,
    sceneId: artifact.snapshot.sceneId,
    width: artifact.snapshot.width,
    height: artifact.snapshot.height,
    mimeType: artifact.snapshot.mimeType,
    byteSize: artifact.blob.size,
    blob: artifact.blob,
    origin: "player-camera",
    cameraFacing: artifact.snapshot.cameraFacing,
    cameraMode: artifact.snapshot.cameraMode,
    framing: artifact.snapshot.framing,
  });

  photoStore.add(record);
  metadataStore.put({ key: CAPTURE_SEQUENCE_METADATA_KEY, nextSequence: sequence + 1 });
  await completion;
  return record;
}

export async function erasePlayerCameraRoll() {
  const database = await openCameraRollDatabase();
  const transaction = database.transaction(
    [CAMERA_ROLL_PHOTO_STORE, CAMERA_ROLL_METADATA_STORE],
    "readwrite",
  );
  const completion = transactionComplete(transaction);
  const photoStore = transaction.objectStore(CAMERA_ROLL_PHOTO_STORE);
  const metadataStore = transaction.objectStore(CAMERA_ROLL_METADATA_STORE);
  const storedValues = await requestResult(photoStore.getAll());
  storedValues.filter(isPlayerCameraRecord).forEach(record => photoStore.delete(record.id));
  metadataStore.put({ key: CAPTURE_SEQUENCE_METADATA_KEY, nextSequence: 1 });
  await completion;
}
