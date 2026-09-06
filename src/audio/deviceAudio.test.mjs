// Headless audio-gate tests; Safari audibility/autoplay QA remains manual.
import assert from "node:assert/strict";
import fs from "node:fs";
import { stripTypeScriptTypes } from "node:module";

const events = ["lock", "unlock", "keyboardTap", "messageReceived", "messageSent", "lowBattery", "cameraShutter"];
const registry = Object.fromEntries(events.map(event => [event, { assetStatus: "READY", assetUrl: event }]));
const source = fs.readFileSync(new URL("./deviceAudio.ts", import.meta.url), "utf8").replace(/^import .*;\n/gm, "").replaceAll("export ", "");
const sounds = [];
class FakeAudio {
  constructor(url) { this.url = url; this.plays = 0; this.pauses = 0; this.listeners = {}; sounds.push(this); }
  play() { this.plays++; return Promise.resolve(); }
  pause() { this.pauses++; }
  addEventListener(name, listener) { this.listeners[name] = listener; }
}
const audio = new Function("DEVICE_AUDIO_REGISTRY", "Audio", stripTypeScriptTypes(source) + ";return DeviceAudio;")(registry, FakeAudio);
assert.equal(audio.canPlayAudio, true, "legacy/default is audible");
audio.unlock();
assert.equal(sounds.length, 1);
let hardwareMode = "ringer";
const release = audio.bindHardwareMuteMode(() => hardwareMode);
assert.equal(audio.canPlayAudio, true);
hardwareMode = "silent";
audio.hardwareMuteChanged();
assert.equal(sounds[0].muted, true);
assert.equal(sounds[0].pauses, 1);
for (const event of events) audio.dispatch(event);
assert.equal(sounds.length, 1, "silent requests never instantiate/queue playback");
assert.equal(audio.diagnostics.lastSuppressedSound, "cameraShutter");
hardwareMode = "ringer";
audio.hardwareMuteChanged();
assert.equal(sounds.length, 1, "unmuting does not replay anything");
assert.equal(sounds[0].plays, 1, "stopped one-shot never resumes");
audio.notificationReceived("message");
assert.equal(sounds.length, 2);
assert.equal(sounds[1].muted, false);
sounds[1].listeners.ended();
hardwareMode = "silent";
audio.hardwareMuteChanged();
hardwareMode = "ringer";
audio.hardwareMuteChanged();
assert.equal(sounds[1].plays, 1, "completed one-shot never restarts");
release();
assert.equal(audio.canPlayAudio, true);
console.log("PASS: default ringer, immediate active silence, all seven gated sounds, no replay, future playback, legacy fallback.");
