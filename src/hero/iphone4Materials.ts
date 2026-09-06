import {
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Mesh,
  type Object3D,
  type Material,
} from "three";

/** Hero-only satin calibration; preserve source sharing and every non-steel slot. */
export function calibrateIPhone4Stainless(root: Object3D): () => void {
  const clones = new Map<Material, MeshStandardMaterial>();
  const originals = new Map<Mesh, Material | Material[]>();
  root.traverse(object => {
    if (!(object instanceof Mesh)) return;
    const slots = Array.isArray(object.material) ? object.material : [object.material];
    if (!slots.some(material => material.name === "MAT_StainlessSteel")) return;
    originals.set(object, object.material);
    const calibrated = slots.map(material => {
      if (material.name !== "MAT_StainlessSteel" || !(material instanceof MeshStandardMaterial)) return material;
      let clone = clones.get(material);
      if (!clone) {
        clone = material.clone();
        // Linear reflectance, not sRGB hex; a visual reconstruction, not a
        // historical measurement. Physical-material anisotropy survives clone.
        clone.color.setRGB(0.42, 0.43, 0.44);
        clone.metalness = 1;
        clone.roughness = 0.38;
        clones.set(material, clone);
      }
      return clone;
    });
    object.material = Array.isArray(object.material) ? calibrated : calibrated[0];
  });
  return () => {
    originals.forEach((material, mesh) => { mesh.material = material; });
    clones.forEach(material => material.dispose());
  };
}

export type IPhone4MaterialRoles = Readonly<{
  blackGlass: MeshPhysicalMaterial;
  displayGlass: MeshPhysicalMaterial;
  stainlessSteel: MeshStandardMaterial;
  blackPlastic: MeshStandardMaterial;
  buttonMetal: MeshStandardMaterial;
  cameraLens: MeshPhysicalMaterial;
}>;

export function createIPhone4MaterialRoles(): IPhone4MaterialRoles {
  return {
    blackGlass: new MeshPhysicalMaterial({
      name: "HeroBlackGlass",
      color: "#050607",
      roughness: 0.2,
      metalness: 0.08,
      clearcoat: 0.68,
      clearcoatRoughness: 0.24,
    }),
    displayGlass: new MeshPhysicalMaterial({
      name: "HeroDisplayGlass",
      color: "#000000",
      roughness: 0.26,
      metalness: 0.04,
      clearcoat: 0.4,
      clearcoatRoughness: 0.3,
    }),
    stainlessSteel: new MeshStandardMaterial({
      name: "HeroStainlessSteel",
      color: "#8b8d8d",
      roughness: 0.32,
      metalness: 0.88,
    }),
    blackPlastic: new MeshStandardMaterial({
      name: "HeroBlackPlastic",
      color: "#090a0a",
      roughness: 0.5,
      metalness: 0.12,
    }),
    buttonMetal: new MeshStandardMaterial({
      name: "HeroButtonMetal",
      color: "#969898",
      roughness: 0.36,
      metalness: 0.86,
    }),
    cameraLens: new MeshPhysicalMaterial({
      name: "HeroCameraLens",
      color: "#101a23",
      roughness: 0.24,
      metalness: 0.25,
      clearcoat: 0.72,
    }),
  };
}

export function disposeIPhone4MaterialRoles(materials: IPhone4MaterialRoles): void {
  Object.values(materials).forEach((material: Material) => material.dispose());
}
