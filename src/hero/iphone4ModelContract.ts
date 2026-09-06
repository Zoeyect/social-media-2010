import type { Material, Mesh, Object3D, Texture } from "three";

export const IPHONE4_MODEL_ASSET_PATH = "src/assets/hero/iphone4/iphone4.glb";

const productionModelModules = import.meta.glob("../assets/hero/iphone4/iphone4.glb", {
  eager: true,
  query: "?url",
  import: "default",
});

export const PRODUCTION_IPHONE4_MODEL_URL = Object.values(productionModelModules)[0] as string | undefined;

export type IPhone4MeshRoles = Readonly<{
  body: Mesh | null;
  stainlessFrame: Mesh | null;
  frontGlass: Mesh | null;
  backGlass: Mesh | null;
  screen: Mesh | null;
  homeButton: Mesh | null;
  powerButton: Mesh | null;
  volumeUp: Mesh | null;
  volumeDown: Mesh | null;
  muteSwitch: Mesh | null;
  rearCamera: Mesh | null;
  rearFlash: Mesh | null;
  frontCamera: Mesh | null;
  earpiece: Mesh | null;
  headphoneJack: Mesh | null;
  dock30Pin: Mesh | null;
}>;

export type IPhone4MeshRole = keyof IPhone4MeshRoles;

export const IPHONE4_CRITICAL_MESH_ROLES = ["body", "screen", "powerButton"] as const;

const ROLE_ALIASES: Readonly<Record<IPhone4MeshRole, readonly string[]>> = {
  body: ["phonebody", "mainbody", "body", "chassis", "housing"],
  stainlessFrame: ["stainlessframe", "steelframe", "metalframe", "sideframe", "frame", "band"],
  frontGlass: ["frontglass", "faceglass", "glassfront"],
  backGlass: ["backglass", "rearglass", "glassback"],
  screen: ["screen", "display", "screensurface", "displaypanel", "lcd"],
  homeButton: ["homebutton", "homebtn", "buttonhome"],
  powerButton: ["powerbutton", "sleepwakebutton", "sleepbutton", "topbutton", "buttonpower"],
  volumeUp: ["volumeup", "volup", "buttonvolumeup", "volumeplus"],
  volumeDown: ["volumedown", "voldown", "buttonvolumedown", "volumeminus"],
  muteSwitch: ["muteswitch", "ringtoneswitch", "silentswitch", "mute"],
  rearCamera: ["rearcamera", "backcamera", "maincamera"],
  rearFlash: ["rearflash", "cameraflash", "flash"],
  frontCamera: ["frontcamera", "selfiecamera", "facetimecamera"],
  earpiece: ["earpiece", "frontearpiece", "receiverspeaker", "receiver"],
  headphoneJack: ["headphonejack", "audiojack", "jack35mm", "headphoneport"],
  dock30Pin: ["dock30pin", "30pin", "dockconnector", "bottomport", "chargingport"],
};

function normalizeMeshName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findRoleMesh(meshes: readonly Mesh[], aliases: readonly string[]): Mesh | null {
  for (const alias of aliases) {
    const exact = meshes.find((mesh) => normalizeMeshName(mesh.name) === alias);
    if (exact) return exact;
  }
  for (const alias of aliases) {
    const partial = meshes.find((mesh) => normalizeMeshName(mesh.name).includes(alias));
    if (partial) return partial;
  }
  return null;
}

export function resolveIPhone4MeshRoles(root: Object3D): IPhone4MeshRoles {
  const meshes: Mesh[] = [];
  root.traverse((object) => {
    if (object.type === "Mesh") meshes.push(object as Mesh);
  });

  return Object.fromEntries(
    (Object.keys(ROLE_ALIASES) as IPhone4MeshRole[]).map((role) => [
      role,
      findRoleMesh(meshes, ROLE_ALIASES[role]),
    ]),
  ) as IPhone4MeshRoles;
}

export function missingIPhone4MeshRoles(roles: IPhone4MeshRoles): IPhone4MeshRole[] {
  return (Object.keys(ROLE_ALIASES) as IPhone4MeshRole[]).filter((role) => !roles[role]);
}

export function missingCriticalIPhone4MeshRoles(roles: IPhone4MeshRoles): IPhone4MeshRole[] {
  return IPHONE4_CRITICAL_MESH_ROLES.filter((role) => !roles[role]);
}

export function objectBelongsToRole(object: Object3D, role: Object3D | null): boolean {
  if (!role) return false;
  let current: Object3D | null = object;
  while (current) {
    if (current === role) return true;
    current = current.parent;
  }
  return false;
}

export type IPhone4ModelStats = Readonly<{
  triangles: number;
  drawCalls: number;
  materials: number;
  textures: number;
  textureSizes: readonly string[];
  embeddedTextureBytes: number | null;
}>;

export function inspectIPhone4Model(root: Object3D): IPhone4ModelStats {
  let triangles = 0;
  let drawCalls = 0;
  const materials = new Set<Material>();
  const textures = new Set<Texture>();

  root.traverse((object) => {
    if (object.type !== "Mesh") return;
    const mesh = object as Mesh;
    drawCalls += Math.max(1, mesh.geometry.groups.length);
    const geometry = mesh.geometry;
    triangles += geometry.index
      ? geometry.index.count / 3
      : (geometry.getAttribute("position")?.count ?? 0) / 3;
    const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    meshMaterials.forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value) => {
        if (value && typeof value === "object" && (value as Texture).isTexture) textures.add(value as Texture);
      });
    });
  });

  const textureSizes = [...textures].map((texture) => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    return image?.width && image?.height ? `${image.width}x${image.height}` : "unknown";
  });

  return {
    triangles: Math.round(triangles),
    drawCalls,
    materials: materials.size,
    textures: textures.size,
    textureSizes,
    embeddedTextureBytes: null,
  };
}
