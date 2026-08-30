# Facebook 2010 Icon Asset Provenance + Home Launcher Restoration v1.0

## Canonical boundary

- Device: iPhone 4
- OS: iOS 4.1
- Client: Facebook native iPhone app
- Target: 2010-10-20, U.S. Pacific Time
- Scope: Home launcher icon artwork only

Launcher information architecture, row/column occupancy, labels, routes, button hit areas, paging state, swipe handling, badges, Search, Account, `+`, notification presentation, and all non-Home surfaces remain frozen.

## Repository asset audit

The repository contains no archived Facebook application bundle and no historically approved Facebook Home launcher icon payloads.

| Candidate location | Contents | Decision |
| --- | --- | --- |
| `src/assets/facebook/characters/` | Character/profile and story media (`.png`, plus metadata files) | REJECTED — narrative media, not application chrome |
| `src/assets/historical/ios4.1/springboard/apps/` | Audited Apple SpringBoard application icons | REJECTED — wrong product and icon role |
| `src/assets/historical/ios4.1/springboard/system/` | iOS masks, shadows, badges, and page indicators | REJECTED — system chrome, not Facebook launcher artwork |
| `src/assets/historical/ios4.1/mobilesms/` | Apple MobileSMS camera-button assets | REJECTED — wrong application |
| Project-wide filename and source search | No Facebook internal launcher icon candidates or archived app bundle | HOLD — no exact payload available |

No raster/vector file was adopted. There are therefore no claimed source-file dimensions, crop boundaries, scaling ratios, or checksum-backed exact assets to register. The original v1.0 reconstruction used a 46 × 44 CSS-pixel nominal box. Pixel-Match v1.1 uses a 64 × 58 nominal artwork box while preserving the existing launcher button hit areas and routes.

## Period evidence

### Target-near Page 1 capture

Felix issue 1469, published 2010-10-15, page 12, includes a large native Facebook iPhone Home screenshot only five days before the canonical date:

- https://issues.felixonline.co.uk/felix_1469.pdf

It directly shows the target-era free-standing illustrated motifs for News Feed, Profile, Friends, Inbox, Places, Chat, Requests, Events, and Photos. It also shows that the icons are not a uniform family of blue rounded tiles. The PDF embeds this capture as a 642 × 928 JPEG, effectively a near-2× 320-point capture with a small outer edge. Pixel-Match v1.1 measured that embedded object rather than the newspaper page rendering. The screenshot remains visual evidence only; no screenshot pixels were cropped, traced into a raster file, or shipped.

### Earlier first-party-linked Home capture

MacRumors' 2009-08-27 Facebook 3.0 release report links the contemporary Facebook Home screenshots used for continuity checking:

- https://www.macrumors.com/2009/08/27/facebook-3-0-now-available-in-app-store/

That capture shows News Feed, Profile, Friends, Inbox, Chat, Requests, Events, Photos, and Notes in the same free-standing illustrated style. It directly establishes Notes as a white ruled sheet in Facebook 3.0. Because no target-week Page 2 screenshot was recovered, continuity of the exact Notes artwork through 2010-10-20 is probable rather than confirmed.

### Places release-date cross-check

Contemporary Facebook Places coverage identifies Places as part of Facebook for iPhone 3.2 in August 2010. This supports the target-era version context but does not substitute for the target-near visual capture:

- https://techcrunchjapan.com/2010/08/20/20100818facebook-places-iphone-2/
- https://www.cultofmac.com/news/facebook-for-ios-gets-update-with-new-foursquare-like-places-functionality

## Icon decisions

All entries use `sourceType: reconstruction`; intrinsic size is not applicable because no raster/vector payload is shipped. Display size is the shared 64 × 58 CSS-pixel nominal box, not a claim that every silhouette fills that box.

| Module / key | Source | Intrinsic size | Display box | Confidence | Optical offset | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| News Feed / `feed` | CSS reconstruction from 2010 capture | N/A | 64 × 58 | RECONSTRUCTED | 0, +1px | 56 × 42 layered sheet; darker outline and row blocks |
| Profile / `profile` | CSS reconstruction from 2009/2010 captures | N/A | 64 × 58 | RECONSTRUCTED | 0, -1px | Single approximately 54 × 53 pale-blue silhouette |
| Friends / `friends` | CSS reconstruction from 2009/2010 captures | N/A | 64 × 58 | RECONSTRUCTED | 0, 0 | Compact cream/blue overlap spanning approximately 62px |
| Inbox / `inbox` | CSS reconstruction from 2010 capture | N/A | 64 × 58 | RECONSTRUCTED | 0, 0 | Pink rear tray/card plus white document; deliberately unlike Chat |
| Places / `places` | CSS reconstruction from 2010 capture | N/A | 64 × 58 | RECONSTRUCTED | 0, 0 | Folded 56px map plus period pink/red pin; exact raster HOLD |
| Requests / `requests` | CSS reconstruction from 2009/2010 captures | N/A | 64 × 58 | RECONSTRUCTED | -1px, 0 | Weighted overlapping people and enlarged green plus |
| Events / `events` | CSS reconstruction from 2009/2010 captures | N/A | 64 × 58 | RECONSTRUCTED | 0, -1px | 50 × 48 calendar, taller red header and larger `31` |
| Photos / `photos` | CSS reconstruction from 2009/2010 captures | N/A | 64 × 58 | RECONSTRUCTED | -1px, -1px | Deeper 50/48px frame stack and warm portrait |
| Chat / `chat` | CSS reconstruction from 2010 capture | N/A | 64 × 58 | RECONSTRUCTED | 0, 0 | Two differentiated neutral/blue speech rectangles with tails and rows |
| Notes / `notes` | CSS reconstruction from 2009 capture | N/A | 64 × 58 | PROBABLE | 0, 0 | 38 × 50 ruled sheet with period red margin; target-week continuity not directly captured |

