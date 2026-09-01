# Twitter Historical UI — Checkpoint C1a Search Root

## Scope

Checkpoint C1a finalizes the Search root structural alignment and records implementation readiness after runtime approval. This pass is limited to Search root semantics, truthful data/function boundaries, and the Search→My Profile migration status.

Target: iPhone 4, iOS 4.1.

## Historical support and current implementation readiness

| Feature | Historical support | Current project implementation |
| --- | --- | --- |
| search field | CONFIRMED | HOLD (not implemented functionally in this pass) |
| Suggested Users | CONFIRMED | RECONSTRUCTED/functional (truthful registry-backed route) |
| Top Tweets | CONFIRMED | HOLD, no ranking dataset implemented in this pass |
| Trends | CONFIRMED | HOLD, no canonical trend dataset implemented |
| Nearby | CONFIRMED | HOLD, no truthful Twitter geolocation dataset implemented |

## C1a implementation status

- Search root now renders only `Suggested Users`.
- Suggested Users row is functional and sourced from the canonical Suggested Users account registry and follow graph.
- No fake search field is rendered.
- No inert historical rows are retained as placeholders.
- No fabricated discovery content is introduced in C1a.
- Search query/results workflow is not functionally implemented in C1a and is treated as HOLD.

## Functional route preserved

Canonical preserved route:
- `Search -> Suggested Users -> account list -> Profile -> Back -> Suggested Users`

This path is intentionally preserved as the functional discovery flow.

## My Profile migration boundary

- `My Profile` historical parent is `More`.
- `More -> My Profile` is the canonical route and remains confirmed.
- `Search -> My Profile` compatibility row has been removed from Search root.
- C3a evidence was updated to reflect the canonical migration status.

## Removed placeholder copy

The following project-only placeholder copy is removed in C1a:
- `Browse accounts`
- `Account and Following`

## Deferred work

- C1b: Suggested Users child-list fidelity (render/list-row micro-details)
- C1c: functional Search query/results behavior
- Top Tweets / Trends / Nearby expansion only when truthful historical data is available

## Confidence boundary

`historical feature presence != current implementation readiness`

For this checkpoint, the historical column and the runtime implementation readiness column are intentionally separated where data or functional plumbing is still absent.
