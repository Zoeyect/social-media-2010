import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ACESFilmicToneMapping, Color, Mesh, MeshLambertMaterial, PMREMGenerator } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { HeroCable } from "./HeroCable";
import { HeroPhone } from "./HeroPhone";
import type { HeroCableAnchor, HeroPhase, HeroScreenGeometry } from "./heroTypes";

type HeroSceneProps = Readonly<{
  phase: HeroPhase;
  onDetachComplete: () => void;
  onPowerPress: () => void;
  onAlignmentComplete: () => void;
  onScreenGeometry: (geometry: HeroScreenGeometry) => void;
}>;

function ReflectionEnvironment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    // Limit the HDR sources themselves, not overall scene brightness.
    // The default room has broad emissive panels at intensities 17–100.
    room.traverse(object => {
      if (!(object instanceof Mesh) || !(object.material instanceof MeshLambertMaterial)) return;
      if (object.material.emissiveIntensity <= 1) return;
      object.material.emissiveIntensity = 6;
      if (object.scale.x < 0.2) object.scale.z *= 0.35;
      else object.scale.x *= 0.35;
    });
    const map = generator.fromScene(room, 0.06);
    scene.environment = map.texture;
    // Broad room reflections should reveal satin steel without bleaching it.
    scene.environmentIntensity = 0.12;
    room.dispose();
    generator.dispose();
    invalidate();
    return () => { scene.environment = null; map.dispose(); };
  }, [gl, scene, invalidate]);
  return null;
}

function SceneContents(props: HeroSceneProps) {
  const [cable, setCable] = useState<{ progress: number; anchor: HeroCableAnchor }>({
    progress: 0,
    anchor: { position: [0, 0, 0] },
  });
  const updateCable = useCallback((progress: number, anchor: HeroCableAnchor) => {
    setCable((current) => {
      const sameAnchor = current.anchor.dock === anchor.dock && current.anchor.scale === anchor.scale
        && current.anchor.position.every((value, index) => value === anchor.position[index])
        && current.anchor.quaternion?.every((value, index) => value === anchor.quaternion?.[index]);
      return current.progress === progress && sameAnchor ? current : { progress, anchor };
    });
  }, []);

  return <>
    <ReflectionEnvironment />
    <ambientLight intensity={0.3} />
    <directionalLight position={[-3, 4, 5]} intensity={1.2} color="#f0eee8" />
    <directionalLight position={[4, 1, -2]} intensity={0.45} color="#c8c9c5" />
    <pointLight position={[-2, -3, 3]} intensity={5} distance={8} color="#aeb4b5" />
    <Suspense fallback={null}>
      <HeroCable detachAmount={props.phase === "identity" ? 0 : cable.progress} anchor={cable.anchor} />
      <HeroPhone {...props} onCableState={updateCable} />
    </Suspense>
  </>;
}

export function HeroScene(props: HeroSceneProps) {
  return (
    <div className="hero-scene" aria-label="Interactive temporary reconstruction of a black iPhone 4">
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
        <SceneContents {...props} />
      </Canvas>
    </div>
  );
}
