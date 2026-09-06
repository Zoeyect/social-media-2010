# F7 Shared Geography Contract

Status: F7b DATA CONTRACT IMPLEMENTED

Canonical runtime: `2010-10-20T00:02:00-07:00` through
`2010-10-20T00:17:00-07:00`, `America/Los_Angeles`.

## Scope and classification

Los Angeles remains the canonical project setting. F7b defines an unnamed
fictional Los Angeles district using geography version `sm2010-la-local-v1`.
The local spatial model, player position, and all exact venue coordinates are
`PROJECT-CURATED FICTION`; they are not recovered historical geography.

The model is a north-up Cartesian plane measured in miles. Its authored bounds
are `x = -1..1` and `y = -1..1`, representing an approximately 2 mile by 2 mile
local world. It contains no fictional latitude or longitude.

## Neutral session position

The player point is stored separately from venue records at `(0.00, 0.00)`.
It means only the device's simulated current position during this session. It
does not establish a home, school, workplace, residence, neighborhood history,
or any other player biography.

## Canonical venue geography

| Canonical venue ID | x miles | y miles | Classification |
| --- | ---: | ---: | --- |
| `downtown-coffee` | 0.15 | 0.15 | `PROJECT-CURATED-FICTION` |
| `main-street-diner` | 0.45 | 0.10 | `PROJECT-CURATED-FICTION` |
| `riverside-park` | -0.50 | 0.10 | `PROJECT-CURATED-FICTION` |
| `community-courts` | -0.75 | -0.55 | `PROJECT-CURATED-FICTION` |
| `gelato-roma` | 0.80 | -0.60 | `PROJECT-CURATED-FICTION` |
| `westside-library` | -0.90 | 0.90 | `PROJECT-CURATED-FICTION` |

Venue names remain owned by `canonicalVenues.ts`; the geography layer references
only canonical venue IDs and does not duplicate display names.

## Distance contract

Distance is the pure Euclidean distance between two points in the local mile
plane. The approved player-relative results are approximately `0.212`, `0.461`,
`0.510`, `0.930`, `1.000`, and `1.273` miles for Downtown Coffee, Main Street
Diner, Riverside Park, Community Courts, Gelato Roma, and Westside Library.
Canonical nearby ordering follows those raw values, with canonical venue ID as
the deterministic tie-break only for exact numeric ties. F7b exposes no distance
display strings and does not connect this ordering to an app surface.

## Legacy exclusions

`night-owl` and `cedar-books` remain `LEGACY / NONCANONICAL / MAP-INELIGIBLE`.
They receive no coordinates or aliases. Existing Foursquare strings `0.2 mi`,
`0.3 mi`, `0.5 mi`, and `0.7 mi` are superseded as geography inputs and remain
untouched legacy content. Existing addresses also remain legacy/HOLD and are not
migrated into canonical geography.

## Product boundaries

Foursquare Places remains exactly as implemented before F7b: Night Owl Cafe,
Main Street Diner, Cedar Books, and Riverside Park. It is not expanded, filtered,
or reordered by the shared geography contract. Facebook Places and its ordering
also remain unchanged.

Root Tips remains blank/HOLD because the sole structured Tip belongs to Night
Owl, which has no canonical geography. At the data-policy level, To-Dos for the
six canonical venues may later be map-eligible, while Night Owl Tip/venue To-Dos
and Cedar legacy content remain list-only. F7b renders none of these states.

## F7c handoff

SVG/vector map rendering, app-specific map chrome, viewport resolution, road
geometry, and all visible map integration are deferred to F7c or later. The
future renderer should use a small north-up authored road network, no real Los
Angeles street names, and explicit `PROJECT RECONSTRUCTION` classification.
Future viewport contracts may support `PLAYER_NEARBY`, `VENUE_DETAIL`,
`MULTI_VENUE`, `TODO_MAP`, and `TIPS_MAP` through bounds with deterministic
padding or a venue center with local span. F7b assigns no provider zoom values
and creates no map state.

Any later coordinate change requires an explicit versioned geography decision;
the `sm2010-la-local-v1` points must not be silently retuned.
