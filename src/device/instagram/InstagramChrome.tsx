import type { CSSProperties, ReactNode } from "react";
import feedIconSrc from "../../assets/instagram/chrome/instagram-feed-2010-reconstructed.svg";
import popularIconSrc from "../../assets/instagram/chrome/instagram-popular-2010-reconstructed.svg";
import shareIconSrc from "../../assets/instagram/chrome/instagram-share-2010-reconstructed.svg";
import newsIconSrc from "../../assets/instagram/chrome/instagram-news-2010-reconstructed.svg";
import profileIconSrc from "../../assets/instagram/chrome/instagram-profile-2010-reconstructed.svg";
import refreshIconSrc from "../../assets/instagram/chrome/instagram-refresh-2010-reconstructed.svg";
import wordmarkSrc from "../../assets/instagram/chrome/instagram-wordmark-2010-reconstructed.svg";
import type { InstagramState } from "../../state/instagramState";

type InstagramTopBarProps = {
  title: string;
  wordmark?: boolean;
  leftControl?: ReactNode;
  rightControl?: ReactNode;
};

export function InstagramTopBar({ title, wordmark = false, leftControl, rightControl }: InstagramTopBarProps) {
  return <header className="instagram-navigation-bar" data-artwork-status="RECONSTRUCTED_FROM_PERIOD_SCREENSHOT">
    <span className="instagram-navigation-control-slot is-left">{leftControl}</span>
    {wordmark
      ? <img className="instagram-wordmark" src={wordmarkSrc} alt="Instagram" />
      : <strong className="instagram-navigation-title">{title}</strong>}
    <span className="instagram-navigation-control-slot is-right">{rightControl}</span>
  </header>;
}

export function InstagramRefreshButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="instagram-navigation-icon-button instagram-refresh-button" type="button" aria-label={label} onClick={onClick}>
    <img src={refreshIconSrc} alt="" aria-hidden="true" />
  </button>;
}

type InstagramTabBarProps = {
  currentView: InstagramState["currentView"];
  accountLabel: string;
  shareDisabled: boolean;
  onFeed: () => void;
  onPopular: () => void;
  onShare: () => void;
  onNews: () => void;
  onProfile: () => void;
};

const tabIconStyle = (src: string) => ({ "--instagram-tab-icon": `url(${src})` }) as CSSProperties;

export function InstagramTabBar({ currentView, accountLabel, shareDisabled, onFeed, onPopular, onShare, onNews, onProfile }: InstagramTabBarProps) {
  const popularSelected = currentView === "popular" || currentView === "popularPhotoDetail";

  return <nav className="instagram-development-navigation" aria-label="Instagram sections" data-artwork-status="RECONSTRUCTED_FROM_PERIOD_SCREENSHOT">
    <button type="button" aria-current={currentView === "feed" ? "page" : undefined} onClick={onFeed}>
      <span className="instagram-tab-icon" style={tabIconStyle(feedIconSrc)} aria-hidden="true" />
      <span className="instagram-tab-label">Feed</span>
    </button>
    <button type="button" aria-current={popularSelected ? "page" : undefined} onClick={onPopular}>
      <span className="instagram-tab-icon" style={tabIconStyle(popularIconSrc)} aria-hidden="true" />
      <span className="instagram-tab-label">Popular</span>
    </button>
    <button type="button" className="instagram-share-tab" disabled={shareDisabled} onClick={onShare}>
      <span className="instagram-share-housing"><span className="instagram-tab-icon" style={tabIconStyle(shareIconSrc)} aria-hidden="true" /></span>
      <span className="instagram-tab-label">Share</span>
    </button>
    <button type="button" aria-current={currentView === "news" ? "page" : undefined} onClick={onNews}>
      <span className="instagram-tab-icon" style={tabIconStyle(newsIconSrc)} aria-hidden="true" />
      <span className="instagram-tab-label">News</span>
    </button>
    <button type="button" aria-current={currentView === "profile" ? "page" : undefined} onClick={onProfile}>
      <span className="instagram-tab-icon" style={tabIconStyle(profileIconSrc)} aria-hidden="true" />
      <span className="instagram-tab-label">{accountLabel}</span>
    </button>
  </nav>;
}
