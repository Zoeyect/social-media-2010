export type DeviceEventSource = "messages" | "facebook" | "twitter" | "foursquare" | "tumblr";

export type DeviceEventType =
  | "initialSMS"
  | "momReply"
  | "momLoveReply"
  | "dadLoveReply"
  | "facebookJackRequest"
  | "facebookJuneMessage"
  | "facebookPartyInvite"
  | "twitterBackgroundTweet"
  | "foursquareActivity"
  | "tumblrBackgroundPost";

export type DeviceEventPayload =
  | { kind: "initial-sms"; id: string; sender: string; message: string; timestamp: string }
  | { kind: "jack-request" }
  | { kind: "june-message"; sender: string; message: string }
  | { kind: "facebook-party-invite" }
  | { kind: "twitter-post"; post: { id: string; displayName: string; text: string; timestamp: string } }
  | { kind: "foursquare-activity"; activityId: string; message: string }
  | { kind: "tumblr-post"; post: { id: string; type: "text" | "photo" | "quote"; blog: string; title: string; content: string; timestamp: string } };

export type DeviceEvent = {
  id: string;
  type: DeviceEventType;
  dueElapsedMs: number;
  sourceApp?: DeviceEventSource;
  deliveryPolicy?: "notification" | "internal";
  payload?: DeviceEventPayload;
  provenanceStatus?: "CURATED" | "HISTORICAL_READY" | "HOLD";
};

export function scheduleDeviceEvent(events: readonly DeviceEvent[], event: DeviceEvent): DeviceEvent[] {
  return events.some(scheduled => scheduled.id === event.id)
    ? [...events]
    : [...events, event].sort((a, b) => a.dueElapsedMs - b.dueElapsedMs);
}

export function scheduleDeviceEvents(events: readonly DeviceEvent[], additions: readonly DeviceEvent[]): DeviceEvent[] {
  return additions.reduce<DeviceEvent[]>((scheduled, event) => scheduleDeviceEvent(scheduled, event), [...events]);
}

export function nextDueDeviceEvent(events: readonly DeviceEvent[], elapsed: number): DeviceEvent | null {
  return events.find(event => event.dueElapsedMs <= elapsed) ?? null;
}

export function removeDeviceEvent(events: readonly DeviceEvent[], eventId: string): DeviceEvent[] {
  return events.filter(event => event.id !== eventId);
}
