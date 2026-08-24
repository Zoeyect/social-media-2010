# iOS 4.1 Lock Screen implementation plan v0.1

## Scope and authority

This plan is based on [`docs/evidence/ios4.1-lockscreen-v0.2.md`](../evidence/ios4.1-lockscreen-v0.2.md) and targets iPhone 4 GSM (`iPhone3,1`), iOS 4.1, build `8B117`.

It separates implementation-ready behavior from unrecovered historical artwork. It does not promote approximate visual measurements to original facts and does not authorize modern or invented replacements.

Implementation constraints:

- Preserve the 320 × 480 logical screen and 640 × 960 Retina relationship.
- Preserve the current boot, power-off, battery, SpringBoard, app, Home-button, and session systems except where the shared Lock Screen state consumes them.
- Do not add a camera shortcut. Persistent Lock Screen camera controls are later than iOS 4.1.
- Do not create final historical artwork with CSS, SVG, Unicode, emoji, screenshot crops, or generated imagery.
- Keep each recovered asset's source, original filename, original dimensions, cryptographic hash, extraction method, and evidence classification visible in documentation.

## Proposed implementation boundary

The Lock Screen should be isolated behind a dedicated component interface without changing the device state vocabulary:

```ts
type LockScreenProps = {
  deviceTime: string;
  deviceDate: string;
  batteryPercent: number;
  onUnlock: () => void;
};
```

The component may own transient pointer-drag state. Device phase, session start, simulated time, battery state, sleep/wake, and successful unlock remain owned by the existing device/session layer.

No implementation step should introduce a second clock, a second session timer, or a Lock Screen-only battery calculation.

## READY IMPLEMENTATION

### 1. State integration

Evidence status: **SOURCE-DERIVED / READY**.

Planned work:

1. Render the Lock Screen component only when the existing device phase is `locked`.
2. Continue rendering a pure black screen for `sleeping`; do not leave Lock Screen content mounted as a visible overlay.
3. Route successful slider completion through one explicit `onUnlock` callback to `springboard`.
4. Set `unlockEpochMs` only if it is currently absent, preserving the existing session epoch on later sleep/wake cycles.
5. Preserve `previousPhase`, warnings, badges, user identity, and other session fields during lock/sleep transitions.
6. Keep camera routing absent.

State transition contract:

| Current state | Input | Result | Session effect |
|---|---|---|---|
| `locked` | short power press | `sleeping` | No reset; preserve clock and battery epoch. |
| `sleeping` | short power press | `locked` | Wake locked; preserve all session data. |
| `sleeping` | Home press | `locked` | Wake locked; do not unlock. |
| `locked` | Home press | `locked` | No navigation. |
| `locked` | completed slider drag | `springboard` | Initialize `unlockEpochMs` only for the first unlock. |
| `locked` | cancelled/incomplete drag | `locked` | Reset transient knob position only. |

Validation:

- Unit-test the transition functions independently of visual assets.
- Verify sleep/wake does not reset `unlockEpochMs`, battery percentage, badges, user name, or simulated time.
- Verify neither a tap on the slider track nor a Home press unlocks the device.

### 2. Time and date synchronization

Evidence status: shared live time and locale-formatted date are **SOURCE-DERIVED / READY**; exact typography is **HOLD**.

Planned work:

1. Promote the current elapsed-time-derived instant to a single value, conceptually `deviceDateTime`.
2. Derive both `deviceTime` and `deviceDate` from that same instant and the same fixed simulation time zone (`America/Los_Angeles`).
3. Pass formatted values into Lock Screen and other screens; individual screen components must not contain a hardcoded clock or date literal.
4. Use the en-US 12-hour clock cycle for the project locale and an English long weekday/month date. The planned Lock Screen and Status Bar presentation is `12:02`, without a visible 24-hour value.
5. Update time and date on the existing shared timer tick. Do not add a Lock Screen-specific interval.

Formatting contract:

- Time source: `SESSION_START_ISO + elapsedMs`.
- Time format: hour and two-digit minute using the en-US 12-hour clock cycle; planned surface text at session start is `12:02`.
- Date source: the same computed instant, not the host's unrelated current date.
- Date format for the current English presentation: `Wednesday, October 20` pattern generated through `Intl.DateTimeFormat`, not stored as component text.

Validation:

- At a given elapsed value, Lock Screen, SpringBoard, and app status bars receive identical time strings.
- Sleep for a simulated interval, wake, and verify the Lock Screen reflects elapsed device time and the corresponding date.
- Test a simulated midnight crossing so time and date advance together.

### 3. Status bar structure

