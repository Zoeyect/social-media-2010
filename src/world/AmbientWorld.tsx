import { useEffect, useMemo, useRef } from "react";
import plateUrl from "../assets/world/ambient-world-plate.png";
import type { CameraLookOffset, CameraLookState } from "../state/cameraRuntime";
import { AmbientWorldRenderer, createAmbientWorldRenderer } from "./ambientWorldRenderer";
import type { CameraCapturedArtifact } from "../state/cameraCaptureState";
import type { CameraStillCaptureRequest } from "./ambientWorldRenderer";
import { getCameraVideoScene, type CameraVideoSceneId } from "./cameraVideoScenes";

if (import.meta.env.DEV) console.info("[CameraWorld] AmbientWorld module loaded");

export type CameraStillCapture = (request: CameraStillCaptureRequest) => Promise<CameraCapturedArtifact>;

type AmbientWorldProps = {
  cameraViewfinder: HTMLCanvasElement | null;
  cameraLook: CameraLookState;
  cameraVideoSceneId: CameraVideoSceneId;
  cameraVideoDisabled: boolean;
  onCameraLookPointerOffsetClamped: (offset: CameraLookOffset) => void;
  onCameraCaptureReady: (capture: CameraStillCapture | null) => void;
};

export function AmbientWorld({
  cameraViewfinder,
  cameraLook,
  cameraVideoSceneId,
  cameraVideoDisabled,
  onCameraLookPointerOffsetClamped,
  onCameraCaptureReady,
}: AmbientWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<AmbientWorldRenderer | null>(null);
  const selectedScene = useMemo(() => getCameraVideoScene(cameraVideoSceneId), [cameraVideoSceneId]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraFramingDebugCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const framingDebugTextRef = useRef<HTMLDivElement | null>(null);
  const warnedVideoFailureRef = useRef<CameraVideoSceneId | null>(null);
  const videoStateSignatureRef = useRef<string | null>(null);
  const playLogVideoRef = useRef<HTMLVideoElement | null>(null);
  const debugAnimationFrameRef = useRef<number | null>(null);
  const cameraFramingDebug = import.meta.env.DEV
    && new URLSearchParams(window.location.search).get("cameraFramingDebug") === "1";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (import.meta.env.DEV) {
      console.info("[CameraWorld] AmbientWorld mounted", {
        canvasRefExists: true,
        cssSize: { width: canvas.clientWidth, height: canvas.clientHeight },
        drawingBufferSize: { width: canvas.width, height: canvas.height },
      });
    }
    try {
      const renderer = createAmbientWorldRenderer(canvas, plateUrl);
      rendererRef.current = renderer;
      onCameraCaptureReady(renderer.captureCameraStill);
      return () => {
        if (import.meta.env.DEV) console.info("[CameraWorld] AmbientWorld unmounted");
        onCameraCaptureReady(null);
        renderer.dispose();
        rendererRef.current = null;
      };
    } catch (error) {
      console.error(error);
      onCameraCaptureReady(null);
    }
  }, [onCameraCaptureReady]);

  useEffect(() => {
    rendererRef.current?.setCameraViewfinder(cameraViewfinder);
  }, [cameraViewfinder]);

  useEffect(() => {
    rendererRef.current?.setCameraLookState(cameraLook);
  }, [cameraLook]);

  useEffect(() => {
    rendererRef.current?.setCameraSceneFramingOffset({
      x: selectedScene.cropOffsetX ?? 0,
      y: selectedScene.cropOffsetY ?? 0,
    });
  }, [selectedScene]);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    let disposed = false;
    let video = videoRef.current;
    if (!video || video.dataset.cameraVideoSceneId !== selectedScene.id) {
      video?.pause();
      video = document.createElement("video");
      video.dataset.cameraVideoSceneId = selectedScene.id;
      video.muted = selectedScene.muted;
      video.playsInline = true;
      video.preload = "auto";
      video.loop = selectedScene.loop;
      video.src = selectedScene.src;
      videoRef.current = video;
    }
    const logVideoState = () => {
      if (!import.meta.env.DEV) return;
      const state = {
        sceneId: selectedScene.id,
        src: video.src,
        readyState: video.readyState,
        networkState: video.networkState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        currentTime: video.currentTime,
        paused: video.paused,
        ended: video.ended,
        errorCode: video.error?.code,
      };
      const signature = JSON.stringify(state);
      if (signature === videoStateSignatureRef.current) return;
      videoStateSignatureRef.current = signature;
      console.info("[CameraWorld] video state", state);
    };
    const logPlay = (result: "resolved" | "rejected", error?: unknown) => {
      if (!import.meta.env.DEV || playLogVideoRef.current === video) return;
      playLogVideoRef.current = video;
      if (result === "resolved") console.info("[CameraWorld] play resolved");
      else {
        const playError = error instanceof Error ? { name: error.name, message: error.message } : error;
        console.info("[CameraWorld] play rejected", playError);
      }
    };
    logVideoState();
    const handleMediaStateChange = () => logVideoState();
    video.addEventListener("loadedmetadata", handleMediaStateChange);
    video.addEventListener("loadeddata", handleMediaStateChange);
    video.addEventListener("canplay", handleMediaStateChange);
    video.addEventListener("playing", handleMediaStateChange);
    video.addEventListener("pause", handleMediaStateChange);
    video.addEventListener("ended", handleMediaStateChange);
    video.addEventListener("error", handleMediaStateChange);
    const ready = () => {
      if (!disposed) renderer.setCameraVideoSource(video);
    };
    const failed = () => {
      if (!disposed) {
        if (warnedVideoFailureRef.current !== selectedScene.id) {
          warnedVideoFailureRef.current = selectedScene.id;
          console.warn(`Camera video scene ${selectedScene.id} failed to load; using static plate fallback.`);
        }
        renderer.setCameraVideoSource(null);
      }
    };
    const videoDisabled = import.meta.env.DEV && cameraVideoDisabled;
    if (import.meta.env.DEV) {
      console.info("[CameraWorld] video selection", {
        sceneId: selectedScene.id,
        source: videoDisabled ? "static-plate" : video.src,
        videoDisabled,
      });
    }
    if (videoDisabled) {
      video.pause();
      video.currentTime = 0;
      renderer.setCameraVideoSource(null);
      console.info("[CameraWorld] video disabled; using static plate");
    } else if (!cameraViewfinder) {
      video.pause();
      video.currentTime = 0;
      renderer.setCameraVideoSource(null);
    } else if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      ready();
      const playPromise = video.play();
      void playPromise.then(() => {
        logPlay("resolved");
      }).catch(error => {
        logPlay("rejected", error);
        failed();
      });
    } else if (video.error) {
      failed();
    } else {
      video.addEventListener("loadeddata", ready, { once: true });
      video.addEventListener("error", failed, { once: true });
      const playPromise = video.play();
      void playPromise.then(() => {
        logPlay("resolved");
      }).catch(error => {
        logPlay("rejected", error);
        failed();
      });
    }
    return () => {
      disposed = true;
      video.removeEventListener("loadedmetadata", handleMediaStateChange);
      video.removeEventListener("loadeddata", handleMediaStateChange);
      video.removeEventListener("canplay", handleMediaStateChange);
      video.removeEventListener("playing", handleMediaStateChange);
      video.removeEventListener("pause", handleMediaStateChange);
      video.removeEventListener("ended", handleMediaStateChange);
      video.removeEventListener("error", handleMediaStateChange);
    }
  }, [cameraViewfinder, cameraVideoDisabled, selectedScene]);

  useEffect(() => {
    const renderer = rendererRef.current;
    renderer?.setCameraLookClampHandler(onCameraLookPointerOffsetClamped);
    return () => renderer?.setCameraLookClampHandler(null);
  }, [onCameraLookPointerOffsetClamped]);

  useEffect(() => {
    if (!import.meta.env.DEV || !cameraFramingDebug) return;
    const debugCanvas = cameraFramingDebugCanvasRef.current;
    const debugText = framingDebugTextRef.current;
    if (!debugCanvas) return;
    const context = debugCanvas.getContext("2d", { alpha: true });
    if (!context) return;

    const draw = () => {
      const currentRenderer = rendererRef.current;
      const currentState = currentRenderer?.getCameraFramingDebugState() ?? null;
      const currentVideo = videoRef.current;

      if (!currentState) {
        context.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
        if (debugText) {
          debugText.textContent = "Camera framing debug: waiting for renderer state";
        }
        debugAnimationFrameRef.current = window.requestAnimationFrame(draw);
        return;
      }

      const sourceWidth = Math.max(1, Math.round(currentState.sourceWidth));
      const sourceHeight = Math.max(1, Math.round(currentState.sourceHeight));
      if (debugCanvas.width !== sourceWidth || debugCanvas.height !== sourceHeight) {
        debugCanvas.width = sourceWidth;
        debugCanvas.height = sourceHeight;
      }
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, sourceWidth, sourceHeight);
      context.fillStyle = "rgba(0,0,0,0.9)";
      context.fillRect(0, 0, sourceWidth, sourceHeight);

      const hasSourceFrame = Boolean(
        currentVideo
          && currentVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
          && currentVideo.videoWidth > 0
          && currentVideo.videoHeight > 0,
      );
      if (hasSourceFrame && currentVideo) {
        context.drawImage(currentVideo, 0, 0, sourceWidth, sourceHeight);
      }

      const cropRect = currentState.sourceCropRectPx;
      const x = Math.max(0, Math.min(sourceWidth, cropRect.x));
      const y = Math.max(0, Math.min(sourceHeight, cropRect.y));
      const width = Math.max(0, Math.min(sourceWidth - x, cropRect.width));
      const height = Math.max(0, Math.min(sourceHeight - y, cropRect.height));
      context.strokeStyle = "#00ff00";
      context.lineWidth = 2;
      context.strokeRect(x, y, width, height);

      if (debugText) {
        debugText.textContent = [
          `source: ${Math.round(currentState.sourceWidth)} x ${Math.round(currentState.sourceHeight)}`,
          `scene: ${Math.round(currentState.sceneWidth)} x ${Math.round(currentState.sceneHeight)}`,
          `cropOffset: ${(selectedScene.cropOffsetX ?? 0).toFixed(4)}, ${(selectedScene.cropOffsetY ?? 0).toFixed(4)}`,
          `cameraLook: ${currentState.effectiveLookOffset.x.toFixed(4)}, ${currentState.effectiveLookOffset.y.toFixed(4)}`,
          `crop UV: x=${currentState.sourceCropRectUV.x.toFixed(4)} y=${currentState.sourceCropRectUV.y.toFixed(4)} w=${currentState.sourceCropRectUV.width.toFixed(4)} h=${currentState.sourceCropRectUV.height.toFixed(4)}`,
        ].join(" | ");
      }

      debugAnimationFrameRef.current = window.requestAnimationFrame(draw);
    };
    debugAnimationFrameRef.current = window.requestAnimationFrame(draw);

    return () => {
      if (debugAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(debugAnimationFrameRef.current);
        debugAnimationFrameRef.current = null;
      }
    };
  }, [cameraFramingDebug, selectedScene]);

  if (!import.meta.env.DEV || !cameraFramingDebug) {
    return <canvas ref={canvasRef} className="ambient-world" aria-hidden="true" />;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} className="ambient-world" aria-hidden="true" />
      <div style={{
        position: "absolute",
        top: "12px",
        left: "12px",
        zIndex: 10000,
        background: "rgba(0,0,0,0.35)",
        color: "#fff",
        padding: "8px",
        fontSize: "11px",
        fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        pointerEvents: "none",
        maxWidth: "80vw",
        lineHeight: 1.35,
      }}>
        <canvas
          ref={cameraFramingDebugCanvasRef}
          style={{
            width: "160px",
            height: "90px",
            border: "1px solid rgba(255,255,255,0.5)",
            display: "block",
            marginBottom: "6px",
          }}
          aria-label="Camera framing debug source preview"
        />
        <div ref={framingDebugTextRef} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} />
      </div>
    </div>
  );
}
