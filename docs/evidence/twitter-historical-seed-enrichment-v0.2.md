# Twitter Historical Seed Enrichment v0.2

## Outcome

The Twitter baseline now contains nine seed items arranged newest-first. It reads as a late-night personal feed rather than an archive exhibit:

- 5 mundane ordinary-user posts
- 2 curated manual RT wrappers around documented October 19 public-figure source text
- 1 curated celebrity-discussion post
- 1 subtle Apple-event reference

No seed item is scheduled as a live arrival. The existing 12:08 AM live Twitter event remains separate and does not mention Apple.

## Final seed composition

| Order | Time (PDT) | Display name | Type | Text summary | Provenance |
|---:|---|---|---|---|---|
| 1 | 11:58 PM | June | Ordinary | Asks whether anyone is awake | Content and timestamp `CURATED` |
| 2 | 11:53 PM | Nora | Manual RT | Reposts Kanye West's October 19 album-cover reaction | Source `HOLD`; wrapper and displayed timestamp `CURATED` |
| 3 | 11:41 PM | Session owner | Ordinary | Cannot sleep | Content and timestamp `CURATED` |
| 4 | 11:26 PM | Mia | Celebrity discussion | Casually asks why Kanye is being discussed | Content and timestamp `CURATED` |
| 5 | 11:03 PM | Eli | Manual RT | Reposts Conan O'Brien's October 19 fan-question link | Source `HOLD`; wrapper and displayed timestamp `CURATED` |
| 6 | 10:47 PM | Sam | Apple reference | Mentions tomorrow morning's Apple event/liveblogs | Content `CURATED/HOLD`; timestamp `CURATED` |
| 7 | 10:05 PM | Jack | Ordinary | Has class tomorrow but is watching television | Content and timestamp `CURATED` |
| 8 | 9:12 PM | June | Ordinary | Notes that the rain stopped | Content and timestamp `CURATED` |
| 9 | 8:30 PM | Nora | Ordinary | Wants food | Content and timestamp `CURATED` |

All nine displayed seed timestamps are narrative timestamps and are explicitly stored as `CURATED`. Every item predates the device session's 12:02 AM start.

## Public-figure source records

### Kanye West manual RT

- Public figure: Kanye West
- Handle: `@kanyewest`
- Source date: October 19, 2010
- Source timestamp: October 19, 2010 16:05:11 UTC / 9:05:11 AM PDT
- Source text: preserved verbatim inside the manual RT
- Evidence source: [YZY TWTS 2010 archive](https://yzy-twts.com/2010)
- Source classification: `HOLD`
- Reason: a later archive supplies text, ID, and time, but the period-tweet audit did not recover an original status capture
- Wrapper classification: `CURATED`
- Wrapper timestamp: 11:53 PM PDT, `CURATED`

The wrapper represents an ordinary user manually reposting a tweet from earlier that day. It does not assert that Kanye posted at 11:53 PM.

### Conan O'Brien manual RT

- Public figure: Conan O'Brien
- Handle: `@ConanOBrien`
- Source date: October 19, 2010
- Exact source time: unresolved
- Source text: preserved verbatim inside the manual RT
- Evidence source: [later date-level Conan archive](https://wicoco.fandom.com/wiki/Conan_O%27Brien%27s_Twitter_account/Archive)
- Source classification: `HOLD`
- Reason: the later archive supplies text and date, but not an original permalink, exact time, timezone, or client
- Wrapper classification: `CURATED`
- Wrapper timestamp: 11:03 PM PDT, `CURATED`

The implementation does not promote this source to `READY`. The manual RT's position is narrative wrapper timing, not a reconstructed original post time.

## Historical versus curated boundaries

Mixed retweet records retain two separate provenance fields:

- `sourceTweetProvenance`: quality of the public figure's archived source
- `retweetWrapperProvenance`: status of the fictional ordinary-user repost

They also retain a nested source record containing the public figure, handle, exact archived text, known source date/time, source URL, and unresolved evidence note.

Ordinary posts, celebrity discussion, and all displayed seed timestamps are `CURATED`. The vague Kanye discussion does not assert an external historical event beyond discussion occurring in the fictional feed.

## Retweet form

Both public-figure items use the period-plausible manual form:

`RT @username ...`

No quote-tweet card, embedded quotation UI, thread preview, modern retweet commentary, or modern X terminology was introduced.

## Apple-reference ownership

Exactly one Twitter item mentions Apple:

- Seed item: `apple-event`, 10:47 PM PDT
- Text direction: tomorrow morning's Apple event and following liveblogs
- Classification: `CURATED/HOLD`

The existing scheduled Twitter event at 12:08 AM is an unrelated diner update. It remains unchanged and therefore does not duplicate the Apple reference.

The copy does not reveal announcements that had not happened at 12:02 AM: it does not mention Lion, the Mac App Store, FaceTime for Mac, or event outcomes.

## Chronological ordering

The seed array is stored newest-first:

`11:58 PM → 11:53 PM → 11:41 PM → 11:26 PM → 11:03 PM → 10:47 PM → 10:05 PM → 9:12 PM → 8:30 PM`

The existing 12:08 AM live tweet sorts above the seed when delivered. No seed item is registered with the scheduler.

## Rejected candidates and treatments

- Conan's verified October 20 office-webcam tweet: rejected for seed use because it was posted at 12:53 PM PDT, after both the session and contextual research window.
- Conan's verified October 18 joke: not used because it predates the selected same-day texture.
- Erykah Badu, Keri Hilson, and LeBron James: no provenance-complete target-date source text was recovered; no quote was invented.
- Kanye screenshot-roundup items without individually recoverable timestamps: not used.
- A real media-account Apple tweet: not used because the archive audit found no provenance-complete target-window candidate.
- Native-retweet chrome: not added; exact client/UI behavior remains outside this content-only task.

## Session reset

The enriched timeline remains part of the immutable session seed source. `createInitialTwitterState()` clones that baseline for each new session. Favorite IDs, selected detail, and scroll position remain runtime/session-local and reset through the existing Twitter state path.

## Remaining HOLD items

- Original permalink, exact time, and client for the October 19 Conan source tweet
- Original status capture for the Kanye source tweet
- Exact historical native-retweet presentation in the target Twitter for iPhone build
- Exact Apple-related period tweet in the primary research window
- All curated copy and displayed wrapper timestamps as historical facts

## Change boundary

This task changes only the Twitter portion of `SESSION_SEED_CONTENT` and adds this evidence document. It does not change Twitter state transitions, App Runtime, scheduler, notification routing, session timing, Messages, or System Foundation.
