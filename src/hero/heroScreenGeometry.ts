import { Box3, Vector2, Vector3, type Camera, type Mesh } from "three";
import type { HeroScreenGeometry } from "./heroTypes";

const AXES = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)] as const;

function tuple(vector: Vector3): readonly [number, number, number] {
  return [vector.x, vector.y, vector.z];
}

export function measureHeroScreenGeometry(
  screen: Mesh,
  camera: Camera,
  viewport: Readonly<{ width: number; height: number }>,
): HeroScreenGeometry | null {
  screen.geometry.computeBoundingBox();
  const bounds = screen.geometry.boundingBox;
  if (!bounds) return null;
  screen.updateWorldMatrix(true, false);

  const size = bounds.getSize(new Vector3());
  const dimensions = [size.x, size.y, size.z];
  const normalAxis = dimensions.indexOf(Math.min(...dimensions));
  const surfaceAxes = [0, 1, 2].filter((axis) => axis !== normalAxis);
  const verticalAxis = dimensions[surfaceAxes[0]] >= dimensions[surfaceAxes[1]] ? surfaceAxes[0] : surfaceAxes[1];
  const horizontalAxis = surfaceAxes.find((axis) => axis !== verticalAxis)!;
  const center = bounds.getCenter(new Vector3());
  const localNormal = AXES[normalAxis].clone();
  const worldNormal = localNormal.clone().transformDirection(screen.matrixWorld);
  if (worldNormal.z < 0) {
    localNormal.negate();
    worldNormal.negate();
  }

  const coordinates = [center.x, center.y, center.z];
  const horizontalMin = bounds.min.getComponent(horizontalAxis);
  const horizontalMax = bounds.max.getComponent(horizontalAxis);
  const verticalMin = bounds.min.getComponent(verticalAxis);
  const verticalMax = bounds.max.getComponent(verticalAxis);
  const buildCorner = (horizontal: number, vertical: number) => {
    const values = [...coordinates];
    values[horizontalAxis] = horizontal;
    values[verticalAxis] = vertical;
    values[normalAxis] = localNormal.getComponent(normalAxis) > 0
      ? bounds.max.getComponent(normalAxis)
      : bounds.min.getComponent(normalAxis);
    return new Vector3(values[0], values[1], values[2]).applyMatrix4(screen.matrixWorld);
  };

  const corners = [
    buildCorner(horizontalMin, verticalMax),
    buildCorner(horizontalMax, verticalMax),
    buildCorner(horizontalMax, verticalMin),
    buildCorner(horizontalMin, verticalMin),
  ] as const;
  const projected = corners.map((corner) => {
    const point = corner.clone().project(camera);
    return new Vector2(
      (point.x * 0.5 + 0.5) * viewport.width,
      (-point.y * 0.5 + 0.5) * viewport.height,
    );
  });
  const xs = projected.map((point) => point.x);
  const ys = projected.map((point) => point.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  const right = Math.max(...xs);
  const bottom = Math.max(...ys);
  const width = dimensions[horizontalAxis];
  const height = dimensions[verticalAxis];

  return {
    localBounds: {
      min: tuple(bounds.min),
      max: tuple(bounds.max),
      width,
      height,
    },
    worldCorners: corners.map(tuple),
    projectedRect: { left, top, width: right - left, height: bottom - top },
    aspectRatio: height > 0 ? width / height : 0,
    frontNormal: tuple(worldNormal.normalize()),
  };
}
