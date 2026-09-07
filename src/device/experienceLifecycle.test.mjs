// Actual App controller/reducers/effects with deterministic host hooks and time.
// DOM projection, visual continuity and Safari gestures still require browser QA.
import assert from "node:assert/strict";
import { createServer } from "vite";

let clock = 100000, slots = [], cursor = 0, dirty = true, pending = [], view;
const timers = new Map(), listeners = new Map();
let nextTimer = 0, eraseCount = 0, initializeCount = 0, sceneSelections = 0;
const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
const hooks = {
  useState(initial) {
    const i = cursor++;
    slots[i] ??= { value: typeof initial === "function" ? initial() : initial };
    return [slots[i].value, value => { const next = typeof value === "function" ? value(slots[i].value) : value; if (!Object.is(next, slots[i].value)) { slots[i].value = next; dirty = true; } }];
  },
  useReducer(reducer, initial, initialize) {
    const [value, set] = hooks.useState(() => initialize ? initialize(initial) : initial);
    const i = cursor - 1;
    slots[i].dispatch ??= action => set(state => reducer(state, action));
    return [value, slots[i].dispatch];
  },
  useRef(value) { const i = cursor++; slots[i] ??= { current: value }; return slots[i]; },
  useCallback(fn, deps) { const i = cursor++; if (!same(slots[i]?.deps, deps)) slots[i] = { value: fn, deps }; return slots[i].value; },
  useEffect(fn, deps) { const i = cursor++; if (!same(slots[i]?.deps, deps)) { pending.push(() => { slots[i]?.cleanup?.(); slots[i] = { deps, cleanup: fn() }; }); } },
};
globalThis.__lifecycleHooks = hooks;
globalThis.__sceneSelected = () => sceneSelections++;
const persistence = {
  eraseCurrentCameraRoll: async () => { eraseCount++; }, initializeCameraRollPersistence: async () => { initializeCount++; return []; },
  deleteStalePlayerCameraRolls: async () => {}, eraseAllPlayerCameraRolls: async () => { throw Error("must not erase world stores"); },
  discardPersistedCameraPhoto: async () => {}, persistCameraCapturedArtifact: async () => { throw Error("not capturing in lifecycle test"); },
  isCameraCaptureOwnerCurrent: (a, b) => a === b,
};
globalThis.__lifecyclePersistence = persistence;
const realDateNow = Date.now; Date.now = () => clock;
const realPerformanceNow = performance.now; performance.now = () => clock;
const storage = new Map();
globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
globalThis.window = {
  location: { search: "" },
  setTimeout(fn, delay) { const id = ++nextTimer; timers.set(id, { fn, at: clock + delay }); return id; },
  clearTimeout(id) { timers.delete(id); },
  setInterval(fn, delay) { const id = ++nextTimer; timers.set(id, { fn, at: clock + delay, delay }); return id; },
  clearInterval(id) { timers.delete(id); },
  requestAnimationFrame(fn) { return this.setTimeout(fn, 16); }, cancelAnimationFrame(id) { timers.delete(id); },
  addEventListener(name, fn) { listeners.set(name, fn); }, removeEventListener(name) { listeners.delete(name); },
};
globalThis.location = window.location;
globalThis.clearTimeout = window.clearTimeout;
globalThis.clearInterval = window.clearInterval;
globalThis.cancelAnimationFrame = window.cancelAnimationFrame;
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
globalThis.document = { hidden: false, body: { style: {} } };
const server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent", plugins: [{
  name: "lifecycle-controller-host", enforce: "pre",
  resolveId(id) {
    if (id === "virtual:lifecycle-hooks" || id.endsWith("/state/cameraRollPersistence")) return "\0" + (id === "virtual:lifecycle-hooks" ? "lifecycle-hooks" : "lifecycle-persistence");
  },
  load(id) {
    if (id === "\0lifecycle-hooks") return Object.keys(hooks).map(key => `export const ${key}=globalThis.__lifecycleHooks.${key};`).join("\n");
    if (id === "\0lifecycle-persistence") return Object.keys(persistence).map(key => `export const ${key}=globalThis.__lifecyclePersistence.${key};`).join("\n");
  },
  transform(code, id) {
    if (id.endsWith("/src/device/App.tsx")) return code.replace('from "react";', 'from "virtual:lifecycle-hooks";');
    if (id.endsWith("/src/world/cameraVideoScenes.ts")) return code.replace("  const random = options.random ?? Math.random;", "  globalThis.__sceneSelected();\n  const random = options.random ?? Math.random;");
  },
}] });
try {
  const { App } = await server.ssrLoadModule("/src/device/App.tsx");
  const device = await server.ssrLoadModule("/src/state/deviceMachine.ts");
  const { createMockPublicTwitterSubmissionRepository } = await server.ssrLoadModule("/src/data/mockPublicTwitterSubmissionRepository.ts");
  const world = createMockPublicTwitterSubmissionRepository();
  const draft = { publicHandle: "visitor", body: "hello", simulated2010CreatedAt: device.SESSION_START_ISO, simulatedElapsedMs: 0, idempotencyKey: "preserve" };
  const accepted = await world.submit(draft);
  const flush = async () => {
    for (let n = 0; n < 100; n++) {
      if (dirty) { dirty = false; cursor = 0; App({ presenter: "hero", renderHero: props => { view = props; return null; } }); const effects = pending; pending = []; effects.forEach(fn => fn()); }
      await Promise.resolve();
      if (!dirty && !pending.length && n > 5) return;
    }
    throw Error("controller did not settle");
  };
  const tick = async ms => {
    clock += ms;
    for (const [id, timer] of [...timers]) if (timer.at <= clock) { if (timer.delay) timer.at = clock + timer.delay; else timers.delete(id); timer.fn(); }
    await flush();
  };
  await flush();
  const baselineTimers = timers.size;
  const ids = [];
  for (let run = 0; run < 2; run++) {
    assert.equal(view.lifecycle.phase, "identity");
    view.startExperience({ name: `Visitor ${run}` });
    view.startExperience({ name: "duplicate" });
    await flush();
    const id = view.lifecycleDiagnostics.experienceSessionId; assert.ok(id); ids.push(id);
    assert.equal(view.lifecycle.phase, "detaching");
    assert.equal(view.lifecycleDiagnostics.sessionStartedAt, null);
    assert.equal(view.lifecycleDiagnostics.cameraSceneSessionId, id);
    assert.equal(sceneSelections, run + 1);
    view.onLifecycleAction({ type: "DETACH_COMPLETE" }); await flush();
    assert.equal(view.lifecycle.phase, "inspect");
    await tick(60000); assert.equal(view.lifecycleDiagnostics.elapsedMs, 0);
    const bootStartedAt = clock;
    view.onLifecycleAction({ type: "PRESS_POWER", startedAt: bootStartedAt }); await flush();
    assert.equal(view.lifecycle.phase, "powering-on");
    view.onLifecycleAction({ type: "ALIGN_COMPLETE" }); await flush();
    view.onHandoff(); await flush();
    assert.equal(view.lifecycleDiagnostics.sessionStartedAt, null, "early handoff cannot consume narrative time");
    await tick(20000);
    view.onHandoff(); view.onLifecycleAction({ type: "BOOT_COMPLETE", now: clock }); await flush();
    assert.equal(view.lifecycle.phase, "experience");
    const t0 = view.lifecycleDiagnostics.sessionStartedAt;
    assert.equal(t0, clock); assert.equal(view.lifecycleDiagnostics.elapsedMs, 0);
    assert.equal(view.screen.props.apps.messagesState.draft, "");
    assert.equal(view.screen.props.apps.messagesState.messages.some(message => message.id === "mom-home-yet"), false);
    view.screen.props.actions.completeScreenUnlock(); await flush();
    assert.equal(view.lifecycleDiagnostics.softwarePhase, "springboard");
    view.screen.props.navigation.launchSpringBoardApp("camera"); await flush();
    view.screen.props.navigation.dispatchAppRuntime({ type: "ANIMATION_COMPLETE" }); await flush();
    assert.equal(view.screen.props.camera.cameraRuntime.cameraApp.phase, "previewing");
    assert.equal(sceneSelections, run + 1, "Camera open does not reroll");
    view.screen.props.apps.dispatchMessages({ type: "EDIT_DRAFT", value: "session-only" }); await flush();
    view.powerControl.begin(); view.powerControl.end(); await flush();
    assert.equal(view.powerControl.state, "asleep");
    view.powerControl.begin(); view.powerControl.end(); await flush();
    assert.equal(view.powerControl.state, "awake");
    assert.equal(view.lifecycleDiagnostics.experienceSessionId, id);
    assert.equal(view.lifecycleDiagnostics.sessionStartedAt, t0);
    assert.equal(sceneSelections, run + 1, "sleep/wake does not reroll Camera");
    await tick(60000);
    assert.equal(view.screen.props.apps.messagesState.messages.filter(message => message.id === "mom-home-yet").length, 1, "scheduler can deliver again in each new run");
    await tick(840000);
    assert.equal(view.lifecycle.phase, "power-loss");
    assert.equal(view.lifecycle.terminalFired, true);
    view.simulateExperienceEnd(); view.simulateExperienceEnd(); await flush();
    assert.equal(view.lifecycle.phase, "power-loss");
    for (const phase of ["power-loss", "returning", "recharging"]) {
      assert.equal(view.lifecycle.phase, phase);
      assert.equal(view.lifecycleDiagnostics.experienceSessionId, id);
      view.onLifecycleAction({ type: "ADVANCE_RETURN", from: phase }); await flush();
    }
    assert.equal(view.lifecycle.phase, "identity");
    assert.equal(view.lifecycle.resetGeneration, run + 1);
    assert.equal(view.lifecycleDiagnostics.experienceSessionId, null);
    assert.equal(view.screen.props.apps.messagesState.draft, "");
    assert.equal(view.screen.props.navigation.appRuntime.phase, "none");
    assert.equal(timers.size, baselineTimers, "no accumulated session timers");
    assert.deepEqual(await world.submit(draft), accepted, "world submission remains idempotently accepted");
  }
  assert.notEqual(ids[0], ids[1]);
  assert.equal(sceneSelections, 2);
  assert.equal(eraseCount, 2); assert.equal(initializeCount, 2);
  slots.forEach(slot => slot?.cleanup?.());
  assert.equal(timers.size, 0); assert.equal(listeners.size, 0);
  console.log("PASS: actual App two-run lifecycle, unique IDs, T0 handoff, terminal once, sleep/wake continuity, per-session Camera Roll bootstrap, timer cleanup; resource/world persistence checks.");
} finally { Date.now = realDateNow; performance.now = realPerformanceNow; await server.close(); }
