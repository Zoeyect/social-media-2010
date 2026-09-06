import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ACESFilmicToneMapping, Color, Mesh, MeshBasicMaterial, PlaneGeometry, PMREMGenerator, RectAreaLight, Scene } from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { HeroCable } from "./HeroCable";
import { HeroPhone } from "./HeroPhone";
import { HeroChargerDiagnostics, chargerDiagnosticsEnabled } from "./HeroChargerDiagnostics";
import type { HeroCableAnchor, HeroPhase, HeroScreenGeometry } from "./heroTypes";

type HeroSceneProps = Readonly<{
  phase: HeroPhase;
  onDetachComplete: () => void;
  onPowerPress: () => void;
  onAlignmentComplete: () => void;
  onScreenGeometry: (geometry: HeroScreenGeometry) => void;
  onLifecycleAdvance: () => void;
}>;

function ReflectionEnvironment({ revised }: { revised: boolean }) {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new Scene();
    {
      // Bounded, neutral reflection cards: no HDR room point light or tiny emitters.
      room.background = new Color().setRGB(0.025, 0.025, 0.025);
      const cards = revised ? [
        // Main card reaches the reflected viewing direction of the -34° yaw
        // identity pose. Finite edges, rather than a brighter diffuse base,
        // articulate the black glass plane as the phone rotates.
        [-6, 2, 3, 7, 10, 2.5], [6, 1, 1, 3, 8, 1.2],
        [3, 2, -6, 6, 10, 1.8], [-6, 0, -3, 4, 8, 0.6],
        [0, 7, 0, 8, 5, 0.45],
      ] : [
        [-4, 3, 6, 6, 8, 1.0], [5, 1, 3, 5, 7, 0.35],
        [3, 2, -6, 5, 8, 0.55], [-5, 0, -2, 3, 7, 0.25],
      ];
      for (const [x, y, z, width, height, radiance] of cards) {
        const card = new Mesh(new PlaneGeometry(width, height),
          new MeshBasicMaterial({ color: new Color().setRGB(radiance, radiance, radiance) }));
        card.position.set(x, y, z);
        card.lookAt(0, 0, 0);
        room.add(card);
      }
    }
    const map = generator.fromScene(room, revised ? 0.08 : 0.16);
    scene.environment = map.texture;
    // Broad room reflections should reveal satin steel without bleaching it.
    scene.environmentIntensity = revised ? 0.55 : 0.4;
    scene.background = null;
    room.traverse(object => {
      if (object instanceof Mesh) { object.geometry.dispose(); (object.material as MeshBasicMaterial).dispose(); }
    });
    generator.dispose();
    invalidate();
    return () => { scene.environment = null; map.dispose(); };
  }, [gl, scene, invalidate, revised]);
  return null;
}

function SoftLighting({ studio }: { studio: boolean }) {
  const { scene, invalidate } = useThree();
  useEffect(() => {
    RectAreaLightUniformsLib.init();
    const settings = studio ? [
      { name: "HeroSoftboxA", position: [-5,3,4], intensity: 1.3, width: 7, height: 9 },
      { name: "HeroSoftboxB", position: [5,1,1], intensity: 0.55, width: 3, height: 8 },
      { name: "HeroSoftboxC", position: [3,2,-5], intensity: 0.65, width: 6, height: 9 },
    ] : [
      { name: "HeroSoftKey", position: [-3,4,5], intensity: 0.8, width: 5, height: 7 },
      { name: "HeroSoftFill", position: [4,1,4], intensity: 0.25, width: 4, height: 6 },
      { name: "HeroSoftRim", position: [3,2,-4], intensity: 0.4, width: 3, height: 6 },
    ];
    const lights = settings.map(settings => {
      const light = new RectAreaLight(0xffffff, settings.intensity, settings.width, settings.height);
      light.name = settings.name;
      light.position.set(...settings.position as [number, number, number]);
      light.lookAt(0,0,0);
      scene.add(light);
      return light;
    });
    invalidate();
    return () => { lights.forEach(light => scene.remove(light)); invalidate(); };
  }, [scene, invalidate, studio]);
  return <ambientLight intensity={studio ? 0.12 : 0.3} />;
}

function SceneContents(props: HeroSceneProps & { revised: boolean }) {
  const [cable, setCable] = useState<{ progress: number; anchor: HeroCableAnchor; phase: HeroPhase }>({
    progress: 0,
    phase: "identity",
    anchor: { position: [0, 0, 0] },
  });
  const updateCable = useCallback((progress: number, anchor: HeroCableAnchor, phase: HeroPhase) => {
    setCable((current) => {
      const sameAnchor = current.anchor.dock === anchor.dock && current.anchor.scale === anchor.scale
        && current.anchor.position.every((value, index) => value === anchor.position[index])
        && current.anchor.quaternion?.every((value, index) => value === anchor.quaternion?.[index]);
      return current.phase === phase && current.progress === progress && sameAnchor ? current : { progress, anchor, phase };
    });
  }, []);

  return <>
    <ReflectionEnvironment revised={props.revised} />
    <SoftLighting studio={props.revised} />
    <Suspense fallback={null}>
      <HeroCable detachAmount={props.phase === "identity" || props.phase === "recharging" ? 0 : cable.progress}
        rechargeAmount={props.phase === "recharging" ? (cable.phase === "recharging" ? cable.progress : 0) : undefined}
        returnAmount={props.phase === "returning" ? (cable.phase === "returning" ? cable.progress : 0) : undefined} />
      <HeroPhone {...props} onCableState={updateCable} />
    </Suspense>
    {chargerDiagnosticsEnabled && <HeroChargerDiagnostics phase={props.phase} anchor={cable.anchor} />}
  </>;
}

export function HeroScene(props: HeroSceneProps) {
  // Studio remains opt-in until manual Safari approval. Legacy means the
  // immediately preceding soft-light presentation, not the old point rig.
  const [revised, setRevised] = useState(() => import.meta.env.DEV
    && new URLSearchParams(window.location.search).get("heroLighting") === "studio");
  const lightingDebug = import.meta.env.DEV && new URLSearchParams(window.location.search).get("heroLightingDebug") === "1";
  return (
    <div className="hero-scene" data-lighting="revised" aria-label="Interactive temporary reconstruction of a black iPhone 4">
      {lightingDebug && <nav className="hero-lighting-comparison" aria-label="Lighting comparison">
        {([false, true] as const).map(value => <button key={String(value)} type="button" aria-pressed={revised === value} onClick={() => setRevised(value)}>{value ? "studio" : "legacy"}</button>)}
      </nav>}
      <Canvas
        frameloop="demand"
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 7], fov: 38, near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ scene, gl }) => {
          scene.background = new Color("#0b0b0b");
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.85;
          gl.domElement.style.touchAction = "none";
        }}
      >
        <SceneContents {...props} revised={revised} />
      </Canvas>
    </div>
  );
}
