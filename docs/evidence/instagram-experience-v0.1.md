# Instagram Experience v0.1 — Empty Account Vertical Slice

## Result

Instagram now runs as an intentionally empty, session-scoped application through the existing App Runtime. No production icon, photographs, feed records, camera output, or modern Instagram feature was added.

Development access:

- `/?devApp=instagram` exposes `DEV · Open Instagram` outside the simulated iPhone in development builds.
- `/?devApp=instagram&autoOpen=1` launches through the normal shared App Runtime once SpringBoard is available.
- Production URLs contain no Instagram entry or hidden click target.

## Historical scope

Contemporary launch-day reporting establishes that Instagram was available for iPhone on October 6, 2010, supported iOS 3.1.2 or later, could capture or select a photo, supported the iPhone 4 front-facing camera, applied filters, and contained a follow-based photo network ([Macworld, October 6, 2010](https://www.macworld.com/article/208177/instagram.html); [TechCrunch, October 6, 2010](https://techcrunch.com/2010/10/06/instagram-launch/)). Period reporting also describes a single feed of followed users and a Popular page ([VentureBeat, October 6, 2010](https://venturebeat.com/ai/instagram-iphone-photo-sharing)).

This implementation uses only those broad structural facts. Exact launch-era raster chrome and geometry are not claimed.

## State model

`instagramState.ts` owns exactly the application-local account state:

```ts
{
  currentView: "feed",
  photos: [],
  followers: 0,
  following: 0,
  selectedPhotoId: null,
  scrollPosition: 0
}
```

The display identity is read directly from `sessionIdentity.name`; it is not copied into Instagram state. The reducer remains mounted for the current device session, preserving its view and scroll state through Home suspension, lock/sleep, and app switching. The existing terminal shutdown reset dispatch clears it before a new Hero session.

## Implemented vertical slice

- Shared App Runtime launch, suspension, and resume
- Empty Feed surface
- Empty Profile surface using the current session identity
- `0` Photos, `0` Followers, and `0` Following
- Feed/Profile navigation through a minimal development-safe control strip
- Session reset to the initial empty account

The empty state is narrative content, not an incomplete seeded feed. No sample photograph, recommended account, fake engagement, or historical exposition is inserted.

## Evidence classification

| Item | Classification | Decision |
| --- | --- | --- |
| Native iPhone application in October 2010 | READY | Confirmed by launch-day period reporting. |
| Follow-based Feed and Popular section | READY at behavioral level | Confirmed by period reporting. |
| Camera/photo-library capture and filters | READY historically, HOLD in this slice | No camera or photo flow was connected. |
| Empty account counts and photo collection | READY as project state | Deterministic narrative state, not a historical UI claim. |
| Feed/Profile/Popular/Camera/News navigation labels | HOLD exact chrome/layout | Minimal text controls communicate structure; disabled items do not claim implemented behavior. |
| `No photos yet.` / `No Photos` copy | HOLD | Functional empty-state copy; exact launch-era strings are not verified. |
| Exact type, colors, textures, gradients, geometry | HOLD / C-polish | Current CSS is a restrained approximation and contains no recovered Instagram artwork. |
| Launch-era Instagram app icon | HOLD | No production icon or substitute was added. |
| Stories, Reels, DMs, modern Explore, saved/carousel/video posts, reactions | REJECT | Not part of the October 2010 target. |

## Bug classification

### A — Architecture / blocker

None found. Instagram uses the shared App Runtime and existing session lifecycle.

### B — Functional

None remaining in reducer/build validation.

### C — Backlog

- Exact Instagram 1.0 navigation chrome and raster assets
- Verified launch-era icon
- Exact empty-state wording
- Period typography, material, separators, and geometry
- Camera, library, filter, upload, Popular, and News behavior

## Isolation and validation

- `npm run build`: PASS
- `git diff --check`: PASS
- Instagram reducer state/reset regression: PASS
- Shared App Runtime launch/suspend/resume regression: PASS
- Frozen Messages, Twitter, and Facebook state/container files: unchanged
- No historical assets added or modified
- No scheduler, notification, audio, camera, badge, battery, Folder, or global-clock behavior changed

Manual browser interaction has not been claimed in this implementation pass and remains required before an Instagram functional freeze.