These classifications describe visual reconstruction confidence, not production-asset provenance. Exact Facebook raster payloads remain HOLD for all ten icons.

## Pixel-Match measurements v1.1

Measurements are approximate CSS-point equivalents obtained by halving coordinates in the embedded near-2× period capture. The screenshot is 642 pixels wide including its edge and depicts an approximately 320-point Facebook viewport. Its 928-pixel height is shorter than a full 960-pixel iPhone 4 capture, so absolute bottom-of-screen geometry is not treated as canonical.

| Metric | Historical reference | v1.0 simulator source | v1.1 target |
| --- | ---: | ---: | ---: |
| Facebook content width | approximately 320px | 320px | 320px unchanged |
| nominal icon box | icon-specific | 46 × 44px | 64 × 58px |
| visible icon bounds | approximately 48–64 × 42–55px | approximately 29–40 × 32–43px | approximately 48–64 × 42–58px |
| label font | approximately 13px / 15px | 10px / 12px | 13px / 15px |
| label weight | heavy/bold | browser `strong`, visually underweighted at 10px | 700 |
| label color | near-black, approximately `#303030` | inherited Facebook blue `#273c68` | `#303030` |
| CSS icon/label gap | optical gap approximately 10–17px | 3px, with inconsistent transparent remainder | 6px canonical; approximately 9–16px visual |
| row pitch | approximately 103px | 120px without banner / 108px with banner | 103px fixed |
| column centers | approximately 53 / 160 / 267px | approximately 60 / 160 / 260px | approximately 53 / 160 / 267px |
| last-label to page-dot center | approximately 21px in the cropped capture | dependent on banner state | dots unchanged; absolute value not frozen from cropped evidence |

Column alignment is corrected inside the existing button slots: left-column artwork and labels shift -7px, the middle remains at 0, and the right shifts +7px. This preserves the functional grid and hit areas while matching the reference centers. Per-icon vertical/optical corrections are limited to the 1px values recorded above.

Badge logic remains derived from the same Inbox, Requests, and Events selectors. The visual anchor changes from slot-relative `top: 1px; right: 8px` to artwork-relative `top: 5px; left: calc(50% + column offset + 21px)`, with an 18px bordered/highlighted badge. Counts and delivery/read behavior do not change.

## Central registry and rendering

`src/device/FacebookHomeIcons.tsx` owns the strict destination-keyed registry and the reconstruction markup. `FacebookContainer.tsx` passes the existing destination ID to that component; it no longer displays the legacy two-letter `iconLabel` strings. `src/styles/device.css` contains the icon-scoped artwork rules.

No SVG, icon font, SF Symbol, modern icon package, external image, screenshot crop, or AI-generated bitmap is used. The existing state definition retains its frozen launcher records; no destination, label, route, or reducer logic was changed.

## Rejected alternatives

- Uniform rounded blue monogram tiles: REJECTED — contradicted by both period captures.
- Current Facebook mobile/app glyphs: REJECTED — modern visual language.
- Generic icon-library people, calendar, messages, photo, and map-pin glyphs: REJECTED — unsupported provenance and wrong era styling.
- Screenshot crops: REJECTED — evidence is not a redistributable source asset.
- Apple SpringBoard and MobileSMS assets already in the repository: REJECTED — wrong product and semantic role.
- Invented standalone location pin: REJECTED — the target-near Places icon visibly combines a pink pin with a folded map.

## Common glyph backlog

Documentation only; no implementation changes in this task:

- exact Facebook navigation/back/account/shortcut raster glyphs
- exact Feed camera glyph
- exact notification badge/bubble glyph
- exact search magnifier raster treatment
- exact composer and engagement glyph binaries

Each remains HOLD pending an archived app bundle or equivalent approved provenance.

## Freeze and regression boundary

- `FacebookState` and `FACEBOOK_HOME_LAUNCHER_PAGES`: unchanged
- Home page occupancy and Notes position: unchanged
- destination click routing: unchanged
- Inbox, Requests, and Events badge selectors: unchanged; CSS anchors visually retuned in v1.1
- pointer capture, swipe threshold, page state, and page-dot handlers: unchanged
- transient notification delivery, timeout, state, and routing: unchanged
- News Feed, Profile, Places, and all other app surfaces: unchanged

## Validation record

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- manual overlay, Home Page 1: BLOCKED — no in-app or connected browser was available in the session
- manual browser, Home Page 2 / Notes: BLOCKED — no in-app or connected browser was available in the session
- manual browser, badge anchors and launcher routes: BLOCKED — no in-app or connected browser was available in the session
- primary screenshot source measurement: COMPLETE — original embedded 642 × 928 image object inspected; no pixels shipped
