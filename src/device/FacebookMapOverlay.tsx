import type { CanonicalVenueId } from "../data/canonicalVenues";
import { getProjectedVenuePoint, resolveMapViewport, Shared2010Map } from "./Shared2010Map";

const FACEBOOK_PLACE_MAP_WIDTH = 304;
const FACEBOOK_PLACE_MAP_HEIGHT = 68;

export function FacebookMapOverlay({ venueId }: { venueId: CanonicalVenueId }) {
  const viewport = resolveMapViewport({ mode: "VENUE_DETAIL", venueId });
  if (!viewport) return null;
  const marker = getProjectedVenuePoint(
    venueId,
    viewport,
    FACEBOOK_PLACE_MAP_WIDTH,
    FACEBOOK_PLACE_MAP_HEIGHT,
  );
  if (!marker) return null;

  return <section className="facebook-place-map" data-content-status="PROJECT-RECONSTRUCTION">
    <Shared2010Map
      width={FACEBOOK_PLACE_MAP_WIDTH}
      height={FACEBOOK_PLACE_MAP_HEIGHT}
      viewport={viewport}
      venueIds={[]}
    />
    <svg
      className="facebook-place-map-overlay"
      width={FACEBOOK_PLACE_MAP_WIDTH}
      height={FACEBOOK_PLACE_MAP_HEIGHT}
      viewBox={`0 0 ${FACEBOOK_PLACE_MAP_WIDTH} ${FACEBOOK_PLACE_MAP_HEIGHT}`}
      aria-hidden="true"
    >
      <g className="facebook-place-map-pin" transform={`translate(${marker.x} ${marker.y})`}>
        <path d="M0 0C-2-3-6-6-6-10A6 6 0 1 1 6-10C6-6 2-3 0 0Z" />
        <circle cx="0" cy="-10" r="2" />
      </g>
    </svg>
  </section>;
}