Evidence status: 20-point height and group structure are **SOURCE-DERIVED / READY**; exact glyph rasters and fixed coordinates are **HOLD**.

Planned work:

1. Keep one semantic Status Bar component with a 20-point logical height.
2. Add an explicit presentation mode such as `variant="lockscreen" | "application"` rather than duplicating the component.
3. Preserve logical group order:
   - left: signal, carrier, network;
   - center: status-bar time on SpringBoard/apps, Lock Screen lock-status slot when authenticated evidence permits;
   - right: conditional Bluetooth, battery percentage, battery glyph.
4. Keep carrier and conditional indicators flow-based. Do not freeze universal x coordinates because their widths and presence vary.
5. Continue consuming the shared device clock and shared battery value.
6. Until authentic status rasters are recovered, retain explicit HOLD slots or existing research placeholders without labeling them authentic.
7. Do not insert a modern padlock, web icon library glyph, emoji, or newly drawn SVG into the Lock Screen center slot.

Validation:

- Height remains exactly 20 logical points.
- Lock Screen and application variants use the same time/battery sources.
- Conditional Bluetooth presence does not reorder battery percentage and battery glyph.
- No HOLD glyph is silently replaced by a modern substitute.

### 4. Sleep/wake rendering

Evidence status: **SOURCE-DERIVED / READY**.

Planned work:

1. `locked` renders the Lock Screen at exactly 320 × 480 logical points.
2. `sleeping` renders black only within the device screen.
3. A short Sleep/Wake press changes `locked` to `sleeping` immediately.
4. Sleep/Wake or Home changes `sleeping` to `locked` without unlocking.
5. Do not replay boot, animate the Apple logo, reset the session, or restore the previously open app directly on wake.
6. Keep long-power behavior delegated to the existing power-state path.

Validation sequences:

- `locked → power short → sleeping → power short → locked`.
- `springboard → power short → sleeping → Home → locked`.
- Confirm identical simulated time/battery continuity across each sequence.
- Confirm sleeping has no clickable invisible Lock Screen controls.

### 5. Slide-to-unlock interaction

Evidence status: continuous left-to-right drag and successful unlock are **SOURCE-DERIVED / READY**. Exact travel, completion threshold, easing, and return motion are **UNKNOWN / HOLD**.

Planned work:

1. Retain pointer-driven drag interaction on the visible knob slot only.
2. Use pointer capture so an active drag remains coherent when the pointer leaves the knob.
3. Compute normalized progress from the measured runtime geometry of the track and knob rather than a duplicated hardcoded pixel distance.
4. Clamp progress to `[0, 1]` and expose it as a transform applied to the complete knob asset slot.
5. Keep completion policy in one named provisional constant with an evidence comment and plan reference. Do not describe the current `.78` value as historical.
6. On a completed drag, invoke `onUnlock` exactly once.
7. On pointer cancellation or an incomplete release, restore progress to zero without navigation.
8. Prevent native image dragging, text selection, and unintended track-button activation.
9. Do not add tap-to-unlock, vertical swipe, inertia, bounce, spring physics, glow, ripple, or modern gesture behavior.

Provisional-policy rule:

- Interaction must remain usable while exact motion evidence is HOLD.
- Any provisional threshold or return duration must be named as such, kept outside artwork, and be replaceable without changing state routing.
- Visual chrome must remain a HOLD slot; interaction readiness does not authorize a CSS recreation of the slider.

Validation:

- Dragging right updates only the knob position.
- Releasing below the provisional threshold returns the knob and leaves the state locked.
- Releasing at/above the provisional threshold enters SpringBoard once.
- Track clicks, keyboard shortcuts, vertical movements alone, and surrounding Lock Screen presses do not unlock.
- Pointer cancellation leaves no stuck drag state.

## HOLD ASSET SLOTS

All paths below are reserved destinations, not files to create before recovery. The final filename may be corrected to the exact original resource name if target-build extraction establishes one; provenance documentation must record any project-facing rename.

### Asset acceptance gate shared by every slot

Before a HOLD asset can be wired:

1. Recover it from the authenticated `iPhone3,1_4.1_8B117_Restore.ipsw` root filesystem or another demonstrably exact-build first-party package.
2. Record original archive/filesystem path, filename, byte size, dimensions, color mode, alpha status, and SHA-256.
3. Preserve the recovered bytes. Do not crop, resize, optimize, recompress, recolor, sharpen, redraw, or change alpha.
4. Store evidence in `docs/evidence/ios4.1-lockscreen-assets.md` and cross-reference the source artifact and extraction tooling.
5. Promote the byte-for-byte asset into the reserved tracked path.
6. Verify the promoted file hash against the recovered file before use.
7. Determine whether the raster is a complete composite, a stretchable/capped image, or a fixed-size element from source metadata or SpringBoard rendering behavior. Do not infer stretch regions from appearance.
8. Replace only the matching HOLD slot and run geometry, alpha-compositing, and regression validation.

