# Twitter Experience v0.1 — Vertical Slice

## Scope

Twitter v0.1 is an isolated application vertical slice consuming the frozen
System Foundation v1 App Runtime. It does not add a production SpringBoard or
Social-folder entry because the October 2010 Twitter icon remains provenance
`HOLD`.

The implemented path is:

```text
explicit DEV route
  → existing App Runtime LAUNCH / RESUME
  → Twitter timeline
  → tweet detail
  → Back to retained scroll position
  → Home suspension
  → DEV route reopen
  → retained Twitter view state
```

The development route is deliberately visible, isolated, and development-only:

```text
http://127.0.0.1:5173/?devApp=twitter
```

When Vite is running in development mode, that query enables a device-external
`DEV · Open Twitter` control. Production builds contain no Twitter icon, no
Social-folder target, and no hidden click target.

## Historical scope

Period evidence establishes that Twitter acquired Tweetie and released the
rebranded official Twitter for iPhone on May 19, 2010. Contemporary screenshots
and descriptions show a native iPhone timeline, individual tweet navigation,
and period actions including Reply, Retweet, and Favorite.

The project implements only the stable structural subset:

- a native-sized navigation container;
- a vertically scrolling chronological timeline;
- individual tweet detail;
- Back navigation;
- Favorite terminology and a local toggle;
- no modern X branding, heart/Like, quote tweet, thread UI, media cards,
  algorithmic tabs, Spaces, or other later concepts.

Exact Twitter chrome, control artwork, colors, metrics, and transition timing
are not backed by an original app bundle and remain `HOLD` approximations.

## Timeline content

Six sparse text-only entries are included so scrolling can be exercised. Only
one mentions Apple:

```text
Wonder what Apple has planned for later today.
```

The wording uses same-day anticipation because the session is after midnight on
October 20, while Apple's announced “Back to the Mac” event began at 10:00 AM
Pacific later that day.

All tweet text and display names are fictional narrative content, explicitly
marked in runtime data as `HOLD-fictional`. They are not represented as archived
historical tweets. No handles, profile histories, or permanent user identity
were invented.

The late-night user entry reads its display name exclusively from
`sessionIdentity.name`. Starting a new session rebuilds Twitter state with the
new identity; it does not retain the prior user's name.

## State model

Twitter owns a dedicated `TwitterState`:

```ts
{
  currentView: "timeline" | "tweetDetail";
  timeline: TwitterTweet[];
  selectedTweetId: string | null;
  scrollPosition: number;
  favoriteTweetIds: string[];
}
```

Supported events:

```text
OPEN_TWEET
BACK_TO_TIMELINE
SET_SCROLL_POSITION
TOGGLE_FAVORITE
RESET
```

No Twitter-specific field was added to `deviceMachine.ts`, App Runtime, SMS
notification state, Messages state, or the lock-notification reducer.

## State retention

`TwitterState` is owned at the device root rather than by the transient Twitter
view component. Therefore:

- opening detail records the current timeline `scrollTop`;
- returning to timeline restores that position in `useLayoutEffect`;
- Home may unmount the runtime surface, but the reducer state remains;
- App Runtime suspension and resume do not reset Twitter;
- lock, sleep, and unlock preserve the same reducer state and use the existing
  retained foreground-owner path;
- terminal/manual session reset dispatches Twitter `RESET` with all other
  ephemeral session state;
- the next Hero identity submission reseeds the user display-name entry from
  the new `sessionIdentity.name`.

## Interaction boundary

Favorite is implemented as the one functional v0.1 tweet action and uses the
period term “Favorite,” never “Like” or a heart. The state is local to Twitter
and survives suspension during the session.

Reply and Retweet labels are displayed disabled and marked `HOLD`. This records
their period presence without inventing compose, retweet confirmation, account,
or network behavior. Compose is deferred to v0.2; no 140-character editor is
included in this slice.

## Evidence classification

