# iOS 4.1 SpringBoard Reconstruction v1.0

Target: SOCIAL MEDIA, 2010; iPhone 4; iOS 4.1; en-US portrait; 2010-10-20 U.S. Pacific Time.

## Canonical structure

| Rule | Classification | Implementation |
| --- | --- | --- |
| 4×4 page grid | PERIOD-EVIDENCE / CONFIRMED | fixed sixteen-slot arrays and four explicit CSS tracks |
| Four dock icons | PERIOD-EVIDENCE / CONFIRMED | Messages, Safari, Camera, YouTube |
| iOS 4 folder system | PERIOD-EVIDENCE / CONFIRMED | shared linen/shadow/notch expansion tray and existing reducer |
| Folder tray pointer | PERIOD-EVIDENCE / VISUAL-CROSSCHECK | one linen-textured pointer remains physically attached to every open shared folder tray |
| Pointer aligned to opened folder | PERIOD-EVIDENCE / VISUAL-CROSSCHECK | pointer center derives from the triggering slot's fixed-grid column center |
| Pointer dimensions | RECONSTRUCTED | 24×12-point triangular ramp; texture coordinates continue the recovered tray linen across the active column |
| Closed folder label hidden while open | PERIOD-EVIDENCE / VISUAL-CROSSCHECK | active icon remains visible while its ordinary SpringBoard label yields to the tray title |
| Folder tray title remains visible | PERIOD-EVIDENCE | white bold left-aligned folder name remains inside the tray |
| Folder tap splits Home Screen | PERIOD-EVIDENCE / CONFIRMED | contemporary Macworld describes the split reveal rather than a floating or full-screen page |
| Main Home area fades/slides upward | PERIOD-EVIDENCE / CONFIRMED | Macworld's June 21 hands-on explicitly describes this movement |
| Dock fades/slides downward | PERIOD-EVIDENCE / CONFIRMED | Macworld's June 21 hands-on explicitly describes this movement |
| Dark linen folder tray | PERIOD-EVIDENCE / CONFIRMED | recovered target-build linen and shadow assets implement the period tray |
| Tap outside closes folder | PERIOD-EVIDENCE / CONFIRMED | the June 21 hands-on specifies outside-tap closure |
| Surrounding SpringBoard is dimmed | PERIOD-EVIDENCE / VISUAL-CROSSCHECK | period images and descriptions establish reduced prominence; exact opacity remains reconstructed |
| Folder close and app-launch behavior | PERIOD-EVIDENCE / CONFIRMED | the same contemporary account specifies app tap to launch and outside tap to close |
| Returning Home after folder-app launch preserves folder | PERIOD-EVIDENCE / contemporary 2010 behavior | Ars Technica documents the behavior directly; August 2010 FolderCloser reporting exists specifically to override it |
| Lock/sleep → unlock preserves open folder | PROBABLE / PERIOD-CONSISTENT | inferred from preserved SpringBoard state; no direct target-period lock/unlock capture found |
| Row-dependent split distances | RECONSTRUCTED | fixed-grid geometry apportions the 111-point extra opening between upper/lower regions according to the source row |
| Dock translates below the physical viewport | PERIOD-EVIDENCE / CONFIRMED | Macworld's June 21 hands-on explicitly describes the dock fading and sliding downward; the open-state dock now completes a full-height exit |
| Dock icon reflections | PERIOD-EVIDENCE / VISUAL-CROSSCHECK | each dock icon mirrors its canonical artwork into the recovered glass shelf; labels and badges remain single, unreflected layers |
| Reflection opacity and fade | RECONSTRUCTED | a shared low-opacity 16-point mirror uses a vertical alpha fade and dock-local clipping; exact Apple compositing values remain unknown |
| White icon labels with strong dark shadow | PERIOD-EVIDENCE / VISUAL-CROSSCHECK | page, folder, and dock labels share compact white type with tight dark separation over the wallpaper and shelf |
| Exact label shadow values | RECONSTRUCTED | two tight low-radius shadows approximate the period raster edge without a modern soft drop shadow |
| Arbitrary lower-region child clipping | REJECTED | clipping the page at the closed-state dock boundary produces a malformed empty block and disconnected fragments |
| Continuous lower SpringBoard composition | PERIOD-EVIDENCE / VISUAL-CROSSCHECK | the displaced rows remain visible down to the physical screen boundary beneath the tray |
| Folder transition timing/easing | RECONSTRUCTED | synchronized 300ms `ease-in-out`, chosen as a conservative period-style mechanical transition pending frame-timed capture |
| Open-state dim opacity | RECONSTRUCTED | a low-opacity neutral overlay below the status bar plus subdued non-source icons; no blur or opaque scrim |
| Utilities stock folder | PERIOD-EVIDENCE / VISUAL-CROSSCHECK | Clock, Compass, Calculator, Voice Memos |
| Social folder | PROJECT-CANON — RETIRED | removed in v1.1 to make the core project experiences directly discoverable |
| Direct core-social exposure | PROJECT-EXPERIENCE DECISION / PERIOD-COMPATIBLE | Facebook, Twitter, Instagram, Foursquare, Flickr, and Tumblr remain normal icons across the two pages with their stable runtime IDs |
| Game Center on iOS 4.1 | PERIOD-EVIDENCE / CONFIRMED | exact `Game Center~iphone.app` target-build icon |
| WhatsApp for iPhone | PERIOD-EVIDENCE | archived 2010 App Store listing and artwork; full simulator functionality remains HOLD |
| Skype for iPhone | PERIOD-EVIDENCE | archived 2010 App Store listing and artwork; full simulator functionality remains HOLD |
| Water-droplet wallpaper | CURRENT PROJECT VISUAL TARGET / PERIOD-CONSISTENT | unchanged exact existing URL/crop |
| DeviantArt 2026 icon pack | MODERN RECONSTRUCTION / VISUAL-CROSSCHECK ONLY | not imported |

