import { getProjectedVenuePoint, resolveMapViewport, Shared2010Map } from "./Shared2010Map";

const FOURSQUARE_VENUE_MAP_WIDTH = 320;
const FOURSQUARE_VENUE_MAP_HEIGHT = 176;

export function FoursquareMapOverlay({ venueId }: { venueId: string }) {
  const viewport = resolveMapViewport({ mode: "VENUE_DETAIL", venueId });
  if (!viewport) return null;
  const marker = getProjectedVenuePoint(
    venueId,
    viewport,
    FOURSQUARE_VENUE_MAP_WIDTH,
    FOURSQUARE_VENUE_MAP_HEIGHT,
  );
  if (!marker) return null;

  return <section className="foursquare-venue-map" data-content-status="PROJECT-RECONSTRUCTION">
    <Shared2010Map
      width={FOURSQUARE_VENUE_MAP_WIDTH}
      height={FOURSQUARE_VENUE_MAP_HEIGHT}
      viewport={viewport}
      venueIds={[]}
    />
    <svg
      className="foursquare-venue-map-overlay"
      width={FOURSQUARE_VENUE_MAP_WIDTH}
      height={FOURSQUARE_VENUE_MAP_HEIGHT}
      viewBox={`0 0 ${FOURSQUARE_VENUE_MAP_WIDTH} ${FOURSQUARE_VENUE_MAP_HEIGHT}`}
      aria-hidden="true"
    >
      <g className="foursquare-venue-map-pin" transform={`translate(${marker.x} ${marker.y})`}>
        <path d="M0 0C-2.5-4-8-8-8-14A8 8 0 1 1 8-14C8-8 2.5-4 0 0Z" />
        <circle cx="0" cy="-14" r="2.5" />
      </g>
    </svg>
  </section>;
}
