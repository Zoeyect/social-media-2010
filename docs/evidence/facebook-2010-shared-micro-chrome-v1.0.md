# Facebook 2010 Shared Historical Glyph + Micro-Chrome v1.0

## Canonical boundary

- Device: iPhone 4
- OS: iOS 4.1
- Client: Facebook native iPhone app
- Target: 2010-10-20, U.S. Pacific Time
- Scope: shared glyphs and micro-chrome only

No screenshot pixels, modern icon libraries, SF Symbols, emoji, or unrelated app artwork are used. The user-supplied period captures are measurement and tracing references only. Existing Felix 1469 target-near capture evidence and the recovered adjacent Facebook 3.2.1 package audit provide supporting cross-checks.

## Shared cross-surface inventory

| Shared UI element | Home | Feed | Profile Wall | Comments | Friends | Result |
| --- | :---: | :---: | :---: | :---: | :---: | --- |
| small avatar radius |  | yes | yes | yes | yes | one `--facebook-avatar-radius: 2px` token; Profile identity geometry excluded |
| story action bubble |  | yes | yes |  |  | one `FacebookStoryActionBubble` component and one shared asset |
| comment glyph |  | yes | yes |  |  | one registered micro-glyph asset |
| Like/thumb glyph |  | yes | yes | yes |  | one registered micro-glyph asset |
| media-source mark |  | photo/album | photo/album | original photo/album story |  | one registered mark; attachment semantics only |
| camera |  | composer |  |  |  | one dedicated composer artwork component |
| unread badge | yes |  |  |  |  | one dynamic-count component shared by launcher destinations |
| transient notification icon | yes |  |  |  |  | distinct dynamic-count speech-bubble component |
| phone glyph |  |  |  |  | HOLD / unused | artwork exists; no phone metadata is invented |
| navigation-button family | yes | yes | yes | yes | yes | shared border/gradient/radius tokens; route labels remain independent |
| Friends/Pages footer family |  |  |  |  | yes | existing three tabs retained in one period segmented family |

## Reconstruction register

| Element | Reference | Date | Original asset found? | Reconstruction type | Confidence |
| --- | --- | --- | :---: | --- | --- |
| 2px small-avatar corners | user-supplied native Facebook captures | 2009–2010 | no | shared CSS token | PROBABLE |
| media-source mark | user-supplied photo-story and Comments captures | 2009–2010 | candidate only | dedicated traced SVG; photo/album classification | PROBABLE |
| comment glyph | user-supplied engagement capture | 2009–2010 | candidate only | dedicated traced SVG | RECONSTRUCTED |
| Like/thumb glyph | user-supplied engagement and Comments captures | 2009–2010 | candidate only | dedicated traced SVG | RECONSTRUCTED |
| engagement container | user-supplied Feed capture | 2009–2010 | n/a | shared CSS component grammar | PROBABLE |
| story `+` bubble existence | contemporary native Facebook Feed capture | 2009-08-27; target continuity cross-check | candidate only | shared dedicated asset/component | CONFIRMED / PERIOD-EVIDENCE |
| story `+` speech-tail silhouette and white halo | contemporary native Facebook Feed capture | 2009-08-27 | candidate only | measured compact SVG reconstruction | PERIOD-EVIDENCE |
| story `+` exact blue/gradient and production raster | contemporary native Facebook Feed capture | 2009-08-27 | no adopted original | reconstructed gradient; production asset remains unavailable | RECONSTRUCTED / HOLD |
| camera composer control | user-supplied Feed capture | 2009–2010 | candidate only | dedicated traced SVG | RECONSTRUCTED |
| Friends phone glyph | user-supplied Friends capture | 2009–2010 | candidate only | dedicated traced SVG, not rendered | HOLD |
| Friends/Pages footer | user-supplied Friends capture | 2009–2010 | n/a | shared CSS segmented family | PROBABLE |
| launcher unread badge | target-near Home capture | 2010-10-15 | candidate only | dynamic HTML/CSS component | PROBABLE |
| transient notification bubble | user-supplied Home banner capture | 2009–2010 | candidate only | distinct dynamic HTML/CSS component | RECONSTRUCTED |
| navigation-button family | user-supplied cross-surface captures | 2009–2010 | candidate only | shared CSS tokens and directional back silhouette | PROBABLE |

