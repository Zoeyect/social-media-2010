import { Dispatch, PointerEvent as ReactPointerEvent, useRef, useState } from "react";
import appStoreIconSrc from "../assets/historical/ios4.1/springboard/apps/AppStore@2x.browser.png";
import calculatorIconSrc from "../assets/historical/ios4.1/springboard/apps/Calculator@2x.browser.png";
import calendarIconSrc from "../assets/historical/ios4.1/springboard/apps/Calendar@2x.browser.png";
import cameraIconSrc from "../assets/historical/ios4.1/springboard/apps/Camera@2x.browser.png";
import clockIconSrc from "../assets/historical/ios4.1/springboard/apps/Clock@2x.browser.png";
import compassIconSrc from "../assets/historical/ios4.1/springboard/apps/Compass@2x.browser.png";
import gameCenterIconSrc from "../assets/historical/ios4.1/springboard/apps/GameCenter@2x.browser.png";
import mapsIconSrc from "../assets/historical/ios4.1/springboard/apps/Maps@2x.browser.png";
import messagesIconSrc from "../assets/historical/ios4.1/springboard/apps/Messages@2x.browser.png";
import notesIconSrc from "../assets/historical/ios4.1/springboard/apps/Notes@2x.browser.png";
import photosIconSrc from "../assets/historical/ios4.1/springboard/apps/Photos@2x.browser.png";
import safariIconSrc from "../assets/historical/ios4.1/springboard/apps/Safari@2x.browser.png";
import settingsIconSrc from "../assets/historical/ios4.1/springboard/apps/Settings@2x.browser.png";
import stocksIconSrc from "../assets/historical/ios4.1/springboard/apps/Stocks@2x.browser.png";
import voiceMemosIconSrc from "../assets/historical/ios4.1/springboard/apps/VoiceMemos@2x.browser.png";
import weatherIconSrc from "../assets/historical/ios4.1/springboard/apps/Weather@2x.browser.png";
import youtubeIconSrc from "../assets/historical/ios4.1/springboard/apps/YouTube@2x.browser.png";
import iTunesIconSrc from "../assets/historical/ios4.1/springboard/apps/iTunes@2x.browser.png";
import dockSrc from "../assets/historical/ios4.1/springboard/system/SBDockBG@2x.browser.png";
import pageIndicatorSrc from "../assets/historical/ios4.1/springboard/system/UIPageIndicator.png";
import pageIndicatorCurrentSrc from "../assets/historical/ios4.1/springboard/system/UIPageIndicatorCurrent.png";
import searchIndicatorSrc from "../assets/historical/ios4.1/springboard/system/SBSearchPageIndicator@2x.browser.png";
import searchIndicatorCurrentSrc from "../assets/historical/ios4.1/springboard/system/SBSearchPageIndicatorCurrent@2x.browser.png";
import badgeBackgroundSrc from "../assets/historical/ios4.1/springboard/system/SBBadgeBG@2x.browser.png";
import badgeMaskSrc from "../assets/historical/ios4.1/springboard/system/SBBadgeBGMask@2x.browser.png";
import folderIconSrc from "../assets/historical/ios4.1/springboard/folder/FolderIconBG@2x.browser.png";
import folderLinenSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderSwitcherBG@2x.browser.png";
import folderShadowBottomSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderShadowBottom@2x.browser.png";
import folderShadowBottomNotchSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderShadowBottomNotch@2x.browser.png";
import folderShadowTopSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderShadowTop@2x.browser.png";
import folderShadowTopNotchSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderShadowTopNotch@2x.browser.png";
import { SOCIAL_FOLDER_APPS } from "../data/socialFolderApps";
import { FolderEvent, FolderState } from "../state/folderState";

type SpringBoardProps = {
  currentPage: 0 | 1;
  onPageChange: (page: 0 | 1) => void;
  folderState: FolderState;
  dispatchFolderEvent: Dispatch<FolderEvent>;
  onLaunchApp: (appId: string) => void;
  messagesBadgeCount: number;
};

type SwipeStart = {
  pointerId: number;
  x: number;
  y: number;
  axis: "pending" | "horizontal";
};

const PAGE_WIDTH = 320;
const SWIPE_THRESHOLD = 48;
const AXIS_LOCK_THRESHOLD = 6;