| Item | Evidence | Classification |
| --- | --- | --- |
| Official Twitter for iPhone existed by October 2010 | May 19, 2010 period launch coverage | **READY** |
| Timeline and tweet-detail structure | Period screenshots/descriptions | **READY direction** |
| Reply / Retweet / Favorite terminology | Period Twitter/Tweetie coverage and screenshots | **READY direction** |
| Favorite toggle semantics in this simulation | Local implementation; exact native feedback not recovered | **HOLD approximation** |
| Exact navigation chrome | No original target app bundle | **HOLD** |
| Exact row/avatar geometry | No original target app bundle | **HOLD** |
| Avatar imagery | No provenance-complete assets | **HOLD; omitted** |
| Twitter icon | Historical payload not recovered | **HOLD; production entry unavailable** |
| Timeline copy | Fictional narrative content | **HOLD-fictional** |
| One same-day Apple-event anticipation reference | Event was announced for October 20, 10:00 AM PT | **PERIOD-EVIDENCE context** |
| Modern X/Like/quote/thread UI | Outside October 2010 target | **REJECTED** |

“READY direction” means the structure and terminology are period-supported; it
does not promote approximate CSS geometry or material to exact historical fact.

## Functional verification

### Code-path verification

| Requirement | Result |
| --- | --- |
| Twitter can launch through existing App Runtime | **PASS** via isolated DEV route |
| Timeline renders from Twitter-owned state | **PASS** |
| Timeline is vertically scrollable | **PASS** by overflow structure/content extent |
| Tweet opens into detail | **PASS** reducer/component route |
| Back returns to timeline | **PASS** |
| Scroll position is retained across detail | **PASS** stored `scrollPosition` + restore effect |
| Home suspends Twitter through existing runtime | **PASS** existing generic app path; no Twitter branch |
| Reopen resumes retained state | **PASS** root reducer survives runtime surface unmount |
| Lock/sleep preserves prior owner | **PASS** existing generic retained-owner path |
| Messages/System state remains independent | **PASS** no imports or dispatches into those stores |
| New session removes previous identity/state | **PASS** shutdown reset + Hero reseed |

`npm run build` completed successfully with TypeScript and Vite.

### Interactive browser verification

The local development server started successfully, but no controllable browser
was available in the current environment. Consequently, real pointer scrolling,
click-through screenshots, and a visual Home/reopen pass were **not executed in
this audit run**. They remain a manual verification item; they are not reported
as visual test passes.

Manual route:

1. run `npm run dev`;
2. open `/?devApp=twitter`;
3. begin and unlock a session;
4. use `DEV · Open Twitter` while on SpringBoard;
5. scroll, open a tweet, Back, press Home, then use the same DEV control again;
6. verify view, scroll, and Favorite state are retained.

## Bug discipline

### A — Blocker / Architecture

None found. Twitter uses the existing App Runtime and session reset path.

### B — Functional

None found by compilation and code-path inspection.

### C — Polish backlog

- recover and hash the exact October 2010 Twitter icon before enabling the
  Social-folder entry;
- recover an original application bundle or stronger period capture for exact
  navigation chrome, colors, gradients, shadows, row metrics, avatar geometry,
  and animation timing;
- source provenance-complete avatar imagery or continue omitting it;
- verify exact tweet-detail action placement and pressed feedback;
- replace all `HOLD-fictional` timeline copy only if provenance-controlled
  historical content becomes a design requirement;
- perform the pending interactive/visual browser pass.

## Preservation report

- The then-current social-app registry remained unchanged; later SpringBoard work moved it to `springBoardSocialApps.ts` without changing Twitter's stable app ID.
  status `HOLD`.
- `activeLockNotification` and its replacement policy remain unchanged.
- No SpringBoard, Folder, Messages, SMS, Camera, Audio, Battery, Status Bar, or
  Lock Screen state model was modified.
- No historical PNG/CAF asset was added or changed.
- No Twitter icon, avatar, logo, or other artwork was generated.

## Sources

- MacRumors, “Official Twitter iPhone Application Now Available,” May 19, 2010:
  https://www.macrumors.com/3217/
- TechCrunch, “Official iPhone Twitter app is here,” May 19, 2010 (period
  screenshots):
  https://techcrunch.com/2010/05/19/yes-folks-the-official-iphone-twitter-app-is-here-screen-shots-2/
- Engadget, “Apple to hold media event October 20,” October 13, 2010:
  https://www.engadget.com/2010-10-13-apple-to-hold-media-event-october-20th-well-be-there-live.html
- Engadget, live event schedule confirming 10:00 AM Pacific, October 20, 2010:
  https://www.engadget.com/2010-10-20-live-from-apples-back-to-the-mac-event.html

These period sources establish availability, broad interface vocabulary, and
event context. They do not establish pixel-exact application chrome.
