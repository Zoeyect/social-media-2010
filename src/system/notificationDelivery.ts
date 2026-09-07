import { DeviceAudio } from "../audio/deviceAudio";
import type { DeviceEvent } from "../state/deviceEventScheduler";
import { notificationDecision, type NotificationAction, type NotificationContext, type NotificationEvent, type NotificationState } from "../state/notificationState";
import type { IncomingSMS } from "./smsNotification";

export function deliverNotification(event: NotificationEvent, context: NotificationContext, state: NotificationState, dispatch: (action: NotificationAction) => void) {
  if (context.terminal || state.delivered.includes(`${event.app}:${event.id}`)) return;
  const decision = notificationDecision(event, context);
  const suppressedSound = decision.sound && !DeviceAudio.canPlayAudio;
  dispatch({ type: "DELIVER", event, decision, suppressedSound });
  // Delivery only: never play on render, queue promotion, wake, or unmute.
  if (decision.sound) DeviceAudio.notificationReceived("message");
}

export function smsNotificationEvent(sms: IncomingSMS, dueAt: number): NotificationEvent {
  return { id: sms.id, app: "messages", dueAt, kind: "sms", title: "Text Message", sender: sms.sender,
    body: sms.message, timestamp: sms.timestamp ?? null,
    destination: { type: "messagesConversation", conversationId: sms.conversationId ?? sms.sender.toLocaleLowerCase("en-US") } };
}

// Only existing scheduled payloads are consumed; no new events, text, or timestamps.
// Generic request/invitation copy is reconstructed system copy, not new app content.
export function scheduledNotificationEvent(event: DeviceEvent, timestamp: string): NotificationEvent | null {
  const app = event.sourceApp;
  if (app !== "facebook" && app !== "twitter" && app !== "instagram" && app !== "foursquare") return null;
  let kind: NotificationEvent["kind"] = "feed";
  let body = "";
  let sender: string | undefined;
  const payload = event.payload;
  if (event.type === "facebookJackRequest") { kind = "direct"; body = "Jack sent you a friend request."; }
  else if (payload?.kind === "june-message") { kind = "direct"; body = payload.message; sender = payload.sender; }
  else if (payload?.kind === "facebook-katie-jack-gossip-message") { kind = "direct"; body = payload.message; sender = "Katie"; }
  else if (payload?.kind === "facebook-party-invite") { kind = "direct"; body = "You received an event invitation."; }
  else if (payload?.kind === "foursquare-activity") {
    // Only the existing curated check-in, not arbitrary future activity text.
    // Ping enabled for this friend is RECONSTRUCTED; no preferences UI is invented.
    if (payload.activityId === "june-night-owl-checkin") kind = "checkin";
    body = payload.message;
  }
  return { id: event.id, app, dueAt: event.dueElapsedMs, kind, title: app === "facebook" ? "Facebook" : app === "foursquare" ? "foursquare" : app === "twitter" ? "Twitter" : "Instagram",
    sender, body, timestamp, destination: { type: "app", appId: app } };
}