type SocialAppId = (typeof SOCIAL_FOLDER_APPS)[number]["id"];
type FolderId = "social" | "utilities";
type FolderApp = { name: string; iconSrc?: string; socialAppId?: SocialAppId; launchId?: string };
type SpringBoardApp = {
  name: string;
  iconSrc?: string;
  kind?: "folder";
  folderId?: FolderId;
  folderApps?: readonly FolderApp[];
  calendarDay?: string;
};

const UTILITIES_APPS = [
  { name: "Clock", iconSrc: clockIconSrc },
  { name: "Calculator", iconSrc: calculatorIconSrc },
  { name: "Compass", iconSrc: compassIconSrc },
  { name: "Voice Memos", iconSrc: voiceMemosIconSrc },
] as const;
const SOCIAL_APPS = SOCIAL_FOLDER_APPS.map(app => ({ name: app.name, socialAppId: app.id, launchId: app.id }));

const PAGE_ONE_APPS: readonly (SpringBoardApp | undefined)[] = [
  { name: "Calendar", iconSrc: calendarIconSrc, calendarDay: "20" },
  { name: "Photos", iconSrc: photosIconSrc },
  { name: "Stocks", iconSrc: stocksIconSrc },
  { name: "Utilities", iconSrc: folderIconSrc, kind: "folder", folderId: "utilities", folderApps: UTILITIES_APPS },
  { name: "Maps", iconSrc: mapsIconSrc },
  { name: "Weather", iconSrc: weatherIconSrc },
  { name: "Notes", iconSrc: notesIconSrc },
  { name: "iTunes", iconSrc: iTunesIconSrc },
  { name: "App Store", iconSrc: appStoreIconSrc },
  { name: "Game Center", iconSrc: gameCenterIconSrc },
  { name: "Settings", iconSrc: settingsIconSrc },
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
] as const;
const PAGE_TWO_APPS: readonly (SpringBoardApp | undefined)[] = [
  { name: "Social", iconSrc: folderIconSrc, kind: "folder", folderId: "social", folderApps: SOCIAL_APPS },
  ...Array.from({ length: 15 }, () => undefined),
] as const;
const DOCK_APPS = [
  { name: "Messages", iconSrc: messagesIconSrc },
  { name: "Safari", iconSrc: safariIconSrc },
  { name: "Camera", iconSrc: cameraIconSrc },
  { name: "YouTube", iconSrc: youtubeIconSrc },
] as const;

export function SpringBoard({ currentPage, onPageChange, folderState, dispatchFolderEvent, onLaunchApp, messagesBadgeCount }: SpringBoardProps) {
  const swipeStart = useRef<SwipeStart | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState<FolderId>("social");

  const openFolder = (folderId: FolderId) => {
    if (folderState !== "closed") return;
    setActiveFolderId(folderId);
    dispatchFolderEvent("OPEN");
  };

  const beginSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    swipeStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, axis: "pending" };
    setDragOffset(0);
    setIsDragging(false);
  };

  const moveSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (start.axis === "pending") {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < AXIS_LOCK_THRESHOLD) return;
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        swipeStart.current = null;
        setDragOffset(0);
        setIsDragging(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }
      start.axis = "horizontal";
      setIsDragging(true);
    }

    event.preventDefault();
    const boundedDelta = currentPage === 0 ? Math.min(0, deltaX) : Math.max(0, deltaX);
    setDragOffset(boundedDelta);
  };

  const finishSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - start.x;
    if (start.axis === "horizontal" && Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      onPageChange(deltaX < 0 ? 1 : 0);
    }
    swipeStart.current = null;
    setDragOffset(0);
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const cancelSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeStart.current?.pointerId !== event.pointerId) return;
    swipeStart.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  return <div className="springboard">
    <div
      className="springboard-pages"
      onPointerDown={beginSwipe}
      onPointerMove={moveSwipe}
      onPointerUp={finishSwipe}
      onPointerCancel={cancelSwipe}
    >
      <div
        className={`springboard-pages-track${isDragging ? " is-dragging" : ""}`}
        style={{ transform: `translateX(${-currentPage * PAGE_WIDTH + dragOffset}px)` }}
      >
        <SpringBoardPage apps={PAGE_ONE_APPS} pageNumber={1} onAppActivate={index => {
          const app = PAGE_ONE_APPS[index];
          if (app?.folderId) openFolder(app.folderId);
        }} />
        <SpringBoardPage apps={PAGE_TWO_APPS} pageNumber={2} onAppActivate={index => {
          const app = PAGE_TWO_APPS[index];
          if (app?.folderId) openFolder(app.folderId);
        }} />
      </div>
    </div>
    <SpringBoardPageIndicator currentPage={currentPage} />
    <div className="springboard-dock">
      <img className="springboard-dock-artwork" src={dockSrc} alt="" aria-hidden="true" />
      {DOCK_APPS.map(app => <SpringBoardIcon
        key={app.name}
        {...app}
        dock
        badgeCount={app.name === "Messages" ? messagesBadgeCount : 0}
        onActivate={app.name === "Messages"
          ? () => onLaunchApp("messages")
          : app.name === "Camera"
            ? () => onLaunchApp("camera")
            : undefined}
      />)}
    </div>
    <SpringBoardFolder folderId={activeFolderId} state={folderState} dispatch={dispatchFolderEvent} onLaunchApp={onLaunchApp} />
  </div>;
}

