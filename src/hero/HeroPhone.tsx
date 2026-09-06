import { useCallback, useEffect, useRef, useState } from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Group, MathUtils, Quaternion, Vector3 } from "three";
import { HERO_DETACH_DURATION_SECONDS, HERO_POWER_DURATION_SECONDS, restrainedEase } from "./HeroController";
import { measureHeroScreenGeometry } from "./heroScreenGeometry";
import {
  ProductionIPhone4Model,
  type IPhone4ModelDiagnostics,
} from "./ProductionIPhone4Model";
import {
  PRODUCTION_IPHONE4_MODEL_URL,
  resolveIPhone4MeshRoles,
  type IPhone4MeshRoles,
} from "./iphone4ModelContract";
import type { HeroCableAnchor, HeroPhase, HeroScreenGeometry } from "./heroTypes";

const MAX_ROTATE_X = MathUtils.degToRad(20);
const START_ROTATION_X = MathUtils.degToRad(10);
const START_ROTATION_Y = MathUtils.degToRad(-34);

type HeroPhoneProps = Readonly<{
  phase: HeroPhase;
  modelUrl?: string;
  onDetachComplete: () => void;
  onPowerPress: () => void;
  onAlignmentComplete: () => void;
  onScreenGeometry: (geometry: HeroScreenGeometry) => void;
  onCableState: (progress: number, anchor: HeroCableAnchor) => void;
}>;

type DragState = {
  pointerId: number;
  x: number;
  y: number;
};