The recovered Facebook 3.2.1 package contains evidence-only candidates for several roles, but exact state/screen semantics were not sufficiently established for adoption. They remain candidates rather than claimed originals. All shipped secondary micro-glyphs in this pass are project reconstructions.

## Measurable implementation targets

| Metric | Implemented value | Classification |
| --- | ---: | --- |
| small avatar radius | 2px | RECONSTRUCTED |
| comment glyph box | 10 × 9px from a 20 × 18 @2x SVG canvas | RECONSTRUCTED |
| thumb glyph box | 11 × 10px from a 22 × 20 @2x SVG canvas | RECONSTRUCTED |
| media-source mark box | 9 × 11px | RECONSTRUCTED |
| story bubble visible box | 23 × 28px from a 46 × 56 @2x SVG canvas | RECONSTRUCTED |
| camera control box | 29 × 29px from a 58 × 58 @2x SVG canvas | RECONSTRUCTED |
| unread badge outer box | minimum 23 × 23px | RECONSTRUCTED |
| unread white halo | 2px layer plus 1px dark outer rim | PROBABLE / RECONSTRUCTED |
| notification icon box | 23 × 19px plus 5px tail | RECONSTRUCTED |
| footer outer height | 32px inside a 40px dock row | PROBABLE / RECONSTRUCTED |
| engagement notch | 5 × 5px, top offset -3px | RECONSTRUCTED |

## Story action bubble exact reconstruction v1.0

This subsection preserves the v1.0 baseline as an audit record. The v1.1 dimensions and paint decisions in the following section supersede it for the current implementation.

The previous shared asset still read like a rounded button because its blue body occupied nearly the full 29 × 29 box and its approximately four-pixel tail led toward the lower-left. The period control has a smaller near-square body, a centered and unmistakable downward tail, and a bright rim following both shapes.

Measurements use the one-pixel-per-point native Facebook 3.0 Feed capture published by Ars Technica on 2009-08-27. The source is adjacent-version evidence rather than the unrecovered exact 2010-10-20 production raster, so one-pixel source-edge uncertainty remains.

| Metric | Reference | Previous | v1.0 exact reconstruction |
| --- | ---: | ---: | ---: |
| overall visible width including halo | approximately 24px | 29px canvas | 26px display canvas; approximately 24px painted bounds |
| overall visible height including halo/tail | approximately 30px | 29px canvas | 30px |
| blue body width | approximately 21px | approximately 24px | 21px |
| blue body height | approximately 20px | approximately 21.5px | 20px |
| integrated tail height | approximately 7px | approximately 4px, lower-left | 7px, centered |
| white halo thickness | approximately 2px | 2px | 2px around body and tail |
| plus width / height | approximately 13 × 13px | 12 × 12px | 12.8 × 12.8px with 2.6px strokes |

The source canvas is 52 × 60 for an explicit @2x-equivalent output and renders at 26 × 30 CSS pixels. The body gradient runs from reconstructed `#7897cb` through `#4470ad` to `#315992`, with a restrained upper inset highlight. A 0.55-unit blur and approximately one-pixel downward offset create the period-soft separation shadow. No screenshot crop is included.

The Feed keeps vertical centering but uses a 7px right optical offset for the new painted bounds. Profile Wall uses the identical artwork with its existing 8px surface-specific right offset. Both retain a compact 30 × 30 disclosure hit target, stable story keys, and the existing expanded Like/Comment bar.

## Shared Control Pixel-Match Pass v1.1

This section records the broad v1.1 pass and is superseded for the News Feed controls by the strict reference-match section below.

The v1.1 pass uses the same one-point-per-pixel native Facebook 3.0 Feed/Home capture as the principal dimensional reference, cross-checked against the target-near 2010 Home evidence already registered in this project. The adjacent-version capture confirms the control family and silhouette, but the unrecovered 2010-10-20 production assets keep color-edge and one-pixel decisions in `RECONSTRUCTED` status.

