# Flickr Experience v0.1

## Objective

Implement a minimal Flickr iPhone-native vertical slice for SOCIAL MEDIA, 2010 using the shared frozen runtime architecture.

- iPhone 4 / iOS 4.1
- October 20, 2010 target
- sessionIdentity-scoped session ownership
- 15-minute simulation session

## Scope

This v0.1 scope is intentionally minimal:
- Photostream
- Photo detail
- Favorite toggle
- View restoration across suspension
- session reset on shutdown/session restart

Hold/backlog items intentionally excluded:
- Sets/Groups
- Comment posting/advanced threads
- Upload/Camera workflow
- EXIF/metadata map rendering
- icon provenance
- exact 2010 visual chrome and typography

## Implementation Summary

### 1) DEV Access

- Query parameter support:
  - `?devApp=flickr`
  - optional `?devApp=flickr&autoOpen=1`
- DEV launch remains outside historical device UI via `AppDevAccess`.
- No production SpringBoard icon was added.

### 2) App Runtime integration

#### State integration

- `appRuntime` reuses existing shared lifecycle.
- New state reducer connected in `src/device/App.tsx`.
- `flickr` participates in lifecycle transitions through:
  - launch
  - suspend/restore
  - runtime reset on shutdown

#### State file

- `src/state/flickrState.ts`

Implemented fields:
- `currentView: "photostream" | "photo"`
- `selectedPhotoId`
- `photostreamScrollPosition`
- `favoritePhotoIds`
- `currentSetId` (reserved slot, HOLD)
- `commentsState` (reserved slot, HOLD)
- `photos` (lightweight placeholder feed items)

State events:
- `OPEN_PHOTO`
- `BACK_TO_PHOTOSTREAM`
- `TOGGLE_FAVORITE`
- `SET_SCROLL_POSITION`
- `RESET`

### 3) Container / UI

- `src/device/FlickrContainer.tsx`
- v0.1 photostream with sparse placeholder rows
- open → detail view
- Favorite/Unfavorite toggle
- back to stream
- detail metadata (title, timestamp, owner, comment count)
- scroll restoration for stream list

### 4) Styling

- `src/styles/device.css` adds Flickr-specific container and component classes.
- Visual fidelity classification for all chrome details remains `HOLD`.

## Evidence classification

### READY

- Shared App Runtime integration with suspension/restore: READY
- State scoping and reset through existing shared session shutdown path: READY
- DEV route launch path (`twitter/facebook/instagram/foursquare` pattern extended to `flickr`): READY

### HOLD

- Exact historical Flickr iconography and exact photo assets: HOLD
- Exact navigation chrome / spacing / palette / controls: HOLD
- Real period photo fixtures: HOLD (placeholder structure used for v0.1)
- Advanced features (Sets, Groups, Maps, EXIF, uploads, push notifications): HOLD by design

## A/B/C tracking

- A blockers: none introduced in this change set.
- B functional status:
  - v0.1 interaction chain implemented and state-restorable.
  - no cross-app architecture changes applied.
- C backlog:
  - exact visual fidelity
  - set/gallery and map workflow
  - richer comments and metadata
  - period-authentic icon/final assets

## Cross-app guarantees

- Does not modify:
  - shared System Foundation logic
  - MESSAGES/TWITTER/Facebook/Instagram/Foursquare runtime contracts
  - battery or lock notification routing
- Uses `sessionIdentity.name` in owner display/contexts and honors session reset.

## Validation notes

- `npm run build`
- `git diff --check`
- Manual interaction verification remains pending for runtime matrix.
