import { useMemo } from "react";
import { Color, Quaternion, Vector3, type Camera, type Mesh, type Object3D } from "three";

// Presentation backdrop only: no light, environment contribution or DOM styling.
// A camera-facing ellipse stays soft even when the hardware is inspected edge-on.
export function placeHeroHalo(card: Object3D, phone: Object3D, camera: Camera) {
  const center = phone.getWorldPosition(new Vector3());
  const scale = phone.getWorldScale(new Vector3()).x;
  const rotation = camera.getWorldQuaternion(new Quaternion());
  const away = center.clone().sub(camera.getWorldPosition(new Vector3())).normalize();
  // Follow the camera-to-phone ray, not merely camera -Z: the halo must also
  // remain centered behind an off-axis phone in the charging-right pose.
  // Beyond the phone's half-diagonal, including during inspection rotation.
  card.position.copy(center).addScaledVector(away, 1.8 * scale);
  card.quaternion.copy(rotation);
  card.scale.set(5.2 * scale, 6.8 * scale, 1);
  card.updateMatrixWorld(true);
}

export function HeroHalo() {
  const uniforms = useMemo(() => {
    const value = import.meta.env.DEV ? new URLSearchParams(location.search).get("heroHalo") : null;
    const requested = value === null ? 0.10 : Number(value);
    return {
      strength: { value: Number.isFinite(requested) ? Math.max(0, Math.min(0.18, requested)) : 0.10 },
      tint: { value: new Color("#747474") },
      mounted: { value: 0 },
    };
  }, []);
  return <mesh name="HeroLocalHalo" frustumCulled={false} renderOrder={-100} raycast={() => {}}
    onBeforeRender={(_renderer, scene, camera, _geometry, _material, _group) => {
      const card = scene.getObjectByName("HeroLocalHalo") as Mesh;
      const phone = scene.getObjectByName("PersistentHeroPhone");
      // Resolve after all frame callbacks: no one-frame lag, phase cache or drift.
      if (phone) placeHeroHalo(card, phone, camera);
      uniforms.mounted.value = phone ? 1 : 0;
    }}>
    <planeGeometry args={[1, 1]} />
    <shaderMaterial transparent depthWrite={false} toneMapped={false} uniforms={uniforms}
      vertexShader={`varying vec2 haloUv;
        void main() { haloUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
      fragmentShader={`uniform float strength; uniform float mounted; uniform vec3 tint; varying vec2 haloUv;
        void main() {
          float radius = length((haloUv - 0.5) * 2.0);
          float fade = exp(-4.0 * radius * radius) * (1.0 - smoothstep(0.65, 1.0, radius));
          gl_FragColor = vec4(tint, mounted * strength * fade);
          #include <colorspace_fragment>
        }`} />
  </mesh>;
}
