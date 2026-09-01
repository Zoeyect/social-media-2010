# Instagram 2010 Visual Reconstruction v1.0

## Checkpoint A scope

Target: Instagram initial 1.x-era iPhone application, October 2010, iPhone 4 / iOS 4.1.

Checkpoint A changes only the shared Instagram navigation/tab shell, Feed presentation, and Popular grid. Share/source, Filters, News content, Profile content, Camera, Photos, persistence, device chrome, and narrative data remain outside this checkpoint.

## Evidence

Primary visual evidence is the Web Design Museum's 320×480 Instagram 2010 Feed, Filters, Popular, Location, and Profile screenshots. October 2010 Macworld, VentureBeat, Wired, and TechCrunch reporting corroborates the launch feature set but does not authenticate individual application-bundle rasters.

No original Instagram 1.x bundle artwork is present in the repository. Every new Instagram chrome asset in `src/assets/instagram/chrome` is therefore `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.

## Shared shell classification

| Decision | Value | Classification |
| --- | --- | --- |
| System status bar | 320×20pt, unchanged shared renderer | **CONFIRMED** |
| Instagram application surface | 320×460pt | **CONFIRMED** |
| Top navigation | x=0, y=0, w=320, h=44pt | **CONFIRMED** screenshot measurement |
| Root content | x=0, y=44, w=320, h=368pt | **CONFIRMED** derived from screenshot regions |
| Bottom tabs | x=0, y=412, w=320, h=48pt | **CONFIRMED** screenshot measurement |
| Tab division | five 64pt divisions | **CONFIRMED** |
| Blue/steel nav gradient and bevel values | CSS approximation | **RECONSTRUCTED** |
| Charcoal tab material and selected highlight | CSS approximation | **RECONSTRUCTED** |
| Raised Share housing | 64×36pt visible housing inside an approximately 64×54pt control, protruding 6pt | **RECONSTRUCTED** |
| Feed/Popular/Share/News/Profile icon silhouettes | Screenshot-derived standalone SVG reconstructions | **RECONSTRUCTED** |
| Exact original bundle icon pixels and pressed states | unavailable | **HOLD** |

## Feed classification

| Decision | Value | Classification |
| --- | --- | --- |
| Center script wordmark instead of system text | required by period Feed screenshot | **CONFIRMED** |
| Wordmark raster/path identity | standalone SVG using a period-style script face | **RECONSTRUCTED** |
| Refresh control at upper right | visible in period Feed screenshot | **CONFIRMED** |
| Refresh glyph pixels/material | reconstructed SVG plus shared nav button | **RECONSTRUCTED** |
| Metadata row | 42pt | **PROBABLE** screenshot measurement within 1pt |
| Avatar | 30×30pt at 7pt left inset | **PROBABLE** screenshot measurement |
| Photo | 305×305pt, 7pt left / 8pt right inset, centered cover | **PROBABLE** screenshot measurement |
| Relative timestamp units | minutes, hours, days from simulated device time | **RECONSTRUCTED** formatting behavior |
| Exact early-Instagram rounding and `now` behavior | unavailable | **HOLD** |

Canonical timestamps remain unchanged. Rendering uses the simulated 2010 device `Date`, never the host clock. Invalid timestamps conservatively render `now`; future timestamps clamp to the current-minute presentation.

Feed identities, June's curated avatar/media, post order, followed-account filtering, and the timed deletion/replacement events are unchanged. No likes, comments, captions, avatars, or posts were added.

## Popular classification

| Decision | Value | Classification |
| --- | --- | --- |
| Four fixed columns | period Popular screenshot | **CONFIRMED** |
| 80pt outer cell pitch | 320pt / four columns | **CONFIRMED** |
| 76×76pt visible image with 2pt inset | screenshot-derived approximation | **RECONSTRUCTED** |
| Grid begins immediately below the 44pt nav | period screenshot | **CONFIRMED** |
| Centered-cover crop | conservative rendering of existing square media | **PROBABLE** |
| Exact original Popular ranking/crops | unavailable | **HOLD** |

All twenty existing Popular records, their deterministic order, refresh counter behavior, scroll restoration, and Photo Detail/back state are unchanged. Popular Photo Detail remains `HOLD` except for inheriting the shared shell.

## Asset register

The following are `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`, not authenticated or extracted originals:

- `instagram-wordmark-2010-reconstructed.svg`
- `instagram-feed-2010-reconstructed.svg`
- `instagram-popular-2010-reconstructed.svg`
- `instagram-share-2010-reconstructed.svg`
- `instagram-news-2010-reconstructed.svg`
- `instagram-profile-2010-reconstructed.svg`
- `instagram-refresh-2010-reconstructed.svg`

## HOLD / later checkpoints

- Original Instagram bundle artwork and cap-stretched control assets
- Exact Feed refresh network/runtime behavior
- Popular Photo Detail chrome
- Share/source and Camera Roll integration
- Filters screen and filmstrip
- News content/empty-state reconstruction
- Profile title/action/content reconstruction

## Checkpoint B — Share / Filters

Checkpoint B replaces the normal-runtime development fixture with the current experience's authorized Camera Roll media. It implements only the saved-photo path:

```text
Instagram Share
→ system Camera Roll picker mode
→ Filters
→ Share
→ one player Instagram post
```

The broad ability to choose an existing saved photo and then apply filters is supported by October–December 2010 reporting. The picker is implemented as a narrow mode of the existing iOS 4 Photos / Camera Roll presentation rather than an unsupported custom Instagram gallery. Exact `UIImagePickerController` raster composition and picker-specific geometry remain **RECONSTRUCTED / HOLD**.

### Media and ownership boundary

`App` supplies Instagram with the already-authorized `CameraRollInitialization`. Instagram does not import Camera Roll persistence or query IndexedDB. Reducer state stores only `selectedCameraRollPhotoId`; posted player media stores `source: "camera-roll"` plus `sourcePhotoId`. Blob data, copied JPEG data, and runtime object URLs never enter Instagram state.

The selected and posted IDs resolve only against the current runtime Camera Roll collection, which is already restricted to the active `experienceSessionId`. Missing draft media invalidates the draft and returns to the picker. Missing posted media renders no fallback. Camera Roll source records are never mutated, moved, or deleted by Instagram.

### System picker classification

| Decision | Value | Classification |
| --- | --- | --- |
| Saved-photo selection uses the system Photos / Camera Roll visual system | narrow `PhotosContainer mode="picker"` | **PROBABLE** historical architecture |
| Picker title | `Camera Roll` | **CONFIRMED** system naming |
| Picker Cancel control, grid geometry, and state-message placement | existing reconstructed Photos chrome | **RECONSTRUCTED / HOLD** |
| Thumbnail ordering | existing chronological Camera Roll ordering; newest at end | **PROBABLE** |
| Thumbnail selection | returns stable photo ID without opening the viewer | **RECONSTRUCTED** interaction bridge |

Normal Photos album browsing, Camera Roll browsing, paging viewer, persistence, ownership queries, object URL lifecycle, and IndexedDB schema remain unchanged.

### Filters classification

| Decision | Value | Classification |
| --- | --- | --- |
| Navigation | Back / Filters / Next in 320×44pt shared chrome | **CONFIRMED** period screenshot structure |
| Preview | x=0, y=44, 320×320pt | **CONFIRMED / PROBABLE** screenshot measurement |
| Filmstrip | x=0, y=364, 320×96pt | **CONFIRMED / PROBABLE** screenshot measurement |
| Processing state | internal `Original`, visible `Normal`; `X-Pro II`, `Lomo-fi`, `Earlybird`, and `1977` | names/order **CONFIRMED**; visual character **PERIOD-REFERENCE-INFORMED**; exact parameters **RECONSTRUCTED** |
| Option pitch | 70pt; five-option 350pt horizontally scrolling track | **RECONSTRUCTED** |
| Thumbnail | 48×48pt within a 58×58pt selected frame | **RECONSTRUCTED** |
| Launch filters | all five visible options are functional through one deterministic renderer | original proprietary algorithms **HOLD** |
| Preview crop | centered square cover of the selected Camera Roll JPEG | **RECONSTRUCTED** |

No crop editor or nonfunctional filter buttons are introduced. The original Camera Roll JPEG remains unchanged; only filter identity is stored in Instagram state.

### Share classification

Share uses the shared 44pt Instagram navigation with Back, Share, and Post. The selected JPEG appears in a restrained 80pt source row with a 64×64pt square preview. No caption, account filler, location control, social destination control, or modern share sheet is rendered. Exact launch-era Share composition remains **HOLD**; the minimal runtime presentation is **RECONSTRUCTED**.

`POST_FIRST_PHOTO` appends a player post using the selected stable Camera Roll ID. Feed and Profile resolve the same authorized JPEG; the Camera Roll record remains untouched. Instagram supports multiple player posts within the current experience session, including intentional reuse of one source record.

### Empty and failure states

- Loading: `Loading Camera Roll…`
- Error: `Camera Roll Unavailable`
- Ready with no records: `No Photos`

All retain Cancel. Exact copy and layout remain **RECONSTRUCTED / HOLD**. There is no development fixture, fabricated photo, unsupported Camera handoff, or cross-session fallback.

## Checkpoint C — News / Profile final visual pass

Checkpoint C completes the narrow launch-era News and Profile presentation without changing Instagram state, media ownership, Feed, Popular, Share, Filters, Camera Roll, or shared application chrome.

### News classification

| Decision | Value | Classification |
| --- | --- | --- |
| News tab and narrative-empty project behavior | existing root tab with no seeded activity | **CONFIRMED** |
| Navigation title | `News` | **CONFIRMED** shared-root label |
| Content region | 320×368pt beneath the frozen 44pt navigation and above the frozen 48pt tabs | **CONFIRMED** shared-shell geometry |
| Empty copy | `No new activity.` | **RECONSTRUCTED** |
| Empty-state placement | centered 12pt Helvetica on the approved neutral Instagram content background | **RECONSTRUCTED** |
| Exact launch-build empty-state copy and pixel placement | unavailable | **HOLD** |

News intentionally contains no activity rows, fabricated identities, badges, explanatory copy, cards, illustrations, or modern notification treatments.

### Player Profile classification

| Decision | Value | Classification |
| --- | --- | --- |
| Navigation title | existing account-label-derived handle such as `@zoey` | **RECONSTRUCTED**; no new persisted username |
| Overall architecture | summary followed by chronological vertical photo stream | **CONFIRMED** period structure |
| Summary geometry | approximately 96pt dark summary, 74×74pt avatar, three 67×48pt steel-blue statistic blocks with approximately 7pt gaps | **PROBABLE** screenshot measurement; material remains **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT** |
| Player avatar | neutral initial placeholder derived from the existing identity name | **RECONSTRUCTED** |
| Find Friends control | centered 190×28pt steel-blue beveled button with 7pt vertical margins | **RECONSTRUCTED** placement and material |
| Profile post media | existing stable Camera Roll source IDs resolved through the current experience's authorized collection | existing functional behavior, unchanged |
| Empty stream | existing `No photos yet.` state | **RECONSTRUCTED / HOLD** |

No profile grid, biography, website, Edit Profile, stories, highlights, modern settings, or other unsupported fields are introduced.

### Known-account Profile classification

The known-account path retains the shared Profile architecture and all existing June behavior: `junepark` navigation title, Back control, curated avatar/media, statistic values, Follow/Following control, and vertical chronological stream. The shared summary proportions are **PROBABLE / RECONSTRUCTED**. Follow-control geometry and exact early-build relationship chrome remain **RECONSTRUCTED / HOLD**. No reducer, follow-state, or navigation behavior changed.

### Instagram 2010 Architecture v1.0 — LOCKED

The following Instagram 2010 v1.0 architecture and geometry remain locked:

- 320×460pt application surface, 44pt steel-blue navigation, 368pt content region, and 48pt charcoal five-tab bar
- five 64pt tab divisions and the 64×36pt raised Share housing frame with 6pt protrusion
- approved Feed metadata/avatar/photo proportions and Popular four-column geometry
- approved Filters navigation, 320×320 preview, and 96pt filmstrip proportions
- News root presentation and player/known-account Profile architecture; Profile internal geometry is governed by the later direct-raster v1.1c measurement below

Locking architecture does not upgrade evidence confidence or freeze unresolved artwork, behavior or content. The following remain outside the lock:

- Popular Detail historical correction
- exact News activity-row design
- unsupported Share destination controls and exact Share composition
- future real filter expansion and filmstrip micro-geometry
- direct Camera handoff
- original application-bundle artwork, exact cap stretches, pressed states, picker micro-geometry, Find Friends placement/material, follow-control geometry, and all other explicitly **HOLD** artwork/runtime details

No Instagram chrome asset in this reconstruction is authenticated application-bundle artwork.

### Instagram 2010 Visual Artwork / Material Authenticity — OPEN

The screenshot-derived wordmark, tab artwork, selected states, navigation material, control-cap material, icon highlights, pressed states, avatar framing, clock glyph and photo-border treatment remain revisable when stronger target-build evidence becomes available. They must not be represented as authenticated application-bundle artwork.

## Visual Authenticity v1.1 — Checkpoint A: Chrome / Feed metadata

Checkpoint A changes only reconstructed chrome artwork, material details and Feed metadata rendering. The locked navigation, tab, Feed photo, Popular, Filters and Profile geometry remain unchanged. Instagram state, Camera Roll ownership, narrative data and timestamps are unchanged.

### State-aware tab artwork

Each ordinary root tab now uses separate unselected and selected SVG artwork. Selected state is not generated by masking or recoloring the unselected file.

| Tab | Unselected / selected canvas | Reconstructed details |
| --- | --- | --- |
| Feed | 27×23pt | two-part people/feed form, internal highlights, dark outline, blue/white selected treatment |
| Popular | 25×22pt | outlined heart, highlight stroke, enamel-like selected blue gradient |
| News | 26×23pt | layered newspaper/page structure, image well and internal rows |
| Profile | 27×22pt | account-card frame, portrait well and internal information rows |
| Share | 28×22pt | metallic camera body, lens rings/highlight and small flash detail |

The selected 64×48pt cell uses a denser steel-blue upper field, dark lower field, top highlight and explicit edge relationship with the unchanged tab dividers. The ordinary bar remains charcoal with a narrow highlight and dark lower material. The raised Share housing retains its locked 64×36pt frame and 6pt protrusion while receiving reconstructed metallic depth.

All tab and Share files remain **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**. Exact original rasters, animation and pressed artwork remain **HOLD**.

### Navigation and controls

- Navigation remains 320×44pt with a tighter top highlight, brighter upper steel blue, darker lower blue and hard bottom separator.
- The wordmark is deterministic 122×29pt path artwork. It contains no live text or installed-font dependency.
- Refresh remains within a 35×31pt control and uses an 18×22pt slim reconstructed arrow.
- Back uses a fixed 52×31pt frame.
- Next and Post use fixed 42×31pt frames. The known-account relationship control is explicitly excluded and remains **RECONSTRUCTED / HOLD**.
- Button caps, gradients, borders and highlights are **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**. Exact cap-stretch internals and pressed-state rasters remain **HOLD**.

### Feed metadata details

The Feed row remains 320×42pt, the avatar remains 30×30pt at the approved left inset, username/timestamp sizes remain 13pt/11pt, and the Feed photo remains 305×305pt.

Checkpoint A adds a light/dark avatar frame with restrained edge shadow, adjusts username tone and baseline material, renders a deterministic 9×9pt clock with visible hands/center, moves the metadata field toward the period near-white tone, and lightens the photo separator. The clock and frame treatment are **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**. June content and simulated-time labels are unchanged.

### Checkpoint A asset provenance

Every file in `src/assets/instagram/chrome` created or revised by this checkpoint is labeled `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`. No original Instagram bundle provenance is claimed.

Profile material, Filters expansion and News content remain outside Checkpoint A. News receives only the shared tab/chrome artwork.

## Visual Authenticity v1.1a — Interaction / chrome correction

### Back control

All shared Instagram Back surfaces use one deterministic 52×31pt SVG background with a continuous pointed-left pentagonal silhouette. The steel-blue gradient, upper highlight, dark lower edge and silhouette are **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**. The control retains live white `Back` text and existing navigation handlers. It is not a modern chevron, pasted CSS triangle or rounded rectangle. Exact UIKit cap-stretch and pressed-state artwork remain **HOLD**.

### Raised Share control

The Share envelope remains locked at one 64pt tab division with a 64×36pt housing raised 6pt. The upper housing now uses an arched mechanical silhouette, dark metallic rim, light upper edge, opaque inset panel and lower joining body. The existing 28×22pt reconstructed camera artwork remains centered. Shape and material remain **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**.

### Multi-post behavior

The earlier project-specific one-post restriction is superseded. `BEGIN_FIRST_PHOTO` always begins a fresh authorized source-selection workflow, and `POST_FIRST_PHOTO` accepts every complete draft while the Share screen is active. Each post appends to `state.photos` and receives a deterministic session-local ID:

```text
instagram-user-photo-0001
instagram-user-photo-0002
instagram-user-photo-0003
…
```

The next sequence is derived from existing current-session player post IDs, so it survives ordinary in-experience state continuity and resets with the existing Instagram experience boundary. Each post retains its owner, stable Camera Roll source ID, selected filter, simulated creation time and `origin: "user"`. No Blob is copied into Instagram state, the same authorized Camera Roll source may be posted more than once, and source records remain unchanged.

After Post, only the completed draft is cleared and the view returns to Feed. Previous posts remain in append order, Profile Photos continues to derive from `state.photos.length`, and the Share tab remains interactive with full opacity regardless of post count. A new experience still restores the empty player-post seed baseline through the existing `RESET` semantics.

## Visual Authenticity v1.1b — Bottom tab icon fidelity

This pass changes reconstructed SVG artwork only. The 48pt tab bar, five 64pt divisions, 64×36pt Share housing, 6pt Share protrusion, labels, grid rows, selected/unselected rendering architecture, navigation and state are unchanged.

Primary comparison remains the Web Design Museum 2010 320×480 screenshots. Since no authenticated Instagram 1.x application-bundle rasters are available, every icon below remains **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**.

| Icon | Reference visible bounds | Prior canvas / visible bounds | Revised canvas / visible bounds | Optical center | Revision |
| --- | --- | --- | --- | --- | --- |
| Feed | approximately 27×22pt | 27×23pt / approximately 25×21pt | 27×23pt / approximately 25×21pt | 13.5, 11.5 | three-person group built only from fills; selected foreground body is cyan/blue while heads remain light |
| Popular | approximately 25×20pt | 25×22pt / approximately 24×21pt | 25×22pt / approximately 23.4×19.6pt | 12.5, 11 | flat filled heart with a restrained lower tonal region; no perimeter or highlight stroke |
| Share | approximately 28×20pt | 28×22pt / approximately 27×19pt | 28×22pt / approximately 26×17pt | 14, 11.5 | one silver camera-body fill, integrated top protrusion and two charcoal lens fills; no contour, gloss or edge accent |
| News | approximately 26×22pt | 26×23pt / approximately 23×21pt | 26×23pt / approximately 23.5×21.1pt | 13, 11.5 | overlapping filled cards with narrow filled detail bars; no panel or separator strokes |
| Profile | approximately 27×21pt | 27×22pt / approximately 26×20pt | 27×22pt / approximately 25×18pt | 13.5, 11.5 | filled ID-card body, portrait region and short filled information bars; no perimeter or internal strokes |

The final Share body fill is 26×17pt. Its dominant charcoal lens fill is 8.6×8.6pt, yielding body-to-lens ratios of approximately 3.02:1 horizontally and 1.98:1 vertically. One 4.4×4.4pt inner tonal lens fill remains visible at logical size. The camera remains centered at x=14, y=11.5 in the existing 28×22pt artwork slot inside the unchanged housing.

All nine Feed, Popular, News and Profile state SVGs plus the Share SVG explicitly inherit `stroke="none"`. They contain no outline, inner or outer stroke, filter, drop shadow, gradient, gloss line, bevel line or edge accent. Silhouette separation is produced only through flat fills, overlapping tonal regions and narrow filled detail rectangles.

The direct 2010 screenshots evidence selected Feed and Popular treatment but do not resolve selected News or Profile micro-artwork. Those two selected tonal variants preserve the existing state architecture and remain explicitly **HOLD**; no additional selected-state detail was inferred.

## Visual Authenticity v1.1c — Exact optical alignment

The direct Web Design Museum 320×480 Feed screenshot establishes a common visible label baseline at screenshot y=475. Main glyph pixels occupy approximately y=468–475 for Feed and y=469–475 for Popular, Share, News and Profile; occasional pixels at y=476–477 are antialiasing/shadow. This supports an approximately 9px Helvetica / Helvetica Neue face with 7–8px visible glyph height.

| Tab | Reference icon bounds | Pre-v1.1c runtime filled bounds | v1.1c runtime filled bounds | Reference label center / baseline |
| --- | --- | --- | --- | --- |
| Feed | x≈17–47, y≈438–459 | 25×20.8pt, optically grid-centered | unchanged artwork; explicit optical row gives y≈438–459 | x≈31.5 / y=475 |
| Popular | x≈84–107, y≈439–458 | 23.4×19.6pt, optically grid-centered | unchanged artwork; explicit optical row gives y≈438–458 | x≈95.5 / y=475 |
| Share | x≈146–176, y≈436–459 | 26×17pt body, 8.6pt lens | 27×14.5pt main body, 27×18pt total silhouette, 8pt lens | x≈159.5 / y=475 |
| News | x≈210–236, y≈438–460 | 23.5×21.1pt, optically grid-centered | unchanged artwork; explicit optical row gives y≈438–459 | x≈224 / y=475 |
| Profile | x≈276–299, y≈441–457 | 25×18pt, optically grid-centered | unchanged artwork; explicit optical row gives y≈440–458 | x≈287 / y=475 |

The reference Share main body is approximately 30–31px wide and 17–18px high after JPEG antialiasing, with an approximately 9px lens. The pre-v1.1c reconstruction used a 26×17pt body and 8.6pt lens, or about 3.02:1 horizontally and 1.98:1 vertically. The v1.1c retrace uses a 27×14.5pt main body, an 18pt total silhouette including the integrated finder, and an 8pt lens: approximately 3.38:1 horizontally and 1.81:1 vertically for the main body. The right-side 2.8×1.8pt detail is a fill, not an outline.

Before v1.1c, CSS declared 9px text with 11px line-height, but ordinary labels were grid-positioned, Share used an independent `bottom: 2px`, and selected tabs inherited bold weight. v1.1c retains the evidenced 9px/11px typography while setting one explicit label box at tab-local `top: 34px`, normal weight, and a common reconstructed baseline corresponding to screenshot y=475. String width affects horizontal centering only.

Ordinary icon canvases now occupy one explicit 28×24pt optical row at tab-local x=18, y=4. The Share camera retains its 28×22pt canvas and is independently positioned at housing-local x=18, y=9. The 320×48pt bar, five 64pt cells, 64×36pt housing and 6pt protrusion remain unchanged. All tab SVG artwork continues to inherit `stroke="none"`; News/Profile selected micro-detail remains **HOLD**.

## Visual Authenticity v1.1d — Share housing silhouette

The prior 64×36pt CSS housing used compound `border-radius`, nested rounded pseudo-elements, gradients and inset shadows. It ended around tab-local y=30 and read as a floating rounded card rather than the continuous molded center tab visible in the reference.

The direct 320×480 reference crop normalizes to the Share-cell origin as follows:

| Measurement | Normalized value |
| --- | --- |
| Total visible width | 64pt, x=0…64 |
| Total molded-tab height | approximately 55pt, y=-7…48 |
| Dome apex | x≈32, y≈-7 |
| Dome side start | y≈0 |
| Side walls | x≈0 and x≈64, nearly vertical |
| Left curvature transitions | approximately (6,-3), (18,-7), (32,-7), mirrored right |
| Upper/lower split | y≈28 |
| Lower continuation | through tab bottom y=48 |

The deterministic replacement is `instagram-share-housing-2010-reconstructed.svg`, rendered at 64×55pt from tab-local y=-7. Its outer fill uses the normalized path `M0 7C6 4 18 0 32 0s26 4 32 7v48H0V7Z`, producing a centered broad dome that feeds directly into vertical side walls and continues behind the Share label to the tab bottom.

Material is separated into filled regions only: a thin upper rim, graphite outer dome, slightly lighter inner upper field, a 1pt divider at tab-local y=28, and a darker lower field continuing through y=48. The SVG has no outline, filter, gradient, drop shadow, glow or generic radius.

The camera SVG is unchanged. Moving its housing-local y from 9 to 10 exactly compensates for the housing origin moving from -6 to -7, preserving the camera's tab-global y=3 position. The shared label declaration remains unchanged at `top: 34px`, 9px/11px normal-weight Helvetica Neue/Helvetica; its reconstructed common baseline is unaffected.

No icon wrapper, tab cell, grid row, label baseline, Share envelope or protrusion declaration changed. Consequently the asset centers and icon-to-label relationship remain fixed; all optical changes occur within the existing canvases and remain within the requested 1pt placement tolerance. Exact original raster pixels and pressed artwork remain **HOLD**.

## Visual Authenticity v1.1e — Share housing material

The v1.1d silhouette, 64×55pt canvas, dome curves, side walls, y=28 divider, camera placement and CSS mounting remain unchanged. This pass replaces only the housing's flat fill colors with deterministic opaque SVG material layers, classified **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**.

The outer shell moves from graphite `#282828` through `#222222` to `#1c1c1c`. The upper rim tapers horizontally from `#505050` at the sides to `#7a7a7a` at center. Nested upper fields descend from `#303030` to `#242424` and from `#444444` to `#303030`; the lower field descends from `#191919` to `#101010`. The single-pixel divider remains at y=28 and is now the narrow dark separator `#0c0c0c`.

