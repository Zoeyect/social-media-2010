# Foursquare Historical Reconstruction F2a — Places Root

Status: `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`

Target: Foursquare for iPhone 2.0-era, September–October 2010, on the project's iPhone 4 / iOS 4.1 surface.

## Scope

F2a reconstructs only the Places root. It preserves the four venue identities and all F1 navigation, check-in, Friends-feed, scheduler, and reset behavior. Venue detail remains explicitly `F2-pending`.

The retained venue decisions are:

- Night Owl Cafe — HOLD
- Main Street Diner — KEEP, including canonical ID `main-street-diner`
- Cedar Books — HOLD
- Riverside Park — KEEP identity, including canonical ID `riverside-park`

## Venue adapter boundary

`FoursquareVenueViewModel` combines the existing venue identity with explicitly mapped Foursquare presentation metadata: category ID/label/icon, Tip IDs, visible prior-friend activity IDs, empty current-friend IDs, and content status. It does not contain coordinates, map data, phone numbers, distance, address, mayor, or check-in counts.

The current canonical venue layer supplies stable ID and name only. Shared physical coordinates must later live in that canonical layer rather than being duplicated in Foursquare-private data.

## Places rows

The compact row is a conservative reconstruction from period screenshots: 58px minimum height, 8px horizontal inset, 36px category artwork, text beginning at x=52, 15/18 bold venue name, and 11/14 category metadata. The restrained disclosure is reconstructed; original target-build artwork remains HOLD.

Category artwork for Coffee Shop, Diner / Restaurant, Bookstore, and Park is `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`. These are deterministic project vectors, not recovered Foursquare bundle assets and not modern Foursquare category icons.

## Truthful omissions

The seed addresses (`214 4th Street`, `38 Market Street`, `91 Cedar Avenue`, and `Riverside Drive`) are not geographically authenticated and are omitted from Places rows. The seed distances (`0.2 mi`, `0.3 mi`, `0.5 mi`, and `0.7 mi`) are not coordinate-derived and are also omitted. No replacement neighborhood, proximity phrase, people-here count, mayor, phone, map, or check-in count is invented.

## Search and location

Search remains HOLD. Local name/category filtering would be technically truthful, but the available direct target-build evidence does not establish the field geometry strongly enough for this pass. No generic modern search field, remote-search implication, GPS behavior, location label, map control, or Add Venue path is rendered.

Map, canonical coordinates, player location, distance calculation, current-presence context, and venue migration remain future work.
