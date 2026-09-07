// Actual persistent hardware hook + lifecycle reducer + audio gate, headless.
// Safari visual/audio acceptance remains manual.
import assert from "node:assert/strict";
import fs from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import * as THREE from "three";

const read = path => fs.readFileSync(new URL(path, import.meta.url), "utf8").replace(/^import .*;\n/gm, "").replaceAll("import.meta.env.DEV", "false").replaceAll("export ", "");
const { heroTransition, initialHeroState } = new Function(stripTypeScriptTypes(read("./HeroController.ts")) + ";return {heroTransition, initialHeroState};")();
let plays = 0;
class AudioStub {
  play() { plays++; return Promise.resolve(); }
  pause() {}
  addEventListener() {}
}
const audio = new Function("DEVICE_AUDIO_REGISTRY", "Audio", stripTypeScriptTypes(read("../audio/deviceAudio.ts")) + ";return DeviceAudio;")({ lock: { assetStatus: "READY", assetUrl: "lock" } }, AudioStub);
const slots = [];
let cursor = 0, pending = [], frame;
const effect = (fn, deps) => {
  const index = cursor++, old = slots[index];
  if (!old || deps.some((value, i) => value !== old.deps[i])) {
    pending.push(() => { old?.cleanup?.(); slots[index] = { deps, cleanup: fn() }; });
  }
};
const invalidate = () => {};
const win = { addEventListener() {}, removeEventListener() {}, clearTimeout() {} };
const doc = { body: { style: {} }, addEventListener() {}, removeEventListener() {} };
const hook = new Function("useCallback", "useEffect", "useLayoutEffect", "useRef", "useFrame", "useThree", "DeviceAudio", "window", "document", ...Object.keys(THREE),
  stripTypeScriptTypes(read("./useHeroHardware.ts")) + ";return useHeroHardware;")(
  (fn, deps) => {
    const i = cursor++, old = slots[i];
    if (!old || deps.some((value, index) => value !== old.deps[index])) slots[i] = { deps, value: fn };
    return slots[i].value;
  }, effect, effect, value => { const i = cursor++; return slots[i] ??= { current: value }; },
  fn => { frame = fn; }, () => ({ invalidate }), audio, win, doc, ...Object.values(THREE));
const root = new THREE.Group();
for (const name of ["MuteSwitch", "VolumeUp"]) {
  const node = new THREE.Mesh(new THREE.BoxGeometry(.002, .004, .003), new THREE.MeshBasicMaterial());
  node.name = name; root.add(node);
}
let state = initialHeroState, handlers;
function render(enabled = false, runtimePower) {
  cursor = 0; pending = [];
  handlers = hook(root, enabled, () => {}, state.phase === "experience" ? () => {} : undefined, runtimePower, state.resetGeneration);
  pending.forEach(fn => fn()); frame({}, 1);
}
function click(name) {
  const event = { object: root.getObjectByName(`Hero${name}HitTarget`), pointerId: 1, button: 0, target: {}, stopPropagation() {} };
  handlers.onPointerDown(event); handlers.onPointerUp(event); frame({}, 1);
}
function assertRinger() {
  assert.equal(audio.diagnostics.muteMode, "ringer");
  assert.equal(audio.canPlayAudio, true);
  assert.equal(root.getObjectByName("HeroMuteOrangeIndicator").visible, false);
  assert.equal(root.getObjectByName("HeroMuteSlider").position.z, .00075);
}
render(); assertRinger();
for (let loop = 0; loop < 2; loop++) {
  state = heroTransition(state, { type: "CONFIRM_IDENTITY", name: `User ${loop}` }); render(); assertRinger();
  state = heroTransition(state, { type: "DETACH_COMPLETE" }); render(true);
  click("MuteSwitch");
  assert.equal(audio.diagnostics.muteMode, "silent");
  assert.equal(root.getObjectByName("HeroMuteOrangeIndicator").visible, true);
  audio.lock(); assert.equal(plays, loop, "muted sound discarded");
  state = heroTransition(state, { type: "PRESS_POWER", startedAt: 0 }); render();
  state = heroTransition(state, { type: "ALIGN_COMPLETE" }); render();
  state = heroTransition(state, { type: "BOOT_COMPLETE", now: 20000 });
  for (const powerState of ["awake", "asleep", "awake"]) {
    render(false, { state: powerState }); render(false, { state: powerState });
    assert.equal(audio.diagnostics.muteMode, "silent", "same-session rerenders/sleep/wake preserve mute");
  }
  state = heroTransition(state, { type: "EXPERIENCE_ENDED" }); render();
  for (const from of ["power-loss", "returning", "recharging"]) {
    assert.equal(audio.diagnostics.muteMode, "silent", from);
    state = heroTransition(state, { type: "ADVANCE_RETURN", from }); render();
  }
  assert.equal(state.phase, "resetting");
  assert.equal(audio.diagnostics.muteMode, "silent", "not reset before completion");
  state = heroTransition(state, { type: "RESET_COMPLETE" }); render();
  assert.equal(state.phase, "identity"); assertRinger();
  assert.equal(plays, loop, "reset never replays suppressed sound");
  audio.lock(); assert.equal(plays, loop + 1, "new sound is audible");
}
slots.forEach(slot => slot.cleanup?.());
console.log("PASS: two persistent hardware/session loops; mute preserved until RESET_COMPLETE; ringer/slider/indicator/audio restored; no replay.");
