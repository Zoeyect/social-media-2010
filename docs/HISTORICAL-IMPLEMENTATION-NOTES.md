# Historical implementation notes

Controlling environment: Wednesday, October 20, 2010; Tokyo, Japan; Asia/Tokyo; English UI; black iPhone 4 GSM; iOS 4.1; SoftBank.

Locked behavior implemented here:

- The phone begins powered off after the identity prompt.
- Power-on requires a one-second press-and-hold gesture.
- Cold boot lasts 30 seconds and contains no progress UI.
- First lock screen remains at 22:02; the session starts only after a successful drag unlock.
- Authoritative session time derives from the persisted unlock epoch, not interval counting.
- Battery interpolates 24→20% at 5:00, 20→10% at 10:00, and 10→0% at 15:00.
- Battery warnings trigger at 20% and 10%; depletion ends as a black screen.
- Badge values persist with the session.

HOLD policy:

- The exact Apple logo asset, lock-screen wallpaper, iOS 4.1 battery-alert geometry, SpringBoard wallpaper, and application icon artwork are not asserted by this prototype.
- HOLD visuals use obvious research placeholders and must be replaced only from approved evidence.