All stops are opaque. There is no filter, blur, shadow, glow, backdrop treatment, external stroke or added side outline. A separate broad highlight band was intentionally omitted because the reference does not establish one strongly enough at 320px runtime width. The Share camera asset and common label declaration are untouched.

## Visual Authenticity v1.1 — Wordmark fidelity correction

**Status: Instagram 2010 Wordmark — RESTORED TO STABLE BASELINE. Further reconstruction: HOLD.**

The surviving Web Design Museum native 320×480 Feed capture places the visible wordmark at approximately x=98…219 and y=28…56 in screenshot coordinates, with an optical center near x=158.5, y=42. JPEG antialiasing makes the terminal edges uncertain by about 1px. The locked 320×44pt navigation geometry is unchanged.

The superseded reconstruction materially diverged in letterform mass, rhythm and directional-depth treatment. Its paths were discarded rather than incrementally adjusted. The replacement was retraced directly from the native screenshot crop at quarter-pixel sampling, then conservatively simplified while preserving the period raster's irregular capital-I flourish, joins, bowls, ascenders, descender and terminal rhythm. It uses one closed compound path with even-odd fill in a 122×29pt SVG canvas.

The sole fill is off-white `#f4f1e8`. There is no second depth silhouette, dark edge, outline, stroke, shadow, opacity treatment, filter, live text or font dependency. Exact original RGB remains **HOLD** because the compressed screenshot cannot establish it. Any historical dark-edge or shadow treatment also remains **HOLD** pending stronger independent evidence.

