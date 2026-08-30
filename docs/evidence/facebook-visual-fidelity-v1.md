# Facebook Visual Fidelity v1

## Status

VISUAL-ONLY PASS AFTER FUNCTION / IA / CONTENT FREEZE

Target date: October 20, 2010

## Scope

This pass refines the presentation of the already-frozen Facebook experience. It does not alter navigation, story eligibility, content, identity, media ownership, interaction state, scheduling, or timeline behavior.

Primary surfaces:

- Home launcher
- News Feed
- Profile

Secondary shared refinements apply to existing Post Detail, comments, albums, and photo lists only where they inherit the same Facebook typography, spacing, and separator rules.

## Evidence basis

The implementation follows the project's existing historical audits:

- `facebook-2010-native-ia-layout-fidelity-audit-v0.1.md`
- `facebook-2010-native-ia-correction-v0.2.md`
- `facebook-2010-home-launcher-native-feature-expansion-v0.3.md`
- `facebook-experience-v0.1.md`

Supported characteristics retained or strengthened:

- 320-pixel application viewport
- compact 44-pixel blue navigation bar
- beveled blue navigation controls
- dense continuous white News Feed
- blue bold actor names
- compact dark story copy
- muted timestamp metadata
- text-based Like and Comment actions
- Profile header followed by Wall / Info / Photos / Friends sections
- launcher search, page dots, and transient notification banner

## Changes

### Geometry and density

- Reduced News Feed row padding and avatar dimensions to produce a denser 2010-era list rhythm.
- Tightened story text, metadata, action, count, and media spacing without changing story order or behavior.
- Reduced Profile header and album-list vertical footprint.
- Tightened Home search, launcher-grid, page-dot, and Notifications geometry while preserving the frozen launcher layout and intentional empty slot.

### Typography and hierarchy

- Retained the existing Helvetica-era stack.
- Reduced Feed body and metadata sizes to separate actor, copy, timestamp, and actions more clearly.
- Reduced Post Detail's previously oversized story copy so it remains visually consistent with the simulated 320-pixel Facebook client.
- Preserved Facebook blue for actor names, links, and actions.

### Surface treatment

- Refined the navigation bar and button gradients using scoped Facebook color variables.
- Refined Profile section gradients and selected-state inset treatment.
- Standardized separators and secondary text color through Facebook-scoped variables.
- Added the missing handle to the existing CSS-drawn search glyph without introducing an unsupported image asset.

## Asset audit

No historically verified Facebook application icon set is stored in the repository. Existing Facebook assets are character/profile media, not audited application chrome. The original v1 decision to retain launcher letter placeholders is superseded by the evidence-bounded Home Launcher Restoration v1.0 documented below. That pass uses scoped CSS reconstructions; it does not claim recovered production raster assets.

## HOLD boundaries

The following remain HOLD pending direct primary-source evidence or approved assets:

- exact Facebook for iPhone icon artwork
- exact toolbar raster textures and binary asset treatment
- exact font metrics beyond the existing Helvetica-compatible stack
- exact gradient stop values and pixel geometry
- uncertain Account-button wording and undocumented chrome details
- exact pull-to-refresh appearance and behavior

## Freeze confirmation

Unchanged by this pass:

- Facebook function
- information architecture
- narrative and copy
- story ordering and eligibility
- profile and relationship data
- media IDs, ownership, albums, and tags
- Likes, comments, badges, and session state
- scheduler and global timing

## News Feed Exact Geometry v1.1

This refinement is scoped to the News Feed. It does not propagate the new Feed tokens into Home, Profile, Albums, Photo Detail, Inbox, Chat, Events, Places, Requests, Notes, or Notifications.

| Item | v1 value | v1.1 value | Evidence status |
|---|---:|---:|---|
| Feed navigation height | 44px | 44px | PERIOD-EVIDENCE |
| Feed navigation controls | 29px, top 7px | 28px, top 8px | VISUAL-CROSSCHECK |
| Composer height | 36px | 34px | VISUAL-CROSSCHECK |
| Story minimum height | 72px | 60px | VISUAL-CROSSCHECK |
| Story padding | 7px 8px | 6px 8px | VISUAL-CROSSCHECK |
| Standard Feed avatar | 42px | 36px | PERIOD-EVIDENCE |
| Avatar/content gap | 7px | 7px | READY |
| Actor name | 13px / 16px | 13px / 16px | READY |
| Body copy | 13px / 16px | 13px / 16px | READY |
| Timestamp | 10px / 12px | 11px / 13px | VISUAL-CROSSCHECK |
| Engagement counts | 10px | 10px | READY |
| Story separator | #c6c9cf | #b8bcc3 | VISUAL-CROSSCHECK |
| Comment preview avatar | 26px | 26px | READY |

### Interaction strip

Like and Comment retain their frozen actions and labels. The v1.1 full-content-width 23-pixel strip proved visually too heavy during manual comparison. v1.1.1 replaces it with a 22-pixel `max-content` inline group aligned to the story content column. The group uses a subtle pale-gray background, one thin border, seven-pixel link spacing, and no full-width rule.

Engagement counts remain 10 pixels but move from a 12-pixel to an 11-pixel line height, with top spacing reduced from three pixels to two pixels. Action spacing is reduced from four pixels to two pixels above the compact group.

No plus bubble, historical icon approximation, pointer notch, reaction control, or altered visible copy was introduced.

Status: VISUAL-CROSSCHECK

### Photo framing

Single-photo and multi-photo Feed media retain their existing crop, source, aspect behavior, ownership, and story binding. Feed rows now add a two-pixel white inset, a thin gray outer border, and a two-pixel multi-photo gap. Album caption strips use a compact gray backing and separator.

Status: PERIOD-EVIDENCE / VISUAL-CROSSCHECK

### Composer boundary

