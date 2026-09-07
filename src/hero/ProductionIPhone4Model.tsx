import type { RuntimePowerControl } from "../device/DevicePresentation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import {
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
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
  type IPhone4MeshRoles,
  type IPhone4ModelStats,
} from "./iphone4ModelContract";
import {
  createIPhone4MaterialRoles,
  calibrateIPhone4Stainless,
  disposeIPhone4MaterialRoles,
  type IPhone4MaterialRoles,
} from "./iphone4Materials";
import { normalizeIPhone4Model } from "./iphone4Normalization";
import { useHeroHardware } from "./useHeroHardware";

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

  return {
    root,
    roles,
    materials,
    bootMaterial,
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
  resetGeneration,
  url,
  bootAmount,
  powerEnabled,
  onPowerPress,
  onHomePress,
  runtimePower,
  onReady,
  onFailure,
}: Readonly<{
  url: string;
  resetGeneration: number;
  bootAmount: number;
  powerEnabled: boolean;
  onPowerPress: () => void;
  onHomePress?: () => void;
  runtimePower?: RuntimePowerControl;
  onReady: (model: ReadyModel) => void;
  onFailure: (reason: string) => void;
}>) {
  const bootTexture = useLoader(TextureLoader, bootLogoSrc);
  const { scene, invalidate } = useThree();
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
  const hardwareEvents = useHeroHardware(prepared && typeof prepared !== "string" ? prepared.root : null, powerEnabled, onPowerPress, onHomePress, runtimePower, resetGeneration);

  useEffect(() => {
    if (!prepared || typeof prepared === "string") return;
    const cleanup = calibrateIPhone4Stainless(prepared.root, { scene, invalidate });
    invalidate();
    return cleanup;
  }, [prepared, scene, invalidate]);

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
    disposeIPhone4MaterialRoles(prepared.materials);
  }, [prepared]);

  if (loadFailure || typeof prepared === "string") return null;
  if (!prepared) return null;

  return (
    <primitive
      object={prepared.root}
      {...hardwareEvents}
    />
  );
}

export function ProductionIPhone4Model({
  resetGeneration,
  url,
  bootAmount,
  powerEnabled,
  onPowerPress,
  onHomePress,
  runtimePower,
  onRolesReady,
  onDiagnostics,
}: Readonly<{
  url?: string;
  resetGeneration: number;
  bootAmount: number;
  powerEnabled: boolean;
  onPowerPress: () => void;
  onHomePress?: () => void;
  runtimePower?: RuntimePowerControl;
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
          resetGeneration={resetGeneration}
          url={url}
          bootAmount={bootAmount}
          powerEnabled={powerEnabled}
          onPowerPress={onPowerPress}
          onHomePress={onHomePress}
          runtimePower={runtimePower}
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
