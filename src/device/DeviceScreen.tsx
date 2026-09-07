import type { ComponentProps } from "react";
import type { DevicePresenter } from "./DevicePresentation";
import { useDeviceScreenDiagnostics } from "./useDeviceScreenDiagnostics";
import type { Session } from "../state/deviceMachine";
import type { CameraRuntimeState } from "../state/cameraRuntime";
import bootLogoSrc from "../assets/historical/ios4.1/applelogo-iphone3,1-8B117.png?inline";
import lowBatterySrc from "../assets/device/low-battery-iphone4.png";
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
import { AppNotificationAlert } from "./AppNotificationAlert";
import { SpringBoard } from "./SpringBoard";
import { StatusBar } from "./StatusBar";
import { TwitterContainer } from "./TwitterContainer";
import { IOS4KeyboardSystem } from "./IOS4KeyboardSystem";

type PhotosBrowseProps = Exclude<ComponentProps<typeof PhotosContainer>, { mode: "picker" }>;

// Presentation only: App retains the single runtime and all controller side effects.
export type DeviceScreenProps = {
  presentation: { presenter: DevicePresenter; experienceSessionId: string | null };
  display: {
    session: Pick<Session, "phase" | "returnToHeroPending" | "activeWarning">;
    powerProgress: number;
    lockScreenModel: ComponentProps<typeof LockScreen>["model"];
    statusBarState: ComponentProps<typeof StatusBar>["state"];
    elapsed: number;
    deviceDateTime: Date;
    deviceStatusTime: string;
  };
  navigation: {
    appRuntime: ComponentProps<typeof AppLaunchContainer>["runtime"];
    dispatchAppRuntime: ComponentProps<typeof AppLaunchContainer>["dispatch"];
    springBoardPage: ComponentProps<typeof SpringBoard>["currentPage"];
    setSpringBoardPage: ComponentProps<typeof SpringBoard>["onPageChange"];
    folderState: ComponentProps<typeof SpringBoard>["folderState"];
    dispatchFolderEvent: ComponentProps<typeof SpringBoard>["dispatchFolderEvent"];
    activeFolderSlotIndex: ComponentProps<typeof SpringBoard>["activeFolderSlotIndex"];
    setActiveFolderSlotIndex: ComponentProps<typeof SpringBoard>["onActiveFolderSlotChange"];
    messagesBadgeCount: number;
    notificationBadgeCounts: ComponentProps<typeof SpringBoard>["notificationBadgeCounts"];
    launchSpringBoardApp: ComponentProps<typeof SpringBoard>["onLaunchApp"];
    multitaskingBar: ComponentProps<typeof MultitaskingBar>["state"];
    dispatchMultitaskingBar: ComponentProps<typeof MultitaskingBar>["dispatch"];
  };
  apps: {
    photosState: PhotosBrowseProps["state"];
    dispatchPhotos: PhotosBrowseProps["dispatch"];
    messagesState: ComponentProps<typeof MobileSMSContainer>["state"];
    dispatchMessages: ComponentProps<typeof MobileSMSContainer>["dispatch"];
    twitterState: ComponentProps<typeof TwitterContainer>["state"];
    dispatchTwitter: ComponentProps<typeof TwitterContainer>["dispatch"];
    publicTwitterState: ComponentProps<typeof TwitterContainer>["publicState"];
    dispatchPublicTwitterEvent: ComponentProps<typeof TwitterContainer>["dispatchPublic"];
    facebookState: ComponentProps<typeof FacebookContainer>["state"];
    dispatchFacebookEvent: ComponentProps<typeof FacebookContainer>["dispatch"];
    instagramState: ComponentProps<typeof InstagramContainer>["state"];
    dispatchInstagram: ComponentProps<typeof InstagramContainer>["dispatch"];
    flickrState: ComponentProps<typeof FlickrContainer>["state"];
    dispatchFlickr: ComponentProps<typeof FlickrContainer>["dispatch"];
    tumblrState: ComponentProps<typeof TumblrContainer>["state"];
    dispatchTumblr: ComponentProps<typeof TumblrContainer>["dispatch"];
    foursquareState: ComponentProps<typeof FoursquareContainer>["state"];
    dispatchFoursquare: ComponentProps<typeof FoursquareContainer>["dispatch"];
  };
  camera: {
    cameraRuntime: CameraRuntimeState;
    cameraRoll: ComponentProps<typeof PhotosContainer>["cameraRoll"];
    setCameraPreviewCanvas: ComponentProps<typeof CameraContainer>["previewCanvasRef"];
    setCameraLookPointerOffset: ComponentProps<typeof CameraContainer>["onLookPointerOffsetChange"];
    captureCameraPhoto: ComponentProps<typeof CameraContainer>["onCapture"];
    openLatestCameraPhoto: ComponentProps<typeof CameraContainer>["onOpenLatestPhoto"];
  };
  overlays: {
    activeLockNotification: ComponentProps<typeof LockScreen>["activeLockNotification"];
    smsNotification: ComponentProps<typeof SMSAlertOverlay>["notificationState"];
    appNotification: ComponentProps<typeof AppNotificationAlert>["notification"] | null;
  };
  actions: {
    openLockNotificationTarget: ComponentProps<typeof LockScreen>["onViewNotification"];
    completeScreenUnlock: ComponentProps<typeof LockScreen>["onUnlock"];
    completeScreenAppClose: ComponentProps<typeof AppLaunchContainer>["onClosed"];
    openScreenCameraPicker: ComponentProps<typeof MobileSMSContainer>["onOpenCameraPicker"];
    scheduleScreenMomReply: ComponentProps<typeof MobileSMSContainer>["onScheduleMomReply"];
    scheduleScreenMomLoveReply: ComponentProps<typeof MobileSMSContainer>["onScheduleMomLoveReply"];
    scheduleScreenDadLoveReply: ComponentProps<typeof MobileSMSContainer>["onScheduleDadLoveReply"];
    cancelScreenCameraPicker: ComponentProps<typeof CameraContainer>["onCancel"];
    recordScreenLocalTweet: ComponentProps<typeof TwitterContainer>["onLocalTweetSubmitted"];
    selectScreenMultitaskingApp: ComponentProps<typeof MultitaskingBar>["onSelectApp"];
    cancelScreenPowerOff: () => void;
    confirmScreenPowerOff: () => void;
    dismissScreenBatteryWarning: () => void;
    dismissScreenSMSAlert: ComponentProps<typeof SMSAlertOverlay>["onClose"];
    viewScreenSMSAlert: ComponentProps<typeof SMSAlertOverlay>["onView"];
    viewScreenAppAlert: () => void;
    setNotificationKeyboardVisible: (visible: boolean) => void;
  };
};

