# Foursquare Historical Reconstruction F2b — Venue Detail

## F2b-1 status

`RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`

F2b-1 establishes venue-local navigation and a compact summary without altering F2a Places rows or the existing functional check-in reducer. A stable `venueSubview` distinguishes `summary`, `info`, `tips`, and `checkIn` while `currentView` remains the narrow `root | venue` model.

The summary uses the F2a 36px category artwork, venue identity, and category label. It contains contiguous period-style Check In, Info, and Tips entries. Unverified addresses, fabricated distances, seeded mayor claims, the unsupported Mayor/Points grid, phone, map, ratings, reviews, photos, To-Do, friend history, and current-presence claims are absent.

Check In routes to the existing unchanged shout form or checked-in placeholder. The form's 140-character behavior, venue-keyed draft, duplicate guard, check-in state, current points approximation, and RESET behavior remain intact pending F2c/F3.

Info and Tips are navigation-only empty period fields in F2b-1. F2b-2 owns truthful Info contents, structured Tip migration, and Tip-list anatomy. No explanatory developer copy or invented empty state is rendered.

Nested Back returns Info, Tips, or Check In to the same venue summary. Back from summary returns Places with its stored scroll position. Every bottom tab remains strict root navigation and clears venue-local state.

## Holds

To-Do control appearance and behavior, mayor display, friend context, map/location, phone, complete Info and Tips presentation, check-in form fidelity, game feedback, points/leaderboard placement, and exact detail micro-geometry remain HOLD or assigned to later checkpoints.

## F2b-2 — Info and venue Tips

The Info subview follows the project's sparse-data rule. It contains one compact native-style row: the label `Category` and the F2a adapter's explicit category value. Address, distance, phone, map, coordinates, creator metadata, venue statistics, people-here claims, mayor, reviews, ratings, and photos remain absent. The 48px row geometry and typography are `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.

Venue Tips now resolve from `FOURSQUARE_VENUE_TIPS` in `foursquareContent.ts`, not from the legacy Tip field carried by the seed fixture. Foursquare state deliberately strips that legacy property during initialization so the runtime has one Tip architecture. The sole record is `night-owl-tip`, attached only to `night-owl`, authored through stable canonical identity `june`, and preserves the exact project prose “The coffee is strongest after ten.” It has no fabricated timestamp.

The Night Owl Tips subview renders only June's identity and Tip text. Main Street Diner, Cedar Books, and Riverside Park render an empty period field without “No tips” copy, illustration, or invented content. The Tip is `PROJECT-CURATED FICTION` / `HOLD-fictional`, not authenticated historical Foursquare content. Night Owl itself remains HOLD and any later venue replacement must migrate the Tip atomically.

Nested Back and root-tab behavior remain those established in F2b-1. To-Do, mayor, friend context, map/location, phone, check-in visual reconstruction, points, leaderboard, badges, and historical content expansion remain HOLD.
