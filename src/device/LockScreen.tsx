import { PointerEvent, ReactNode, useRef, useState } from "react";

const PROVISIONAL_UNLOCK_THRESHOLD = 0.78;

type LockScreenProps = {
  statusBar: ReactNode;
  deviceTime: string;
  deviceDate: string;
  onUnlock: () => void;
};

export function LockScreen({ statusBar, deviceTime, deviceDate, onUnlock }: LockScreenProps) {
  const [slideProgress, setSlideProgress] = useState(0);
  const [slideOffset, setSlideOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLButtonElement>(null);
  const pointerId = useRef<number | null>(null);
  const pointerStartX = useRef(0);
  const progressAtStart = useRef(0);
  const progressRef = useRef(0);

  const setProgress = (progress: number) => {
    const next = Math.max(0, Math.min(1, progress));
    progressRef.current = next;
    setSlideProgress(next);
    setSlideOffset(next * travelDistance());
  };

  const travelDistance = () => {
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!track || !knob) return 0;
    return Math.max(0, track.clientWidth - knob.offsetLeft * 2 - knob.offsetWidth);
  };

  const beginDrag = (event: PointerEvent<HTMLButtonElement>) => {
    pointerId.current = event.pointerId;
    pointerStartX.current = event.clientX;
    progressAtStart.current = progressRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const drag = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== event.pointerId) return;
    const travel = travelDistance();
    if (travel === 0) return;
    setProgress(progressAtStart.current + (event.clientX - pointerStartX.current) / travel);
  };

  const finishDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerId.current = null;
    const completed = progressRef.current >= PROVISIONAL_UNLOCK_THRESHOLD;
    setProgress(0);
    if (completed) onUnlock();
  };

  const cancelDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    setProgress(0);
  };

  return <div className="lockscreen" data-wallpaper-asset-status="READY">
    <div className="lockscreen-status-slot" data-status-glyph-assets="HOLD">{statusBar}</div>
    <div className="locktime">
      <time className="lock-clock-slot">{deviceTime}</time>
      <time className="lock-date-slot">{deviceDate}</time>
    </div>
    <div className="lockscreen-bottom-bar">
      <div
        className="unlock-track"
        ref={trackRef}
        data-slider-background-asset-status="READY"
      >
        <span>slide to unlock</span>
        <button
          ref={knobRef}
          type="button"
          role="slider"
          aria-label="Slide to unlock"
          aria-valuemin={0}
          aria-valuemax={100}
          data-slider-knob-asset-status="READY"
          data-slider-arrow-source="embedded-in-knob-asset"
          aria-valuenow={Math.round(slideProgress * 100)}
          style={{ transform: `translateX(${slideOffset}px)` }}
          onPointerDown={beginDrag}
          onPointerMove={drag}
          onPointerUp={finishDrag}
          onPointerCancel={cancelDrag}
        />
      </div>
    </div>
  </div>;
}
