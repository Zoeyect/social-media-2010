import { Dispatch, useLayoutEffect, useRef } from "react";
import type { CameraPhotoRecord } from "../state/cameraCaptureState";
import type { CameraRollInitialization, PhotosEvent, PhotosState } from "../state/cameraRollState";

type PhotosContainerProps = Readonly<{
  state: PhotosState;
  dispatch: Dispatch<PhotosEvent>;
  cameraRoll: CameraRollInitialization;
}>;

export function PhotosContainer({ state, dispatch, cameraRoll }: PhotosContainerProps) {
  const selectedPhoto = state.selectedPhotoId
    ? cameraRoll.records.find(record => record.id === state.selectedPhotoId) ?? null
    : null;

  if (state.view === "photo" && selectedPhoto) {
    return <PhotoViewer
      photo={selectedPhoto}
      controlsVisible={state.viewerControlsVisible}
      onBack={() => dispatch({ type: "BACK" })}
      onToggleControls={() => dispatch({ type: "TOGGLE_VIEWER_CONTROLS" })}
    />;
  }

  if (state.view === "cameraRoll" || state.view === "photo") {
    return <CameraRollGrid
      cameraRoll={cameraRoll}
      onBack={() => dispatch({ type: "BACK" })}
      onOpenPhoto={photoId => dispatch({ type: "OPEN_PHOTO", photoId })}
    />;
  }

  const latestPhoto = cameraRoll.records[cameraRoll.records.length - 1] ?? null;
  return <section className="photos-container" aria-label="Photos">
    <PhotosNavigationBar title="Photos" />
    <div className="photos-album-list" data-visual-status="RECONSTRUCTED">
      {cameraRoll.status === "loading"
        ? <p className="photos-state-message" role="status">Loading Camera Roll…</p>
        : cameraRoll.status === "error"
          ? <p className="photos-state-message is-error" role="alert">Camera Roll Unavailable</p>
          : <button
            type="button"
            className="photos-album-row"
            data-ordering-status="PROBABLE"
            onClick={() => dispatch({ type: "OPEN_CAMERA_ROLL" })}
          >
            <span className="photos-album-cover">
              {latestPhoto
                ? <img src={latestPhoto.objectUrl} alt="" />
                : <span className="photos-album-cover-empty" aria-hidden="true" />}
            </span>
            <strong>Camera Roll</strong>
            <span className="photos-album-count">{cameraRoll.records.length}</span>
            <span className="photos-disclosure" aria-hidden="true">›</span>
          </button>}
    </div>
  </section>;
}

function CameraRollGrid({
  cameraRoll,
  onBack,
  onOpenPhoto,
}: Readonly<{
  cameraRoll: CameraRollInitialization;
  onBack: () => void;
  onOpenPhoto: (photoId: string) => void;
}>) {
  const grid = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const element = grid.current;
    if (element && cameraRoll.status === "ready") element.scrollTop = element.scrollHeight;
  }, [cameraRoll.records.length, cameraRoll.status]);

  return <section className="photos-container" aria-label="Camera Roll">
    <PhotosNavigationBar title="Camera Roll" backLabel="Albums" onBack={onBack} />
    <div
      ref={grid}
      className="photos-camera-roll-grid"
      data-visual-status="RECONSTRUCTED"
      data-ordering-status="PROBABLE"
    >
      {cameraRoll.status === "loading"
        ? <p className="photos-state-message" role="status">Loading Camera Roll…</p>
        : cameraRoll.status === "error"
          ? <p className="photos-state-message is-error" role="alert">Camera Roll Unavailable</p>
          : cameraRoll.records.length === 0
            ? <p className="photos-state-message">No Photos</p>
            : cameraRoll.records.map(photo => <button
              type="button"
              className="photos-camera-roll-thumbnail"
              key={photo.id}
              aria-label={`Open ${photo.filename}`}
              onClick={() => onOpenPhoto(photo.id)}
            >
              <img src={photo.objectUrl} alt="" />
            </button>)}
    </div>
  </section>;
}

function PhotoViewer({
  photo,
  controlsVisible,
  onBack,
  onToggleControls,
}: Readonly<{
  photo: CameraPhotoRecord;
  controlsVisible: boolean;
  onBack: () => void;
  onToggleControls: () => void;
}>) {
  return <section
    className={`photos-container photos-photo-viewer${controlsVisible ? " has-controls" : ""}`}
    aria-label={photo.filename}
    data-visual-status="RECONSTRUCTED"
  >
    {controlsVisible && <PhotosNavigationBar title="Camera Roll" backLabel="Camera Roll" onBack={onBack} />}
    <button
      type="button"
      className="photos-photo-viewer-image"
      aria-label={controlsVisible ? "Hide photo controls" : "Show photo controls"}
      onClick={onToggleControls}
    >
      <img src={photo.objectUrl} alt={photo.filename} />
    </button>
  </section>;
}

function PhotosNavigationBar({
  title,
  backLabel,
  onBack,
}: Readonly<{
  title: string;
  backLabel?: string;
  onBack?: () => void;
}>) {
  return <header className="photos-navigation-bar" data-visual-status="RECONSTRUCTED">
    {backLabel && onBack && <button type="button" className="photos-back-button" onClick={onBack}>
      {backLabel}
    </button>}
    <strong>{title}</strong>
  </header>;
}
