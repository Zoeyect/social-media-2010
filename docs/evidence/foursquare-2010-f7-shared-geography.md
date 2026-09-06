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
Runtime visual QA was deferred at the F7c phase boundary until an approved
app-specific integration provided a real surface without adding a preview-only
production route. That phase-local handoff is superseded by the completed
F7d-1 and F7f-1 integrations below.

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
unchanged. Manual runtime visual QA passed for both canonical Venue Info maps,
including distinct `VENUE_DETAIL` framing, reconstructed pin material, road
hierarchy, park treatment, and 320-pixel integration.

## F7f-1 Facebook Place Check In integration

F7f-1 selects Facebook Place Check In as the sole Facebook map surface for F7.
The selected-place map/location context is `PERIOD-SUPPORTED`; the shared SVG
base, exact 68-pixel frame, viewport, frame treatment, and Facebook pin are
`PROJECT RECONSTRUCTION`. The renderer is not presented as literal historical
map-provider output.

The former `Map / Location view unavailable` HOLD slot now renders
`Shared2010Map` with the existing `VENUE_DETAIL` viewport and one compact marker
owned by a separate `FacebookMapOverlay`. All six Facebook place options have
canonical geography and can resolve this preview. Night Owl Cafe and Cedar Books
remain outside Facebook Places and cannot leak into the overlay.

Nearby Places remains the same six-row list in the same order. There is no
Places-root map, map/list switch, multi-pin view, player marker, distance,
address, label, callout, interaction, pan, zoom, recenter, directions, Place
Detail map, or Info map. The April 2011 Facebook Places Map View is explicitly
excluded from the October 2010 reconstruction.

Status drafting, Tag Friends, friend selection, Check In, feed-story creation,
and post-check-in Place Detail Activity navigation remain unchanged.
`Shared2010Map` remains app-neutral, and Facebook does not import or reuse the
Foursquare overlay. Deterministic validation passed, and manual runtime visual
QA passed for Downtown Coffee, Riverside Park, and Westside Library, including
68-pixel readability, distinct `VENUE_DETAIL` views, reconstructed pin
material, clipping, and preservation of the check-in form hierarchy.

## F7d-2 Foursquare Places map decision

The Foursquare Places root remains the approved four-row list in its existing
order: Night Owl Cafe, Main Street Diner, Cedar Books, and Riverside Park.
Only Main Street Diner and Riverside Park belong to the canonical six-venue
geography. A root map would therefore represent only two of four visible rows,
while silently omitting Night Owl Cafe and Cedar Books.

F7d-2 is `SKIP FOR F7`. The available target evidence supports map treatment in
the product family but does not establish a sufficiently specific iPhone 2.0
Places-root map contract to justify inventing mixed canonical and noncanonical
geography. No map/list switch, player marker, distance, address, callout, or map
interaction is introduced.

Reopen F7d-2 only if Night Owl Cafe and Cedar Books receive approved canonical
geography, the Places inventory is coherently migrated to the canonical venue
set, stronger target-version evidence establishes the root behavior, or an
explicit gameplay requirement justifies a separately approved reconstruction.

## F7 closure

**Status: `COMPLETE_WITH_HOLDS`.**

F7 completes the shared deterministic fake-map foundation and the two approved
visible integrations without presenting unsupported map behavior as historical
fact. Shared geography and rendering remain app-neutral; Facebook and
Foursquare retain separate overlay components and product boundaries.

| Surface or capability | Final status | Boundary | Reopen condition |
| --- | --- | --- | --- |
| Foursquare Venue Info maps | COMPLETE | Main Street Diner and Riverside Park only | Revisit only with approved canonical geography or stronger venue evidence |
| Foursquare Places root map | SKIP FOR F7 | Mixed two-of-four map eligibility would misrepresent the visible list | Approved Night Owl/Cedar geography, canonical inventory migration, stronger iPhone 2.0 evidence, or explicit gameplay need |
| Foursquare Friends map | DEFERRED | No approved product slice requires it | Explicit Friends-map user story and target-version behavior |
| Foursquare Tips root map | HOLD | Root remains blank; Night Owl Tip is map-ineligible | Approved canonical Tips content and geography decision |
| Foursquare To-Dos map | DEFERRED | Current venue and Tip To-Dos do not require a map | Approved map-oriented To-Do user story |
| Foursquare player marker | HOLD | Player point remains internal geometry only | Direct surface evidence or explicit approved reconstruction |
| Facebook selected-place Check In map | COMPLETE | All six canonical place choices use `VENUE_DETAIL` | Revisit only with stronger target-version evidence |
| Facebook Nearby/root Map View | SKIP FOR F7 | April 2011 Places Map View behavior is outside the October 2010 target | Target-date evidence supporting an October 2010 root map |
| Facebook Place Detail or Info maps | HOLD | No approved surface contract | Direct target-version evidence or explicit product decision |
| Facebook player marker | HOLD | No approved visible user-location treatment | Direct target-version evidence or explicit product decision |
| Distance and address display | HOLD | No canonical addresses; legacy Foursquare distance strings are noncanonical | Approved address/geodesic contract and target-version evidence |
| Pan, zoom, recenter, labels, and callouts | HOLD | Shared renderer is deterministic and noninteractive | Explicit interaction contract supported by evidence or approved reconstruction |

Manual runtime visual QA passed for the Foursquare Main Street Diner and
Riverside Park Venue Info maps and for the Facebook Downtown Coffee, Riverside
Park, and Westside Library Check In previews. Frame proportions, distinct
venue-centered views, overlay materials, road density, Riverside Park
treatment, clipping, and surrounding UI hierarchy were accepted without
further polish.

The remaining HOLD, DEFERRED, and SKIP entries are intentional product and
evidence boundaries, not incomplete implementation defects. F7 therefore
satisfies the current shared location/map-system requirement while preserving
the October 2010 historical boundary and avoiding unsupported geography or UI.
