# User Projection A-Issue Migration v0.1

## Governing principle

The internal content rule remains: "This is your 2010 phone. These are the kinds of friends you might have."

Pre-session content must not invent the user's mood, state, work, school, hobbies, relationships, party preference, location, or lifestyle. Session-created user content remains valid because the player authors it explicitly.

## Original Facebook violation

The Facebook seed Feed contained:

```text
owner-late
session-owner
Long day.
```

This was classified `A - USER PROJECTION VIOLATION` because it assigned authored speech and emotional/life context to the user before any user action.

## Original Twitter violation

The Twitter seed timeline contained:

```text
late-night-user
session-owner
can't sleep
```

This was classified `A - USER PROJECTION VIOLATION` because it assigned authored speech and a sleep state to the user before any user action.

## Final migration decisions

Both records were reassigned rather than removed so their existing density and chronological roles could remain intact.

| Surface | Old ID | New ID | Canonical owner | Copy | Decision |
| --- | --- | --- | --- | --- | --- |
| Facebook Feed | `owner-late` | `ben-long-day` | `ben` / Ben | `Long day.` | Reassigned to Ben because restrained end-of-day language fits his established working-adult context |
| Twitter Timeline | `late-night-user` | `late-night-matt` | `matt` / Matt | `can't sleep` | Reassigned to Matt because late-night activity and Twitter usage are established parts of his character |

Both migrated records are `CURATED` canonical friend content. Neither remains connected to `sessionIdentity` or a synthetic owner author. The now-unreachable Facebook and Twitter seed-time `session-owner` substitution branches were removed; session-created user content continues to use its separate existing paths.

## Seed order, count, and classification impact

- Facebook retains the same Feed count, `11:58 PM` timestamp, first-position ordering, `status` kind, and seed origin.
- Twitter retains the same timeline count, `11:41 PM` timestamp, ordering, `ordinary` classification, `CURATED` provenance, and seed origin.
- Twitter's existing Matt party reaction remains separate at `8:30 PM`; no timestamp collision was introduced.
- No live event, scheduler entry, or global timing value changed.

Facebook's ordered canonical Feed identity baseline now includes Ben before Alex, June, Katie, Jay, and Luca. Twitter classification counts do not change.

## Profile mapping impact

The old records no longer populate the session owner's Facebook Wall or Twitter timeline through name substitution. Ben and Matt retain canonical ownership after a new Hero session, regardless of the new session identity.

Profile navigation remains available. Empty pre-session owner content is valid; session-created posts and Tweets continue to populate owner surfaces through the existing user-origin paths.

The Twitter owner profile's designed baseline Tweet count remains separate from concrete seed records. This migration does not retain a fake owner Tweet to preserve that number and does not change the independent baseline-stat model.

## Updated assertions

Seed validation now checks:

- the ordered Facebook canonical Feed baseline includes `ben` / Ben
- `ben-long-day` remains owned by `ben` / Ben after session reset
- no Facebook seed item uses `owner-late` or `session-owner`
- `late-night-matt` remains owned by Matt after session reset
- no Twitter seed Tweet uses `late-night-user` or `session-owner`
- session-created user Tweets are still removed by a new-session reset through the existing assertion

Assertions remain exact and deterministic; no broad string fallback or unordered matching was introduced.

## Remaining user-projection HOLD items

The v0.1 projection audit's B-level items remain HOLD for a separate decision:

- Twitter owner baseline follower, Tweet, and favorite counts imply a designed prior social footprint.
- Twitter owner profile location `United States` is a personal profile default rather than merely device locale.
- Chris's `did you ever finish that thing?` mention weakly implies a prior obligation, although it remains deliberately vague.

No additional obvious A-level pre-authored owner record was found in the narrow surrounding seed audit. These B-level items were not silently rewritten in this migration.

## Boundaries preserved

This migration changes seed ownership and exact assertions only. It does not change scheduler architecture, global timing, runtime reducers, session reset behavior, historical assets, the canonical nine, or other narrative threads.
