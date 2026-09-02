import { FOURSQUARE_F1_CHECKIN_ACTIVITIES, FOURSQUARE_HIDDEN_LIVE_ACTIVITIES, type FoursquareCheckinActivity } from "../data/foursquareContent";
import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export const FOURSQUARE_ROOT_TABS = ["friends", "places", "tips", "todos", "profile"] as const;
export type FoursquareRootTab = typeof FOURSQUARE_ROOT_TABS[number];
export type FoursquareView = "root" | "venue";
export type FoursquareMayorState = "otherUser";
export type FoursquareCheckInRecord = { checkedIn: true; checkedInBy: string; checkInTimestamp: number; shout: string | null; pointsAwarded: number };
export type FoursquareVenue = { id: string; name: string; category: string; address: string; distance: string; mayor: string; tip: { id: string; author: string; text: string; origin: ContentOrigin } | null; contentStatus: "HOLD-fictional"; origin: ContentOrigin };
export type FoursquareRootScrollPositions = Record<FoursquareRootTab, number>;

export type FoursquareState = {
  activeTab: FoursquareRootTab; currentView: FoursquareView; selectedVenueId: string | null; rootScrollPositions: FoursquareRootScrollPositions;
  checkIns: Record<string, FoursquareCheckInRecord>; shoutDrafts: Record<string, string>; points: number; mayorState: FoursquareMayorState; earnedBadges: string[]; selectedTipId: string | null;
  venues: FoursquareVenue[]; socialActivities: FoursquareCheckinActivity[]; unreadActivityCount: number;
};

export type FoursquareEvent =
  | { type: "SHOW_TAB"; tab: FoursquareRootTab }
  | { type: "OPEN_VENUE"; venueId: string; scrollPosition: number }
  | { type: "SHOW_PLACES" }
  | { type: "SET_ROOT_SCROLL_POSITION"; tab: FoursquareRootTab; scrollPosition: number }
  | { type: "EDIT_CHECK_IN_SHOUT"; venueId: string; value: string }
  | { type: "CHECK_IN"; venueId: string; checkedInBy: string; checkInTimestamp: number }
  | { type: "OPEN_TIP"; venueId: string; tipId: string }
  | { type: "CLOSE_TIP" }
  | { type: "DELIVER_SOCIAL_ACTIVITY"; activity: { id: string; message: string } }
  | { type: "RESET" };

const emptyScrollPositions = (): FoursquareRootScrollPositions => ({ friends: 0, places: 0, tips: 0, todos: 0, profile: 0 });

export function createInitialFoursquareState(): FoursquareState {
  return {
    activeTab: "friends", currentView: "root", selectedVenueId: null, rootScrollPositions: emptyScrollPositions(),
    checkIns: {}, shoutDrafts: {}, points: 0, mayorState: "otherUser", earnedBadges: [], selectedTipId: null,
    venues: SESSION_SEED_CONTENT.foursquare.venues.map(venue => ({ ...venue, tip: venue.tip ? { ...venue.tip } : null, contentStatus: "HOLD-fictional" })),
    socialActivities: FOURSQUARE_F1_CHECKIN_ACTIVITIES.map(activity => ({ ...activity })), unreadActivityCount: 0,
  };
}

export const initialFoursquareState = createInitialFoursquareState();

export function foursquareStateTransition(state: FoursquareState, event: FoursquareEvent): FoursquareState {
  switch (event.type) {
    case "SHOW_TAB": return { ...state, activeTab: event.tab, currentView: "root", selectedVenueId: null, selectedTipId: null };
    case "OPEN_VENUE":
      if (!state.venues.some(venue => venue.id === event.venueId)) return state;
      return { ...state, activeTab: "places", currentView: "venue", selectedVenueId: event.venueId, selectedTipId: null, rootScrollPositions: { ...state.rootScrollPositions, places: Math.max(0, event.scrollPosition) } };
    case "SHOW_PLACES": return { ...state, activeTab: "places", currentView: "root", selectedVenueId: null, selectedTipId: null };
    case "SET_ROOT_SCROLL_POSITION": return { ...state, rootScrollPositions: { ...state.rootScrollPositions, [event.tab]: Math.max(0, event.scrollPosition) } };
    case "EDIT_CHECK_IN_SHOUT":
      if (!state.venues.some(venue => venue.id === event.venueId) || state.checkIns[event.venueId]) return state;
      return { ...state, shoutDrafts: { ...state.shoutDrafts, [event.venueId]: event.value.slice(0, 140) } };
    case "CHECK_IN":
      if (!state.venues.some(venue => venue.id === event.venueId) || state.checkIns[event.venueId]) return state;
      return { ...state, checkIns: { ...state.checkIns, [event.venueId]: { checkedIn: true, checkedInBy: event.checkedInBy, checkInTimestamp: event.checkInTimestamp, shout: state.shoutDrafts[event.venueId]?.trim() || null, pointsAwarded: 1 } }, shoutDrafts: Object.fromEntries(Object.entries(state.shoutDrafts).filter(([venueId]) => venueId !== event.venueId)), points: state.points + 1 };
    case "OPEN_TIP": {
      const venue = state.venues.find(candidate => candidate.id === event.venueId);
      return state.selectedVenueId === venue?.id && venue.tip?.id === event.tipId ? { ...state, selectedTipId: event.tipId } : state;
    }
    case "CLOSE_TIP": return { ...state, selectedTipId: null };
    case "DELIVER_SOCIAL_ACTIVITY": {
      if (state.socialActivities.some(activity => activity.id === event.activity.id)) return state;
      const structured = FOURSQUARE_HIDDEN_LIVE_ACTIVITIES[event.activity.id];
      return structured ? { ...state, socialActivities: [...state.socialActivities, { ...structured }], unreadActivityCount: state.unreadActivityCount + 1 } : state;
    }
    case "RESET": return createInitialFoursquareState();
  }
}
