import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export type FoursquareView = "places" | "venue";
export type FoursquareMayorState = "otherUser";

export type FoursquareCheckInRecord = {
  checkedIn: true;
  checkedInBy: string;
  checkInTimestamp: number;
  shout: string | null;
  pointsAwarded: number;
};

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
  checkIns: Record<string, FoursquareCheckInRecord>;
  shoutDrafts: Record<string, string>;
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
  | { type: "EDIT_CHECK_IN_SHOUT"; venueId: string; value: string }
  | { type: "CHECK_IN"; venueId: string; checkedInBy: string; checkInTimestamp: number }
  | { type: "OPEN_TIP"; venueId: string; tipId: string }
  | { type: "CLOSE_TIP" }
  | { type: "DELIVER_SOCIAL_ACTIVITY"; activity: { id: string; message: string } }
  | { type: "RESET" };

export function createInitialFoursquareState(): FoursquareState {
  return {
    currentView: "places",
    selectedVenueId: null,
    scrollPosition: 0,
    checkIns: {},
    shoutDrafts: {},
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
      return { ...state, currentView: "venue", selectedVenueId: event.venueId, selectedTipId: null, scrollPosition: Math.max(0, event.scrollPosition) };
    case "SHOW_PLACES":
      return { ...state, currentView: "places", selectedVenueId: null, selectedTipId: null };
    case "SET_SCROLL_POSITION":
      return { ...state, scrollPosition: Math.max(0, event.scrollPosition) };
    case "EDIT_CHECK_IN_SHOUT":
      if (!state.venues.some(venue => venue.id === event.venueId) || state.checkIns[event.venueId]) return state;
      return { ...state, shoutDrafts: { ...state.shoutDrafts, [event.venueId]: event.value.slice(0, 140) } };
    case "CHECK_IN":
      if (!state.venues.some(venue => venue.id === event.venueId) || state.checkIns[event.venueId]) return state;
      return {
        ...state,
        checkIns: {
          ...state.checkIns,
          [event.venueId]: {
            checkedIn: true,
            checkedInBy: event.checkedInBy,
            checkInTimestamp: event.checkInTimestamp,
            shout: state.shoutDrafts[event.venueId]?.trim() || null,
            pointsAwarded: 1,
          },
        },
        shoutDrafts: Object.fromEntries(Object.entries(state.shoutDrafts).filter(([venueId]) => venueId !== event.venueId)),
        points: state.points + 1,
      };
    case "OPEN_TIP": {
      const venue = state.venues.find(candidate => candidate.id === event.venueId);
      return state.selectedVenueId === venue?.id && venue.tip?.id === event.tipId
        ? { ...state, selectedTipId: event.tipId }
        : state;
    }
    case "CLOSE_TIP":
      return { ...state, selectedTipId: null };
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