Measurements were taken before editing. Values marked “approximately” include a one-pixel source-edge uncertainty from JPEG softness and the absence of the exact target build.

| Control | Historical reference | Pre-v1.1 simulator | v1.1 result | Dominant mismatch corrected |
| --- | ---: | ---: | ---: | --- |
| Home/Back nav control | approximately 52 × 30px including arrow | 45 × 29px body; weakly joined arrow | 45 × 30px body, approximately 52px overall | shallow surface and detached-looking directional point |
| right nav control / `Live Feed` | approximately 60–66 × 30px | visually read as a plain context label | 62 × 30px | missing distinct bordered/beveled button surface |
| right nav control / short labels | approximately 44 × 30px | 29px tall, per-selector treatments | minimum 44 × 30px | inconsistent height, border, and gradient family |
| camera composer control | approximately 29 × 29px | 29 × 29px box; pale/vector-clean internals | 29 × 29px from 58 × 58 source | weak ring separation and underspecified camera silhouette |
| story `+` bubble | approximately 24–25 × 30px | 26 × 30px | 25 × 30px from 50 × 60 source | body too broad, tail too short, gradient too luminous |
| engagement summary | approximately 19px body height | 20px body, 7px notch, 6px horizontal padding | 19px body, 6px notch, 5px horizontal padding | container too open and pointer too prominent |
| comment glyph | approximately 11 × 10px | 12 × 11px, extra visual detail | 11 × 10px from 22 × 20 source | oversized/detailed mark |
| Like/thumb glyph | approximately 12 × 11px | 13 × 12px | 12 × 11px from 24 × 22 source | oversized and thin silhouette |
| small avatar corners | approximately 1–2px | 2px shared token | 2px unchanged | already within the measured period range |
| launcher unread badge | approximately 23 × 23px for a single count | 21 × 21px, border-based halo | minimum 23 × 23px with separate 2px white layer | compressed numeral field and merged halo/rim |
| transient notification badge | approximately 23 × 24px including tail | 21 × 18px plus tail | 23 × 19px body plus 5px layered tail | speech-bubble tail and halo were not independently legible |

The nav family is now expressed by the shared `.facebook-2010-nav-button` taxonomy with normal, back, icon, left, right, and static modifiers. This changes presentation only: labels, button elements, handlers, routes, and disabled/static semantics are preserved. The directional arrow remains a CSS extension of the same beveled surface rather than a separate glyph.

Camera, comment, Like, and story-action artwork remains repository-owned vector reconstruction. Intrinsic dimensions are exactly twice their CSS display boxes to preserve plausible iPhone 4 Retina sampling while keeping the implementation independent of screenshot pixels. The small SVG softness filters are sub-pixel edge treatment, not a claim of exact production raster provenance.

Unread and transient badges now expose explicit outer rim, white halo, red fill, highlight, and numeral layers. Counts and anchors continue to come from the existing selectors and notification system. No launcher occupancy, Feed/Wall story data, Like/comment state, routing, scheduler, media, or timestamp source changed.

## News Feed strict reference-match correction v1.0

Primary visual source: the 320-point right-hand native Facebook 3.0 News Feed capture published by Ars Technica on 2009-08-27. The screenshot is a one-point-per-pixel application capture embedded beside Home. It is adjacent-version evidence for the 2010-10-20 target; geometry is treated as `PROBABLE`, while newly drawn pixels remain `RECONSTRUCTED`. JPEG edges carry approximately one-pixel uncertainty.

The supplied comparison was measured before editing. Current values below describe the pre-correction source geometry because no browser was connected for a rendered before-capture.