## Fixed geometry

- Screen: 320×480 logical points.
- Grid origin: `(16,36)`.
- Presentation slot: 59×74 points.
- Column origins: `16, 92, 168, 244`; centers: `45.5, 121.5, 197.5, 273.5`.
- Row origins: `36, 124, 212, 300`; centers: `73, 161, 249, 337`.
- Page-dot control: fixed top 386 / center 391; independent of populated rows.
- Dock layout region: 84 points at Y=396; exact 320×45 dock artwork remains bottom-aligned at Y=435.
- Dock reflections: canonical 59×60 icon artwork mirrored at local Y=60, clipped/faded to a shared 16-point visible band; labels and badges are excluded.
- Labels: local top 62, 14-point line box, compact Helvetica-family fallback and existing dark shadow.

## Placement

Page 1:

| Row | Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- | --- |
| 1 | Calendar | Photos | Stocks | Maps |
| 2 | Weather | Notes | Utilities | iTunes |
| 3 | App Store | Game Center | Settings | Facebook |
| 4 | Twitter | Instagram | Foursquare | Flickr |

Page 2 begins `Tumblr | WhatsApp | Skype | Empty`, with all subsequent fixed slots empty. The dock remains `Messages | Safari | Camera | YouTube`, and none of those four dock apps appears on either page.

## Folder behavior

Utilities remains the only SpringBoard folder instance and uses the existing `closed → opening → open → closing → closed` reducer. The authenticated full-width linen, edge shadows, selected-column notch, miniature renderer, outside-tap close path, and device Home close path remain. Panel height follows the target-build formula `125 + 85 × (rows − 1)`: Utilities uses one row / 125 points.

Opening now splits the active fixed-grid page at the selected folder row. The folder row travels with the upper region; rows below it, page dots, and dock travel with the lower region. The tray top is calculated from the translated source-row bottom, so the recovered pointer stays attached to the triggering column without a Utilities-name branch. The 125-point tray replaces the original 14-point inter-row gap, leaving 111 points to distribute. The row-derived formula produces upper/lower movements of `22/89`, `44/67`, `67/44`, or `89/22` points for rows 1–4. Utilities currently occupies row 2, so its upper region moves `−44`, its lower region moves `+67`, and its tray occupies Y `154–279`.

The lower grid's first displaced row begins exactly at the tray bottom: the translated source-row boundary, 125-point tray, and remaining grid rows form one continuous composition. During folder states, the page surface no longer clips that composition at the closed-state dock boundary; only the outer 320×480 physical screen clips final pixels. The page dots retain the lower-region displacement, while the full-size 84-point dock performs its separately supported full-height downward exit and is no longer left peeking into the open state. The tray and pointer remain inside the visible composition. No tray, icon, label, row-gap, or dock geometry is compressed.

Only temporary presentation changes occur while the folder is active: wallpaper below the 20-point status bar receives a stronger translucent neutral dim, non-source page icons are washed down to reduced brightness/saturation, and the dock fades as it moves down. The selected folder icon stays at full contrast, but its ordinary SpringBoard label fades out so the folder name appears only as the full-contrast tray title. The full-width recovered linen/shadow tray remains undimmed and is revealed by clipping its own tray surface, not by scaling the SpringBoard regions. Close reverses the same 300ms reconstructed motion. The overlay continues to consume background input, the swipe-start path explicitly rejects non-closed folder states, and the physical Home path closes the folder before normal Home behavior. Folder app buttons remain active only after the tray reaches its stable `open` state and pass their stable stock-app identifiers into the existing shared launch runtime; no stock-app internals or folder data state was added.

### Utilities content audit

Macworld's June 21, 2010 hands-on states that a new iPhone 4 shipped with a Utilities folder containing Clock, Calculator, Compass, Voice Memos, and Notes, but it does not establish their exact visible slot order. This project's already-frozen Page 1 puts Notes in its own fixed slot. The user-selected Utilities visual reference locks the four tray slots to `Clock | Compass | Calculator | Voice Memos`; this ordering is **PERIOD-EVIDENCE / VISUAL-CROSSCHECK** and changes no app artwork or application state.

