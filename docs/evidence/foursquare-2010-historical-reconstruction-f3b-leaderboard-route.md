# Foursquare 2010 F3b — Standalone Leaderboard Route

## Evidence boundary

F3b adds the standalone weekly-friends leaderboard without changing the F3a scoring authority. Profile ownership of the route and the title `Leaderboard` are `PROBABLE / PERIOD-SUPPORTED`. The weekly friend competition is period-supported.

The surviving post-check-in result evidence shows an embedded leaderboard excerpt. It supports the visible row vocabulary but does not authenticate the standalone screen's complete geometry. F3b therefore keeps the standalone route distinct from the deferred F3c result reconstruction.

## Implemented route

The minimal Profile root entry reads `Leaderboard` and opens a dedicated child view. Its Back control reads `Profile` and returns to the Profile root. The existing five bottom tabs remain mounted and retain strict root navigation from the child view.

The Profile entry geometry, Back label, retained bottom tabs, standalone list material, and 52-pixel row geometry are `RECONSTRUCTED` or `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`; they are not authenticated measurements.

## Leaderboard content

Rows are derived directly from `buildLeaderboard(state.pointEvents)`. Each inert row contains only `#N` rank, the existing Foursquare avatar, display name, and a bare numeric weekly score. Rank, avatar, name, numeric score, and `#N` notation are `CONFIRMED / PERIOD-SUPPORTED` elements.

The player is absent before the first successful scoring event and appears only when the F3a model ranks the session owner. No unranked row, player highlight, movement treatment, score suffix, week heading, participant Profile route, or second ranking authority is introduced.

## HOLD

- exact standalone target-build raster
- week heading
- player-row highlight
- participant Profile navigation
- score suffix
- movement indicators
- exact Profile entry and standalone list geometry
- exact bottom-tab visibility on the child route