The former `Photo | Status | Check In` Feed strip is `SUPERSEDED / REJECTED` for the target composer. The News Feed now uses the `PERIOD-EVIDENCE` camera + `What's on your mind?` row, while Facebook Places / Check In remains `PERIOD-EVIDENCE` and reachable through its existing Home launcher. The exact Facebook camera glyph remains `HOLD`; the current control is a conservative CSS reconstruction rather than a borrowed or fabricated production asset. Navigation-title centering and left-aligned field/content text remain `PERIOD-EVIDENCE / VISUAL-CROSSCHECK` rules, with no global alignment override.

Status: HOLD — requires Facebook 3.2 exact evidence

## News Feed 2010 Interaction Control v1.2

### Default engagement layout

News Feed stories now render a compact engagement summary followed by a small right-aligned `+` disclosure control. Like and Comment are no longer permanently exposed on Feed stories. Profile Wall and detail surfaces retain their existing controls.

Summary order:

1. comments
2. likes / people

Status: PERIOD-EVIDENCE

The summary derives both values from the existing canonical comment and Like selectors. Zero-valued segments are omitted; when both values are zero, no empty summary is rendered.

### Action disclosure

The `+` uses native, UI-local `<details>` disclosure. Each story toggles independently, defaults collapsed, and naturally resets when the Feed story components unmount. No disclosure value is added to canonical Facebook state, seed content, navigation snapshots, or session serialization.

Expanded action order:

1. Like / Unlike
2. Comment

Both controls reuse their existing handlers.

Status: PERIOD-EVIDENCE

### Asset provenance

No approved historical Facebook engagement glyph or plus-control image was found in the repository. Summary glyphs remain text-only.

Exact summary glyphs: HOLD — historical asset provenance required

The plus control is a conservative CSS reconstruction using the existing period Facebook blue gradient, one-pixel border, slight bevel, and a white text plus. No screenshot crop, modern icon library, SF Symbol, AI-generated icon, or invented decorative artwork is used.

Exact plus artwork: PERIOD-EVIDENCE / CSS RECONSTRUCTION

## Facebook 2010 Icon Asset Provenance + Home Launcher Restoration v1.0

The Home launcher no longer renders the unsupported uniform blue `NF / PR / FR / MS / PL / RQ / EV / PH / CH / NT` tiles. All ten frozen launcher destinations resolve through `FACEBOOK_HOME_ICON_REGISTRY`. The visible 46-by-44-pixel artwork box replaces the former 43-by-43-pixel placeholder box without changing launcher buttons, grid tracks, labels, routes, badges, page occupancy, page dots, or swipe behavior.

The registry uses CSS-drawn, free-standing motifs bounded by period screenshots. These are reconstructions, not extracted Facebook binaries. Exact production raster payloads, original filenames, and original pixel dimensions remain HOLD. Notes is classified `PROBABLE / RECONSTRUCTED` because its direct visual source is Facebook 3.0 from August 2009 rather than a target-week Page 2 capture. The target-near October 2010 capture confirms the other nine glyph families, including the folded-map and pink pin treatment for Places.

Detailed evidence, per-icon status, rejected candidates, dimension audit, and HOLD boundaries: `facebook-2010-icon-provenance-v1.0.md`.

Common glyph backlog is documentation-only in this pass: exact camera, notification, search, navigation, toolbar, and composer glyph binaries remain HOLD. No shared common glyph implementation changed.

## Home Launcher Pixel Match v1.1

The primary measurement source is the 642 × 928 JPEG embedded in Felix issue 1469 (2010-10-15), not a screenshot crop used as production art. Coordinate measurements were normalized to the approximately 320-point Facebook viewport. The capture is vertically cropped relative to a full iPhone 4 screen, so its absolute bottom edge is not treated as canonical.

| Metric | v1.0 | v1.1 |
| --- | ---: | ---: |
| nominal icon box | 46 × 44px | 64 × 58px |
| visible icon bounds | approximately 29–40 × 32–43px | approximately 48–64 × 42–58px, icon-specific |
| label size / line height | 10px / 12px | 13px / 15px |
| label weight | default `strong` | 700 |
| label color | inherited `#273c68` | `#303030` |
| canonical CSS icon-label gap | 3px | 6px |
| row pitch | flexible: 120px normal / 108px with banner | fixed 103px |
| column centers | approximately 60 / 160 / 260px | approximately 53 / 160 / 267px |
| badge anchor | top 1px / right 8px from slot | top 5px / center + column offset + 21px from artwork |

News Feed gains a heavier layered news-sheet silhouette; Profile and Friends use larger, more compact people silhouettes; Inbox becomes a pink tray plus white document rather than a Chat-like pair; Places retains its target-period folded map and pink pin; Requests gains stronger overlapping people and a larger green plus; Events uses a larger calendar/header/`31`; Photos gains deeper frame layering and a warmer portrait; Chat becomes two differentiated neutral/blue speech rectangles; and Notes gains the period red margin rule.

The strict registry now records `sourceType`, `confidence`, intrinsic-size status, 64 × 58 display size, and 0–1px per-icon optical offsets. Exact Facebook production rasters remain HOLD. Launcher order, labels, slots, routes, paging, Notes placement, Search/header, background, page-dot behavior, badge selectors, notification behavior, Facebook state, News Feed, Profile, and Places flow remain unchanged.

## Facebook Home Search Chrome Restoration v1.2

The prior hierarchy placed Home Search as the first row of the pale `.facebook-home` launcher body, below a separate blue navbar. v1.2 moves the unchanged Search control into a Home-only `.facebook-home-chrome` wrapper:

```text
facebook-home-chrome
├── 44px Home navigation row
└── 44px blue Search row

facebook-home
├── pale launcher / search-results body
├── page dots
└── transient notification banner, when active
```

