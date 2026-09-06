import type { LocalMapPoint } from "./canonicalVenueGeography";

export type CanonicalMapRoad = Readonly<{
  id: string;
  kind: "primary" | "local";
  points: readonly LocalMapPoint[];
}>;

export type CanonicalMapRegion = Readonly<{
  id: string;
  kind: "block" | "park";
  points: readonly LocalMapPoint[];
}>;

const point = (xMiles: number, yMiles: number): LocalMapPoint =>
  Object.freeze({ xMiles, yMiles });

const road = (
  id: string,
  kind: CanonicalMapRoad["kind"],
  points: readonly LocalMapPoint[],
): CanonicalMapRoad => Object.freeze({ id, kind, points: Object.freeze(points) });

const region = (
  id: string,
  kind: CanonicalMapRegion["kind"],
  points: readonly LocalMapPoint[],
): CanonicalMapRegion => Object.freeze({ id, kind, points: Object.freeze(points) });

export const SM2010_CANONICAL_MAP_ROADS = Object.freeze([
  road("primary-commercial", "primary", [
    point(-1.00, -0.12),
    point(-0.58, -0.08),
    point(-0.12, 0.00),
    point(0.48, 0.08),
    point(1.00, 0.12),
  ]),
  road("primary-diagonal", "primary", [
    point(-0.96, 0.96),
    point(-0.58, 0.58),
    point(-0.12, 0.20),
    point(0.36, -0.22),
    point(0.92, -0.86),
  ]),
  road("local-north", "local", [point(-1.00, 0.70), point(1.00, 0.70)]),
  road("local-south", "local", [point(-1.00, -0.58), point(1.00, -0.58)]),
  road("local-west", "local", [point(-0.76, -1.00), point(-0.72, 1.00)]),
  road("local-center", "local", [point(0.18, -1.00), point(0.18, 1.00)]),
  road("local-east", "local", [point(0.76, -1.00), point(0.72, 1.00)]),
  road("local-park-access", "local", [
    point(-1.00, 0.34),
    point(-0.62, 0.32),
    point(-0.24, 0.38),
  ]),
]);

export const SM2010_CANONICAL_MAP_BLOCKS = Object.freeze([
  region("block-north-center", "block", [point(-0.12, 0.62), point(0.12, 0.62), point(0.12, 0.24), point(-0.12, 0.24)]),
  region("block-north-east", "block", [point(0.26, 0.62), point(0.68, 0.62), point(0.68, 0.20), point(0.26, 0.20)]),
  region("block-center", "block", [point(-0.08, -0.08), point(0.10, -0.08), point(0.10, -0.48), point(-0.08, -0.48)]),
  region("block-center-east", "block", [point(0.28, -0.04), point(0.66, -0.04), point(0.66, -0.46), point(0.28, -0.46)]),
  region("block-south-west", "block", [point(-0.64, -0.66), point(-0.12, -0.66), point(-0.12, -0.94), point(-0.64, -0.94)]),
  region("block-south-east", "block", [point(0.26, -0.66), point(0.66, -0.66), point(0.66, -0.94), point(0.26, -0.94)]),
]);

export const SM2010_RIVERSIDE_PARK_REGION = region("riverside-park", "park", [
  point(-0.94, 0.60),
  point(-0.34, 0.58),
  point(-0.24, 0.28),
  point(-0.34, -0.30),
  point(-0.90, -0.28),
]);
