# iOS 4.1 Status Bar Artwork Extraction v0.2

## Scope

- Target: iPhone 4 (`iPhone3,1`), iOS 4.1, build `8B117`.
- Source path in the verified filesystem: `/System/Library/Frameworks/UIKit.framework/Shared@2x~iphone.artwork`.
- Recovered source: `tmp/firmware/rootfs/recovered/UIKit.framework/Shared@2x~iphone.artwork`.
- Promoted exports: `src/assets/historical/ios4.1/statusbar/`.
- No application source, state logic, or styling was changed by this extraction.

## Source verification and method

| Evidence | Value |
| --- | --- |
| Artwork archive size | 17,663,232 bytes |
| Artwork archive SHA-256 | `7f2265f0488bda6d49c3a95506193ced36cd461b85460011a45be1d4d38c17e4` |
| Exact support map | `Shared@2x~iphone.artwork-17663232.json` |
| Support-map metadata | iOS `4.1.0`, 728 image records, 17,663,232 bytes |
| Support-map SHA-256 | `2279f090fb25fa7b4df064b8a7d4273380721bc9da7693347c983b90c654edcb` |
| Support-map repository revision | `cwalther/iphone-tidbits` at `859248f39aa0c6e98f675aa204c99e43395c2837` |

The archive is an old UIKit artwork container containing premultiplied BGRA rasters, not a directory of embedded PNG files. Each promoted PNG is a lossless RGBA normalization of the raw record at the exact offset and dimensions in the build-matched support map. The archive was not modified. Consequently, the hashes below identify the deterministic exported PNG files; they are not hashes of embedded PNG byte streams.

The exact Retina map supplies the archive index, byte offset, dimensions, and generic key `shared-iphone-2x-N`. Original UIKit names were recovered by matching its opening status-bar record block against the named legacy `Shared~iphone.artwork` map: indices 0–27 retain the same order and have exactly doubled dimensions. The decoded pixels independently confirm the mapping (bars, Wi-Fi arcs, `3G`, Bluetooth rune, battery frame/fills, and charging bolt).