The lower Search row uses the existing Facebook toolbar color family and directly touches the Home navbar. The white rounded field retains its magnifier, gray border, inner shadow, 23px input geometry, left-aligned placeholder, `homeSearchQuery`, and `EDIT_HOME_SEARCH` handler. The pale launcher background now begins only after the blue Search row and is identical on launcher Pages 1 and 2.

Search field geometry is shared through `.facebook-search-field`; container chrome is deliberately surface-specific. Friends and Pages keep `.facebook-friends-search` in the light 36px list header below their ordinary navbar. News Feed keeps its camera plus `What's on your mind?` composer and receives no Search styles.

| Historical boundary | Status |
| --- | --- |
| Home Search inside extended blue Facebook chrome | PERIOD-EVIDENCE / CONFIRMED |
| Friends Search below navbar on light list header | PERIOD-EVIDENCE / CONFIRMED |
| News Feed camera/status composer separate from Search | PERIOD-EVIDENCE / CONFIRMED |
| Home Account / `+` orientation and exact target-build wording | HOLD — target-build verification required |

Launcher artwork, nominal icon size, label typography, 103px row pitch, column centers, badge geometry/logic, page dots, paging, routes, notification timing, state, and scheduler remain unchanged from v1.1.

### Unified blue chrome correction v1.2.1

The v1.2 implementation still produced an unintended seam because the 88px parent gradient changed abruptly at the row boundary while the Home navbar and Search row each retained independent borders, backgrounds, or shadows. v1.2.1 assigns one continuous gradient and one inset bottom edge to `.facebook-home-chrome`. The Home navbar and Search row are transparent, borderless at their junction, and shadowless, so both rows expose the same uninterrupted blue panel.

The white Search field, row dimensions, header controls, pale launcher boundary, Friends/Pages list Search, News Feed composer, Home paging, icon grid, badges, page dots, and transient notification behavior are unchanged.

### Continuous gradient restoration v1.2.2

The Home navbar and Search row remain one continuous blue chrome owned by `.facebook-home-chrome` (**PERIOD-EVIDENCE**). Period-reference sampling and visual comparison show a continuous vertical tonal progression rather than a flat fill: a light top highlight descends through medium Facebook blue into the darker Search zone, then finishes at a dark terminal lower edge (**PERIOD-EVIDENCE / VISUAL-CROSSCHECK**).

The parent gradient therefore uses reconstructed multi-stop values `#90a7c9 0%`, `#8298c1 10%`, `#6f89b8 24%`, `#466aa6 45%`, `#3d609b 58%`, `#3d619d 84%`, `#395992 96%`, and `#2f4364 100%` (**RECONSTRUCTED**). These RGB values and stop locations are implementation approximations derived from the supplied reference, not claims of canonical source constants.

The Home navbar and Search row remain transparent, borderless at their junction, and shadowless. Any intermediate divider, child-owned gradient, or gradient restart between those rows is **REJECTED**. The parent retains the sole outer bottom edge below Search. Search internals, Account / `+`, wordmark, Friends, Pages, News Feed, launcher pages, paging, icons, labels, badges, Places, and transient notification state are unchanged.

## Facebook Places 2010 Check-In Flow v1.0

The Places launcher now opens a friend-activity Home with one Check In entry. Venue selection is isolated in Nearby Places, followed by a venue-specific check-in form. The form reuses the canonical Facebook `CHECK_IN` reducer path, canonical venue IDs, current simulated time, and current Facebook friends collection; it does not create a second check-in store or bypass centralized News Feed eligibility.

| Surface or behavior | Evidence status |
| --- | --- |
| Places Home friend / recent activity | PERIOD-EVIDENCE / CONFIRMED |
| Single Places Home Check In entry | PERIOD-EVIDENCE / CONFIRMED |
| Nearby Places screen | PERIOD-EVIDENCE / CONFIRMED |
| Venue check-in form | PERIOD-EVIDENCE / CONFIRMED |
| `What are you doing?` optional status | PERIOD-EVIDENCE |
| `Tag Friends With You` | PERIOD-EVIDENCE |
| Place `Here Now` | PERIOD-EVIDENCE |
| Place `Recent Activity` | PERIOD-EVIDENCE |
| Place `Activity | Info` shell | PERIOD-EVIDENCE |
| Exact map geometry | HOLD / VISUAL-CROSSCHECK |
| Venue ordering without distance metadata | RECONSTRUCTED |

Nearby Places preserves the existing deterministic canonical venue order because the data model has no location or distance metadata. No distances, categories, addresses, hours, phone numbers, websites, ratings, or search behavior are invented. The small map region is an explicit HOLD placeholder and adds no mapping dependency. Add Place is OUT-OF-SCOPE because no safe creation mechanism exists.

Tag selection begins empty and derives only from `state.friends`. Jack therefore appears only after the existing friendship acceptance transition, while Anil remains unavailable because he has no Facebook identity. Successful submission records one user check-in, replaces the stable user check-in Feed record rather than duplicating it, and returns to Place Detail. `Here Now` shows only the current user at the newly selected venue; historical check-in posts are not treated as live presence.

Main Street Diner continues to use canonical venue ID `main-street-diner` across Facebook Places, Luca's work continuity, Facebook check-ins, Pages, and Foursquare. Foursquare gameplay and state remain separate and unchanged.

## Comments Detail historical structure v1.3

The News Feed `Comment` action opens a dedicated `Comments` surface rather than the generic `Post` detail route. Other Post Detail entry paths remain unchanged.

- The centered title is `Comments`, with Back on the left and the canonical Like/Unlike action on the right.
- The original story is compact at the top and resolves the same canonical story and media as Feed.
- Likes use a separate compact summary above the discussion rather than combined engagement metadata.
- Comments use dense pale rows with the existing actor resolver, avatars, and inline copy. No modern per-comment Like or Reply controls were added.
- A single-line `Write a comment...` composer is docked below the one authoritative comment scroll area and submits through the existing Facebook comment state.
- Existing comment records do not contain trustworthy per-comment timestamps, so this pass does not fabricate visible time metadata.

