import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Matrix4, RectAreaLight, Vector3, type Mesh } from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { heroBootOpacity } from "./HeroController";
import { resolveIPhone4MeshRoles } from "./iphone4ModelContract";
import type { HeroPhase } from "./heroTypes";

type DisplayInput = { phase: HeroPhase; softwareVisible: boolean; awake: boolean; bootStartedAt: number | null; bootComplete: boolean };
export function screenSpillDisplay(input: DisplayInput, now: number) {
  if (input.phase === "experience" && input.softwareVisible && input.awake) return { displayState: "awake", multiplier: 1 };
  if ((input.phase === "powering-on" || input.phase === "front-aligned") && !input.bootComplete && input.bootStartedAt !== null) {
    return { displayState: "boot", multiplier: 0.5 * heroBootOpacity(now - input.bootStartedAt) };
  }
  return { displayState: "off", multiplier: 0 };
}

export function HeroScreenSpill(props: DisplayInput) {
  const { scene, invalidate } = useThree();
  const light = useMemo(() => new RectAreaLight("#f1f5ff", 0, 1, 1), []);
  const attached = useRef<Mesh | null>(null);
  const dimensions = useRef({ width: 0, height: 0 });
  const report = useRef({ screenSpillEnabled: false, screenSpillIntensity: 0, displayState: "off" });
  const strength = useMemo(() => {
    const raw = import.meta.env.DEV ? new URLSearchParams(location.search).get("heroScreenSpill") : null;
    const value = raw === null ? 0.03 : Number(raw);
    return Number.isFinite(value) ? Math.max(0, Math.min(0.07, value)) : 0.03;
  }, []);
  useEffect(() => {
    RectAreaLightUniformsLib.init();
    light.name = "HeroScreenEmissionSpill";
    invalidate();
    return () => { light.removeFromParent(); attached.current = null; light.dispose(); };
  }, [light, invalidate]);
  useEffect(() => { invalidate(); }, [props.phase, props.softwareVisible, props.awake, props.bootStartedAt, props.bootComplete, invalidate]);
  useFrame((_, delta) => {
    if (!attached.current) {
      const phone = scene.getObjectByName("PersistentHeroPhone");
      const screen = phone && resolveIPhone4MeshRoles(phone).screen;
      if (screen) {
        screen.geometry.computeBoundingBox();
        const bounds = screen.geometry.boundingBox;
        if (!bounds) return;
        const size = bounds.getSize(new Vector3());
        const axes = [0, 1, 2].sort((a, b) => size.getComponent(a) - size.getComponent(b));
        const normal = new Vector3().setComponent(axes[0], 1);
        screen.updateWorldMatrix(true, false);
        const outward = new Vector3(0, 0, 1).transformDirection(phone.matrixWorld);
        if (normal.clone().transformDirection(screen.matrixWorld).dot(outward) < 0) normal.negate();
        const up = new Vector3().setComponent(axes[2], 1);
        const right = up.clone().cross(normal).normalize();
        light.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(right, up, normal));
        // Tiny reconstructed bounce source above LCD, facing back onto bezel.
        light.position.copy(bounds.getCenter(new Vector3())).addScaledVector(normal, size.getComponent(axes[0]) / 2 + size.getComponent(axes[2]) * 0.035);
        dimensions.current = { width: size.getComponent(axes[1]) * 0.85, height: size.getComponent(axes[2]) * 0.85 };
        screen.add(light);
        attached.current = screen;
        invalidate();
      }
    }
    const display = screenSpillDisplay(props, performance.now());
    const target = attached.current ? strength * display.multiplier : 0;
    light.intensity = MathUtils.damp(light.intensity, target, 40, Math.min(delta, 0.05));
    if (Math.abs(light.intensity - target) < 0.0001) light.intensity = target;
    else invalidate();
    if (display.displayState === "boot") invalidate();
    if (attached.current) {
      // Three's area-light uniforms remove matrix scale; apply it to dimensions.
      const scale = attached.current.getWorldScale(new Vector3()).x;
      light.width = dimensions.current.width * scale;
      light.height = dimensions.current.height * scale;
    }
    report.current = { screenSpillEnabled: light.intensity > 0, screenSpillIntensity: light.intensity, displayState: display.displayState };
  });
  useEffect(() => {
    if (!import.meta.env.DEV || !["heroDebug", "heroLightingDebug", "heroLifecycleDebug"].some(key => new URLSearchParams(location.search).get(key) === "1")) return;
    const output = document.createElement("output");
    Object.assign(output.style, { position: "fixed", left: "8px", top: "70px", zIndex: "45", color: "#bbb", background: "#101010dd", font: "11px monospace", pointerEvents: "none" });
    document.body.append(output);
    const sample = () => { output.textContent = JSON.stringify(report.current); };
    sample(); const timer = window.setInterval(sample, 100);
    return () => { window.clearInterval(timer); output.remove(); };
  }, []);
  return null;
}
