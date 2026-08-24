# iOS 4.1 Slide To Unlock Text Rendering Audit v0.3

## Scope

This is an evidence audit only. It makes no application, CSS, geometry, animation, Status Bar, or asset change.

Evidence priority:

1. **ORIGINAL:** recovered iPhone3,1 iOS 4.1 build 8B117 resources, localized strings, and directly decoded CgBI alpha.
2. **PERIOD-EVIDENCE:** contemporaneous customization reports describing the relevant SpringBoard/TelephonyUI resources.
3. **CORROBORATION:** later runtime-hook observations of the private `SBAwayLockBar` API. These cannot independently establish exact 8B117 implementation details.

## 1. Text glyph source

### Findings

The glyphs are generated dynamically rather than stored in `bottombarlocktextmask@2x.png`:

- The decoded 160×64px mask contains one horizontal alpha ramp repeated identically through all 64 rows. It has no letter silhouettes.
- 8B117 provides localized runtime strings rather than a fixed English text raster.
- The ordinary lock label and notification-target label are different strings: `AWAY_LOCK_LABEL` resolves to the localized slide-to-unlock instruction, while the recovered `SMS_LOCK_LABEL` is `slide to view`.
- The same lock-bar presentation must therefore accept text content at runtime.
- Period modification instructions changed `AWAY_LOCK_LABEL` in `SpringBoard.strings`, demonstrating that the displayed phrase followed localized string content rather than fixed glyph artwork. [Period customization report](https://www.iphoneincanada.ca/2009/08/23/how-to-change-the-slide-to-unlock-text/)
- Later `SBAwayLockBar` runtime-hook reports expose a private `_setLabel:` method. This is useful corroboration for a dynamic label path, but it postdates 8B117 and does not establish the concrete label class or drawing backend. [Runtime-hook observation](https://stackoverflow.com/questions/21033942/change-slide-to-unlock-text-color-ios)

### Classification

- **READY:** text content and glyphs are produced dynamically; no recovered static glyph raster is responsible for the phrase.
- **READY:** `bottombarlocktextmask@2x.png` is not a glyph mask.
- **HOLD:** whether 8B117 uses `UILabel`, a private UIKit subclass/view, direct Core Graphics/CoreText drawing, or another SpringBoard-private wrapper.
- **HOLD:** whether `_setLabel:` receives an `NSString`, attributed object, or private label model in the exact 8B117 binary.

Calling the renderer specifically “CoreText” or specifically “UILabel” would exceed the available evidence. The defensible description is **SpringBoard private runtime text rendering using localized string content**.

## 2. Base text appearance

### Evidence-supported observations

- The text is horizontally placed in the right-hand portion of the lock well, separate from the raster knob.
- Period appearance supports a muted light gray/silver base with a brighter moving reflection, not a persistently pure-white label.
- The content is localized and can change by lock context, so its metrics are runtime text metrics rather than fixed raster bounds.

### Values

| Property | Current implementation | Historical conclusion |
| --- | --- | --- |
| Font family | `"Helvetica Neue", Helvetica, Arial, sans-serif` | **HOLD**; no exact 8B117 font call recovered |
| Font size | 21px/pt in the logical simulation | **HOLD**; period appearance alone is insufficient |
| Weight | browser default normal | **HOLD** |
| Base color | `#ccc` | broad gray/silver direction supported; exact RGB **HOLD** |
| Base element alpha | default `1` | exact historical alpha **HOLD**; current value is not provenance-backed |
| Text shadow | none on the label itself | exact highlight/shadow treatment **HOLD** |
| Antialiasing | browser/platform text rasterization | **HOLD** and not equivalent to a verified UIKit framebuffer |

No modern reconstruction is used to upgrade these values. The current CSS values remain functional approximations, not READY historical constants.

## 3. Highlight sweep

### Asset role

`bottombarlocktextmask@2x.png`:

- 160×64px / 80×32pt;
- Apple CgBI, 8-bit RGBA;
- SHA-256 `41ebbdb16bfae569c68e2b4119e41c35ede724d5f55a968f25974fb29cf9a233`;
- all 64 alpha rows are identical;
- all 160 columns have nonzero alpha;
- decoded alpha range is 13–255 along the horizontal axis.

This establishes a horizontal gloss/intensity mask. A January 2011 customization account identifies the same TelephonyUI resource as the replaceable image responsible for the flashing lock text effect, corroborating its animated highlight role close to the target period. [Period resource report](https://jingyan.baidu.com/article/11c17a2c5d2048f446e39d2a.html)

Classification:

- **READY:** authentic horizontal moving-gloss mask role.
- **READY:** the final visible gloss must be constrained to runtime-rendered text; otherwise the mask would expose a rectangle rather than letter shapes.
- **HOLD:** exact mechanism used to combine glyph alpha and sweep alpha (`CALayer.mask`, private view drawing, or another compositor path).
- **HOLD:** mask starting position, travel distance, clipping bounds, opacity range, duration, idle delay, and repeat interval.
- **HOLD:** whether the original animation repeats immediately or schedules separated passes.

The current 2.8-second linear infinite animation and `.65` peak opacity must not be treated as verified values.

## 4. Current implementation gap

### Current project

```text
browser-rendered HTML label (#ccc, default opacity 1)
  + duplicate white HTML label
  + moving historical horizontal mask on the duplicate
```

### Evidence-supported historical model

```text
localized runtime string
  → SpringBoard/private system glyph rendering
  → muted base text composite
  + historical horizontal gloss mask clipped by the glyph alpha
```

The broad architecture is similar in that both require dynamic text plus a separate moving effect. The fidelity gaps are:

- the browser font rasterizer and fallback stack are not verified equivalents of the 8B117 system renderer;
- the base `#ccc` and full element opacity are unsupported constants;
- the project duplicates the text node to produce the gloss, while the exact original layer/view arrangement is unknown;
- current opacity, duration, mask travel, and continuous-repeat behavior are approximations;
- the current mask positioning is implementation-specific and has not been derived from `SBAwayLockBar` runtime geometry.

## READY / HOLD summary

### READY

- Dynamic localized text source rather than a phrase raster.
- Separate base-glyph and moving-highlight responsibilities.
- Authentic 8B117 mask asset identity and horizontal sweep role.
- Need to clip the sweep result to dynamically rendered glyphs.

### HOLD

- Concrete text class/API and drawing backend.
- Font family, size, weight, kerning, baseline, antialiasing, color, alpha, and shadow.
- Exact Core Animation/private compositor layer order and blend operation.
- Highlight clipping coordinates, opacity, timing, movement, pause, and repeat behavior.

### REJECT

- Treating `bottombarlocktextmask@2x.png` as a glyph raster.
- Claiming current browser typography or animation constants as historically verified.
- Replacing the dynamic text with generated, SVG, screenshot-derived, or recreated raster artwork.

## Required next evidence

The remaining HOLD items require the exact 8B117 `SBAwayLockBar` method/ivar trace or an authenticated runtime capture suitable for pixel and timing measurements. Until then, implementation may preserve readable dynamic text but must label typography and animation values as approximations.

## Validation boundary

Only this Markdown file is created. No code, CSS, assets, or geometry are modified.
