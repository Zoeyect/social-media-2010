# iOS 4.1 System App Icon Integration v0.1

## Integrated icons

Only four Apple-built applications from the verified iPhone3,1 iOS 4.1 (`8B117`) filesystem are rendered. No third-party artwork is present.

| Application | Firmware source | Tracked asset | SHA-256 |
| --- | --- | --- | --- |
| Messages | `/Applications/MobileSMS.app/icon@2x.png` | `src/assets/historical/ios4.1/springboard/apps/Messages@2x.png` | `7de42ad9a1e2d876abc95a742724366dca8405e3f7bfec8e1469fc8ce2cbbc79` |
| Safari | `/Applications/MobileSafari.app/icon@2x.png` | `src/assets/historical/ios4.1/springboard/apps/Safari@2x.png` | `7d6a1fcbf071278778930ab0063f82d8f11f72aa6358266ffbdba6ba27a04709` |
| Camera | `/Applications/MobileSlideShow.app/icon-Camera@2x.png` | `src/assets/historical/ios4.1/springboard/apps/Camera@2x.png` | `fda38114fc4ce321595513927250414f5caed2d6a5a694a6a2580a5e562a790e` |
| YouTube | `/Applications/YouTube.app/icon@2x.png` | `src/assets/historical/ios4.1/springboard/apps/YouTube@2x.png` | `81ef16bbb2d3e04e5a45c7cdf2c2800093126b4b54a5d42229183d014eb3d7b6` |

The tracked files are byte-for-byte HFS extracts. They remain unmodified CgBI PNGs at 118×120 physical pixels and render at 59×60 logical points. The dock order follows the approved composition plan: Messages, Safari, Camera, YouTube.

## Pipeline boundary

The recovered Apple built-in assets are already the output of the system icon composition path: their 118×120 canvases include the presentation produced for the Home screen. They are therefore rendered directly. Applying `AppIconMask`, `AppIconOverlay`, and `AppIconShadow` again would double-compose authentic artwork. Cropping them to manufacture 114×114 sources would modify historical pixels and is rejected.

The explicit 114×114 source → 118×120 system composition path remains reserved for a future verified raw application source. No icon currently integrated uses that raw-source path.

## Placement and labels

- The Home list retains four columns and four rows.
- Page 1 preserves the planned Facebook, Twitter, and Foursquare slots as unrendered HOLD entries.
- The page indicator represents the plan's two Home pages; no third-party icon is rendered.
- The fixed four-position dock contains the four READY Apple icons.
- Labels use the current SpringBoard label implementation. Exact target-build font face, size, baseline, color path, and shadow metrics are not promoted to historical fact.

## Remaining HOLD items

- Exact third-party icon payloads for Facebook, Twitter, Foursquare, Instagram, Tumblr, and Flickr.
- Exact label typography, baseline, gap, color, and shadow metrics.
- Final grid-frame rounding, first-row Y, row advance, dock Y, and reflection composition.
- Exact raw 114×114-to-system-canvas blend order and precomposed opt-out behavior. This does not block the verified built-in 118×120 path used here.
- Interactive paging and rendering of Page 2's HOLD slots.

No Boot, Lock Screen, Status Bar, Battery, power lifecycle, sleep timer, or SpringBoard system artwork file was changed by this integration.
