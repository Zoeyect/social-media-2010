# Tumblr Experience v0.1

## Objective

Implement a minimal Tumblr iPhone-native vertical slice for SOCIAL MEDIA, 2010 using the shared frozen runtime architecture.

## Historical target

- iPhone 4
- iOS 4.1
- October 20, 2010
- en-US / Pacific Time
- sessionIdentity-driven experience

## Shared architecture constraints

- Uses existing System Foundation and App Runtime
- No new runtime subsystem introduced
- Dev-only entry through query parameter

## v0.1 scope implemented

- DEV-only entry path:
  - `/?devApp=tumblr`
  - optional `/?devApp=tumblr&autoOpen=1`
- Shared App Runtime integration
- Tumblr session-scoped state with:
  - `currentView`
  - `selectedPostId`
  - `dashboardScrollPosition`
  - `likedPostIds`
  - `rebloggedPostIds`
  - `posts`
- Dashboard feed (sparse, mixed post types)
- Post detail view
- Like toggle
- Reblog toggle
- Back navigation
- Scroll restoration and state retention through suspension/open-close flow
- Session reset on shutdown via shared shutdown cleanup

## Implemented files

- State module: `src/state/tumblrState.ts`
- Container module: `src/device/TumblrContainer.tsx`
- Runtime integration: `src/device/App.tsx`
- Styles: `src/styles/device.css`

## State model

`TumblrState`:

- `currentView`: `"dashboard" | "post"`
- `selectedPostId`: selected post identifier in detail view
- `dashboardScrollPosition`: preserved scroll position for dashboard restore
- `likedPostIds`: session-local like set
- `rebloggedPostIds`: session-local reblog set
- `posts`: seeded sparse posts for v0.1

## Vertical slice behavior

Launch → Dashboard → Scroll → Open Post → Like/Reblog → Back → Home/suspend/resume restore.

## DEV access

- App is reachable through `AppDevAccess` with dev marker and no SpringBoard production icon introduced.

## Evidence classification

### READY

- Shared App Runtime integration and lifecycle reuse: READY
- v0.1 state model and event wiring (`OPEN_POST`, `BACK_TO_DASHBOARD`, `TOGGLE_LIKE`, `TOGGLE_REBLOG`, scroll restore): READY
- Session reset on shutdown clearing Tumblr state: READY

### HOLD / not yet implemented

- Exact 2010 Tumblr iconography: HOLD
- Exact dashboard/post chrome and typography: HOLD
- Image fixture authenticity for photo posts: HOLD
- Notes/detail metadata exactness: HOLD
- Composer / upload flow / modern surfaces: HOLD
- Deep historical semantics for reblog internals: HOLD (foundation only)

### A/B/C status

- A (Blocker): none introduced
- B (Functional): v0.1 chain implemented
- C (Polish/Historical): deferred as backlog

## Cross-app isolation

Tumblr state update is local to `tumblrState`. No changes were made to:

- Messages
- Twitter
- Facebook
- Instagram
- Foursquare
- Flickr
- Camera runtime
- battery
- scheduler
- global clock
- folder state
- lock-notification routing

## Validation notes

- `npm run build`
- `git diff --check`
- Manual browser interaction verification pending (not performed in this pass)
