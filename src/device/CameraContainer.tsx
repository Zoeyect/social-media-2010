import type { CameraOwner, CameraSession } from "../state/cameraRuntime";

type CameraContainerProps = {
  owner: CameraOwner;
  session: CameraSession;
  onCancel?: () => void;
};

export function CameraContainer({ owner, session, onCancel }: CameraContainerProps) {
  return <section
    className="camera-runtime-container"
    aria-label={owner === "cameraApp" ? "Camera" : "Camera attachment picker"}
    data-camera-owner={owner}
    data-camera-launch-mode={session.cameraLaunchMode}
    data-camera-phase={session.phase}
    data-camera-mode={session.mode}
    data-camera-device={session.cameraDevice}
    data-camera-suspended={session.suspended || undefined}
  >
    <div className="camera-runtime-preview-surface" aria-hidden="true" />
    {owner === "cameraPicker" && onCancel && <button
      type="button"
      className="camera-picker-cancel"
      data-visual-status="HOLD"
      onClick={onCancel}
    >Cancel</button>}
  </section>;
}