This restoration changes visual hierarchy and navigation structure only. Story order, media identity, Like state, comment state, Feed eligibility, and Facebook content remain frozen.

## Historical News Feed Route Map v1.4

The 2010 News Feed primary routes are locked as follows:

- Actor avatar or name -> Profile: READY / PERIOD-EVIDENCE
- Structured mention -> mentioned actor Profile: READY / PERIOD-EVIDENCE
- `+` -> reveal the existing Like and Comment controls: PERIOD-EVIDENCE
- Comment -> dedicated Comments screen: PERIOD-EVIDENCE
- Single-photo preview -> canonical Photo Detail: PERIOD-EVIDENCE
- Individual multi-photo thumbnail -> that exact canonical media item in Photo Detail: PERIOD-EVIDENCE
- Generic Feed story body -> no primary action: HOLD
- News Feed photo -> Generic Post Detail: REJECTED as a primary route

Generic Post Detail remains available as a non-primary fallback. Profile Wall story-body navigation is retained as LEGACY / HOLD for compatibility, while the Event Wall's direct Alex story link remains an INTERNAL_FALLBACK. No broad Post Detail cleanup is part of this pass.

Feed media navigation captures the existing Feed scroll position before opening Photo Detail. Single-photo, album-thumbnail, Profile Wall, Album, and tagged-photo entry paths continue resolving the same canonical media and story interaction identity. No duplicate media or derivative asset was introduced.

## Facebook Visual Freeze — News Feed / Comments / Photo Routing v1.0

**Status: VISUAL-FROZEN**

The following surfaces are visually frozen after manual and structural confirmation:

- News Feed: VISUAL-FROZEN
- Comments Detail: VISUAL-FROZEN
- News Feed -> Photo Detail routing: VISUAL-FROZEN

The frozen boundary includes News Feed geometry, avatar sizing, typography hierarchy, media preview scale, engagement summaries, the `+` disclosure, expanded Like / Comment controls, scrolling, chronology, eligibility, Comments chrome and row geometry, the docked composer, exact thumbnail routing, canonical media identity, Back restoration, and intrinsic image aspect preservation.

Locked historical route map:

```text
Actor / avatar -> Profile
Structured mention -> Profile
+ -> Like / Comment controls
Comment -> Comments
Single photo -> Photo Detail
Multi-photo thumbnail -> exact Photo Detail
Feed story body -> HOLD
```

Generic Post Detail remains limited to Profile Wall story body as `LEGACY / HOLD` and the Event Wall Alex story link as `INTERNAL_FALLBACK`.

These surfaces may be reopened only for a confirmed A-level runtime blocker, B-level functional regression, or strong newly discovered historical evidence that directly contradicts the frozen implementation. Subjective polish is not sufficient grounds to reopen them.

## Home Transient Notification Banner v1.0

Target: native Facebook iPhone application on iPhone 4 / iOS 4.1, 2010-10-20.

| Presentation detail | Classification |
|---|---|
| Permanent Home Notifications footer | REJECTED / SUPERSEDED |
| Transient bottom notification banner | PERIOD-EVIDENCE / CONFIRMED |
| Banner copy from canonical notification | READY |
| Exact banner timeout | RECONSTRUCTED |
| Exact banner animation | UNKNOWN / KEEP MINIMAL |
| Feature-phone Menu / Exit chrome | REJECTED for native iPhone |
| Exact notification icon artwork | HOLD |

Newly derived notification IDs trigger one UI-local banner at a time. Existing notifications present when Facebook mounts do not trigger it. A newly delivered notification replaces any currently presented banner, and the conservative reconstruction dismisses it after five seconds. No animation is fabricated.

The banner renders only on Home, on either launcher page, and uses the exact canonical notification text. Its small red numeric badge is a CSS reconstruction because no approved period notification icon asset is available. Tapping dispatches the existing `OPEN_NOTIFICATION` event, which covers all current notification targets: Requests, June/Katie messages, and Jack's event invite. The existing target action retains its established read semantics; appearance and timeout never mark a record read.

The dedicated Notifications view and reducer cases remain in place, but its unsupported permanent Home entry was the only direct list route. It is now dormant rather than replaced with an invented launcher icon. Canonical notification actions remain reachable through transient banners and the existing Requests, Inbox, and Events destinations.

Banner visibility is component-local, not part of `FacebookState`, seed records, serialization, or reset data. Requests, Events, Inbox badges, delivery records, scheduler timing, launcher destinations, search, page dots, and paging remain unchanged.

## Profile Section Architecture v1.2.1

Target: native Facebook iPhone application on iPhone 4 / iOS 4.1, 2010-10-20.

| Profile section | Decision |
|---|---|
| Wall | PERIOD-EVIDENCE |
| Info | PERIOD-EVIDENCE |
| Photos | PERIOD-EVIDENCE |
| Profile-level Friends | REJECTED for the current reconstruction target |

Contemporary native iPhone evidence and period reviews consistently describe Profile as `Wall | Info | Photos`. No current evidence establishes a Profile-level Friends tab before the target date, and desktop Profile architecture must not be transferred automatically into the native application.

Historical confidence: `PROBABLE`. The decision remains revisable if stronger evidence specific to or before 2010-10-20 appears.

This correction removes only the Profile-specific section. The global Home → Friends surface, Friends / Pages / Requests segments, search, alphabetical index, friendship state, and actor navigation remain separate and unchanged.

## Profile Wall Historical Fidelity v1.2

The Profile Wall remains a continuous, compact stack rather than a collection of cards. Its story renderer, actor/media resolution, timestamps, Likes, comments, and navigation handlers remain canonical and unchanged. Only selectors scoped below `.facebook-profile-wall` define the Wall presentation.

### Feed / Wall audit and decisions