This approach follows the historical artwork tool design, in which JSON support files carry names, dimensions, and offsets derived from UIKit. See [Dave Peck’s artwork-tool description](https://davepeck.org/2010/12/06/an-ios-artwork-tool-update/). Apple’s archived high-resolution guidance establishes that an `@2x` image has scale 2 and half-sized logical dimensions: [Supporting High-Resolution Screens In Views](https://developer.apple.com/library/archive/documentation/2DDrawing/Conceptual/DrawingPrintingiOS/SupportingHiResScreensInViews/SupportingHiResScreensInViews.html).

All exported files are PNG RGBA images with an alpha channel. Physical dimensions are source pixels; logical dimensions are points at the archive’s 2x scale.

## Signal strength

| Original name | Artwork key / index | Raw offset | Physical | Logical | Alpha | SHA-256 |
| --- | --- | ---: | ---: | ---: | --- | --- |
| `Black_0_Bars.png` | `shared-iphone-2x-2` | 16,384 | 38×40 | 19×20 | yes | `c91a48a7d933dc755f8c288eba8f4fcca03e10ba95dbce0b7b08d39fa64fd1c5` |
| `Black_1_Bars.png` | `shared-iphone-2x-4` | 32,768 | 38×40 | 19×20 | yes | `833bf8a6b120dd5998c8cc26a578b64e6587a6ce638b2a65248481a85367ee1c` |
| `Black_2_Bars.png` | `shared-iphone-2x-6` | 49,152 | 38×40 | 19×20 | yes | `3fdbe80916a3c075a2ad7f76c3dad9cc816d7d53791e23c6042bd6daf6938516` |
| `Black_3_Bars.png` | `shared-iphone-2x-8` | 65,536 | 38×40 | 19×20 | yes | `5dbb4857e1c5aa981dbcc1a3eabe5df0269803e2a1b5b905a6ff25a1a3b43ece` |
| `Black_4_Bars.png` | `shared-iphone-2x-10` | 81,920 | 38×40 | 19×20 | yes | `6f08326e66d990fc2c48f372d620512bd6533938dbb2346c41b73099e53ced55` |
| `Black_5_Bars.png` | `shared-iphone-2x-11` | 90,112 | 38×40 | 19×20 | yes | `028dca56c59975f030a0faf096642662292ca7c7ee04eb545a443eecda351745` |

The family provides six states, 0–5 bars. The decoded glyphs are light/white; `Black` identifies the UIKit status-bar style family and must not be interpreted as the visible glyph color.

## Network indicators

| Original name | Artwork key / index | Raw offset | Physical | Logical | Alpha | SHA-256 |
| --- | --- | ---: | ---: | ---: | --- | --- |
| `Black_0_WifiBars.png` | `shared-iphone-2x-3` | 24,576 | 40×40 | 20×20 | yes | `8f9530ca24999aa4b43ecea3a930c6ab63d8dc44f51ffbb514070c13bec4434a` |
| `Black_1_WifiBars.png` | `shared-iphone-2x-5` | 40,960 | 40×40 | 20×20 | yes | `e48a255bb7fcd9f78cc9505b5cb53d4538ad04533b2738b906b6c0e09756b7ad` |
| `Black_2_WifiBars.png` | `shared-iphone-2x-7` | 57,344 | 40×40 | 20×20 | yes | `c15538e5545b78e939382e501261be9db1dc9ee797e540d99da94ca04480ea0b` |
| `Black_3_WifiBars.png` | `shared-iphone-2x-9` | 73,728 | 40×40 | 20×20 | yes | `b61ed35c75fe9b713c1e353185a07d3db70d6e4a9ec6d13d39ddd76e9c43897b` |
| `Black_DataTypeEDGE.png` | `shared-iphone-2x-24` | 172,032 | 12×40 | 6×20 | yes | `9a4d9a1e4fb255c744730bd6b014ac490abafdb4178cc75a845ac3fad035c4c9` |
| `Black_DataTypeGPRS.png` | `shared-iphone-2x-25` | 176,128 | 14×40 | 7×20 | yes | `e5d3899601bebcdb6cbbe27fe256e0bb0c704745cd8b968decbd33250328ca25` |
| `Black_DataTypeUMTS.png` | `shared-iphone-2x-26` | 180,224 | 30×40 | 15×20 | yes | `a2c120bcdc016f99cf02b7234d35aaf7dd459be1c1dc2ea5a176776f5aa96c5f` |

`Black_DataTypeUMTS.png` is the original artwork name; its decoded visible label is `3G`. GPRS was recovered because it is adjacent source evidence, although it was not required by the request.

## Bluetooth

| Original name | Artwork key / index | Raw offset | Physical | Logical | Alpha | SHA-256 |
| --- | --- | ---: | ---: | ---: | --- | --- |
| `Black_Bluetooth.png` | `shared-iphone-2x-20` | 147,456 | 22×40 | 11×20 | yes | `493f5ad667d07eebf9a2683225ed9a466495c7b435e11b55e54177d8edf014d4` |
| `Black_BluetoothConnected.png` | `shared-iphone-2x-21` | 151,552 | 22×40 | 11×20 | yes | `8a0b2dc265c3a6e3b01ccd6111ce61842c4a1a2b8984367d35953e07f082a8e8` |

## Battery

| Original name | Artwork key / index | Raw offset | Physical | Logical | Alpha | SHA-256 |
| --- | --- | ---: | ---: | ---: | --- | --- |
| `Black_BatteryCharged.png` | `shared-iphone-2x-15` | 114,688 | 42×40 | 21×20 | yes | `ba2624aeba1976c8b7b9cab569b961aea52520490a97f110b38e98f0e39ecbc5` |
| `Black_BatteryCharging.png` | `shared-iphone-2x-16` | 122,880 | 42×40 | 21×20 | yes | `bc66c5e217d758dbe4e1b487944faf15a225e1c107831d13ca5793c8aa3c0c9c` |
| `Black_BatteryDrainingBG.png` | `shared-iphone-2x-17` | 131,072 | 42×40 | 21×20 | yes | `340323b9fb783326397574a061c46c1c065dabedeb579738a5772043c7e49aec` |
| `Black_BatteryDrainingInsides.png` | `shared-iphone-2x-18` | 139,264 | 6×40 | 3×20 | yes | `c04210ea0cab708db485b7b1505d8d3814abecceebc3ad486888b03e1156015d` |
| `Black_BatteryDrainingInsidesLow.png` | `shared-iphone-2x-19` | 143,360 | 6×40 | 3×20 | yes | `f172850b94d881f00a03ad50e458752f171f7cb69b2036ae7564eb22ae193f2f` |

UIKit stores the draining battery as components. A normal battery is the draining background plus the normal fill strip composed to the current level; a critical battery uses the low fill strip. No flattened “normal” or “critical” PNG was manufactured. The charging and charged records are complete source glyphs.

## Readiness classification

| Component | Evidence | Status |
| --- | --- | --- |
| Signal 0–5 | Exact 8B117 offsets/dimensions; decoded glyphs; source-derived names | **READY** |
| Wi-Fi 0–3 | Exact 8B117 offsets/dimensions; decoded glyphs; source-derived names | **READY** |
| EDGE | Exact 8B117 record and decoded `E` glyph | **READY** |
| 3G | Exact 8B117 `DataTypeUMTS` record; decoded artwork displays `3G` | **READY** |
| Bluetooth | Exact 8B117 normal and connected records | **READY** |
| Battery charging/charged | Exact complete 8B117 records | **READY** |
| Battery normal components | Exact background and normal fill records | **READY** |
| Battery critical components | Exact background and low-fill records | **READY** |
| Flattened normal/critical battery PNG | Not present as a discrete record; UIKit composes components | **HOLD — do not invent** |
| Exact battery fill cap/stretch rules and percentage thresholds | Not established by the artwork archive alone | **HOLD** |
| Runtime choice among Black/Silver and other style families by screen/state | Requires UIKit/SpringBoard runtime evidence | **HOLD** |
| Non-requested style/tint variants elsewhere in the 728-record archive | Not fully name-mapped in this pass | **HOLD** |

## Change boundary

This audit adds only the extracted PNG files under `src/assets/historical/ios4.1/statusbar/` and this evidence document. It does not wire the artwork into the application.
