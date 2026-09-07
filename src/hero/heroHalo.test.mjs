import assert from "node:assert/strict";
import fs from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { Object3D, PerspectiveCamera, Quaternion, Vector3 } from "three";

const source = fs.readFileSync(new URL("./HeroHalo.tsx", import.meta.url), "utf8");
const body = source.slice(source.indexOf("export function placeHeroHalo"), source.indexOf("export function HeroHalo()"));
const place = new Function("Vector3", "Quaternion", stripTypeScriptTypes(body).replace("export ", "") + ";return placeHeroHalo;")(Vector3, Quaternion);
const phone = new Object3D(), card = new Object3D(), camera = new PerspectiveCamera(38, 1.6, .1, 30);
camera.position.set(0, 0, 7);
let initial;
for (let loop = 0; loop < 2; loop++) {
  for (const [x, scale, angle] of [[2.15, 1, -.59], [1, 1.1, -.2], [0, 1.18, 1], [0, 1.534, .035], [0, 1.534, 0], [1, 1.1, -.2], [2.15, 1, -.59]]) {
    phone.position.set(x, 0, 0); phone.scale.setScalar(scale); phone.rotation.set(.1, angle, 0);
    place(card, phone, camera);
    assert.ok(Math.abs(card.position.distanceTo(phone.position) - 1.8 * scale) < 1e-12);
    const projectedPhone = phone.position.clone().project(camera);
    const projectedHalo = card.position.clone().project(camera);
    assert.ok(Math.abs(projectedPhone.x - projectedHalo.x) < 1e-12);
    assert.ok(Math.abs(projectedPhone.y - projectedHalo.y) < 1e-12);
    assert.ok(card.quaternion.angleTo(camera.quaternion) < 1e-7);
    assert.ok(Math.abs(card.scale.x - 5.2 * scale) < 1e-12);
    if (!initial) initial = card.matrixWorld.clone();
  }
  assert.deepEqual(card.matrixWorld.elements, initial.elements, "no drift after return/recharge and second loop");
}
camera.position.set(4, 2, 7); camera.lookAt(0, 0, 0);
place(card, phone, camera);
const direction = phone.position.clone().sub(camera.position).normalize();
assert.ok(card.position.clone().sub(phone.position).normalize().distanceTo(direction) < 1e-7, "behind active camera plane");
assert.match(source, /depthWrite=\{false\}/);
assert.match(source, /raycast=\{\(\) => \{\}\}/);
console.log("PASS: phone-follow position/scale, camera-facing offset, two-loop no drift, non-interactive backdrop.");
