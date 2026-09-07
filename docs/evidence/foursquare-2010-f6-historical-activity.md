# Foursquare F6 Historical Activity Contract

## Status and scope

F6a defines a data contract and pure derivation layer only. It creates no NPC
check-ins and changes no visible Foursquare surface.

Historical NPC records authored in later F6 phases are **PROJECT-CURATED
FICTION** inside a historically reconstructed Foursquare system. This content
classification is separate from confidence classifications for historical UI
evidence.

## Canonical window

- Start: `2010-08-22T00:00:00-07:00`
- End: `2010-10-20T00:02:00-07:00`
- Time zone: `America/Los_Angeles`
- Timestamp format: `YYYY-MM-DDTHH:mm:ss-07:00`

The window is complete-for-game-window context, not lifetime account history.
Authored timestamps remain canonical narrative data; epoch values are derived
only for deterministic validation and sorting.

The inclusive Pacific local-date span is 60 dates, from August 22 through
October 20. `lifetimeHistoryComplete` remains `false`, and player history
remains `UNKNOWN`, not zero.

## Identity and player boundary

The historical layer accepts only `alex`, `katie`, `june`, `luca`, and `mia`.
The session player has no historical record or completeness entry. Unknown
player history is not zero history and cannot establish a first visit, lifetime
count, historical badge, or historical mayorship.

## Venue boundary

New historical records may reference only:

- `main-street-diner`
- `riverside-park`
- `downtown-coffee`
- `community-courts`
- `westside-library`
- `gelato-roma`

Night Owl remains a legacy Tip/realtime dependency and Cedar Books remains a
legacy Mia dependency. Neither is canonicalized or eligible for F6 historical
records.

## Game validity

Validity is explicit per record. `validForGameMechanics: true` requires
`PROJECT-RECONSTRUCTED-VALID`; `false` requires `NARRATIVE-ONLY`. Validity is
never inferred from visibility, category, shout, character, or venue status.
A valid fictional record is project evidence for reconstructed mechanics, not
recovered GPS evidence.

## Completeness

`complete-for-game-window` means every project-canonical check-in for that NPC
inside the F6 window is represented. It does not mean complete movement,
lifetime account history, pre-window history, Newbie eligibility, or lifetime
unique-venue coverage.

`display-selected` means editorially selected records that cannot support a
complete mechanics dataset. `lifetimeHistoryComplete` is locked to `false`.
Later phases intend complete-for-game-window histories for Alex, Katie, June,
and Luca, and display-selected history for Mia. F6a publishes no completeness
entries because no character history has been authored yet.

## Determinism and derivation

IDs follow `foursquare-history-{character}-{YYYY-MM-DD}-{venue}`, with a stable
lowercase suffix when disambiguation is required. Random UUIDs and array-index
IDs are rejected. Canonical helper output sorts oldest-first by parsed timestamp
and then record ID without mutating authored arrays.

Pacific local dates are derived by strict ISO validation, epoch parsing, and
`America/Los_Angeles` formatting. A visit-day fact is the combination of NPC,
venue, and Pacific local date. Only game-valid records contribute; repeated
same-day visits collapse to one date while different dates remain distinct.

## Domain separation

- Historical: pre-T0 `FoursquareHistoricalCheckin[]` authored in later F6 phases.
- Friends feed projection: an explicit future list of selected historical IDs; empty in F6a.
- Realtime: scheduler-owned T+offset events such as June at Night Owl at T+510.

Historical records never create realtime events automatically, and realtime
events are never copied into historical storage. Current Friends feed records
are not migrated by F6a.

## Explicit exclusions

F6a derives no badge, mayor, incumbent, crown, player gap, or leaderboard fact.
Historical record count is independent from the existing F3 leaderboard. F3,
F4, Profile, Venue, Result, Friends feed, and scheduler behavior remain unchanged.

## F6b: Alex historical activity

F6b authors exactly 15 Alex historical check-ins, stored oldest-first from
August 22 through October 19, 2010. Every record is `seed`,
`PROJECT-CURATED-FICTION`, and `PROJECT-RECONSTRUCTED-VALID`, and every record
is valid for game mechanics.

The approved venue distribution is Riverside Park 4, Downtown Coffee 4, Main
Street Diner 3, Community Courts 2, Westside Library 1, and Gelato Roma 1. The
month distribution is August 2, September 7, and October 1-19 6. Exactly three
records contain shouts: `Needed coffee.`, `Food then home.`, and `Evening walk
with the dogs.`

The fixed Alex Riverside Park record remains
`2010-10-19T20:41:00-07:00` with the shout `Evening walk with the dogs.` The
legacy F1 source row remains temporarily present and must agree on character,
venue, timestamp, and shout. Historical Friends-feed projection remains empty,
so this duplicate source representation does not create a second visible row.

The existing Facebook Riverside Park check-in at
`2010-10-19T21:36:00-07:00` remains separate and unchanged. F6b does not author
a second Foursquare record at that time.

Alex alone is declared `complete-for-game-window` for the locked F6 window,
with coverage for rolling visit days, weekly repeat visits, consecutive nights,
and same-night stops. This is not lifetime completeness;
`lifetimeHistoryComplete` remains `false`. No other character receives a
completeness declaration.

