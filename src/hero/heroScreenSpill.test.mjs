import assert from "node:assert/strict";
import fs from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { MathUtils } from "three";
const controller = fs.readFileSync(new URL("./HeroController.ts", import.meta.url), "utf8").replace(/^import .*;\n/gm, "").replaceAll("export ", "");
const opacity = new Function(stripTypeScriptTypes(controller) + ";return heroBootOpacity;")();
const source = fs.readFileSync(new URL("./HeroScreenSpill.tsx", import.meta.url), "utf8");
const body = source.slice(source.indexOf("export function screenSpillDisplay"), source.indexOf("export function HeroScreenSpill"));
const display = new Function("heroBootOpacity", stripTypeScriptTypes(body).replace("export ", "") + ";return screenSpillDisplay;")(opacity);
const input = { phase: "experience", softwareVisible: true, awake: true, bootStartedAt: 0, bootComplete: true };
for (let loop = 0; loop < 2; loop++) {
  assert.equal(display(input, 21000).multiplier, 1);
  assert.equal(display({ ...input, awake: false }, 21000).multiplier, 0, "sleep");
  assert.equal(display(input, 22000).multiplier, 1, "wake");
  assert.equal(display({ ...input, softwareVisible: false }, 22000).multiplier, 0);
  for (const phase of ["identity", "detaching", "inspect", "power-loss", "returning", "recharging", "resetting"]) {
    assert.equal(display({ ...input, phase }, 22000).multiplier, 0, phase);
  }
  for (const phase of ["powering-on", "front-aligned"]) {
    const boot = { ...input, phase, bootComplete: false };
    assert.equal(display(boot, 0).multiplier, 0);
    assert.equal(display(boot, 300).multiplier, .5);
    assert.equal(display(boot, 19600).multiplier, .25);
    assert.equal(display(boot, 20000).multiplier, 0);
  }
}
let intensity = .03;
for (let frame = 0; frame < 9; frame++) intensity = MathUtils.damp(intensity, 0, 40, 1 / 60);
assert.ok(intensity < .0001, "sleep fade reaches snap-to-zero threshold within 150 ms");
assert.match(source, /screen\.add\(light\)/);
assert.match(source, /light\.removeFromParent\(\)/);
console.log("PASS: two-loop awake/sleep/wake/off gating, boot opacity and 50% multiplier, quick fade, semantic Screen attachment/cleanup.");