| Element | Frozen News Feed | Profile Wall v1.2 | Decision |
|---|---|---|---|
| Avatar size | 36px | 36px Wall token | SHARE_WITH_FEED |
| Avatar/content gap | 7px | 7px | SHARE_WITH_FEED |
| Actor font | 13px / 16px | 13px / 16px | SHARE_WITH_FEED |
| Body font | 13px / 16px | 13px / 16px | SHARE_WITH_FEED |
| Timestamp font | 11px / 13px, gray | 11px / 13px, gray | SHARE_WITH_FEED |
| Story padding | 6px 8px | 6px 8px | SHARE_WITH_FEED |
| Separator | 1px `#b8bcc3` | 1px `#b8bcc3` | SHARE_WITH_FEED |
| Single-photo width | 68% | 82%, max 212px | WALL_SPECIFIC |
| Multi-photo width | 74–76% | 80%, max 212px | WALL_SPECIFIC |
| Engagement summary | compact, comments then people | compact, comments then people | SHARE_WITH_FEED |
| Like / Comment actions | `+` disclosure | Wall-scoped `+` disclosure | SHARE_INTERACTION_LANGUAGE |
| Comment preview | pale compact row | pale compact row rule retained | SHARE_WITH_FEED |
| Photo frame | 2px inset, thin gray frame | 2px inset, thin gray frame | SHARE_WITH_FEED |

Compact stacked stories, square compact Wall avatars, and the Wall avatar/body hierarchy are `PERIOD-EVIDENCE / VISUAL-CROSSCHECK`. The dense Wall typography hierarchy is `VISUAL-CROSSCHECK`. Profile Wall media being smaller than Detail but larger than Feed is `VISUAL-CROSSCHECK`; the 82% and 80% values are conservative implementation targets, not claimed historical measurements. Wall single-photo media, including profile-picture updates, uses the same 82% / 212px ceiling with intrinsic height and no crop. Multi-photo previews use an 80% / 212px ceiling, small gaps, a thin frame, a compact caption strip, and intrinsic image ratios rather than the inherited square cover crop.

Profile Wall interaction chrome is superseded by v1.2.2 below. The compact pale comment-preview treatment is `PERIOD-EVIDENCE / VISUAL-CROSSCHECK`; no threading, comment Likes, or fabricated metadata is introduced.

Profile Wall photo controls already resolve canonical single media or exact album photos into Photo Detail, so no route change is required. Generic Profile Wall story-body navigation to Post Detail remains `LEGACY / HOLD`.

The Profile identity block, section tabs, News Feed selectors and 68% Feed media rule, Comments Detail, Photo Detail, data, chronology, ownership, tags, and interaction state remain unchanged.

## Profile Wall Interaction Restoration v1.2.2

Historical confidence: `PROBABLE`. Contemporary Profile Wall captures show compact engagement summaries with a right-side action affordance, while contemporary Facebook 3.0 reporting establishes Like and Comment support on Profile Wall. No known evidence indicates a return to permanently exposed actions before 2010-10-20.

| Interaction detail | Classification |
|---|---|
| Persistent naked Like / Comment | SUPERSEDED |
| Compact engagement summary | PROBABLE |
| Summary order: comments → people | PROBABLE / VISUAL-CROSSCHECK |
| Right-side `+` affordance | PROBABLE |
| `+` reveals Like / Comment | PROBABLE |
| Exact plus artwork | PERIOD-EVIDENCE / CSS RECONSTRUCTION |
| Exact expanded action-bar pixels | VISUAL-CROSSCHECK |

Each Wall story uses a Wall-specific native `<details>` element. Disclosure defaults collapsed, toggles independently, and remains UI-local rather than entering Facebook state or session serialization. Non-zero summary segments derive from the existing comment and Like selectors; zero segments and empty summary containers are omitted. Expanded controls retain the existing Like/Unlike and Comment handler props in that order.

The Wall Comment handler continues to open Generic Post Detail and then begin the canonical comment composer. That route remains `LEGACY / HOLD` and is not changed by this chrome-only pass.

The Wall reconstruction shares token values and period interaction grammar with Feed, but uses separate `.facebook-profile-wall-*` markup and selectors. Frozen Feed markup/CSS, Profile identity and tabs, Wall media geometry, comments, story keys, data, and scroll architecture remain unchanged.

## Albums / Photos Historical Fidelity v1.0

### Structure audit

| Structure | Current source | Decision |
|---|---|---|
| Profile Photos landing | `FacebookAlbumList` shared by Profile Photos and the Home Photos entry | ADAPT |
| Owned album rows | `getFacebookAlbumsForActor`, in canonical registry order | KEEP |
| Photos of actor | `getFacebookPhotosOfActor` virtual tagged collection | KEEP; visually distinguish |
| Album cover | first ordered canonical album photo | KEEP |
| Album count | `album.mediaIds.length` | KEEP |
| Tagged count | selector result length | KEEP |
| Album / tagged grids | shared three-column gallery structure | ADAPT |
| Photo Detail | canonical album record plus centrally resolved media | ADAPT presentation |
| Owner context | `album.ownerActor` independent of entry path | KEEP |
| Back behavior | navigation stack restores Album or Photos-of view | KEEP / LEGACY scroll limitation |
| Selected state | canonical album ID, media ID, and optional tagged actor | KEEP |

The Photos landing presents compact 60-pixel list rows with 48-pixel square cover previews, a 13-pixel album title, a 10-pixel derived count, thin separators, and the existing disclosure indicator. Owned albums remain under `Albums`; a separate `Tagged Photos` section contains the canonical `Photos of [Name]` virtual collection. This reinforces ownership without creating an album ID or changing selector semantics.

Compact album lists and square row thumbnails are `PERIOD-EVIDENCE / VISUAL-CROSSCHECK`. The album and tagged-photo collections share a dense three-column square-preview grid with three-pixel gaps and thin borders: `PERIOD-EVIDENCE / VISUAL-CROSSCHECK`. Square crop is limited to list/grid thumbnails.

