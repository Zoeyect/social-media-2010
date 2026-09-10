import type { ActiveMediaRequest } from "../state/mediaAttachment";
import { useEffect, useState } from "react";

export function MediaAttachmentDebug({ request, cameraSceneSessionId, pending, foregroundApp }: { request: ActiveMediaRequest | null; cameraSceneSessionId: string | null; pending: unknown; foregroundApp: string | null }) {
  const enabled = import.meta.env.DEV && new URLSearchParams(window.location.search).get("mediaAttachmentDebug") === "1";
  const [keyboard, setKeyboard] = useState<{ keyboardOwner: string | null; keyboardVisible: boolean }>({ keyboardOwner: null, keyboardVisible: false });
  useEffect(() => {
    if (!enabled) return;
    const read = () => {
      const host = document.querySelector<HTMLElement>(".screen .ios4-keyboard-system");
      const keyboardOwner = host?.dataset.keyboardOwner ?? null;
      const keyboardVisible = host?.dataset.keyboardVisible === "true";
      setKeyboard(current => current.keyboardOwner === keyboardOwner && current.keyboardVisible === keyboardVisible ? current : { keyboardOwner, keyboardVisible });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-keyboard-owner", "data-keyboard-visible"] });
    return () => observer.disconnect();
  }, [enabled]);
  if (!enabled) return null;
  return <details className="media-attachment-debug" open><summary>Media attachment</summary><pre>{JSON.stringify({
    requester: request?.requester ?? null, source: request?.source ?? null,
    contextId: request?.contextId ?? null, stage: request?.stage ?? null,
    selectedMediaId: request?.selectedMediaId ?? null,
    returnTarget: request ? `${request.requester}/${request.contextId ?? "composer"}` : null,
    cameraSceneSessionId, foregroundApp, ...keyboard, pending,
  }, null, 2)}</pre></details>;
}
