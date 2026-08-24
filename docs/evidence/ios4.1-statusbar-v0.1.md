# iOS 4.1 Status Bar evidence audit v0.1

## Scope and classification

Target: iPhone 4 GSM (`iPhone3,1`), iOS 4.1, build `8B117` (Baker), portrait orientation.

This is an evidence audit only. No status-bar asset is promoted and no application code is changed.

- **READY** — identity or behavior is established by the verified 8B117 filesystem/binary and can be used without inventing missing detail.
- **SOURCE-DERIVED** — directly supported by strings, selectors, filenames, or state fields in the exact 8B117 SpringBoard binary, but not a recovered final raster/metric.
- **VISUAL-CROSSCHECK** — supported by dated iOS 4 captures or period documentation, but not sufficient by itself for exact pixels.
- **HOLD** — exact asset identity, dimensions, alpha, font metric, coordinate, color, or compositing value is not safely recoverable from the present evidence.
- **REJECTED** — an authentic file exists but is not the status-bar resource, or the candidate comes from a later/recreated UI.

## 1. Evidence sources

### Verified target filesystem

| Evidence | Path / identity | Hash | Result |
|---|---|---|---|
| Restore IPSW | `tmp/firmware/iPhone3,1_4.1_8B117_Restore.ipsw` | SHA-1 `a3f8a333ca181146b862ca6a59c9a6e7c27eba0b` | Previously verified exact iPhone3,1 4.1/8B117 restore |
| SpringBoard executable | `tmp/firmware/rootfs/recovered/SpringBoard.app/SpringBoard` | SHA-256 `95699718cc3f92d6d2fb7293b632504fcc50498d8ee92215cae4a1f863d1a65d` | Exact binary; 1,575,168 bytes |
| Retina UIKit shared artwork | `tmp/firmware/rootfs/recovered/UIKit.framework/Shared@2x~iphone.artwork` | SHA-256 `7f2265f0488bda6d49c3a95506193ced36cd461b85460011a45be1d4d38c17e4` | Exact packed archive; 17,663,232 bytes |

The shared artwork archive is authentic but has not been extracted with an authenticated iOS 4.1 name/index map. The available historical extractor depends on a matching historical SDK/private UIKit mapping. Blind carving would lose runtime identity, so unnamed images are not classified READY.

The recovered `UIKit.framework/UIKit` file is zero bytes and supplies no executable evidence. Conclusions below therefore use the exact SpringBoard binary, the packed artwork archive, and period Apple documentation.

### Exact-binary identifiers

The 8B117 SpringBoard executable contains the source path `/SourceCache/SpringBoard/SpringBoard-1205.49/SBStatusBarDataManager.m` and the class/selector family `SBStatusBarDataManager`. Relevant exact strings include:

- `_signalStrengthBars`, `_signalStrengthRSSI`, `_updateSignalStrengthItem`, `SBSignalStrengthChangedNotification`
- `CarrierName`, `StatusBarCarrierName`, `setCarrierName:`, `SBFakeCarrier`
- `_usingWifi`, `_updateStatusBar`, and `Wi-Fi Black 0.png` through `Wi-Fi Black 3.png`, corresponding White variants 0–3, and Blue variants 1–3
- `_configureTimeItemDateFormatter`, `_timeItemTimeString`, `_updateTimeItem`, `_updateStatusBarLockAndTime`
- `_updateBatteryItem`, `_lastBatteryPercentage`, `_isBatteryCharging`, `SBShowBatteryPercentage`
- `_updateBluetoothItem`, `_updateShowsBluetoothButtonAnimated:`, `SBBluetoothController`
- `SBDefaultStatusBarStyleKey`, `UIStatusBar`, `StatusBarPortrait.png`, and `StatusBarLandscape.png`

These establish system-managed status items and state updates, but string presence alone does not establish final glyph bounds or layer geometry.

### Period/Apple references

