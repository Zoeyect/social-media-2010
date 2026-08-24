# iOS 4.1 lock-screen camera shortcut evidence

Canonical target: iPhone 4 GSM (`iPhone3,1`), iOS 4.1, build `8B117`.

## Conclusion

**Do not implement a lock-screen camera shortcut for this target.** The
persistent camera control positioned beside `slide to unlock` belongs to iOS
5.1, released March 7, 2012. It is not part of the iOS 4.1 lock screen.

Adding the requested control—even with a HOLD glyph—would introduce later-iOS
UI and make the 8B117 reconstruction historically incorrect.

## ORIGINAL

- Apple’s period iPhone 4/iOS 4 documentation describes the lock screen and
  status icons but does not document direct lock-screen camera access.
- Apple’s later iPhone 4 quick-start material explicitly describes camera
  access from the lock screen by double-clicking Home. That material reflects
  the iOS 5 generation and therefore cannot be backported as iOS 4.1 evidence.

Sources:

- [Apple iPhone 4 documentation index](https://support.apple.com/en-us/docs/iphone/132927)
- [Apple iPhone 4 Finger Tips: lock-screen camera access](https://cdsassets.apple.com/live/6GJYWVAV/start/ma1546_iphone_4_finger_tips.pdf)

## SOURCE-DERIVED

- iOS 5 introduced lock-screen camera access through a Home-button gesture.
- iOS 5.1 changed this to an always-visible camera grabber on the lock screen.
- The iOS 5.1 grabber was activated by dragging the control upward; tapping it
  did not launch the camera. Therefore both the requested presence on iOS 4.1
  and the requested tap interaction conflict with the historical behavior.

Sources:

- [Engadget, March 12 2012: iOS 5.1 camera requires an upward drag](https://www.engadget.com/2012-03-12-dear-aunt-tuaw-help-me-access-the-lock-screen-camera.html)
- [Cult of Mac, March 7 2012: new iOS 5.1 swipe access](https://www.cultofmac.com/news/your-iphone-camera-is-even-closer-to-hand-with-new-ios-5-1-swipe-access)
- [iClarified: iOS 5 tweak described as bringing iOS 5.1 behavior to older firmware](https://www.iclarified.com/20966/camera-grabber-for-ios-5-brings-ios-51s-quick-camera-launch-to-older-firmware)

## VISUAL-CROSSCHECK

- Contemporary March 2012 reports label the persistent grabber as new iOS 5.1
  lock-screen behavior.
- Period June/July 2010 iOS 4 and iOS 4.1 captures show the classic full-width
  `slide to unlock` region without the later persistent camera grabber.

Sources:

- [iDownloadBlog, March 7 2012: iOS 5.1 lock-screen camera](https://www.idownloadblog.com/2012/03/07/ios-5-1-lock-screen-camera/)
- [Redmond Pie, June 14 2010: iOS 4 GM screenshots](https://www.redmondpie.com/ios-4.0-screenshots-gallery-iphone/)
- [Cult of Mac, July 14 2010: iOS 4.1 beta screenshots](https://www.cultofmac.com/news/quick-look-ios-4-1-beta)

## UNKNOWN

- The exact 8B117 lock-screen slider assets and pixel geometry remain subject
  to the existing lock-screen evidence HOLD.
- This uncertainty does not justify adding a camera control: the control’s
  introduction is independently dated to the iOS 5 generation.

## Implementation decision

### READY

- Preserve the current iOS 4.1 lock-screen structure: status bar, time/date and
  full-width slide-to-unlock control.
- Keep Camera accessible only through the SpringBoard/application flow when
  that app is eventually implemented.

### HOLD

- Exact original iOS 4.1 lock-screen raster assets and slider geometry.

### REJECTED FOR THIS TARGET

- Persistent right-side camera grabber.
- Tap-to-open camera routing from the lock screen.
- `LOCK_SCREEN → CAMERA_PLACEHOLDER` transition.

No camera glyph asset should be sought or fabricated for the 8B117 lock screen.

