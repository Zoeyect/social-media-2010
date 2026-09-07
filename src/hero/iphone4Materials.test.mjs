import assert from "node:assert/strict";
import fs from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { MeshPhysicalMaterial, MeshStandardMaterial, Mesh, Group, BoxGeometry, Scene, Texture } from "three";
const source = fs.readFileSync(new URL("./iphone4Materials.ts", import.meta.url), "utf8")
  .replace(/import\s*\{[\s\S]*?\}\s*from "three";/, "").replaceAll("export ", "").replaceAll("import.meta.env.DEV", "dev");
for (const dev of [false, true]) for (const candidate of ["baseline", "rgb60", "reflection094"]) {
  const timers = new Map(); let next = 0;
  const window = { location: { search: `?heroSteelCandidate=${candidate}` }, setInterval: fn => { timers.set(++next, fn); return next; }, clearInterval: id => timers.delete(id) };
  const calibrate = new Function("MeshPhysicalMaterial", "MeshStandardMaterial", "Mesh", "dev", "window", stripTypeScriptTypes(source) + ";return calibrateIPhone4Stainless;")(MeshPhysicalMaterial, MeshStandardMaterial, Mesh, dev, window);
  const root = new Group(), scene = new Scene(); scene.environment = new Texture(); scene.environmentIntensity = .8;
  scene.environment.userData.heroSteelBaseReflectance = .54; // No DEV metadata.
  const steel = new MeshPhysicalMaterial({name:"MAT_StainlessSteel",anisotropy:.24});
  const button = new MeshPhysicalMaterial({name:"MAT_ButtonMetal",color:.16});
  const mesh = new Mesh(new BoxGeometry(), [steel, button]); root.add(mesh);
  const cleanup = calibrate(root, {scene, invalidate() {}});
  const calibrated = mesh.material[0];
  assert.deepEqual(calibrated.color.toArray(), dev && candidate === "rgb60" ? [.6,.61,.62] : [.54,.55,.56]);
  assert.equal(calibrated.metalness, 1); assert.equal(calibrated.roughness, .38); assert.equal(calibrated.anisotropy, .24);
  assert.equal(mesh.material[1], button, "buttons/other slots untouched");
  assert.equal(scene.environmentIntensity, .8, "no global environment change");
  assert.equal(calibrated.envMap ? calibrated.envMapIntensity : scene.environmentIntensity, dev && candidate === "reflection094" ? .94 : .8);
  const replacement = new Texture(); replacement.userData.heroSteelBaseReflectance = .54; scene.environment = replacement;
  timers.forEach(fn=>fn());
  if (dev && candidate === "reflection094") assert.equal(calibrated.envMap, replacement);
  cleanup(); assert.equal(mesh.material[0], steel); assert.equal(timers.size,0);
  mesh.geometry.dispose(); steel.dispose(); button.dispose(); replacement.dispose();
}
console.log("PASS: steel-54 in DEV/production, isolated RGB/reflection candidates, unchanged roughness/anisotropy/buttons/scene, cleanup.");