export function DeviceScreen({ presentation, display, navigation, apps, camera, overlays, actions }: DeviceScreenProps) {
  useDeviceScreenDiagnostics(presentation.presenter, presentation.experienceSessionId);
  const {
    session,
    powerProgress,
    lockScreenModel,
    statusBarState,
    elapsed,
    deviceDateTime,
    deviceStatusTime,
  } = display;
  const {
    appRuntime,
    dispatchAppRuntime,
    springBoardPage,
    setSpringBoardPage,
    folderState,
    dispatchFolderEvent,
    activeFolderSlotIndex,
    setActiveFolderSlotIndex,
    messagesBadgeCount,
    notificationBadgeCounts,
    launchSpringBoardApp,
    multitaskingBar,
    dispatchMultitaskingBar,
  } = navigation;
  const {
    photosState,
    dispatchPhotos,
    messagesState,
    dispatchMessages,
    twitterState,
    dispatchTwitter,
    publicTwitterState,
    dispatchPublicTwitterEvent,
    facebookState,
    dispatchFacebookEvent,
    instagramState,
    dispatchInstagram,
    flickrState,
    dispatchFlickr,
    tumblrState,
    dispatchTumblr,
    foursquareState,
    dispatchFoursquare,
  } = apps;
  const {
    cameraRuntime,
    cameraRoll,
    setCameraPreviewCanvas,
    setCameraLookPointerOffset,
    captureCameraPhoto,
    openLatestCameraPhoto,
  } = camera;
  const {
    activeLockNotification,
    smsNotification,
    appNotification,
  } = overlays;
  const {
    openLockNotificationTarget,
    completeScreenUnlock,
    completeScreenAppClose,
    openScreenCameraPicker,
    scheduleScreenMomReply,
    scheduleScreenMomLoveReply,
    scheduleScreenDadLoveReply,
    cancelScreenCameraPicker,
    recordScreenLocalTweet,
    selectScreenMultitaskingApp,
    cancelScreenPowerOff,
    confirmScreenPowerOff,
    dismissScreenBatteryWarning,
    dismissScreenSMSAlert,
    viewScreenSMSAlert,
    viewScreenAppAlert,
    setNotificationKeyboardVisible,
  } = actions;

  return <div className={`screen ${session.phase}`}>
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
      onUnlock={completeScreenUnlock}
    />}
    {session.phase === "springboard" && <SpringBoard
      currentPage={springBoardPage}
      onPageChange={setSpringBoardPage}
      folderState={folderState}
      dispatchFolderEvent={dispatchFolderEvent}
      activeFolderSlotIndex={activeFolderSlotIndex}
      onActiveFolderSlotChange={setActiveFolderSlotIndex}
      messagesBadgeCount={messagesBadgeCount}
      notificationBadgeCounts={notificationBadgeCounts}
      onLaunchApp={launchSpringBoardApp}
    />}
    {session.phase === "app" && <AppLaunchContainer
      runtime={appRuntime}
      dispatch={dispatchAppRuntime}
      onClosed={completeScreenAppClose}
    >
      <IOS4KeyboardSystem
        onVisibilityChange={setNotificationKeyboardVisible}
        suspended={multitaskingBar !== "closed" || cameraRuntime.cameraPicker.phase !== "none"}
        suspendReason={multitaskingBar !== "closed" ? "app-switch" : "navigation"}
      >
      {appRuntime.activeAppId === "camera" && cameraRuntime.cameraApp.phase !== "none" && <CameraContainer
        owner="cameraApp"
        session={cameraRuntime.cameraApp}
        previewCanvasRef={setCameraPreviewCanvas}
        onLookPointerOffsetChange={setCameraLookPointerOffset}
        onCapture={cameraRoll.status === "ready" ? captureCameraPhoto : undefined}
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
        onOpenCameraPicker={openScreenCameraPicker}
        onScheduleMomReply={scheduleScreenMomReply}
        onScheduleMomLoveReply={scheduleScreenMomLoveReply}
        onScheduleDadLoveReply={scheduleScreenDadLoveReply}
      />}
      {appRuntime.activeAppId === "messages" && cameraRuntime.cameraPicker.phase !== "none" && <CameraContainer
        owner="cameraPicker"
        session={cameraRuntime.cameraPicker}
        onCancel={cancelScreenCameraPicker}
      />}
      {appRuntime.activeAppId === "twitter" && <TwitterContainer
        state={twitterState}
        dispatch={dispatchTwitter}
        publicState={publicTwitterState}
        dispatchPublic={dispatchPublicTwitterEvent}
        currentElapsedMs={elapsed}
        onLocalTweetSubmitted={recordScreenLocalTweet}
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
        cameraRoll={cameraRoll}
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
        currentDeviceDateTime={deviceDateTime}
      />}
      </IOS4KeyboardSystem>
    </AppLaunchContainer>}
    {session.phase === "app" && <MultitaskingBar
      state={multitaskingBar}
      appRuntime={appRuntime}
      dispatch={dispatchMultitaskingBar}
      onSelectApp={selectScreenMultitaskingApp}
    />}
    {session.phase === "sleeping" && <div className="screen-off-surface" aria-hidden="true" />}
    {session.phase === "powerOffConfirm" && <PowerOffConfirm onCancel={cancelScreenPowerOff} onConfirm={confirmScreenPowerOff} />}
    {session.phase === "shutdown" && <div className="screen-off-surface" aria-hidden="true" />}
    {session.phase === "lowBatteryWarning" && <img className="low-battery-screen" src={lowBatterySrc} alt="" aria-hidden="true" />}
    {(session.activeWarning === 20 || session.activeWarning === 10) && (session.phase === "springboard" || session.phase === "app") && <LowBatteryAlert
      level={session.activeWarning}
      onDismiss={dismissScreenBatteryWarning}
    />}
    {smsNotification.status === "alert-visible" && session.phase !== "locked" && session.phase !== "sleeping" && <SMSAlertOverlay
      notificationState={smsNotification}
      onClose={dismissScreenSMSAlert}
      onView={viewScreenSMSAlert}
    />}
    {appNotification && <AppNotificationAlert notification={appNotification} onClose={dismissScreenSMSAlert} onView={viewScreenAppAlert} />}
  </div>;
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
