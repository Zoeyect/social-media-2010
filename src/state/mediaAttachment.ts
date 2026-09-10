import type { CameraPhotoRecord } from "./cameraCaptureState";

export type MediaRequester = "messages" | "facebook" | "twitter" | "flickr" | "tumblr";
export type MediaAttachmentRequest = Readonly<{
  requester: MediaRequester;
  mode: "photo";
  source: "camera-or-library" | "camera" | "library";
  contextId?: string;
}>;
// References the existing Camera Roll URL; this flow never owns/revokes blobs.
export type MediaAttachment = Pick<CameraPhotoRecord, "id" | "objectUrl" | "filename">;
export type ActiveMediaRequest = MediaAttachmentRequest & Readonly<{
  id: string;
  experienceSessionId: string;
  stage: "source" | "camera" | "library" | "result";
  selectedMediaId: string | null;
}>;
export type MediaRequestEvent =
  | { type: "BEGIN"; request: MediaAttachmentRequest; id: string; experienceSessionId: string }
  | { type: "SOURCE"; id: string; source: "camera" | "library" }
  | { type: "SELECT"; id: string; mediaId: string }
  | { type: "CANCEL"; id: string }
  | { type: "RESET" };

export function mediaRequestTransition(state: ActiveMediaRequest | null, event: MediaRequestEvent): ActiveMediaRequest | null {
  if (event.type === "RESET") return null;
  if (event.type === "BEGIN") return state ?? {
    ...event.request, id: event.id, experienceSessionId: event.experienceSessionId,
    stage: event.request.source === "camera-or-library" ? "source" : event.request.source,
    selectedMediaId: null,
  };
  if (!state || state.id !== event.id) return state;
  if (event.type === "CANCEL") return null;
  if (event.type === "SOURCE" && state.stage === "source") return { ...state, source: event.source, stage: event.source };
  if (event.type === "SELECT" && (state.stage === "camera" || state.stage === "library")) return { ...state, stage: "result", selectedMediaId: event.mediaId };
  return state;
}

export function mediaRequestVisible(request: ActiveMediaRequest | null, phase: string, activeAppId: string | null): boolean {
  return Boolean(request && phase === "app" && activeAppId === request.requester);
}
