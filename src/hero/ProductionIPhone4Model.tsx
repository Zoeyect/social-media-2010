import { useCallback, useEffect, useMemo, useState } from "react";
import { ThreeEvent, useLoader } from "@react-three/fiber";
import {
  Box3,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  Vector3,
  type Material,
  type Object3D,
  type Texture,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import bootLogoSrc from "../assets/historical/ios4.1/applelogo-iphone3,1-8B117.png";
import { TemporaryIPhone4Placeholder } from "./TemporaryIPhone4Placeholder";
import {
  inspectIPhone4Model,
  missingCriticalIPhone4MeshRoles,
  missingIPhone4MeshRoles,
  objectBelongsToRole,
  type IPhone4MeshRoles,
  type IPhone4ModelStats,
} from "./iphone4ModelContract";
import {
  createIPhone4MaterialRoles,
  disposeIPhone4MaterialRoles,
  type IPhone4MaterialRoles,
} from "./iphone4Materials";
import { normalizeIPhone4Model } from "./iphone4Normalization";

export type IPhone4ModelDiagnostics = Readonly<{
  source: "production" | "placeholder";
  fallbackReason: string | null;
  missingRoles: readonly (keyof IPhone4MeshRoles)[];
  missingCriticalRoles: readonly (keyof IPhone4MeshRoles)[];
  stats: IPhone4ModelStats | null;
  normalizationScale: number | null;
}>;

type ReadyModel = Readonly<{
  root: Object3D;
  roles: IPhone4MeshRoles;
  materials: IPhone4MaterialRoles;
  bootMaterial: MeshBasicMaterial;
  hitTarget: Mesh;
  diagnostics: IPhone4ModelDiagnostics;
}>;

const reportedFallbacks = new Set<string>();

function reportFallbackOnce(reason: string): void {
  if (!import.meta.env.DEV || reportedFallbacks.has(reason)) return;
  reportedFallbacks.add(reason);
  console.warn(`[HeroPhone] Production iphone4.glb fallback: ${reason}`);
}

function prepareProductionModel(source: Object3D, bootTexture: Texture): ReadyModel | string {
  const normalized = normalizeIPhone4Model(source);
  const { root, roles } = normalized;
  const missingCriticalRoles = missingCriticalIPhone4MeshRoles(roles);
  if (missingCriticalRoles.length) return `missing critical mesh role(s): ${missingCriticalRoles.join(", ")}`;
  const sourceStats = inspectIPhone4Model(root);

  const materials = createIPhone4MaterialRoles();
  // Preserve authored PBR materials and multi-material detail groups.
  // Whole-mesh replacement erased rear markings, rims, and button glyphs.

  const screen = roles.screen!;
  const bootMaterial = new MeshBasicMaterial({
    name: "HeroBootImage",
    map: bootTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    toneMapped: false,
  });
  const bootSurface = new Mesh(screen.geometry, bootMaterial);
  bootSurface.name = "HeroBootSurface";
  bootSurface.renderOrder = screen.renderOrder + 1;
  screen.add(bootSurface);

  const powerButton = roles.powerButton!;
  powerButton.geometry.computeBoundingBox();
  const powerBounds = powerButton.geometry.boundingBox ?? new Box3(
    new Vector3(-0.5, -0.5, -0.5),
    new Vector3(0.5, 0.5, 0.5),
  );
  const hitSize = powerBounds.getSize(new Vector3()).multiplyScalar(2);
  const hitCenter = powerBounds.getCenter(new Vector3());
  const hitMaterial = new MeshBasicMaterial({
    name: "HeroPowerHitMaterial",
    transparent: true,
    opacity: 0,
    depthWrite: false,
    colorWrite: false,
  });
  const hitTarget = new Mesh(new BoxGeometry(hitSize.x, hitSize.y, hitSize.z), hitMaterial);
  hitTarget.name = "HeroPowerButtonHitTarget";
  hitTarget.position.copy(hitCenter);
  powerButton.add(hitTarget);

  return {
    root,
    roles,
    materials,
    bootMaterial,
    hitTarget,
    diagnostics: {
      source: "production",
      fallbackReason: null,
      missingRoles: missingIPhone4MeshRoles(roles),
      missingCriticalRoles,
      stats: sourceStats,
      normalizationScale: normalized.scale,
    },
  };
}

function LoadedProductionModel({
  url,
  bootAmount,
  powerEnabled,
  onPowerPress,
  onReady,
  onFailure,
}: Readonly<{
  url: string;
  bootAmount: number;
  powerEnabled: boolean;
  onPowerPress: () => void;
  onReady: (model: ReadyModel) => void;
  onFailure: (reason: string) => void;
}>) {
  const bootTexture = useLoader(TextureLoader, bootLogoSrc);
  const [source, setSource] = useState<Object3D | null>(null);
  const [loadFailure, setLoadFailure] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    new GLTFLoader().load(
      url,
      (gltf) => { if (active) setSource(gltf.scene); },
      undefined,
      (error) => {
        if (!active) return;
        setLoadFailure(error instanceof Error ? error.message : "GLB load failed");
      },
    );
    return () => { active = false; };
  }, [url]);

  const prepared = useMemo(() => source ? prepareProductionModel(source, bootTexture) : null, [source, bootTexture]);

  useEffect(() => {
    if (loadFailure) onFailure(`load error: ${loadFailure}`);
    if (typeof prepared === "string") onFailure(prepared);
    if (prepared && typeof prepared !== "string") onReady(prepared);
  }, [loadFailure, onFailure, onReady, prepared]);

  useEffect(() => {
    if (!prepared || typeof prepared === "string") return;
    prepared.bootMaterial.opacity = bootAmount;
    prepared.bootMaterial.visible = bootAmount > 0.01;
  }, [bootAmount, prepared]);

  useEffect(() => () => {
    if (!prepared || typeof prepared === "string") return;
    prepared.bootMaterial.dispose();
    prepared.hitTarget.geometry.dispose();
    (prepared.hitTarget.material as Material).dispose();
    disposeIPhone4MaterialRoles(prepared.materials);
  }, [prepared]);

  if (loadFailure || typeof prepared === "string") return null;
  if (!prepared) return null;

  const isPowerTarget = (event: ThreeEvent<PointerEvent>) =>
    objectBelongsToRole(event.object, prepared.roles.powerButton);

  return (
    <primitive
      object={prepared.root}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        if (!powerEnabled || !isPowerTarget(event)) return;
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => { document.body.style.cursor = ""; }}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        if (!powerEnabled || !isPowerTarget(event)) return;
        event.stopPropagation();
      }}
      onPointerUp={(event: ThreeEvent<PointerEvent>) => {
        if (!powerEnabled || !isPowerTarget(event)) return;
        event.stopPropagation();
        document.body.style.cursor = "";
        onPowerPress();
      }}
    />
  );
}

