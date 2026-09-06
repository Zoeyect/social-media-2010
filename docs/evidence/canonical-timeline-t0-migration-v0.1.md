# Canonical Timeline T0 Migration v0.1

## Status and authority

`RUNTIME UPDATED BY v0.2 / HISTORICAL DECISIONS PRESERVED`

This record supersedes app-local or project-local runtime assumptions that
conflict with the locked cross-app timeline.

| State | Runtime |
| --- | --- |
| OLD runtime state (superseded) | October 19 evening session |
| LOCKED canonical T0 | `2010-10-20T00:02:00-07:00` |
| LOCKED runtime end (start + 900000 ms) | `2010-10-20T00:17:00-07:00` |
| Time zone | `America/Los_Angeles` |
| Duration | 15 minutes |

The migration was coordinated cross-app because Facebook, Twitter, Instagram,
Foursquare, SMS, Tumblr, device chrome, and notifications form one narrative
runtime. Apps cannot own independent canonical clocks. Scheduler offsets and
event order remained frozen; absolute runtime duplicates now derive from the
master timeline.

## Historical content versus runtime

Static narrative records were not blindly shifted. Each record was classified
as historical content or a scheduler-derived runtime event. The retimings below
are **PROJECT CANON decisions**, not claims about externally sourced historical
facts. Independently fixed dates, including the Oct 18 band performance and the
Oct 20 Apple Back to the Mac event, remain unchanged.

## Approved D01-D29 decisions

| Decision | Record | Canonical project time |
| --- | --- | --- |
| D01 | Facebook `ben-long-day` | Oct 19 9:58 PM |
| D02 | Facebook `mike-anil-question` | Oct 19 9:54 PM |
| D03 | Facebook `june-show-photos-oct19` | Oct 19 9:51 PM |
| D04 | Facebook `jack-movie` | Oct 19 9:52 PM |
| D05 | Facebook `alex-jacks-party-friday` | Oct 19 9:47 PM |
| D06 | Facebook `katie-coffee` | Oct 19 9:41 PM |
| D07 | Facebook `jay-reading` | Oct 19 9:33 PM |
| D08 | Facebook `luca-pickup-basketball-photos` | Oct 19 9:28 PM |
| D09 | Facebook `luca-profile-picture-current` | Oct 19 8:00 PM |
| D10 | Facebook `luca-main-street-diner-checkin` | Oct 19 9:44 PM |
| D11 | Twitter `still-awake` | Oct 19 9:58 PM |
| D12 | Twitter `manual-rt-kanye-album-cover` | Oct 19 9:53 PM |
| D13 | Twitter `dana-office-deck` | Oct 19 9:49 PM |
| D14 | Twitter `late-night-matt` | Oct 19 9:41 PM |
| D15 | Twitter `kanye-discussion` | Oct 19 9:26 PM |
| D16 | Twitter `marcus-client-approved` | Oct 19 9:09 PM |
| D17 | Twitter `manual-rt-conan-fan-question` | Oct 19 9:03 PM |
| D18 | Twitter `apple-event` | Oct 19 9:47 PM |
| D19 | Twitter `priya-file-typo` | Oct 19 9:22 PM |
| D20 | Twitter `class-tomorrow` | Oct 19 9:05 PM |
| D21 | Twitter mention `mention-alex-conan` | Oct 19 9:54 PM |
| D22 | Twitter mention `mention-chris-thing` | Oct 19 9:38 PM |
| D23 | Twitter DM `dm-katie` | Oct 19 9:46 PM |
| D24 | Twitter DM `dm-matt` | Oct 19 9:21 PM |
| D25 | Facebook inbox `katie-tomorrow` | Oct 19 9:14 PM; copy remains `see you tomorrow` |
| D26 | Instagram `june-ig-04` | Oct 19 10:00 PM (historical; unchanged) |
| D27 | Facebook check-in `ben-coffee-checkin` | Oct 19 9:12 PM |
| D28 | Facebook check-in `luca-diner-checkin` | Oct 19 9:44 PM |
| D29 | Facebook check-in `chris-courts-checkin` | Oct 19 9:48 PM |

## Locked narrative invariants

- IG04 is published at `2010-10-19T22:00:00-07:00`, historical and unchanged, and is visible at startup.
- IG04 deletion remains T+200 (`00:05:20`); replacement remains T+210 (`00:05:30`).
- The actual replacement identity remains `june-ig-01`; IG05/IG06 are not runtime IDs.
- The Apple tweet remains at Oct 19 9:47 PM and truthfully describes the fixed Oct 20 Apple event as `tomorrow morning`.
- Tumblr remains T+630 (`00:12:30`), title `Late watch`, content `The city gets quieter this late.`
- Foursquare Night Owl remains scheduler-gated at T+510 (`00:10:30`).
- `june-main-street-diner` remains at Oct 19 22:52 with `visible:false`: **QUARANTINED**, invalid as initial Friends-feed history, pending F6d replacement.

## Data integrity and implementation rules

- Facebook and Twitter static narrative records use the approved retimings; live records remain scheduler-gated and chronologically ordered.
- Parent stories, albums, and shared-media publications move atomically. June show media aligns at 21:51, Luca basketball media at 21:28, Luca profile media at 20:00, and IG04 media at 22:00.
- Public Twitter fixtures derive from the shared canonical base rather than an independent date.
- The former Foursquare reference-now is retired as an independent clock and aliases `SESSION_START_ISO`.
- Facebook explicit ISO timestamps preserve their dates. Clock-only parsing derives the date from a supplied master reference and fails without one rather than guessing a stale date.
- No initially visible static content may be after T0. Runtime content after T0 must be delivered through the scheduler.

## F6 future historical window

The future F6 seed window is:

- start: `2010-08-21T00:00:00-07:00`
- end: `2010-10-19T22:02:00-07:00`
- meaning: complete game-window boundary, **not** lifetime account history

No F6 NPC history is created by this migration. Player prior history remains
`UNKNOWN`, not zero; no player history, badge unlock, or mayorship is inferred.