| Control / metric | Reference bounds | Pre-correction bounds | Final display bounds | Reconstruction method | Confidence |
| --- | ---: | ---: | ---: | --- | --- |
| navbar height | approximately 45px including boundaries | 44px content plus boundaries | unchanged | existing shared navbar | PROBABLE |
| Feed launcher control | approximately 39 × 32px; 5px left inset | approximately 52 × 30px arrow control | 39 × 32px; 5px left inset | shared nav button plus dedicated grid asset | PROBABLE / RECONSTRUCTED |
| grid glyph | approximately 23 × 23px | absent; `Home` text | 23 × 23px from 46 × 46 source | simple nine-cell SVG | PROBABLE / RECONSTRUCTED |
| `News Feed` control | approximately 84 × 30px; 5px right inset | 62 × 30px `Live Feed` | 84 × 30px; 5px right inset | shared beveled nav surface | PROBABLE |
| camera outer / inner | approximately 29px / 23px diameter | 29px / approximately 22px | 29px / approximately 23px | simplified 58 × 58 SVG with restrained softness | PROBABLE / RECONSTRUCTED |
| camera glyph | approximately 15 × 11px | approximately 16 × 12px | approximately 15 × 11px | white body and one dark lens | RECONSTRUCTED |
| composer field | approximately 275 × 28px; 5px right inset | approximately 270 × 27px | flexible 275 × 28px at 320px viewport | existing button; measured strip padding/gap | PROBABLE |
| camera-to-field gap | approximately 4px | 7px | 4px | shared composer spacing | PROBABLE |
| story `+` total | approximately 23 × 28px | 25 × 30px | 23 × 28px from 46 × 56 source | redrawn compact SVG | PROBABLE / RECONSTRUCTED |
| story `+` blue body | approximately 20 × 20px | approximately 20 × 19px | approximately 20 × 19px | dedicated shared asset | RECONSTRUCTED |
| story `+` tail / rim | approximately 7px / 1–2px | 6px / 2.2px | approximately 6px / 1.6px | integrated centered tail and white outline | RECONSTRUCTED |
| story `+` plus | noticeably smaller than the body; chunky stroke | 13.1 × 13.1px; 2.8px stroke | 9.4 × 9.4px centerline; 2.6px stroke | dedicated shared asset | RECONSTRUCTED |
| engagement panel | approximately 22px body height | 19px | 22px fixed measured variable | shared Feed/Wall component | PROBABLE / RECONSTRUCTED |
| engagement notch | approximately 5 × 5px | 6 × 6px | 5 × 5px | shared top pointer | RECONSTRUCTED |
| engagement padding / rhythm | approximately 5px sides; 3px glyph gap; 8px groups | 5px sides; 3px glyph gap; 7px groups | 5px / 3px / 8px variables | fixed shared component constants | RECONSTRUCTED |
| comment glyph | approximately 10 × 9px | 11 × 10px | 10 × 9px from 20 × 18 source | minimal outlined speech-bubble SVG | RECONSTRUCTED |
| Like glyph | approximately 11 × 10px | 12 × 11px | 11 × 10px from 22 × 20 source | low-detail chunky thumb SVG | RECONSTRUCTED |
| small avatar radius | approximately 1–2px | 2px | 2px unchanged | shared CSS token | PROBABLE / RECONSTRUCTED |

Shared usage remains deliberate: Feed and Profile Wall use the same story-action, engagement, comment, Like, and small-avatar sources. Comments reuses the Like asset, nav-button family, and small-avatar radius without receiving a layout restructure. The grid launcher is Feed-only presentation over the existing `GO_BACK` route. Camera artwork remains Feed-composer-only and disabled/HOLD.

The superseded Feed `Home` text/arrow and `Live Feed` label are no longer rendered on the Feed route. Directional Home/Back controls remain available on other routes. Old CSS-drawn camera internals remain unreachable because the composer renders the dedicated artwork component; no unrelated structural CSS was removed.

### Story action color and plus scale correction v1.0.1

This correction changes only the shared asset's interior gradient and plus endpoints. The 46 × 56 source canvas, 23 × 28 display box, body/tail path, 1.6-unit white rim, filter, and 30 × 30 disclosure hit frame are unchanged.

