# iOS 4.1 SpringBoard Icon Provenance v1.0

Target: iPhone 4 (`iPhone3,1`), iOS 4.1 build `8B117`, en-US, portrait, 2010-10-20.

The original assets below were extracted byte-for-byte from the verified local filesystem image at `tmp/firmware/rootfs/018-7063-114-decrypted.hfs`. Apple built-in Home icons are already-composited 118×120 CgBI PNGs (59×60 logical points); they are not raw 114×114 third-party icon sources. Each production import uses a `.browser.png` companion decoded from the original without crop, scaling, recoloring, or redrawing. The original CgBI file remains beside it as provenance evidence.

| App | Asset Source | Date | Intrinsic Size | Confidence | Production Status |
| --- | --- | --- | ---: | --- | --- |
| Calendar | `/Applications/MobileCal.app/icon@2x.png` | 2010-07-08 | 118×120 | CONFIRMED_ORIGINAL | exact CgBI + browser derivative; weekday/date remains runtime text |
| Photos | `/Applications/MobileSlideShow.app/icon-Photos@2x.png` | 2010-07-19 | 118×120 | CONFIRMED_ORIGINAL | exact CgBI + browser derivative |
| Stocks | `/Applications/Stocks.app/icon@2x.png` | 2010-07-05 | 118×120 | CONFIRMED_ORIGINAL | exact CgBI + browser derivative |
| Maps | `/Applications/Maps.app/icon@2x.png` | 2010-07-19 | 118×120 | CONFIRMED_ORIGINAL | exact CgBI + browser derivative |
| Weather | `/Applications/Weather.app/icon@2x.png` | 2010-07-05 | 118×120 | CONFIRMED_ORIGINAL | exact CgBI + browser derivative |
| Notes | `/Applications/MobileNotes.app/icon@2x.png` | 2010-07-08 | 118×120 | CONFIRMED_ORIGINAL | exact CgBI + browser derivative |
| Utilities | `/System/Library/CoreServices/SpringBoard.app/FolderIconBG@2x.png` | build 8B117 | 118×124 | CONFIRMED_ORIGINAL | exact folder background + browser derivative; miniatures use contained icons |
| iTunes | `/Applications/MobileStore.app/icon@2x.png` | 2010-07-19 | 118×120 | CONFIRMED_ORIGINAL | exact CgBI + browser derivative |
| App Store | `/Applications/AppStore.app/icon@2x.png` | 2010-07-19 | 118×120 | CONFIRMED_ORIGINAL | exact CgBI + browser derivative |
| Game Center | `/Applications/Game Center~iphone.app/icon@2x.png` | 2010-07-16 | 118×120 | CONFIRMED_ORIGINAL | exact iOS 4.1 CgBI + browser derivative |
| Settings | `/Applications/Preferences.app/icon@2x.png` | 2010-07-19 | 118×120 | CONFIRMED_ORIGINAL | exact CgBI + browser derivative |
| Messages | `/Applications/MobileSMS.app/icon@2x.png` | build 8B117 | 118×120 | CONFIRMED_ORIGINAL | existing exact CgBI; browser derivative added |
| Safari | `/Applications/MobileSafari.app/icon@2x.png` | build 8B117 | 118×120 | CONFIRMED_ORIGINAL | existing exact CgBI; browser derivative added |
| Camera | `/Applications/MobileSlideShow.app/icon-Camera@2x.png` | 2010-07-19 | 118×120 | CONFIRMED_ORIGINAL | existing exact CgBI; browser derivative added |
| YouTube | `/Applications/YouTube.app/icon@2x.png` | build 8B117 | 118×120 | CONFIRMED_ORIGINAL | existing exact CgBI; browser derivative added |
| WhatsApp | Archived Apple App Store artwork: `a1.phobos.apple.com/.../mzl.wnjwwrzx.175x175-75.jpg`, listing ID `310633997` | 2010-07-26 archive capture | 175×175 | PROBABLE_ORIGINAL | exact archived Apple-CDN JPEG; CSS applies only the period SpringBoard corner mask |
| Skype | Archived Apple App Store artwork: `a1.phobos.apple.com/.../mzl.iilecupo.175x175-75.jpg`, listing ID `304878510` | 2010-07-22 archive capture | 175×175 | PROBABLE_ORIGINAL | exact archived Apple-CDN JPEG; CSS applies only the period SpringBoard corner mask |

Utilities contains the exact target-build Clock, Calculator, Compass, and Voice Memos icons from their respective application bundles. Those originals and browser derivatives are production assets for the expanded folder tray.

The former Social folder’s six third-party target-period icon payloads remain unrecovered. Their directly exposed Page 1 identity marks remain isolated `RECONSTRUCTED` placeholders and are labeled as such in source. They are not promoted to original icon provenance.

The WhatsApp and Skype files are not extracted IPA icon payloads, so they are not classified `CONFIRMED_ORIGINAL`. They are byte-identical copies of the dated artwork returned by the official Apple App Store pages preserved by the Internet Archive. The Web Design Museum WhatsApp captures were used only to corroborate the visible period identity; no museum screenshot pixels were cropped or shipped.

The DeviantArt pack published in 2026 is `REJECTED` as historical-original provenance and was not imported. It remains suitable only as a modern visual cross-check.