The direct CSS mount is 122×29pt with a 1.5pt left translation and no vertical translation. In the unchanged centered navigation grid, this targets screenshot bounds of approximately x=98…219 and y=28…56 and optical center x=158.5, y=42; final raster edges remain subject to ±1px antialiasing uncertainty. Refresh, navigation geometry, React/state behavior, Share housing and bottom tabs are unchanged. The artwork remains **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**; original Instagram bundle artwork remains **HOLD**.

## Instagram Filters v1.1b

The Web Design Museum 2010 Filters screenshot confirms the visible launch-era sequence `Normal`, `X-Pro II`, `Lomo-fi`, `Earlybird`, and `1977`. Those identities and their order are **CONFIRMED**. Their broad visual character is **PERIOD-REFERENCE-INFORMED**. The exact browser transforms below are **RECONSTRUCTED** because the original Instagram algorithms and numerical parameters remain **HOLD**.

| Filter | Deterministic reconstructed treatment |
| --- | --- |
| Normal | unchanged source pixels at presentation time |
| X-Pro II | `contrast(1.24) saturate(1.32) brightness(.96) sepia(.08) hue-rotate(-8deg)`; faint warm-to-cool wash; strong blue-black vignette |
| Lomo-fi | `contrast(1.28) saturate(1.46) brightness(.97) sepia(.06)`; restrained warm wash; strong neutral-black vignette |
| Earlybird | `contrast(.94) saturate(.88) brightness(1.06) sepia(.34)`; amber-to-brown wash; soft brown vignette |
| 1977 | `contrast(.90) saturate(1.18) brightness(1.08) sepia(.16) hue-rotate(-12deg)`; pink/yellow wash; mild warm vignette |

