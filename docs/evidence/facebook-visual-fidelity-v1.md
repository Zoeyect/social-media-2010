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
- launcher search, page dots, and Notifications row

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

No historically verified Facebook application icon set is currently stored in the repository. Existing Facebook assets are character/profile media, not audited application chrome.

Therefore:

- existing launcher letter placeholders remain in use
- no fake icons were generated
- no modern icon library was introduced
- no character image was changed

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

The existing `Photo | Status | Check In` structure and labels are unchanged. Only height, typography, borders, separators, padding, and gradient were adjusted.

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
