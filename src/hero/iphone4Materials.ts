import {
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Mesh,
  type Object3D,
  type Material,
  type Scene,
} from "three";

/** Hero-only satin calibration; preserve source sharing and every non-steel slot. */
export function calibrateIPhone4Stainless(root: Object3D, context?: { scene: Scene; invalidate: () => void }): () => void {
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
  let effectiveIntensity: number | null = null;
  let selectedRgb: number | null = null;
  const syncEnvironment = () => {
    if (!context) return;
    const { scene, invalidate } = context;
    const suggested = scene.environment?.userData.heroSteelEnvironmentIntensity;
    const intensity = effectiveIntensity ?? (typeof suggested === "number" ? suggested : null);
    const map = intensity === null ? null : scene.environment;
    const charcoal = import.meta.env.DEV && /^charcoal(?:-v2)?:/.test(scene.environment?.userData.heroReflectionSource?.mode ?? "");
    const red = selectedRgb ?? (charcoal ? 0.54 : 0.42);
    let changed = false;
    clones.forEach(material => {
      if (Math.abs(material.color.r - red) > 1e-8) {
        material.color.setRGB(red, Number((red + 0.01).toFixed(2)), Number((red + 0.02).toFixed(2)));
        changed = true;
      }
      if (material.envMap !== map || material.envMapIntensity !== (intensity ?? 1)) {
        material.envMap = map;
        material.envMapIntensity = intensity ?? 1;
        material.needsUpdate = true;
        changed = true;
      }
    });
    if (changed) invalidate();
  };
  syncEnvironment();
  // A/B swaps replace PMREM textures. Follow that resource centrally, outside
  // animation code, without retaining a disposed texture from the old preset.
  const environmentTimer = context ? window.setInterval(syncEnvironment, 200) : null;
  // Manual Safari audit first; no default change until clone assignment and
  // side-view appearance have been confirmed on the live model.
  let cleanupDebug = () => {};
  if (import.meta.env.DEV && context && new URLSearchParams(window.location.search).get("heroSteelDebug") === "1") {
    const rgbComparison = /^charcoal(?:-v2)?$/.test(new URLSearchParams(window.location.search).get("heroLighting") ?? "");
    const panel = document.createElement("details");
    panel.open = true;
    Object.assign(panel.style, { position: "fixed", zIndex: "40", left: "8px", top: "8px", maxWidth: "min(480px,90vw)", background: "#101010ed", color: "#ddd", padding: "8px", font: "11px monospace" });
    const heading = document.createElement("summary");
    heading.textContent = rgbComparison
      ? "Steel RGB audit · Charcoal candidate steel-54"
      : "Steel live audit · confirm calibrated=true before comparing";
    const controls = document.createElement("div");
    const output = document.createElement("pre");
    Object.assign(output.style, { maxHeight: "38vh", overflow: "auto", userSelect: "text" });
    panel.append(heading, controls, output);
    document.body.append(panel);
    const buttons = new Map<HTMLButtonElement, number | null>();
    const sample = () => {
      const { scene } = context;
      syncEnvironment();
      const calibrated = new Set(clones.values());
      const meshes: unknown[] = [];
      root.traverse(object => {
        if (!(object instanceof Mesh)) return;
        const path: string[] = [];
        for (let node: Object3D | null = object; node && node !== root; node = node.parent) path.unshift(node.name);
        const slots = Array.isArray(object.material) ? object.material : [object.material];
        if (!path.some(name => /StainlessFrame|PowerButton|VolumeUp|VolumeDown|MuteSwitch/.test(name))
          && !slots.some(material => material.name === "MAT_StainlessSteel")) return;
        meshes.push({ mesh: object.name, path: path.join("/"), visible: object.visible,
          materials: slots.map(material => material instanceof MeshStandardMaterial ? {
            name: material.name, uuid: material.uuid, calibrated: calibrated.has(material),
            colorLinear: material.color.toArray(), roughness: material.roughness, metalness: material.metalness,
            envMapIntensity: material.envMapIntensity,
            effectiveEnvironmentIntensity: material.envMap ? material.envMapIntensity : scene.environmentIntensity,
            environmentSource: material.envMap ? "explicit binding of shared Hero PMREM (not a separate brighter map)" : "scene inherited",
            anisotropy: material instanceof MeshPhysicalMaterial ? material.anisotropy : null,
          } : { name: material.name, uuid: material.uuid, calibrated: false }) });
      });
      output.textContent = JSON.stringify({ comparison: rgbComparison ? "RGB only; roughness selection deferred" : "environment intensity",
        selectedCandidate: rgbComparison ? selectedRgb === null ? "Charcoal candidate steel-54" : `steel-${Math.round(selectedRgb * 100)}` : "environment test",
        requestedEffectiveIntensity: effectiveIntensity ?? scene.environment?.userData.heroSteelEnvironmentIntensity ?? "unchanged baseline",
        calibratedMaterialCount: clones.size, pmremSource: scene.environment?.userData.heroReflectionSource ?? "not available",
        sceneEnvironmentIntensity: context.scene.environmentIntensity, meshes }, null, 2);
      buttons.forEach((value, button) => button.setAttribute("aria-pressed", String(value === (rgbComparison ? selectedRgb : effectiveIntensity))));
    };
    const presets: readonly (readonly [string, number | null])[] = rgbComparison
      ? [["candidate steel-54", null], ["steel-48", 0.48], ["steel-54", 0.54]]
      : [["baseline", null], ["steel-1x · 0.5", 0.5], ["steel-2x · 1.0", 1],
        ["steel-3x · 1.5", 1.5], ["steel-4x · 2.0", 2], ["steel-6x · 3.0", 3]];
    for (const [name, value] of presets) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = name;
      button.onclick = () => {
        if (rgbComparison) {
          selectedRgb = value;
          syncEnvironment();
        } else effectiveIntensity = value;
        sample();
      };
      buttons.set(button, value);
      controls.append(button);
    }
    sample();
    const timer = window.setInterval(sample, 300);
    cleanupDebug = () => { window.clearInterval(timer); panel.remove(); };
  }
  return () => {
    if (environmentTimer !== null) window.clearInterval(environmentTimer);
    cleanupDebug();
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
