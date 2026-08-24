# Social Media 2010 SpringBoard Composition Plan v0.1

## Purpose and boundary

This document defines a historically plausible editorial Home-screen arrangement for **“Social Media, 2010”** on an iPhone 4 running iOS 4.1 in October 2010. It is a composition plan, not evidence of a canonical Apple layout or a specific person’s device.

No renderer, compositor, application code, or asset is changed by this plan. A named HOLD slot authorizes placement only; it does not authorize placeholder, recreated, modern, or generated artwork.

Evidence inputs:

- `docs/evidence/social-media-2010-app-icons-v0.1.md`
- `docs/evidence/ios4.1-icon-placement-v0.1.md`
- `docs/evidence/ios4.1-springboard-artwork-v0.2.md`

## Composition decision

Use **two Home-screen pages plus the fixed four-icon dock**.

- Page 1 is the established, high-frequency social layer: Facebook, Twitter, and Foursquare.
- Page 2 is the visual publishing and blogging layer: Instagram, Tumblr, and Flickr.
- The dock contains the four READY system applications: Messages, Safari, Camera, and YouTube.

This is deliberately a **personalized thematic dock**, not a claim that Apple shipped this as the factory default. The standard 2010 iPhone dock was typically Phone, Mail, Safari, and iPod; Phone, Mail, and iPod are outside the current app-icon evidence set. Using the four audited READY apps keeps this plan implementable without inventing additional icon provenance while remaining plausible as a user-rearranged iOS 4 dock.

## Layout model

The plan uses the verified portrait structure:

- 320×480 logical screen / 640×960 Retina framebuffer.
- Four columns.
- Up to four rows above the dock.
- 57×57-point application artwork inside the verified icon presentation system.
- Four persistent dock positions.
- Page order: Spotlight/search position, Page 1, Page 2.

Grid references use one-based `(row, column)` positions. Empty means intentionally unassigned within this scoped ten-app composition; it does not imply that a typical 2010 phone contained no other built-in apps.

## Page 1 — Social essentials

| Row | Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- | --- |
| 1 | Facebook — **HOLD** | Twitter — **HOLD** | Foursquare — **HOLD** | Empty |
| 2 | Empty | Empty | Empty | Empty |
| 3 | Empty | Empty | Empty | Empty |
| 4 | Empty | Empty | Empty | Empty |

### Rationale

- **Facebook** leads at `(1,1)` because it was the broadest general-purpose social network in this set and its iPhone 4 update already supplied iOS 4 and Retina support by mid-2010.
- **Twitter** follows at `(1,2)` as the central real-time public conversation client of the period; the official iPhone client had launched in May 2010.
- **Foursquare** occupies `(1,3)` as the characteristic location/check-in network of 2010. Version 2.0 arrived immediately before the target month, making it particularly representative of the date.
- Column 4 remains empty rather than pulling a less-established or differently purposed service into the primary row solely for visual symmetry.

Page 1 is intentionally sparse because this plan covers only the named experience. In a complete personal phone reconstruction, unscoped built-in apps would normally occupy many of the remaining positions.

## Page 2 — Visual publishing and blogs

| Row | Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- | --- |
| 1 | Instagram — **HOLD** | Tumblr — **HOLD** | Flickr — **HOLD** | Empty |
| 2 | Empty | Empty | Empty | Empty |
| 3 | Empty | Empty | Empty | Empty |
| 4 | Empty | Empty | Empty | Empty |

### Rationale

- **Instagram** leads Page 2 at `(1,1)`. It launched during October 2010 and is essential to the project’s retrospective theme, but placing it on the secondary page reflects its newness rather than projecting its later dominance backward onto launch month.
- **Tumblr** at `(1,2)` represents short-form blogging and mixed-media publishing. Its official iPhone application and iOS 4 support predated the target month, but it was less universal than Facebook or Twitter.
- **Flickr** at `(1,3)` represents the established photo-sharing service. Its iOS 4-capable app existed, although contemporary evidence indicates that version 1.2 had not yet added Retina artwork.
- The grouping keeps camera/photo/blog publishing together without implying that any HOLD icon has been recovered.

## Dock — persistent communication and media tools

Left-to-right order:

