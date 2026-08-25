# Foursquare Experience v0.1 — Vertical Slice

## Result

Foursquare now provides one complete, session-scoped interaction:

`Places → Venue → Check In → 1 point confirmation → Back`

It launches through the existing shared App Runtime. No production icon, geolocation permission, badge artwork, map, notification, or modern Foursquare/Swarm behavior was added.

Development access:

- `/?devApp=foursquare` exposes `DEV · Open Foursquare` outside the simulated iPhone in development builds.
- `/?devApp=foursquare&autoOpen=1` launches through the normal shared runtime when SpringBoard is available.
- Normal URLs contain no Foursquare entry or hidden production target.

## Historical scope

Foursquare 2.0 was released for iPhone on September 20, 2010. Contemporary reporting documents check-ins, Places, separate Tips and To-Dos, map views for friends/tips/to-dos, updated venue pages, and prominent links to the current mayor ([Yahoo/Engadget, September 20, 2010](https://sg.news.yahoo.com/2010-09-20-foursquare-app-gets-a-version-bump.html); [WebProNews, September 20, 2010](https://www.webpronews.com/the-new-foursquare-emerges-for-iphone/)). Period coverage describes Places as a nearby venue list and records the venue-level mayor, check-in counts, people, and Tips ([All About Symbian, September 27, 2010](https://allaboutsymbian.com/reviews/item/12148_Foursqaure.php); [Forbes, April 7, 2010](https://www.forbes.com/2010/04/07/iphone-mobile-android-technology-data-companies-10-foursquare_slide.html)). Foursquare also awarded points for check-ins, while mayorship depended on repeated visits rather than one arbitrary check-in ([2010 Foursquare presentation](https://aapa.files.cms-plus.com/SeminarPresentations/2010Seminars/2010PublicRelationsCommitteemeeting/Heather%20Campbell%20-%20Foursquare%20Social%20Media%20application.pdf); [TechCrunch, August 26, 2010](https://techcrunch.com/2010/08/26/foursquare-mayor-countdowns/)).

## State model

`foursquareState.ts` owns only Foursquare-local state:

- `currentView`
- `selectedVenueId`
- `scrollPosition`
- per-venue `checkInState`
- `points`
- minimal `mayorState`
- empty `earnedBadges`
- `selectedTipId`
- sparse venue records

The current user's display identity is read from `sessionIdentity.name` for check-in confirmation. It is not copied into a second identity store.

## Venue and narrative data

The sparse venue list contains an ordinary cafe, diner, bookstore, and park. Venue names, addresses, mayors, and the single June Tip are project-authored `HOLD-fictional` narrative data; they are not claimed as historical real-world venue records.

The selected venue detail may show:

- name
- category
- address
- distance
- current mayor
- one period-style Tip
- Check In action

It intentionally omits ratings, recommendations, modern cards, maps, and fabricated imagery.

## Check-in flow

1. Opening a place records the current Places scroll position.
2. The first Check In for that venue sets its state to `checkedIn`.
3. The application adds exactly one point and shows a confirmation using the session identity.
4. Repeating Check In cannot add another point because the action is replaced by the confirmation state.
5. Back returns to Places and restores its previous scroll position.

State remains mounted across Home suspension, lock/sleep, app switching, and reopen. The existing terminal session reset clears venue selection, scroll, check-ins, and points before a new Hero session.

## Points, mayor, badges, Tips and To-Dos

| Area | Classification | Decision |
| --- | --- | --- |
| Check-in action | READY at behavioral level | Central period behavior supported by contemporary evidence. |
| Points after check-in | READY concept / HOLD exact scoring | `+1 point` is a deterministic functional approximation, not an exact historical scoring claim. |
| Current mayor display | READY concept | Period venue pages exposed the mayor. Fictional mayor identities remain narrative HOLD. |
| Become mayor | HOLD | One check-in never grants mayorship in v0.1. |
| Tip | READY concept / HOLD content | One shallow Tip is shown; its text is project-authored. |
| To-Dos | READY historically / HOLD implementation | Verified in Foursquare 2.0 but not implemented in this slice. |
| Badges | READY historically / HOLD implementation | State remains empty; no badge logic or artwork was fabricated. |

## Visual evidence classification

| Item | Classification |
| --- | --- |
| 2010 Places/venue/check-in hierarchy | READY at behavioral level |
| Exact Foursquare 2.0 navigation and chrome | HOLD / C-polish |
| Exact fonts, gradients, separators, and pixel geometry | HOLD / C-polish |
| Period Foursquare icon | HOLD; no production icon added |
| Badge, map, venue and profile artwork | HOLD; none generated |
| Swarm branding and modern City Guide recommendation UI | REJECT |

## Bugs

### A — Architecture / blocker

None found. The feature uses the shared App Runtime and session lifecycle.

### B — Functional

None remaining in deterministic reducer/build validation. First check-in, duplicate prevention, point persistence, Back restoration, and RESET passed.

### C — Backlog

- Exact Foursquare 2.0 chrome and icon provenance
- Maps and location-backed venue discovery
- Exact scoring rules and confirmation wording
- Badge and profile artwork
- To-Dos and expanded Tips
- Friends/recent check-ins
- Typography, gradients, geometry, and animation timing

## Isolation and validation

- `npm run build`: PASS
- `git diff --check`: PASS
- Foursquare reducer regression: PASS
- Shared App Runtime launch/suspend/resume regression: PASS
- Frozen Messages, Twitter, Facebook, and Instagram state/container files: unchanged
- No scheduler, lock notification, badge-global, camera, audio, battery, Folder, or global-clock behavior changed
- No historical assets added or modified

Manual browser interaction has not been claimed and remains required before a Foursquare functional freeze.
