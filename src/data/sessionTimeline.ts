import type { DeviceEvent, DeviceEventPayload, DeviceEventSource, DeviceEventType } from "../state/deviceEventScheduler";

export type SessionTimelineEventDefinition = {
  id: string;
  atElapsedSeconds: number;
  sourceApp: DeviceEventSource;
  type: Exclude<DeviceEventType, "momReply">;
  payload: DeviceEventPayload;
  deliveryPolicy: "notification" | "internal";
  provenanceStatus: "CURATED";
  languageReference?: "PERIOD-EVIDENCE";
  role?: "terminal-easter-egg";
};

export const TWITTER_LIVE_ACTIVITY_POOL: readonly SessionTimelineEventDefinition[] = [
  { id: "twitter-slang-epic-fail", atElapsedSeconds: 75, sourceApp: "twitter", type: "twitterBackgroundTweet", payload: { kind: "twitter-post", post: { id: "slang-epic-fail", displayName: "Ben", text: "tried to make ramen without turning the stove on. epic fail", timestamp: "12:03 AM" } }, deliveryPolicy: "internal", provenanceStatus: "CURATED", languageReference: "PERIOD-EVIDENCE" },
  { id: "twitter-eva-school-tomorrow", atElapsedSeconds: 300, sourceApp: "twitter", type: "twitterBackgroundTweet", payload: { kind: "twitter-post", post: { id: "eva-school-tomorrow", displayName: "Eva", text: "ugh I really don't want to go to school tomorrow", timestamp: "12:07 AM" } }, deliveryPolicy: "internal", provenanceStatus: "CURATED" },
  { id: "twitter-late-night-update", atElapsedSeconds: 390, sourceApp: "twitter", type: "twitterBackgroundTweet", payload: { kind: "twitter-post", post: { id: "late-night-line", displayName: "Mia", text: "Still awake. The diner line is moving slowly.", timestamp: "12:08 AM" } }, deliveryPolicy: "internal", provenanceStatus: "CURATED" },
  { id: "twitter-slang-fml", atElapsedSeconds: 540, sourceApp: "twitter", type: "twitterBackgroundTweet", payload: { kind: "twitter-post", post: { id: "slang-fml", displayName: "Dana", text: "just realized the file i worked on all night is the wrong version. FML", timestamp: "12:11 AM" } }, deliveryPolicy: "internal", provenanceStatus: "CURATED", languageReference: "PERIOD-EVIDENCE" },
  { id: "twitter-nora-homework", atElapsedSeconds: 690, sourceApp: "twitter", type: "twitterBackgroundTweet", payload: { kind: "twitter-post", post: { id: "nora-homework", displayName: "Nora", text: "finally starting the homework I ignored all night", timestamp: "12:13 AM" } }, deliveryPolicy: "internal", provenanceStatus: "CURATED" },
  { id: "twitter-terminal-goodnight-world", atElapsedSeconds: 890, sourceApp: "twitter", type: "twitterBackgroundTweet", payload: { kind: "twitter-post", post: { id: "terminal-goodnight-world", displayName: "Eli", text: "goodnight, world.", timestamp: "12:17 AM" } }, deliveryPolicy: "internal", provenanceStatus: "CURATED", role: "terminal-easter-egg" },
];

export const SESSION_TIMELINE_EVENTS: readonly SessionTimelineEventDefinition[] = [
  { id: "initial-sms-mom-home-yet", atElapsedSeconds: 60, sourceApp: "messages", type: "initialSMS", payload: { kind: "initial-sms", id: "mom-home-yet", sender: "Mom", message: "Home yet?", timestamp: "12:03 AM" }, deliveryPolicy: "notification", provenanceStatus: "CURATED" },
  TWITTER_LIVE_ACTIVITY_POOL[0],
  { id: "facebook-jack-request", atElapsedSeconds: 150, sourceApp: "facebook", type: "facebookJackRequest", payload: { kind: "jack-request" }, deliveryPolicy: "internal", provenanceStatus: "CURATED" },
  { id: "facebook-june-message", atElapsedSeconds: 270, sourceApp: "facebook", type: "facebookJuneMessage", payload: { kind: "june-message", sender: "June", message: "Hey, are you online?" }, deliveryPolicy: "internal", provenanceStatus: "CURATED" },
  TWITTER_LIVE_ACTIVITY_POOL[1],
  TWITTER_LIVE_ACTIVITY_POOL[2],
  { id: "foursquare-friend-checkin", atElapsedSeconds: 510, sourceApp: "foursquare", type: "foursquareActivity", payload: { kind: "foursquare-activity", activityId: "june-night-owl-checkin", message: "June checked in at Night Owl Cafe." }, deliveryPolicy: "internal", provenanceStatus: "CURATED" },
  TWITTER_LIVE_ACTIVITY_POOL[3],
  { id: "tumblr-background-post", atElapsedSeconds: 630, sourceApp: "tumblr", type: "tumblrBackgroundPost", payload: { kind: "tumblr-post", post: { id: "late-note", type: "text", blog: "latewatch", title: "After midnight", content: "The city gets quieter after midnight.", timestamp: "2010-10-20 12:12 AM" } }, deliveryPolicy: "internal", provenanceStatus: "CURATED" },
  TWITTER_LIVE_ACTIVITY_POOL[4],
  TWITTER_LIVE_ACTIVITY_POOL[5],
];

export function buildSessionTimelineEvents(): DeviceEvent[] {
  return SESSION_TIMELINE_EVENTS.map(event => ({
    id: event.id,
    type: event.type,
    dueElapsedMs: event.atElapsedSeconds * 1_000,
    sourceApp: event.sourceApp,
    deliveryPolicy: event.deliveryPolicy,
    payload: event.payload,
    provenanceStatus: event.provenanceStatus,
  }));
}