| Metric | Previous | v1.0.1 | Measurement basis |
| --- | ---: | ---: | --- |
| blue gradient | `#6f91c7` → `#4773ae` → `#315b95` | `#82a7dd` → `#5b87c4` → `#3e6ca9` | brighter/saturated reference body without nav-button navy cast |
| plus centerline width | 11.8px | 9.4px | explicit path endpoints |
| plus width / approximately 20.2px blue-body width | 58.4% | 46.5% | centerline extent, excluding stroke |
| plus centerline height | 11.8px | 9.4px | explicit path endpoints |
| plus height / approximately 18.9px blue-body height | 62.4% | 49.7% | centerline extent, excluding stroke |
| plus stroke | 2.6px | 2.6px | retained chunky raster-scale weight |

Both News Feed and Profile Wall continue to render the single `FacebookStoryActionBubble` component. Confidence is `PROBABLE` for the brighter/smaller relationship visible in the adjacent-version capture and `RECONSTRUCTED` for the precise color stops and endpoints.

## Surface-specific historical control correction v1.2

This correction explicitly rejects the assumption that every Facebook-blue control shares one silhouette.

| Control | Sharing decision | Evidence status |
| --- | --- | --- |
| 3 × 3 launcher button | shared only by News Feed and Friends where the same control is visible | PERIOD-EVIDENCE |
| Friends Home-text arrow | rejected; replaced by the existing grid artwork and unchanged Home route | REJECTED |
| story action bubble | shared by News Feed and Profile Wall; untouched in v1.2 | PERIOD-EVIDENCE / RECONSTRUCTED |
| directional back/source control | one continuous dynamic-width SVG silhouette shared by directional routes | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Comments source/profile label | selected story actor supplies a compact first-name source label; `Back` remains the unavailable-context fallback | PERIOD-EVIDENCE / route-context dependent |
| launcher unread badge | launcher-only rounded badge with no tail | PERIOD-EVIDENCE |
| transient notification action bubble | notification-banner-only speech bubble with integrated tail | PERIOD-EVIDENCE / RECONSTRUCTED |
| launcher badge and transient action bubble as one asset | rejected; they remain separate components and silhouettes | REJECTED |
| thumb glyph | shared where the same tiny historical thumb is shown | PERIOD-EVIDENCE / RECONSTRUCTED |
| mobile source mark | eligible only from explicit story/source semantics | PERIOD-EVIDENCE / source-dependent |

### Friends navigation

Friends now enters the same 39 × 32px grid launcher control used by News Feed, with the same 23 × 23px nine-cell artwork and existing `GO_BACK` navigation. The centered `facebook` title, Search Friends row, A–Z rail, Friends/Pages/Requests footer, data, and handlers are unchanged.

### Comments Detail

| Metric | Previous generic control | Superseded v1.2 Comments result | Shared directional result |
| --- | ---: | ---: | ---: |
| total height | 30px | 27px | 30px |
| arrow construction | 18 × 18px rotated square | 13 × 13px shallow rotated square | fixed path point at x=1, shoulder at x=10 |
| body left / top | 13px / 7px | 11px / 8px | host left 5px / top 7px |
| outline | rectangle plus overlapping diamond | rectangle plus overlapping diamond | one continuous 1.2-unit SVG stroke |
| label | `Back` | `Back`; source-name semantics HOLD | selected source actor first name, fallback `Back` |

The Likes summary uses a compact 25px pale blue-gray row with an 8px horizontal inset and the existing shared thumb. Comments Top Notch Restoration v1.3.1 below supersedes its former conditional 7 × 7px pointer. Comment rows remain full-width period rows rather than cards: minimum 43px height, 32px avatars, 5 × 8px row padding, 2px avatar radius, light top separator, and inline actor/body copy. Comment records do not contain canonical timestamps, so none were invented. The existing bottom composer geometry and submission logic remain unchanged.

The available story model contains an optional free-form `sourceApp` but no reliable mobile-origin field or approved source vocabulary. The prior Comments rule inferred the phone mark from every `photo` or `album`; that inference is rejected. Comments now renders no mobile mark until explicit canonical source provenance is supplied. The artwork remains registered for future source-supported use. Status: HOLD, with no content mutation.

### Home transient notification action bubble

