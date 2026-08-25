import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

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
  tip: { id: string; author: string; text: string; origin: ContentOrigin } | null;
  contentStatus: "HOLD-fictional";
  origin: ContentOrigin;
};

export type FoursquareSocialActivity = { id: string; message: string; timestamp: string; origin: ContentOrigin };

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
  socialActivities: FoursquareSocialActivity[];
  unreadActivityCount: number;
};

export type FoursquareEvent =
  | { type: "OPEN_VENUE"; venueId: string; scrollPosition: number }
  | { type: "SHOW_PLACES" }
  | { type: "SET_SCROLL_POSITION"; scrollPosition: number }
  | { type: "CHECK_IN"; venueId: string }
  | { type: "DELIVER_SOCIAL_ACTIVITY"; activity: { id: string; message: string } }
  | { type: "RESET" };

export function createInitialFoursquareState(): FoursquareState {
  return {
    currentView: "places",
    selectedVenueId: null,
    scrollPosition: 0,
    checkInState: {},
    points: 0,
    mayorState: "otherUser",
    earnedBadges: [],
    selectedTipId: null,
    venues: SESSION_SEED_CONTENT.foursquare.venues.map(venue => ({ ...venue, tip: venue.tip ? { ...venue.tip } : null, contentStatus: "HOLD-fictional" })),
    socialActivities: SESSION_SEED_CONTENT.foursquare.activities.map(activity => ({ ...activity })),
    unreadActivityCount: 0,
  };
}

export const initialFoursquareState: FoursquareState = createInitialFoursquareState();

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
    case "DELIVER_SOCIAL_ACTIVITY":
      return state.socialActivities.some(activity => activity.id === event.activity.id)
        ? state
        : {
            ...state,
            socialActivities: [...state.socialActivities, { ...event.activity, timestamp: "12:10 AM", origin: "live" }],
            unreadActivityCount: state.unreadActivityCount + 1,
          };
    case "RESET":
      return createInitialFoursquareState();
  }
}
