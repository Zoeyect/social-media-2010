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

Historical references:

- Apple, *iPhone User Guide for iOS 4 Software*, Camera and Photos chapters.
- David Pogue, *iPhone: The Missing Manual, 4th Edition* (2010), Photos/Camera Roll description.
- Close-period Camera Roll ordering corroboration recorded during Checkpoint 1.

## Durable storage

- Database: `social-media-2010.camera-roll`
- Version: `1`
- Photo store: `photos`, key path `id`
- Metadata store: `metadata`, key path `key`
- Sequence metadata key: `capture-sequence`

The `photos` store currently instantiates only records with:

```ts
origin: "player-camera"
```

The model keeps a future source-discriminated path open for seeded on-device Camera Roll items without importing or mutating any existing curated media.

## Durable record schema

Each player capture persists:

- stable `id`
- `filename`
- `captureSequence`
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

On initialization, IndexedDB records are loaded before capture allocation is enabled. Each durable Blob receives a new runtime `URL.createObjectURL` representation. Restored records are sorted by simulated `createdAt` ascending and `captureSequence` ascending.

Runtime URLs are revoked when:

- restoration replaces an older runtime representation;
- the development erase operation clears player captures;
- the root application unmounts.

They are not revoked for Home, app switching, suspension, lock, sleep, narrative shutdown, or normal runtime reset.

## Atomic filename and capture commit

`capture-sequence` stores the next available durable player-camera sequence. Initialization repairs it to at least `max(existing captureSequence) + 1`.

After a JPEG artifact is successfully encoded, one IndexedDB read/write transaction:

1. reads the next sequence;
2. creates `camera-photo-####` / `IMG_####.JPG`;
3. adds the photo record without overwrite semantics;
4. advances the sequence metadata;
5. commits both operations together.

An aborted or failed transaction commits neither record nor sequence advancement. Only after transaction completion is a runtime record/object URL added and Camera processing completed.

## Failure behavior

There is no localStorage/base64 or session-only fallback.

- Initialization failure produces `error`, logs the failure, exposes `Camera Roll Unavailable`, and leaves capture disabled.
- Capture persistence failure logs the failure, adds no runtime photo, consumes no sequence, leaves existing Camera Roll records intact, and returns Camera from processing/capturing to previewing.
- The narrative session localStorage record is never used or mutated by Camera Roll persistence.

## Navigation and preservation

The authenticated SpringBoard Photos icon receives functional `launchId: "photos"` wiring only; its artwork, label, position, and layout are unchanged.

Photos v0.1 implements only:

```text
Photos
→ Camera Roll
→ captured-photo thumbnail
→ captured JPEG viewer
```

Camera’s authenticated preview well remains unchanged. Before a capture it retains the authenticated placeholder. After restoration or capture, only the 37×37 pt content region displays the newest encoded JPEG.

Selecting that Camera thumbnail opens the latest record through the shared Photos viewer state. Camera is suspended, not reset, so Camera Look and session state survive reopening.

## Reset semantics

Durable player photos survive:

- Home and ordinary app close;
- app switching and suspension;
- lock and sleep;
- page reload and simulator reopening;
- narrative shutdown and normal runtime reset;
- root remount.

Runtime reset returns Photos navigation to its album root but does not erase or revoke the durable Camera Roll.

## Development-only erase

Development builds expose:

```js
await window.__SM2010_CAMERA_CAPTURE_QA__.eraseCameraRoll()
```

It deletes only `origin: "player-camera"` durable records, resets the durable next sequence to `1`, revokes current runtime URLs, empties runtime Camera Roll state, and resets Photos navigation. It does not touch narrative/session state or curated media.

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
