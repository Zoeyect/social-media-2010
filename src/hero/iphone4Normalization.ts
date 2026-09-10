import { Box3, Group, Matrix4, Quaternion, Vector3, type Mesh, type Object3D } from "three";
import { resolveIPhone4MeshRoles, type IPhone4MeshRoles } from "./iphone4ModelContract";

const CANONICAL_PHONE_HEIGHT = 2.82;
export const CHASSIS_NORMALIZATION_ROLES = ["stainlessFrame", "body", "frontGlass", "backGlass"] as const;
const AXES = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)] as const;

/** Bound the resolved structural primitives only, never their attached details
 * or hit volumes. Multi-material decal/control siblings are not chassis roles. */
export function chassisNormalizationBounds(roles: IPhone4MeshRoles): Box3 {
  const bounds = new Box3();
  for (const role of CHASSIS_NORMALIZATION_ROLES) {
    const mesh = roles[role];
    if (!mesh) throw new Error(`Invalid iPhone4 chassis normalization: missing ${role}`);
    mesh.geometry.computeBoundingBox();
    const local = mesh.geometry.boundingBox;
    if (!local || local.isEmpty()) throw new Error(`Invalid iPhone4 chassis normalization: empty ${role}`);
    mesh.updateWorldMatrix(true, false);
    const world = local.clone().applyMatrix4(mesh.matrixWorld);
    if (![...world.min.toArray(), ...world.max.toArray()].every(Number.isFinite)) {
      throw new Error(`Invalid iPhone4 chassis normalization: non-finite ${role}`);
    }
    bounds.union(world);
  }
  return bounds;
}

function screenDirections(screen: Mesh, phoneCenter: Vector3, topReference: Mesh | null): { normal: Vector3; up: Vector3 } {
  screen.geometry.computeBoundingBox();
  const bounds = screen.geometry.boundingBox;
  if (!bounds) return { normal: new Vector3(0, 0, 1), up: new Vector3(0, 1, 0) };

  const size = bounds.getSize(new Vector3());
  const dimensions = [size.x, size.y, size.z];
  const normalAxis = dimensions.indexOf(Math.min(...dimensions));
  const upAxis = dimensions.indexOf(Math.max(...dimensions));
  const normal = AXES[normalAxis].clone().transformDirection(screen.matrixWorld);
  const up = AXES[upAxis].clone().transformDirection(screen.matrixWorld);
  const screenCenter = bounds.getCenter(new Vector3()).applyMatrix4(screen.matrixWorld);
  if (normal.dot(screenCenter.sub(phoneCenter)) < 0) normal.negate();
  if (topReference) {
    const topCenter = new Box3().setFromObject(topReference).getCenter(new Vector3());
    const resolvedScreenCenter = bounds.getCenter(new Vector3()).applyMatrix4(screen.matrixWorld);
    if (up.dot(topCenter.sub(resolvedScreenCenter)) < 0) up.negate();
  }
  return { normal, up };
}

function canonicalOrientation(screen: Mesh, phoneCenter: Vector3, topReference: Mesh | null): Quaternion {
  const { normal, up } = screenDirections(screen, phoneCenter, topReference);
  const faceCamera = new Quaternion().setFromUnitVectors(normal.normalize(), new Vector3(0, 0, 1));
  const rotatedUp = up.clone().applyQuaternion(faceCamera).normalize();
  const twist = new Quaternion().setFromAxisAngle(
    new Vector3(0, 0, 1),
    Math.atan2(rotatedUp.x, rotatedUp.y),
  );
  return twist.multiply(faceCamera);
}

export type NormalizedIPhone4Model = Readonly<{
  root: Group;
  roles: IPhone4MeshRoles;
  sourceToCanonical: Matrix4;
  scale: number;
}>;

/** Applies centering, scale, and orientation once; Hero phase transforms stay model-agnostic. */
export function normalizeIPhone4Model(source: Object3D): NormalizedIPhone4Model {
  const content = source.clone(true);
  const root = new Group();
  root.name = "NormalizedIPhone4Model";
  root.add(content);
  root.updateMatrixWorld(true);

  let roles = resolveIPhone4MeshRoles(root);
  const initialBounds = chassisNormalizationBounds(roles);
  const initialCenter = initialBounds.getCenter(new Vector3());

  if (roles.screen) root.quaternion.copy(canonicalOrientation(roles.screen, initialCenter, roles.powerButton));
  root.updateMatrixWorld(true);

  const orientedBounds = chassisNormalizationBounds(roles);
  const orientedSize = orientedBounds.getSize(new Vector3());
  const scale = orientedSize.y > 0 ? CANONICAL_PHONE_HEIGHT / orientedSize.y : 1;
  root.scale.setScalar(scale);
  root.updateMatrixWorld(true);

  const scaledCenter = chassisNormalizationBounds(roles).getCenter(new Vector3());
  root.position.sub(scaledCenter);
  root.updateMatrixWorld(true);
  roles = resolveIPhone4MeshRoles(root);

  return { root, roles, sourceToCanonical: root.matrix.clone(), scale };
}