One shared renderer is used by the 48×48pt filter thumbnails, 320×320pt preview, Share confirmation, player Feed media, and player Profile media. Its fixed presentation pipeline is square cover crop → CSS filter → alpha-gradient wash → radial vignette. It uses no blur, sharpening, grain, noise, frame, blend mode, derivative canvas, or JPEG export. Known-account and June seed media remain outside this player-filter renderer.

Instagram state stores only the selected filter identity beside the stable Camera Roll source ID. Every surface resolves the same authorized Camera Roll object URL, so selection and posting do not alter the source JPEG, create a derivative Blob, or change IndexedDB ownership. A new Camera Roll selection begins at internal `Original` / visible `Normal`; Filters → Share → Back preserves the current identity; a new Share draft resets to Normal.

The locked Filters surface remains 320×44pt navigation, 320×320pt preview, and 320×96pt filmstrip. The filmstrip uses five 70pt options on a real 350pt horizontal track, exposing the first four options and approximately 40pt of `1977` at the initial left position. Each option uses a 48×48pt image within a reconstructed 58×58pt frame and an approximately 10px period label. The dark textured strip and pale-rim/muted-blue-gray selected state are **RECONSTRUCTED**. There are no arrows, snapping, carousel logic, fake inertia, or visible scrollbar.

