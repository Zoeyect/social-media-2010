import { Dispatch, PointerEvent as ReactPointerEvent, ReactNode, useRef, useState } from "react";
import dockSrc from "../assets/historical/ios4.1/springboard/system/SBDockBG@2x.png";
import cameraIconSrc from "../assets/historical/ios4.1/springboard/apps/Camera@2x.png";
import messagesIconSrc from "../assets/historical/ios4.1/springboard/apps/Messages@2x.png";
import safariIconSrc from "../assets/historical/ios4.1/springboard/apps/Safari@2x.png";
import youtubeIconSrc from "../assets/historical/ios4.1/springboard/apps/YouTube@2x.png";
import pageIndicatorSrc from "../assets/historical/ios4.1/springboard/system/UIPageIndicator.png";
import pageIndicatorCurrentSrc from "../assets/historical/ios4.1/springboard/system/UIPageIndicatorCurrent.png";
import searchIndicatorSrc from "../assets/historical/ios4.1/springboard/system/SBSearchPageIndicator@2x.png";
import searchIndicatorCurrentSrc from "../assets/historical/ios4.1/springboard/system/SBSearchPageIndicatorCurrent@2x.png";
import badgeBackgroundSrc from "../assets/historical/ios4.1/springboard/system/SBBadgeBG@2x.png";
import badgeMaskSrc from "../assets/historical/ios4.1/springboard/system/SBBadgeBGMask@2x.png";
import folderIconSrc from "../assets/historical/ios4.1/springboard/folder/FolderIconBG@2x.png";
import folderLinenSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderSwitcherBG@2x.png";
import folderShadowBottomSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderShadowBottom@2x.png";
import folderShadowBottomNotchSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderShadowBottomNotch@2x.png";
import folderShadowTopSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderShadowTop@2x.png";
import folderShadowTopNotchSrc from "../assets/historical/ios4.1/springboard/folder/chrome/FolderShadowTopNotch@2x.png";
import { SOCIAL_FOLDER_SLOTS } from "../data/socialFolderApps";
import { FolderEvent, FolderState } from "../state/folderState";

type SpringBoardProps = {
  statusBar: ReactNode;
  currentPage: 0 | 1;
  onPageChange: (page: 0 | 1) => void;
  folderState: FolderState;
  dispatchFolderEvent: Dispatch<FolderEvent>;
  onLaunchApp: (appId: string) => void;
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

const PAGE_ONE_APPS = [
  { name: "Messages", iconSrc: messagesIconSrc },
  undefined,
  undefined,
  { name: "Camera", iconSrc: cameraIconSrc },
  { name: "YouTube", iconSrc: youtubeIconSrc },
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  { name: "Safari", iconSrc: safariIconSrc },
  undefined,
  undefined,
  undefined,
] as const;
const PAGE_TWO_APPS = [
  { name: "Social", iconSrc: folderIconSrc, kind: "folder" as const },
  ...Array.from({ length: 15 }, () => undefined),
] as const;
const DOCK_APPS = [
  { name: "Messages", iconSrc: messagesIconSrc },
  { name: "Safari", iconSrc: safariIconSrc },
  { name: "Camera", iconSrc: cameraIconSrc },
  { name: "YouTube", iconSrc: youtubeIconSrc },
] as const;

export function SpringBoard({ statusBar, currentPage, onPageChange, folderState, dispatchFolderEvent, onLaunchApp }: SpringBoardProps) {
  const swipeStart = useRef<SwipeStart | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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
    {statusBar}
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
        <SpringBoardPage apps={PAGE_ONE_APPS} pageNumber={1} />
        <SpringBoardPage apps={PAGE_TWO_APPS} pageNumber={2} onAppActivate={index => {
          if (index === 0 && folderState === "closed") dispatchFolderEvent("OPEN");
        }} />
      </div>
    </div>
    <SpringBoardPageIndicator currentPage={currentPage} />
    <div className="springboard-dock">
      <img className="springboard-dock-artwork" src={dockSrc} alt="" aria-hidden="true" />
      {DOCK_APPS.map(app => <SpringBoardIcon key={app.name} {...app} dock />)}
    </div>
    <SpringBoardFolder state={folderState} dispatch={dispatchFolderEvent} onLaunchApp={onLaunchApp} />
  </div>;
}

function SpringBoardFolder({ state, dispatch, onLaunchApp }: {
  state: FolderState;
  dispatch: Dispatch<FolderEvent>;
  onLaunchApp: (appId: string) => void;
}) {
  if (state === "closed") return null;

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
      aria-label="Folder"
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
      <img className="springboard-folder-notch is-top" src={folderShadowTopNotchSrc} alt="" aria-hidden="true" />
      <img className="springboard-folder-notch is-bottom" src={folderShadowBottomNotchSrc} alt="" aria-hidden="true" />
      <div className="springboard-folder-title-layer" aria-hidden="true" />
      <div className="springboard-folder-grid">
        {SOCIAL_FOLDER_SLOTS.map((app, index) => app?.iconStatus === "READY" && app.available && app.iconSrc
          ? <SpringBoardIcon key={app.id} name={app.name} iconSrc={app.iconSrc} onActivate={() => onLaunchApp(app.id)} />
          : <span className="springboard-folder-empty-slot" key={`empty-${index}`} />)}
      </div>
    </div>
  </div>;
}

function SpringBoardPage({ apps, pageNumber, onAppActivate }: {
  apps: readonly ({ name: string; iconSrc: string; kind?: "folder" } | undefined)[];
  pageNumber: number;
  onAppActivate?: (index: number) => void;
}) {
  return <div className="springboard-page" aria-label={`Home screen page ${pageNumber}`}>
    <div className="springboard-icon-grid">
      {apps.map((app, index) => <SpringBoardIcon
        key={app?.name ?? `empty-${index}`}
        {...app}
        onActivate={app && onAppActivate ? () => onAppActivate(index) : undefined}
      />)}
    </div>
  </div>;
}

function SpringBoardIcon({ name, iconSrc, kind, dock = false, onActivate }: {
  name?: string;
  iconSrc?: string;
  kind?: "folder";
  dock?: boolean;
  onActivate?: () => void;
}) {
  const content = <>
    {iconSrc && <img className={`springboard-system-icon${kind === "folder" ? " is-folder" : ""}`} src={iconSrc} alt={name ?? ""} />}
    {iconSrc && name && <span className="springboard-icon-label">{name}</span>}
  </>;

  if (onActivate) return <button
    className="springboard-icon-slot springboard-icon-button"
    data-app-name={name}
    onPointerDown={event => event.stopPropagation()}
    onClick={onActivate}
  >{content}</button>;

  return <span className={dock ? "springboard-dock-slot" : "springboard-icon-slot"} data-app-name={name}>{content}</span>;
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

export function SpringBoardBadge() {
  return <span className="springboard-badge" aria-hidden="true">
    <span
      className="springboard-badge-artwork"
      style={{ backgroundImage: `url(${badgeBackgroundSrc})`, maskImage: `url(${badgeMaskSrc})`, WebkitMaskImage: `url(${badgeMaskSrc})` }}
    />
  </span>;
}
