# Shared Icon Loading Fix + Core Social Friends Registry v0.1

## Scope

This change fixes the shared status-bar broken-image placeholder and centralizes the five ordinary fictional social contacts. It does not change Facebook information architecture, scheduler timing, the global clock, battery state, or visual fidelity styling.

## Icon bug root cause

The shared signal, network, battery, Bluetooth, and lock exports were standard PNG files and were already imported through Vite correctly. The AT&T carrier artwork was the exception: `FSO_CARRIER_ATT@2x.png` remained an Apple-optimized CgBI PNG copied byte-for-byte from the iOS carrier bundle. Web browsers do not decode CgBI PNG payloads, so the carrier `<img>` failed on every surface using the shared status bar. That single failure appeared as the same question-mark/broken-image placeholder on Lock Screen, Twitter, Facebook, and other app shells.

## Shared fix

- The original CgBI carrier file remains unchanged as provenance evidence.
- `FSO_CARRIER_ATT@2x.browser.png` is a standard-PNG decoding of the same approved historical raster for browser delivery.
- `src/data/statusBarAssets.ts` is now the single semantic registry for signal, EDGE/3G/Wi-Fi, carrier, Bluetooth, battery, and lock artwork.
- Lock Screen and app status bars consume that shared registry instead of maintaining duplicate import maps.
- `HistoricalStatusAsset` hides a failed image element. A missing runtime asset therefore fails to an empty HOLD-safe state instead of exposing alt text or a production question-mark placeholder.

No emoji, Unicode icon, CSS drawing, SF Symbol, SVG recreation, or generated replacement was introduced.

## Restored and verified mappings

| Semantic role | Approved historical source | Runtime policy |
| --- | --- | --- |
| Cellular signal 0-5 | `Black_0_Bars.png` through `Black_5_Bars.png` | READY standard PNG |
| EDGE / 3G / Wi-Fi | `Black_DataTypeEDGE.png`, `Black_DataTypeUMTS.png`, `Black_3_WifiBars.png` | READY standard PNG |
| AT&T carrier | original `FSO_CARRIER_ATT@2x.png` CgBI evidence plus decoded `.browser.png` | READY browser-compatible historical raster |
| Bluetooth | `Black_Bluetooth.png` | READY standard PNG |
| Battery charging/frame/fill | recovered `Black_Battery*.png` family | READY standard PNG |
| Lock indicator | `Black_Lock.png` | READY standard PNG |

App header navigation icons do not use this registry. Existing unrecovered app icons and avatars remain HOLD and were not replaced.

## Core social friends

`src/data/coreSocialFriends.ts` defines immutable records for Katie (`katie`), Matt (`matt`), Alex (`alex`), Chris (`chris`), and Jay (`jay`). The registry contains only neutral fictional identity metadata. Session-local unread, reply, follow, favorite, and friendship state remains outside the registry.

Twitter keeps its existing baseline:

- Mentions: Alex and Chris
- Direct Messages: Katie and Matt
- Jay is not forced into Twitter

Facebook keeps June and Jack as scheduled narrative characters. Generic Facebook filler records were migrated as follows:

| Previous filler | Core friend | Surfaces |
| --- | --- | --- |
| Mia | Katie (`katie`) | older Feed activity and older Inbox thread |
| Eli | Jay (`jay`) | older Feed status and older Inbox thread |

Katie's `katie` ID is reused by Twitter DM and Facebook seed content. No duplicate Katie identity record is created.

## Remaining HOLD assets

Unrecovered Facebook/Twitter home or navigation icon payloads and profile avatars remain HOLD. Production status artwork now fails empty if a registered raster cannot load; there is no visible generic question-mark fallback.

## Validation

Automated validation covers the immutable five-person registry, Twitter role assignments, Facebook migration, cross-app Katie ID reuse, June/Jack behavior through the existing scheduler checks, session reset behavior, and the unchanged global runtime tests. Manual browser inspection is still required for final pixel-level confirmation across Lock Screen and all app shells.