## Instagram Profile Fidelity v1.1c

The direct Web Design Museum 320×480 Profile raster supersedes the earlier reconstructed 104pt/46pt measurements without changing the locked vertical-stream architecture, information hierarchy, account behavior, navigation, media ownership or Instagram state.

The Profile summary now occupies global y≈64…160, or 96pt beneath the 44pt Instagram navigation. Its 10pt inset places the locked 74×74pt avatar at local x=10, y=10. The name/statistics column begins at local x=95: a 74pt avatar column plus an 11pt gap. The 20px/24px bold display-name row occupies local y=10…34; a 4pt gap places the statistics at local y=38…86.

The summary material is **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**: an even `#303335` charcoal field with one deterministic, low-contrast 2×2pt radial micro-pattern. It contains no random noise or heavy vertical gradient. The avatar retains its **CONFIRMED** 74×74pt outer geometry and moves from a 2px dark border to the **PROBABLE** 1px `#c4c4c4` pale-gray boundary, without rounding, shadow or glow.

Each statistic block is 67×48pt at local x=95, 169 and 243, with 7pt gaps. A 1px `#183a58` boundary encloses a solid muted-steel-blue `#386b98` upper field, restrained inset highlight and separate 16pt `#214d76` lower label field. Exact colors/material remain **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**. Number type changes from 16px/18px to 24px/27px bold; label type changes from 8px/10px to 11px/14px.

Profile post metadata rows change from 38pt to 42pt while preserving the 27×27pt stream avatar, 8pt horizontal padding and 7pt grid gap. Usernames change from 12px to 14px/16px. Both player-created and known-account posts now render a simulated-time relative label at 14px/16px with the existing reconstructed 9×9pt clock immediately before it. The relative form and clock presence are **CONFIRMED**; exact typography and shared-asset reuse are **PROBABLE**; the clock artwork remains **RECONSTRUCTED_FROM_PERIOD_SCREENSHOT**. Player filter identity continues to affect the media but no longer occupies the timestamp slot. Host time is not used.

Player Profile retains its reconstructed identity placeholder, Find Friends behavior, Camera Roll-backed filtered posts and `state.photos.length` count. Known-account Profile retains curated avatar/media, deterministic counts, Follow/Following behavior and navigation. Find Friends and Follow geometry remain **RECONSTRUCTED / HOLD**.

**KNOWN OPEN MISMATCH:** the direct Profile raster appears to inset stream media by approximately 8pt horizontally, while the current Profile stream media remains full-width. Media width is intentionally unchanged in v1.1c and remains **HOLD** pending a dedicated geometry correction. Full-width Profile media must not be classified as historically confirmed.
