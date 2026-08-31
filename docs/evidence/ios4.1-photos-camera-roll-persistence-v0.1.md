# iOS 4.1 Photos / Camera Roll Persistence v0.1

Target: iPhone 4, iOS 4.1 (8B117), October 2010.

## Scope

This pass closes the player-created Camera capture loop:

```text
Camera JPEG
→ durable device-local Camera Roll
→ Camera latest-photo thumbnail
→ Photos / Camera Roll grid
→ system full-photo viewer path
```

It does not import curated project media or add editing, sharing, deletion UI, slideshows, Faces, Places, album management, filters, metadata UI, or modern lightbox behavior.

## Historical confidence

- `Camera Roll` system naming: **CONFIRMED** by the period Apple iOS 4 user guide.
- Photos → Camera Roll entry structure: **CONFIRMED** by the period Apple iOS 4 user guide.
- Camera lower-left thumbnail reviews the last shot: **CONFIRMED** by the period Apple iOS 4 user guide.
- Viewer image tap shows/hides controls: **CONFIRMED** by the period Apple iOS 4 user guide.
- Chronological grid with newest capture at the end: **PROBABLE**, based on period/close-period guide and user evidence.
- Runtime thumbnail crop: **RECONSTRUCTED** (`object-fit: cover` inside the locked 37×37 pt content region).
- Photos navigation bar, album row, grid spacing, empty state, and full-viewer pixel geometry: **RECONSTRUCTED**.
- Unsupported viewer toolbars and exact 8B117 controls: **HOLD** and unrendered.
- Full-photo previous/next paging direction and non-wrapping bounds: **CONFIRMED** for this interaction pass.
- Direct-drag completion threshold (`20%`), tap discriminator (`8px`), and settle timing (`160ms ease-out`): **RECONSTRUCTED**.

Historical references:

- Apple, *iPhone User Guide for iOS 4 Software*, Camera and Photos chapters.
- David Pogue, *iPhone: The Missing Manual, 4th Edition* (2010), Photos/Camera Roll description.
- Close-period Camera Roll ordering corroboration recorded during Checkpoint 1.

## Durable storage

- Database: `social-media-2010.camera-roll`
- Version: `2`
- Photo store: `photos`, key path `id`
- Metadata store: `metadata`, key path `key`
- Owner query index: `by-origin-experience` on `[origin, experienceSessionId]`
- Unique sequence index: `by-experience-sequence` on `[experienceSessionId, captureSequence]`
- Sequence metadata key: `capture-sequence:<experienceSessionId>`

The `photos` store currently instantiates only records with:

```ts
origin: "player-camera"
```

The model keeps a future source-discriminated path open for seeded on-device Camera Roll items without importing or mutating any existing curated media.

## Experience ownership

Camera Roll persistence is owned by the canonical narrative `Session` through an opaque `experienceSessionId`. This is a **product/privacy/simulation-session architecture decision**, not a reconstruction of historical iOS storage behavior.

A valid Hero name submission creates the ID and begins a new empty player-camera namespace. Home, app switching, lock/sleep, suspension/resume, ordinary runtime reset, and browser reload preserve it. Completed shutdown returns to Hero; the next valid name submission creates a different ID.

The authorization invariant is:

```text
active experienceSessionId
=== durable record experienceSessionId
```

Camera thumbnail, Photos album count, grid, and viewer receive only this already-filtered collection. Cleanup is storage hygiene and is not the privacy boundary.

Version 2 deliberately deletes legacy `origin: "player-camera"` records that lack `experienceSessionId` during the v1 → v2 upgrade. Their ownership cannot be proven, so they are never assigned to the current player. Seeded and non-player records remain untouched.

## Durable record schema

Each player capture persists:

- stable `id`
- `filename`
- `captureSequence`
- `experienceSessionId`
- simulated `createdAt`
- `sceneId`
- `width` / `height`
- JPEG `mimeType`
- `byteSize`
- JPEG `Blob`
- `origin`
- `cameraFacing`
- `cameraMode`
- capture `framing` provenance

`objectUrl` is never persisted.

## Initialization and object URLs

Camera Roll has explicit `loading`, `ready`, and `error` states.

Initialization requires a non-null active `experienceSessionId`. IndexedDB loads only the compound owner key `["player-camera", experienceSessionId]` before capture allocation is enabled. At Hero, where the ID is null, no prior Camera Roll is exposed. Each authorized durable Blob receives a new runtime `URL.createObjectURL` representation. Restored records are sorted by simulated `createdAt` ascending and `captureSequence` ascending.

Runtime URLs are revoked when:

- restoration replaces an older runtime representation;
- the development erase operation clears player captures;
- the root application unmounts.

They are not revoked for Home, app switching, suspension, lock, sleep, narrative shutdown, or normal runtime reset.

