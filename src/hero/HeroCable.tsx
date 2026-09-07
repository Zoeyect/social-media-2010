import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, ExtrudeGeometry, Group, Matrix4, MeshStandardMaterial, Shape, Vector3 } from "three";
import { restrainedEase } from "./HeroController";
import { chargerDiagnosticRegistry, chargerDiagnosticsEnabled } from "./HeroChargerDiagnostics";

type HeroCableProps = Readonly<{
  detachAmount: number;
  returnAmount?: number;
  rechargeAmount?: number;
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
export function HeroCable({ detachAmount, returnAmount, rechargeAmount }: HeroCableProps) {
  useEffect(() => {
    if (!chargerDiagnosticsEnabled) return;
    chargerDiagnosticRegistry.mounted = true;
    return () => { chargerDiagnosticRegistry.mounted = false; };
  }, []);
  const { scene } = useThree();
  const root = useRef<Group>(null);
  const release = useRef<Matrix4 | null>(null);
  const matrices = useMemo(() => ({ alignment: new Matrix4().makeRotationX(-Math.PI / 2),
    attached: new Matrix4(), target: new Matrix4(), offset: new Matrix4(), parentInverse: new Matrix4() }), []);
  const housing = useMemo(housingGeometry, []);
  useEffect(() => () => housing.dispose(), [housing]);
  const returning = returnAmount !== undefined;
  const recharging = rechargeAmount !== undefined;
  const withdrawal = returning || recharging ? 0 : restrainedEase(Math.min(1, detachAmount / 0.28));
  const fall = returning || recharging ? 0 : restrainedEase(Math.max(0, (detachAmount - 0.28) / 0.72));
  // Approach begins only after the phone has reached its return pose.
  const opacity = returning ? 0
    : recharging ? restrainedEase(rechargeAmount / 0.25) : 1 - restrainedEase(Math.max(0, (detachAmount - 0.55) / 0.45));
  const separation = returning ? 0.045
    : recharging ? 0.045 * (1 - restrainedEase(rechargeAmount))
    : withdrawal * 0.006 + fall * 0.075;
  useFrame(() => {
    const connector = root.current;
    // Resolve the actual live semantic node, not a cached mesh primitive or
    // an old portal parent retained across model loading/normalization.
    const phone = scene.getObjectByName("PersistentHeroPhone");
    const dock = phone?.getObjectByName("Dock30Pin");
    if (!connector || !dock) {
      if (connector) connector.visible = false;
      return;
    }
    dock.updateWorldMatrix(true, false);
    matrices.attached.multiplyMatrices(dock.matrixWorld, matrices.alignment);
    // Dock local +Z is outward; connector +Y maps to dock -Z (insertion).
    if (returning || recharging || detachAmount < 0.28 || !release.current) {
      release.current = matrices.attached.clone();
    }
    const base = returning || recharging || detachAmount < 0.28 ? matrices.attached : release.current;
    matrices.target.multiplyMatrices(base, matrices.offset.makeTranslation(0, -separation, 0));
    if (connector.parent) {
      connector.parent.updateWorldMatrix(true, false);
      matrices.parentInverse.copy(connector.parent.matrixWorld).invert();
      matrices.target.premultiply(matrices.parentInverse);
    }
    matrices.target.decompose(connector.position, connector.quaternion, connector.scale);
    connector.visible = opacity > 0.005;
    connector.updateWorldMatrix(false, true);
  });
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
  // Stable scene ownership; the complete live dock matrix supplies every
  // attached/approach pose, including normalization and interaction scale.
  return <group name="ThirtyPinConnectorRoot"
    ref={node => { root.current = node; if (chargerDiagnosticsEnabled) chargerDiagnosticRegistry.root = node; }}>
    {/* Visual fit only: root stays on the confirmed dock anchor. Moving the
        whole assembly preserves housing/strain-relief/cable continuity and
        the full 6 mm plug/withdrawal length. Housing bevel top is now -0.4 mm
        from the anchor; the plug tip is +3.8 mm inside when connected. */}
    <group name="ConnectorVisualAssembly" position={[0,0.0032,0]}>
      <mesh name="ConnectorHousing" geometry={housing} material={materials.plastic} position={[0,-0.0096,0]} />
      <mesh name="ConnectorMetal" material={materials.metal} position={[0,-0.0024,0]}>
        <boxGeometry args={[0.0208,0.006,0.0012]} />
      </mesh>
      <group name="ConnectorDetail">
        {[-1,1].map(side => <mesh key={side} material={materials.mark} position={[side*0.0075,-0.0027,0.000615]}>
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
  </group>;
}
