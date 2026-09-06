import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { ArrowHelper, Box3, Frustum, Matrix4, Mesh, Object3D, Quaternion, Vector3 } from "three";
import type { HeroCableAnchor, HeroPhase } from "./heroTypes";

export const chargerDiagnosticsEnabled = import.meta.env.DEV
  && new URLSearchParams(window.location.search).get("heroDebug") === "1";

// Keep an independent reference: scene traversal alone cannot find an orphaned portal.
export const chargerDiagnosticRegistry: { mounted: boolean; root: Object3D | null } = {
  mounted: false, root: null,
};

const tuple = (values: number[]) => values.map(value => Number(value.toFixed(6)));
function transform(object: Object3D | null | undefined) {
  if (!object) return null;
  object.updateWorldMatrix(true, true);
  const ancestors = [];
  for (let node: Object3D | null = object; node; node = node.parent) {
    ancestors.push({ name: node.name || node.type, visible: node.visible, scale: tuple(node.scale.toArray()) });
  }
  return { name: object.name, uuid: object.uuid, localPosition: tuple(object.position.toArray()),
    worldPosition: tuple(object.getWorldPosition(new Vector3()).toArray()),
    worldQuaternion: tuple(object.getWorldQuaternion(new Quaternion()).toArray()),
    worldScale: tuple(object.getWorldScale(new Vector3()).toArray()),
    visible: object.visible, layers: object.layers.mask, renderOrder: object.renderOrder, ancestors };
}