### 1. Slider background

- Status: **UNKNOWN / HOLD**.
- Expected tracked path: `src/assets/historical/ios4.1/lockscreen/slider-track-iphone3,1-8B117@2x.png`.
- Authentic asset dimensions: **unknown**.
- Visual cross-check only: the composited on-screen track is approximately 560 × 98 physical pixels (280 × 49 logical points). This is not necessarily the source raster size and must not be used to manufacture an asset.
- Usage location: bottom Lock Screen slider region, behind the instruction text and movable knob.
- Placeholder policy: expose a track asset slot without adding final artwork. Existing CSS research chrome may remain visibly identified as provisional, or the slot may remain empty; it must not be documented as authentic.
- Replacement strategy: after recovery, inspect cap/stretch metadata and SpringBoard usage; render at its source-supported bounds and scaling mode, preserve alpha, remove only the provisional track styling, and leave drag/state logic unchanged.

### 2. Slider knob

- Status: **UNKNOWN / HOLD**.
- Expected tracked path: `src/assets/historical/ios4.1/lockscreen/slider-knob-iphone3,1-8B117@2x.png`.
- Authentic asset dimensions: **unknown**.
- Visual cross-check only: the complete on-screen knob is approximately 138 × 84 physical pixels (69 × 42 logical points). This does not prove source raster dimensions.
- Usage location: the visible, pointer-draggable element at the left edge of the slider track.
- Placeholder policy: preserve a semantic knob control and pointer hit target without claiming its current CSS gradient or geometry is final artwork.
- Replacement strategy: place the recovered raster unchanged inside the knob control, set the control's logical size from verified 2× metadata, preserve alpha, and apply drag translation to the complete raster canvas rather than its visible-content bounds.

### 3. Slider arrow

- Status: **UNKNOWN / HOLD**.
- Expected tracked path: `src/assets/historical/ios4.1/lockscreen/slider-arrow-iphone3,1-8B117@2x.png`.
- Authentic asset dimensions: **unknown**.
- Usage location: centered within the slider knob, unless the recovered knob raster already contains the arrow.
- Placeholder policy: do not use `›`, Unicode arrows, emoji, CSS polygons, modern SVG, or an icon-library substitute as final artwork.
- Replacement strategy: first determine whether 8B117 stores the arrow separately or composites it into the knob. If separate, preserve its original canvas and source-derived placement. If composite, do not create or render this slot; use the complete knob resource and record that this reserved path is intentionally unused.

### 4. Lock Screen wallpaper

- Status: **UNKNOWN / HOLD**.
- Expected tracked path: `src/assets/historical/ios4.1/lockscreen/default-lockscreen-wallpaper-iphone3,1-8B117@2x.png` (extension must follow the authentic recovered format if PNG is not original).
- Authentic asset dimensions: **unknown**.
- Expected display area: the full 640 × 960 framebuffer / 320 × 480 logical screen beneath translucent system chrome, subject to recovered crop/scaling semantics.
- Usage location: bottom-most visual layer of the `locked` screen only.
- Placeholder policy: do not use the period screenshot's denim crop, a modern recreation, a generated image, or an assumed SpringBoard wallpaper. A CSS research background must remain explicitly provisional.
- Replacement strategy: retain the authentic original format and canvas; establish crop, scale, and alignment from 8B117 source/resource metadata or exact-build visual evidence; render behind all Lock Screen UI without editing the image. Do not assume the Lock Screen and SpringBoard use the same file.

### 5. Status glyph rasters

- Status: **UNKNOWN / HOLD**.
- Expected directory: `src/assets/historical/ios4.1/statusbar/`.
- Reserved project-facing paths, subject to exact recovered names:
  - `signal-iphone3,1-8B117@2x.png`
  - `network-3g-iphone3,1-8B117@2x.png`
  - `bluetooth-iphone3,1-8B117@2x.png`
  - `lock-iphone3,1-8B117@2x.png`
  - `battery-frame-iphone3,1-8B117@2x.png`
  - `battery-fill-iphone3,1-8B117@2x.png`, only if 8B117 actually uses a raster fill resource
