# Facebook 2010 Original Icon Asset Recovery v1.0

## Canonical boundary

- Device: iPhone 4
- OS: iOS 4.1
- Client: Facebook native iPhone app
- Target: 2010-10-20, U.S. Pacific Time
- Scope: recovery and provenance audit for Facebook Home launcher artwork; badge and secondary-glyph discovery only

No launcher information architecture, labels, routes, hit areas, paging, state, badge logic, Search, notification behavior, or non-Home surfaces were changed.

## Result

A verified Facebook 3.2.1 (`3210`) iPhone package yielded original named Home launcher PNGs for all ten modules. The nine Page 1 assets are adopted as `SAME_ERA_CONFIRMED`: their motifs match the large native Home capture published on 2010-10-15, and contemporary reporting describes Facebook 3.2.2 as a login-fix release rather than a Home redesign. Notes is adopted as `ADJACENT_VERSION_PROBABLE` because no target-week Page 2 capture was recovered.

The exact target build, Facebook 3.2.2, was not recovered. Nothing in this report upgrades the adjacent package itself to `EXACT_TARGET_BUILD`.

## Search method and boundaries

The audit searched:

- the complete repository worktree and Git history for Facebook `.ipa`, `.app`, archive, artwork, sprite, atlas, and launcher-button candidates;
- `src/assets/`, `dist/`, `tmp/firmware/`, and existing evidence records;
- bounded local paths under `/Users/zoey/Developer`, `/Users/zoey/Documents`, `/Users/zoey/Downloads`, and `/tmp`;
- Internet Archive iPhoneOS package collections, with candidates filtered by bundle identity and target proximity.

No Facebook application bundle was present locally or in repository history. The repository's character media is narrative content, while the firmware material is Apple system/app artwork; neither is Facebook application chrome.

## Archive candidates

| Candidate | Date relationship | Decision |
| --- | --- | --- |
| Facebook 3.2.1 (`3210`) | immediately adjacent; August 2010, built with iPhoneOS 4.0 SDK | `ADJACENT_VERSION_PROBABLE` package; accepted source for the ten named Home assets |
| Facebook 3.2.2 | canonical version family | `HOLD` — exact package not found |
| Facebook 3.3.x / 3.4.x | later than target | `LATER_VERSION_REJECTED` |
| Facebook 4.1 / 4.1.1 | December 2011 / April 2012 | `LATER_VERSION_REJECTED` |
| pre-3.2 builds | before Places was introduced | rejected for the target Home set |

