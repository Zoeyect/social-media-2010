import { useState, type CSSProperties } from "react";
import feedButton2xSrc from "../assets/facebook/home/3.2.1/feedButton@2x.png";
import profileButton2xSrc from "../assets/facebook/home/3.2.1/profileButton@2x.png";
import friendsButton2xSrc from "../assets/facebook/home/3.2.1/friendsButton@2x.png";
import inboxButton2xSrc from "../assets/facebook/home/3.2.1/inboxButton@2x.png";
import placesButton2xSrc from "../assets/facebook/home/3.2.1/placesButton@2x.png";
import requestsButton2xSrc from "../assets/facebook/home/3.2.1/requestsButton@2x.png";
import eventsButton2xSrc from "../assets/facebook/home/3.2.1/eventsButton@2x.png";
import photosButton2xSrc from "../assets/facebook/home/3.2.1/photosButton@2x.png";
import chatButton2xSrc from "../assets/facebook/home/3.2.1/chatButton@2x.png";
import notesButton2xSrc from "../assets/facebook/home/3.2.1/notesButton@2x.png";
import type { FacebookHomeLauncherDestinationId } from "../state/facebookState";

type FacebookHomeIconSourceType = "reconstruction" | "historical-asset" | "hold";
type FacebookHomeIconConfidence = "EXACT_TARGET_BUILD" | "SAME_ERA_CONFIRMED" | "ADJACENT_VERSION_PROBABLE" | "LATER_VERSION_REJECTED" | "UNKNOWN" | "RECONSTRUCTED" | "HOLD";
type FacebookHomeIconMetadata = Readonly<{
  className: string;
  sourceType: FacebookHomeIconSourceType;
  confidence: FacebookHomeIconConfidence;
  assetSrc: string;
  originalFilename: string;
  sourcePackage: "Facebook 3.2.1 (3210)";
  intrinsicSize: readonly [128, 128];
  displaySize: readonly [64, 64];
  sha256: string;
  opticalOffset: Readonly<{ x: -1 | 0 | 1; y: -1 | 0 | 1 }>;
}>;

const FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE = Object.freeze([128, 128] as const);
const FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE = Object.freeze([64, 64] as const);
const FACEBOOK_HOME_SOURCE_PACKAGE = "Facebook 3.2.1 (3210)" as const;

export const FACEBOOK_HOME_ICON_REGISTRY = Object.freeze({
  feed: Object.freeze({ className: "news-feed", sourceType: "historical-asset", confidence: "SAME_ERA_CONFIRMED", assetSrc: feedButton2xSrc, originalFilename: "feedButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "be9c0efbb91846ccb38e63bd8c9063978e56387a69ef28c1ffcb0985cb09a518", opticalOffset: Object.freeze({ x: 0, y: 1 }) }),
  profile: Object.freeze({ className: "profile", sourceType: "historical-asset", confidence: "SAME_ERA_CONFIRMED", assetSrc: profileButton2xSrc, originalFilename: "profileButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "23f332b8588e553a7105cd5f5f330f8d8f7b73b86a56834a9b6f5d02cf2873a0", opticalOffset: Object.freeze({ x: 0, y: -1 }) }),
  friends: Object.freeze({ className: "friends", sourceType: "historical-asset", confidence: "SAME_ERA_CONFIRMED", assetSrc: friendsButton2xSrc, originalFilename: "friendsButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "5abffa3dd1b1beba1e0d995128df525d9800a73041cc9a472269288d407c0224", opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
  inbox: Object.freeze({ className: "inbox", sourceType: "historical-asset", confidence: "SAME_ERA_CONFIRMED", assetSrc: inboxButton2xSrc, originalFilename: "inboxButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "bb6d10f8adb8b74ed5ebc09ad186fa350ebd8be21d0d1de0d0fa6000a6dd3702", opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
  places: Object.freeze({ className: "places", sourceType: "historical-asset", confidence: "SAME_ERA_CONFIRMED", assetSrc: placesButton2xSrc, originalFilename: "placesButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "f5a2416d27876957ffffe2b2d83610229fbb53888d65ae1125eacdeef712c01b", opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
  requests: Object.freeze({ className: "requests", sourceType: "historical-asset", confidence: "SAME_ERA_CONFIRMED", assetSrc: requestsButton2xSrc, originalFilename: "requestsButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "bd0397ecdfbe24181f34824f8b109598ec9242c8735ceeae9f7002b44274d124", opticalOffset: Object.freeze({ x: -1, y: 0 }) }),
  events: Object.freeze({ className: "events", sourceType: "historical-asset", confidence: "SAME_ERA_CONFIRMED", assetSrc: eventsButton2xSrc, originalFilename: "eventsButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "809d937f1af919b40d600461f6e36ceb30af45f8709c6e60f5169e1424460620", opticalOffset: Object.freeze({ x: 0, y: -1 }) }),
  photos: Object.freeze({ className: "photos", sourceType: "historical-asset", confidence: "SAME_ERA_CONFIRMED", assetSrc: photosButton2xSrc, originalFilename: "photosButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "46dc3e661acc0ef980d7da7ab5d43673e4c361001cf098fc24abf1af4d3b2c59", opticalOffset: Object.freeze({ x: -1, y: -1 }) }),
  chat: Object.freeze({ className: "chat", sourceType: "historical-asset", confidence: "SAME_ERA_CONFIRMED", assetSrc: chatButton2xSrc, originalFilename: "chatButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "8c723f7036a66a43df09ae348cea9e3e8ed7804a49ccf151b6ad41113f3c6b54", opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
  notes: Object.freeze({ className: "notes", sourceType: "historical-asset", confidence: "ADJACENT_VERSION_PROBABLE", assetSrc: notesButton2xSrc, originalFilename: "notesButton@2x.png", sourcePackage: FACEBOOK_HOME_SOURCE_PACKAGE, intrinsicSize: FACEBOOK_HOME_ORIGINAL_INTRINSIC_SIZE, displaySize: FACEBOOK_HOME_ORIGINAL_DISPLAY_SIZE, sha256: "d56e198df052abdccf8a9a77731aff9086441bfff15f6df734c94b131c1dfc36", opticalOffset: Object.freeze({ x: 0, y: 0 }) }),
} satisfies Record<FacebookHomeLauncherDestinationId, FacebookHomeIconMetadata>);

function FacebookHomeIconFallback({ destinationId }: { destinationId: FacebookHomeLauncherDestinationId }) {
  return <>
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
  </>;
}

export function FacebookHomeIcon({ destinationId }: { destinationId: FacebookHomeLauncherDestinationId }) {
  const icon = FACEBOOK_HOME_ICON_REGISTRY[destinationId];
  const [failedAssetSrc, setFailedAssetSrc] = useState<string | null>(null);
  const showsOriginalAsset = icon.sourceType === "historical-asset" && failedAssetSrc !== icon.assetSrc;
  const opticalStyle = {
    "--facebook-home-icon-offset-x": `${icon.opticalOffset.x}px`,
    "--facebook-home-icon-offset-y": `${icon.opticalOffset.y}px`,
  } as CSSProperties;
  return <span className={`facebook-home-icon facebook-home-icon--${icon.className}${showsOriginalAsset ? " is-historical-asset" : ""}`} style={opticalStyle} aria-hidden="true">
    {showsOriginalAsset
      ? <img className="facebook-home-icon__original" src={icon.assetSrc} alt="" draggable={false} onError={() => setFailedAssetSrc(icon.assetSrc)} />
      : <FacebookHomeIconFallback destinationId={destinationId} />}
  </span>;
}
