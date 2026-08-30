import cameraGlyphSrc from "../assets/facebook/chrome/facebook-2010-camera.svg";
import commentGlyphSrc from "../assets/facebook/chrome/facebook-2010-comment-glyph.svg";
import likeGlyphSrc from "../assets/facebook/chrome/facebook-2010-like-glyph.svg";
import mobileSourceMarkSrc from "../assets/facebook/chrome/facebook-2010-mobile-source-mark.svg";
import storyActionPlusSrc from "../assets/facebook/chrome/facebook-2010-story-action-plus.svg";
import gridLauncherSrc from "../assets/facebook/chrome/facebook-2010-grid-launcher.svg";
import notificationActionBubbleSrc from "../assets/facebook/chrome/facebook-2010-notification-action-bubble.svg";

type FacebookMicroGlyphName = "comment" | "like" | "mobile-source";

const FACEBOOK_MICRO_GLYPHS: Readonly<Record<FacebookMicroGlyphName, string>> = Object.freeze({
  comment: commentGlyphSrc,
  like: likeGlyphSrc,
  "mobile-source": mobileSourceMarkSrc,
});

export function FacebookMicroGlyph({ name }: { name: FacebookMicroGlyphName }) {
  const artworkSrc = FACEBOOK_MICRO_GLYPHS[name];
  if (name === "mobile-source") return <img className={`facebook-micro-glyph is-${name}`} src={artworkSrc} alt="" aria-hidden="true" />;
  return <span
    className={`facebook-micro-glyph is-${name}`}
    style={{ WebkitMaskImage: `url("${artworkSrc}")`, maskImage: `url("${artworkSrc}")` }}
    aria-hidden="true"
  />;
}

export function FacebookStoryActionBubble() {
  return <img className="facebook-story-action-bubble" src={storyActionPlusSrc} alt="" aria-hidden="true" />;
}

export function FacebookCameraArtwork() {
  return <img className="facebook-camera-artwork" src={cameraGlyphSrc} alt="" aria-hidden="true" />;
}

export function FacebookGridLauncherArtwork() {
  return <img className="facebook-grid-launcher-artwork" src={gridLauncherSrc} alt="" aria-hidden="true" />;
}

export function Facebook2010BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  const bodyWidth = Math.max(39, Math.ceil(label.length * 6.2) + 14);
  const totalWidth = 10 + bodyWidth;
  const rightEdge = totalWidth - 0.8;
  const rightShoulder = totalWidth - 5;
  const shapePath = `M10 1.2H${rightShoulder}Q${rightEdge} 1.2 ${rightEdge} 5V25Q${rightEdge} 28.8 ${rightShoulder} 28.8H10L1 15Z`;
  const highlightPath = `M10.5 2.8H${rightShoulder}Q${totalWidth - 2.2} 2.8 ${totalWidth - 2.2} 5`;
  return <button
    type="button"
    className="facebook-back-control facebook-directional-back-control"
    style={{ width: `${totalWidth}px` }}
    aria-label={label === "Back" ? "Back" : `Back to ${label}`}
    onClick={onClick}
  >
    <svg className="facebook-directional-back-artwork" width={totalWidth} height="30" viewBox={`0 0 ${totalWidth} 30`} aria-hidden="true">
      <defs>
        <linearGradient id="facebook-2010-back-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d92b9" />
          <stop offset=".45" stopColor="#657daa" />
          <stop offset=".49" stopColor="#4c699d" />
          <stop offset=".52" stopColor="#365584" />
          <stop offset="1" stopColor="#294674" />
        </linearGradient>
        <filter id="facebook-2010-back-shadow" x="-8%" y="-8%" width="118%" height="122%">
          <feDropShadow dx="0" dy=".7" stdDeviation=".25" floodColor="#10284f" floodOpacity=".52" />
        </filter>
      </defs>
      <path d={shapePath} fill="url(#facebook-2010-back-gradient)" stroke="#1c3764" strokeWidth="1.2" strokeLinejoin="round" filter="url(#facebook-2010-back-shadow)" />
      <path d={highlightPath} fill="none" stroke="#fff" strokeWidth=".7" strokeLinecap="round" opacity=".34" />
    </svg>
    <span className="facebook-directional-back-label">{label}</span>
  </button>;
}

export function FacebookUnreadBadge({ count }: { count: number }) {
  return <span className="facebook-unread-badge" aria-label={`${count} unread`}><span>{count}</span></span>;
}

export function FacebookNotificationActionBubble({ count }: { count: number }) {
  return <span className="facebook-notification-action-bubble" aria-hidden="true"><img src={notificationActionBubbleSrc} alt="" /><b>{count}</b></span>;
}
