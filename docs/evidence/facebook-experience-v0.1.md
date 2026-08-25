# Facebook Experience v0.1 — Vertical Slice

## Scope

This implementation adds a small, runnable Facebook vertical slice for the October 20, 2010 device session. It launches through the shared application runtime and owns only Facebook-local state. It does not add a production SpringBoard or folder entry because the period Facebook icon remains HOLD.

Development access:

- `/?devApp=facebook` exposes `DEV · Open Facebook` outside the simulated phone in development builds.
- `/?devApp=facebook&autoOpen=1` uses the same shared application launch path after SpringBoard becomes available.
- Normal URLs expose neither a Facebook icon nor a hidden launch target.

## Historical scope and evidence

Period evidence supports the broad feature set used here:

- Facebook 3.0 for iPhone included the News Feed, friend requests, Likes, comments, notifications, photos, chat, and inbox-oriented interaction ([MobileSyrup, August 18, 2009](https://mobilesyrup.com/2009/08/18/new-facebook-for-iphone-3-0-screenshots/); [Engadget, August 27, 2009](https://www.engadget.com/2009-08-27-hold-please-facebook-3-0-for-iphone-released.html)).
- Facebook 3.2 was available in August 2010 and added Places while retaining the native iPhone application context ([iGeneration, August 19, 2010](https://www.igen.fr/app-store/facebook-32-pour-iphone-integre-la-geolocalisation-12641)).
- A contemporary report also records inbox messaging and iOS 4 support in the 2010 application ([Paperblog, August 19, 2010](https://www.paperblog.fr/3532859/la-nouvelle-appli-facebook-vient-de-sortir/)).
- Facebook described persistent bottom navigation as a new iOS change in 2013; this v0.1 therefore does not import that later navigation model ([Facebook, September 18, 2013](https://about.fb.com/news/2013/09/updates-to-facebook-for-ios/)).

Classification:

| Item | Classification | Decision |
| --- | --- | --- |
| News Feed, item detail, Like terminology | READY at behavioral level | Supported by period application coverage. |
| Friend Request with Accept and Ignore | READY at behavioral level | Supported by period Facebook 3.0 coverage and screenshots. |
| Integrated message/inbox item | READY at behavioral level | Supported by period application coverage. |
| Exact navigation arrangement and chrome | HOLD | Minimal top navigation is functional, but is not claimed as pixel-exact. |
| Exact fonts, gradients, geometry, Like/Comment controls | HOLD / C-polish | CSS is a restrained implementation approximation, not historical artwork. |
| Facebook application icon | HOLD | No production entry or substitute artwork was added. |
| Feed/profile photographs and avatars | HOLD | Their layout space remains empty; no placeholders or fabricated images were added. |
| Modern bottom tabs, Stories, Reactions, Marketplace, Watch, Reels, separate Messenger UI | REJECT | Outside the October 2010 target. |

## Implemented vertical slice

The application supports:

1. DEV launch through the shared App Runtime.
2. A sparse chronological News Feed with ordinary, non-algorithmic items.
3. Scroll-position capture, item detail, and Back-to-feed restoration.
4. One session-local Like toggle.
5. Jack's friend request with deterministic `pending`, `accepted`, and `ignored` states.
6. June's inbox item, `Hey, are you online?`, with unread/read state and a shallow read-only detail.
7. Home suspension, shared runtime resume, and retained Facebook-local state.
8. Full reset when a new simulation identity/session begins.

The Comment control and June reply behavior are deliberately non-functional and explicitly marked HOLD.

## State model

`facebookState.ts` owns:

- `currentView`
- feed records and `selectedFeedItemId`
- `scrollPosition`
- `likedItemIds`
- `friendRequestState`
- `juneMessageState`

`sessionIdentity.name` seeds the owner's display name. Facebook does not create a second identity source. The reducer is held in `App` for the active simulation session, so Home, lock/sleep, and app switching do not destroy it. Both terminal session reset and the next Hero submission reset the Facebook reducer.

## Narrative content

All names and feed/message copy are project-authored narrative content, classified `HOLD-fictional`; they are not presented as recovered historical Facebook data. The feed contains one owner status, a photo activity, ordinary status updates, and a lightweight social activity. It intentionally contains no modern product features or explanatory historical copy.

## Functional findings

### A — Blocker / architecture

None found. Facebook launches, suspends, and resumes through the existing shared runtime. No Facebook-specific lifecycle was created.

### B — Functional

None remaining in reducer and build validation. Feed restoration, Like persistence, friend-request actions, June read state, and new-session reset passed deterministic state checks.

### C — Polish backlog

- Exact Facebook 3.2 navigation structure and raster chrome
- Exact font metrics, gradients, separators, and 1–3 px geometry
- Period icon provenance and production entry
- Profile/feed imagery provenance
- Exact Like/Comment button artwork
- Exact Friend Request and Inbox chrome
- Transitions and animation timing

## Isolation and validation

- `npm run build`: PASS
- `git diff --check`: PASS
- Facebook reducer regression: PASS
- Shared App Runtime launch/suspend/resume regression: PASS
- No historical visual assets were added or modified.
- No Facebook notification was registered with `activeLockNotification`.
- No Facebook scheduler, audio, camera, badge-global, battery, folder, or system-clock behavior was introduced.
- Frozen Messages and Twitter state/container files remain unchanged.

Browser interaction was not claimed as manually observed in this implementation pass. Pointer scrolling and click behavior still require a manual browser pass before a future Facebook functional freeze.
