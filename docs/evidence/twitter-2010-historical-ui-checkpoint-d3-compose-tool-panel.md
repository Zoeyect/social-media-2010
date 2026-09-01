# Twitter Historical UI Checkpoint D3 — Compose tool panel

Status: implemented from the supplied native-period 320×480 Compose capture.

## Locked structure

The panel remains 320×92 points with three approximately 106.67-point columns
and two 46-point rows. The confirmed order is Camera, Photo Library, Geotag,
Usernames, Hashtags, and Shrink URLs.

The shared panel uses a deterministic dark blue-gray vertical gradient plus a
subtle three-pixel horizontal microtexture repeat. Low-contrast one-pixel
separators divide columns and rows without creating six independent cards.
Labels use reconstructed 10/12 Helvetica Neue typography.

## Artwork and behavior

All six SVGs are `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`; none is authenticated
Twitter application-bundle artwork. Rendered bounds are:

- Camera: 24×18
- Photo Library: 24×20
- Geotag: 18×22
- Usernames: 22×22
- Hashtags: 21×21
- Shrink URLs: 24×20

Selected and pressed artwork remains HOLD. The complete panel is decorative,
`aria-hidden`, and contains no buttons, handlers, focus targets, tooltips, or
runtime state. Camera, Photos, location, username/hashtag pickers, and URL
shortening remain unsupported. D1 navigation/field behavior, D2 auxiliary
controls, the shared keyboard, Twitter state, and Public Visitor Twitter are
unchanged.

## Runtime rendering correction

Native-scale QA exposed a rendering failure at the CSS mask/compositing paint
boundary: Camera and Photo Library painted, while the other four valid and
mounted assets did not. The exact browser compositor trigger remains HOLD.
All six icons now use the same direct SVG `<img>` path; CSS masking and
filter-based recoloring are absent.

The SVG path data, viewBoxes, filenames, rendered bounds, order, and
`RECONSTRUCTED_FROM_PERIOD_SCREENSHOT` provenance are unchanged. Only their
mask-oriented black fill changed to the fixed subdued silver `#c5cfd4` needed
for direct rendering. The approved panel gradient, three-pixel microtexture,
divider contrast, label geometry, and inert behavior were not tuned in this
correction.

## D3.1 native-scale fidelity correction

Subsequent direct runtime/reference comparison supersedes the provisional
D3 icon scale and material values. Final independently reconstructed rendered
bounds are Camera 28×21, Photo Library 30×24, Geotag 25×27, Usernames 29×27,
Hashtags 28×27, and Shrink URLs 30×24. The prior bounds were 24×18, 24×20,
18×22, 22×22, 21×21, and 24×20 respectively. These measurements remain
`RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.

The direct-image fill is now the brighter deterministic pale silver
`#eef1f2`. Geotag is reconstructed as a circular head, stem, ring base, and
small directional detail; Photo Library uses three offset photo sheets;
Shrink URLs uses two large opposing inward arrows with small accent marks.
Usernames and Hashtags retain SVG artwork but have greater native-scale mass.

Labels use 11/13 Helvetica Neue at weight 500 and `#e4e9eb`. The rejected
three-pixel vertical repeat is replaced by a deterministic two-pixel
micro-dot/crosshatch field over the existing vertical material gradient.
Divider alpha is reduced from `.38/.42` to `.16/.18`, retaining the 3×2
topology while making the panel read as one field. All six tools remain inert,
and the 320×92 panel, D1, D2, keyboard behavior, Twitter state, and Public
Visitor Twitter remain unchanged.
