import { Dispatch, useLayoutEffect, useRef } from "react";
import friendsIcon from "../assets/foursquare/icons/friends-2010-reconstructed.svg";
import placesIcon from "../assets/foursquare/icons/places-2010-reconstructed.svg";
import tipsIcon from "../assets/foursquare/icons/tips-2010-reconstructed.svg";
import todosIcon from "../assets/foursquare/icons/todos-2010-reconstructed.svg";
import profileIcon from "../assets/foursquare/icons/profile-2010-reconstructed.svg";
import { CORE_SOCIAL_CHARACTERS } from "../data/coreSocialFriends";
import { FOURSQUARE_F1_PERIPHERAL_PEOPLE, FOURSQUARE_F1_REFERENCE_NOW, type FoursquareCheckinActivity } from "../data/foursquareContent";
import { FOURSQUARE_ROOT_TABS, FoursquareEvent, FoursquareRootTab, FoursquareState, FoursquareVenue } from "../state/foursquareState";
import { useSessionIdentity } from "../state/sessionIdentity";
import { IOS4Textarea } from "./IOS4KeyboardSystem";
import { FoursquareAvatar } from "./FoursquareAvatar";

type Props = { state: FoursquareState; dispatch: Dispatch<FoursquareEvent> };
const TAB_PRESENTATION: Readonly<Record<FoursquareRootTab, { label: string; icon: string }>> = Object.freeze({
  friends: { label: "Friends", icon: friendsIcon }, places: { label: "Places", icon: placesIcon }, tips: { label: "Tips", icon: tipsIcon }, todos: { label: "To-Dos", icon: todosIcon }, profile: { label: "Profile", icon: profileIcon },
});

export function FoursquareContainer({ state, dispatch }: Props) {
  const identity = useSessionIdentity();
  const rootRef = useRef<HTMLDivElement>(null);
  const venue = state.venues.find(candidate => candidate.id === state.selectedVenueId) ?? null;
  useLayoutEffect(() => {
    if (state.currentView === "root" && rootRef.current) rootRef.current.scrollTop = state.rootScrollPositions[state.activeTab];
  }, [state.activeTab, state.currentView, state.rootScrollPositions]);

  const title = state.currentView === "venue" ? venue?.name ?? "Venue" : state.activeTab === "friends" ? "foursquare" : TAB_PRESENTATION[state.activeTab].label;
  return <section className="foursquare-container" aria-label="Foursquare" data-chrome-status="RECONSTRUCTED_FROM_PERIOD_SCREENSHOT">
    <header className="foursquare-navigation-bar">
      {state.currentView === "venue" && <button type="button" onClick={() => dispatch({ type: "SHOW_PLACES" })}>Places</button>}
      <strong className={state.activeTab === "friends" && state.currentView === "root" ? "is-wordmark" : ""}>{title}</strong>
    </header>
    <main className="foursquare-content">
      {state.currentView === "root" && <div ref={rootRef} className={`foursquare-root is-${state.activeTab}`} onScroll={event => dispatch({ type: "SET_ROOT_SCROLL_POSITION", tab: state.activeTab, scrollPosition: event.currentTarget.scrollTop })}>
        {state.activeTab === "friends" && <FriendsRoot activities={state.socialActivities} venues={state.venues} onOpenVenue={venueId => dispatch({ type: "OPEN_VENUE", venueId, scrollPosition: state.rootScrollPositions.places })} />}
        {state.activeTab === "places" && <PlacesRoot state={state} onOpen={(venueId, scrollPosition) => dispatch({ type: "OPEN_VENUE", venueId, scrollPosition })} scrollHost={rootRef} />}
        {state.activeTab === "tips" && <QuietRoot label="Tips" />}
        {state.activeTab === "todos" && <QuietRoot label="To-Dos" />}
        {state.activeTab === "profile" && <section className="foursquare-profile-root"><FoursquareAvatar identityId="session-owner" displayName={identity.name} /><strong>{identity.name}</strong></section>}
      </div>}
      {state.currentView === "venue" && venue && <VenueDetail venue={venue} state={state} identityName={identity.name} dispatch={dispatch} />}
    </main>
    <nav className="foursquare-tab-bar" aria-label="Foursquare sections">
      {FOURSQUARE_ROOT_TABS.map(tab => <button key={tab} type="button" aria-current={state.activeTab === tab ? "page" : undefined} onClick={() => dispatch({ type: "SHOW_TAB", tab })}>
        <img src={TAB_PRESENTATION[tab].icon} alt="" aria-hidden="true" /><span>{TAB_PRESENTATION[tab].label}</span>
      </button>)}
    </nav>
  </section>;
}

function FriendsRoot({ activities, venues, onOpenVenue }: { activities: FoursquareCheckinActivity[]; venues: FoursquareVenue[]; onOpenVenue: (venueId: string) => void }) {
  const visible = activities.filter(activity => activity.visible).sort((a, b) => Date.parse(b.simulatedCreatedAt) - Date.parse(a.simulatedCreatedAt));
  const recent = visible.filter(activity => Date.parse(FOURSQUARE_F1_REFERENCE_NOW) - Date.parse(activity.simulatedCreatedAt) <= 3 * 60 * 60 * 1000);
  const earlier = visible.filter(activity => !recent.includes(activity));
  return <section className="foursquare-friends-feed" aria-label="Friends check-ins">
    <ActivityBucket title="Last 3 Hours" activities={recent} venues={venues} onOpenVenue={onOpenVenue} />
    <ActivityBucket title="Earlier" activities={earlier} venues={venues} onOpenVenue={onOpenVenue} />
  </section>;
}

