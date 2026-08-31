import { useEffect, useRef } from "react";
import plateUrl from "../assets/world/ambient-world-plate.png";
import { createAmbientWorldRenderer } from "./ambientWorldRenderer";

export function AmbientWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      return createAmbientWorldRenderer(canvas, plateUrl);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return <canvas ref={canvasRef} className="ambient-world" aria-hidden="true" />;
}
