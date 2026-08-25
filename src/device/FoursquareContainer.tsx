import { Dispatch, useLayoutEffect, useRef } from "react";
import { FoursquareEvent, FoursquareState, FoursquareVenue } from "../state/foursquareState";
import { useSessionIdentity } from "../state/sessionIdentity";

type FoursquareContainerProps = {
  state: FoursquareState;
  dispatch: Dispatch<FoursquareEvent>;
};

export function FoursquareContainer({ state, dispatch }: FoursquareContainerProps) {
  const identity = useSessionIdentity();
  const placesRef = useRef<HTMLDivElement>(null);
  const venue = state.venues.find(candidate => candidate.id === state.selectedVenueId) ?? null;

  useLayoutEffect(() => {
    if (state.currentView !== "places" || !placesRef.current) return;
    placesRef.current.scrollTop = state.scrollPosition;
  }, [state.currentView, state.scrollPosition]);

  return <section className="foursquare-container" aria-label="Foursquare" data-chrome-status="HOLD">
    <header className="foursquare-navigation-bar">
      {state.currentView === "venue" && <button type="button" onClick={() => dispatch({ type: "SHOW_PLACES" })}>Places</button>}
      <strong>{state.currentView === "places" ? "Places" : venue?.name ?? "Venue"}</strong>
      <span>{state.points} pt</span>
    </header>

    {state.currentView === "places" && <div
      ref={placesRef}
      className="foursquare-places"
      onScroll={event => dispatch({ type: "SET_SCROLL_POSITION", scrollPosition: event.currentTarget.scrollTop })}
    >
      {state.venues.map(item => <VenueRow
        key={item.id}
        venue={item}
        checkedIn={state.checkInState[item.id] === "checkedIn"}
        onOpen={() => dispatch({ type: "OPEN_VENUE", venueId: item.id, scrollPosition: placesRef.current?.scrollTop ?? state.scrollPosition })}
      />)}
    </div>}

    {state.currentView === "venue" && venue && <article className="foursquare-venue-detail" data-content-status={venue.contentStatus}>
      <header>
        <strong>{venue.name}</strong>
        <span>{venue.category} · {venue.distance}</span>
        <address>{venue.address}</address>
      </header>
      <dl>
        <div><dt>Mayor</dt><dd>{venue.mayor}</dd></div>
        <div><dt>Points</dt><dd>{state.points}</dd></div>
      </dl>
      {venue.tip && <section className="foursquare-tip"><strong>Tip from {venue.tip.author}</strong><p>{venue.tip.text}</p></section>}
      {state.checkInState[venue.id] === "checkedIn"
        ? <section className="foursquare-checkin-confirmation" role="status"><strong>Checked in.</strong><span>{identity.name} earned 1 point.</span></section>
        : <button className="foursquare-checkin-button" type="button" onClick={() => dispatch({ type: "CHECK_IN", venueId: venue.id })}>Check In</button>}
    </article>}
  </section>;
}

function VenueRow({ venue, checkedIn, onOpen }: { venue: FoursquareVenue; checkedIn: boolean; onOpen: () => void }) {
  return <button type="button" className="foursquare-venue-row" onClick={onOpen} data-content-status={venue.contentStatus}>
    <strong>{venue.name}</strong>
    <span>{venue.category} · {venue.distance}</span>
    <small>{checkedIn ? "Checked in" : venue.address}</small>
  </button>;
}
