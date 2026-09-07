// Run with Node 24+: node src/hero/screenPortalMath.test.mjs
// Numerical/real-GLB tests only; these do NOT certify browser CSS alignment.
import fs from "node:fs";
import assert from "node:assert/strict";
import { stripTypeScriptTypes } from "node:module";
import { Box3, Matrix3, Vector3, PerspectiveCamera } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const source=fs.readFileSync(new URL("./screenPortalMath.ts",import.meta.url),"utf8")
  .replace(/^import .*;\n/gm,"").replaceAll("export ","");
const {projectScreenQuad,screenQuadMatrix,quadCorners,screenFacingVisibility,portalPointerEnabled}=new Function("Vector3", "Box3", "Matrix3",
  stripTypeScriptTypes(source)+";return {projectScreenQuad,screenQuadMatrix,quadCorners,screenFacingVisibility,portalPointerEnabled};")(Vector3,Box3,Matrix3);
const bytes=fs.readFileSync(new URL("../assets/hero/iphone4/iphone4.glb",import.meta.url));
const loader=new GLTFLoader();
loader.register(()=>({name:"HeadlessNoTexture",loadTexture:()=>Promise.resolve(null)}));
const {scene}=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),"");
const screen=scene.getObjectByName("Screen");
assert.ok(screen?.isMesh,"authoritative semantic Screen mesh");
const camera=new PerspectiveCamera(38,1,.1,30);
camera.position.set(0,0,7);camera.lookAt(0,0,0);
let maximumError=0,cases=0;
for(let loop=0;loop<2;loop++)for(const [width,height]of [[1440,900],[1920,1080],[768,1024],[390,844]])for(const depth of [false,true]){
  camera.aspect=width/height;camera.updateProjectionMatrix();
  scene.scale.setScalar(2.82/.115665*(width<760?1.02:1.18));
  scene.rotation.set(depth?.75*Math.PI/180:0,depth?2*Math.PI/180:0,0);scene.updateMatrixWorld(true);
  const q=projectScreenQuad(screen,camera,{left:17,top:31,width,height});
  assert.ok(q);assert.ok(Math.abs(q.aspectRatio-2/3)<.001);
  assert.ok(q.topLeft.x<q.topRight.x && q.topLeft.y<q.bottomLeft.y,"correct corner orientation");
  assert.ok(q.clipPolygon.length>=4 && q.clipPolygon.every(p=>p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1));
  const w=320,h=w/q.aspectRatio,m=screenQuadMatrix(quadCorners(q),w,h);assert.ok(m);
  [[0,0],[w,0],[w,h],[0,h]].forEach(([x,y],i)=>{
    const divisor=m[3]*x+m[7]*y+m[15];
    const projected={x:(m[0]*x+m[4]*y+m[12])/divisor,y:(m[1]*x+m[5]*y+m[13])/divisor};
    const target=quadCorners(q)[i],error=Math.hypot(projected.x-target.x,projected.y-target.y);
    maximumError=Math.max(maximumError,error);assert.ok(error<1e-8);
  });cases++;
}
assert.equal(screenQuadMatrix(Array(4).fill({x:0,y:0}),320,480),null);
assert.equal(projectScreenQuad(screen,camera,{left:0,top:0,width:0,height:900}),null);
for (let loop=0; loop<2; loop++) for (const yaw of [0, 70, 82, 88, 90, 100, 180, 270, 360]) {
  scene.rotation.set(0,yaw*Math.PI/180,0);scene.updateMatrixWorld(true);
  const q=projectScreenQuad(screen,camera,{left:0,top:0,width:1440,height:900});assert.ok(q);
  if(yaw===0 || yaw===360) { assert.equal(q.screenFacingVisibility,1); assert.equal(portalPointerEnabled("software",false,q.screenFacingVisibility),true); }
  if(yaw===82) assert.ok(q.screenFacingVisibility>0 && q.screenFacingVisibility<1,"edge approach fades");
  if(yaw>=88 && yaw<=270) { assert.equal(q.screenFacingVisibility,0); assert.equal(portalPointerEnabled("software",false,q.screenFacingVisibility),false); }
  if(yaw===180) { assert.equal(q.screenRearFacing,true); assert.ok(q.screenFacingDot<-.99); }
  assert.equal(portalPointerEnabled("hidden",true,q.screenFacingVisibility),false,"boot never captures software pointers");
}
assert.equal(screenFacingVisibility(NaN),0);
const portalSource=fs.readFileSync(new URL("./ScreenPortal.tsx",import.meta.url),"utf8");
assert.match(portalSource,/element\.inert = !pointerEnabled/);
assert.match(portalSource,/element\.style\.pointerEvents = pointerEnabled \? "auto" : "none"/);
assert.match(portalSource,/opacity: "var\(--screen-facing-visibility, 0\)"/,"boot shares the facing opacity");
console.log(`PASS: ${cases} real-GLB pose/viewport/loop cases; maximum numerical corner error ${maximumError} CSS px. Safari QA remains pending.`);
