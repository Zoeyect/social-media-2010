export const CANONICAL_VENUES = Object.freeze({
  "main-street-diner": Object.freeze({
    id: "main-street-diner" as const,
    name: "Main Street Diner" as const,
  }),
});

export type CanonicalVenueId = keyof typeof CANONICAL_VENUES;

export const MAIN_STREET_DINER_VENUE = CANONICAL_VENUES["main-street-diner"];

export function getCanonicalVenue(venueId: CanonicalVenueId) {
  return CANONICAL_VENUES[venueId];
}