export function ProductionIPhone4Model({
  url,
  bootAmount,
  powerEnabled,
  onPowerPress,
  onRolesReady,
  onDiagnostics,
}: Readonly<{
  url?: string;
  bootAmount: number;
  powerEnabled: boolean;
  onPowerPress: () => void;
  onRolesReady: (roles: IPhone4MeshRoles | null) => void;
  onDiagnostics: (diagnostics: IPhone4ModelDiagnostics) => void;
}>) {
  const [failure, setFailure] = useState<string | null>(url ? null : "asset not present at the production path");
  const [ready, setReady] = useState<ReadyModel | null>(null);

  const handleFailure = useCallback((reason: string) => {
    reportFallbackOnce(reason);
    setFailure(reason);
    setReady(null);
    onRolesReady(null);
    onDiagnostics({
      source: "placeholder",
      fallbackReason: reason,
      missingRoles: [],
      missingCriticalRoles: [],
      stats: null,
      normalizationScale: null,
    });
  }, [onDiagnostics, onRolesReady]);

  const handleReady = useCallback((model: ReadyModel) => {
    setReady(model);
    onRolesReady(model.roles);
    onDiagnostics(model.diagnostics);
  }, [onDiagnostics, onRolesReady]);

  useEffect(() => {
    if (!failure) return;
    reportFallbackOnce(failure);
    onRolesReady(null);
    onDiagnostics({
      source: "placeholder",
      fallbackReason: failure,
      missingRoles: [],
      missingCriticalRoles: [],
      stats: null,
      normalizationScale: null,
    });
  }, [failure, onDiagnostics, onRolesReady]);

  return (
    <>
      {url && !failure ? (
        <LoadedProductionModel
          url={url}
          bootAmount={bootAmount}
          powerEnabled={powerEnabled}
          onPowerPress={onPowerPress}
          onFailure={handleFailure}
          onReady={handleReady}
        />
      ) : null}
      {!url || failure || !ready ? (
        <TemporaryIPhone4Placeholder
          bootAmount={bootAmount}
          powerEnabled={powerEnabled}
          onPowerPress={onPowerPress}
        />
      ) : null}
    </>
  );
}
