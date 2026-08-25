# iOS 4.1 MobileSMS Camera Icon Integration v0.1

## Result

The MobileSMS composer camera control is **READY**. The normal and pressed controls were recovered directly from the decrypted iPhone3,1 iOS 4.1 build 8B117 filesystem under `/Applications/MobileSMS.app`.

No UIKit approximation, modern icon, SVG, CSS-drawn glyph, screenshot crop, or generated artwork is used.

## Assets

| Runtime asset | Firmware source | Dimensions | Format | Alpha | SHA-256 | Status |
| --- | --- | ---: | --- | --- | --- | --- |
| `src/assets/historical/ios4.1/mobilesms/PhotoButton@2x~iphone.png` | `/Applications/MobileSMS.app/PhotoButton@2x~iphone.png` | 52×54px / 26×27pt | Apple CgBI RGBA PNG | yes | `14237533749078b1d2b570e837bb69fc899a216471e1aeab7219ee95f5db6271` | **READY** |
| `src/assets/historical/ios4.1/mobilesms/PhotoButtonPressed@2x~iphone.png` | `/Applications/MobileSMS.app/PhotoButtonPressed@2x~iphone.png` | 52×54px / 26×27pt | Apple CgBI RGBA PNG | yes | `6850fb6d9feddca5ab8fd94e9bb72f67269ae3b5e77a8e1b7accc2e12fa5d1dd` | **READY** |

Both project files are byte-identical to the files extracted from the firmware. Their original CgBI data and alpha are preserved.

## Composition

- The authentic control is rendered at its native `26×27pt` logical size inside the existing `30×30pt` composer control slot.
- The normal raster provides both button chrome and camera glyph.
- Pointer press switches to the authentic pressed-state raster.
- The previous CSS circle, border, gradient, and shadow are removed from this control.
- The surrounding composer remains `44pt` high; its `29pt` text field and Send button are unchanged.

## Preservation boundary

The existing camera-picker click handler and ownership/return flow are unchanged. No Messages state, notification state, input behavior, audio, camera lifecycle, composer geometry, or historical asset bytes are modified.

