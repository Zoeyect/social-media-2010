import type { CameraOwner, CameraSession } from "../state/cameraRuntime";
import cameraIconSrc from "../assets/historical/ios4.1/camera/CameraIconWhite@2x.browser.png";
import cameraModeIconSrc from "../assets/historical/ios4.1/camera/CameraSwitchIcon@2x.browser.png";
import cameraLaunchSrc from "../assets/historical/ios4.1/camera/Default-Camera@2x.browser.png";
import videoModeIconSrc from "../assets/historical/ios4.1/camera/Video@2x.browser.png";
import switchWellSrc from "../assets/historical/ios4.1/camera/cameraButtonBarSwitchWell@2x.browser.png";
import switchWellBackgroundSrc from "../assets/historical/ios4.1/camera/cameraButtonBarSwitchWellBackground@2x.browser.png";
import shutterSrc from "../assets/historical/ios4.1/camera/cameraButtonSilver@2x.browser.png";
import previewPlaceholderSrc from "../assets/historical/ios4.1/camera/cameraPreviewPlaceholder@2x.browser.png";
import previewWellSrc from "../assets/historical/ios4.1/camera/cameraPreviewWell@2x.browser.png";
import flashLeftSrc from "../assets/historical/ios4.1/camera/vc~cameraFlashBackgroundLeft.browser.png";
import flashRightSrc from "../assets/historical/ios4.1/camera/vc~cameraFlashBackgroundRight.browser.png";
import hdrLeftSrc from "../assets/historical/ios4.1/camera/vc~cameraHDRButtonLeft.browser.png";
import hdrRightSrc from "../assets/historical/ios4.1/camera/vc~cameraHDRButtonRight.browser.png";
import cameraToggleSrc from "../assets/historical/ios4.1/camera/vc~cameraToggle.browser.png";

type CameraContainerProps = {
  owner: CameraOwner;
  session: CameraSession;
  onCancel?: () => void;
  previewCanvasRef?: (canvas: HTMLCanvasElement | null) => void;
};

export function CameraContainer({ owner, session, onCancel, previewCanvasRef }: CameraContainerProps) {
  const isStandaloneCamera = owner === "cameraApp";
  const isLaunchingStandaloneCamera = isStandaloneCamera && session.phase === "launching";

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
    {isLaunchingStandaloneCamera
      ? <img className="camera-runtime-launch-raster" src={cameraLaunchSrc} alt="" />
      : previewCanvasRef
        ? <canvas ref={previewCanvasRef} className="camera-runtime-preview-surface" aria-hidden="true" />
        : <div className="camera-runtime-preview-surface" aria-hidden="true" />}
    {isStandaloneCamera && !isLaunchingStandaloneCamera && <>
      <div className="camera-runtime-top-chrome" aria-hidden="true">
        <div className="camera-runtime-top-control is-flash" data-visual-status="RECONSTRUCTED">
          <img className="camera-runtime-control-cap is-left" src={flashLeftSrc} alt="" />
          <span className="camera-runtime-control-fill" aria-hidden="true">
            <img src={flashRightSrc} alt="" />
          </span>
          <img className="camera-runtime-control-cap is-right" src={flashRightSrc} alt="" />
          <span className="camera-runtime-control-label">Auto</span>
        </div>
        <div className="camera-runtime-top-control is-hdr" data-visual-status="RECONSTRUCTED">
          <img className="camera-runtime-control-cap is-left" src={hdrLeftSrc} alt="" />
          <span className="camera-runtime-control-fill" aria-hidden="true">
            <img src={hdrRightSrc} alt="" />
          </span>
          <img className="camera-runtime-control-cap is-right" src={hdrRightSrc} alt="" />
          <span className="camera-runtime-control-label">HDR Off</span>
        </div>
        <img
          className="camera-runtime-camera-toggle"
          data-visual-status="RECONSTRUCTED"
          src={cameraToggleSrc}
          alt=""
        />
      </div>
      <div className="camera-runtime-bottom-chrome" aria-hidden="true">
        <img className="camera-runtime-preview-well" src={previewWellSrc} alt="" />
        <img className="camera-runtime-preview-placeholder" src={previewPlaceholderSrc} alt="" />
        <span
          className="camera-runtime-shutter"
          data-visual-status="RECONSTRUCTED"
          style={{ borderImageSource: `url("${shutterSrc}")` }}
        />
        <img className="camera-runtime-shutter-icon" src={cameraIconSrc} alt="" />
        <img className="camera-runtime-mode-background" src={switchWellBackgroundSrc} alt="" />
        <img className="camera-runtime-mode-well" src={switchWellSrc} alt="" />
        <img
          className="camera-runtime-mode-thumb"
          data-visual-status="RECONSTRUCTED"
          src={shutterSrc}
          alt=""
        />
        <img className="camera-runtime-mode-icon is-photo" src={cameraModeIconSrc} alt="" />
        <img className="camera-runtime-mode-icon is-video" src={videoModeIconSrc} alt="" />
      </div>
    </>}
    {owner === "cameraPicker" && onCancel && <button
      type="button"
      className="camera-picker-cancel"
      data-visual-status="HOLD"
      onClick={onCancel}
    >Cancel</button>}
  </section>;
}
