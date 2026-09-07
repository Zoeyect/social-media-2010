# Foursquare 2010 F5 - Tips and To-Dos

## F5a status

F5a establishes the To-Do data contract and session-state behavior only. It
does not add visible rows, controls, routes, empty-state copy, or venue actions.
Exact Foursquare 2.0 visual chrome remains `HOLD`.

Contemporary September 2010 reporting supports separate Tips and To-Dos roots,
venue-based To-Dos, adding a Tip to To-Dos, and marking an item done:

- TechCrunch, 20 September 2010:
  https://techcrunch.com/2010/09/20/foursquare-2/
- IntoMobile, 21 September 2010:
  https://www.intomobile.com/2010/09/21/foursquare-2-0-iphone/iphone-foursquare-2/

## Session and history boundary

The initial session To-Do list is empty. This means only that the player has
created no To-Dos during the current simulation session.

`UNKNOWN prior player history != zero historical To-Dos`.

No historical To-Dos are seeded or derived from check-ins, Tips, Friends-feed
activity, F6 history, leaderboard state, badges, or mayorships. Session To-Dos
survive Foursquare navigation and the surrounding application lifecycle while
the Foursquare state instance survives. `RESET` returns to the deterministic
empty session list. There is no local or server persistence.

## Data contract

The discriminated `FoursquareTodoItem` union keeps venue and Tip references
separate. Venue items store only their venue ID. Tip items store their Tip ID
and the venue ID resolved from canonical Tip content. Venue names, categories,
Tip text, and Tip authors are not duplicated.

IDs are project-deterministic:

- venue: `todo:venue:${venueId}`
- Tip: `todo:tip:${tipId}`

Duplicate adds and unknown references are no-ops. Venue and Tip To-Dos may
coexist for the same venue. New items begin incomplete, and completion is
reversible session-local state because exact period undo behavior is unresolved.
Removing an item affects only that item.

`createdAt` is supplied by the simulated action caller. The domain never
reads host time. Future display order is reconstructed as `createdAt`
descending with stable ID as the tie-break; this is
`PROJECT-DETERMINISTIC`, not a historical server-order claim.

## Independence and freezes

Checking in does not complete, remove, or otherwise mutate a To-Do. Base
scoring, leaderboard state, badges, mayorships, F6 history, Friends projection,
and Night Owl realtime delivery remain separate.

The existing `night-owl-tip` may be resolved by Tip-reference tests without
being projected into the root Tips surface, automatically added to To-Dos, or
reclassified from `HOLD-fictional`. Root Tips, root To-Dos, and Venue UI remain
visually unchanged pending later F5 visual evidence and product decisions.

## F5c minimal visible To-Dos loop

F5c exposes only the smallest venue-based session loop supported by the F5a contract:

- Venue summary shows `Add to To-Dos` when the venue is not saved.
- Adding dispatches `ADD_VENUE_TODO` with `currentDeviceDateTime.getTime()` as the simulated creation time.
- The existing `To-Dos` root renders saved venue items in deterministic newest-first order.
- Each visible row contains only the canonical venue name and opens the existing Venue summary route.
- A saved venue shows `Remove from To-Dos`; removal is available only from that Venue surface.
- Duplicate saves remain reducer no-ops, check-ins remain independent, and reset still clears session-created To-Dos.
- The initial To-Dos root is blank and has no empty-state copy.

This visible material is `RECONSTRUCTED_FROM_EXISTING_PROJECT_MATERIAL`. The row geometry and venue action treatment reuse the project's existing Foursquare iPhone-era surfaces; they are not claimed as pixel-exact primary-source reconstruction.

F5c intentionally leaves Tip To-Dos hidden, the Tips root blank, and venue-local Tip content unchanged. It adds no completion controls, edit mode, To-Do detail route, persistence, maps, distance, badges, mayors, or historical To-Do seed.

## F5d Tip to To-Do path

The Tip-to-To-Do behavior is `PERIOD-SUPPORTED`; the visible `Add to To-Dos` and `Remove from To-Dos` wording is `RECONSTRUCTED`. The existing `night-owl-tip` is the sole content and QA fixture. Its June authorship, Night Owl venue, text, and `HOLD-fictional` classification remain unchanged, with no timestamp, likes, done count, distance, or other metadata added.

The Night Owl Venue Tips surface now saves and removes the Tip through the F5a session model. Its To-Dos row uses `RECONSTRUCTED_FROM_EXISTING_PROJECT_MATERIAL` geometry and renders only the Tip text plus `Night Owl Cafe`. Tapping it opens the existing Night Owl Venue Tips surface; no Tip detail route exists.

Venue and Tip To-Dos for Night Owl may coexist as distinct records. Saving or removing either does not mutate the other, and check-in remains independent. Completion stays internal with no visible completion affordance. The root Tips surface remains blank and `HOLD` pending F5f.

## F5 closure

**Status: COMPLETE.**

F5 implements the session-local To-Do model, venue-based and Tip-based To-Dos, venue and Tip save/remove actions, venue and Tip rows in the To-Dos root, deterministic ordering, navigation back to existing venue surfaces, and session `RESET` behavior.

### Evidence boundaries

Historically supported behavior:

- Foursquare 2.0 exposes separate Tips and To-Dos roots.
- Venues may be saved to To-Dos.
- Tips may be saved to To-Dos.
- Tips historically support a Done relationship.
- Root Tips are location-oriented and nearby-sensitive.

Project reconstruction:

- To-Do IDs are project-deterministic.
- To-Do rows use project-deterministic newest-first ordering with stable ID tie-breaking.
- `Add to To-Dos` and `Remove from To-Dos` are reconstructed exact wording.
- The minimal row geometry is reconstructed from existing project material.
- Root rows route to existing venue summary or Venue Tips surfaces.

HOLD:

- completion UI and venue completion
- visible undo and completed history
- done counts
- root Tips projection, ordering, and root Tip actions
- Add Tip
- map/list control and distance display

### Player-history boundary

The initial `todos = []` means only that no To-Dos have been created during the current simulation session. It does not establish that the player had zero historical To-Dos before T0. `UNKNOWN prior player history != zero prior history` remains locked.

### Completion decision

F5e classifies F5a `completed: boolean` as `KEEP_INTERNAL_ONLY`. It remains unexposed. Historical Tip state is better understood as `unmarked`, `todo`, or `done`, but no model migration is required unless visible completion is separately approved. `CHECK_IN` remains independent and completion produces no Friends-feed side effect in the current project.

### Current Tip and root Tips decision

The sole structured Tip remains exactly `night-owl-tip`, authored by June at Night Owl Cafe with the text `The coffee is strongest after ten.` Its classification remains `HOLD-fictional` / project-curated. It is visible venue-locally and supports Tip-to-To-Do, but it is not historical evidence, is not approved for root Tips, and is not suitable as visible completion-demo content.

The root Tips tab remains blank and `HOLD`. Stored Tip existence does not imply root-projection eligibility. No filler Tips are authorized.

### F7 handoff

Root Tips no longer blocks F5 closure. Before reconsidering it, F7 must establish canonical venue coordinates, player/current location, distance derivation, nearby eligibility, deterministic root ordering, social/friend selection, map/list behavior, whether Night Owl qualifies, and whether distance is displayed.
