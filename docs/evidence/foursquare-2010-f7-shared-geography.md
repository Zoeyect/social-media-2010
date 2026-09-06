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

## F7c deterministic shared renderer

F7c adds an unused shared React/SVG renderer plus pure viewport and projection
helpers. The renderer is explicitly `PROJECT RECONSTRUCTION`: SVG is an internal
deterministic implementation choice, not a claim about the technology used by a
historical map provider or either 2010 app.

The base field contains a pale neutral land color, six simple implied blocks,
exactly two primary roads, several local cross streets, and one muted park
polygon. All roads, blocks, and park vertices are authored in local mile
coordinates and converted to screen positions only by projection. Roads remain
unnamed, the map has no real Los Angeles streets, and the Riverside Park region
adds no river, lake, or trail fiction.

The viewport contract now resolves `PLAYER_NEARBY`, `VENUE_DETAIL`,
`MULTI_VENUE`, `TODO_MAP`, and `TIPS_MAP`. Player Nearby uses the fixed F7b world
bounds. Venue Detail centers a deterministic local span on an eligible canonical
venue. Multi-venue mechanics derive bounds, apply fixed padding, preserve a
nonzero minimum span for one point, and return an explicit null result for empty
or legacy-ineligible input. TODO and Tips modes expose only those shared bounds
mechanics; no product behavior is connected.

Projection supports rectangular containers and preserves geographic scale by
expanding viewport bounds to the requested aspect ratio. It explicitly inverts
the local Y axis so increasing `yMiles` renders upward in SVG. Structural QA
covers 320 by 200 and 320 by 240 outputs.

The shared component can render neutral QA venue anchors and one neutral session
player marker. It renders no venue labels and contains no Facebook or Foursquare
marker identity, brand colors, navigation, controls, or actions. App-specific
overlays and final marker materials remain deferred.

There is no external map provider, tile request, network request, browser
geolocation, runtime-generated road, randomness, or host-time dependency. Night
Owl and Cedar Books cannot resolve either a canonical detail viewport or marker.
Neither Facebook nor Foursquare imports the renderer in F7c, so all production
surfaces, Places coverage, Tips, To-Dos, and check-in behavior remain unchanged.
Runtime visual QA is deferred until an approved F7d app-specific integration
provides a real surface without adding a preview-only production route.

## F7d-1 Foursquare Venue Info integration

F7d-1 makes Venue Info the first visible Foursquare consumer of the shared map.
Main Street Diner and Riverside Park resolve the existing `VENUE_DETAIL`
viewport and render `Shared2010Map` beneath the unchanged Category row. The
shared renderer receives no venue markers and no player marker; a separate
`FoursquareMapOverlay` owns one minimal venue pin.

The pin shape and color are `PROJECT RECONSTRUCTION`, not authenticated 2010
Foursquare map material. It is deliberately static and exposes no label,
callout, selection, distance, address, player position, pan, zoom, recenter, or
other interaction. The base SVG remains the separately classified shared
project reconstruction and has no provider dependency.

Night Owl Cafe and Cedar Books remain fully available through their existing
list, Venue, Tip, To-Do, Friends, check-in, and realtime paths where applicable,
but their Info surfaces render no map because neither has canonical geography.
Map absence does not invalidate either legacy venue.

Foursquare Places remains the same four venues in the same seed order. F7d-1
adds no Places map or map/list control, does not display canonical or legacy
distance/address data, and does not connect maps to Check-in, Result, To-Dos,
Tips, Friends, Profile, or Leaderboard. Facebook and all F4/F5/F6 behavior remain
unchanged. Runtime visual fidelity of the reconstructed map frame and pin remains
`RUNTIME VISUAL QA PENDING`.