Photo Detail supersedes the black near-fullscreen presentation with a white, margin-bounded surface and a thin gray, two-pixel-inset frame. The main image uses the exact canonical media source with `height: auto` and `object-fit: contain`; source aspect preservation is `READY`. Owner is blue/bold, caption is dark, and album/time/tags remain muted secondary text. Exact Photo Detail chrome is `HOLD / VISUAL-CROSSCHECK`.

Photo Detail retains its existing canonical Like/Unlike and Comment handlers. Their exact historical chrome remains `HOLD`; this pass only reduces the oversized action row within the Photo Detail scope. Comments continue sharing the underlying photo story state.

Navigation state preserves the collection kind, selected album, selected photo, and tagged actor. Exact deep-scroll restoration is `LEGACY / HOLD`: no album/tagged scroll offset currently exists in canonical state, and this visual pass does not change navigation architecture.

Album membership, ordering, media IDs, owner/story relationships, tag selectors, Feed 68% media, and Profile Wall 82% media remain frozen.

## Friends / Pages Shared List v1.1

- Friends contact-style list: PERIOD-EVIDENCE
- Friends display-name alphabetical sorting: PERIOD-EVIDENCE
- Populated alphabetical section headers: PERIOD-EVIDENCE / VISUAL-CROSSCHECK
- Fixed right-side search, A–Z, and `#` index: PERIOD-EVIDENCE / VISUAL-CROSSCHECK
- Alphabet index section jumping: ACTIVE
- Phone affordance where canonical contact data exists: PERIOD-EVIDENCE
- Current phone affordance: OMITTED because no canonical friend phone metadata exists
- Exact historical phone glyph: HOLD
- Pages as a shared simple-list tab: PERIOD-EVIDENCE
- Current canonical Pages dataset: three strict Facebook-local Page records
- Pages alphabet rail: OMITTED because the dataset is empty
- Modern Pages management UI: REJECTED
- Exact Friends / Pages / Requests tab composition on October 20, 2010: HOLD
- Sync control: HOLD / unchanged

Friends and Pages share the same header, compact search placement, bounded list region, separator language, and period-style bottom segments. Friends uses 50-pixel contact rows, 42-pixel square canonical avatars, populated section headers, and a fixed index outside its authoritative scroll node. Pages retains the same list shell with the tab-specific `Search Pages` placeholder and three alphabetically sorted lightweight records.

### Search Surface Audit v0.1

Search remains surface-specific rather than a global Facebook control. Home Search and Friends Search are `PERIOD-EVIDENCE`; Pages search capability is `PERIOD-EVIDENCE`. Their shared white rounded field, gray border, subtle inner shadow, CSS magnifier, and left-aligned placeholder are `PERIOD-EVIDENCE / VISUAL-CROSSCHECK`. The magnifier is a conservative CSS reconstruction already used by Home, not an SF Symbol, icon-library glyph, generated asset, or screenshot crop.

| Surface | Current Search | Historical evidence | Decision |
| --- | --- | --- | --- |
| Home | `Search` | Confirmed period surface | REQUIRED |
| News Feed | None | Frozen target has composer, not Search | REJECTED |
| Profile | None | No confirmed target-version evidence in the current evidence set | NOT_EVIDENCED |
| Friends | `Search Friends` | Confirmed period surface | REQUIRED |
| Pages | `Search Pages` | Page search capability supported in the target-era app | SUPPORTED |
| Page Detail | None | No confirmed detail-surface Search evidence | NOT_EVIDENCED |
| Requests | None | No confirmed target-version evidence in the current evidence set | NOT_EVIDENCED |
| Inbox | None | Search placement is not established by current evidence | HOLD |
| Chat | None | Roster search is plausible but not established for the locked target version | HOLD |
| Chat Conversation | None | No conversation-local Search evidence | NOT_EVIDENCED |
| Places | None | Place-search geometry is not established by current evidence | HOLD |
| Events | None | No confirmed target-version evidence in the current evidence set | NOT_EVIDENCED |
| Photos | None | No confirmed Photos-root Search evidence | NOT_EVIDENCED |
| Notes | None | No confirmed target-version evidence in the current evidence set | NOT_EVIDENCED |
| Notifications | None | No confirmed target-version evidence in the current evidence set | NOT_EVIDENCED |
| Comments | None | Frozen Comments structure has no Search | REJECTED |
| Photo Detail | None | Frozen image-focused route has no Search | REJECTED |
| Generic Post Detail | None | No confirmed detail-local Search evidence | NOT_EVIDENCED |

This pass changes only Home, Friends, and Pages field alignment and magnifier consistency. It does not add Search to any other route, and it introduces no Search selector under `.facebook-feed`.

The initial Friends graph also includes exactly three existing Facebook-local peripheral actors: Emily, Mike, and Ryan. They retain their established ephemeral IDs, fixed avatars, sparse Facebook-local Profiles, and `EPHEMERAL_FRIEND_OF_FRIEND` classification. This list inclusion does not promote them into the canonical core cast or establish new relationship canon. Their names participate in the same display-name sorting and naturally expose the `E`, `M`, and `R` list positions.

### Pages Minimal Functional Seed v1.2

- Pages searchable and viewable: PERIOD-EVIDENCE
- `Become a Fan`: PERIOD-EVIDENCE
- Page administration: PERIOD-EVIDENCE / OUT-OF-SCOPE
- Home Page shortcuts: PERIOD-EVIDENCE / FROZEN-IA
- Exact October 2010 Page-detail chrome: HOLD / VISUAL-CROSSCHECK

The exact Page set is High School Festival, Main Street Diner, and Gelato Roma. Main Street Diner and Gelato Roma reference their existing canonical venue IDs rather than creating duplicate businesses. None has an approved Page logo, so all three use the existing neutral placeholder treatment. Page records contain no human actor identity, biography, fabricated timeline, News Feed injection, administration role, or inferred user preference.