function ActivityBucket({ title, activities, venues, onOpenVenue }: { title: string; activities: FoursquareCheckinActivity[]; venues: FoursquareVenue[]; onOpenVenue: (venueId: string) => void }) {
  if (!activities.length) return null;
  return <section><h2>{title}</h2>{activities.map(activity => {
    const friend = activity.friendId === "foursquare-mia" ? FOURSQUARE_F1_PERIPHERAL_PEOPLE[activity.friendId] : CORE_SOCIAL_CHARACTERS[activity.friendId];
    const venue = venues.find(item => item.id === activity.venueId);
    if (!friend || !venue) return null;
    return <button key={activity.id} type="button" className="foursquare-checkin-row" onClick={() => onOpenVenue(venue.id)}>
      <FoursquareAvatar identityId={friend.id} displayName={friend.displayName} />
      <span className="foursquare-checkin-copy"><span><strong>{friend.displayName}</strong> <b>@ {venue.name}</b></span><small>{venue.category} · {formatRelativeActivityTime(activity.simulatedCreatedAt)}</small>{activity.shout && <em>“{activity.shout}”</em>}</span>
      {activity.mayorStatus === "mayor" && <span className="foursquare-mayor-crown" aria-label="Mayor">♛</span>}
    </button>;
  })}</section>;
}

function PlacesRoot({ state, onOpen, scrollHost }: { state: FoursquareState; onOpen: (venueId: string, scrollPosition: number) => void; scrollHost: React.RefObject<HTMLDivElement | null> }) {
  return <section className="foursquare-places" data-fidelity-status="F2-pending">{state.venues.map(item => <VenueRow key={item.id} venue={item} checkedIn={Boolean(state.checkIns[item.id])} onOpen={() => onOpen(item.id, scrollHost.current?.scrollTop ?? state.rootScrollPositions.places)} />)}</section>;
}

function QuietRoot({ label }: { label: string }) { return <section className="foursquare-quiet-root" aria-label={label} />; }

function VenueDetail({ venue, state, identityName, dispatch }: { venue: FoursquareVenue; state: FoursquareState; identityName: string; dispatch: Dispatch<FoursquareEvent> }) {
  return <article className="foursquare-venue-detail" data-content-status={venue.contentStatus} data-fidelity-status="F2-pending"><header><strong>{venue.name}</strong><span>{venue.category} · {venue.distance}</span><address>{venue.address}</address></header><dl><div><dt>Mayor</dt><dd>{venue.mayor}</dd></div><div><dt>Points</dt><dd>{state.points}</dd></div></dl>
    {venue.tip && state.selectedTipId !== venue.tip.id && <button className="foursquare-tip-row" type="button" onClick={() => dispatch({ type: "OPEN_TIP", venueId: venue.id, tipId: venue.tip!.id })}>Tips <span>1</span></button>}
    {venue.tip && state.selectedTipId === venue.tip.id && <section className="foursquare-tip"><strong>Tip from {venue.tip.author}</strong><p>{venue.tip.text}</p><button type="button" onClick={() => dispatch({ type: "CLOSE_TIP" })}>Close</button></section>}
    {state.checkIns[venue.id] ? <section className="foursquare-checkin-confirmation" role="status"><strong>Checked in.</strong><span>{state.checkIns[venue.id].checkedInBy} earned {state.checkIns[venue.id].pointsAwarded} point.</span>{state.checkIns[venue.id].shout && <p>{state.checkIns[venue.id].shout}</p>}</section> : <form className="foursquare-checkin-form" onSubmit={event => { event.preventDefault(); dispatch({ type: "CHECK_IN", venueId: venue.id, checkedInBy: identityName, checkInTimestamp: Date.now() }); }}><label htmlFor={`foursquare-shout-${venue.id}`}>Shout (optional)</label><IOS4Textarea keyboardInputId={`foursquare-shout-${venue.id}`} id={`foursquare-shout-${venue.id}`} maxLength={140} value={state.shoutDrafts[venue.id] ?? ""} onValueChange={value => dispatch({ type: "EDIT_CHECK_IN_SHOUT", venueId: venue.id, value })} /><button className="foursquare-checkin-button" type="submit">Check In</button></form>}
  </article>;
}

function VenueRow({ venue, checkedIn, onOpen }: { venue: FoursquareVenue; checkedIn: boolean; onOpen: () => void }) { return <button type="button" className="foursquare-venue-row" onClick={onOpen} data-content-status={venue.contentStatus}><strong>{venue.name}</strong><span>{venue.category} · {venue.distance}</span><small>{checkedIn ? "Checked in" : venue.address}</small></button>; }

export function formatRelativeActivityTime(simulatedCreatedAt: string): string {
  const minutes = Math.max(0, Math.floor((Date.parse(FOURSQUARE_F1_REFERENCE_NOW) - Date.parse(simulatedCreatedAt)) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr${hours === 1 ? "" : "s"} ago`;
}
