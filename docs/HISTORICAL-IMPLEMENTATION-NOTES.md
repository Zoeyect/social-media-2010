# Historical implementation notes

Controlling narrative environment: Wednesday, October 20, 2010; United States; America/Los_Angeles; en-US UI; black iPhone 4 GSM; iOS 4.1; AT&T; 12-hour clock.

Firmware provenance remains iPhone3,1 iOS 4.1 build 8B117 and is independent of the simulated U.S. locale, carrier, and time-zone state.

Locked behavior implemented here:

- The phone begins powered off after the identity prompt.
- Power-on requires a one-second press-and-hold gesture.
- Cold boot lasts 30 seconds and contains no progress UI.
- First lock screen is planned for 12:02 AM; the session starts only after a successful drag unlock.
- Authoritative session time derives from the persisted unlock epoch, not interval counting.
- Battery interpolates 24→20% at 5:00, 20→10% at 10:00, and 10→0% at 15:00.
- Battery warnings trigger at 20% and 10%; depletion ends as a black screen.
- Badge values persist with the session.

HOLD policy:

- The exact Apple logo asset, lock-screen wallpaper, iOS 4.1 battery-alert geometry, SpringBoard wallpaper, and application icon artwork are not asserted by this prototype.
- HOLD visuals use obvious research placeholders and must be replaced only from approved evidence.