Page search is local, deterministic, case-insensitive, and filters only these three Page records. Opening a row uses a Page-specific detail route with name, category, neutral avatar placeholder, sparse Wall, and session-local fan state. Reset restores the initial non-fan baseline.

## Profile Exact Geometry v1.0

The Profile remains the existing compact pre-Timeline structure: shared Facebook navigation chrome, one square identity image, a dense name/friend block, Wall / Info / Photos / Friends section controls, and one authoritative Wall scroll node. No cover photo, circular hero avatar, Timeline layout, modern pills, action cluster, biography field, story, or route was added.

| Element | Previous geometry | Adjusted geometry | Evidence status |
| --- | --- | --- | --- |
| Profile navigation chrome | Shared 44px bar | Shared 44px geometry retained; Profile adjacency adds only border/highlight isolation | PERIOD-EVIDENCE |
| Profile header | 74px minimum; 8px × 10px padding | 68px minimum; 6px × 8px padding; compact gray identity unit | VISUAL-CROSSCHECK |
| Profile picture | 58px square without explicit frame | 54px square with 1px frame, white inset, and square crop | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Name block | 17px name with 4px gap | 16px name, 3px gap, bounded single-line identity hierarchy | VISUAL-CROSSCHECK |
| Section navigation | 33px four-column strip | 31px beveled four-column strip with inset selected state | PERIOD-EVIDENCE |
| Wall density | Shared story geometry | 34px avatar, 6px × 8px rows, 10px timestamp, Profile-only 88% single-photo preview | VISUAL-CROSSCHECK |
| Info rows | Unstyled definition list | 82px label column, 34px compact divided rows, white value cells | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Photos entry | 70px global rows and 58px × 54px thumbnails | Profile-only 62px rows, 48px square thumbnails, count hierarchy, disclosure indicator | VISUAL-CROSSCHECK |
| Friends entry | 58px global text rows | Profile-only 44px compact text rows; global Friends UI is not duplicated | HOLD / VISUAL-CROSSCHECK |

The Profile Wall retains `facebook-profile-wall` as its sole vertical scroll container and preserves the existing snapshot/Back restoration events. Its media sizing is explicitly independent of the frozen News Feed 68% token. June and Jack continue using dense canonical history; Matt retains distinct owned/tagged media semantics; Chris remains intentionally sparse; Ben's long Wall remains data-identical. Detailed Album fidelity and Generic Post Detail remain separate HOLD surfaces.

All new selectors are limited to `.facebook-profile`, `.facebook-profile-wall`, or the navigation bar immediately followed by `.facebook-profile`. Feed, Comments, Photo Detail, Friends/Pages, Inbox, Chat, Home, scheduler, relationships, content, and canonical interaction state are unchanged.

## Profile Historical Structure + Identity Block v1.0

The Profile Exact Geometry v1.0 pass remains `COMPLETED`. Its blue navigation treatment, Profile-scoped typography, Wall density, section spacing, Info rows, Photos rows, Friends entry, and authoritative Wall scroll behavior remain valid. Only its implicit identity/header assumptions are `PARTIALLY SUPERSEDED` by this structural restoration.

The former anonymous header grouping and any resulting name-only blank-region presentation are `SUPERSEDED`. Profile identity is now represented by explicit `facebook-profile-identity-media` and `facebook-profile-identity-copy` regions within one compact header. The media region consumes only the existing actor-derived `profileMediaId`, resolved through `getFacebookStoryMedia`; it never consults album, owned-photo, or tagged-photo collections. A neutral explicit placeholder remains available for the current user or any Facebook-local identity without approved profile media.

| Element | Status |
| --- | --- |
| Pre-Timeline Profile structure | PERIOD-EVIDENCE |
| Visible square profile picture | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Display name associated directly with avatar | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Compact identity block | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Exact avatar/name placement | HOLD pending target screenshot comparison |
| Wall / Info / Photos / Friends functional order | PERIOD-EVIDENCE |
| Exact section-navigation chrome | HOLD / VISUAL-CROSSCHECK |
| Top title wording `Profile` | HOLD; unchanged in this pass |
| Name-only blank hero region | SUPERSEDED |
| Profile Exact Geometry v1.0 | COMPLETED / identity-header assumptions partially superseded |

The v1.0 68px header, 54px square avatar frame, 16px name, 31px section strip, Profile Wall media boundary, and all non-header section geometry were retained through the structural restoration for comparison. Profile Identity + Wall Geometry v1.1 then refines only the evidence-sensitive identity dimensions and Wall single-photo scale described below.

## Profile Identity + Wall Geometry v1.1

The passive `Friend` label on an already-friended Profile is `NOT_EVIDENCED / REMOVED`. Friendship remains entirely state-driven and unchanged; accepting Jack still updates the canonical friends graph, Chat visibility, and party eligibility without adding a permanent relationship-status subtitle. The existing runtime has no Profile-local `Add as Friend` action, so this pass does not invent one or move the established Requests workflow. `Add as Friend` as a historical non-friend action remains `PERIOD-EVIDENCE / HOLD` for a separately scoped implementation decision.

The identity block remains the v1.0 explicit actor-media + display-name structure, refined from a 68px header with a 54px avatar to a 64px header with a 52px avatar. Padding remains 6px vertically and 8px horizontally; the avatar/name gap becomes 9px. The single 16px display name is left-aligned and vertically centered against the avatar without an empty subtitle line. Exact avatar/name placement remains `HOLD / VISUAL-CROSSCHECK`.

Wall / Info / Photos / Friends order remains `PERIOD-EVIDENCE`, while exact section-tab chrome remains `HOLD / VISUAL-CROSSCHECK`; the existing 31px strip and selected state are unchanged. Profile Wall single-photo media changes from 88% / 226px maximum to 82% / 212px maximum as `VISUAL-CROSSCHECK`. It remains larger than the visually frozen News Feed 68% preview, preserves intrinsic aspect ratio, and applies equally to profile-picture updates and other single-photo Wall stories without orientation analysis or media special cases.

