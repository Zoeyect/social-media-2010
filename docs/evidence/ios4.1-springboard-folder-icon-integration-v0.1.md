# iOS 4.1 SpringBoard Folder Icon Integration v0.1

## Asset

| Asset | Firmware source | Dimensions | SHA-256 |
| --- | --- | ---: | --- |
| `FolderIconBG@2x.png` | `/System/Library/CoreServices/SpringBoard.app/FolderIconBG@2x.png` | 118×124 physical / 59×62 logical | `17f5fff5e4456e77d2fe53efa35a22f4fd26c677a7a903e7f26c3f4226417f10` |

The tracked file is a byte-for-byte copy of the verified 8B117 CgBI PNG. It is rendered directly at its native logical size. No mask, gloss, shadow, recoloring, cropping, or CSS artwork is added.

## Placement

- Page: 2
- Row: 1
- Column: 1
- Presentation-cell source coordinate: `(16, 36)` logical points
- Folder artwork center: `(45.5, 67)` logical points
- Existing Page 1 READY positions are unchanged.
- The remaining fifteen Page 2 slots stay empty.

The visible label is `Social`, using the existing SpringBoard label element and unchanged typography. The name is an editorial folder name for this project, not a recovered device preference; its historical finality is **HOLD**.

## Interaction

The Folder icon dispatches `OPEN` to the existing reducer:

`closed → opening → open`

The opening animation moves from the Folder artwork center toward the centered panel using a flat translate/scale/opacity transition. Clicking outside dispatches `CLOSE`:

`open → closing → closed`

While SpringBoard is active, Home dispatches `CLOSE` for `open` or `opening` before applying the existing Home transition. Folder state is held at the App session layer, so sleeping does not replace or fork the device lifecycle logic.

## Contents and boundaries

The Folder grid remains twelve empty slots. It contains no icons, labels, placeholders, or click targets. No third-party application asset is integrated.

Exact iOS 4.1 folder thumbnail composition, final folder name provenance, and authentic interior panel artwork remain **HOLD**.