function SpringBoardFolder({ folderId, state, dispatch, onLaunchApp }: {
  folderId: FolderId;
  state: FolderState;
  dispatch: Dispatch<FolderEvent>;
  onLaunchApp: (appId: string) => void;
}) {
  if (state === "closed") return null;
  const apps: readonly FolderApp[] = folderId === "social" ? SOCIAL_APPS : UTILITIES_APPS;
  const rows = folderId === "social" ? 2 : 1;
  const anchorX = folderId === "social" ? 45.5 : 273.5;
  const panelHeight = 125 + (rows - 1) * 85;

  return <div
    className={`springboard-folder-overlay is-${state}`}
    aria-hidden={state === "closing"}
    onPointerDown={event => {
      if (state === "open" && event.target === event.currentTarget) dispatch("CLOSE");
    }}
  >
    <div
      className="springboard-folder-panel"
      role="group"
      aria-label={`${folderId === "social" ? "Social" : "Utilities"} folder`}
      style={{ height: panelHeight, transformOrigin: `${anchorX}px 0` }}
      onPointerDown={event => event.stopPropagation()}
      onAnimationEnd={event => {
        if (event.target === event.currentTarget) dispatch("ANIMATION_COMPLETE");
      }}
    >
      <img className="springboard-folder-linen" src={folderLinenSrc} alt="" aria-hidden="true" />
      <span
        className="springboard-folder-shadow is-top"
        style={{ backgroundImage: `url(${folderShadowTopSrc})` }}
        aria-hidden="true"
      />
      <span
        className="springboard-folder-shadow is-bottom"
        style={{ backgroundImage: `url(${folderShadowBottomSrc})` }}
        aria-hidden="true"
      />
      <img className="springboard-folder-notch is-top" src={folderShadowTopNotchSrc} alt="" aria-hidden="true" style={{ left: anchorX - 12 }} />
      <img className="springboard-folder-notch is-bottom" src={folderShadowBottomNotchSrc} alt="" aria-hidden="true" />
      <div className="springboard-folder-title-layer">{folderId === "social" ? "Social" : "Utilities"}</div>
      <div className={`springboard-folder-grid is-${rows}-row`}>
        {apps.map(app => <SpringBoardIcon
          key={app.name}
          name={app.name}
          iconSrc={app.iconSrc}
          socialAppId={app.socialAppId}
          onActivate={app.launchId ? () => onLaunchApp(app.launchId!) : undefined}
        />)}
      </div>
    </div>
  </div>;
}

function SpringBoardPage({ apps, pageNumber, onAppActivate, badgeCounts }: {
  apps: readonly (SpringBoardApp | undefined)[];
  pageNumber: number;
  onAppActivate?: (index: number) => void;
  badgeCounts?: Partial<Record<number, number>>;
}) {
  return <div className="springboard-page" aria-label={`Home screen page ${pageNumber}`}>
    <div className="springboard-icon-grid">
      {apps.map((app, index) => <SpringBoardIcon
        key={app?.name ?? `empty-${index}`}
        {...app}
        badgeCount={badgeCounts?.[index] ?? 0}
        onActivate={app && onAppActivate ? () => onAppActivate(index) : undefined}
      />)}
    </div>
  </div>;
}

