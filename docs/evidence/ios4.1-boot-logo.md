# iOS 4.1 iPhone 4 boot logo provenance

- Device: iPhone 4 GSM (`iPhone3,1`)
- Operating system: iOS 4.1
- Build: `8B117`
- Firmware: `iPhone3,1_4.1_8B117_Restore.ipsw`
- Original IMG3: `applelogo-640x960.s5l8930x.img3`
- Decoded raster: `192 × 320` pixels, 8-bit grayscale with alpha
- Decoded PNG SHA-256: `5ab71d5218f28dc55d324b2fba8821ca8a50cac31201a71baf19ea45ef5d33d6`

## Verified placement

iBoot centers the complete image canvas on the `640 × 960` Retina framebuffer,
using signed X and Y offsets of zero. It does not scale the source image and
alpha-composites it over the black framebuffer.

- Retina asset rectangle: `x = 224`, `y = 320`, `width = 192`, `height = 320`
- Logical asset rectangle: `x = 112`, `y = 160`, `width = 96`, `height = 160`
- Logical visible-mark bounds: `x = 127.5..193.5`, `y = 163..245`
- Logical visible-mark center: approximately `x = 160.25`, `y = 203.75`

The complete source raster is positioned as above. The visible Apple silhouette
is intentionally not centered independently.
