import assert from "node:assert/strict";
import fs from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { Group, PerspectiveCamera } from "three";
const source = fs.readFileSync(new URL("./heroPresentationReady.ts", import.meta.url), "utf8").replace(/^import .*;\n/gm, "").replaceAll("export ", "");
const ready = new Function(stripTypeScriptTypes(source) + ";return heroPresentationReady;")();
const phone = new Group(), camera = new PerspectiveCamera(38, 1440/900, .1, 30);
phone.position.set(2.15, 0, 0); phone.scale.setScalar(.9); phone.rotation.set(.17, -.59, 0); phone.updateMatrixWorld(true);
for (let loop = 0; loop < 2; loop++) {
  assert.equal(ready(false, phone, camera, {width:1440,height:900}), false, "no loaded semantics, no phone");
  assert.equal(ready(true, phone, camera, {width:0,height:0}), false);
  assert.equal(ready(true, phone, camera, {width:900,height:900}), false, "camera/aspect not yet settled");
  assert.equal(ready(true, phone, camera, {width:1440,height:900}), true);
  phone.matrixWorld.elements[0] = NaN;
  assert.equal(ready(true, phone, camera, {width:1440,height:900}), false);
  phone.updateMatrixWorld(true);
}
const model = fs.readFileSync(new URL("./ProductionIPhone4Model.tsx", import.meta.url), "utf8");
const presenter = fs.readFileSync(new URL("./HeroPhone.tsx", import.meta.url), "utf8");
assert.doesNotMatch(model, /TemporaryIPhone4Placeholder/);
assert.match(presenter, /name="HeroPhoneGeometry" visible=\{false\}/);
assert.match(presenter, /phone.updateWorldMatrix\(true, true\);\s+mountedModel.visible = heroPresentationReady/);
console.log("PASS: no production placeholder; initial model hidden until semantics, viewport and transformed matrices are valid.");