Archive source: [iOS Obscura](https://archive.org/details/iOSObscura), specifically its `iPhoneOS 3/com.facebook.Facebook` package directory. Target-near visual comparison used [Felix issue 1469, page 12](https://issues.felixonline.co.uk/felix_1469.pdf). A contemporary [Facebook 3.2.2 release report](https://thetechjournal.com/electronics/iphone/download-facebook-v3-2-2-for-iphone.xhtml) describes the update as fixing login issues.

## Package verification

The candidate was downloaded into an isolated temporary audit directory and inspected without executing application code.

| Field | Verified value |
| --- | --- |
| Bundle identifier | `com.facebook.Facebook` |
| Bundle version | `3210` |
| Facebook platform version | `3.2.1` |
| Minimum OS | `3.0` |
| SDK | `iphoneos4.0` |
| Device family | iPhone |
| ZIP integrity | PASS |
| Archive MD5 | `6f021a966c464df120aee7a070d149c1` |
| Archive SHA-256 | `804c7cab65633a830371692d618dd2f3e6db17511780d59c61c5a6119dfe557d` |

Archive metadata and internal file timestamps place the build in August 2010. Store-account metadata was deliberately excluded from the evidence record because it is irrelevant to asset provenance.

## Home launcher asset decision table

All adopted files are individual named `@2x` PNGs, 128 × 128 pixels, rendered at 64 × 64 points. The existing 64 × 58 launcher artwork band and optical offsets remain unchanged; the source canvas is centered within it.

| Module | Original filename | Confidence | Adopted |
| --- | --- | --- | --- |
| News Feed | `feedButton@2x.png` | `SAME_ERA_CONFIRMED` | yes |
| Profile | `profileButton@2x.png` | `SAME_ERA_CONFIRMED` | yes |
| Friends | `friendsButton@2x.png` | `SAME_ERA_CONFIRMED` | yes |
| Inbox | `inboxButton@2x.png` | `SAME_ERA_CONFIRMED` | yes |
| Places | `placesButton@2x.png` | `SAME_ERA_CONFIRMED` | yes |
| Requests | `requestsButton@2x.png` | `SAME_ERA_CONFIRMED` | yes |
| Events | `eventsButton@2x.png` | `SAME_ERA_CONFIRMED` | yes |
| Photos | `photosButton@2x.png` | `SAME_ERA_CONFIRMED` | yes |
| Chat | `chatButton@2x.png` | `SAME_ERA_CONFIRMED` | yes |
| Notes | `notesButton@2x.png` | `ADJACENT_VERSION_PROBABLE` | yes |

The package also includes 1× `*Button.png` counterparts. They are 64 × 64 except `placesButton.png`, which is 65 × 65; the Retina `placesButton@2x.png` is the expected 128 × 128. Production therefore uses the internally consistent Retina set for the canonical iPhone 4 target.

## Adopted checksum manifest

| File | SHA-256 |
| --- | --- |
| `feedButton@2x.png` | `be9c0efbb91846ccb38e63bd8c9063978e56387a69ef28c1ffcb0985cb09a518` |
| `profileButton@2x.png` | `23f332b8588e553a7105cd5f5f330f8d8f7b73b86a56834a9b6f5d02cf2873a0` |
| `friendsButton@2x.png` | `5abffa3dd1b1beba1e0d995128df525d9800a73041cc9a472269288d407c0224` |
| `inboxButton@2x.png` | `bb6d10f8adb8b74ed5ebc09ad186fa350ebd8be21d0d1de0d0fa6000a6dd3702` |
| `placesButton@2x.png` | `f5a2416d27876957ffffe2b2d83610229fbb53888d65ae1125eacdeef712c01b` |
| `requestsButton@2x.png` | `bd0397ecdfbe24181f34824f8b109598ec9242c8735ceeae9f7002b44274d124` |
| `eventsButton@2x.png` | `809d937f1af919b40d600461f6e36ceb30af45f8709c6e60f5169e1424460620` |
| `photosButton@2x.png` | `46dc3e661acc0ef980d7da7ab5d43673e4c361001cf098fc24abf1af4d3b2c59` |
| `chatButton@2x.png` | `8c723f7036a66a43df09ae348cea9e3e8ed7804a49ccf151b6ad41113f3c6b54` |
| `notesButton@2x.png` | `d56e198df052abdccf8a9a77731aff9086441bfff15f6df734c94b131c1dfc36` |

The validator locks filenames, dimensions, PNG signatures, SHA-256 values, registry mapping, source confidence, and fallback behavior.

## PNG, crop, and atlas audit

- The ten launcher files are ordinary browser-readable PNGs, not Apple CgBI PNGs. No channel conversion, decompression, crop, trace, resampling, or screenshot extraction was performed.
- Their transparent 128 × 128 canvases and original alpha bounds are preserved byte-for-byte.
- No Home sprite, atlas, `car`, or consolidated artwork file was found. Facebook 3.2.1 stores these launcher modules as individual named PNG resources.
- Oversized `*Large` artwork is used for detail/screen roles and was rejected for Home launcher use.
- The application `Icon.png` and `Icon@2x.png` are CgBI-encoded SpringBoard resources. They were audited but not adopted and would require a reversible conversion before browser use.

## Badge audit

The package contains two relevant 2× bubble backgrounds:

| Candidate | Size | SHA-256 | Observation |
| --- | ---: | --- | --- |
| `notificationBadge@2x.png` | 44 × 50 | `bdfc97412ee257717be78850704cc67f2784c6ea116540a1a080e2733fd3ef4d` | blue bubble with a bright rim |
| `notificationUnreadBadge@2x.png` | 44 × 50 | `8d562a0c676ef199ece3bcb7dd4cd7b0c2b9b430fca0360048b3ff0aaac45939` | red center, white outer halo, darker red edge/shadow and tail |

Neither image contains a numeral, so the package supports a raster-background plus dynamically drawn count model. `unread@2x.png` is a plain 32 × 32 blue dot, not the numeric Home badge. These findings are evidence only: badge rendering, count semantics, anchoring, delivery, and read logic were not changed. A separate semantic/visual confirmation is still required before adopting either background.

## Secondary glyph discoveries

The package also contains original-era candidates including `camera.png` (18 × 16), `cameraButton.png` (27 × 20), `cameraButtonN@2x.png` (60 × 60), `commentIcon@2x.png` (38 × 42), `likeIcon@2x.png` (44 × 40), `phoneButton@2x.png` (88 × 74), `addFriend@2x.png` (32 × 32), `tagArrow.png` (7 × 12), `Three20.bundle/images/searchIcon.png` (14 × 15), and `Three20.bundle/images/blueArrow@2x.png` (48 × 104).

These are `PROBABLE_ORIGINAL` candidate payloads for their named roles, but none was adopted in this Home-only pass. Exact semantic state mapping and target-screen comparison remain required.

## Rejected candidates

- Screenshot crops or traced pixels: rejected; screenshots remain comparison evidence only.
- CSS reconstructions as primary artwork: superseded by verified originals, retained only as load-failure fallbacks.
- `*Large` resources: rejected for Home because their role and geometry are different.
- Facebook 3.3+, 3.4+, and 4.x packages: rejected as later versions.
- Pre-Places packages: rejected as incomplete for the canonical target Home.
- Apple iOS artwork and repository character media: rejected as wrong product or semantic role.
- Modern icon libraries, SVGs, SF Symbols, icon fonts, and AI-generated art: rejected.

## Production adoption

- Exact recovered bytes live under `src/assets/facebook/home/3.2.1/`.
- `src/device/FacebookHomeIcons.tsx` maps the ten destination IDs to verified imports and provenance metadata.
- Existing CSS reconstructions remain isolated load-failure fallbacks.
- Existing launcher grid dimensions, label treatment, hit areas, per-icon optical offsets, routes, paging, badges, and state are unchanged.
- No external runtime URL or archive package is shipped.

## Remaining uncertainty and next step

Still missing are the exact 3.2.2 package, a target-week Page 2 capture confirming Notes, and screen-specific confirmation for badge and secondary-glyph states. Original-asset adoption is complete for the ten Home modules; the next step is manual browser comparison and, only if evidence supports it, micro-alignment that does not change the frozen grid. A pixel-traced replacement task is not recommended for these ten recovered icons. It should be considered only for still-unrecovered roles after archive candidates are exhausted.

## Validation record

- package ZIP integrity: PASS
- package/checksum verification: PASS
- source-asset to target-near Page 1 visual comparison: PASS
- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- manual browser, Home Page 1/Page 2: BLOCKED — no connected in-app browser was available; original source assets were visually compared directly with the target-near capture