| Metric | Reference | Previous CSS construction | v1.2 target |
| --- | ---: | ---: | ---: |
| overall width | approximately 22–23px | 23px | 23px |
| red body height | approximately 18–19px | 15px inner body | approximately 18px painted body |
| total height including tail | approximately 24px | 24px assembled body/tail | 24px integrated asset |
| tail height | approximately 4–5px | 5px separate pseudo-element | approximately 4px integrated path |
| white rim | approximately 2px | separate body/tail layers | 1.8-unit continuous body-and-tail stroke |
| numeral | approximately 10px | 10px | 10px unchanged |

`FacebookNotificationActionBubble` owns a dedicated 46 × 48 @2x-equivalent asset rendered at 23 × 24px. Its white rim follows the red body and tail in one path. The launcher-only `FacebookUnreadBadge` remains a separate dynamic-count component with no tail. Banner timing, dismissal, route, and canonical notification text are unchanged; visual alignment uses a 13px left inset and 7px icon/text gap.

## Facebook directional back/source silhouette v1.3

| Decision | Status |
| --- | --- |
| Facebook directional back/source silhouette | `PERIOD-EVIDENCE` |
| rotated-square plus rounded-rectangle construction | `REJECTED` |
| source actor label in Comments | `PERIOD-EVIDENCE / route-context dependent` |
| exact path geometry | `VISUAL-CROSSCHECK / RECONSTRUCTED` |

`Facebook2010BackButton` now renders one inline SVG path rather than combining a rectangular button with a rotated-square pseudo-element. At 30px total height, the reconstructed path uses:

- arrow point: `(1, 15)`
- upper shoulder: `(10, 1.2)`
- lower shoulder: `(10, 28.8)`
- right body corners: 4.2-unit quadratic transitions from x=`width - 5` to x=`width - 0.8`
- continuous outer stroke: 1.2 units in `#1c3764`
- inset top highlight: 0.7 units at y=`2.8`
- host position: 5px from the left and 7px from the top of the 44px navbar

The arrow coordinates never change. The body width is `max(39, ceil(label length × 6.2) + 14)` and total width adds the fixed 10px arrow region, allowing `Alex`, `June`, `Back`, `Home`, `Chat`, and `Messages` without horizontally stretching the arrowhead.

One vertical gradient covers the full path: `#7d92b9` → `#657daa` → `#4c699d` → `#365584` → `#294674`, followed by one subtle top highlight and a 0.7px reconstructed lower shadow. There is no second outline, restarted arrow gradient, diagonal seam, or pseudo-element shadow.

The label box begins at the x=10 shoulder and ends 1px before the right edge. Centering therefore uses only the rectangular body region, not the arrow-inclusive SVG bounds.

Comments Detail derives the compact source label from the already-selected story author: Alex Wong → `Alex`, June Park → `June`. If that route context is absent, it conservatively falls back to `Back`; no actor or navigation state is invented. Message Detail uses `Messages` only when the actual previous navigation-stack entry is Inbox. A Message opened directly from Home or Notifications retains the existing `Home` or `Back` semantics rather than claiming a false source. Chat Conversation safely uses `Chat` because that transition is accepted only from the Chat roster. Other directional routes retain their existing `Home` or `Back` wording and unchanged `GO_BACK` behavior.

News Feed and Friends retain the independent 39 × 32px 3 × 3 grid launcher control. Home `+`, story `+`, right-side Like, News Feed context, and other non-directional controls do not use the pentagonal silhouette.

## Facebook Comments top notch restoration v1.3.1

The previous pointer belonged to `.facebook-comments-like-summary::before`. Because the Likes summary is conditional, the pointer disappeared whenever a dedicated Comments thread had zero Likes. That made a shared panel-chrome element incorrectly dependent on interaction state.

Dedicated Comments Detail now always renders one `.facebook-comments-panel` immediately after the original story. The panel owns the Likes summary when present and the comments list in every state. In v1.3.1 the notch was attached to that panel in every state; v1.3.2 below supersedes that visibility rule after the source-mark relationship became explicit.

