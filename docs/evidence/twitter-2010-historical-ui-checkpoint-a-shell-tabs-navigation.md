# Twitter for iPhone Historical UI — Checkpoint A

## Scope

Checkpoint A reconstructs only the Twitter for iPhone 2010 shell, bottom tabs, and navigation chrome. It does not change Timeline, Mention, Message, Search, Profile, More, or Compose content; Twitter state; canonical Tweets; scheduler delivery; or visitor architecture.

Target: iPhone 4, iOS 4.1, Twitter for iPhone 3.0.x circa October 2010.

## Evidence

Primary visual reference:

- Web Design Museum, `Twitter for iPhone in 2010` native 320×480 captures: Timeline/action pane, Profile, News/Suggested Users, and New Tweet.
- Direct capture measurements: 20px status bar, 44px navigation, approximately 373px top-level content, 43px tab body, five 64px tab slots, and a selected pointer rising approximately 6px above the tab body.

Contemporary corroboration:

- Twitter, April and May 2010 acquisition/launch announcements.
- PCWorld, May 20, 2010: Timeline, Mentions, Messages, Search, More order and upper-right Compose control.
- 148Apps Tweetie 2 review: icon order and electric-blue dock-like new-item indicator.

The exact October application bundle remains unrecovered. No reconstructed asset is classified as original or authenticated bundle artwork.

## Implemented shell geometry

| Region | App-local geometry | Global screen geometry | Classification |
| --- | --- | --- | --- |
| Status bar | external shared 20px region | y=0–19 | CONFIRMED / unchanged |
| Twitter navigation | 44px | y=20–63 | CONFIRMED |
| Top-level content | 373px | y=64–436 | CONFIRMED in reference capture |
| Tab body | 43px | y=437–479 | CONFIRMED in reference capture |
| Tab slot | 64px × 5 | x=0–319 | CONFIRMED in reference capture |
| Selected pointer | 14×7px, tab-local top -7px | approximately y=431–437 | PROBABLE geometry / RECONSTRUCTED material |

The previous 44/367/49 grid is removed. The 320×460 application surface and shared 320×480 device foundation remain unchanged.

## Tab artwork

All tab artwork is `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`:

- Timeline speech bubble: 30×24 canvas; filled bound approximately 28×20.
- Mentions `@`: 28×28 canvas; stroked visible bound approximately 24×24.
- Messages envelope: 30×24 canvas; filled bound 28×19.
- Search magnifier: 26×26 canvas; visible bound approximately 23×23.
- More ellipsis: 30×12 canvas; visible bound 30×8.

The SVGs provide deterministic monochrome masks. Runtime material is explicitly scoped to Twitter:

- unselected: restrained silver vertical value shift;
- selected: cyan/blue vertical value shift;
- selected cell: darker recessed field with the small upper pointer;
- no visible tab labels;
- accessible names remain available through `aria-label`.

Exact original icon curves, color values, shadow pixels, and pressed states remain `HOLD`.

## Unread indicator

Unread derivation and lifecycle are unchanged. Mentions and Messages still consume their existing derived unread counts.

The former 6px top-right dot is replaced visually by a centered 13×4px electric-blue indicator beneath the icon. This presentation is `RECONSTRUCTED`; exact artwork remains `HOLD`.

## Navigation material

The Twitter navigation bar now uses its own pale/steel-blue material family:

- narrow pale top region and highlight;
- denser lower blue field;
- one hard lower separator;
- Twitter-local inset button gradients.

Material classification: `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.

Exact RGB and gradient stops: `HOLD` because the surviving reference is compressed raster evidence.

## Timeline navigation controls

- Accounts: x=5, y=7 within navigation; 75×30px. Geometry `CONFIRMED` in capture.
- Compose: right=5 / global x≈281; 34×30px with a reconstructed 20×20 compose glyph. Geometry `CONFIRMED` in capture; glyph `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.
- Center title: existing derived public Twitter handle, without `@`; no new identity state. 20px, weight 700, 44px line-height, optical translateY(-1px). Typography `PROBABLE` / placement `RECONSTRUCTED`.
- Back: left=5, minimum 70×30px, reusable Twitter-local chevron asset. Profile reference geometry `CONFIRMED`; scalable runtime use and material `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.

No pressed animation was added. Exact pressed-state behavior remains `HOLD`.

## Preserved boundaries

- fourteen Timeline seed records unchanged;
- six scheduler Twitter deliveries unchanged;
- Mention and DM records/routing unchanged;
- Timeline ordering unchanged;
- Favorite, Retweet, Reply, Follow, scroll, unread, suspend/resume, and reset behavior unchanged;
- Timeline rows, action pane, Search, Profile, More, Accounts contents, Compose contents, and visitor architecture remain later checkpoints.
