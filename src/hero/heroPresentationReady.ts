import type { Camera, Object3D, PerspectiveCamera } from "three";

/** Reveal only after the existing model callback and phone frame transform settle. */
export function heroPresentationReady(modelReady: boolean, phone: Object3D, camera: Camera, size: { width: number; height: number }): boolean {
  const perspective = camera as PerspectiveCamera;
  return modelReady && size.width > 0 && size.height > 0
    && Number.isFinite(size.width + size.height)
    && (!perspective.isPerspectiveCamera || Math.abs(perspective.aspect - size.width / size.height) < 1e-5)
    && phone.scale.toArray().every(value => Number.isFinite(value) && value > 0)
    && phone.matrixWorld.elements.every(Number.isFinite)
    && camera.projectionMatrix.elements.every(Number.isFinite);
}