- Authentic asset dimensions: **unknown for every glyph**. The 20-point/40-pixel status-bar height constrains the containing region, not each raster's dimensions.
- Usage location: shared 20-point Status Bar; the centered lock glyph is Lock Screen-specific, while signal/network/Bluetooth/battery resources are shared according to actual system state.
- Placeholder policy: do not replace HOLD glyphs with emoji, modern SF Symbols, icon libraries, newly drawn SVGs, or screenshot crops.
- Replacement strategy: recover the complete status-bar resource family, including state variants and `@2x` counterparts; retain original filenames in the evidence map; select variants from existing shared state; preserve intrinsic canvas and alpha; replace only corresponding placeholder renderers. Do not hardcode x positions that break when carrier width or conditional indicators change.

## Additional visual HOLD boundaries

The requested asset slots do not resolve every visual unknown. The following remain HOLD even after behavior implementation:

- clock and date font file, face, weight, nominal size, tracking, line metrics, and shadows;
- top and bottom chrome bounds, gradients, borders, opacity, and compositing;
- slider text font, highlight/mask animation, tracking, and shadow;
- exact slider travel, threshold, cancellation behavior, and animation curve.

These must remain documented as provisional and must not be presented as historically exact.

## Recommended implementation sequence

1. **Shared time model:** expose one computed device instant and derive time/date formatters from it.
2. **Lock Screen boundary:** extract the existing Lock Screen markup into a dedicated component with the minimal props above.
3. **State contract:** connect existing sleep/wake and unlock transitions without changing phase names or unrelated state.
4. **Status structure:** add a Lock Screen variant and explicit center glyph slot while leaving unrecovered artwork on HOLD.
5. **Slider interaction:** separate normalized pointer behavior from all visual resources and label provisional constants.
6. **HOLD slots:** add imports only when accepted authentic files exist. Missing assets must not break the application and must not trigger invented fallback art.
7. **Evidence-backed replacement:** wire each recovered resource independently after passing its acceptance gate.
8. **Regression validation:** verify boot, power, session timer, battery warnings, SpringBoard, apps, Home button, persistence, and footer are unchanged.

## Planned file impact when implementation is authorized

This document does not modify these files; it identifies the narrow future change surface:

| Path | Planned responsibility |
|---|---|
| `src/device/App.tsx` | Replace inline Lock Screen markup with component invocation and pass shared state/formatters. |
| `src/device/LockScreen.tsx` | Dedicated Lock Screen structure and transient slider interaction. |
| `src/device/StatusBar.tsx` | Shared semantic status structure and Lock Screen/application variant, if split from `App.tsx`. |
| `src/state/deviceMachine.ts` | Shared simulated instant/date formatter or named transition helper only if needed; preserve timer semantics. |
| `src/styles/device.css` | Structural layout and explicit asset slots; no fabricated final historical artwork. |
| `src/assets/historical/ios4.1/lockscreen/` | Accepted exact-build Lock Screen assets only. |
| `src/assets/historical/ios4.1/statusbar/` | Accepted exact-build status glyph families only. |
| `docs/evidence/ios4.1-lockscreen-assets.md` | Provenance, extraction record, dimensions, modes, hashes, and placement evidence. |

Component extraction is recommended for evidence boundaries, but it must not alter unrelated device rendering or behavior.

## Acceptance criteria

### READY behavior

- Lock Screen appears only in `locked`; black-only screen appears in `sleeping`.
- Power and Home wake to Lock Screen without unlocking or resetting session data.
- A completed horizontal knob drag routes to SpringBoard once.
- Cancelled or incomplete drags remain locked.
- Lock Screen time/date and all status-bar time consumers derive from one simulated device instant.
- Status bar remains 20 logical points tall and preserves left/center/right semantic grouping.
- No iOS 5+ camera or modern Lock Screen behavior appears.

### HOLD integrity

- Missing authentic resources remain identifiable HOLD slots.
- No screenshot crop, approximation, generated image, CSS recreation, Unicode glyph, emoji, modern SVG, or modern icon is promoted as final artwork.
- Every promoted asset has exact source path, dimensions, mode/alpha status, and matching cryptographic hash in the evidence record.
- Replacing an accepted asset does not require changes to device state, shared time, or slider routing.

## Stop conditions

Stop visual implementation and leave the relevant slot on HOLD if:

- the resource cannot be tied specifically to `iPhone3,1` / iOS 4.1 / `8B117`;
- only a screenshot crop, later-iOS resource, recreation, or modern substitute is available;
- source dimensions, alpha handling, cap/stretch semantics, or placement cannot be established;
- promotion changes the recovered bytes;
- implementing the resource would require speculative changes to unrelated screens or device behavior.
