# Foursquare 2010 F4 - Badges / Mayorships / Profile Game Identity Closure

Status: `EVIDENCE + INVARIANT CLOSURE`  
Target: Foursquare for iPhone 2.0, iPhone 4 / iOS 4.1  
Experience date: 2010-10-20
Runtime implementation: `HOLD pending F6 historical activity`

## Locked product verdict

Before F6 establishes historically scoped NPC check-in activity, the runtime must not render or assign:

- badge ownership, unlocks, counts, galleries, or player eligibility
- mayorship ownership, counts, venue identity, progress, or player eligibility

The current absence means `UNKNOWN / INSUFFICIENT HISTORICAL DATA`. It does not mean confirmed zero ownership.

## Historical evidence closure

### Profile game identity

Classification: `B - PROBABLE`

Contemporary March 2010 iPhone coverage shows that Foursquare introduced a self Profile view and exposed badge and mayorship counts on user profiles. Contemporary September 2010 coverage confirms that Foursquare 2.0 revised the Profile interface. This establishes Profile as the correct future owner of badge and mayorship identity, but does not establish the exact target-version route hierarchy, empty-state copy, or badge-detail anatomy.

Sources:

- The Next Web, 2010-03-06: https://thenextweb.com/news/foursquare-redesign-side-side-comparison
- TechCrunch, 2010-03-05: https://techcrunch.com/2010/03/05/new-foursquare-iphone/
- iPhon.fr, 2010-10-14: https://www.iphon.fr/post/2010-10-13-be-the-mayor-lance-son-application-iphone-ipod-touch

Decision: preserve the current Profile identity block and `Leaderboard` row. Do not render `Badges 0`, `Mayorships 0`, a badge gallery, or a mayor list.

### Badge candidates

Classification: `B - PROBABLE` for period availability and commonly recorded rules; ownership remains `UNKNOWN`.

| Badge | Period rule recorded by contemporary sources | F4 disposition |
| --- | --- | --- |
| Newbie | first check-in | `HOLD`; prior player account history is unknown |
| Adventurer | 10 different venues | `HOLD`; no historical unique-venue total |
| Explorer | 25 different venues | `HOLD`; no historical unique-venue total |
| Superstar | 50 different venues | `HOLD`; no historical unique-venue total |
| Bender | 4 or more nights in a row | `HOLD`; no cross-day history |
| Crunked | 4 or more stops in one night | `HOLD`; no validated historical sequence |
| Local | same place 3 times in one week | `HOLD`; no weekly venue history |
| Super Mayor | 10 simultaneous mayorships | `HOLD`; no historical mayorship snapshot |

Source: contemporary badge inventory, current as of November 2010: https://tonyfelice.wordpress.com/foursquare/

Badge ownership and badge unlock rules are separate domains. Future seeded `ownedBadgeIds` must be derived from F6 history or separately approved canon. Future session-time `newlyUnlockedBadgeIds` must be produced by an independently evidenced rule evaluation. Neither may be inferred from personality, leaderboard points, or an empty runtime array.

### Mayorship mechanics

Classification: `A - CONFIRMED` for the broad period mechanic; exact unresolved edge cases remain `UNKNOWN`.

Contemporary reporting quotes Foursquare's August 2010 explanation: mayorship compared valid visit days over the previous 60 days, and only one check-in per day counted. The check-in confirmation could report how many days remained when a user was within ten check-ins of the mayor. Foursquare also used location-validity checks when deciding whether a check-in earned points, badges, mayorships, or specials.

Sources:

- TechCrunch, 2010-08-26: https://techcrunch.com/2010/08/26/foursquare-mayor-countdowns/
- TechCrunch, 2010-04-07: https://techcrunch.com/2010/04/07/foursquare-starts-to-enforce-the-rules-cracks-down-on-fake-check-ins/

Decision: never implement `most session check-ins wins`. The current one-check-in-per-venue session cannot establish a player mayorship truthfully.

## Player-history boundary

The session player's pre-experience Foursquare biography is intentionally unspecified.

`UNKNOWN prior player history != zero prior history`.

Therefore an empty current state must not imply Newbie eligibility, zero historical badges or mayorships, a first-ever venue visit, or a previous check-in count of zero. F6 must not invent player history to satisfy a badge or mayorship rule. Dynamic player badge and mayor acquisition remains disabled.

## NPC history dependency

F6 may create historically scoped check-in histories for Alex, Katie, June, Luca, Mia, and other separately approved fictional characters. Those histories may later support seeded badge ownership, incumbent mayorship, and venue competition context.

Character history must not be reverse-engineered from a desired badge or mayor outcome. Current activity items are individual observations, not sufficient visit-frequency histories.

Explicit invariant: Luca working at Main Street Diner does not imply that Luca is its Foursquare mayor. Narrative or physical presence and Foursquare visit-day competition are separate data domains.

## Legacy mayor quarantine

| Venue | Legacy string | Classification |
| --- | --- | --- |
| Night Owl Cafe | June | `LEGACY / HOLD-FICTIONAL` |
| Main Street Diner | Jack | `LEGACY / HOLD-FICTIONAL` |
| Cedar Books | Mia | `LEGACY / HOLD-FICTIONAL` |
| Riverside Park | Eli | `LEGACY / HOLD-FICTIONAL` |

These strings are not canonical mayor state and are not UI-eligible. The venue adapter must continue to omit them. They must not be reconnected, deleted, or migrated during F4 closure; cleanup belongs to a coordinated F6 historical-data migration.

## Runtime absence invariants

### Profile

Keep only the player avatar and name plus the `Leaderboard` disclosure row. No badge count, mayorship count, badge gallery, or mayor list may be rendered.

### Venue

No current-mayor identity, `No mayor yet` copy, crown, visit count, or mayor progress may be rendered. Legacy mayor strings must remain outside the venue view model.

### Check-in result

Preserve the F3c conditional result contract:

- `badgeIdsUnlocked = []` renders no badge section
- `mayorshipChange = null` renders no mayor section

No placeholder section may be introduced. A successful session check-in must not unlock Newbie or acquire a mayorship.

## Future model boundary

Future work may separate seeded historical ownership (`ownedBadgeIds`, `mayorshipsByVenue`) from session-time events (`newlyUnlockedBadgeIds`, `mayorshipProgress`). Do not add these models until F6 requires them and supplies the historical inputs.

## Locked dependency order

1. F4 evidence and invariant closure.
2. F6 NPC historical activity reconstruction.
3. Audit the badge and mayor facts derived from that history.
4. Implement later F4-visible Profile, Venue, and Result surfaces.

F6 must preserve the intentionally unknown player biography.
