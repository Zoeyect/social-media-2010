# Twitter 2010 Slang & Terminal Easter Egg Expansion v0.7

## Result

Three CURATED, silent Twitter timeline events were added to the existing 15-minute session definition. They use the existing scheduler and Twitter delivery transition without adding new event types, notification behavior, audio, lock ownership, or special rendering.

## Event definitions

| Stable event ID | Due time | Display time | Author / copy | Classification |
| --- | ---: | --- | --- | --- |
| `twitter-slang-epic-fail` | T+75s | 12:03 AM | Ben — “tried to make ramen without turning the stove on. epic fail” | Tweet `CURATED`; phrase `PERIOD-EVIDENCE` |
| `twitter-slang-fml` | T+540s | 12:11 AM | Dana — “just realized the file i worked on all night is the wrong version. FML” | Tweet `CURATED`; phrase `PERIOD-EVIDENCE` |
| `twitter-terminal-goodnight-world` | T+890s | 12:17 AM | Eli — “goodnight, world.” | wholly `CURATED`; role `terminal-easter-egg` |

All three definitions use:

- `sourceApp: "twitter"`;
- `type: "twitterBackgroundTweet"`;
- `deliveryPolicy: "internal"`;
- `provenanceStatus: "CURATED"`.

At delivery, the existing Twitter reducer records the posts with `origin: "live"`. The two slang definitions separately retain `languageReference: "PERIOD-EVIDENCE"`; the terminal item retains `role: "terminal-easter-egg"` at orchestration level.

## Slang evidence

The complete fictional sentences are not historical quotations.

- “epic fail” is supported as established 2010 slang by [The Guardian, April 4, 2010](https://www.theguardian.com/technology/2010/apr/04/epic-fail), which described it as an internet-culture phrase already reaching a popular tipping point. A second period cross-check is [A Way with Words, October 16, 2010](https://waywordradio.org/epic-fail/), discussing contemporary use of “fail” and “epic fail” as slang.
- “FML” is supported by [TechCrunch, January 2, 2010](https://techcrunch.com/2010/01/02/fmylife-api/), which described the FMyLife convention and explicitly reported that “FML” had become a catchphrase outside the site.

Classification boundary:

- phrase existence/use in 2010: `PERIOD-EVIDENCE`;
- Ben and Dana, their circumstances, wording, casing, and timestamps: `CURATED`;
- “goodnight, world.” and its terminal placement: entirely `CURATED` narrative design.

## Terminal scheduling decision

The session terminal remains `SESSION_DURATION_MS = 900,000` (T+900s). The final Tweet is due at T+890s, ten seconds earlier, so ordinary progression delivers it to Twitter state before battery terminal handling begins. Its UI timestamp is deliberately `12:17 AM`, matching the existing minute-only narrative formatting near the endpoint.

It has no special component, class, style, animation, pinning, sound, alert, or explanatory copy. It enters the same `TwitterTweet` array and newest-first selector as every other live Tweet. A user-created Tweet or Retweet continues to sort by its own action time rather than being displaced by artificial pinning.

## Exactly-once and catch-up behavior

No scheduler code changed. The existing guarantees remain:

- stable event IDs prevent duplicate registration;
- `deliveredTimelineEventIds` and event removal prevent duplicate delivery;
- due events are consumed by elapsed time even while locked/sleeping;
- both slang events are due by T+720s / 12:14 AM;
- `deliveryPolicy: "internal"` prevents later alert replay;
- Twitter reset reconstructs seed-only state, while a new Hero session registers the same event definitions from T0.

## Timeline ordering near session end

After all six live Twitter records have arrived, the curated live order is:

1. 12:17 AM — `goodnight, world.`
2. 12:13 AM — Nora homework Tweet
3. 12:11 AM — FML Tweet
4. 12:08 AM — diner-line Tweet
5. 12:07 AM — Eva Tweet
6. 12:03 AM — epic-fail Tweet

Older seed records remain below these unless a session-created Tweet or Retweet has a later effective activity time.

## Apple invariant

None of the three additions mentions Apple, Mac, Steve Jobs, rumors, or the event. The only Apple-related Twitter record remains the existing seed item `apple-event`; seed plus live Twitter content therefore still contains exactly one Apple / Back to the Mac reference.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- T+75 event appears once with display time 12:03 AM.
- T+540 event appears once with display time 12:11 AM.
- T+890 event is earlier than the unchanged T+900 terminal and displays 12:17 AM.
- All Twitter live events remain internal/silent.
- Scheduler implementation, battery curve, terminal behavior, and other apps are unchanged.
