import { FOURSQUARE_F1_CHECKIN_ACTIVITIES, FOURSQUARE_HIDDEN_LIVE_ACTIVITIES, type FoursquareCheckinActivity } from "../data/foursquareContent";
import { buildCheckinResult, createCheckInPointEvent, type FoursquareCheckinResult, type FoursquarePointEvent } from "../data/foursquareGameModel";
import { SESSION_SEED_CONTENT } from "../data/sessionSeedContent";
import type { ContentOrigin } from "../data/sessionSeedContent";

export const FOURSQUARE_ROOT_TABS = ["friends", "places", "tips", "todos", "profile"] as const;
export type FoursquareRootTab = typeof FOURSQUARE_ROOT_TABS[number];
export type FoursquareView = "root" | "venue" | "leaderboard";
export type FoursquareVenueSubview = "summary" | "info" | "tips" | "checkIn";
export type FoursquareMayorState = "otherUser";
export type FoursquareCheckInRecord = { checkedIn: true; checkedInBy: string; checkInTimestamp: number; shout: string | null; pointsAwarded: number; result: FoursquareCheckinResult };
export type FoursquareVenue = { id: string; name: string; category: string; address: string; distance: string; mayor: string; contentStatus: "HOLD-fictional"; origin: ContentOrigin };
export type FoursquareRootScrollPositions = Record<FoursquareRootTab, number>;

export type FoursquareState = {
  activeTab: FoursquareRootTab; currentView: FoursquareView; venueSubview: FoursquareVenueSubview; selectedVenueId: string | null; rootScrollPositions: FoursquareRootScrollPositions;
  checkIns: Record<string, FoursquareCheckInRecord>; shoutDrafts: Record<string, string>; pointEvents: FoursquarePointEvent[]; latestCheckinResult: FoursquareCheckinResult | null; mayorState: FoursquareMayorState; earnedBadges: string[];
  venues: FoursquareVenue[]; socialActivities: FoursquareCheckinActivity[]; unreadActivityCount: number;
};

export type FoursquareEvent =
  | { type: "SHOW_TAB"; tab: FoursquareRootTab }
  | { type: "OPEN_VENUE"; venueId: string; scrollPosition: number }
  | { type: "SHOW_PLACES" }
  | { type: "SHOW_VENUE_SUMMARY" }
  | { type: "SHOW_VENUE_INFO" }
  | { type: "SHOW_VENUE_TIPS" }
  | { type: "SHOW_VENUE_CHECK_IN" }
  | { type: "SHOW_LEADERBOARD" }
  | { type: "SHOW_PROFILE" }
  | { type: "SET_ROOT_SCROLL_POSITION"; tab: FoursquareRootTab; scrollPosition: number }
  | { type: "EDIT_CHECK_IN_SHOUT"; venueId: string; value: string }
  | { type: "CHECK_IN"; venueId: string; checkedInBy: string; checkInTimestamp: number }
  | { type: "DELIVER_SOCIAL_ACTIVITY"; activity: { id: string; message: string } }
  | { type: "RESET" };

const emptyScrollPositions = (): FoursquareRootScrollPositions => ({ friends: 0, places: 0, tips: 0, todos: 0, profile: 0 });

export function createInitialFoursquareState(): FoursquareState {
  return {
    activeTab: "friends", currentView: "root", venueSubview: "summary", selectedVenueId: null, rootScrollPositions: emptyScrollPositions(),
    checkIns: {}, shoutDrafts: {}, pointEvents: [], latestCheckinResult: null, mayorState: "otherUser", earnedBadges: [],
    venues: SESSION_SEED_CONTENT.foursquare.venues.map(({ tip: _legacyTip, ...venue }) => ({ ...venue, contentStatus: "HOLD-fictional" })),
    socialActivities: FOURSQUARE_F1_CHECKIN_ACTIVITIES.map(activity => ({ ...activity })), unreadActivityCount: 0,
  };
}

export const initialFoursquareState = createInitialFoursquareState();

export function foursquareStateTransition(state: FoursquareState, event: FoursquareEvent): FoursquareState {
  switch (event.type) {
    case "SHOW_TAB": return { ...state, activeTab: event.tab, currentView: "root", venueSubview: "summary", selectedVenueId: null };
    case "OPEN_VENUE":
      if (!state.venues.some(venue => venue.id === event.venueId)) return state;
      return { ...state, activeTab: "places", currentView: "venue", venueSubview: "summary", selectedVenueId: event.venueId, rootScrollPositions: { ...state.rootScrollPositions, places: Math.max(0, event.scrollPosition) } };
    case "SHOW_PLACES": return { ...state, activeTab: "places", currentView: "root", venueSubview: "summary", selectedVenueId: null };
    case "SHOW_VENUE_SUMMARY": return state.currentView === "venue" && state.selectedVenueId ? { ...state, venueSubview: "summary" } : state;
    case "SHOW_VENUE_INFO": return state.currentView === "venue" && state.selectedVenueId ? { ...state, venueSubview: "info" } : state;
    case "SHOW_VENUE_TIPS": return state.currentView === "venue" && state.selectedVenueId ? { ...state, venueSubview: "tips" } : state;
    case "SHOW_VENUE_CHECK_IN": return state.currentView === "venue" && state.selectedVenueId ? { ...state, venueSubview: "checkIn" } : state;
    case "SHOW_LEADERBOARD": return { ...state, activeTab: "profile", currentView: "leaderboard", venueSubview: "summary", selectedVenueId: null };
    case "SHOW_PROFILE": return { ...state, activeTab: "profile", currentView: "root", venueSubview: "summary", selectedVenueId: null };
    case "SET_ROOT_SCROLL_POSITION": return { ...state, rootScrollPositions: { ...state.rootScrollPositions, [event.tab]: Math.max(0, event.scrollPosition) } };
    case "EDIT_CHECK_IN_SHOUT":
      if (!state.venues.some(venue => venue.id === event.venueId) || state.checkIns[event.venueId]) return state;
      return { ...state, shoutDrafts: { ...state.shoutDrafts, [event.venueId]: event.value.slice(0, 140) } };
    case "CHECK_IN": {
      if (!state.venues.some(venue => venue.id === event.venueId) || state.checkIns[event.venueId]) return state;
      const pointEvent = createCheckInPointEvent(event.venueId, event.checkInTimestamp);
      const result = buildCheckinResult(state.pointEvents, pointEvent);
      return { ...state, checkIns: { ...state.checkIns, [event.venueId]: { checkedIn: true, checkedInBy: event.checkedInBy, checkInTimestamp: event.checkInTimestamp, shout: state.shoutDrafts[event.venueId]?.trim() || null, pointsAwarded: result.pointDelta, result } }, shoutDrafts: Object.fromEntries(Object.entries(state.shoutDrafts).filter(([venueId]) => venueId !== event.venueId)), pointEvents: [...state.pointEvents, pointEvent], latestCheckinResult: result };
    }
    case "DELIVER_SOCIAL_ACTIVITY": {
      if (state.socialActivities.some(activity => activity.id === event.activity.id)) return state;
      const structured = FOURSQUARE_HIDDEN_LIVE_ACTIVITIES[event.activity.id];
      return structured ? { ...state, socialActivities: [...state.socialActivities, { ...structured }], unreadActivityCount: state.unreadActivityCount + 1 } : state;
    }
    case "RESET": return createInitialFoursquareState();
  }
}
