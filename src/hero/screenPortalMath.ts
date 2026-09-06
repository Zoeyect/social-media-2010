import { Vector3, type Camera, type Mesh } from "three";

export type ScreenPoint = Readonly<{ x: number; y: number }>;
export type ProjectedScreenQuad = Readonly<{
  topLeft: ScreenPoint; topRight: ScreenPoint; bottomRight: ScreenPoint; bottomLeft: ScreenPoint;
  width: number; height: number; center: ScreenPoint; aspectRatio: number;
  clipPolygon: readonly ScreenPoint[];
}>;
export const quadCorners = (q: ProjectedScreenQuad) => [q.topLeft, q.topRight, q.bottomRight, q.bottomLeft] as const;

function hull(points: ScreenPoint[]): ScreenPoint[] {
  const sorted = [...new Map(points.map(p => [`${p.x},${p.y}`, p])).values()].sort((a,b) => a.x-b.x || a.y-b.y);
  const cross = (a: ScreenPoint,b: ScreenPoint,c: ScreenPoint) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const half = (list: ScreenPoint[]) => {
    const result: ScreenPoint[] = [];
    for (const p of list) { while(result.length > 1 && cross(result[result.length-2],result[result.length-1],p) <= 0) result.pop(); result.push(p); }
    return result.slice(0,-1);
  };
  return [...half(sorted), ...half(sorted.reverse())];
}

/** Mesh-local front face -> world -> camera -> CSS viewport pixels (not DPR pixels). */
export function projectScreenQuad(screen: Mesh, camera: Camera, viewport: { left: number; top: number; width: number; height: number }): ProjectedScreenQuad | null {
  screen.geometry.computeBoundingBox();
  const bounds = screen.geometry.boundingBox;
  if (!bounds || viewport.width <= 0 || viewport.height <= 0) return null;
  screen.updateWorldMatrix(true, false);
  camera.updateWorldMatrix(true, false);
  const size = bounds.getSize(new Vector3()).toArray();
  const normalAxis = size.indexOf(Math.min(...size));
  const verticalAxis = size.indexOf(Math.max(...size));
  const horizontalAxis = [0,1,2].find(axis => axis !== normalAxis && axis !== verticalAxis)!;
  const axis = (index: number) => new Vector3().setComponent(index, 1).transformDirection(screen.matrixWorld);
  // This bridge is limited to front-aligned / experience, never back-facing inspect.
  const cameraRight = new Vector3(1,0,0).applyQuaternion(camera.quaternion);
  const cameraUp = new Vector3(0,1,0).applyQuaternion(camera.quaternion);
  const cameraOut = new Vector3(0,0,1).applyQuaternion(camera.quaternion);
  const frontSign = axis(normalAxis).dot(cameraOut) >= 0 ? 1 : -1;
  const horizontalSign = axis(horizontalAxis).dot(cameraRight) >= 0 ? 1 : -1;
  const verticalSign = axis(verticalAxis).dot(cameraUp) >= 0 ? 1 : -1;
  const face = (frontSign > 0 ? bounds.max : bounds.min).getComponent(normalAxis);
  const position = screen.geometry.getAttribute("position");
  const points: ScreenPoint[] = [];
  for (let i=0; i<position.count; i++) {
    const p = new Vector3().fromBufferAttribute(position,i);
    if (Math.abs(p.getComponent(normalAxis)-face) < 1e-8) points.push({ x: horizontalSign*p.getComponent(horizontalAxis), y: verticalSign*p.getComponent(verticalAxis) });
  }
  if (points.length < 3) return null;
  const left = Math.min(...points.map(p=>p.x)), right = Math.max(...points.map(p=>p.x));
  const bottom = Math.min(...points.map(p=>p.y)), top = Math.max(...points.map(p=>p.y));
  const width = right-left, height = top-bottom;
  if (width <= 0 || height <= 0) return null;
  const project = (x: number,y: number) => {
    const p = new Vector3().setComponent(normalAxis,face).setComponent(horizontalAxis,x*horizontalSign).setComponent(verticalAxis,y*verticalSign);
    p.applyMatrix4(screen.matrixWorld).project(camera);
    if (p.z < -1 || p.z > 1 || !Number.isFinite(p.x+p.y)) return null;
    return {x:viewport.left+(p.x+1)*viewport.width/2, y:viewport.top+(1-p.y)*viewport.height/2};
  };
  const tl=project(left,top), tr=project(right,top), br=project(right,bottom), bl=project(left,bottom), center=project((left+right)/2,(top+bottom)/2);
  if (!tl || !tr || !br || !bl || !center) return null;
  const distance = (a:ScreenPoint,b:ScreenPoint) => Math.hypot(a.x-b.x,a.y-b.y);
  return {topLeft:tl,topRight:tr,bottomRight:br,bottomLeft:bl,center,
    width:(distance(tl,tr)+distance(bl,br))/2, height:(distance(tl,bl)+distance(tr,br))/2,
    aspectRatio:width/height, clipPolygon:hull(points).map(p=>({x:(p.x-left)/width,y:(top-p.y)/height}))};
}

/** Exact planar homography encoded column-major for CSS matrix3d. */
export function screenQuadMatrix(points: readonly ScreenPoint[], width: number, height: number): number[] | null {
  const [p0,p1,p2,p3] = points;
  const dx1=p1.x-p2.x, dx2=p3.x-p2.x, dx3=p0.x-p1.x+p2.x-p3.x;
  const dy1=p1.y-p2.y, dy2=p3.y-p2.y, dy3=p0.y-p1.y+p2.y-p3.y;
  const denominator=dx1*dy2-dx2*dy1;
  if (Math.abs(denominator)<1e-10 || width<=0 || height<=0) return null;
  const g=(dx3*dy2-dx2*dy3)/denominator, h=(dx1*dy3-dx3*dy1)/denominator;
  const a=p1.x-p0.x+g*p1.x, b=p3.x-p0.x+h*p3.x;
  const d=p1.y-p0.y+g*p1.y, e=p3.y-p0.y+h*p3.y;
  const result=[a/width,d/width,0,g/width,b/height,e/height,0,h/height,0,0,1,0,p0.x,p0.y,0,1];
  return result.every(Number.isFinite) ? result : null;
}
