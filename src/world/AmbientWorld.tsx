import { useEffect, useRef } from "react";
import plateUrl from "../assets/world/ambient-world-plate.png";
import { AmbientWorldRenderer, createAmbientWorldRenderer } from "./ambientWorldRenderer";

type AmbientWorldProps = {
  cameraViewfinder: HTMLCanvasElement | null;
};

export function AmbientWorld({ cameraViewfinder }: AmbientWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<AmbientWorldRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const renderer = createAmbientWorldRenderer(canvas, plateUrl);
      rendererRef.current = renderer;
      return () => {
        renderer.dispose();
        rendererRef.current = null;
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    rendererRef.current?.setCameraViewfinder(cameraViewfinder);
  }, [cameraViewfinder]);

  return <canvas ref={canvasRef} className="ambient-world" aria-hidden="true" />;
}