| Metric | v1.3.1 value | Confidence |
| --- | ---: | --- |
| notch width | 10px | VISUAL-CROSSCHECK / RECONSTRUCTED |
| notch height | 7px | VISUAL-CROSSCHECK / RECONSTRUCTED |
| left offset | 16px | VISUAL-CROSSCHECK / retained measured alignment |
| top offset | -6px with 1px overlap into the panel | RECONSTRUCTED / seam prevention |
| panel fill | `#e7edf5` | shared existing Comments chrome |
| panel border | 1px `#c0c8d4` | shared existing Comments chrome |

The single `.facebook-comments-panel::before` rule uses a triangular `clip-path`, the panel fill variable, and two subpixel outline drop-shadows sourced from the same border variable. Its one-pixel overlap covers the panel top edge beneath the pointer, avoiding a detached base seam without adding a separate dark triangle. The Likes summary no longer owns a pointer rule.

Comment-row geometry, the bottom `Write a comment...` composer, Comments routing, Generic Post retirement, story/media/actor records, Likes, timestamps, and global time remain unchanged.

## Facebook Comments source mark, pointer, and engagement glyph correction v1.3.2

### Source-semantics audit

`FacebookFeedItem.sourceApp` remains an optional free-form string. The current story seeds define no approved value that specifically means “posted from the Facebook iPhone app,” and a photo or album kind does not establish device provenance. Consequently, no current Comments Detail story qualifies for the mobile/source mark. `FACEBOOK_EXPLICIT_MOBILE_SOURCE_APPS` is intentionally empty and the result remains HOLD; no seed or live story metadata was added or rewritten.

Comments nevertheless has one explicit, source-dependent presentation path. `hasExplicitFacebookMobileSource(item)` controls both the mark before the timestamp and the panel's `.has-mobile-source` class. With no supported value, both are absent. This prevents a floating pointer and keeps the mark and pointer inseparable when a canonical source vocabulary is eventually approved.

### Pointer alignment and panel treatment

The pointer retains the reconstructed 10 × 7px silhouette and `top: -6px` seam overlap, but no longer uses the unrelated fixed 16px offset. Its center is computed from the Comments story layout:

`8px story inset + 36px avatar + 7px column gap + 4.5px source-mark half-width = 55.5px`.

The pointer's left edge is therefore `source-mark center - 5px pointer half-width`, expressed entirely through shared CSS variables. The mark/timestamp row uses a 3px gap and bottom alignment so the compact device artwork precedes the timestamp without disturbing text wrapping.

The interaction panel moves from `#e7edf5` / `#c0c8d4` to the reconstructed near-white cool-gray `#f1f3f6` / `#d0d4da`. Comment rows use `#f3f4f6` with `#d6d9de` separators. The Likes summary retains conditional count semantics but tightens from a 25px minimum with 5/8/4px padding to a 22px minimum with 3/7px padding; its text becomes regular 10px muted blue-gray. Exact RGB values are RECONSTRUCTED from the supplied visual target, not claimed as recovered package constants.

### Shared engagement glyphs

Feed, Profile Wall, and Comments Likes reuse `FacebookMicroGlyph`. Comment and Like silhouettes are reduced from 10 × 9px and 11 × 10px display bounds to 9 × 8px and 9 × 9px. Their source canvases are correspondingly simplified to compact filled silhouettes, avoiding a modern outlined bubble and an oversized detailed thumb. Both render through the single reconstructed `--facebook-micro-glyph-blue: #71839a` token and CSS masks, keeping the artwork muted, consistent, and distinct from navigation blue. The multi-tone source mark remains a dedicated image rather than being flattened through that token.

No comments, Likes, counts, routes, actors, media, timestamps, story data, scheduler state, global time, composer behavior, Feed layout, or Profile Wall layout changed in this correction.

| v1.3.2 evidence claim | Classification |
| --- | --- |
| Comments mobile/source mark | PERIOD-EVIDENCE / source-dependent |
| Source mark shown on every Comments screen | NOT CONFIRMED |
| Pointer aligned beneath the source mark | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Comments panel pale cool blue-gray | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Comment glyph muted Facebook blue | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Like/thumb glyph muted Facebook blue | PERIOD-EVIDENCE / VISUAL-CROSSCHECK |
| Exact RGB values | RECONSTRUCTED |

