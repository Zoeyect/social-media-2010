# Foursquare F6 Historical Activity Contract

## Status and scope

F6a defines a data contract and pure derivation layer only. It creates no NPC
check-ins and changes no visible Foursquare surface.

Historical NPC records authored in later F6 phases are **PROJECT-CURATED
FICTION** inside a historically reconstructed Foursquare system. This content
classification is separate from confidence classifications for historical UI
evidence.

## Canonical window

- Start: `2010-08-21T00:00:00-07:00`
- End: `2010-10-19T22:02:00-07:00`
- Time zone: `America/Los_Angeles`
- Timestamp format: `YYYY-MM-DDTHH:mm:ss-07:00`

The window is complete-for-game-window context, not lifetime account history.
Authored timestamps remain canonical narrative data; epoch values are derived
only for deterministic validation and sorting.

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
