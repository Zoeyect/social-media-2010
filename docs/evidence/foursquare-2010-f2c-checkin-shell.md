# Foursquare 2010 F2c-1 — Check-in Shell

## Scope and status

F2c-1 reconstructs the existing check-in shell without changing the established check-in reducer, duplicate guard, point approximation, navigation, or root-tab behavior.

- Check-in shell and geometry: `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`
- Check-in timestamp: existing simulated experience/device time (`CONFIRMED` project-time invariant)
- Shout length of 140 characters: `PROJECT-CANONICAL`; exact target-build limit `HOLD`
- Sharing controls and target-build defaults: `HOLD`, unrendered
- Checked-in result presentation: `F3-PENDING`, unchanged

## Implemented shell

The check-in subview retains the `Check In` navigation title, nested Back to the same venue summary, and root-tab escape behavior. It adds a text-only 50px venue-context row containing adapter-backed venue name and category. Address, distance, coordinates, map, mayor, and presence claims remain absent.

The venue-keyed `IOS4Textarea` retains its existing state plumbing and 140-character cap. Its reconstructed field uses 13/17 typography, a 72px minimum height, 7px padding, a restrained one-pixel border, and a three-pixel radius. The primary action reads `Check-in here` and uses the existing 294px effective width (13px side insets), 38px height, and reconstructed Foursquare blue/cyan skeuomorphic material.

## Time and behavior boundary

`App` passes its existing `deviceDateTime`, derived from the experience clock, into `FoursquareContainer`. Submission freezes `currentDeviceDateTime.getTime()` in the existing `CHECK_IN` event payload. The path does not use host `Date.now()` or create a Foursquare-specific clock.

The reducer continues to store venue checked-in state, shout, timestamp, checked-in identity, and the fixed one-point approximation; it clears the venue draft and rejects duplicate check-ins. F2c-1 explicitly does **not** add a player check-in to `socialActivities` or mutate Twitter, Facebook, Instagram, or Public Twitter.

## Deferred

- Twitter/Facebook/Foursquare-friends sharing controls: `HOLD`
- Exact target-build sharing menu/control contract and defaults: `HOLD`
- Historical earned-points, leaderboard, badge, mayorship, and confirmation presentation: `F3-PENDING`