## Facebook Comments notch regression fix v1.3.3

The v1.3.2 implementation incorrectly placed the only top-notch pseudo-element on `.facebook-comments-panel.has-mobile-source::before`. Because current story metadata has no approved mobile-source value, Alex, June, and every other dedicated Comments screen lost a piece of shared panel chrome. Source provenance and panel structure are independent.

The approved 10 × 7px notch geometry, `top: -6px` overlap, pale panel fill, and matching border treatment now live unconditionally on `.facebook-comments-panel::before`. Without a source mark, its 56px center is derived from the 51px story-content start (`8px inset + 36px avatar + 7px gap`) plus a conservative 5px content-side offset. With an explicitly supported source mark, `.has-mobile-source::before` changes only `left`, centering the same notch under the 55.5px source-mark center. It never creates or removes the notch.

The source vocabulary remains empty/HOLD and source-mark rendering remains conditional. No panel color, Like/comment glyph, timestamp, row, composer, navigation, story data, engagement state, media, scheduler, or cross-surface behavior changed.

## Facebook 2010 detail timestamp and mobile-mark normalization v1.0

The simulator now locks one period-informed reconstruction convention for Facebook detail timestamp rows: `[mobile mark] Month D h:mm AM/PM` for content whose canonical Pacific-time year is 2010. This intentionally yields `October 19 11:51 PM` and `October 20 12:03 AM`, without the redundant reconstruction year, comma, or connective `at`. This project-level convention supersedes the source-dependent visibility wording recorded in v1.3.2 and v1.3.3; those sections remain as implementation history, not the current detail-row rule.

`formatFacebookDetailTimestamp` centralizes that decision in `America/Los_Angeles`. It uses `formatToParts` for 2010 so no browser-local timezone or locale-inserted connector can leak into the result. Content outside 2010 retains the existing full-date fallback, including its disambiguating year; audited 2009 Jay, 2008 Jack/Matt, and 2007 photo examples therefore remain `Month D, YYYY at h:mm AM/PM`.

`FacebookDetailTimestampRow` renders the existing 9 × 11px reconstructed handset artwork before the timestamp text and is shared by Comments Detail, the retained legacy Post Detail renderer, and Photo Detail. The mark is unconditional on these detail surfaces as a LOCKED PROJECT RULE / PERIOD-INFORMED simulator convention. Exact universal historical mobile-source semantics are NOT CLAIMED, and no source metadata was added.

News Feed and Profile Wall continue to use their compact/relative formatter paths. Comments keeps its unconditional panel notch, accepted notch position, layered edge treatment, panel colors, rows, and composer unchanged.

| Decision | Classification |
| --- | --- |
| 2010 Facebook detail display: `[mobile mark] Month D h:mm AM/PM` | LOCKED PROJECT RULE / PERIOD-INFORMED |
| Omit year for the reconstruction year | LOCKED PROJECT RULE / PERIOD-INFORMED |
| Retain year outside 2010 | continuity-preserving formatter boundary |
| Universal historical meaning of the handset mark | NOT CLAIMED |

## Semantics and freeze boundary

- Feed/Wall media marks remain limited to their existing `photo` and `album` presentation. Detail rows follow the later locked project convention above; neither rule creates source metadata.
- Engagement counts still come from the existing comment and Like selectors; zero segments remain omitted and grammar remains count-derived.
- The story bubble still wraps the existing disclosure and Like/Comment handlers.
- Camera behavior remains disabled/HOLD exactly as before.
- Friends phone artwork remains unused because current friend records have no canonical phone/contact field.
- Requests remains the existing third Friends footer destination; its historical October 2010 status remains HOLD.
- Notification timing, delivery, routing, and counts are unchanged.
- No story, comment, Like, media, timestamp, actor, relationship, route, scheduler, global-time, Profile Info, Albums/Photos, Places, Search, or large Home icon data changed.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- manual overlays: BLOCKED — the required in-app browser connection check returned no connected browser
