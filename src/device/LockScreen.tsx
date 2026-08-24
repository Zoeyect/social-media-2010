import { PointerEvent, useRef, useState } from "react";
import { SMSNotification } from "../state/smsNotificationState";
import { LockScreenModel } from "../state/lockScreenModel";

const PROVISIONAL_UNLOCK_THRESHOLD = 0.78;
type SliderState = "idle" | "dragging" | "success" | "returning";

type LockScreenProps = {
  model: LockScreenModel;
  onUnlock: () => void;
  smsNotification?: SMSNotification | null;
  onViewSMS?: () => void;
};

export function LockScreen({ model, onUnlock, smsNotification, onViewSMS }: LockScreenProps) {
  const [slideProgress, setSlideProgress] = useState(0);
  const [slideOffset, setSlideOffset] = useState(0);
  const [sliderState, setSliderState] = useState<SliderState>("idle");
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
    setSliderState("dragging");
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
    setSliderState(completed ? "success" : "returning");
    setProgress(0);
    if (completed) {
      if (smsNotification?.status === "presenting" && onViewSMS) onViewSMS();
      else onUnlock();
    } else {
      window.requestAnimationFrame(() => setSliderState("idle"));
    }
  };

  const cancelDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    setSliderState("returning");
    setProgress(0);
    window.requestAnimationFrame(() => setSliderState("idle"));
  };

  return <div className="lockscreen" data-wallpaper-asset-status="READY">
    <div className="locktime">
      <time className="lock-clock-slot">{model.clock}</time>
      <time className="lock-date-slot">{model.date}</time>
    </div>
    {smsNotification?.status === "presenting" && <section className="lockscreen-sms-alert" aria-label="Text Message">
      <strong>Text Message</strong>
      <b>{smsNotification.sender}</b>
      <p>{smsNotification.message}</p>
    </section>}
    <div className="lockscreen-bottom-bar">
      <div
        className="unlock-track"
        ref={trackRef}
        data-slider-state={sliderState}
        data-slider-background-asset-status="READY"
      >
        <span className="unlock-track-raster" aria-hidden="true" />
        <span className="unlock-track-label">{smsNotification?.status === "presenting" ? "slide to view" : "slide to unlock"}</span>
        <span className="unlock-track-highlight" aria-hidden="true">{smsNotification?.status === "presenting" ? "slide to view" : "slide to unlock"}</span>
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
