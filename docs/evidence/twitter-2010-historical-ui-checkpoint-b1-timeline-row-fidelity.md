# Twitter for iPhone Historical UI — Checkpoint B1 Timeline Row Fidelity

## Scope

Checkpoint B1 reconstructs only the Timeline row anatomy, typography, spacing, and separator. Checkpoint A shell/navigation geometry and artwork remain unchanged. Mention, Message, Search, Profile, More, Compose, Tweet action-pane, Twitter state, seed content, scheduler behavior, and visitor architecture are outside this pass.

Target: iPhone 4, iOS 4.1, Twitter for iPhone 3.0.x circa October 2010.

## Direct visual evidence

Primary reference: Web Design Museum, `Twitter for iPhone in 2010`, native 320×480 Timeline/action-pane capture (`twitter-2010-03.jpg`). The capture was inspected at its native pixel dimensions rather than from a scaled page rendering.

Measured reference relationships:

| Element | Native capture measurement | Runtime value | Classification |
| --- | --- | --- | --- |
| Avatar left/top inset | x=5px / y≈5px | row padding 5px | CONFIRMED for capture |
| Avatar outer frame | 48×48px | 48×48px | CONFIRMED for capture |
| Text origin | x=60px | 5 + 48 + 7px | CONFIRMED for capture |
| Text right inset | ≈5px | 5px | CONFIRMED for capture |
| Compact row floor | ≈58px from avatar and insets | 58px minimum | PROBABLE |
| Two-line body row | ≈65–66px | 65px from 5 + 17 + 2 + 36 + 5 | PROBABLE |
| Separator | full-width single neutral line | 1px `#c5c5c5` | Geometry CONFIRMED; color RECONSTRUCTED |

The capture includes a long multi-line Tweet and demonstrates content-driven growth rather than one fixed row height. The implementation therefore removes the previous 76px minimum and permits each additional 18px body line to expand the row naturally.

## Avatar and text treatment

- Avatar fixture: 48×48px outer box, 1px `#878787` frame, 4px corner radius. Geometry is reference-measured; exact border neutral and radius raster are `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.
- Placeholder initials remain the existing runtime fallback. No fictional portrait media was introduced.
- Display name: 14px bold with 17px line-height.
- Tweet body: 14px regular with 18px line-height and a 2px separation below the header line.
- Timestamp: 11px regular with 17px line-height, light neutral gray, aligned at the upper right of the copy grid.

Exact font rasterization, weight rendering, and compressed-source RGB values remain `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT` / `HOLD` where the native screenshot cannot prove original implementation values.

## Preserved behavior and content

- fourteen canonical seed Tweets and their ordering remain unchanged;
- six realtime scheduler Tweets remain unchanged;
- player Tweets, Replies, Retweets, Favorites, scroll restoration, suspension, reset, and root-tab navigation remain unchanged;
- manual Retweets remain simple wrapped text plus the existing attribution line; no native Retweet card or Quote Tweet architecture was added;
- the existing swipe-revealed Tweet action pane remains untouched;
- Checkpoint A 44/373/43 shell, five tabs, navigation chrome, and unread treatment remain frozen.

## Source limitation

The Web Design Museum capture is strong direct visual evidence for visible geometry but is not an authenticated application-bundle asset or UIKit layout dump. Runtime CSS composition, neutral color values, font metrics, and compact-row minimum are therefore reconstructed from the period raster rather than claimed as recovered originals.