function SpringBoardIcon({ name, iconSrc, kind, folderApps, socialAppId, calendarDay, dock = false, onActivate, badgeCount = 0 }: {
  name?: string;
  iconSrc?: string;
  kind?: "folder";
  folderApps?: readonly FolderApp[];
  socialAppId?: SocialAppId;
  calendarDay?: string;
  dock?: boolean;
  onActivate?: () => void;
  badgeCount?: number;
}) {
  const content = <>
    {kind === "folder" && iconSrc
      ? <SpringBoardFolderIcon iconSrc={iconSrc} miniatures={folderApps ?? []} />
      : socialAppId
        ? <ReconstructedSocialIcon appId={socialAppId} />
        : iconSrc && <img className="springboard-system-icon" src={iconSrc} alt={name ?? ""} />}
    {calendarDay && <span className="springboard-calendar-date" aria-hidden="true"><small>Wednesday</small><b>{calendarDay}</b></span>}
    {(iconSrc || socialAppId) && name && <span className="springboard-icon-label">{name}</span>}
    {!!badgeCount && <SpringBoardBadge count={badgeCount} />}
  </>;

  if (onActivate) return <button
    className={`${dock ? "springboard-dock-slot" : "springboard-icon-slot"} springboard-icon-button`}
    data-app-name={name}
    onPointerDown={event => event.stopPropagation()}
    onClick={onActivate}
  >{content}</button>;

  return <span className={dock ? "springboard-dock-slot" : "springboard-icon-slot"} data-app-name={name}>{content}</span>;
}

function SpringBoardFolderIcon({ iconSrc, miniatures }: { iconSrc: string; miniatures: readonly FolderApp[] }) {
  return <span className="springboard-folder-icon" aria-hidden="true">
    <img className="springboard-system-icon is-folder" src={iconSrc} alt="" />
    <span className="springboard-folder-mini-grid">
      {miniatures.slice(0, 9).map(app => app.socialAppId
        ? <ReconstructedSocialIcon key={app.name} appId={app.socialAppId} miniature />
        : app.iconSrc && <img key={app.name} src={app.iconSrc} alt="" />)}
    </span>
  </span>;
}

function ReconstructedSocialIcon({ appId, miniature = false }: { appId: SocialAppId; miniature?: boolean }) {
  const label = appId === "facebook" ? "f"
    : appId === "twitter" ? "t"
      : appId === "foursquare" ? "4"
        : appId === "tumblr" ? "t"
          : appId === "flickr" ? "••"
            : "◉";
  return <span
    className={`springboard-social-icon is-${appId}${miniature ? " is-miniature" : ""}`}
    data-provenance="RECONSTRUCTED"
    aria-hidden="true"
  >{label}</span>;
}

function SpringBoardPageIndicator({ currentPage }: { currentPage: 0 | 1 }) {
  const spotlightCurrent = false;
  const pageCount = 2;

  return <div className="springboard-page-indicator" aria-label={`Home screen page ${currentPage + 1} of 2`}>
    <img
      className="springboard-search-indicator"
      src={spotlightCurrent ? searchIndicatorCurrentSrc : searchIndicatorSrc}
      alt=""
      aria-hidden="true"
    />
    {Array.from({ length: pageCount }, (_, page) => <img
      className="springboard-page-dot"
      src={page === currentPage ? pageIndicatorCurrentSrc : pageIndicatorSrc}
      alt=""
      aria-hidden="true"
      key={page}
    />)}
  </div>;
}

export function SpringBoardBadge({ count }: { count: number }) {
  return <span className="springboard-badge" aria-label={`${count} unread messages`}>
    <span
      className="springboard-badge-artwork"
      style={{ backgroundImage: `url(${badgeBackgroundSrc})`, maskImage: `url(${badgeMaskSrc})`, WebkitMaskImage: `url(${badgeMaskSrc})` }}
    />
    <b>{count}</b>
  </span>;
}
