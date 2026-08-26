# June Accidental Instagram Post Narrative v0.6

## Status

`FUNCTIONALLY COMPLETE`

`MANUAL VISUAL CONFIRMATION PENDING`

Character behavior remains governed by `docs/CHARACTER_BIBLE_v1.0.md`. This thread is optional and missable, does not establish a June/Jack romance, and does not define the user's relationship with either character.

## Locked photo chronology

| Logical ID | Timestamp | Role | Session-start state |
| --- | --- | --- | --- |
| `june-ig-02` | 2010-10-15 | June dancing / nightclub | Visible seed post |
| `june-ig-03` | 2010-10-16 | June at a party | Visible seed post |
| `june-ig-04` | 2010-10-20 00:00 PDT | Accidental intimate June/Jack photo | Visible seed post |
| `june-ig-01` | 2010-10-20 approximately 00:05:30 PDT | Normal replacement photo | Hidden until T+210 |

IG04 predates the simulation's 00:02 start. It is never created by a live event and can be discovered immediately through June's profile. All four records resolve existing square assets through the shared character media registry.

## June Instagram social baseline

June's account uses deterministic `CURATED DISPLAY` values:

- Followers: 118
- Following: 236
- Posts: derived from the currently visible June media records

The initial three-post chronology therefore displays Posts 3, falls to Posts 2 when IG04 is deleted at T+200, and returns to Posts 3 when IG01 appears at T+210. Following exceeding Followers reflects active friend migration from June's established offline/Facebook social circle, not influencer or celebrity status. June receives no random or live follower drift.

June's Profile rendering is aligned to the evidenced Instagram 1.0-era structure: `junepark` navigation title, dark summary header, square avatar, blue Photos/Followers/Following blocks, and a vertical newest-first photo stream. Profile grid and biography UI are rejected for the October 20, 2010 target date. Exact other-user relationship control chrome, texture raster and timestamp typography remain HOLD.

## Runtime timing

| Elapsed | Device time | Stable event ID | Outcome |
| --- | --- | --- | --- |
| T+60 s | 12:03 AM | `facebook-june-instagram-announcement` | June posts `finally got instagram lol @junepark` |
| T+120 s | 12:04 AM | `facebook-june-jack-gossip-katie` | Katie comments `june + jack???` |
| T+145 s | 12:04:25 AM | `facebook-june-jack-gossip-chris` | Chris comments `lol no way` |
| T+155 s | 12:04:35 AM | `facebook-katie-jack-gossip-message` | Katie sends `Do you know Jack????` |
| T+200 s | approximately 12:05:20 AM | `instagram-june-jack-accidental-delete` | IG04 transitions from visible to deleted |
| T+210 s | approximately 12:05:30 AM | `instagram-june-replacement-photo` | IG01 becomes visible as the newest post |

The superseded T+80 IG04 creation event is removed. Deletion persists through app switching, locking, suspension and resume, and is cleared only by a new Hero session.

## Profile and feed ordering

Before deletion, June's profile is newest-first:

1. IG04
2. IG03
3. IG02

After deletion and replacement:

1. IG01
2. IG03
3. IG02

IG04 has no deleted placeholder. If the user explicitly follows June, the same visible records and newest-first ordering feed the Instagram timeline. June is never followed automatically.

## Square media rule

IG01, IG02, IG03 and IG04 render inside one shared `aspect-ratio: 1 / 1` presentation surface. Images fill that surface at 100% width and height with `object-fit: cover`. The source assets are already 1:1; no asset was regenerated, converted or cropped.

## Narrative boundaries

Katie remains the primary gossip-reactive friend, Chris remains the secondary public reactor, and Jay and Matt have no gossip activity. No new participants or branches are added.

The Instagram thread does not read or mutate Jack Friend Request state, June/Jack party eligibility, invitation delivery, Events RSVP or party-message state. It never implies that the user knows Jack, likes gossip, wants to attend the party or follows June.

## Session reset

A new Hero session restores visible IG02, IG03 and IG04 seed records, removes IG01, clears June Follow state and resets all runtime deletion/replacement state. T+200 and T+210 then deterministically repeat the deletion and replacement transitions.

## HOLD boundaries

- Exact Instagram 1.0 visual chrome
- Exact username Search UI
- Exact Delete control chrome
- Exact stale-photo detail behavior

Suggested Users and Copy Sharing Link remain rejected for the target date. No iOS lock-screen Instagram notification is added.