export function HeroPhone({
  phase,
  modelUrl = PRODUCTION_IPHONE4_MODEL_URL,
  onDetachComplete,
  onPowerPress,
  onAlignmentComplete,
  onScreenGeometry,
  onCableState,
}: HeroPhoneProps) {
  const group = useRef<Group>(null);
  const modelRoot = useRef<Group>(null);
  const roles = useRef<IPhone4MeshRoles | null>(null);
  const phaseElapsed = useRef(0);
  const rotation = useRef({ x: START_ROTATION_X, y: START_ROTATION_Y });
  const powerStartRotation = useRef({ x: START_ROTATION_X, y: START_ROTATION_Y });
  const velocity = useRef({ x: 0, y: 0 });
  const drag = useRef<DragState | null>(null);
  const boundsReported = useRef(false);
  const cableAnchor = useRef<HeroCableAnchor>({ position: [0, 0, 0] });
  const reportedDiagnostics = useRef("");
  const [bootAmount, setBootAmount] = useState(0);
  const { camera, invalidate, size } = useThree();
  const narrow = size.width < 760;
  const initialX = narrow ? 0 : Math.min(2.15, size.width / 420);
  const initialY = narrow ? -0.72 : 0;

  const handleRolesReady = useCallback((resolved: IPhone4MeshRoles | null) => {
    roles.current = resolved;
    boundsReported.current = false;
    invalidate();
  }, [invalidate]);

  const handleDiagnostics = useCallback((diagnostics: IPhone4ModelDiagnostics) => {
    const signature = JSON.stringify(diagnostics);
    if (!import.meta.env.DEV || reportedDiagnostics.current === signature) return;
    reportedDiagnostics.current = signature;
    console.info("[HeroPhone] model integration report", diagnostics);
  }, []);

  useEffect(() => {
    phaseElapsed.current = 0;
    boundsReported.current = false;
    if (phase === "identity") {
      rotation.current = { x: START_ROTATION_X, y: START_ROTATION_Y };
      velocity.current = { x: 0, y: 0 };
    }
    if (phase === "powering-on") powerStartRotation.current = { ...rotation.current };
    if (phase !== "inspect") drag.current = null;
    invalidate();
  }, [phase, invalidate]);

  useFrame((_, delta) => {
    const phone = group.current;
    const mountedModel = modelRoot.current;
    if (!phone || !mountedModel) return;
    if (!roles.current) roles.current = resolveIPhone4MeshRoles(mountedModel);
    phaseElapsed.current += Math.min(delta, 0.05);

    let x = initialX;
    let y = initialY;
    let scale = narrow ? 0.76 : 0.9;
    let detachProgress = phase === "identity" ? 0 : 1;
    let nextBootAmount = 0;

    if (phase === "detaching") {
      detachProgress = Math.min(1, phaseElapsed.current / HERO_DETACH_DURATION_SECONDS);
      const eased = restrainedEase(detachProgress);
      x = MathUtils.lerp(initialX, 0, eased);
      y = MathUtils.lerp(initialY, 0, eased);
      scale = MathUtils.lerp(scale, narrow ? 0.92 : 1.04, eased);
      invalidate();
      if (detachProgress === 1) onDetachComplete();
    } else if (phase === "inspect") {
      x = 0;
      y = 0;
      scale = narrow ? 0.92 : 1.04;
      if (!drag.current && (Math.abs(velocity.current.x) > 0.00008 || Math.abs(velocity.current.y) > 0.00008)) {
        rotation.current.x = MathUtils.clamp(rotation.current.x + velocity.current.x, -MAX_ROTATE_X, MAX_ROTATE_X);
        rotation.current.y += velocity.current.y;
        velocity.current.x *= 0.88;
        velocity.current.y *= 0.88;
        invalidate();
      }
    } else if (phase === "powering-on" || phase === "front-aligned") {
      x = 0;
      y = 0;
      const progress = phase === "front-aligned" ? 1 : Math.min(1, phaseElapsed.current / HERO_POWER_DURATION_SECONDS);
      const eased = restrainedEase(progress);
      scale = MathUtils.lerp(narrow ? 0.92 : 1.04, narrow ? 1.02 : 1.18, eased);
      rotation.current.x = phase === "front-aligned" ? 0 : MathUtils.lerp(powerStartRotation.current.x, 0, eased);
      rotation.current.y = phase === "front-aligned" ? 0 : MathUtils.lerp(powerStartRotation.current.y, 0, eased);
      nextBootAmount = Math.max(0, Math.min(1, (progress - 0.38) / 0.42));
      if (phase === "powering-on") {
        invalidate();
        if (progress === 1) onAlignmentComplete();
      }
    }

    phone.position.set(x, y, 0);
    phone.scale.setScalar(scale);
    phone.rotation.set(rotation.current.x, rotation.current.y, 0);
    phone.updateWorldMatrix(true, true);
    setBootAmount((current) => Math.abs(current - nextBootAmount) > 0.015 ? nextBootAmount : current);

    const dock = roles.current?.dock30Pin;
    if ((phase === "identity" || (phase === "detaching" && detachProgress < 0.28)) && dock) {
      const position = dock.getWorldPosition(new Vector3());
      // Dock30Pin's own +90-degree rotation describes its port surface,
      // not the phone axes. The connector's +Y must follow phone-up.
      const quaternion = phone.getWorldQuaternion(new Quaternion());
      const scale = dock.getWorldScale(new Vector3()).x;
      cableAnchor.current = {
        dock: dock.parent?.name === "Dock30Pin" ? dock.parent : dock,
        position: [position.x, position.y, position.z],
        quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
        scale,
      };
    }
    onCableState(detachProgress, cableAnchor.current);

    if (phase === "front-aligned" && !boundsReported.current && roles.current?.screen) {
      const geometry = measureHeroScreenGeometry(roles.current.screen, camera, size);
      if (geometry) {
        boundsReported.current = true;
        onScreenGeometry(geometry);
      }
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (phase !== "inspect") return;
    event.stopPropagation();
    const target = event.target as HTMLElement | null;
    target?.setPointerCapture?.(event.pointerId);
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    velocity.current = { x: 0, y: 0 };
  };
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const active = drag.current;
    if (phase !== "inspect" || !active || active.pointerId !== event.pointerId) return;
    event.stopPropagation();
    const dx = event.clientX - active.x;
    const dy = event.clientY - active.y;
    rotation.current.x = MathUtils.clamp(rotation.current.x + dy * 0.006, -MAX_ROTATE_X, MAX_ROTATE_X);
    rotation.current.y += dx * 0.007;
    velocity.current = { x: dy * 0.0007, y: dx * 0.0008 };
    active.x = event.clientX;
    active.y = event.clientY;
    invalidate();
  };
  const endDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    drag.current = null;
    invalidate();
  };

  return (
    <group
      ref={group}
      name="PersistentHeroPhone"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <group ref={modelRoot} name="HeroPhoneGeometry">
        <ProductionIPhone4Model
          url={modelUrl}
          bootAmount={bootAmount}
          powerEnabled={phase === "inspect"}
          onPowerPress={onPowerPress}
          onRolesReady={handleRolesReady}
          onDiagnostics={handleDiagnostics}
        />
      </group>
    </group>
  );
}
