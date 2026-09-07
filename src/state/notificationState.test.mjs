import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

export async function runNotificationChecks(vite) {
  const n = await vite.ssrLoadModule("/src/state/notificationState.ts");
  const d = await vite.ssrLoadModule("/src/system/notificationDelivery.ts");
  const { DeviceAudio } = await vite.ssrLoadModule("/src/audio/deviceAudio.ts");
  const { smsMessageReceived } = await vite.ssrLoadModule("/src/system/smsNotification.ts");
  const messages = await vite.ssrLoadModule("/src/state/messagesState.ts");
  const { buildSessionTimelineEvents } = await vite.ssrLoadModule("/src/data/sessionTimeline.ts");
  const { formatDeviceTime, simulatedDeviceDateTime } = await vite.ssrLoadModule("/src/state/deviceMachine.ts");
  const realAudio = globalThis.Audio;
  let plays = 0, muted = false;
  globalThis.Audio = class { addEventListener() {} pause() {} async play() { plays++; } };
  const unbind = DeviceAudio.bindHardwareMuteMode(() => muted ? "silent" : "ringer");
  const context = { phase: "springboard", foregroundApp: null, terminal: false, systemAlert: false, keyboard: false, multitasking: false };
  const event = { id: "notification-test", app: "facebook", kind: "direct", title: "Facebook", body: "Test fixture", timestamp: "12:03 AM", dueAt: 60000, destination: { type: "app", appId: "facebook" } };
  let state = n.createInitialNotificationState();
  const dispatch = action => { state = n.notificationTransition(state, action); };
  const deliver = (e = event, c = context) => d.deliverNotification(e, c, state, dispatch);
  try {
    assert.deepEqual(Object.keys(n.notificationPolicy), ["messages", "facebook", "twitter", "instagram", "foursquare"]);
    for (let run = 0; run < 2; run++) {
      dispatch({ type: "RESET" });
      assert.deepEqual(state, n.createInitialNotificationState(), "H/I: fresh session, including seeded historical SMS baseline");
      muted = false; DeviceAudio.hardwareMuteChanged();
      const baseline = plays;
      deliver();
      assert.equal(n.activeNotification(state, context)?.id, event.id);
      assert.equal(n.notificationBadges(state).facebook, 1);
      assert.equal(plays, baseline + 1, "A: background ringer delivery plays via DeviceAudio");
      deliver(); assert.equal(plays, baseline + 1, "duplicate cannot replay sound");
      muted = true; DeviceAudio.hardwareMuteChanged();
      deliver({ ...event, id: "second" });
      assert.equal(n.notificationBadges(state).facebook, 2);
      assert.equal(state.lastSuppressedSound, "facebook:second");
      assert.equal(plays, baseline + 1, "B: silent suppresses sound only");
      assert.deepEqual(state.queue.map(e => e.id), [event.id, "second"], "E: deterministic FIFO at equal dueAt");
      for (const field of ["systemAlert", "keyboard", "multitasking", "terminal"]) {
        assert.equal(n.activeNotification(state, { ...context, [field]: true }), null, `F: ${field} defers app surface`);
      }
      for (const phase of ["sleeping", "shutdown", "powerOffConfirm", "lowBatteryWarning", "booting", "poweredOff"]) {
        assert.equal(n.activeNotification(state, { ...context, phase }), null);
      }
      const lock = { ...context, phase: "locked" };
      assert.equal(n.notificationLockPreview(n.activeNotification(state, lock)).id, event.id, "D: one existing lock preview");
      dispatch({ type: "DISMISS", id: event.id });
      assert.equal(n.activeNotification(state, context).id, "second");
      assert.equal(n.notificationBadges(state).facebook, 2, "G: dismiss is not read");
      muted = false; DeviceAudio.hardwareMuteChanged();
      assert.equal(plays, baseline + 1, "promotion/unmute never replay skipped sound");
      dispatch({ type: "OPEN_APP", app: "facebook" });
      assert.equal(n.notificationBadges(state).facebook, 0);
      assert.equal(state.queue.length, 0);
      deliver({ ...event, id: "same-app" }, { ...context, phase: "app", foregroundApp: "facebook" });
      assert.equal(state.queue.length, 0, "C: foreground app suppresses external alert");
      assert.equal(n.notificationBadges(state).facebook, 0);
      assert.equal(plays, baseline + 1);
      deliver({ ...event, id: "system-blocked" }, { ...context, systemAlert: true });
      assert.equal(plays, baseline + 1, "system sound cannot be displaced by app sound");
      assert.equal(n.activeNotification(state, context).id, "system-blocked", "alert deferred, not lost");
      deliver({ ...event, id: "terminal-rejected" }, { ...context, terminal: true });
      assert.equal(state.delivered.includes("facebook:terminal-rejected"), false);
      dispatch({ type: "RESET" });
      assert.equal(state.lastSuppressedSound, null);
      assert.equal(state.delivered.length, 0);
      assert.equal(state.queue.length, 0);
    }
    for (const e of buildSessionTimelineEvents()) {
      const notification = d.scheduledNotificationEvent(e, formatDeviceTime(simulatedDeviceDateTime(e.dueElapsedMs)));
      if (!notification) continue;
      assert.equal(notification.dueAt, e.dueElapsedMs);
      const decision = n.notificationDecision(notification, context);
      if (e.sourceApp === "twitter" || e.sourceApp === "instagram") assert.deepEqual(decision, { visual: false, badge: false, sound: false });
      if (e.type === "foursquareActivity") assert.deepEqual(decision, { visual: true, badge: false, sound: false });
      if (["facebookJuneInstagramAnnouncement", "facebookJuneJackGossip", "facebookEphemeralGossip", "facebookSophieJuneComment"].includes(e.type)) assert.equal(decision.visual, false);
    }
    dispatch({ type: "RESET" });
    let messagesState = messages.createInitialMessagesState();
    const sms = { id: "notification-test-sms", sender: "Dad", message: "Test", timestamp: "12:03 AM" };
    const beforeSMS = plays;
    smsMessageReceived(sms, "lockscreen", {
      messagesDispatch: action => { messagesState = messages.messagesStateTransition(messagesState, action); },
      deliver: value => deliver(d.smsNotificationEvent(value, 60000), { ...context, phase: "locked" }),
    });
    assert.equal(messagesState.messages.filter(m => m.id === sms.id).length, 1, "SMS still delivers through its existing helper");
    assert.equal(plays, beforeSMS + 1);
    const preview = n.notificationLockPreview(n.activeNotification(state, { ...context, phase: "locked" }));
    assert.deepEqual(preview.target, { type: "messagesConversation", conversationId: "dad" });
    assert.equal(n.notificationSMSPresentation(state.queue[0], "springboard").status, "alert-visible");
    dispatch({ type: "OPEN_APP", app: "messages" });
    assert.ok(state.unread.messages.includes(sms.id), "Messages clears on reading conversation, not opening app");
    dispatch({ type: "MESSAGE_BADGE", event: { type: "MARK_READ", messageId: sms.id } });
    assert.equal(state.queue.length, 0); assert.equal(state.unread.messages.includes(sms.id), false);
    console.log("Notification v1 A–J policy/audio/SMS/queue/priority/reset checks: PASS (two runs)");
  } finally { unbind(); globalThis.Audio = realAudio; }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
  try { await runNotificationChecks(vite); } finally { await vite.close(); }
}