F6b does not add badge ownership, mayorship ownership, leaderboard state,
player history, UI projection, runtime events, scheduler behavior, or new
venues.

## F6c: Katie historical activity

F6c adds exactly 13 Katie historical check-ins from August 24 through October
19, 2010. The venue distribution is Westside Library 4, Riverside Park 3,
Gelato Roma 3, Main Street Diner 2, and Downtown Coffee 1. The month
distribution is August 2, September 6, and October 1-19 5.

All 13 records are `seed`, `PROJECT-CURATED-FICTION`,
`PROJECT-RECONSTRUCTED-VALID`, and game-valid. School-day activity is placed
after school or in the early evening; weekend activity is daytime or early
evening. This keeps Katie's movement local, repetitive, and age-appropriate
rather than presenting her as an adult power user. Exactly two records contain
shouts: `Finally done studying.` and `Getting gelato :)`.

The fixed Katie Riverside Park record remains
`2010-10-19T17:18:00-07:00` with no shout. Its historical and legacy F1 source
representations must agree while historical Friends-feed projection remains
empty. The separate Facebook Westside Library check-in at 20:14 remains
unchanged; the 2-hour-56-minute same-day gap is plausible and does not create a
matching Foursquare record.

Katie is `complete-for-game-window` for the locked F6 window, with the same four
mechanics coverage dimensions as Alex and `lifetimeHistoryComplete: false`.
June, Luca, Mia, and the player receive no completeness entry in F6c.

Repeated visits do not establish badge ownership, mayorship, an incumbent, or
a leaderboard result. F6c does not change Friends-feed projection, F3/F4,
runtime, scheduler, UI, or venue definitions. Alex's F6b records and
completeness remain unchanged.

## F6d: June, Luca, and Mia supporting history

June receives six game-valid, `PROJECT-CURATED-FICTION` records from September
3 through October 19: Main Street Diner 2, Downtown Coffee 2, Riverside Park 1,
and Gelato Roma 1. Her only shout is `Late dinner.` June is
`complete-for-game-window` with all four mechanics coverage dimensions and
`lifetimeHistoryComplete: false`.

Night Owl remains excluded from historical activity. The June Main Street row
at `2010-10-19T22:52:00-07:00` is valid pre-T0 history and remains visible with
the shout `Late dinner.` The matching historical record is the preferred future
Friends-feed projection candidate
`foursquare-history-june-2010-10-19-main-street-diner`. It is not projected in
F6d. The former 21:12 replacement artifact has been removed from June's
canonical six-record set.

Luca receives five game-valid, `PROJECT-CURATED-FICTION` records from September
5 through October 19: Community Courts 2, Main Street Diner 1, Riverside Park
1, and Gelato Roma 1. His only shout is `One more game.` Luca is
`complete-for-game-window` with all four mechanics coverage dimensions and
`lifetimeHistoryComplete: false`.

Luca's sole Main Street Foursquare record preserves the legacy F1 timestamp
`2010-10-19T15:06:00-07:00` and remains separate from his Facebook Main Street
check-in at 21:44. Employment establishes venue familiarity but does not imply
check-ins, repeated work-shift activity, or mayorship.

Mia receives no canonical F6 historical record and no completeness entry. Her
legacy Cedar Books row at 20:42 remains visible, unresolved, and
display-selected in the broader product sense; Cedar is still noncanonical and
HOLD. This conservative absence avoids claiming that the legacy row is a
canonical or complete historical dataset.

F6d keeps historical Friends-feed projection empty and derives no badge,
mayorship, incumbent, candidate, unlock, leaderboard, or player-history fact.
Alex and Katie records and completeness remain unchanged; F3/F4, runtime,
scheduler, UI, and venue definitions are unaffected.

Night Owl remains realtime-only at T+510. Mia/Cedar remains HOLD and is not
promoted into canonical historical activity.

## F6e: Friends-feed projection and historical facts

F6e populates the Friends-feed projection with exactly four canonical
historical IDs: June at Main Street Diner, Alex at Riverside Park, Katie at
Riverside Park, and Luca at Main Street Diner. Their former F1 duplicate seed
objects are removed; the adapter derives character, venue, timestamp, and shout
directly from each historical record. Visible output and recency order remain
June, Mia, Alex, Katie, Luca.

Mia at Cedar Books remains the sole deliberate legacy Friends-feed exception
because Cedar is noncanonical and HOLD. Night Owl remains outside historical
projection and storage; June's T+510 check-in continues as scheduler-driven
realtime activity.

The pure historical-facts layer derives record count, valid-record count,
unique canonical venues, unique valid visit days, visit days by venue,
Sunday-start Pacific calendar-week repeats, consecutive-night runs, and
same-night distinct-stop maxima. Alex derives 15 records / 6 venues / 15 valid
visit days; Katie 13 / 5 / 13; June 6 / 4 / 6; Luca 5 / 4 / 5. Mia has no
canonical complete mechanics dataset, and the player remains absent.