- Apple identifies the iPhone 4 as a 2010 device and links its iOS 4.2/4.3 user guide from the [iPhone 4 documentation index](https://support.apple.com/en-us/docs/iphone/132927). The guide documents signal, carrier/network, Wi‑Fi, Bluetooth, time and battery status meanings; 4.2/4.3 is close corroboration, not proof of every 8B117 pixel.
- Apple documents `UIStatusBarStyleBlackTranslucent` as a transparent black style in [UIKit documentation](https://developer.apple.com/documentation/uikit/uistatusbarstyle/uistatusbarstyleblacktranslucent). This corroborates the period translucent status-bar mode; it does not establish SpringBoard's exact opacity or raster.
- Existing project research records the 20-point status band and dated visual crosschecks in [`ios4.1-springboard.md`](./ios4.1-springboard.md) and [`ios4.1-lockscreen-v0.2.md`](./ios4.1-lockscreen-v0.2.md).

## 2. Coordinate system and shared structure

| Space | Screen | Status-bar band | Scale |
|---|---:|---:|---:|
| Logical UIKit points | 320 × 480 | `x=0, y=0, w=320, h=20` | 1× |
| Retina pixels | 640 × 960 | `x=0, y=0, w=640, h=40` | 2× |

The iPhone 4 is a rectangular pre-notch screen. There is no modern safe-area inset. Status items occupy a fixed 20-point-high top band and pack into left, center and right groups. Carrier width and optional network/Bluetooth/percentage items prevent universal fixed x coordinates for every item.

## 3. Signal indicator and carrier region

### Signal

- **Structure: SOURCE-DERIVED.** The exact binary maintains `_signalStrengthBars` and RSSI, receives `SBSignalStrengthChangedNotification`, and updates a distinct signal-strength item.
- **Five-bar appearance: VISUAL-CROSSCHECK.** Period iOS 4 phone captures show five ascending cellular bars, read left-to-right. Approximate logical study bounds are `x≈3..22, y≈4..16`, with narrow inter-bar spacing. These are not extracted 8B117 constants.
- **Color/state: HOLD at pixel level.** Status-bar style families require contrasting light/dark glyph variants. Exact active/inactive colors, inactive-bar treatment, spacing and alpha are inside packed artwork or UIKit composition and are not named by the current extraction.
- **Asset path: HOLD.** No standalone signal PNG was found in recovered SpringBoard or TelephonyUI resources. The likely source is `/System/Library/Frameworks/UIKit.framework/Shared@2x~iphone.artwork`.
- **Dimensions/alpha/Retina name: HOLD.** The archive is Retina (`@2x~iphone`) but an authenticated entry name and decoded raster are unavailable.

### Carrier

- **Rendering mechanism: SOURCE-DERIVED / text.** `CarrierName`, `StatusBarCarrierName`, `_carrierName`, and `setCarrierName:` show that SpringBoard supplies a dynamic carrier string rather than selecting one fixed carrier-name bitmap.
- **String identity: variable.** `SoftBank` is plausible only when supplied by the active Japanese carrier bundle/SIM. It is not a universal 8B117 default and has not been recovered as the fixed target value. The current hard-coded string is therefore **HOLD** as a historical session claim.
- **Typography: HOLD.** Period UIKit strongly indicates system-rendered text, but the exact font face, point size, weight, antialiasing, baseline and tracking have not been recovered. Approximate study placement is immediately after signal, near `x≈24`; width depends on the localized carrier string.

## 4. Network indicators

| Indicator | Exact-build evidence | Asset result | Classification |
|---|---|---|---|
| `3G` | SpringBoard data/status management and period user-guide semantics; exact glyph filename not exposed | No authenticated raster or bounds | **SOURCE-DERIVED behavior / HOLD artwork** |
| `EDGE` / `E` | `EDGEIsOn` and EDGE state strings exist in exact binary | No authenticated raster or bounds | **SOURCE-DERIVED behavior / HOLD artwork** |
| Wi‑Fi | Exact binary names Black/White levels 0–3 and Blue levels 1–3 | Filenames established; files not recovered standalone and packed entry map unavailable | **SOURCE-DERIVED names/states / HOLD dimensions and alpha** |
| Bluetooth | `_updateBluetoothItem` and animated show/hide selector in exact binary | Status glyph not recovered by authenticated name | **SOURCE-DERIVED behavior / HOLD artwork** |

The network indicator follows the carrier in the left group. Wi‑Fi replaces cellular data-type text when active; exact conditional layout is UIKit/SpringBoard managed. Approximate `SoftBank` + `3G` study ranges (`carrier x≈24..72`, `3G x≈75..92`) are visual estimates only.

The Blue Wi‑Fi filenames may refer to a selected/tinted context rather than the normal SpringBoard status bar. Their presence does not authorize assigning Blue to the normal 8B117 state without a runtime map.

## 5. Clock

- **Text, not a time bitmap: SOURCE-DERIVED.** The exact binary configures a date formatter, generates `_timeItemTimeString`, maintains a timer, and calls `_updateTimeItem`.
- **Alignment: READY structurally.** Period iOS 4 evidence places the time on the full-screen horizontal center axis (`x=160` logical), not centered only in leftover space between variable side groups.
- **Color: style-dependent.** In a dark/translucent SpringBoard or Lock Screen status bar the period content is light/white. Exact RGB and shadow/alpha are **HOLD**.
- **Font metrics: HOLD.** UIKit/system font rendering is established, but exact family, point size, weight, baseline, kerning and glyph bounds for build 8B117 have not been extracted. Approximate visible study bounds are `y≈3..17` within the 20-point band.
- **Lock Screen exception: SOURCE-DERIVED / HOLD artwork.** `_updateStatusBarLockAndTime` establishes distinct lock/time handling. Period Lock Screens show a centered lock indicator rather than the ordinary centered time. The lock raster remains packed and unnamed.

## 6. Battery item

### Runtime behavior

The exact binary establishes a distinct battery item, percentage state, charging state and update path through `_updateBatteryItem`, `_lastBatteryPercentage`, `_isBatteryCharging`, `batteryCapacityAsPercentage`, `SBShowBatteryLevel`, and `SBShowBatteryPercentage`.

- Battery glyph is the rightmost status item in period portrait layouts, ending near `x≈317` logical in visual studies.
- Numeric percentage is optional and placed immediately left of the glyph when the preference is enabled. It is not universally always present.
- Charging and empty/low states exist, but the exact status-bar frame, fill mask, bolt/plug treatment, thresholds and color values remain **HOLD**.
- Period behavior supports a red low-battery fill, but exact 8B117 threshold-to-raster/color mapping is not established by the recovered status artwork. Do not infer the final color from modern iOS.

### Asset identity

No authenticated standalone status-battery frame/fill PNG was found. It is likely in `Shared@2x~iphone.artwork`; therefore intrinsic dimensions, alpha, Retina entry name and hashes are **HOLD**.

The following exact-build SpringBoard files are **REJECTED as status-bar assets**:

- `BatteryHUD.png` / `BatteryHUD@2x.png` — 27×265 and 54×530, alpha; full charging HUD strip, not the small status item.
- `BatteryBG_1...17` and Retina siblings — Lock Screen charging-battery frames, not status glyphs.
- `BatteryReflectionMask` pair — charging display reflection, not status glyph.

### Current implementation comparison

The current component draws a 22×9 logical CSS frame, a two-pixel cap, a proportional CSS fill, and always displays percentage text. This is behaviorally suggestive but not pixel-authentic:

- Frame/cap dimensions and border thickness: **HOLD**.
- Fill geometry and exact low-red color: **HOLD**.
- Percentage should be preference-dependent; current unconditional display is a gap.
- Charging status glyph/treatment is absent.
- Current percentage typography is generic Arial rather than an authenticated 8B117 metric.

## 7. Bluetooth

- **Presence and conditionality: SOURCE-DERIVED.** The exact binary updates a Bluetooth status item and animates its visibility. Bluetooth is therefore valid in the iOS 4.1 status bar when the relevant connection/state warrants it; it is not necessarily always visible.
- **Placement: VISUAL-CROSSCHECK.** It belongs to the right-side indicator cluster before optional battery percentage/battery. Its exact x coordinate changes with other active items.
- **Artwork: HOLD.** The authenticated status glyph is not available as a named decoded raster.
- `SpringBoard.app/BluetoothLockbar.png` (19×24, SHA-256 `ea1552a216ce4e27e774b09f856de62fe1119a9bd6863a581f2d666e80752316`) and `BluetoothLockbar@2x.png` (38×48, SHA-256 `2e7703e29c254c42989d3ae5340e0b68b90216618b57483d9774e1abe1d6fc9f`) are authentic 8B117 assets but are **REJECTED for the status bar**: name, dimensions and bundle context identify the Lock Screen/media lock bar, not the small status item.
- The current inline SVG is recreated artwork and is not approved as historically exact.

## 8. Status-bar background and per-screen behavior

- **Height: READY** at 20 logical points / 40 Retina pixels.
- **UIKit style capability: READY.** `UIStatusBarStyleBlackTranslucent` is the period transparent-black style; exact SpringBoard use is corroborated by dated captures.
- **SpringBoard: VISUAL-CROSSCHECK.** Wallpaper continues beneath a dark translucent status layer with light content. Exact opacity, gradient/highlight raster, blend mode and `StatusBarPortrait.png` identity remain **HOLD**.
- **Lock Screen: VISUAL-CROSSCHECK / SOURCE-DERIVED.** The bar is dark/translucent over the Lock Screen, but its centered item changes from time to lock state. Exact lock glyph and backdrop compositing remain **HOLD**.
- **Opaque black variants:** UIKit supported opaque and translucent styles. App-specific status bars can differ; no single SpringBoard treatment should be generalized to every application.

## 9. Retina and logical mapping

For any authenticated `@2x` status asset, render one logical point per two source pixels without resampling the source file. The current packed archive name establishes that a Retina family exists, but individual source dimensions cannot be reported until named extraction succeeds.

Approximate layout study only:

| Group | Logical location | Retina mapping | Confidence |
|---|---|---|---|
| Full status band | `0,0,320,20` | `0,0,640,40` | **READY** |
| Signal | `x≈3..22, y≈4..16` | double each coordinate | **VISUAL-CROSSCHECK** |
| Carrier | begins near `x≈24` | begins near `x≈48 px` | **VISUAL-CROSSCHECK** |
| Clock | centered on `x=160` | centered on `x=320 px` | **READY structurally** |
| Right group | right-aligned, ending near `x≈317` | near `x≈634 px` | **VISUAL-CROSSCHECK** |

These ranges are not implementation constants.

## 10. Current implementation gap table

| Component | Evidence | Current implementation | Status |
|---|---|---|---|
| Status band | 20 pt / 40 px | 20 px logical height | **READY structure** |
| Signal bars | System item; five-bar period appearance; packed raster | Five CSS rectangles with invented sizes/spacing | **HOLD artwork/metrics** |
| Carrier | Dynamic carrier text | Hard-coded `SoftBank`, generic Arial | **SOURCE-DERIVED text mechanism; HOLD value/type metrics** |
| Network | Conditional `3G`/EDGE/Wi‑Fi item; Wi‑Fi filename families in binary | Hard-coded `3G` | **SOURCE-DERIVED behavior; HOLD artwork/layout** |
| Clock | System-formatted text centered on screen | Centered shared text | **READY behavior; HOLD typography** |
| Lock Screen center | Separate lock/time update path; period centered lock | Ordinary time remains centered | **HOLD asset; implementation gap** |
| Bluetooth | Conditional system item; raster packed | Always-present recreated SVG | **HOLD artwork; visibility gap** |
| Battery percentage | Optional preference-controlled text | Always present | **Behavior gap** |
| Battery glyph | System item with fill/charging states; raster packed | CSS border/cap/fill | **HOLD artwork/geometry** |
| Low battery | Period low state; exact status raster/color mapping unavailable | CSS fill uses `#e21b23` at ≤20% | **HOLD exact threshold/color** |
| Background | Period dark/translucent styles | Fixed `rgba(0,0,0,.62)` | **Structure plausible; HOLD exact compositing** |

## 11. Final disposition

### READY / safe structural facts

- 320×480 logical / 640×960 Retina coordinate system at 2×.
- 20-point / 40-pixel status band.
- System-managed signal, carrier, network, time, Bluetooth, percentage and battery item families exist in exact 8B117 SpringBoard.
- Carrier and clock are dynamic text/data items, not fixed full-string screenshots.
- Clock uses the center axis in the ordinary status bar; Lock Screen has distinct lock/time handling.
- Battery percentage is optional; Bluetooth is conditional.

### HOLD

- Named extraction of signal, cellular data, Bluetooth, battery and centered-lock glyphs from `Shared@2x~iphone.artwork`.
- Intrinsic dimensions, alpha and per-file SHA-256 hashes for those glyphs.
- Exact active/inactive signal treatment and spacing.
- Exact carrier/clock/percentage font family, size, weight, baseline and antialiasing.
- Exact item coordinates under every conditional combination.
- Exact battery outline, fill mask, charging/empty variants, colors and thresholds.
- Exact SpringBoard/Lock Screen status-background opacity, image identity and compositing.
- Proof that `SoftBank` is the runtime carrier string for the simulated session.

### Rejected substitutes

- Modern iOS or iOS 5+ status glyphs.
- Recreated SVG/CSS glyphs as claims of original artwork.
- `BluetoothLockbar`, `BatteryHUD`, `BatteryBG_*`, and charging reflection resources as status-bar glyphs.
- Blind extraction or visual naming of anonymous entries from the packed archive.

The next evidence-safe step is an authenticated build-matched extraction/name map for `Shared@2x~iphone.artwork`, followed by per-entry hashes, dimensions, alpha inspection and exact-runtime identity tracing.
