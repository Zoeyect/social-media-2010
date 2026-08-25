# Twitter 2010 Mentions, Messages, and Natural Stats v0.6.4

## Result

Twitter now has session-local seed Mentions and Direct Messages with distinct historical semantics, read state, linked-Tweet routing, and reset behavior. Public-account statistics use deterministic irregular display values rather than visibly rounded placeholders.

## Account statistic methodology

- Each public account still uses one registry record across Suggested Users, Profile, Following, Timeline authors, and linked-Tweet authors.
- `EXACT`, `NEAR-DATE`, `ESTIMATED`, and `CURATED-FILL` remain valid baseline evidence classes.
- `ESTIMATED-DISPLAY` identifies a deterministic irregular integer chosen within an evidence-supported range when no exact target-date snapshot exists.
- The display integer is not a claim of archival precision. Source date, URL, confidence, and notes remain attached internally.
- All four profile cells contain deterministic values. Media, official, celebrity, and brand patterns vary instead of sharing one repeated shape.
- v0.6.3 session-local follower deltas remain separate from these immutable baseline statistics.

## Mentions seed

| Sender | Time | Initial state | Copy | Link |
| --- | --- | --- | --- | --- |
| Alex | 11:54 PM | unread | `@<sessionHandle> look at this lol` | Conan O'Brien historical Tweet |
| Chris | 10:38 PM | read | `@<sessionHandle> did you ever finish that thing?` | none |

The current handle is derived from session identity. These are public Tweets mentioning the user, not private messages. Both identities and sentences are CURATED and intentionally do not overlap Timeline identities.

Opening an unread Mention marks it read and opens that public Tweet Detail. As corrected in v0.6.7, its historical status reference is a separate plain link from that Detail; Back restores the correct Mentions or Home Timeline origin.

## Direct Messages seed

| Sender | Time | Initial state | Latest text | Link |
| --- | --- | --- | --- | --- |
| Katie | 11:46 PM | unread | `crazy ahaha` | Conan O'Brien historical Tweet |
| Matt | 10:21 PM | read | `see you tomorrow` | none |

Messages uses a compact conversation list and a read-only thread in v0.6.4. Opening Katie marks the thread read. The plain `View Tweet` reference opens Tweet Detail; Back returns to the same thread, and a second Back returns to Messages. Reply/composer behavior remains HOLD.

No modern embedded Tweet/share card, notification badge, or Messenger-style conversation surface was introduced.

## Historical linked Tweet

- Author: Conan O'Brien, `@ConanOBrien`
- Text: “Saw Jackass 3D. Not as good as the book.”
- Original timestamp: October 18, 2010 22:58:58 UTC / 3:58:58 PM PDT
- Original status ID: `27777712177`
- Evidence: original Twitter status captured by Wayback, already recorded in `twitter-october-20-2010-period-tweet-archive-audit-v0.1.md`
- Classification: `PERIOD-EVIDENCE`; authentic but outside the primary target window

The Tweet predates both seed references. It was not moved to a fictional time and no celebrity wording was fabricated.

## Unread and reset policy

- Opening is sufficient to change unread to read.
- Read state is Twitter-local and survives ordinary tab, Home, lock/sleep, and app retention because it lives in the shared Twitter state.
- Reset reconstructs the designed baseline: Alex Mention and Katie DM unread; Chris Mention and Matt DM read.
- Exact historical tab-indicator chrome remains HOLD, so no modern badge was invented.

## Functional checks

- two Mentions and two DM conversations exist at session start;
- each surface has one unread and one read record;
- Mention/DM identities are unique and do not overlap Timeline identities;
- linked source is the recorded Conan status and retains `PERIOD-EVIDENCE`;
- open clears unread;
- linked detail returns to the correct origin and restores list/thread state;
- reset restores unread baselines;
- no scheduler event or architecture was added.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS

Browser-level pixel/chrome verification was not performed. Exact 2010 Mentions/DM row chrome, share-link presentation, tab indicator artwork, and DM reply composer remain HOLD.
