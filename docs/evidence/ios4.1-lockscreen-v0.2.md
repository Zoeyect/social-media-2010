# iOS 4.1 Lock Screen evidence audit v0.2

## Scope and evidence policy

Target: iPhone 4 GSM (`iPhone3,1`), iOS 4.1, build `8B117`, as of 20 October 2010. Target framebuffer is 640 × 960 physical pixels and the UI coordinate space is 320 × 480 logical points.

This is an evidence audit, not an implementation specification. Every material finding is classified as:

- **ORIGINAL** — recovered from the target `iPhone3,1_4.1_8B117_Restore.ipsw` or another first-party artifact demonstrably belonging to that exact build.
- **SOURCE-DERIVED** — supported by contemporary Apple documentation, contemporary platform source/tooling, or direct arithmetic from an original fact.
- **VISUAL-CROSSCHECK** — measured or observed in dated period imagery close to the target, but not proven to be the exact target build.
- **UNKNOWN** — not established to the required provenance standard. Such an item remains HOLD.

No item in this document is promoted merely because the current CSS resembles period imagery.

### Evidence set and limitations

- **ORIGINAL:** the locally verified 8B117 restore archive and extracted NOR files. The archive-level search exposes no standalone Lock Screen, slider, wallpaper, SpringBoard, or status-bar resource. Those resources would ordinarily be inside the root filesystem image, which has not been recovered and audited for this task.
- **SOURCE-DERIVED:** Apple's [iPhone 4 technical specifications](https://support.apple.com/en-euro/112562) state a 960-by-640 Retina display. Apple's 7 June 2010 [iPhone 4 announcement](https://www.apple.com/newsroom/2010/06/07Apple-Presents-iPhone-4/) says that this is four times the pixel count of the preceding display, supporting a 2× scale in each axis. A period [iPhone User Guide for iOS 4](https://files.customersaas.com/files/Manual/Apple_iPhone_4_User_manual.pdf) documents Sleep/Wake, Home, Lock Screen, wallpaper, and unlock behavior.
- **VISUAL-CROSSCHECK:** Redmond Pie's 14 June 2010 [iOS 4 GM screenshot gallery](https://www.redmondpie.com/ios-4.0-screenshots-gallery-iphone/) includes a native 320 × 480 Lock Screen capture. A temporary local copy was inspected at native size; it is not retained as a project asset. It predates 4.1 and is therefore structural corroboration only.
- **UNKNOWN:** an exact, independently authenticated screenshot or extracted Lock Screen resource set from `iPhone3,1` build `8B117` was not available.

## 1. Framebuffer and complete vertical structure

| Region | Logical bounds | Physical bounds | Classification | Notes |
|---|---:|---:|---|---|
| Full display | x 0, y 0, w 320, h 480 | x 0, y 0, w 640, h 960 | **ORIGINAL / SOURCE-DERIVED** | Hardware resolution is first-party; logical size follows the documented 2× relationship. |
| Status bar | x 0, y 0, w 320, h 20 | x 0, y 0, w 640, h 40 | **SOURCE-DERIVED / VISUAL-CROSSCHECK** | The period capture changes from status bar to clock panel at y=20. No safe-area inset exists on this rectangular pre-notch display. |
| Clock/date panel | approximately x 0, y 20, w 320, h 96 | approximately x 0, y 40, w 640, h 192 | **VISUAL-CROSSCHECK** | Period capture has a clear lower separator at about y=115/116. Exact 8B117 boundary is not recovered. |
| Wallpaper field | approximately x 0, y 116, w 320, h 270 | approximately x 0, y 232, w 640, h 540 | **VISUAL-CROSSCHECK** | This is the unobstructed middle field before the bottom overlay begins; wallpaper also remains visible beneath translucent chrome. |
| Bottom slider region | approximately x 0, y 386, w 320, h 94 | approximately x 0, y 772, w 640, h 188 | **VISUAL-CROSSCHECK** | A dark translucent bottom gradient contains the slider. Exact gradient stops and resource bounds are unknown. |

**SOURCE-DERIVED:** UIKit-era layouts use logical coordinates while `@2x` resources supply Retina pixels. A one-point dimension maps to two physical pixels on iPhone 4. This does not establish the internal pixel bounds of unrecovered artwork.

**UNKNOWN:** exact 8B117 clock-panel, wallpaper-field, and bottom-overlay bounds. The approximate bounds above must not be treated as extracted constants.

## 2. Lock Screen status bar

The Lock Screen uses the same 20-point system status-bar strip and left/center/right grouping as the Home Screen. Its backdrop is visually integrated with the Lock Screen's dark translucent top chrome rather than the SpringBoard wallpaper/status treatment.

| Element | Period visual position (logical) | Classification | Confidence and limitation |
|---|---:|---|---|
| Signal glyph | approximately x 4–20, vertically centered in y 0–20 | **VISUAL-CROSSCHECK** | High for leftmost order; exact target asset/bounds unknown. |
| Carrier | immediately after signal; example capture spans roughly x 23–57 | **VISUAL-CROSSCHECK** | Carrier string and width are network-dependent. Target project carrier `SoftBank` will change occupied width. |
| Network indicator | follows carrier when present | **SOURCE-DERIVED / VISUAL-CROSSCHECK** | The inspected capture shows Wi‑Fi rather than `3G`; exact SoftBank/3G coordinates are therefore unknown. |
| Time | centered on the 320-point screen | **SOURCE-DERIVED / VISUAL-CROSSCHECK** | Status-bar time is replaced by a centered padlock glyph while the inspected device is locked. This is a material Lock Screen difference from SpringBoard. |
| Bluetooth | in the right-side indicator group when active | **SOURCE-DERIVED** | Conditional; absent in the inspected capture. Exact x coordinate depends on other enabled indicators. |
| Battery percentage | immediately left of battery glyph when enabled | **SOURCE-DERIVED / VISUAL-CROSSCHECK** | Capture shows `49%`; exact width varies with digits. |
| Battery glyph | rightmost, approximately x 296–316 in capture | **VISUAL-CROSSCHECK** | Exact 8B117 raster bounds and cap geometry remain unknown. |

**UNKNOWN:** fixed x coordinates for carrier, 3G, Bluetooth, percentage, and battery cannot be universal: carrier width and conditional indicators alter the right and left groups. Authentic target glyph assets have not been recovered.

**Current-project caution:** the shared status component always renders the clock in the center. Period Lock Screen evidence instead shows a centered lock indicator. Whether build 8B117 behaves identically is strongly corroborated but remains **VISUAL-CROSSCHECK**, not ORIGINAL.

## 3. Large clock typography

### Known

- **VISUAL-CROSSCHECK:** centered, white, thin sans-serif numerals with a dark shadow.
- **VISUAL-CROSSCHECK:** the inspected 320 × 480 capture places the visible clock approximately within x 98–224 and y 29–79 for `5:28`; the bounds vary with the time string.
- **VISUAL-CROSSCHECK:** the visual cap height is approximately 58–61 pixels. This is not equivalent to a proven CSS point size.
- **VISUAL-CROSSCHECK:** alignment is centered on x=160.

### Unknown / HOLD

- **UNKNOWN:** exact font file/family used by 8B117.
- **UNKNOWN:** exact face/weight name, nominal point size, tracking, line metrics, antialiasing, and shadow parameters.
- **UNKNOWN:** whether any typography is embedded in a composite resource versus drawn by SpringBoard; no target SpringBoard binary/resource proof was recovered here.

`Helvetica Neue`, a modern Apple system font, or a numeric weight must not be declared historically exact until the 8B117 font/resource or rendering call is identified.

## 4. Date text

- **VISUAL-CROSSCHECK:** a single centered white date line sits immediately below the large time within the same top panel.
- **VISUAL-CROSSCHECK:** in the inspected capture, the date visible bounds are approximately x 89–231 and y 89–103, with the clock panel ending around y 115/116.
- **SOURCE-DERIVED:** date language and ordering follow the device locale. `Wednesday, October 20` is valid for an English locale on the specified date, not a build-global literal.
- **UNKNOWN:** exact font family, face, nominal size, tracking, baseline, and shadow for 8B117.
- **UNKNOWN:** exact spacing below the clock. The period visual suggests roughly 4–8 points between visible glyph bounds, but this is sensitive to font metrics.

## 5. Slide to unlock control

This section deliberately separates observed chrome from unverified interaction constants.

### Container — visual evidence

| Property | Finding | Classification |
|---|---|---|
| Approximate bounds | x 20, y 407, w 280, h 49 logical; x 40, y 814, w 560, h 98 at 2× | **VISUAL-CROSSCHECK** |
| Shape | horizontally elongated rounded rectangle | **VISUAL-CROSSCHECK** |
| Corner radius | approximately 10–12 logical points by visual measurement | **VISUAL-CROSSCHECK** |
| Treatment | dark translucent/glass-like fill, subtle light edge, darker interior/shadow | **VISUAL-CROSSCHECK** |
| Exact opacity/border/shadow | not recoverable from the JPEG because wallpaper, compression, and compositing are inseparable | **UNKNOWN** |

### Knob — visual evidence

| Property | Finding | Classification |
|---|---|---|
| Initial approximate bounds | x 23, y 411, w 69, h 42 logical; x 46, y 822, w 138, h 84 at 2× | **VISUAL-CROSSCHECK** |
| Shape | rounded rectangle, not a circular modern handle | **VISUAL-CROSSCHECK** |
| Treatment | silver/gray vertical gloss with border and shadow | **VISUAL-CROSSCHECK** |
| Arrow | right-pointing gray arrow centered in knob | **VISUAL-CROSSCHECK** |
| Exact raster/source | no authentic target arrow, knob, or composite resource is present locally | **UNKNOWN / HOLD** |

### Text — visual evidence

- **VISUAL-CROSSCHECK:** `slide to unlock`, horizontally centered in the track, gray/silver with highlight/shadow treatment.
- **VISUAL-CROSSCHECK:** the visible glyph region is approximately x 112–260 and y 425–445 in the inspected capture.
- **UNKNOWN:** exact font, nominal size, tracking, mask/highlight animation, and shadow values.

### Interaction evidence versus assumptions

- **SOURCE-DERIVED:** the period user guide instructs the user to drag the on-screen slider to unlock. It is a continuous horizontal drag, not a tap.
- **VISUAL-CROSSCHECK:** the knob starts at the left and travels toward the right end of the track.
- **UNKNOWN:** exact travel distance, completion threshold, velocity rule, cancellation rule, animation duration/easing, and return animation for 8B117.
- **UNKNOWN:** the current project's `205px` travel and `.78` completion threshold are implementation constants, not historical evidence.
- **UNKNOWN:** “bounce behavior” cannot be established from a still image. No exact-build motion capture or disassembly was audited.

## 6. Wallpaper

- **SOURCE-DERIVED:** iOS 4 supports wallpaper selection for Lock Screen and Home Screen. They are separate destinations and are not required to use the same image.
- **VISUAL-CROSSCHECK:** the inspected iOS 4 GM capture uses a blue denim-like image. This proves the Lock Screen supports a full-screen image beneath translucent chrome; it does not prove the shipping 8B117 default.
- **UNKNOWN / HOLD:** exact default iPhone 4/iOS 4.1 Lock Screen wallpaper, original filename, provenance, native resolution, crop rectangle, and scaling behavior for this target.
- **UNKNOWN / HOLD:** whether a fresh 8B117 installation used the same image on Lock Screen and SpringBoard by default.

No recreated wallpaper or image extracted from a web screenshot is implementation-ready.

## 7. Lock Screen interactions in iOS 4.1

| Input/state | Historical behavior | Classification |
|---|---|---|
| Lock Screen + short Sleep/Wake | display sleeps; session/device remains powered | **SOURCE-DERIVED** |
| Sleeping + Sleep/Wake | display wakes to Lock Screen | **SOURCE-DERIVED** |
| Sleeping + Home | display wakes to Lock Screen | **SOURCE-DERIVED** |
| Lock Screen + Home while already awake | remains locked | **SOURCE-DERIVED** |
| Drag slider to completion | unlocks to Home Screen (or returns to the previously active app in some system contexts; project target is SpringBoard) | **SOURCE-DERIVED** for unlock; project routing is a scoped decision |

Later behavior explicitly rejected for this target:

- **REJECTED:** a persistent Lock Screen camera shortcut in iOS 4.1.
- **REJECTED:** iOS 5 double-Home camera access as an iOS 4.1 feature.
- **REJECTED:** the iOS 5.1 camera grabber and upward-drag gesture.
- **REJECTED:** modern swipe-up/Face ID affordances, flashlight/camera buttons, widgets, notifications-sheet semantics, or iOS 7+ flat iconography.

See [iOS 4.1 Lock Screen camera evidence](./ios4.1-lockscreen-camera.md) for the feature-version audit.

## 8. Current implementation gap analysis

| Feature | Current project | Historical evidence | Action |
|---|---|---|---|
| Coordinate frame | 320 × 480 logical screen | 320 × 480 logical / 640 × 960 physical | **READY:** preserve. |
| Status bar height | 20px | 20 logical points | **READY:** preserve height; audit actual glyph resources separately. |
| Lock status center | shared status bar displays time | period Lock Screen shows centered lock glyph | **HOLD:** authentic lock glyph and exact 8B117 confirmation required. |
| Status icons | CSS reconstructions and text | order/roles supported; exact target resources absent | **HOLD:** do not call current glyphs authentic. |
| Clock | shared live time; CSS `62px`, weight 200 | live centered white clock supported; exact type metrics unknown | **READY:** shared clock behavior. **HOLD:** typography claims. |
| Date | hardcoded `Wednesday, October 20`; CSS `16px` | English-locale string is plausible for target date; exact typography unknown | **READY:** target-date content if locale is fixed. **HOLD:** font/metrics and dynamic date semantics. |
| Top panel | padding, border, flat translucent background | period capture supports translucent top panel and divider | **HOLD:** exact bounds and compositing not original. |
| Wallpaper | CSS gradient | target default wallpaper not recovered | **HOLD:** replace only with authenticated raster. |
| Slider track | x 13 to 307, y 413 to 465, h 52 | period capture approximately x 20 to 300, y 407 to 456, h 49 | **HOLD:** current geometry differs and exact 8B117 resources are absent. |
| Slider knob | x 17, y 417, 66 × 44, CSS gradient, text `›` | period knob approximately x 23, y 411, 69 × 42 with a distinct arrow raster | **HOLD:** current knob/arrow are reconstructions. |
| Slider text | 21px generic sans-serif, flat gray | period text has glass/highlight treatment; exact font unknown | **HOLD.** |
| Drag distance | 205px | no exact-build motion evidence | **UNKNOWN / HOLD.** |
| Completion | normalized threshold `.78` | no exact-build threshold evidence | **UNKNOWN / HOLD.** |
| Successful route | SpringBoard | slide unlock reaches usable device/Home Screen | **READY** for project scope. |
| Power/Home wake and sleep | state machine supplies locked ↔ sleeping; Home wakes sleeping only | matches documented behavior | **READY:** preserve. |
| Camera control | absent | correct for iOS 4.1 | **READY:** preserve absence. |

## 9. Local asset audit

Search scope: `src`, `docs`, `tmp/firmware/extracted`, `tmp/firmware/decoded`, plus archive-name inspection of the verified restore IPSW. Search terms included `lock`, `slider`, `unlock`, `wallpaper`, `SpringBoard`, `bottombar`, `status`, `battery`, and `camera`.

### Authentic or potentially relevant binaries

| Path | Source | SHA-256 | Confidence / relevance |
|---|---|---|---|
| `src/assets/historical/ios4.1/applelogo-iphone3,1-8B117.png` | Decoded `applelogo-640x960.s5l8930x.img3` from target IPSW | `5ab71d5218f28dc55d324b2fba8821ca8a50cac31201a71baf19ea45ef5d33d6` | **ORIGINAL**, but boot-only and irrelevant to Lock Screen rendering. |
| `tmp/firmware/decoded/applelogo-ios4.1-iphone4-original.png` | Temporary decoded copy of same boot asset | `5ab71d5218f28dc55d324b2fba8821ca8a50cac31201a71baf19ea45ef5d33d6` | **ORIGINAL**, boot-only. |
| `tmp/firmware/extracted/iBoot.n90ap.RELEASE.img3` | Exact target IPSW NOR image | `eb9a482584b02fea9e8485f665f8162670687d6959a950138e4082f09e2347d1` | **ORIGINAL**, but iBoot does not supply SpringBoard's Lock Screen UI resources. |

### Documentation, not assets

| Path | Source | Classification |
|---|---|---|
| `docs/evidence/ios4.1-springboard.md` | Prior project evidence audit | **SOURCE-DERIVED** documentation; no embedded authentic Lock Screen resources. |
| `docs/evidence/ios4.1-lockscreen-camera.md` | Prior feature-version audit | **SOURCE-DERIVED / VISUAL-CROSSCHECK** documentation; no camera asset. |

### Negative result

**ORIGINAL:** no locally stored Lock Screen slider, knob, arrow, status glyph, wallpaper, `SpringBoard.app` resource, or system-UI raster was found. Archive-name inspection likewise found none exposed as a top-level IPSW member. No screenshot was copied into the project and no asset was imported.

**UNKNOWN / HOLD:** the root filesystem image may contain the required resources, but it must be decrypted/extracted and its exact 8B117 paths and hashes recorded before those files can be called ORIGINAL.

## 10. Final classification

### READY

- 640 × 960 physical framebuffer and 320 × 480 logical coordinate system.
- 2× physical-to-logical relationship and absence of notch-era safe-area insets.
- 20-point status-bar height.
- Overall period structure: status bar, top clock/date panel, wallpaper field, bottom slider region.
- A shared live system time, centered large clock, locale-formatted date, and continuous drag-to-unlock behavior.
- Sleep/Wake and Home wake behavior described in section 7.
- Successful unlock routing to SpringBoard for this project's defined scope.
- Absence of a camera shortcut on iOS 4.1.

“READY” here means the behavior or structural fact is sufficiently supported; it does not authorize fabricated artwork.

### HOLD

- Exact 8B117 Lock Screen screenshot or extracted `SpringBoard.app`/system UI resources.
- Exact clock/date typeface, font file, weight, size, tracking, baselines, and shadows.
- Exact top and bottom chrome bounds, gradient, opacity, border, and compositing.
- Authentic slider container, knob, arrow, highlight/mask, and text-treatment assets.
- Exact slider travel, completion threshold, cancellation behavior, and animation curves.
- Exact target status glyph assets and conditional indicator coordinates.
- Exact default 8B117 Lock Screen wallpaper, file hash, native size, crop, and scaling.
- Whether the pristine-install Lock and Home Screen wallpapers are identical.

### REJECTED

- iOS 5 double-Home camera shortcut.
- iOS 5.1 camera grabber/upward drag.
- iOS 7+ flat Lock Screen styling.
- Modern Face ID swipe affordances, Lock Screen widgets, flashlight/camera buttons, or modern notification UI.
- Screenshot crops, CSS-drawn substitutes, emoji, modern icons, or recreated wallpapers presented as historical assets.

## Audit conclusion

The broad iOS 4 Lock Screen hierarchy and core interactions are well supported by contemporary documentation and period imagery. Exact 8B117 visual reproduction is **not** implementation-ready: the decisive SpringBoard resources, default wallpaper, typography metrics, and motion constants have not been recovered from the target root filesystem. Those items remain **UNKNOWN / HOLD** rather than being inferred from the current implementation or later iOS versions.
