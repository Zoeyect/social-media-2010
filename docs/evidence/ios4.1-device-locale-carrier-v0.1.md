# iOS 4.1 Device Locale & Carrier Configuration Audit v0.1

## Scope and evidence boundary

Narrative target: iPhone 4, iOS 4.1, United States, Pacific Time, Wednesday 20 October 2010, approximately 12:02–12:17 AM.

This document separates:

1. **Firmware provenance** — iPhone3,1 iOS 4.1 build 8B117, which remains unchanged.
2. **Simulated runtime configuration** — carrier/SIM, locale, time zone, user preferences, and transient radio state.

Classification:

- **READY** — sufficiently established for the stated narrative.
- **HOLD** — depends on user preference, location, connectivity, or an unresolved target-build rendering branch.

No runtime value is changed by this audit.

## 1. Carrier audit

### Historical target

Apple’s contemporary U.S. launch release states that iPhone 4 was sold through Apple and AT&T and required a two-year AT&T rate plan. Apple did not announce the Verizon iPhone 4 until January 2011, with availability beginning 10 February 2011. AT&T is therefore the historically appropriate U.S. carrier for a GSM iPhone3,1 on 20 October 2010. [Apple, June 2010](https://www.apple.com/newsroom/2010/06/28iPhone-4-Sales-Top-1.7-Million/), [Apple and Verizon, January 2011](https://www.apple.com/newsroom/2011/01/11Verizon-Wireless-Apple-Team-Up-to-Deliver-iPhone-4-on-Verizon/)

The exact 8B117 filesystem independently contains `/System/Library/Carrier Bundles/ATT_US.bundle`, including authentic status-bar carrier artwork:

| Asset | Physical / logical size | SHA-256 | Status |
| --- | --- | --- | --- |
| `Default_CARRIER_ATT@2x.png` | 63×40 / 31.5×20 | `152689c82028e27a645440f5ba01772cd6fb974fc1547516ac126e9f41e92243` | **READY asset** |
| `FSO_CARRIER_ATT@2x.png` | 63×40 / 31.5×20 | `b75add2544c6cdc48b61103db8fa8cfca99cc5fcbb3005ed06a7ec286711b44e` | **READY asset** |

The audit copies used for hashing were temporary and were not added to the application.

### Current comparison

| Property | Current | Recommended target | Classification |
| --- | --- | --- | --- |
| Carrier value | Hard-coded `SoftBank` | `AT&T` | AT&T **READY**; current value mismatches narrative |
| Carrier renderer | Runtime HTML text | Select authentic ATT raster appropriate to active status-bar style, or prove the text path | Asset identity **READY**; Default/FSO selection **HOLD** |
| Firmware source | iPhone3,1 8B117 | unchanged | **READY** |

`SoftBank` is coherent with the project’s former Tokyo narrative, but it is not coherent with the newly specified United States narrative. Changing carrier state does not require changing firmware provenance.

## 2. Status-bar network audit

The current status model supports `none`, `EDGE`, `3G`, and `WiFi`; it uses exact recovered 8B117 signal, EDGE, UMTS/3G, Wi-Fi, Bluetooth, and battery assets. `Black_DataTypeUMTS.png` visibly represents `3G`.

| Item | Current | U.S. October 2010 recommendation | Classification |
| --- | --- | --- | --- |
| Signal | 5 of 5 bars | Choose a narrative radio state; five bars is possible but not implied by locale | **HOLD** |
| Carrier | `SoftBank` | `AT&T` | AT&T **READY** |
| Cellular data | `3G` | `3G` is historically valid and coherent with an AT&T session | Capability/artwork **READY**; actual connection **HOLD** |
| EDGE | supported, inactive | Valid fallback when UMTS is unavailable | **READY capability**; session use **HOLD** |
| Wi-Fi | supported, inactive | Would replace cellular data-type presentation when connected | **READY capability**; connection **HOLD** |
| Bluetooth | disabled, glyph absent | Plausible neutral state | Capability **READY**; user/device state **HOLD** |
| Battery percentage | always displayed | Historically optional user preference | Capability **READY**; preference **HOLD** |
| Battery value | begins near 22%, drains toward 1% | Narrative/device simulation, independent of locale | **HOLD narrative state** |

Apple’s period-adjacent user documentation describes cellular `3G`/`E` and Wi-Fi as conditional connectivity indicators, and battery percentage as a setting rather than a mandatory display. The exact 8B117 assets locally establish the relevant glyphs; no glyph modification is required.

Recommended baseline display for the target scene: `AT&T` plus `3G`, Bluetooth absent. This is a deterministic narrative choice, not a claim that every U.S. iPhone displayed 3G or five bars at all times.

## 3. Time-format audit

### Current behavior

- `SESSION_START_ISO`: `2010-10-20T22:02:00+09:00`.
- Formatting time zone: `Asia/Tokyo`.
- Time locale: `en-GB`.
- `hour12: false`, producing 24-hour time such as `22:02`.
- The same formatted value feeds both Status Bar and Lock Screen.

This represents Wednesday night in Tokyo. As an absolute instant it is 20 October 2010 06:02 PDT, not the corrected 20 October 00:02 Pacific session.

### Target behavior

| Property | Recommended future value | Classification |
| --- | --- | --- |
| Start instant | `2010-10-20T00:02:00-07:00` | **READY narrative value** |
| IANA time zone | `America/Los_Angeles` | **READY** |
| UTC offset at target instant | PDT, UTC−07:00 | **READY** |
| Locale | `en-US` | **READY** |
| Default user convention | 12-hour time | **READY U.S. baseline** |
| Narrative clock preference | 12-hour cycle; no 24-hour display | **READY target decision** |

The corrected U.S. session runs from 12:02 AM to 12:17 AM. The planned visible Lock Screen and Status Bar text is `12:02` through `12:17`, with no 24-hour display. A future implementation may still use separate surface formatters so an internal en-US day period does not force unwanted visible `AM` text.

## 4. Date-format audit

The current date formatter already uses `en-US` with weekday, full month, and day, but applies `Asia/Tokyo`. At the current simulated start it therefore produces `Wednesday, October 20`.

For `America/Los_Angeles` at the recommended start instant, the target output is:

`Wednesday, October 20`

| Property | Target | Classification |
| --- | --- | --- |
| Language | English (U.S.) | **READY** |
| Weekday | Wednesday | **READY** |
| Month/day order | October 20 | **READY** |
| Comma after weekday | `Wednesday, October 20` | **READY locale recommendation** |
| Capitalization | title-style English names | **READY locale recommendation** |
| Exact iOS 4.1 lock-screen formatter/punctuation branch | unresolved from target runtime | **HOLD** |
| Year | omitted in current and proposed Lock Screen display | Plausible; exact runtime pattern **HOLD** |

The current `Intl.DateTimeFormat` field selection matches the requested example structurally. The date and time-zone inputs do not.

## 5. Language and locale assumptions

| Surface | Current assumption | Recommended target | Status |
| --- | --- | --- | --- |
| System UI | English strings | English (United States) | **READY** |
| Date formatter | `en-US` | `en-US` | **READY**, time zone change required |
| Time formatter | `en-GB`, 24-hour | `en-US`, 12-hour cycle | Change required; target fixed |
| Carrier | SoftBank text | AT&T runtime carrier presentation | Change required |
| Unlock copy | English | English | **READY language**; typography/artwork separate |
| App conversations/content | not audited here | preserve until a dedicated content task | **HOLD/out of scope** |

Carrier text is a network/carrier-bundle result, not a translation of the system-language setting. English UI and AT&T carrier presentation are compatible but independently configured.

## 6. Current versus target summary

| Configuration | Current | Recommended future configuration | Evidence level |
| --- | --- | --- | --- |
| Firmware | iPhone3,1 / 4.1 / 8B117 | unchanged | **READY** |
| Region | Japan narrative | United States | **READY target** |
| Carrier | SoftBank | AT&T | **READY target** |
| Network | 3G, five bars | AT&T + 3G; signal strength selected separately | 3G valid; strength **HOLD** |
| Time zone | Asia/Tokyo | America/Los_Angeles | **READY target** |
| Start | 20 Oct, 22:02 JST | 20 Oct, 00:02 PDT | **READY target** |
| Time format | 24-hour | 12-hour U.S. cycle | **READY target decision** |
| Date | Wednesday, October 20 | Wednesday, October 20 | Date text matches; time zone/runtime instant still require change |
| Language | mixed `en-GB` time / `en-US` date; English UI | consistent `en-US` | **READY target** |
| Bluetooth | off | off is a safe neutral choice | **HOLD state** |
| Battery percentage | shown | explicit narrative preference required | **HOLD** |

## Required future changes

1. Replace the simulated start with `2010-10-20T00:02:00-07:00` and use `America/Los_Angeles` for display.
2. Replace the `en-GB` 24-hour formatter with an `en-US` 12-hour cycle that presents `12:02` on the Lock Screen and Status Bar without a 24-hour value.
3. Replace `SoftBank` with AT&T carrier presentation.
4. Audit the active status-bar style before choosing `Default_CARRIER_ATT@2x.png` versus `FSO_CARRIER_ATT@2x.png`; do not fabricate an AT&T wordmark.
5. Retain `3G` only as an explicit scene state; separately choose signal strength, Wi-Fi state, Bluetooth state, and battery-percentage preference.
6. Keep firmware-provenance evidence distinct from the corrected U.S. runtime narrative in future documentation.

## Remaining HOLD decisions

- Default versus FSO AT&T raster selection for each rendered Status Bar context.
- Exact iOS 4.1 AM/PM rendering on Lock Screen versus Status Bar.
- User choice for battery percentage.
- Scene-specific signal strength, EDGE/3G/Wi-Fi connectivity, and Bluetooth state.
- Exact target-build localized Lock Screen date punctuation and year omission.

## Validation boundary

Only this audit document is added. No source code, runtime configuration, historical asset, or fictional application content is changed.