## Atomic filename and capture commit

`capture-sequence:<experienceSessionId>` stores the next available sequence for one experience. Initialization repairs it to at least `max(current owner's captureSequence) + 1`.

After a JPEG artifact is successfully encoded, one IndexedDB read/write transaction:

1. reads the next sequence;
2. creates globally unique `camera-photo-<experienceSessionId>-####` storage identity and historical `IMG_####.JPG` filename;
3. adds the photo record without overwrite semantics;
4. advances the sequence metadata;
5. commits both operations together.

An aborted or failed transaction commits neither record nor sequence advancement. Only after transaction completion is a runtime record/object URL added and Camera processing completed.

The capture owner is frozen into the atomic shutter-time snapshot. Persistence rejects any explicit owner/snapshot mismatch. If rendering or persistence completes after the canonical active owner changes, the result is discarded, any just-persisted stale record is removed, no object URL is created, the new owner's sequence is not consumed, and the new Camera Roll remains untouched. Captures are never migrated between players.

## Failure behavior

There is no localStorage/base64 or session-only fallback.

- Initialization failure produces `error`, logs the failure, exposes `Camera Roll Unavailable`, and leaves capture disabled.
- Capture persistence failure logs the failure, adds no runtime photo, consumes no sequence, leaves existing Camera Roll records intact, and returns Camera from processing/capturing to previewing.
- Camera Roll persistence never derives ownership from display name, simulated time, or a runtime counter.
- Stale-session cleanup failure is logged but cannot broaden the owner-scoped query.

## Development incident record

Observed transient Camera Roll initialization stall in development. A subsequent clean reload completed the IndexedDB v2 initialization, owner restore, sequence reconciliation, and Camera capture path. No deterministic root cause was established; no speculative behavioral fix was applied.

## Navigation and preservation

The authenticated SpringBoard Photos icon receives functional `launchId: "photos"` wiring only; its artwork, label, position, and layout are unchanged.

Photos v0.1 implements only:

```text
Photos
→ Camera Roll
→ captured-photo thumbnail
→ captured JPEG viewer
```

The viewer resolves its active record by stable ID against the latest ordered Camera Roll. Pointer drag/swipe left advances to the next record; drag/swipe right returns to the previous record. The current and available adjacent JPEGs move directly with the pointer, paging completes at 20% of the viewer width, shorter drags settle back, and the first/last records do not wrap. `ArrowLeft` and `ArrowRight` provide the equivalent previous/next path without visible arrow controls. A movement below 8 px remains a tap and toggles the existing viewer controls; horizontal drags do not toggle them.

Camera’s authenticated preview well remains unchanged. Before a capture it retains the authenticated placeholder. After restoration or capture, only the 37×37 pt content region displays the newest encoded JPEG.

Selecting that Camera thumbnail opens the latest record through the shared Photos viewer state. Camera is suspended, not reset, so Camera Look and session state survive reopening.

## Reset semantics

Durable player photos survive:

- Home and ordinary app close;
- app switching and suspension;
- lock and sleep;
- page reload and simulator reopening;
- ordinary runtime/narrative reset within the same canonical experience;
- root remount.

Runtime reset returns Photos navigation to its album root but does not erase or revoke the active experience's durable Camera Roll. Completed shutdown ends that experience. On the next valid Hero submission, old runtime URLs are revoked immediately, a new empty namespace is exposed, and stale player-camera namespaces are deleted asynchronously. Isolation remains enforced if cleanup fails.

## Development-only erase

Development builds expose:

```js
await window.__SM2010_CAMERA_CAPTURE_QA__.eraseCurrentCameraRoll()
await window.__SM2010_CAMERA_CAPTURE_QA__.eraseAllPlayerCameraRolls()
```

`eraseCurrentCameraRoll()` deletes only the active experience's `origin: "player-camera"` records and sequence metadata. `eraseAllPlayerCameraRolls()` deletes all player-camera namespaces and their sequence metadata. Both revoke affected current runtime URLs and reset Photos navigation; neither touches narrative/session state, seeded media, or curated historical media.

Additional QA accessors:

```js
window.__SM2010_CAMERA_CAPTURE_QA__.persistenceStatus()
window.__SM2010_CAMERA_CAPTURE_QA__.records()
window.__SM2010_CAMERA_CAPTURE_QA__.latest()
```

## Preserved invariants

Unchanged:

- 1936×2592 offscreen capture rendering
- JPEG quality `0.90` (**RECONSTRUCTED**)
- Camera Look architecture and clamp
- Ambient World production plate
- Camera shader/treatment
- Camera chrome geometry and authenticated well artwork
- Volume-button behavior
- Lock Screen
- unrelated apps
- all curated historical media
