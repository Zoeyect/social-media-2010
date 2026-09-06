import { useEffect, useMemo } from "react";
import { createPortal, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, ExtrudeGeometry, MeshStandardMaterial, Quaternion, Shape, Vector3 } from "three";
import { restrainedEase } from "./HeroController";
import type { HeroCableAnchor } from "./heroTypes";

type HeroCableProps = Readonly<{
  detachAmount: number;
  anchor: HeroCableAnchor;
}>;

function housingGeometry() {
  const shape = new Shape();
  const w = 0.0126, h = 0.0057, r = 0.0012;
  shape.moveTo(-w+r,-h);
  shape.lineTo(w-r,-h); shape.quadraticCurveTo(w,-h,w,-h+r);
  shape.lineTo(w,h-r); shape.quadraticCurveTo(w,h,w-r,h);
  shape.lineTo(-w+r,h); shape.quadraticCurveTo(-w,h,-w,h-r);
  shape.lineTo(-w,-h+r); shape.quadraticCurveTo(-w,-h,-w+r,-h);
  const geometry = new ExtrudeGeometry(shape, { depth: 0.0042, bevelEnabled: true,
    bevelSize: 0.0003, bevelThickness: 0.0003, bevelSegments: 2, steps: 1, curveSegments: 5 });
  geometry.translate(0,0,-0.0021);
  return geometry;
}

/** Reference-based exterior in meters. +Y inserts into the dock. */
export function HeroCable({ detachAmount, anchor }: HeroCableProps) {
  const { scene } = useThree();
  const housing = useMemo(housingGeometry, []);
  useEffect(() => () => housing.dispose(), [housing]);
  const withdrawal = restrainedEase(Math.min(1, detachAmount / 0.28));
  const fall = restrainedEase(Math.max(0, (detachAmount - 0.28) / 0.72));
  const opacity = 1 - restrainedEase(Math.max(0, (detachAmount - 0.55) / 0.45));
  const materials = useMemo(() => ({
    plastic: new MeshStandardMaterial({ name: "MAT_ChargerPlastic", color: "#bdbbb5", roughness: 0.48, transparent: true }),
    metal: new MeshStandardMaterial({ name: "MAT_ChargerMetal", color: "#8c9193", metalness: 0.85, roughness: 0.34, transparent: true }),
    cable: new MeshStandardMaterial({ name: "MAT_Cable", color: "#b8b7b1", roughness: 0.65, transparent: true }),
    mark: new MeshStandardMaterial({ name: "MAT_ConnectorMark", color: "#777b79", roughness: 0.65, transparent: true }),
  }), []);
  useEffect(() => () => Object.values(materials).forEach(material => material.dispose()), [materials]);
  Object.values(materials).forEach(material => { material.opacity = opacity; });
  const curve = useMemo(() => new CatmullRomCurve3([
    new Vector3(0,-0.024,0), new Vector3(0.0005,-0.036,0),
    new Vector3(-0.003-fall*0.007,-0.060,0.003),
    new Vector3(0.008-fall*0.018,-0.102,0.008),
    new Vector3(-0.013-fall*0.018,-0.16,0.012),
  ]), [fall]);
  const connected = detachAmount < 0.28 && !!anchor.dock;
  const worldOrientation = new Quaternion(...(anchor.quaternion ?? [0, 0, 0, 1]));
  const orientation = connected
    ? anchor.dock!.getWorldQuaternion(new Quaternion()).invert().multiply(worldOrientation)
    : worldOrientation;
  // While inserted, the actual GLB dock owns the connector in the scene graph.
  // After withdrawal, the last dock world transform supplies the release pose.
  return createPortal(<group name="ThirtyPinConnectorRoot"
    position={connected ? [0, 0, 0] : [...anchor.position]}
    quaternion={orientation} scale={connected ? 1 : (anchor.scale ?? 1)}
    visible={opacity > 0.005 && !!anchor.dock}>
    <group position={[0,-withdrawal*0.006-fall*0.075,0]}>
      <mesh name="ConnectorHousing" geometry={housing} material={materials.plastic} position={[0,-0.0096,0]} />
      <mesh name="ConnectorMetal" material={materials.metal} position={[0,-0.0024,0]}>
        <boxGeometry args={[0.0208,0.006,0.0020]} />
      </mesh>
      <group name="ConnectorDetail">
        {[-1,1].map(side => <mesh key={side} material={materials.mark} position={[side*0.0075,-0.0027,0.001015]}>
          <boxGeometry args={[0.0011,0.0016,0.00002]} />
        </mesh>)}
        {[[0,-0.0081,0.0036,0.00018],[0,-0.0101,0.0036,0.00018],[-0.0018,-0.0091,0.00018,0.002],[0.0018,-0.0091,0.00018,0.002],[0,-0.0091,0.002,0.00018]].map(([x,y,w,h],i) =>
          <mesh key={i} material={materials.mark} position={[x,y,0.00242]}>
            <boxGeometry args={[w,h,0.000015]} />
          </mesh>)}
      </group>
      <mesh name="StrainRelief" material={materials.cable} position={[0,-0.0201,0]}>
        <cylinderGeometry args={[0.0018,0.00125,0.009,16]} />
      </mesh>
      <mesh name="Cable" material={materials.cable}>
        <tubeGeometry args={[curve,40,0.0012,8,false]} />
      </mesh>
    </group>
  </group>, connected ? anchor.dock! : scene);
}
