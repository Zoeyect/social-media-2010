# iOS 4.1 Third-Party SpringBoard Icon Provenance v1.0

## Scope and target

This audit covers only the SpringBoard artwork for Facebook, Twitter, Instagram, Foursquare, Flickr, and Tumblr on the canonical iPhone 4 / iOS 4.1 / 20 October 2010 target. Application IDs, launch routes, page ordering, fixed-grid geometry, labels, badges, dock artwork, wallpaper, status-bar state, and application internals are outside this pass and remain unchanged.

## Evidence result

No original target-version IPA, application bundle, or icon payload for these six apps was found in the repository, ignored local evidence directories, or reachable Git history. The existing exact iOS 4.1 firmware assets cover Apple applications only. Therefore none of the six files below is labeled `ORIGINAL_ASSET`.

The supplied Web Design Museum pages expose dedicated 320×480 “Logo” reference frames containing a centered 176×176 rendering of the period icon. The live image host was blocked by Cloudflare in the audit environment, so the same image bytes were recovered from the listed Internet Archive snapshots. Each isolated icon was normalized into a clean standalone PNG and is classified `RECONSTRUCTED_FROM_PERIOD_REFERENCE`. This is reference-derived visual artwork, not a recovered bundle payload.

## Asset matrix

| App | Target-period evidence | Supplied reference | Archived logo snapshot | Production asset | Pixels | SHA-256 | Status |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| Facebook | Facebook 3.1.4 supplied iOS 4 and Retina support in mid-2010; original bundle absent | [Facebook for iPhone in 2010](https://www.webdesignmuseum.org/iphone/facebook-for-iphone-in-2010) | `20231122171804` | `Facebook-2010-reference@2x.png` | 114×114 | `471b6971281523cb276ec88ffe911d80438a9081613e32e78ed138f946c03340` | `RECONSTRUCTED_FROM_PERIOD_REFERENCE` |
| Twitter | First-party Twitter for iPhone existed by May 2010; reference confirms the white bird on blue artwork rather than a letter placeholder | [Twitter for iPhone in 2010](https://www.webdesignmuseum.org/iphone/twitter-for-iphone-in-2010) | `20231231070028` | `Twitter-2010-reference@2x.png` | 114×114 | `b12f9939f32c16816009ecec206e4f42f0b16a9717806be79af52ec856eccaaa` | `RECONSTRUCTED_FROM_PERIOD_REFERENCE` |
| Instagram | Instagram launched on 6 October 2010; reference shows the launch-era camera with rainbow stripe and `INST` tab | [Instagram for iPhone in 2010](https://www.webdesignmuseum.org/iphone/instagram-for-iphone-in-2010) | `20231231070430` | `Instagram-2010-reference@2x.png` | 114×114 | `03ea31e8af5afc1bbf8dc506a05c5dfcb365bd61f607ad47cd70493a6e8a777a` | `RECONSTRUCTED_FROM_PERIOD_REFERENCE` |
| Foursquare | Foursquare 2.0 shipped in September 2010; reference shows the cyan check-in/checkmark construction rather than a generic `4` | [Foursquare for iPhone in 2010](https://www.webdesignmuseum.org/iphone/foursquare-for-iphone-in-2010) | `20231231075829` | `Foursquare-2010-reference@2x.png` | 114×114 | `e31eddda163b1d974952c4e5e93218c9cac33c2b2af20476bed1ac78f65f6dfc` | `RECONSTRUCTED_FROM_PERIOD_REFERENCE` |
| Flickr | Flickr 1.2 was current and contemporary reporting says Retina artwork had not yet been added | [Flickr for iPhone in 2010](https://www.webdesignmuseum.org/iphone/flickr-for-iphone-in-2010) | `20231231071305` | `Flickr-2010-reference.png` | 57×57 | `93ea3a49ec696769b0a60469aa485166d2aea0c07a112461ac74f39b82061aa5` | `RECONSTRUCTED_FROM_PERIOD_REFERENCE` |
| Tumblr | Tumblr 1.2 added iOS 4 support in June 2010; reference shows the metallic framed lowercase `t` treatment | [Tumblr for iPhone in 2010](https://www.webdesignmuseum.org/iphone/tumblr-for-iphone-in-2010) | `20231231073422` | `Tumblr-2010-reference@2x.png` | 114×114 | `f2a704a65d07dcbecaf7a4ea551c7dc5cad391b7eb77f565d1b1118813d3ddf9` | `RECONSTRUCTED_FROM_PERIOD_REFERENCE` |

All production files live under `src/assets/historical/ios4.1/springboard/apps/third-party/`. The central mapping is `src/data/springBoardSocialApps.ts`.

## Raster normalization

- Five references were normalized to the iPhone 4 third-party Retina source contract of 114×114 pixels and render at 57×57 points.
- Flickr remains a 57×57 source because its target release is specifically documented as lacking Retina artwork. Inventing a 114×114 Flickr payload would overstate the evidence.
- No current App Store artwork, modern flat logo, text glyph, CSS letter substitute, AI-generated image, or crop from an application UI screenshot was used.
- The source frames are dedicated logo exhibits rather than application-screen crops. Their central artwork was isolated, resampled once with the platform image scaler, and retained as raster PNG. Existing icon masking, positions, labels, badges, and fixed-grid geometry are unchanged.

## Confidence and limitations

Visual identity, color family, emblem, gloss, and major material treatment are high-confidence relative to the supplied exhibits. Exact bundle bytes, original PNG alpha/mask margins, compression history, and minor pixel-level differences are unresolved. The pre-existing `iconStatus: "HOLD"` therefore continues to describe original-payload recovery, while `artworkStatus: "RECONSTRUCTED_FROM_PERIOD_REFERENCE"` explicitly describes the SpringBoard visual asset now in use.

An original, legally available period IPA or provenance-equivalent application bundle would supersede these reference derivatives. Until then, the assets must not be relabeled `ORIGINAL_ASSET`.
