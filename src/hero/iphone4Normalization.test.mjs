import fs from 'node:fs';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
import { Box3, Group, Matrix3, Matrix4, Quaternion, Vector3, PerspectiveCamera, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const contractSource = fs.readFileSync(new URL('./iphone4ModelContract.ts',import.meta.url),'utf8')
  .replace(/const productionModelModules = import\.meta\.glob\([\s\S]*?\n\}\);/,'const productionModelModules = {};');
const contract = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(contractSource)).toString('base64')}`);
const source = fs.readFileSync(new URL('./iphone4Normalization.ts',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replaceAll('export ','');
const compile = text => new Function('Box3','Group','Matrix4','Quaternion','Vector3','resolveIPhone4MeshRoles',
  stripTypeScriptTypes(text)+';return {normalizeIPhone4Model,chassisNormalizationBounds,CHASSIS_NORMALIZATION_ROLES};')
  (Box3,Group,Matrix4,Quaternion,Vector3,contract.resolveIPhone4MeshRoles);
const {normalizeIPhone4Model:normalize,chassisNormalizationBounds:chassis,CHASSIS_NORMALIZATION_ROLES:chassisRoles} = compile(source);
const oldNormalize = compile(source.replaceAll('chassisNormalizationBounds(roles)', 'new Box3().setFromObject(root)')).normalizeIPhone4Model;
const portalSource=fs.readFileSync(new URL('./screenPortalMath.ts',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replaceAll('export ','');
const {projectScreenQuad}=new Function('Vector3','Box3','Matrix3',stripTypeScriptTypes(portalSource)+';return {projectScreenQuad};')(Vector3,Box3,Matrix3);
async function load(path) {
  const bytes=fs.readFileSync(path), loader=new GLTFLoader();
  loader.register(()=>({name:'NoTexture',loadTexture:()=>Promise.resolve(null)}));
  return (await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'')).scene;
}
const scene=await load(new URL('../assets/hero/iphone4/iphone4.glb',import.meta.url));
scene.updateMatrixWorld(true);
const near=(a,b,tolerance=1e-11)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
const vectorNear=(a,b,tolerance)=>a.forEach((v,i)=>near(v,b[i],tolerance));
const physical=chassis(contract.resolveIPhone4MeshRoles(scene));
vectorNear(physical.getSize(new Vector3()).toArray(),[.0586,.1152,.0093],1e-8);
vectorNear(physical.getCenter(new Vector3()).toArray(),[0,0,0],1e-8);
const camera=new PerspectiveCamera(38,1440/900,.1,30);camera.position.set(0,0,7);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);
function snapshot(model) {
  const screen=model.roles.screen,dock=model.root.getObjectByName('Dock30Pin');
  screen.geometry.computeBoundingBox(); const b=screen.geometry.boundingBox;
  const corners=[[b.min.x,b.max.y,b.max.z],[b.max.x,b.max.y,b.max.z],[b.max.x,b.min.y,b.max.z],[b.min.x,b.min.y,b.max.z]]
    .flatMap(p=>new Vector3(...p).applyMatrix4(screen.matrixWorld).toArray());
  const q=projectScreenQuad(screen,camera,{left:0,top:0,width:1440,height:900});assert.ok(q);
  return {scale:model.scale,transform:model.root.matrix.toArray(),size:chassis(model.roles).getSize(new Vector3()).toArray(),
    screen:new Box3().setFromObject(screen).getCenter(new Vector3()).toArray(),corners,
    projected:[q.topLeft,q.topRight,q.bottomRight,q.bottomLeft].flatMap(p=>[p.x,p.y]),
    dock:dock.getWorldPosition(new Vector3()).toArray(),dockRotation:dock.getWorldQuaternion(new Quaternion()).toArray()};
}
const baseline=snapshot(normalize(scene));
function invariant(next,label) {
  near(next.scale,baseline.scale);
  for(const key of ['transform','size','screen','corners','projected','dock','dockRotation']) {
    try {vectorNear(next[key],baseline[key]);} catch(error){throw new Error(`${label}: ${key}`,{cause:error});}
  }
}
const cases=[['PowerButton',[0,.0002,0]],['PowerButton',[0,.5,0]],
  ['VolumeUp',[-.1,0,0]],['VolumeDown',[-.1,0,0]],['MuteSwitch',[0,0,.1]],['RearCamera',[0,0,-.1]]];
for(const [name,delta] of cases) {
  const changed=scene.clone(true);changed.getObjectByName(name).position.add(new Vector3(...delta));
  invariant(snapshot(normalize(changed)),name);
}
const attachments=scene.clone(true),resolved=contract.resolveIPhone4MeshRoles(attachments);
for(const role of chassisRoles){const hit=new Mesh(new BoxGeometry(10,10,10),new MeshBasicMaterial());hit.name='SyntheticHitVolume';resolved[role].add(hit);}
invariant(snapshot(normalize(attachments)),'attached hit volumes');
const decals=scene.clone(true);decals.traverse(o=>{if(o.isMesh&&['MAT_RearLogo','MAT_RearEtching'].includes(o.material.name))o.position.z-=.5;});
invariant(snapshot(normalize(decals)),'decals');
for(const role of chassisRoles) {
  const broken=scene.clone(true),r=contract.resolveIPhone4MeshRoles(broken)[role];
  const assembly=r.parent;assembly.removeFromParent();
  assert.throws(()=>normalize(broken),/Invalid iPhone4 chassis normalization: missing/);
}
const old=snapshot(oldNormalize(scene));
console.log('NORMALIZATION_PARITY',JSON.stringify({chassisMm:physical.getSize(new Vector3()).multiplyScalar(1000).toArray(),
  chassisCenterMm:physical.getCenter(new Vector3()).multiplyScalar(1000).toArray(),oldScale:old.scale,newScale:baseline.scale,
  oldRootPosition:old.transform.slice(12,15),newRootPosition:baseline.transform.slice(12,15),
  screenDelta:baseline.screen.map((v,i)=>v-old.screen[i]),dockDelta:baseline.dock.map((v,i)=>v-old.dock[i])}));
if(process.env.IPHONE4_NORMALIZATION_BASELINE) {
  const previous=snapshot(normalize(await load(process.env.IPHONE4_NORMALIZATION_BASELINE)));
  invariant(previous,'pre-v3.1 corrected chassis');
}
console.log('PASS: chassis dimensions, missing-role rejection, 6 control changes, decals/hit volumes; strict scale/center/Screen corners/projection/Dock invariance.');
