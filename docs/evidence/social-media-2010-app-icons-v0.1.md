# Social Media 2010 App Icon Evidence Audit v0.1

## Scope

Target environment: iPhone 4 (`iPhone3,1`), iOS 4.1 build `8B117`, during October 2010. For the month-level target, “existed by October 2010” means publicly available no later than 31 October 2010; Instagram is therefore in scope after its 6 October launch.

This is an evidence audit only. No application code or tracked artwork was modified or added.

Classification:

- **READY** — an authentic target-period icon has been recovered with a provenance-complete byte source.
- **HOLD** — the application existed and was compatible, but its exact period icon payload is unavailable or insufficiently verified.
- **REJECT** — historically incompatible with the target date/device, or a modern/redesigned/recreated candidate.

## Evidence and acceptance rules

Primary local source: `tmp/firmware/rootfs/018-7063-114-decrypted.hfs`, the verified iPhone3,1 iOS 4.1 filesystem. Built-in app files were read directly with the repository’s `xpwn` `hfsplus` tool into `/tmp` for metadata and hashing only.

The third-party application icon contract is 114×114 Retina pixels rendered at 57×57 points. Apple’s built-in icons in this firmware are different: the Home-screen files measured here are already system-presented **118×120 CgBI PNGs**, corresponding to the 59×60-point MobileIcons composition canvas. These built-in files must not be cropped to 114×114 or passed through the third-party compositor a second time.

Screenshots, store thumbnails, press images, favicons, current App Store icons, and logo files are contextual evidence only. They are not accepted as icon payloads and receive no hash.

## Candidate matrix

| Application | Historical existence and iPhone/iOS 4 evidence | Period version/date | Icon evidence | Classification |
| --- | --- | --- | --- | --- |
| Facebook | Facebook for iPhone existed before the target; version 3.1.4 added iOS 4/multitasking support and a high-resolution Retina icon on 30 June–1 July 2010. | 3.1.4, 30 Jun/1 Jul 2010 | No provenance-complete 3.1.4 IPA or `Icon@2x.png` recovered locally. | **HOLD** |
| Twitter | Twitter’s first-party iPhone client existed by May 2010; Twitter’s own 24 May 2010 platform post names a Twitter-branded iPhone client. | First-party Twitter for iPhone, May 2010; exact October build unresolved | No verified October 2010 IPA/icon payload recovered. Tweetie-era or later Twitter icons must not be substituted without bundle/version proof. | **HOLD** |
| Foursquare | Native iPhone application existed well before October. Version 1.7 was reported in March 2010 as requiring iPhone OS 3.0+, and version 2.0 shipped for iPhone on 20–21 September 2010. | 2.0, 20–21 Sep 2010 | No verified 2.0 IPA or Retina icon recovered. Period article thumbnails are not original icon bytes. | **HOLD** |
| Tumblr | Tumblr acquired Tumblerette and launched an official iPhone app in 2009. Tumblr 1.2 added iOS 4 support in June 2010. | 1.2, 24 Jun 2010 | No verified 1.2 IPA or icon payload recovered; modern Tumblr artwork is **REJECT**. | **HOLD** |
| Flickr | Flickr’s first-party native iPhone app launched 10 September 2009. Version 1.2 added iOS 4 features in July 2010 and required iPhone OS 3.0+. Contemporary reporting explicitly says Retina support had not yet been added. | 1.2, 16 Jul 2010 | Exact period IPA/icon unavailable. A 57×57 non-Retina icon may have been displayed scaled on iPhone 4, but no payload was recovered to verify or hash. | **HOLD** |
| Instagram | Instagram launched publicly as an iPhone application on 6 October 2010. Version 1.0.2 was available by 29 October and required iOS 3.1.2+, so it was compatible with iOS 4.1. | 1.0/1.0.2, 6–29 Oct 2010 | No verified launch IPA or `Icon@2x.png` recovered. Later classic-camera icons are not assumed byte-identical to the launch asset. | **HOLD** |
| YouTube | Apple’s built-in YouTube app is present in the exact 8B117 filesystem and declares minimum OS 4.1. | Bundle version 1.0, firmware build 8B117 | Exact `/Applications/YouTube.app/icon@2x.png` recovered to temporary audit storage; 118×120, alpha yes. | **READY** |
| Safari | Apple’s built-in MobileSafari is present in the exact 8B117 filesystem and declares minimum OS 4.1. | Bundle version 6531.22.7, firmware build 8B117 | Exact `/Applications/MobileSafari.app/icon@2x.png`; 118×120, alpha yes. | **READY** |
| Messages | Apple’s built-in MobileSMS/Messages app is present in the exact 8B117 filesystem and declares minimum OS 4.1. | Bundle version 1.0, firmware build 8B117 | Exact `/Applications/MobileSMS.app/icon@2x.png`; 118×120, alpha yes. | **READY** |
| Camera | Camera is supplied by the built-in `MobileSlideShow.app` bundle in this build; its camera-specific icon exists separately from Photos. The bundle declares minimum OS 4.1. | MobileSlideShow 1.0.0, bundle build 43, firmware build 8B117 | Exact `/Applications/MobileSlideShow.app/icon-Camera@2x.png`; 118×120, alpha yes. | **READY** |

## Recovered built-in icon hashes

