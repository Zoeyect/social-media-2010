import { FormEvent, PointerEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import bootLogoSrc from "../assets/historical/ios4.1/applelogo-iphone3,1-8B117.png?inline";
import lowBatterySrc from "../assets/device/low-battery-iphone4.png";
import { DeviceAudio } from "../audio/deviceAudio";
import { buildSessionTimelineEvents } from "../data/sessionTimeline";
import { appRuntimeStateTransition, initialAppRuntimeState } from "../state/appRuntimeState";
import { DEVICE_CARRIER_CONFIG } from "../state/carrierConfig";
import { cameraRuntimeTransition, initialCameraRuntimeState, requestCameraCapture } from "../state/cameraRuntime";
import type { CameraLookOffset, CameraOwner } from "../state/cameraRuntime";
import { createCameraPhotoRecord, releaseCameraPhotoRecords } from "../state/cameraCaptureState";
import type { CameraPhotoRecord } from "../state/cameraCaptureState";
import { deleteStalePlayerCameraRolls, discardPersistedCameraPhoto, eraseAllPlayerCameraRolls, eraseCurrentCameraRoll, initializeCameraRollPersistence, isCameraCaptureOwnerCurrent, persistCameraCapturedArtifact } from "../state/cameraRollPersistence";
import { initialCameraRoll, initialPhotosState, photosStateTransition, sortCameraRollRecords } from "../state/cameraRollState";
import type { CameraRollInitialization } from "../state/cameraRollState";
import { nextDueDeviceEvent, removeDeviceEvent, scheduleDeviceEvent, scheduleDeviceEvents } from "../state/deviceEventScheduler";
import { batteryPercent, BOOT_DURATION_MS, createExperienceSessionId, currentWarning, elapsedMs, formatDeviceDate, formatDeviceTime, formatLockScreenTime, hasReachedSessionTerminal, homeButtonTransition, initialSession, loadSession, longPowerTransition, POWER_HOLD_MS, saveSession, SESSION_DURATION_MS, Session, shortPowerTransition, simulatedDeviceDateTime } from "../state/deviceMachine";
import { folderStateTransition } from "../state/folderState";
import { createInitialFacebookState, deterministicFacebookPartyInviteDelayMs, FACEBOOK_PARTY_INVITE_EVENT_ID, facebookStateTransition } from "../state/facebookState";
import type { FacebookEvent } from "../state/facebookState";
import { createInitialFoursquareState, foursquareStateTransition } from "../state/foursquareState";
import { createInitialInstagramState, instagramStateTransition } from "../state/instagramState";
import { multitaskingBarStateTransition } from "../state/multitaskingBarState";
import { createInitialMessagesState, DAD_LOVE_REPLY_DUE_ELAPSED_MS, deterministicMomLoveReplyDelayMs, messagesStateTransition } from "../state/messagesState";
import { createLockScreenModel } from "../state/lockScreenModel";
import { initialLockNotificationState, lockNotificationStateTransition } from "../state/lockNotificationState";
import type { ActiveLockNotification } from "../state/lockNotificationState";
import { createInitialMessagesBadgeState, messagesBadgeStateTransition } from "../state/messagesBadgeState";
import { initialSMSNotificationState, smsNotificationStateTransition } from "../state/smsNotificationState";
import { createSessionIdentity, SessionIdentityContext } from "../state/sessionIdentity";
import { createStatusBarState } from "../state/statusBarModel";
import { createInitialTwitterState, twitterStateTransition } from "../state/twitterState";
import { createSMSLockNotification, smsMessageReceived } from "../system/smsNotification";
import { createInitialFlickrState, flickrStateTransition } from "../state/flickrState";
import { createInitialTumblrState, tumblrStateTransition } from "../state/tumblrState";
import { LockScreen } from "./LockScreen";
import { CameraContainer } from "./CameraContainer";
import { FacebookContainer } from "./FacebookContainer";
import { FoursquareContainer } from "./FoursquareContainer";
import { InstagramContainer } from "./InstagramContainer";
import { FlickrContainer } from "./FlickrContainer";
import { TumblrContainer } from "./TumblrContainer";
import { LockScreenStatusPresentation } from "./LockScreenStatusPresentation";
import { AppLaunchContainer } from "./AppLaunchContainer";
import { MultitaskingBar } from "./MultitaskingBar";
import { MobileSMSContainer } from "./MobileSMSContainer";
import { PhotosContainer } from "./PhotosContainer";
import { SMSAlertOverlay } from "./SMSAlertOverlay";
import { SpringBoard } from "./SpringBoard";
import { StatusBar } from "./StatusBar";
import { TwitterContainer } from "./TwitterContainer";
import { IOS4KeyboardSystem } from "./IOS4KeyboardSystem";
import { AmbientWorld } from "../world/AmbientWorld";
import type { CameraStillCapture } from "../world/AmbientWorld";

const TERMINAL_DEPLETED_DISPLAY_MS = 1_500;
const AUTO_SLEEP_DELAY_MS = 60_000;
const AUTO_SLEEP_PHASES = new Set<Session["phase"]>(["locked", "springboard", "app"]);
const HOME_DOUBLE_PRESS_MS = 300;
const MOM_REPLY_DELAY_MS = 30_000;
const SHUTDOWN_BLACK_SCREEN_MS = 500;
const TERMINAL_POWERED_OFF_MS = 500;
const MOM_REPLY_SMS = { id: "mom-sleep-early", sender: "Mom", message: "Good. Sleep early." } as const;
const MOM_LOVE_REPLY_SMS = { id: "mom-love-you-too", sender: "Mom", message: "I love you too." } as const;
const DAD_LOVE_REPLY_SMS = { id: "dad-sleep-early", sender: "Dad", message: "Sleep early." } as const;

type CameraCaptureQaHandle = Readonly<{
  latest: () => CameraPhotoRecord | null;
  records: () => readonly CameraPhotoRecord[];
  persistenceStatus: () => CameraRollInitialization["status"];
  failNextCapture: () => void;
  eraseCurrentCameraRoll: () => Promise<void>;
  eraseAllPlayerCameraRolls: () => Promise<void>;
}>;

type CameraCaptureQaWindow = Window & {
  __SM2010_CAMERA_CAPTURE_QA__?: CameraCaptureQaHandle;
};

function loadRuntimeSession(): Session {
  const persisted = loadSession();
  if (persisted.phase === "shutdown" || persisted.returnToHeroPending) return initialSession;
  if (persisted.sessionStartEpochMs === null && persisted.phase !== "locked" && persisted.phase !== "booting") return persisted;
  return {
    ...initialSession,
    sessionIdentity: persisted.sessionIdentity,
    experienceSessionId: persisted.experienceSessionId,
    phase: persisted.sessionIdentity.name ? "booting" : "hero",
  };
}

export function App() {
  const [session, setSession] = useState<Session>(loadRuntimeSession);
  const ambientWorldEnabled = import.meta.env.DEV && new URLSearchParams(window.location.search).get("ambientWorld") === "1";
  const [cameraPreviewCanvas, setCameraPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
  const requestedDevApp = import.meta.env.DEV ? new URLSearchParams(window.location.search).get("devApp") : null;
  const devAppId = requestedDevApp === "twitter" || requestedDevApp === "facebook" || requestedDevApp === "instagram" || requestedDevApp === "foursquare" || requestedDevApp === "flickr" || requestedDevApp === "tumblr" ? requestedDevApp : null;
  const devAutoOpen = devAppId !== null && new URLSearchParams(window.location.search).get("autoOpen") === "1";
  const [springBoardPage, setSpringBoardPage] = useState<0 | 1>(0);
  const [folderState, dispatchFolderEvent] = useReducer(folderStateTransition, "closed");
  const [activeFolderSlotIndex, setActiveFolderSlotIndex] = useState(0);
  const [appRuntime, dispatchAppRuntime] = useReducer(appRuntimeStateTransition, initialAppRuntimeState);
  const [cameraRuntime, dispatchCameraRuntime] = useReducer(cameraRuntimeTransition, initialCameraRuntimeState);
  const [photosState, dispatchPhotos] = useReducer(photosStateTransition, initialPhotosState);
  const cameraCapture = useRef<CameraStillCapture | null>(null);
  const cameraCaptureInFlight = useRef(false);
  const cameraCaptureNamespace = useRef(0);
  const activeExperienceSessionIdRef = useRef(session.experienceSessionId);
  activeExperienceSessionIdRef.current = session.experienceSessionId;
  const [cameraRoll, setCameraRoll] = useState<CameraRollInitialization>(initialCameraRoll);
  const cameraRollRef = useRef<CameraRollInitialization>(initialCameraRoll);
  const cameraRollMounted = useRef(true);
  const failNextCameraCapture = useRef(false);
  const cameraCaptureResetActive = useRef(false);
  const setCameraCaptureReady = useCallback((capture: CameraStillCapture | null) => {
    cameraCapture.current = capture;
  }, []);
  const setCameraLookPointerOffset = useCallback((offset: CameraLookOffset) => {
    dispatchCameraRuntime({ type: "SET_LOOK_POINTER_OFFSET", owner: "cameraApp", offset });
  }, []);
  const [multitaskingBar, dispatchMultitaskingBar] = useReducer(multitaskingBarStateTransition, "closed");
  const [messagesState, dispatchMessages] = useReducer(messagesStateTransition, undefined, createInitialMessagesState);
  const [messagesUnreadIds, dispatchMessagesBadge] = useReducer(messagesBadgeStateTransition, undefined, createInitialMessagesBadgeState);
  const [smsNotification, dispatchSMSNotification] = useReducer(smsNotificationStateTransition, initialSMSNotificationState);
  const [activeLockNotification, dispatchLockNotification] = useReducer(lockNotificationStateTransition, initialLockNotificationState);
  const [facebookState, dispatchFacebook] = useReducer(
    facebookStateTransition,
    session.sessionIdentity.name,
    createInitialFacebookState,
  );
  const [instagramState, dispatchInstagram] = useReducer(instagramStateTransition, undefined, createInitialInstagramState);
  const [foursquareState, dispatchFoursquare] = useReducer(foursquareStateTransition, undefined, createInitialFoursquareState);
  const [flickrState, dispatchFlickr] = useReducer(flickrStateTransition, undefined, createInitialFlickrState);
  const [tumblrState, dispatchTumblr] = useReducer(tumblrStateTransition, undefined, createInitialTumblrState);
  const [twitterState, dispatchTwitter] = useReducer(
    twitterStateTransition,
    session.sessionIdentity.name,
    createInitialTwitterState,
  );
  const [now, setNow] = useState(Date.now());
  const [powerProgress, setPowerProgress] = useState(0);
  const [homePressed, setHomePressed] = useState(false);
  const [activityRevision, setActivityRevision] = useState(0);
  const [unlockReturnAppId, setUnlockReturnAppId] = useState<string | null>(null);
  const powerStarted = useRef<number | null>(null);
  const powerFrame = useRef<number | null>(null);
  const homePointer = useRef<number | null>(null);
  const pendingAppHomePress = useRef<number | null>(null);
  const devAutoOpenConsumed = useRef(false);
  const deliveredEventClaims = useRef(new Set<string>());
  const elapsed = elapsedMs(session, now);
  const deviceDateTime = simulatedDeviceDateTime(elapsed);
  const deviceStatusTime = formatDeviceTime(deviceDateTime);
  const lockScreenTime = formatLockScreenTime(deviceDateTime);
  const deviceDate = formatDeviceDate(deviceDateTime);
  const statusBarState = createStatusBarState({
    signalStrength: 5,
    network: DEVICE_CARRIER_CONFIG.networkType,
    bluetoothEnabled: false,
    batteryPercentage: batteryPercent(elapsed),
    charging: false,
    carrier: DEVICE_CARRIER_CONFIG.carrier,
    carrierArtworkSrc: DEVICE_CARRIER_CONFIG.carrierArtworkSrc,
    clock: deviceStatusTime,
  });
  const lockScreenModel = createLockScreenModel(lockScreenTime, deviceDate, statusBarState);

  const captureCameraPhoto = async () => {
    const capture = cameraCapture.current;
    const cameraSession = cameraRuntime.cameraApp;
    const experienceSessionId = session.experienceSessionId;
    if (!capture || !experienceSessionId || cameraCaptureInFlight.current || cameraRollRef.current.status !== "ready") return;
    cameraCaptureInFlight.current = true;
    if (!requestCameraCapture(cameraRuntime, "cameraApp", dispatchCameraRuntime)) {
      cameraCaptureInFlight.current = false;
      return;
    }

    const namespace = cameraCaptureNamespace.current;
    const createdAt = simulatedDeviceDateTime(elapsedMs(session, Date.now())).toISOString();
    try {
      if (import.meta.env.DEV && failNextCameraCapture.current) {
        failNextCameraCapture.current = false;
        throw new Error("Camera capture QA forced the next request to fail.");
      }
      const pendingArtifact = capture({
        createdAt,
        experienceSessionId,
        cameraFacing: cameraSession.cameraDevice,
        cameraMode: cameraSession.mode,
      });
      dispatchCameraRuntime({ type: "CAPTURE_COMPLETE", owner: "cameraApp" });
      const artifact = await pendingArtifact;
      if (namespace !== cameraCaptureNamespace.current
        || !isCameraCaptureOwnerCurrent(experienceSessionId, activeExperienceSessionIdRef.current)) return;
      const durableRecord = await persistCameraCapturedArtifact(artifact, experienceSessionId);
      if (namespace !== cameraCaptureNamespace.current
        || !isCameraCaptureOwnerCurrent(experienceSessionId, activeExperienceSessionIdRef.current)) {
        await discardPersistedCameraPhoto(durableRecord);
        return;
      }
      if (!cameraRollMounted.current) return;
      const record = createCameraPhotoRecord(durableRecord);
      const records = sortCameraRollRecords([...cameraRollRef.current.records, record]);
      const nextCameraRoll: CameraRollInitialization = { status: "ready", records, error: null };
      cameraRollRef.current = nextCameraRoll;
      setCameraRoll(nextCameraRoll);
      if (namespace === cameraCaptureNamespace.current) {
        dispatchCameraRuntime({ type: "PROCESSING_COMPLETE", owner: "cameraApp" });
      }
    } catch (error) {
      console.error("Camera capture failed.", error);
      if (namespace === cameraCaptureNamespace.current) {
        dispatchCameraRuntime({ type: "CAPTURE_FAILED", owner: "cameraApp" });
      }
    } finally {
      cameraCaptureInFlight.current = false;
    }
  };

  const update = (change: Partial<Session>) => setSession(s => ({ ...s, ...change }));
  const dispatchFacebookEvent = (event: FacebookEvent) => {
    const validJuneTrigger = event.type === "SUBMIT_MESSAGE_REPLY"
      && facebookState.selectedMessageId === "june-live-message"
      && Boolean(facebookState.messageReplyDraft.trim())
      && facebookState.inboxThreads.some(thread => thread.id === "june-live-message");
    const validJackTrigger = event.type === "ACCEPT_JACK" && facebookState.friendRequestState === "pending";
    const shouldSchedulePartyInvite = facebookState.partyInviteState === "none" && (validJuneTrigger || validJackTrigger);

    dispatchFacebook(event);
    if (!shouldSchedulePartyInvite) return;
    setSession(current => ({
      ...current,
      deviceEvents: scheduleDeviceEvent(current.deviceEvents, {
        id: FACEBOOK_PARTY_INVITE_EVENT_ID,
        type: "facebookPartyInvite",
        dueElapsedMs: elapsedMs(current, Date.now()) + deterministicFacebookPartyInviteDelayMs(current.sessionIdentity.name),
        sourceApp: "facebook",
        deliveryPolicy: "internal",
        payload: { kind: "facebook-party-invite" },
        provenanceStatus: "CURATED",
      }),
    }));
  };
  const cameraOwnerForApp = (appId: string | null): CameraOwner | null => appId === "camera"
    ? "cameraApp"
    : appId === "messages" && cameraRuntime.cameraPicker.phase !== "none"
      ? "cameraPicker"
      : null;

  const clearRuntimeCameraRoll = useCallback((status: "loading" | "ready") => {
    if (!cameraRollMounted.current) return;
    releaseCameraPhotoRecords(cameraRollRef.current.records);
    const emptyCameraRoll: CameraRollInitialization = { status, records: Object.freeze([]), error: null };
    cameraRollRef.current = emptyCameraRoll;
    setCameraRoll(emptyCameraRoll);
    dispatchPhotos({ type: "RESET" });
  }, []);

  const eraseCurrentCameraRollForDevelopment = useCallback(async () => {
    const experienceSessionId = activeExperienceSessionIdRef.current;
    if (!experienceSessionId) return;
    await eraseCurrentCameraRoll(experienceSessionId);
    if (experienceSessionId !== activeExperienceSessionIdRef.current) return;
    await initializeCameraRollPersistence(experienceSessionId);
    if (experienceSessionId === activeExperienceSessionIdRef.current) clearRuntimeCameraRoll("ready");
  }, [clearRuntimeCameraRoll]);

  const eraseAllPlayerCameraRollsForDevelopment = useCallback(async () => {
    await eraseAllPlayerCameraRolls();
    const experienceSessionId = activeExperienceSessionIdRef.current;
    if (!experienceSessionId) {
      clearRuntimeCameraRoll("loading");
      return;
    }
    await initializeCameraRollPersistence(experienceSessionId);
    if (experienceSessionId === activeExperienceSessionIdRef.current) clearRuntimeCameraRoll("ready");
  }, [clearRuntimeCameraRoll]);

  useEffect(() => saveSession(session), [session]);
  useEffect(() => {
    const experienceSessionId = session.experienceSessionId;
    let cancelled = false;
    clearRuntimeCameraRoll("loading");
    if (!experienceSessionId) return () => { cancelled = true; };

    void deleteStalePlayerCameraRolls(experienceSessionId).catch(error => {
      console.error("Stale Camera Roll cleanup failed; owner filtering remains active.", error);
    });
    void initializeCameraRollPersistence(experienceSessionId).then(durableRecords => {
      const restoredRecords: CameraPhotoRecord[] = [];
      try {
        durableRecords.forEach(record => restoredRecords.push(createCameraPhotoRecord(record)));
      } catch (error) {
        releaseCameraPhotoRecords(restoredRecords);
        throw error;
      }
      if (cancelled || experienceSessionId !== activeExperienceSessionIdRef.current) {
        releaseCameraPhotoRecords(restoredRecords);
        return;
      }
      releaseCameraPhotoRecords(cameraRollRef.current.records);
      const readyCameraRoll: CameraRollInitialization = {
        status: "ready",
        records: sortCameraRollRecords(restoredRecords),
        error: null,
      };
      cameraRollRef.current = readyCameraRoll;
      setCameraRoll(readyCameraRoll);
    }).catch(error => {
      if (cancelled || experienceSessionId !== activeExperienceSessionIdRef.current) return;
      const message = error instanceof Error ? error.message : "Durable Camera Roll failed to initialize.";
      console.error("Camera Roll persistence initialization failed.", error);
      const failedCameraRoll: CameraRollInitialization = { status: "error", records: Object.freeze([]), error: message };
      cameraRollRef.current = failedCameraRoll;
      setCameraRoll(failedCameraRoll);
    });
    return () => {
      cancelled = true;
    };
  }, [clearRuntimeCameraRoll, session.experienceSessionId]);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const qaWindow = window as CameraCaptureQaWindow;
    const handle: CameraCaptureQaHandle = Object.freeze({
      latest: () => cameraRollRef.current.records[cameraRollRef.current.records.length - 1] ?? null,
      records: () => [...cameraRollRef.current.records],
      persistenceStatus: () => cameraRollRef.current.status,
      failNextCapture: () => { failNextCameraCapture.current = true; },
      eraseCurrentCameraRoll: eraseCurrentCameraRollForDevelopment,
      eraseAllPlayerCameraRolls: eraseAllPlayerCameraRollsForDevelopment,
    });
    qaWindow.__SM2010_CAMERA_CAPTURE_QA__ = handle;
    return () => {
      if (qaWindow.__SM2010_CAMERA_CAPTURE_QA__ === handle) {
        delete qaWindow.__SM2010_CAMERA_CAPTURE_QA__;
      }
    };
  }, [eraseAllPlayerCameraRollsForDevelopment, eraseCurrentCameraRollForDevelopment]);
  useEffect(() => {
    cameraRollMounted.current = true;
    return () => {
      cameraRollMounted.current = false;
      if (pendingAppHomePress.current !== null) window.clearTimeout(pendingAppHomePress.current);
      releaseCameraPhotoRecords(cameraRollRef.current.records);
      cameraRollRef.current = initialCameraRoll;
    };
  }, []);
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 250); return () => clearInterval(id); }, []);
  useEffect(() => {
    const event = nextDueDeviceEvent(session.deviceEvents, elapsed);
    if (!event) return;
    const isMessagesReplyEvent = event.type === "momReply" || event.type === "momLoveReply" || event.type === "dadLoveReply";
    const isTimelineEvent = !isMessagesReplyEvent;
    if (isTimelineEvent && (session.deliveredTimelineEventIds.includes(event.id) || deliveredEventClaims.current.has(event.id))) {
      setSession(current => ({ ...current, deviceEvents: removeDeviceEvent(current.deviceEvents, event.id) }));
      return;
    }
    if (isTimelineEvent) deliveredEventClaims.current.add(event.id);
    const source = session.phase === "sleeping" || session.phase === "locked" ? "lockscreen" : "foreground";
    const displayingMomConversation = session.phase === "app"
      && appRuntime.activeAppId === "messages"
      && messagesState.view === "conversation"
      && messagesState.activeConversationId === "mom";
    const displayingDadConversation = session.phase === "app"
      && appRuntime.activeAppId === "messages"
      && messagesState.view === "conversation"
      && messagesState.activeConversationId === "dad";
    let wakesSleepingDevice = false;

    if (event.type === "initialSMS" && event.payload?.kind === "initial-sms") {
      smsMessageReceived(event.payload, source, {
        notificationDispatch: dispatchSMSNotification,
        badgeDispatch: dispatchMessagesBadge,
        messagesDispatch: dispatchMessages,
        lockNotificationDispatch: dispatchLockNotification,
      });
      wakesSleepingDevice = session.phase === "sleeping";
    } else if (event.type === "momReply") {
      if (messagesState.momReply === "pending" && displayingMomConversation) {
        dispatchMessages({ type: "DELIVER_MOM_REPLY" });
      } else if (messagesState.momReply === "pending") {
        smsMessageReceived(MOM_REPLY_SMS, source, {
          notificationDispatch: dispatchSMSNotification,
          badgeDispatch: dispatchMessagesBadge,
          messagesDispatch: dispatchMessages,
          lockNotificationDispatch: dispatchLockNotification,
        });
        dispatchMessages({ type: "MARK_MOM_REPLY_DELIVERED" });
        wakesSleepingDevice = session.phase === "sleeping";
      }
    } else if (event.type === "momLoveReply") {
      if (messagesState.momLoveReply === "pending" && displayingMomConversation) {
        dispatchMessages({ type: "DELIVER_MOM_LOVE_REPLY" });
      } else if (messagesState.momLoveReply === "pending") {
        smsMessageReceived(MOM_LOVE_REPLY_SMS, source, {
          notificationDispatch: dispatchSMSNotification,
          badgeDispatch: dispatchMessagesBadge,
          messagesDispatch: dispatchMessages,
          lockNotificationDispatch: dispatchLockNotification,
        });
        dispatchMessages({ type: "MARK_MOM_LOVE_REPLY_DELIVERED" });
        wakesSleepingDevice = session.phase === "sleeping";
      }
    } else if (event.type === "dadLoveReply") {
      if (messagesState.dadLoveReply === "pending" && displayingDadConversation) {
        dispatchMessages({ type: "DELIVER_DAD_LOVE_REPLY" });
      } else if (messagesState.dadLoveReply === "pending") {
        smsMessageReceived(DAD_LOVE_REPLY_SMS, source, {
          notificationDispatch: dispatchSMSNotification,
          badgeDispatch: dispatchMessagesBadge,
          messagesDispatch: dispatchMessages,
          lockNotificationDispatch: dispatchLockNotification,
        });
        dispatchMessages({ type: "MARK_DAD_LOVE_REPLY_DELIVERED" });
        wakesSleepingDevice = session.phase === "sleeping";
      }
    } else if (event.type === "facebookJackRequest") {
      dispatchFacebook({ type: "DELIVER_JACK_REQUEST" });
    } else if (event.type === "facebookJuneMessage") {
      dispatchFacebook({ type: "DELIVER_JUNE_MESSAGE" });
    } else if (event.type === "facebookPartyInvite" && event.payload?.kind === "facebook-party-invite") {
      dispatchFacebook({ type: "DELIVER_PARTY_INVITE", timestamp: deviceStatusTime });
    } else if (event.type === "facebookJuneInstagramAnnouncement" && event.payload?.kind === "facebook-june-instagram-announcement") {
      dispatchFacebook({ type: "DELIVER_JUNE_INSTAGRAM_ANNOUNCEMENT", timestamp: deviceStatusTime, createdAt: deviceDateTime.toISOString() });
    } else if (event.type === "facebookJuneJackGossip" && event.payload?.kind === "facebook-june-jack-gossip") {
      dispatchFacebook({ type: "DELIVER_JUNE_JACK_GOSSIP", reactionId: event.payload.reactionId, characterId: event.payload.characterId, text: event.payload.text });
    } else if (event.type === "facebookEphemeralGossip" && event.payload?.kind === "facebook-ephemeral-gossip") {
      dispatchFacebook({ type: "DELIVER_EPHEMERAL_GOSSIP", postId: event.payload.postId, ephemeralId: event.payload.ephemeralId, text: event.payload.text, timestamp: deviceStatusTime, createdAt: deviceDateTime.toISOString() });
    } else if (event.type === "facebookKatieGossipMessage" && event.payload?.kind === "facebook-katie-jack-gossip-message") {
      dispatchFacebook({ type: "DELIVER_KATIE_GOSSIP_MESSAGE", timestamp: deviceStatusTime });
    } else if (event.type === "facebookSophieJuneComment" && event.payload?.kind === "facebook-sophie-june-comment") {
      dispatchFacebook({ type: "DELIVER_SOPHIE_JUNE_COMMENT", commentId: event.payload.commentId, text: event.payload.text });
    } else if (event.type === "instagramJunePost" && event.payload?.kind === "instagram-june-post") {
      dispatchInstagram({ type: "DELIVER_KNOWN_ACCOUNT_POST", post: { id: event.payload.postId, mediaId: event.payload.mediaId, timestamp: event.payload.timestamp } });
    } else if (event.type === "instagramJuneDelete" && event.payload?.kind === "instagram-june-delete") {
      dispatchInstagram({ type: "DELETE_KNOWN_ACCOUNT_POST", postId: event.payload.postId });
    } else if (event.type === "twitterBackgroundTweet" && event.payload?.kind === "twitter-post") {
      dispatchTwitter({ type: "DELIVER_TIMELINE_TWEET", tweet: event.payload.post });
    } else if (event.type === "foursquareActivity" && event.payload?.kind === "foursquare-activity") {
      dispatchFoursquare({
        type: "DELIVER_SOCIAL_ACTIVITY",
        activity: { id: event.payload.activityId, message: event.payload.message },
      });
    } else if (event.type === "tumblrBackgroundPost" && event.payload?.kind === "tumblr-post") {
      dispatchTumblr({ type: "DELIVER_BACKGROUND_POST", post: event.payload.post });
    }
    setSession(current => ({
      ...current,
      deviceEvents: removeDeviceEvent(current.deviceEvents, event.id),
      deliveredTimelineEventIds: isTimelineEvent && !current.deliveredTimelineEventIds.includes(event.id)
        ? [...current.deliveredTimelineEventIds, event.id]
        : current.deliveredTimelineEventIds,
      ...(wakesSleepingDevice && current.phase === "sleeping" ? { phase: "locked" as const } : {}),
    }));
  }, [appRuntime.activeAppId, elapsed, messagesState.activeConversationId, messagesState.dadLoveReply, messagesState.momLoveReply, messagesState.momReply, messagesState.view, session.deliveredTimelineEventIds, session.deviceEvents, session.phase]);
  useEffect(() => {
    if ((session.phase !== "sleeping" && session.phase !== "locked") || smsNotification.status !== "alert-visible") return;
    dispatchSMSNotification({ type: "SHOW_PREVIEW" });
    dispatchLockNotification({
      type: "PRESENT",
      notification: createSMSLockNotification({
        id: smsNotification.notification.id,
        sender: smsNotification.notification.sender,
        message: smsNotification.notification.message,
      }),
    });
  }, [session.phase, smsNotification.status]);
  useEffect(() => {
    const unreadMessageIds = messagesState.messages
      .filter(message => message.direction === "incoming" && message.status === "unread")
      .map(message => message.id);
    messagesUnreadIds.forEach(messageId => {
      if (!unreadMessageIds.includes(messageId)) dispatchMessagesBadge({ type: "MARK_READ", messageId });
    });
    unreadMessageIds.forEach(messageId => {
      if (!messagesUnreadIds.includes(messageId)) dispatchMessagesBadge({ type: "ADD_UNREAD", messageId });
    });
  }, [messagesState.messages, messagesUnreadIds]);
  useEffect(() => {
    const displayingConversation = session.phase === "app"
      && appRuntime.activeAppId === "messages"
      && messagesState.view === "conversation";
    if (!displayingConversation || !smsNotification.notification) return;
    const messageId = smsNotification.notification.id;
    const displayedMessage = messagesState.messages.find(message => message.id === messageId);
    if (!displayedMessage || messagesState.activeConversationId !== displayedMessage.conversationId) return;
    if (messagesUnreadIds.includes(messageId)) {
      dispatchMessagesBadge({ type: "MARK_READ", messageId });
    }
    if (smsNotification.notification?.id === messageId && smsNotification.status !== "opened") {
      dispatchSMSNotification({ type: "OPEN" });
    }
  }, [appRuntime.activeAppId, messagesState.activeConversationId, messagesState.messages, messagesState.view, messagesUnreadIds, session.phase, smsNotification.notification, smsNotification.status]);
  useEffect(() => {
    if (cameraRuntime.cameraApp.phase === "launching"
      && appRuntime.activeAppId === "camera"
      && appRuntime.phase === "running") {
      dispatchCameraRuntime({ type: "LAUNCH_COMPLETE", owner: "cameraApp" });
    }
    if (cameraRuntime.cameraPicker.phase === "launching"
      && appRuntime.activeAppId === "messages"
      && session.phase === "app") {
      dispatchCameraRuntime({ type: "LAUNCH_COMPLETE", owner: "cameraPicker" });
    }
  }, [appRuntime.activeAppId, appRuntime.phase, cameraRuntime.cameraApp.phase, cameraRuntime.cameraPicker.phase, session.phase]);
  useEffect(() => {
    if (cameraRuntime.cameraPicker.phase !== "returning") return;
    const frame = window.requestAnimationFrame(() => {
      dispatchCameraRuntime({ type: "RETURN_COMPLETE", owner: "cameraPicker" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [cameraRuntime.cameraPicker.phase]);
  useEffect(() => {
    if (session.sessionStartEpochMs === null || session.phase === "hero" || session.phase === "poweredOff" || session.phase === "booting" || session.phase === "shutdown") return;
    if (hasReachedSessionTerminal(session, now) && session.activeWarning !== 1 && !session.batteryCriticalPending) {
      update({ batteryCriticalPending: true });
    }
  }, [now, session.activeWarning, session.batteryCriticalPending, session.phase, session.sessionStartEpochMs]);
  useEffect(() => {
    if (!session.batteryCriticalPending || session.phase === "shutdown" || session.phase === "poweredOff") return;
    if (session.phase === "springboard" || session.phase === "app") {
      DeviceAudio.lowBatteryWarning();
      update({
        previousPhase: session.phase,
        phase: "lowBatteryWarning",
        activeWarning: 1,
        batteryCriticalPending: false,
        batteryCriticalRevealAtMs: null,
      });
      return;
    }
    if (session.phase === "locked" || session.phase === "sleeping" || session.phase === "lowBatteryWarning" || session.phase === "powerOffConfirm") {
      update({
        previousPhase: null,
        phase: "shutdown",
        shutdownReason: "battery",
        activeWarning: null,
        batteryCriticalPending: false,
        batteryCriticalRevealAtMs: null,
      });
    }
  }, [session.batteryCriticalPending, session.phase]);
  useEffect(() => {
    if (session.sessionStartEpochMs === null || elapsed >= SESSION_DURATION_MS || session.activeWarning !== null) return;
    if (session.phase !== "springboard" && session.phase !== "app") return;
    const warning = currentWarning(elapsed, session.dismissedWarnings);
    if (warning === null) return;
    DeviceAudio.lowBatteryWarning();
    update({
      activeWarning: warning,
    });
  }, [elapsed, session.activeWarning, session.dismissedWarnings, session.phase, session.sessionStartEpochMs]);
  useEffect(() => {
    if (session.phase !== "lowBatteryWarning" || session.activeWarning !== 1) return;
    const id = window.setTimeout(() => {
      update({
        previousPhase: null,
        phase: "shutdown",
        shutdownReason: "battery",
        activeWarning: null,
        batteryCriticalPending: false,
        batteryCriticalRevealAtMs: null,
      });
    }, TERMINAL_DEPLETED_DISPLAY_MS);
    return () => window.clearTimeout(id);
  }, [session.activeWarning, session.phase]);
  useEffect(() => {
    if (session.phase !== "booting") return;
    const id = window.setTimeout(() => setSession(current => {
      if (current.phase !== "booting") return current;
      const startsSession = current.sessionStartEpochMs === null;
      return {
        ...current,
        phase: "locked",
        sessionStartEpochMs: startsSession ? Date.now() : current.sessionStartEpochMs,
        deviceEvents: startsSession
          ? scheduleDeviceEvents([], buildSessionTimelineEvents())
          : current.deviceEvents,
        deliveredTimelineEventIds: startsSession ? [] : current.deliveredTimelineEventIds,
      };
    }), BOOT_DURATION_MS);
    return () => clearTimeout(id);
  }, [session.phase]);
  useEffect(() => {
    if (session.phase !== "shutdown") return;
    deliveredEventClaims.current.clear();
    dispatchMessages({ type: "RESET_RUNTIME" });
    dispatchMessagesBadge({ type: "RESET" });
    dispatchSMSNotification({ type: "RESET" });
    dispatchLockNotification({ type: "RESET" });
    dispatchFacebook({ type: "RESET" });
    dispatchInstagram({ type: "RESET" });
    dispatchFoursquare({ type: "RESET" });
    dispatchFlickr({ type: "RESET" });
    dispatchTumblr({ type: "RESET" });
    dispatchTwitter({ type: "RESET" });
    dispatchAppRuntime({ type: "RESET" });
    dispatchCameraRuntime({ type: "RESET", owner: "cameraApp" });
    dispatchCameraRuntime({ type: "RESET", owner: "cameraPicker" });
    dispatchMultitaskingBar("RESET");
    dispatchFolderEvent("CLOSE");
    dispatchFolderEvent("ANIMATION_COMPLETE");
    setActiveFolderSlotIndex(0);
    setUnlockReturnAppId(null);
    setSpringBoardPage(0);
    setActivityRevision(0);
    const shutdownReason = session.shutdownReason;
    const id = window.setTimeout(() => setSession({
      ...initialSession,
      sessionIdentity: initialSession.sessionIdentity,
      phase: "poweredOff",
      shutdownReason,
      returnToHeroPending: true,
    }), SHUTDOWN_BLACK_SCREEN_MS);
    return () => clearTimeout(id);
  }, [session.phase, session.shutdownReason]);
  useEffect(() => {
    if (session.phase !== "poweredOff" || !session.returnToHeroPending) return;
    const id = window.setTimeout(() => setSession({ ...initialSession }), TERMINAL_POWERED_OFF_MS);
    return () => window.clearTimeout(id);
  }, [session.phase, session.returnToHeroPending]);
  useEffect(() => {
    if (!AUTO_SLEEP_PHASES.has(session.phase)) return;
    const id = window.setTimeout(() => {
      const returnAppId = session.phase === "app" ? appRuntime.activeAppId : null;
      setUnlockReturnAppId(returnAppId);
      if (returnAppId) {
        const cameraOwner = cameraOwnerForApp(returnAppId);
        if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
        dispatchAppRuntime({ type: "SUSPEND" });
      }
      dispatchMultitaskingBar("RESET");
      DeviceAudio.lock();
      setSession(current => AUTO_SLEEP_PHASES.has(current.phase) ? { ...current, phase: "sleeping" } : current);
    }, AUTO_SLEEP_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [activityRevision, appRuntime.activeAppId, session.phase]);
  useEffect(() => {
    const appTemporarilyCoveredByPowerConfirmation = session.phase === "powerOffConfirm" && session.previousPhase === "app";
    const runtimeMustReset = session.phase === "hero" || session.phase === "poweredOff" || session.phase === "booting" || session.phase === "shutdown";
    if (runtimeMustReset && !cameraCaptureResetActive.current) {
      cameraCaptureResetActive.current = true;
      cameraCaptureNamespace.current += 1;
      dispatchPhotos({ type: "RESET" });
    } else if (!runtimeMustReset) {
      cameraCaptureResetActive.current = false;
    }
    if (runtimeMustReset && appRuntime.phase !== "none") {
      dispatchAppRuntime({ type: "RESET" });
    }
    if (runtimeMustReset && cameraRuntime.cameraApp.phase !== "none") {
      dispatchCameraRuntime({ type: "RESET", owner: "cameraApp" });
    }
    if (runtimeMustReset && cameraRuntime.cameraPicker.phase !== "none") {
      dispatchCameraRuntime({ type: "RESET", owner: "cameraPicker" });
    }
    if (session.phase !== "app" && !appTemporarilyCoveredByPowerConfirmation && multitaskingBar !== "closed") {
      dispatchMultitaskingBar("RESET");
    }
    if (session.phase !== "app" && !appTemporarilyCoveredByPowerConfirmation && pendingAppHomePress.current !== null) {
      window.clearTimeout(pendingAppHomePress.current);
      pendingAppHomePress.current = null;
    }
  }, [appRuntime.phase, cameraRuntime.cameraApp.phase, cameraRuntime.cameraPicker.phase, multitaskingBar, session.phase, session.previousPhase]);

  const recordInteraction = () => setActivityRevision(revision => revision + 1);
  const launchSpringBoardApp = (appId: string) => {
    if (appRuntime.phase !== "none" && appRuntime.phase !== "suspended") return;
    const cameraOwner = cameraOwnerForApp(appId);
    if (cameraOwner) {
      dispatchCameraRuntime({
        type: cameraRuntime[cameraOwner].phase === "none" ? "LAUNCH" : "RESUME",
        owner: cameraOwner,
      });
    }
    dispatchAppRuntime({ type: "LAUNCH", appId });
    update({ phase: "app" });
  };
  const openLatestCameraPhoto = () => {
    const records = cameraRollRef.current.records;
    const latestPhoto = records[records.length - 1];
    if (!latestPhoto || appRuntime.activeAppId !== "camera") return;
    dispatchPhotos({ type: "OPEN_PHOTO", photoId: latestPhoto.id });
    dispatchCameraRuntime({ type: "SUSPEND", owner: "cameraApp" });
    dispatchAppRuntime({ type: "SUSPEND" });
    dispatchAppRuntime({ type: "LAUNCH", appId: "photos" });
    update({ phase: "app" });
  };
  const openLockNotificationTarget = (notification: ActiveLockNotification) => {
    dispatchLockNotification({ type: "CLEAR" });
    if (notification.target.type === "messagesConversation") {
      openMessagesConversation(true);
      return;
    }
    const targetAppId = notification.target.appId;
    const targetIsRetained = appRuntime.activeAppId === targetAppId
      || appRuntime.suspendedAppIds.includes(targetAppId);
    if (targetIsRetained) {
      const cameraOwner = cameraOwnerForApp(targetAppId);
      if (cameraOwner) dispatchCameraRuntime({ type: "RESUME", owner: cameraOwner });
      dispatchAppRuntime({ type: "RESUME", appId: targetAppId });
      update({ phase: "app" });
    } else {
      launchSpringBoardApp(targetAppId);
    }
    setUnlockReturnAppId(null);
  };
  const openMessagesConversation = (fromNotification = false) => {
    if (fromNotification) dispatchSMSNotification({ type: "BEGIN_VIEW" });
    dispatchMessages({ type: "OPEN_CONVERSATION" });

    if (appRuntime.activeAppId === "messages") {
      if (appRuntime.phase === "suspended") dispatchAppRuntime({ type: "RESUME", appId: "messages" });
      else if (appRuntime.phase === "none") dispatchAppRuntime({ type: "LAUNCH", appId: "messages" });
    } else {
      if (appRuntime.phase === "running" || appRuntime.phase === "launching" || appRuntime.phase === "resuming") {
        const cameraOwner = cameraOwnerForApp(appRuntime.activeAppId);
        if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
        dispatchAppRuntime({ type: "SUSPEND" });
      }
      dispatchAppRuntime({ type: "LAUNCH", appId: "messages" });
    }
    setUnlockReturnAppId(null);
    update({ phase: "app" });
  };
  const continueDeviceInteraction = (event: PointerEvent<HTMLElement>) => {
    if (event.buttons !== 0) recordInteraction();
  };

  const submitName = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    if (name) {
      const experienceSessionId = createExperienceSessionId();
      cameraCaptureNamespace.current += 1;
      activeExperienceSessionIdRef.current = experienceSessionId;
      clearRuntimeCameraRoll("loading");
      dispatchFacebook({ type: "RESET", displayName: name });
      dispatchTwitter({ type: "RESET", displayName: name });
      update({
        sessionIdentity: createSessionIdentity(name),
        experienceSessionId,
        phase: "poweredOff",
        shutdownReason: null,
        returnToHeroPending: false,
      });
    }
  };

  const beginPower = () => {
    if (session.returnToHeroPending || session.phase === "hero" || session.phase === "booting" || session.phase === "powerOffConfirm" || session.phase === "shutdown") return;
    powerStarted.current = performance.now();
    const tick = () => {
      if (powerStarted.current === null) return;
      const progress = Math.min(1, (performance.now() - powerStarted.current) / POWER_HOLD_MS);
      if (session.phase === "poweredOff") setPowerProgress(progress);
      if (progress === 1) {
        powerStarted.current = null;
        if (session.phase === "poweredOff") update({ phase: "booting" });
        else {
          const transition = longPowerTransition(session);
          if (transition) update(transition);
        }
        return;
      }
      powerFrame.current = requestAnimationFrame(tick);
    };
    powerFrame.current = requestAnimationFrame(tick);
  };

  const endPower = () => {
    if (powerStarted.current !== null && session.phase !== "poweredOff") {
      const transition = shortPowerTransition(session);
      if (transition) {
        if (transition.phase === "sleeping") {
          const returnAppId = session.phase === "app" ? appRuntime.activeAppId : null;
          setUnlockReturnAppId(returnAppId);
          if (returnAppId) {
            const cameraOwner = cameraOwnerForApp(returnAppId);
            if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
            dispatchAppRuntime({ type: "SUSPEND" });
          }
          dispatchMultitaskingBar("RESET");
          DeviceAudio.lock();
        }
        update(transition);
      }
    }
    powerStarted.current = null;
    if (powerFrame.current) cancelAnimationFrame(powerFrame.current);
    if (session.phase === "poweredOff") setPowerProgress(0);
  };
  const cancelPower = () => {
    powerStarted.current = null;
    if (powerFrame.current) cancelAnimationFrame(powerFrame.current);
    if (session.phase === "poweredOff") setPowerProgress(0);
  };

  const homeEnabled = session.phase === "locked" || session.phase === "springboard" || session.phase === "app" || session.phase === "sleeping";
  const displayIsLit = session.phase !== "sleeping" && session.phase !== "poweredOff" && session.phase !== "shutdown";
  const beginHomePress = (event: PointerEvent<HTMLButtonElement>) => {
    if (!homeEnabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    homePointer.current = event.pointerId;
    setHomePressed(true);
  };
  const cancelHomePress = () => {
    homePointer.current = null;
    setHomePressed(false);
  };
  const endHomePress = (event: PointerEvent<HTMLButtonElement>) => {
    if (homePointer.current !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    homePointer.current = null;
    setHomePressed(false);
    if (session.phase === "springboard" && (folderState === "open" || folderState === "opening")) {
      dispatchFolderEvent("CLOSE");
      return;
    }
    if (session.phase === "app" && multitaskingBar !== "closed") {
      dispatchMultitaskingBar("CLOSE");
      return;
    }
    if (session.phase === "app" && appRuntime.phase === "running") {
      if (pendingAppHomePress.current !== null) {
        window.clearTimeout(pendingAppHomePress.current);
        pendingAppHomePress.current = null;
        dispatchMultitaskingBar("OPEN");
        return;
      }
      pendingAppHomePress.current = window.setTimeout(() => {
        pendingAppHomePress.current = null;
        const cameraOwner = cameraOwnerForApp(appRuntime.activeAppId);
        if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
        dispatchAppRuntime({ type: "SUSPEND" });
        update({ phase: "springboard" });
      }, HOME_DOUBLE_PRESS_MS);
      return;
    }
    if (session.phase === "app" && (appRuntime.phase === "launching" || appRuntime.phase === "resuming")) {
      const cameraOwner = cameraOwnerForApp(appRuntime.activeAppId);
      if (cameraOwner) dispatchCameraRuntime({ type: "SUSPEND", owner: cameraOwner });
      dispatchAppRuntime({ type: "SUSPEND" });
      update({ phase: "springboard" });
      return;
    }
    const transition = homeButtonTransition(session);
    if (transition) update(transition);
  };

  useEffect(() => {
    if (!devAutoOpen || !devAppId || devAutoOpenConsumed.current || session.phase !== "springboard") return;
    devAutoOpenConsumed.current = true;
    launchSpringBoardApp(devAppId);
  }, [devAppId, devAutoOpen, session.phase]);

  if (session.phase === "hero") return <>
    <main className="hero"><form onSubmit={submitName}><label htmlFor="name">What was your name?</label><input id="name" name="name" autoFocus autoComplete="name" /><span>Press Enter</span></form></main>
    <AppDevAccess appId={devAppId} disabled onOpen={() => {}} />
  </>;

  return <SessionIdentityContext.Provider value={session.sessionIdentity}>
    {ambientWorldEnabled && <AmbientWorld
      cameraViewfinder={cameraPreviewCanvas}
      cameraLook={cameraRuntime.cameraApp.cameraLook}
      onCameraLookPointerOffsetClamped={setCameraLookPointerOffset}
      onCameraCaptureReady={setCameraCaptureReady}
    />}
    <main className={`stage${ambientWorldEnabled ? " has-ambient-world" : ""}`}>
      <section
      className={`device${displayIsLit ? " is-display-lit" : ""}`}
      aria-label="Black iPhone 4"
      onPointerDownCapture={recordInteraction}
      onPointerMoveCapture={continueDeviceInteraction}
      onPointerUpCapture={recordInteraction}
      onPointerCancelCapture={recordInteraction}
    >
      <div className="device-front-glass" aria-hidden="true" />
      <div className="device-screen-glow" aria-hidden="true" />
      <span className="device-antenna-seam is-top" aria-hidden="true" />
      <span className="device-antenna-seam is-lower-left" aria-hidden="true" />
      <span className="device-antenna-seam is-lower-right" aria-hidden="true" />
      <span className="device-mute-switch" aria-hidden="true" />
      <span className="device-volume-button is-up" aria-hidden="true" />
      <span className="device-volume-button is-down" aria-hidden="true" />
      <button className="power" aria-label="Power button" onPointerDown={beginPower} onPointerUp={endPower} onPointerCancel={cancelPower} onPointerLeave={cancelPower} />
      <div className="speaker" /><div className="camera" />
      <div className={`screen ${session.phase}`}>
        {(session.phase === "locked"
          || session.phase === "springboard"
          || (session.phase === "app"
            && !(appRuntime.activeAppId === "camera" && cameraRuntime.cameraApp.phase !== "none"))) && <div className="device-status-bar-layer">
          {session.phase === "locked"
            ? <LockScreenStatusPresentation model={lockScreenModel} />
            : <StatusBar state={statusBarState} />}
        </div>}
        {session.phase === "poweredOff" && (session.returnToHeroPending
          ? <div className="dead" />
          : <div className="off"><p>Press and hold the power button.</p><div className="hold"><i style={{ width: `${powerProgress * 100}%` }} /></div></div>)}
        {session.phase === "booting" && <div className="boot"><BootLogo /></div>}
        {session.phase === "locked" && <LockScreen
          model={lockScreenModel}
          activeLockNotification={activeLockNotification}
          onViewNotification={openLockNotificationTarget}
          onUnlock={() => {
            const canResume = unlockReturnAppId !== null
              && (appRuntime.activeAppId === unlockReturnAppId || appRuntime.suspendedAppIds.includes(unlockReturnAppId));
            if (canResume && unlockReturnAppId) {
              const cameraOwner = cameraOwnerForApp(unlockReturnAppId);
              if (cameraOwner) dispatchCameraRuntime({ type: "RESUME", owner: cameraOwner });
              dispatchAppRuntime({ type: "RESUME", appId: unlockReturnAppId });
            }
            DeviceAudio.unlock();
            update({
              phase: canResume ? "app" : "springboard",
              batteryCriticalRevealAtMs: null,
            });
            setUnlockReturnAppId(null);
          }}
        />}
        {session.phase === "springboard" && <SpringBoard
          currentPage={springBoardPage}
          onPageChange={setSpringBoardPage}
          folderState={folderState}
          dispatchFolderEvent={dispatchFolderEvent}
          activeFolderSlotIndex={activeFolderSlotIndex}
          onActiveFolderSlotChange={setActiveFolderSlotIndex}
          messagesBadgeCount={messagesUnreadIds.length}
          onLaunchApp={launchSpringBoardApp}
        />}
        {session.phase === "app" && <AppLaunchContainer
          runtime={appRuntime}
          dispatch={dispatchAppRuntime}
          onClosed={() => update({ phase: "springboard" })}
        >
          <IOS4KeyboardSystem
            suspended={multitaskingBar !== "closed" || cameraRuntime.cameraPicker.phase !== "none"}
            suspendReason={multitaskingBar !== "closed" ? "app-switch" : "navigation"}
          >
          {appRuntime.activeAppId === "camera" && cameraRuntime.cameraApp.phase !== "none" && <CameraContainer
            owner="cameraApp"
            session={cameraRuntime.cameraApp}
            previewCanvasRef={ambientWorldEnabled ? setCameraPreviewCanvas : undefined}
            onLookPointerOffsetChange={ambientWorldEnabled ? setCameraLookPointerOffset : undefined}
            onCapture={ambientWorldEnabled && cameraRoll.status === "ready" ? captureCameraPhoto : undefined}
            latestPhoto={cameraRoll.records[cameraRoll.records.length - 1] ?? null}
            onOpenLatestPhoto={openLatestCameraPhoto}
          />}
          {appRuntime.activeAppId === "photos" && <PhotosContainer
            state={photosState}
            dispatch={dispatchPhotos}
            cameraRoll={cameraRoll}
          />}
          {appRuntime.activeAppId === "messages" && <MobileSMSContainer
            state={messagesState}
            dispatch={dispatchMessages}
            currentElapsedMs={elapsed}
            cameraPickerActive={cameraRuntime.cameraPicker.phase !== "none"}
            onOpenCameraPicker={() => dispatchCameraRuntime({ type: "LAUNCH", owner: "cameraPicker" })}
            onScheduleMomReply={() => setSession(current => ({
              ...current,
              deviceEvents: scheduleDeviceEvent(current.deviceEvents, {
                id: "mom-reply-good-sleep-early",
                type: "momReply",
                dueElapsedMs: elapsedMs(current, Date.now()) + MOM_REPLY_DELAY_MS,
              }),
            }))}
            onScheduleMomLoveReply={() => setSession(current => ({
              ...current,
              deviceEvents: scheduleDeviceEvent(current.deviceEvents, {
                id: "mom-love-reply",
                type: "momLoveReply",
                dueElapsedMs: elapsedMs(current, Date.now()) + deterministicMomLoveReplyDelayMs(current.sessionIdentity.name),
                sourceApp: "messages",
                deliveryPolicy: "notification",
              }),
            }))}
            onScheduleDadLoveReply={() => setSession(current => ({
              ...current,
              deviceEvents: scheduleDeviceEvent(current.deviceEvents, {
                id: "dad-love-terminal-reply",
                type: "dadLoveReply",
                dueElapsedMs: DAD_LOVE_REPLY_DUE_ELAPSED_MS,
                sourceApp: "messages",
                deliveryPolicy: "notification",
              }),
            }))}
          />}
          {appRuntime.activeAppId === "messages" && cameraRuntime.cameraPicker.phase !== "none" && <CameraContainer
            owner="cameraPicker"
            session={cameraRuntime.cameraPicker}
            onCancel={() => {
              dispatchCameraRuntime({ type: "CANCEL", owner: "cameraPicker" });
            }}
          />}
          {appRuntime.activeAppId === "twitter" && <TwitterContainer
            state={twitterState}
            dispatch={dispatchTwitter}
            currentDeviceDateTime={deviceDateTime}
            currentDeviceTime={deviceStatusTime}
          />}
          {appRuntime.activeAppId === "facebook" && <FacebookContainer
            state={facebookState}
            dispatch={dispatchFacebookEvent}
            currentDeviceTime={deviceStatusTime}
            elapsedMs={elapsed}
          />}
          {appRuntime.activeAppId === "instagram" && <InstagramContainer
            state={instagramState}
            dispatch={dispatchInstagram}
            currentDeviceDateTime={deviceDateTime}
          />}
          {appRuntime.activeAppId === "flickr" && <FlickrContainer
            state={flickrState}
            dispatch={dispatchFlickr}
          />}
          {appRuntime.activeAppId === "tumblr" && <TumblrContainer
            state={tumblrState}
            dispatch={dispatchTumblr}
          />}
          {appRuntime.activeAppId === "foursquare" && <FoursquareContainer
            state={foursquareState}
            dispatch={dispatchFoursquare}
          />}
          </IOS4KeyboardSystem>
        </AppLaunchContainer>}
        {session.phase === "app" && <MultitaskingBar
          state={multitaskingBar}
          appRuntime={appRuntime}
          dispatch={dispatchMultitaskingBar}
          onSelectApp={appId => {
            dispatchMultitaskingBar("CLOSE");
            if (appRuntime.activeAppId !== appId || appRuntime.phase !== "running") {
              const cameraOwner = cameraOwnerForApp(appId);
              if (cameraOwner) dispatchCameraRuntime({ type: "RESUME", owner: cameraOwner });
              dispatchAppRuntime({ type: "RESUME", appId });
            }
          }}
        />}
        {session.phase === "sleeping" && <div className="screen-off-surface" aria-hidden="true" />}
        {session.phase === "powerOffConfirm" && <PowerOffConfirm onCancel={() => update({ phase: session.previousPhase ?? "locked", previousPhase: null })} onConfirm={() => update({ phase: "shutdown", shutdownReason: "manual" })} />}
        {session.phase === "shutdown" && <div className="screen-off-surface" aria-hidden="true" />}
        {session.phase === "lowBatteryWarning" && <img className="low-battery-screen" src={lowBatterySrc} alt="" aria-hidden="true" />}
        {(session.activeWarning === 20 || session.activeWarning === 10) && (session.phase === "springboard" || session.phase === "app") && <LowBatteryAlert
          level={session.activeWarning}
          onDismiss={() => setSession(current => {
            const warning = current.activeWarning;
            if (warning !== 20 && warning !== 10) return current;
            return {
              ...current,
              activeWarning: null,
              dismissedWarnings: current.dismissedWarnings.includes(warning)
                ? current.dismissedWarnings
                : [...current.dismissedWarnings, warning],
            };
          })}
        />}
        {smsNotification.status === "alert-visible" && session.phase !== "locked" && session.phase !== "sleeping" && <SMSAlertOverlay
          notificationState={smsNotification}
          onClose={() => dispatchSMSNotification({ type: "DISMISS" })}
          onView={() => openMessagesConversation(true)}
        />}
      </div>
      <button
        className={`home${homePressed ? " is-pressed" : ""}`}
        aria-label="Home button"
        aria-disabled={!homeEnabled}
        tabIndex={-1}
        onPointerDown={beginHomePress}
        onPointerUp={endHomePress}
        onPointerCancel={cancelHomePress}
        onPointerLeave={cancelHomePress}
        onKeyDown={event => event.preventDefault()}
        onKeyUp={event => event.preventDefault()}
      ><i /></button>
    </section>
      <aside><strong>SOCIAL MEDIA, 2010</strong><span>Z.tokyo</span></aside>
    </main>
    <AppDevAccess
      appId={devAppId}
      disabled={session.phase !== "springboard"}
      onOpen={() => devAppId && launchSpringBoardApp(devAppId)}
    />
  </SessionIdentityContext.Provider>;
}

function AppDevAccess({ appId, disabled, onOpen }: {
  appId: "twitter" | "facebook" | "instagram" | "foursquare" | "flickr" | "tumblr" | null;
  disabled: boolean;
  onOpen: () => void;
}) {
  if (!appId) return null;
  const appName = appId === "twitter" ? "Twitter"
    : appId === "facebook" ? "Facebook"
      : appId === "instagram" ? "Instagram"
        : appId === "foursquare" ? "Foursquare"
          : appId === "tumblr" ? "Tumblr"
            : "Flickr";
  return <aside className="app-dev-access" aria-label={`${appName} development access`}>
    <strong>DEV</strong>
    <button type="button" disabled={disabled} onClick={onOpen}>DEV · Open {appName}</button>
    {disabled && <span>Available on SpringBoard</span>}
  </aside>;
}

function LowBatteryAlert({ level, onDismiss }: { level: 20 | 10; onDismiss: () => void }) {
  return <div className="sms-system-alert-layer low-battery-alert-layer" role="presentation">
    <section className="sms-alert-sheet low-battery-alert" role="alertdialog" aria-modal="true" aria-labelledby="low-battery-alert-title" aria-describedby="low-battery-alert-message">
      <strong id="low-battery-alert-title" className="sms-alert-title">Low Battery</strong>
      <div className="sms-alert-content">
        <p id="low-battery-alert-message" className="sms-alert-body">{level}% of battery remaining</p>
      </div>
      <div className="sms-alert-actions low-battery-alert-actions">
        <button type="button" onClick={onDismiss}>Dismiss</button>
      </div>
    </section>
  </div>;
}

function BootLogo() {
  return <img className="boot-logo" src={bootLogoSrc} alt="" aria-hidden="true" />;
}

function PowerOffConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return <div className="modal-shade"><div className="battery-alert"><strong>Power Off</strong><p>Power-off UI artwork: HOLD.</p><button onClick={onConfirm}>Confirm power off</button><button onClick={onCancel}>Cancel</button></div></div>;
}
