import type { CSSProperties } from "react";
import type { FacebookHomeLauncherDestinationId } from "../state/facebookState";

type FacebookHomeIconSourceType = "reconstruction" | "historical-asset" | "hold";
type FacebookHomeIconConfidence = "CONFIRMED" | "PROBABLE" | "RECONSTRUCTED" | "HOLD";
type FacebookHomeIconMetadata = Readonly<{
  className: string;
  sourceType: FacebookHomeIconSourceType;
  confidence: FacebookHomeIconConfidence;
  intrinsicSize: null;
  displaySize: readonly [64, 58];
  opticalOffset: Readonly<{ x: -1 | 0 | 1; y: -1 | 0 | 1 }>;
}>;

const FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE = Object.freeze([64, 58] as const);

export const FACEBOOK_HOME_ICON_REGISTRY = Object.freeze({
  feed: Object.freeze({ className: "news-feed", sourceType: "reconstruction", confidence: "RECONSTRUCTED", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: 0, y: 1 }) }),
  profile: Object.freeze({ className: "profile", sourceType: "reconstruction", confidence: "RECONSTRUCTED", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: 0, y: -1 }) }),
  friends: Object.freeze({ className: "friends", sourceType: "reconstruction", confidence: "RECONSTRUCTED", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
  inbox: Object.freeze({ className: "inbox", sourceType: "reconstruction", confidence: "RECONSTRUCTED", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
  places: Object.freeze({ className: "places", sourceType: "reconstruction", confidence: "RECONSTRUCTED", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
  requests: Object.freeze({ className: "requests", sourceType: "reconstruction", confidence: "RECONSTRUCTED", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: -1, y: 0 }) }),
  events: Object.freeze({ className: "events", sourceType: "reconstruction", confidence: "RECONSTRUCTED", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: 0, y: -1 }) }),
  photos: Object.freeze({ className: "photos", sourceType: "reconstruction", confidence: "RECONSTRUCTED", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: -1, y: -1 }) }),
  chat: Object.freeze({ className: "chat", sourceType: "reconstruction", confidence: "RECONSTRUCTED", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
  notes: Object.freeze({ className: "notes", sourceType: "reconstruction", confidence: "PROBABLE", intrinsicSize: null, displaySize: FACEBOOK_HOME_RECONSTRUCTION_DISPLAY_SIZE, opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
} satisfies Record<FacebookHomeLauncherDestinationId, FacebookHomeIconMetadata>);

export function FacebookHomeIcon({ destinationId }: { destinationId: FacebookHomeLauncherDestinationId }) {
  const icon = FACEBOOK_HOME_ICON_REGISTRY[destinationId];
  const opticalStyle = {
    "--facebook-home-icon-offset-x": `${icon.opticalOffset.x}px`,
    "--facebook-home-icon-offset-y": `${icon.opticalOffset.y}px`,
  } as CSSProperties;
  return <span className={`facebook-home-icon facebook-home-icon--${icon.className}`} style={opticalStyle} aria-hidden="true">
    {(destinationId === "feed" || destinationId === "notes") && <span className="facebook-home-icon__paper" />}
    {(destinationId === "profile" || destinationId === "friends" || destinationId === "requests") && <>
      <span className="facebook-home-icon__person facebook-home-icon__person--rear" />
      <span className="facebook-home-icon__person facebook-home-icon__person--front" />
    </>}
    {destinationId === "inbox" && <><span className="facebook-home-icon__message facebook-home-icon__message--rear" /><span className="facebook-home-icon__message facebook-home-icon__message--front" /></>}
    {destinationId === "places" && <><span className="facebook-home-icon__map" /><span className="facebook-home-icon__pin" /></>}
    {destinationId === "requests" && <span className="facebook-home-icon__plus">+</span>}
    {destinationId === "events" && <span className="facebook-home-icon__calendar">31</span>}
    {destinationId === "photos" && <><span className="facebook-home-icon__photo facebook-home-icon__photo--rear" /><span className="facebook-home-icon__photo facebook-home-icon__photo--front"><span /></span></>}
    {destinationId === "chat" && <><span className="facebook-home-icon__chat facebook-home-icon__chat--top" /><span className="facebook-home-icon__chat facebook-home-icon__chat--bottom" /></>}
  </span>;
}