export function HeroChargerDiagnostics({ phase, anchor }: { phase: HeroPhase; anchor: HeroCableAnchor }) {
  const { scene, camera, size, invalidate } = useThree();
  const red = useRef<Mesh>(null);
  const green = useRef<Mesh>(null);
  const output = useRef<HTMLPreElement | null>(null);
  useEffect(() => {
    const panel = document.createElement("details");
    panel.open = true;
    Object.assign(panel.style, { position: "fixed", zIndex: "30", left: "8px", top: "8px", maxWidth: "min(440px, 90vw)", color: "#ddd", background: "#101010ed", padding: "8px", font: "11px monospace" });
    const heading = document.createElement("summary");
    heading.textContent = "Charger audit · red dock / green connector";
    const pre = document.createElement("pre");
    Object.assign(pre.style, { maxHeight: "35vh", overflow: "auto", userSelect: "text" });
    panel.append(heading, pre);
    document.body.append(panel);
    output.current = pre;
    return () => { output.current = null; panel.remove(); };
  }, []);
  useEffect(() => {
    const dockAxis = new ArrowHelper(new Vector3(0,-1,0), new Vector3(), 0.45, 0xff4444);
    const plugAxis = new ArrowHelper(new Vector3(0,1,0), new Vector3(), 0.35, 0x44ff88);
    for (const arrow of [dockAxis, plugAxis]) {
      arrow.name = "DEV_ChargerAxis";
      for (const part of [arrow.line, arrow.cone]) {
        const materials = Array.isArray(part.material) ? part.material : [part.material];
        materials.forEach(material => { material.depthTest = false; material.depthWrite = false; });
        part.renderOrder = 10000;
      }
      scene.add(arrow);
    }
    const sample = () => {
      scene.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      const dock = scene.getObjectByName("Dock30Pin");
      const root = chargerDiagnosticRegistry.root;
      const frustum = new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
      const project = (point: Vector3) => {
        const view = point.clone().applyMatrix4(camera.matrixWorldInverse);
        const ndc = point.clone().project(camera);
        return { ndc: tuple(ndc.toArray()), pixels: tuple([(ndc.x+1)*size.width/2, (1-ndc.y)*size.height/2]),
          behindCamera: view.z >= 0, belowViewport: ndc.y < -1, depthClipped: ndc.z < -1 || ndc.z > 1 };
      };
      const meshReport = (name: string) => {
        const object = root?.getObjectByName(name);
        if (!(object instanceof Mesh)) return { instantiated: false };
        const bounds = new Box3().setFromObject(object);
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        return { instantiated: true, ...transform(object), bounds: { min: tuple(bounds.min.toArray()), max: tuple(bounds.max.toArray()) },
          inFrustum: frustum.intersectsBox(bounds), cameraLayerMatch: camera.layers.test(object.layers),
          projectedCenter: project(bounds.getCenter(new Vector3())),
          materials: materials.map(material => ({ name: material.name, visible: material.visible,
            opacity: material.opacity, transparent: material.transparent, depthTest: material.depthTest, depthWrite: material.depthWrite })) };
      };
      const dockPoint = dock?.getWorldPosition(new Vector3());
      const rootPoint = root?.getWorldPosition(new Vector3());
      const metal = root?.getObjectByName("ConnectorMetal");
      // Box metal extends 3 mm toward +Y from its center: actual insertion tip.
      const insertionPoint = metal?.localToWorld(new Vector3(0, 0.003, 0));
      const outward = dock ? new Vector3(0,0,1).transformDirection(dock.matrixWorld) : null;
      const insertion = root ? new Vector3(0,1,0).transformDirection(root.matrixWorld) : null;
      if (red.current) { red.current.visible = !!dockPoint; if (dockPoint) red.current.position.copy(dockPoint); }
      if (green.current) { green.current.visible = !!rootPoint; if (rootPoint) green.current.position.copy(rootPoint); }
      dockAxis.visible = !!dockPoint;
      plugAxis.visible = !!rootPoint;
      if (dockPoint && outward) { dockAxis.position.copy(dockPoint); dockAxis.setDirection(outward); }
      if (rootPoint && insertion) { plugAxis.position.copy(rootPoint); plugAxis.setDirection(insertion); }
      const phone = scene.getObjectByName("PhoneBody");
      const phoneBounds = phone ? new Box3().setFromObject(phone) : null;
      if (output.current) output.current.textContent = JSON.stringify({ phase, mounted: chargerDiagnosticRegistry.mounted,
        rootInLiveScene: !!root && scene.getObjectByProperty("uuid", root.uuid) === root,
        anchorIsLiveDock: !!dock && anchor.dock === dock,
        dock: transform(dock), suppliedAnchor: transform(anchor.dock), chargerRoot: transform(root),
        dockProjection: dockPoint ? project(dockPoint) : null, rootProjection: rootPoint ? project(rootPoint) : null,
        insertionPoint: insertionPoint ? tuple(insertionPoint.toArray()) : null,
        insertionDistanceWorld: dockPoint && insertionPoint ? dockPoint.distanceTo(insertionPoint) : null,
        rootDistanceWorld: dockPoint && rootPoint ? dockPoint.distanceTo(rootPoint) : null,
        opposingAxesDot: outward && insertion ? outward.dot(insertion) : null,
        metalTipInsidePhoneWorldAABB: phoneBounds && insertionPoint ? phoneBounds.containsPoint(insertionPoint) : null,
        meshes: Object.fromEntries(["ConnectorHousing", "ConnectorMetal", "StrainRelief", "Cable"].map(name => [name, meshReport(name)])),
        note: "AABB overlap is not proof of occlusion. Distances use Hero world units, not meters. Red=live dock/+Z outward; green=charger/+Y insertion. Expected opposingAxesDot=-1." }, null, 2);
      invalidate();
    };
    sample();
    const timer = window.setInterval(sample, 200);
    return () => { window.clearInterval(timer); for (const arrow of [dockAxis, plugAxis]) { scene.remove(arrow); arrow.dispose(); } };
  }, [anchor, phase, scene, camera, size.width, size.height, invalidate]);
  return <>
    <mesh ref={red} renderOrder={10000}><sphereGeometry args={[0.055,16,12]} /><meshBasicMaterial color="#ff3333" depthTest={false} depthWrite={false} /></mesh>
    <mesh ref={green} renderOrder={10001}><sphereGeometry args={[0.085,16,12]} /><meshBasicMaterial color="#33ff77" wireframe depthTest={false} depthWrite={false} /></mesh>
  </>;
}