The following hashes are over the exact CgBI PNG bytes extracted from the verified HFS. The files remain in temporary audit storage and were **not** added to `src/assets`.

| Application | Original firmware path | Dimensions | Alpha | SHA-256 |
| --- | --- | ---: | --- | --- |
| Safari | `/Applications/MobileSafari.app/icon@2x.png` | 118×120 | yes | `7d6a1fcbf071278778930ab0063f82d8f11f72aa6358266ffbdba6ba27a04709` |
| Messages | `/Applications/MobileSMS.app/icon@2x.png` | 118×120 | yes | `7de42ad9a1e2d876abc95a742724366dca8405e3f7bfec8e1469fc8ce2cbbc79` |
| YouTube | `/Applications/YouTube.app/icon@2x.png` | 118×120 | yes | `81ef16bbb2d3e04e5a45c7cdf2c2800093126b4b54a5d42229183d014eb3d7b6` |
| Camera | `/Applications/MobileSlideShow.app/icon-Camera@2x.png` | 118×120 | yes | `fda38114fc4ce321595513927250414f5caed2d6a5a694a6a2580a5e562a790e` |

All four are **READY for a later byte-for-byte promotion task**. That later integration must determine whether the built-in 59×60-point composed image is rendered directly or routed through a separate built-in-icon path; treating it as a raw 57×57 app source would double-compose the mask/gloss.

## Third-party provenance findings

### Facebook

Period reporting identifies Facebook 3.1.4 as the iOS 4/iPhone 4 update and specifically records a new high-resolution icon. This proves a Retina icon existed, but not its bytes or dimensions in an original bundle. Sources: [iClarified, 30 June 2010](https://www.iclarified.com/10390/facebook-app-has-been-updated-for-ios-4-iphone-4), [iPhoneAddict, 1 July 2010](https://iphoneaddict.fr/post/news-4579-facebook-passe-en-version-3-1-4-et-devient-compatible-ios-4-0).

### Twitter

Twitter’s own contemporary platform post lists Twitter-branded mobile clients including iPhone, establishing first-party iPhone availability by 24 May 2010: [Twitter, “The Twitter Platform”](https://blog.x.com/en_us/a/2010/the-twitter-platform). It does not expose the October IPA or icon payload, so the artwork remains **HOLD**.

### Foursquare

Foursquare 1.7 was available for iPhone in March 2010 and required firmware 3.0 or later; Foursquare 2.0 followed on 20–21 September 2010: [MacMagazine on 1.7](https://macmagazine.com.br/post/2010/03/11/foursquare-1-7-chega-a-iphone-app-store-com-visual-totalmente-novo-e-diversas-outras-novidades/), [contemporary report on 2.0](https://www.webpronews.com/the-new-foursquare-emerges-for-iphone/). Neither page supplies a provenance-safe IPA icon.

### Tumblr

The official iPhone app followed Tumblr’s 2009 acquisition of Tumblerette, and version 1.2 added iOS 4 support on 24 June 2010: [contemporary Tumblr 1.2 report](https://gizmodo.com/official-tumblr-iphone-app-now-supports-ios4-and-twitte-5571895). Exact bundle artwork remains **HOLD**.

### Flickr

Flickr’s own launch post confirms a native iPhone app on 10 September 2009: [Flickr Blog](https://blog.flickr.net/en/2009/09/10/the-new-flickr-iphone-app/). Version 1.2 supported iOS 4 and required iPhone OS 3.0+, while contemporary coverage stated Retina support was still absent: [Flickr 1.2 report](https://www.iphonefaq.org/archives/971002). Therefore a fabricated 114×114 “Retina Flickr” icon would be historically unsupported.

### Instagram

Instagram launched in the App Store on 6 October 2010: [contemporary launch report](https://techcrunch.com/2010/10/06/instagram-launch/). By 29 October, version 1.0.2 required iOS 3.1.2 or later: [Macworld](https://www.macworld.com/article/208680/instagram_update.html). Existence and compatibility are **READY facts**; the launch icon bytes remain **HOLD**.

## READY / HOLD / REJECT summary

| Classification | Applications/assets |
| --- | --- |
| **READY** | Exact 8B117 Safari, Messages, YouTube, and Camera icon PNGs |
| **HOLD** | Facebook 3.1.4, period Twitter, Foursquare 2.0, Tumblr 1.2, Flickr 1.2, Instagram 1.0/1.0.2 icon payloads |
| **REJECT** | Modern App Store icons; redesigned logos; screenshots or thumbnails promoted as assets; AI-generated or redrawn icons; inferred Retina Flickr artwork; any icon without bundle/version provenance |

No candidate application is rejected for historical existence under the stated end-of-October cutoff. The rejection applies to incompatible artwork substitutes.

## Remaining evidence needed

- Original, legally available period IPAs (or provenance-equivalent bundle extracts) for each third-party application.
- `Info.plist` version/minimum-OS metadata and exact icon keys from those bundles.
- Byte-level dimensions, alpha metadata, and SHA-256 for their original icon files.
- Confirmation of whether each October build supplied a 114×114 Retina source or fell back to a 57×57 icon.

## Validation boundary

Only this evidence document was added. No application file or tracked asset was changed. Build validation is reported in the task handoff.