| Dock position | Application | Evidence | Reason |
| ---: | --- | --- | --- |
| 1 | Messages | **READY** | Direct personal communication; closest thematic analogue to the default dock’s high-frequency communication role. |
| 2 | Safari | **READY** | Essential access to web-based social services and links shared by every network. |
| 3 | Camera | **READY** | Primary capture tool feeding Flickr, Facebook, Twitter, Tumblr, and newly launched Instagram. |
| 4 | YouTube | **READY** | Period-native video consumption and sharing; completes the text/web/capture/video progression. |

The dock remains fixed while Page 1 and Page 2 change. No reflection, label, or icon artwork behavior is redefined here; the verified dock and compositor architecture remain authoritative.

### Alternative for a future full-system composition

If authentic 8B117 Phone, Mail, and iPod icon evidence is audited and promoted later, the stronger factory-default baseline is:

`Phone | Mail | Safari | iPod`

At that point Messages, Camera, and YouTube should return to the Home grid. This alternative is more representative of an untouched iPhone, while the primary recommendation above is more useful for the evidence-constrained “Social Media, 2010” composition.

## Complete placement registry

| Application | Placement | Classification | Artwork rule |
| --- | --- | --- | --- |
| Facebook | Page 1, row 1, column 1 | **HOLD** | Placement only; render no icon until period payload is verified. |
| Twitter | Page 1, row 1, column 2 | **HOLD** | Placement only. |
| Foursquare | Page 1, row 1, column 3 | **HOLD** | Placement only. |
| Instagram | Page 2, row 1, column 1 | **HOLD** | Placement only; do not use a later classic-camera revision without version proof. |
| Tumblr | Page 2, row 1, column 2 | **HOLD** | Placement only. |
| Flickr | Page 2, row 1, column 3 | **HOLD** | Placement only; do not fabricate a Retina variant. |
| Messages | Dock position 1 | **READY** | Use exact 8B117 built-in icon only after an authorized promotion task. |
| Safari | Dock position 2 | **READY** | Use exact 8B117 built-in icon only after promotion. |
| Camera | Dock position 3 | **READY** | Use the camera-specific MobileSlideShow icon, not Photos. |
| YouTube | Dock position 4 | **READY** | Use exact 8B117 built-in icon only after promotion. |

## Page indicator plan

The standard Home-page indicator should represent **two Home pages**, with the Spotlight/search indicator preceding them:

- On Page 1: Spotlight inactive, Page 1 current, Page 2 inactive.
- On Page 2: Spotlight inactive, Page 1 inactive, Page 2 current.

This plan defines state and order only. It does not change the recovered indicator artwork, spacing, or renderer.

## Badge plan

Initial state: **no badges on any icon**.

This gives a deterministic neutral launch state and avoids inventing user accounts, unread counts, push registrations, or network activity. Zero-count badges should be absent, not shown as `0`.

Historically plausible badge-capable candidates, subject to later behavioral evidence:

| Application | Plausible badge purpose | Planning status |
| --- | --- | --- |
| Messages | unread SMS/MMS count | Permitted later; strongest system-backed candidate |
| Facebook | notifications or requests | Plausible; HOLD until the selected period build’s behavior is verified |
| Twitter | notifications/mentions/DMs depending on period build and settings | Plausible; HOLD |
| Foursquare | friend/check-in-related notifications depending on period build | Plausible; HOLD |
| Tumblr | activity depending on period build | Plausible; HOLD |
| Flickr | background upload count is explicitly period-plausible in version 1.2 | Plausible; HOLD |
| Instagram | launch-period badge semantics not established | **HOLD; do not assign** |
| Safari, Camera, YouTube | no initial badge in this composition | None |

No badge number, badge typography, or placement is specified. Those remain governed by the separate SpringBoard badge evidence and runtime work.

## Implementation guardrails for a later task

- Preserve the two-page slot registry even while HOLD artwork is absent.
- An absent HOLD icon must remain a transparent/unrendered slot; do not show `HOLD`, initials, logos, colored tiles, or modern icons.
- Do not promote temporary audit extracts implicitly. READY means eligible for a separate byte-for-byte promotion, not already authorized for integration.
- Keep built-in 118×120 system-composited icons on the correct built-in rendering path; do not treat them as raw 114×114 third-party inputs.
- Do not collapse the two pages merely because only six Home-grid applications are currently in scope.
- Do not populate empty slots with unaudited Apple apps or decorative placeholders.

## Validation boundary

The only planned repository change is this document: `docs/plans/social-media-2010-springboard-composition-v0.1.md`. No application code, SpringBoard renderer, compositor, or tracked asset is modified or added.
