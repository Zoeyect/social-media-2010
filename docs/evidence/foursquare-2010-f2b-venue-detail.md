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
