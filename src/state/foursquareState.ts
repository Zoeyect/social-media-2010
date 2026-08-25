export type FoursquareView = "places" | "venue";
export type FoursquareCheckInState = "notCheckedIn" | "checkedIn";
export type FoursquareMayorState = "otherUser";

export type FoursquareVenue = {
  id: string;
  name: string;
  category: string;
  address: string;
  distance: string;
  mayor: string;
  tip: { id: string; author: string; text: string } | null;
  contentStatus: "HOLD-fictional";
};

export type FoursquareState = {
  currentView: FoursquareView;
  selectedVenueId: string | null;
  scrollPosition: number;
  checkInState: Record<string, FoursquareCheckInState>;
  points: number;
  mayorState: FoursquareMayorState;
  earnedBadges: string[];
  selectedTipId: string | null;
  venues: FoursquareVenue[];
};

export type FoursquareEvent =
  | { type: "OPEN_VENUE"; venueId: string; scrollPosition: number }
  | { type: "SHOW_PLACES" }
  | { type: "SET_SCROLL_POSITION"; scrollPosition: number }
  | { type: "CHECK_IN"; venueId: string }
  | { type: "RESET" };

const venues: FoursquareVenue[] = [
  { id: "night-owl", name: "Night Owl Cafe", category: "Coffee Shop", address: "214 4th Street", distance: "0.2 mi", mayor: "June", tip: { id: "night-owl-tip", author: "June", text: "The coffee is strongest after ten." }, contentStatus: "HOLD-fictional" },
  { id: "corner-diner", name: "The Corner Diner", category: "Diner", address: "38 Market Street", distance: "0.3 mi", mayor: "Jack", tip: null, contentStatus: "HOLD-fictional" },
  { id: "cedar-books", name: "Cedar Books", category: "Bookstore", address: "91 Cedar Avenue", distance: "0.5 mi", mayor: "Mia", tip: null, contentStatus: "HOLD-fictional" },
  { id: "riverside-park", name: "Riverside Park", category: "Park", address: "Riverside Drive", distance: "0.7 mi", mayor: "Eli", tip: null, contentStatus: "HOLD-fictional" },
];

export const initialFoursquareState: FoursquareState = {
  currentView: "places",
  selectedVenueId: null,
  scrollPosition: 0,
  checkInState: {},
  points: 0,
  mayorState: "otherUser",
  earnedBadges: [],
  selectedTipId: null,
  venues,
};

export function foursquareStateTransition(state: FoursquareState, event: FoursquareEvent): FoursquareState {
  switch (event.type) {
    case "OPEN_VENUE":
      if (!state.venues.some(venue => venue.id === event.venueId)) return state;
      return { ...state, currentView: "venue", selectedVenueId: event.venueId, scrollPosition: Math.max(0, event.scrollPosition) };
    case "SHOW_PLACES":
      return { ...state, currentView: "places", selectedVenueId: null, selectedTipId: null };
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: Math.max(0, event.scrollPosition) };
    case "CHECK_IN":
      if (!state.venues.some(venue => venue.id === event.venueId) || state.checkInState[event.venueId] === "checkedIn") return state;
      return {
        ...state,
        checkInState: { ...state.checkInState, [event.venueId]: "checkedIn" },
        points: state.points + 1,
      };
    case "RESET":
      return initialFoursquareState;
  }
}