All v1.0 Wall density, avatar typography, timestamp, Like / Comment presentation, separators, multi-photo geometry, Info rows, Photos rows, Friends entry, actor-media resolution, scroll snapshots, and Back navigation remain unchanged. No friendship state, request transition, Feed audience, Chat roster rule, Event eligibility, content, media, scheduler, or global time is altered.

## Feed / Detail Media Scale Boundary v1.2.3

News Feed compact-media and interaction selectors are rooted under `.facebook-feed`. The shared `.facebook-feed-row` retains the earlier Wall-compatible geometry, while direct Feed rows receive the v1.1 density overrides through `.facebook-feed > .facebook-feed-row`.

### News Feed

Single-photo previews remain 68 percent, two-photo previews remain 74 percent, and three-photo/other multi-photo previews remain 76 percent. These values apply only when `.facebook-story-view.is-feed` is inside `.facebook-feed`.

Status: READY / VISUAL-CROSSCHECK

### Post Detail

Post Detail continues using the shared full available content width with its existing side margins and thin media frame. It does not inherit any 68/74/76-percent Feed preview rule.

Status: READY

### Photo Detail

Photo Detail remains governed by `.facebook-photo-viewer` and its image-focused viewer geometry. It does not inherit News Feed preview sizing.

Status: READY

### Canonical media identity

Feed preview, Post Detail, and Photo Detail continue resolving through the existing canonical story/media path. This pass changes selector scope only and creates no media copy, alternate ID, interaction fork, or ownership change.

## Post Detail Aspect Ratio Fix v1.2.4

### Root cause

The shared story-image rule used `max-height: 184px` with `object-fit: cover`. News Feed had a later Feed-scoped intrinsic-ratio override, but Post Detail did not. As a result, tall source media was enlarged to the Detail content width and then cropped against the inherited height ceiling.

### Post Detail rule

Post Detail single-photo media now uses the available Detail content width with:

- `width: 100%`
- `height: auto`
- `max-height: none`
- `object-fit: contain`

The existing ten-pixel Detail padding, thin media frame, source asset, canonical media ID, and interaction binding remain unchanged.

Post Detail intrinsic aspect preservation: READY / safe reconstruction

Exact historical rendered width: VISUAL-CROSSCHECK

### Surface boundary

News Feed retains its compact 68-percent single-photo preview. Photo Detail continues using its existing image-focused `.facebook-photo-viewer` rule with `object-fit: contain`. No cropped derivative or alternate media identity was created.

### Superseded treatment

The permanently visible Feed `Like | Comment` implementation is SUPERSEDED. The v1.1 and v1.1.1 geometry remains relevant only to the compact action group after disclosure.

## Story Action + Media Scale Correction v1.2.1

### Story action trigger placement

The Feed story article is the positioning context. In the collapsed state, the `+` control is positioned eight pixels from the story's right edge and vertically centered with `top: 50%` plus `translateY(-50%)`. Story text reserves a modest right-side action gutter.

When expanded, the existing Like / Comment group and the close toggle move to the lower-right interaction region. They remain absolutely positioned, so disclosure does not add story height or alter Feed scroll geometry.

Status: PERIOD-EVIDENCE

### Single-photo Feed media scale

Ordinary single-photo Feed attachments use 76 percent of the story content-column width. Images retain automatic height, their original aspect ratio, the existing two-pixel white inset, and the existing gray frame. This value is a visual tuning target rather than a claimed measured historical pixel value.

Status: PERIOD-EVIDENCE / VISUAL-CROSSCHECK

### Multi-photo Feed media scale

Album and multi-photo previews use 86 percent of the story content-column width, reducing their overall footprint by 14 percent. Existing image count, ordering, grid composition, two-pixel gap, and attached caption strip remain unchanged.

Status: VISUAL-CROSSCHECK

### Scope boundary

These media-width and action-positioning rules require `.facebook-story-view.is-feed`. Profile Wall, Post Detail, Photo Detail, Albums, and Photos of Name retain their existing media dimensions and interaction placement.

## Media Scale + Expanded Action Bar v1.2.2

### Orientation boundary

The Facebook media registry does not contain reliable orientation or aspect metadata. Runtime image analysis and new media architecture are outside this visual pass. Therefore v1.2.2 applies the specified conservative fallback rather than claiming portrait/landscape-specific classification.

All ordinary single-photo Feed attachments use 68 percent of the available content width. The previous 76-percent single-photo value is SUPERSEDED. Portrait, ordinary, and landscape single-photo stories currently share this fallback width until approved orientation metadata exists.

Status: PERIOD-EVIDENCE / VISUAL-CROSSCHECK

### Multi-photo preview scale

Two-photo Feed previews use 74 percent of the content width. Three-photo and other multi-photo Feed previews use 76 percent. Existing two-pixel gaps, row/grid composition, photo ordering, image count, and attached caption strip remain unchanged.

Status: VISUAL-CROSSCHECK

### Expanded action bar

Native `<details>` remains the UI-only disclosure mechanism. The collapsed `+` remains eight pixels from the story's right edge and vertically centered before and after expansion.

Opening the disclosure adds a 32-pixel horizontal action bar at the bottom of the story. It spans the Feed story row, uses two equal action regions, preserves Like then Comment ordering, and uses a dark Facebook-blue gradient with thin borders, a central divider, highlight, and period-style text shadow. Closing the same `+` removes the bar and restores the compact story height.

Pre-2011 expanded full-width blue Like / Comment bar: PERIOD-EVIDENCE

Exact bar gradient and pixel geometry: VISUAL-CROSSCHECK

Exact plus artwork: PERIOD-EVIDENCE / CSS RECONSTRUCTION
