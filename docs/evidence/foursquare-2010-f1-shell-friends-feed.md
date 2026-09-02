# Foursquare 2010 Historical Reconstruction — F1 Shell / Friends Feed

## Scope

F1 establishes the September–October 2010 Foursquare 2.0-era application shell and a small structured Friends check-in feed. Places retains its existing functional vertical slice and is explicitly `F2-pending`. Tips, To-Dos, and Profile are root destinations only; their historical functionality remains assigned to later checkpoints.

## Information architecture

| Root | Status |
| --- | --- |
| Friends | CONFIRMED; default root |
| Places | CONFIRMED |
| Tips | CONFIRMED |
| To-Dos | CONFIRMED for 2.0-era build |
| Profile | CONFIRMED destination; exact target-build label/icon micro-artwork HOLD |

The five equal 64px cells, 49px bottom bar, 44px navigation, cyan top material, selected pointer, wordmark treatment, and icon artwork are `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`. The SVGs are project reconstructions, not recovered application-bundle assets.

## Friends feed

Rows resolve a stable canonical or Foursquare-local peripheral identity ID, venue ID, simulated 2010 creation timestamp, optional shout, optional explicit mayor state, source, and visibility. Human-readable check-in strings are not parsed by the renderer. Five deliberately sparse historical rows validate the surface without implementing the Alex/Katie heavy-use content assigned to F6. The existing Mia/Cedar Books seed meaning is preserved under stable ID `foursquare-mia`; Mia is not promoted into the canonical core cast.

`Last 3 Hours` and `Earlier` are a minimal deterministic bucket reconstruction. Relative labels are calculated from the fixed simulated F1 reference time, never host time.

Canonical shared character media is reused through a Foursquare-scoped avatar component and frame. Unresolved identities receive a neutral silhouette fallback; no new face or initials fixture is generated.

## Live activity boundary

The existing `june-night-owl-checkin` scheduler event remains delivered through its stable event ID and retains its narrative meaning. Night Owl Cafe is not yet canonical, so its structured activity has `visible: false` until the venue/content audit in F2/F6. Scheduler cadence and payload are unchanged.

## Preserved behavior

- Existing venue IDs and Places rows
- Venue opening and Back to Places
- Check-in records, one-point approximation, duplicate protection, shout drafts, Tip opening
- Session-local state and RESET isolation
- Independent Facebook Places state
- Existing scheduler volume

## HOLD / later phases

- Places and venue-detail fidelity: F2
- Check-in/game mechanics: F3
- Profile, leaderboard, badges, mayorships: F4
- Tips and To-Dos behavior: F5
- Alex/Katie historical depth: F6
- Shared coordinates/maps: F7
- Exact original Foursquare 2.0 icon rasters, palette, gradients, and micro-geometry: HOLD