The shared pointer protrudes 12 points above the tray edge. Rather than placing the recovered black shadow-notch bitmap by itself against the wallpaper, the pointer now samples the same recovered 320×360 linen image and aligns its texture coordinates to the tray before applying a small triangular clip. This removes the pale/detached appearance while retaining a restrained upper-edge shadow. An inner tray wrapper still clips the linen and edge artwork without clipping the pointer. Pointer center X remains `grid left + column × (slot width + column gap) + half slot width`, using the full source slot index rather than a folder-name or fixed-column branch.

### Folder lifecycle

| Transition | Folder result | Confidence |
| --- | --- | --- |
| Tap outside tray | reverse animation → closed | PERIOD-EVIDENCE / CONFIRMED |
| Device Home while SpringBoard folder is open | reverse animation → closed | PROJECT-CANON / PERIOD-CONSISTENT |
| Launch app from folder → return Home | same folder and source slot remain open | PERIOD-EVIDENCE / CONFIRMED contemporary behavior |
| Sleep/lock → wake/unlock to SpringBoard | same folder and source slot remain open | PROBABLE / PERIOD-CONSISTENT |
| Full shutdown/reset | folder and active slot reset | PROJECT RUNTIME RESET BOUNDARY |

The active folder-slot identity is owned by the device shell alongside the folder reducer, rather than by the conditionally mounted SpringBoard view. App launch, sleep, lock, wake, and unlock do not dispatch folder close or change the active slot. This both preserves the documented app-return behavior and conservatively carries the same SpringBoard state through sleep. Only explicit SpringBoard close interactions clear the open presentation; full shutdown remains the broader simulator reset boundary.

Utilities miniatures and tray entries use exact 8B117 icons. The retired Social instance no longer has folder-specific active-ID, row-count, anchor, miniature, or padded-slot state. The shared social-app registry remains because it preserves stable runtime and multitasking identities.

## Period app evidence and functionality boundary

- WhatsApp: archived Apple App Store capture dated 2010-07-26, application ID `310633997`; confirms the iPhone application and exposes the contemporary Apple-CDN artwork. The Web Design Museum 2010 capture is supporting visual evidence only and is not cropped into production.
- Skype: archived Apple App Store capture dated 2010-07-22, application ID `304878510`; explicitly identifies iPhone 4 and iOS 4 multitasking support and exposes the contemporary Apple-CDN artwork. Contemporary July 2010 reporting independently confirms the iOS 4 update.
- WhatsApp and Skype taps use the existing app-launch runtime and intentionally resolve to an incomplete black runtime surface. Complete chat, account, calling, or seeded application state is `HOLD / OUT OF SCOPE`.

Evidence links: [Macworld, “Hands on with iOS 4 folders” (June 21, 2010)](https://www.macworld.com/article/206116/ios4folders.html), [Ars Technica's June 2010 iOS 4 review](https://arstechnica.com/gadgets/2010/06/ars-reviews-ios-4-whats-new-and-notable/), [August 2010 FolderCloser report](https://www.idownloadblog.com/2010/08/19/foldercloser/), [Macworld, “iOS 4 folders: Usable, but poorly implemented” (June 22, 2010)](https://www.macworld.com/article/206145/ios4_folders.html), [Macworld WWDC iPhone OS 4 folder demo coverage (June 7, 2010)](https://www.macworld.com/article/205861/slideshow_wwdc_iphone_os4.html), [Engadget iPhone 4 review (June 22, 2010)](https://www.engadget.com/2010-06-22-iphone-4-review.html), [archived WhatsApp App Store listing](https://web.archive.org/web/20100726134809/http://itunes.apple.com/us/app/whatsapp-messenger/id310633997?mt=8), [Web Design Museum WhatsApp 2010 captures](https://www.webdesignmuseum.org/iphone/whatsapp-messenger-for-iphone-in-2010), [archived Skype App Store listing](https://web.archive.org/web/20100722035915/http://itunes.apple.com/us/app/skype/id304878510?mt=8), and [contemporary July 2010 Skype iOS 4 report](https://www.macrumors.com/2010/07/21/skype-for-iphone-updated-to-support-multitasking/).

## Scope boundary

No implemented application container, reducer, seeded content, story, timestamp, notification count, device status bar, wallpaper raster, wallpaper crop, scheduler, lock/sleep transition, or Home-button runtime was changed. The only device-shell state addition is the active folder-slot index required to preserve the correct open anchor across SpringBoard unmounts. Moving social icons reuses their existing stable IDs and state. WhatsApp and Skype introduce no chat histories or application reducers. The Calendar icon retains only the target-date `Wednesday / 20` SpringBoard overlay.
