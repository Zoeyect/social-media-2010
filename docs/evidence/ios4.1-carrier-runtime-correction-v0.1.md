# iOS 4.1 Carrier Runtime Correction v0.1

## Scope

This correction changes only simulated carrier configuration and its shared Status Bar presentation. The target is a U.S. iPhone 4 on iOS 4.1 build 8B117 using AT&T 3G on 20 October 2010.

## Previous configuration

```text
carrier: SoftBank
network: 3G
renderer: HTML carrier text
```

`SoftBank 3G` was structurally valid but contradicted the selected U.S./Pacific narrative.

## Corrected configuration

The shared runtime configuration is now:

```ts
{
  carrier: "AT&T",
  networkType: "3G",
  locale: "en-US",
  region: "US",
  carrierArtworkVariant: "FSO"
}
```

`locale` and `region` describe this carrier configuration only. This task does not change the existing clock, date, time-zone, or timeline formatter logic.

Both Lock Screen and SpringBoard consume the same `StatusBar` and `StatusBarState`, so both now present the same `AT&T` plus authentic `3G` state without duplicate configuration.

## Asset usage

The active Status Bar uses white `Black_*` status glyphs over its existing dark background. The corresponding carrier-bundle branch is therefore the FSO artwork:

| Asset | Source | Size | SHA-256 | Status |
| --- | --- | --- | --- | --- |
| `FSO_CARRIER_ATT@2x.png` | `/System/Library/Carrier Bundles/ATT_US.bundle/` in the verified 8B117 HFS | 63×40 px / 31.5×20 pt | `b75add2544c6cdc48b61103db8fa8cfca99cc5fcbb3005ed06a7ec286711b44e` | **READY, integrated** |
| `Default_CARRIER_ATT@2x.png` | Same verified carrier bundle | 63×40 px / 31.5×20 pt | `152689c82028e27a645440f5ba01772cd6fb974fc1547516ac126e9f41e92243` | **READY asset, inactive style** |

The FSO file was extracted byte-for-byte into `src/assets/historical/ios4.1/statusbar/carrier/`. It is rendered at its native Retina logical size. No recoloring, conversion, CSS recreation, SVG, or modern AT&T branding is used.

The existing authentic `Black_DataTypeUMTS.png` continues to supply the adjacent `3G` glyph. No network artwork changed.

## READY

- AT&T is the historically appropriate carrier for the selected U.S. GSM iPhone3,1 narrative.
- `AT&T` and `3G` are now supplied by one deterministic shared runtime configuration.
- Authentic FSO AT&T artwork is selected for the active dark Status Bar context.
- Lock Screen and SpringBoard inherit the correction through their existing shared Status Bar.

## HOLD

- Default carrier artwork remains inactive until a light/default Status Bar context is implemented and verified.
- Signal strength, actual cell conditions, EDGE fallback, Wi-Fi state, and Bluetooth state remain narrative/runtime choices.
- Exact carrier behavior during carrier loss, roaming, or SIM absence is outside this correction.
- Timeline and locale formatter correction remains a separate task; this change does not silently alter it.

## Preservation boundary

No lifecycle, geometry, signal/3G/battery artwork, clock formatting, wallpaper, Lock Screen layout, SpringBoard behavior, application runtime, audio runtime, application UI, or existing historical PNG byte was modified.
