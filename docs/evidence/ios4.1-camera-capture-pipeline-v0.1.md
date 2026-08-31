# iOS 4.1 Camera Capture Pipeline v0.1

## Scope

Target: iPhone 4 GSM (`iPhone3,1`), iOS 4.1 build `8B117`, rear Camera in portrait Photo mode.

This pass implements one memory-only still capture from the existing Camera World Bridge. It does not implement Photos, Camera Roll persistence, thumbnail replacement, video capture, Volume-button shutter behavior, DeviceOrientation, flash/iris/blink effects, new Camera chrome, or a new image grade.

## Historical output classification

Apple documents the iPhone 4 rear camera as 5 megapixels. Period original-photo evidence consistently reports a `2592×1936` native still raster and JPEG output. The v0.1 browser artifact is portrait-normalized to `1936×2592` pixels with MIME `image/jpeg`.

- iPhone 4 rear camera at 5 megapixels: **CONFIRMED**.
- `2592×1936` rear-camera still dimensions: **PROBABLE** for the target build.
- JPEG Camera output: **PROBABLE**.
- Sensor-native landscape pixels plus orientation metadata: evidence-backed platform behavior; exact 8B117 Camera serialization remains **PROBABLE**.
- Browser-normalized `1936×2592` output without EXIF orientation authoring: **RECONSTRUCTED**.
- Browser JPEG quality `0.90`: **RECONSTRUCTED**; no exact historical encoder-quality constant was recovered.

The output dimensions are historically motivated by iPhone 4 rear-camera still dimensions. The production scene source is only `1672×941`; the generated JPEG does not contain genuine 5-megapixel source detail and must not be described as reproducing true iPhone 4 sensor detail. No sharpening or synthetic detail generation is applied.

## Atomic shutter snapshot

The renderer retains an immutable copy of the last Camera frame actually presented. At the logical shutter request, the simulator timestamp and the following presented-frame data are captured together before asynchronous JPEG encoding:

- scene identity
- scene time
- shared sway X/Y
- shared zoom
- luminance state
- color state
- sampling-ring state
- Camera grain seed
- requested pointer offset
- orientation offset, currently `{0,0}`
- effective dynamically clamped Camera Look offset
- Camera facing
- Camera mode

The offscreen render consumes only that immutable snapshot. It does not re-read mutable Camera Look or simulator time during encoding. The historical still aspect changes the extreme crop by approximately 0.33 percent relative to the reconstructed `320×427` preview, but the current optical center, scene transform, and Camera Look are neither stretched nor recentered.

## Offscreen render lifecycle

Capture uses a temporary `1936×2592` RGBA8 texture attached to a dedicated framebuffer in the existing WebGL2 context. Before allocation, the renderer checks `MAX_TEXTURE_SIZE`; after attachment, it requires `FRAMEBUFFER_COMPLETE`.

The renderer then:

1. binds the existing plate and bloom textures;
2. uploads the immutable Camera snapshot;
3. renders the scene once with the unchanged Camera treatment;
4. reads scene-only RGBA pixels;
5. restores framebuffer, viewport, scissor, blend, program, vertex-array, active-texture, texture-binding, pack-alignment, and last-presented Camera uniform assumptions;
6. deletes the temporary framebuffer and texture;
7. vertically normalizes the WebGL pixels in place;
8. encodes them through a temporary 2D canvas at JPEG quality `0.90`;
9. releases raw pixels and the temporary canvas backing store.

The visible Ambient World and `320×427` Camera preview are not used as the still source and are not resized or read back. Camera UI, device chrome, and the outer Ambient World cannot enter the capture target.

## Capture treatment

The existing live Camera treatment is reused unchanged:

| Parameter | Value | Confidence |
| --- | ---: | --- |
| Blur | `0.10` | **RECONSTRUCTED** |
| Exposure | `1.00` | **RECONSTRUCTED** |
| Noise | `0.022` | **RECONSTRUCTED** |
| Luminance drift | `0.010` | **RECONSTRUCTED** |
| Color drift | `0.004` | **RECONSTRUCTED** |
| Bloom | `0.16` | **RECONSTRUCTED** |
| Capture grain scale | `2.5` physical pixels | **RECONSTRUCTED** |
| JPEG quality | `0.90` | **RECONSTRUCTED** |

No capture-specific sharpening, white-balance shift, highlight clipping, vignette, chromatic aberration, film grain, vintage filter, or cinematic grade is added. The live Camera shader source and treatment constants are unchanged.

## Shutter input and lifecycle

The existing shutter frame is now a real button at the unchanged `111,433,98,41` global frame. The authenticated dark glyph remains at `147,443,26,21`. Primary pointer activation and normal keyboard button activation request one rear Photo-mode still; a synchronous in-flight guard prevents duplicate or burst requests.

The authenticated `cameraButtonSilver_pressed@2x.png` is used without pixel alteration during valid primary pointer-down and keyboard activation. Asset identity and pressed-state relationship are **CONFIRMED**; exact UIKit dwell behavior remains **HOLD**.

The existing `DeviceAudio.cameraShutter()` semantic boundary remains responsible for sound. No Volume control, flash animation, iris, screen blink, or additional sound was added.

Runtime phases correspond to actual work:

```text
previewing
  → capturing: validated shutter request and atomic renderer snapshot
  → processing: offscreen pixels captured; JPEG encoding pending
  → previewing: complete CameraPhotoRecord created
```

Any render, readback, canvas, or encoding failure returns `capturing` or `processing` to `previewing`. Failure creates no record, consumes no filename, creates no persistent state, and leaves Camera Look unchanged.

## Memory-only record and filename allocation

`CameraPhotoRecord` retains the Blob, Object URL, simulator timestamp, dimensions, MIME, byte size, camera state, and full framing provenance required for inspection and future Camera Roll work. Records are not persisted or exposed to Photos. Object URLs are revoked when the runtime capture namespace is reset or the root application unmounts.

Filenames use `IMG_####.JPG`, starting at `IMG_0001.JPG` in the new in-memory namespace. The allocator selects the first unallocated number only after JPEG creation succeeds; failed attempts consume nothing. This allocation behavior is **RECONSTRUCTED**. Curated media, including existing project files with `IMG_` names, is neither inspected nor renumbered.

`createdAt` is calculated at shutter request from the canonical simulated clock:

```text
SESSION_START_ISO + elapsedMs(session, Date.now())
```

Host `Date.now()` supplies elapsed duration only. The stored instant remains in the simulated 2010 timeline.

## Development QA surface

Development builds expose no visible QA UI. The console handle is:

```js
window.__SM2010_CAMERA_CAPTURE_QA__
```

- `.latest()` returns the latest complete `CameraPhotoRecord` or `null`.
- `.records()` returns a snapshot of all current in-memory records.
- `.failNextCapture()` makes the next otherwise-valid shutter request take the recoverable failure path.

The handle is not installed in production builds.

## Preserved boundaries

- Production Ambient World plate: unchanged.
- Camera Look limits and Option B persistence: unchanged.
- Camera chrome geometry and wake behavior: unchanged.
- Live Camera shader and treatment: unchanged.
- Photos, Camera Roll, thumbnail well, historical seed photos, SpringBoard, Lock Screen, device shell, volume behavior, and responsive-layout issue: unchanged.