Completeness permits exhaustive in-window conclusions only for the four stated
coverage dimensions. It does not establish lifetime history, Newbie status,
badge ownership or eligibility, mayorship, an incumbent, competitor ranking,
or leaderboard score. F6e provides facts, not achievements.

## F6f: Eligibility audit and F6 closure

Status: `COMPLETE`

F6f closes the historical-activity phase with an eligibility and evidence
audit. It does not assign badge ownership, badge unlocks, mayorships, crowns,
progress, Profile counts, or result rewards.

### Complete NPC facts

| Identity | Records | Unique venues | Valid visit-days |
| --- | ---: | ---: | ---: |
| Alex | 15 | 6 | 15 |
| Katie | 13 | 5 | 13 |
| June | 6 | 4 | 6 |
| Luca | 5 | 4 | 5 |

Mia has no canonical complete F6 dataset. The player's prior Foursquare history
remains `UNKNOWN`.

### Window completeness boundary

`complete-for-game-window` is exhaustive only from
`2010-08-22T00:00:00-07:00` through
`2010-10-20T00:02:00-07:00`, and only for rolling visit-days, weekly repeat
visits, consecutive nights, and same-night distinct stops.

It does not establish lifetime account history, a first-ever check-in, lifetime
unique venues, historical badge ownership, or a lifetime mayorship portfolio.

### Badge eligibility and ownership

`KNOWN_WINDOW_NOT_ELIGIBLE` is not equivalent to
`LIFETIME_OWNERSHIP_UNKNOWN`.

- Newbie remains `HOLD` for every identity because lifetime first-check-in
  history is unavailable.
- Adventurer, Explorer, and Superstar thresholds are not established by the
  known F6-window venue counts. Lifetime ownership remains `UNKNOWN`.
- Katie has only two qualifying Westside Library visit-days in the relevant
  project week: `2010-09-26` and `2010-10-01`. No known F6 record set
  reaches the candidate three-visit Local threshold, and exact historical
  week-boundary semantics remain `HOLD`.
- The maximum known consecutive-night run is 1 for Alex, Katie, June, and Luca,
  so the known window does not reach the candidate Bender threshold.
- The maximum known same-night distinct-stop count is 1 for each complete NPC,
  so the known window does not reach the candidate Crunked threshold.
- Super Mayor cannot be established without authoritative concurrent
  mayorship snapshots.

None of these findings creates or populates `ownedBadgeIds`.

### Player boundary

`UNKNOWN prior player history != zero prior history`.

Newbie therefore cannot be truthfully awarded. Adventurer, Explorer, and
Superstar are impossible in the current four-venue session slice; Local is
impossible under the one-check-in-per-venue reducer; and Bender is impossible
in 15 minutes. Crunked is not awarded despite the theoretical four-stop count
because mobility and authentic qualification are unsupported. Super Mayor
cannot be established. Existing base `+1` check-in scoring remains
independent.

### Mayorship visit-day facts

| Venue | Alex | Katie | June | Luca |
| --- | ---: | ---: | ---: | ---: |
| Main Street Diner | 3 | 2 | 2 | 1 |
| Riverside Park | 4 | 3 | 1 | 1 |
| Downtown Coffee | 4 | 1 | 2 | 0 |
| Community Courts | 2 | 0 | 0 | 2 |
| Westside Library | 1 | 4 | 0 | 0 |
| Gelato Roma | 1 | 3 | 1 | 1 |

The highest project-NPC visit count is not a historical Foursquare mayor.
External users and incumbents are absent. `PROJECT_NPC_LEADER` is an internal
analytical term only and must not appear in runtime UI.

### Legacy mayor rejection

| Venue | Legacy identity | Classification |
| --- | --- | --- |
| Main Street Diner | Jack | `LEGACY / HOLD-FICTIONAL / NOT UI-ELIGIBLE` |
| Riverside Park | Eli | `LEGACY / HOLD-FICTIONAL / NOT UI-ELIGIBLE` |
| Night Owl | June | `LEGACY / HOLD-FICTIONAL / NOT UI-ELIGIBLE` |
| Cedar Books | Mia | `LEGACY / HOLD-FICTIONAL / NOT UI-ELIGIBLE` |

These strings remain disconnected from runtime UI.

### F4 handoff

F4 remains `HYBRID / HOLD`. Empty conditional architecture may remain, but
visible ownership surfaces stay deferred:

- Profile shows no badge count, mayorship count, or badge gallery.
- Venue shows no mayor identity, crown, countdown, or `No mayor` copy.
- Result keeps `badgeIdsUnlocked: []` and `mayorshipChange: null`.

This suppression is intentional and evidence-backed. No
`FoursquareMayorshipSnapshot[]` should be authored without a concrete
narrative need.

F6 is complete because it delivered bounded NPC historical reconstruction,
completeness metadata, Friends-feed projection, raw mechanics facts, and the
eligibility audit. It does not need a lifetime-history baseline, external
competitor population, or mayorship snapshots. Adding those solely to force
visible game identity would over-fictionalize the experience. All unresolved
badge and mayorship ownership transfers to `F4 / HOLD`.
