# iPhone 4 v3.1 — BackGlass, chassis normalization, front steel and Power

Checkpoint acceptance: **iPhone 4 Production Model v3.1 — Safari PASS**, confirmed by the user on 2026-09-11. The user accepted the current front steel perimeter and working ScreenPortal from the reviewed screenshots. This is user-confirmed visual acceptance, not an automated Safari test result. The checkpoint includes the v3 reconstruction and v3.1 corrections; no app/media/state files changed.

The `sm2010-visual-authenticity-qa` skill guided reference comparison, minimal scope and separation of measured facts from visual acceptance. Supplied original references remain authoritative. Exact steel exposure and Power protrusion are user-approved **RECONSTRUCTED** dimensions, not factory CAD claims.

## BackGlass correction and physical measurements

| Measurement | Before | Final |
| --- | --- | --- |
| FrontGlass outer Z | +4.650 mm | +4.650 mm, unchanged |
| BackGlass outer Z | −4.630 mm | −4.650 mm |
| Rear decal plane | −4.650 mm | −4.670 mm |
| Decal separation | 0.020 mm | 0.020 mm |
| Chassis W × H × D | 58.600 × 115.200 × 9.280 mm | **58.600 × 115.200 × 9.300 mm** |
| Chassis center | (0, 0, +0.010) mm | **(0, 0, 0) mm** |
| Total assembly W × H × D | 58.600 × 115.200 × 9.300 mm | **58.600 × 115.400 × 9.320 mm** |

Total assembly includes the +0.20 mm Power protrusion and 0.02 mm rear decals. They do not redefine chassis dimensions or normalization. BackGlass and its flat markings moved outward together; cameras and flash did not move. Source/export crossing, self-intersection and coplanar audits pass for the corrected rear assembly. The earlier v3 report's 9.3 mm figure described decal-inclusive assembly thickness, not chassis thickness; this report supersedes that classification.

## Normalization contract

Old source: whole scene `Box3.setFromObject(root)` for initial center, oriented height, and scaled center.

New source: `CHASSIS_NORMALIZATION_ROLES` in `iphone4Normalization.ts`: `stainlessFrame`, `body`, `frontGlass`, `backGlass`. The existing resolver resolves these to `StainlessFrameGeometry`, `PhoneBodyGeometry`, `FrontGlassGeometry`, and `BackGlassGeometry`, using their structural material primitives. Bounds come from their own geometry transformed by `matrixWorld`, not recursive child bounds. Decal/control primitive siblings and attached hit volumes do not enter the box. Embedded SIM details remain inside the unchanged structural steel extent and do not determine any extreme.

Missing, empty or non-finite chassis roles throw an explicit contract error. A small catch around normalization in `ProductionIPhone4Model.tsx` routes it to the existing unavailable-model diagnostic path. There is no whole-scene fallback. No loader redesign, runtime pose, camera, lighting or hit-target change.

Corrected four-role source envelope measured by Three.js: `(58.600001037, 115.199998021, 9.300000151)` mm; center `(0,0,0)`. Normalized root position `(0,0,0)`, identity orientation, scale **24.479167087163127**, chassis height 2.82 scene units.

### Parity before steel/Power edits

Measured after BackGlass correction but before v3.1 geometry:

| Value | Old scene normalization | New chassis normalization |
| --- | --- | --- |
| Scale | 24.479166792206716 | 24.479167087163127 |
| Root position, scene units | (0, −1.699e−8, +0.00024480315) | (0,0,0) |
| Source bounds center Z | approximately −0.010 mm | 0 mm |

Scale delta is +2.95e−7 (approximately 1.2e−8 relative, floating-point bounds variation). New-minus-old Screen center delta: `(0, +1.728e−8, −0.00024480180)` scene units. Dock delta: `(0, −4.424e−11, −0.00024480315)` scene units. This explicitly removes the old decal-driven depth centering. It is not a change to authored Screen or Dock geometry.

### Invariance

PASS with 1e−11 scene-unit tolerance: Power +0.20 mm and +500 mm stress extension; VolumeUp and VolumeDown extension; mute travel; rear-camera extension; large attached hit volumes; rear-decal displacement. Scale, root transform, normalized chassis dimensions, Screen center/four corners/projected quad, and Dock world position/quaternion remain invariant. Each missing chassis role is rejected.

The same checks compare final v3.1 against the corrected BackGlass-only checkpoint: PASS. Screen geometry and the Dock source transform are unchanged. No ScreenPortal or charger compensation was introduced.

## Front stainless correction

Root cause: v3's nominal glass inset was 0.25 mm, but its front black support extended 0.10 mm farther outward; the outer steel bevel consumed another 0.06 mm. Only **0.09 mm flat steel** remained exposed from the front.

Compared neutral baseline / B / C at 0.09 / 0.40 / 0.50 mm. Selected **B, 0.40 mm**, the smaller candidate with a clearly readable perimeter in the neutral front render. C added width without an obvious benefit. The user subsequently accepted the current front perimeter as Safari PASS.

Final front glass/support inset: **0.46 mm**; front outline **57.68 × 114.28 mm**, radius **6.54 mm**. Outer steel stays **58.6 × 115.2 mm**, radius **7.0 mm**, bevel **0.06 mm**. Concentric corner centers are preserved. Screen bounds/position and rear outline do not change. No additional steel lip, chrome ring or steel-material brightening was introduced.

Occlusion-aware direct-front rays, 0.002 mm sample step, measure **0.400 mm on each of four straight edges and four corner midpoints** in both source and exported mesh. The same audit measures A at 0.090 and C at 0.500 mm. No corner blobs or crossings observed in close-ups. These tests measure flat steel exposure, not merely nominal glass inset.

## Power correction

The mesh existed, exported visibly, with `MAT_ButtonMetal` and valid normals; it was effectively buried because its top was exactly flush with the rail. It was not a missing-material or hidden-export problem.

| glTF mm | Before | Final |
| --- | --- | --- |
| Power origin | (15.8, 57.45, 0) | **(15.8, 57.65, 0)** |
| Power dimensions X × Y × Z | 10.4 × 0.30 × 2.6 | unchanged |
| Top rail Y | 57.60 | unchanged |
| Resting button top Y | 57.60 | **57.80** |
| Resting protrusion | 0.00 | **+0.20** |
| Fully pressed protrusion | −0.16 | **+0.04** |
| Resting button bottom Y | 57.30 | **57.50**, seated 0.10 below rail |

Only the semantic Power transform moved +0.20 mm along glTF +Y. Local basis, material, geometry, hit dimensions/offset and 0.16 mm travel remain unchanged. Resting and fully pressed close-ups show the metal button. The existing housing clears its full stroke. No floating gap, frame intersection or coplanar face detected. The existing padded Power hit box remains outside Screen bounds.

## Audits, regression tests and deterministic export

Source and reimported GLB: zero reported cross-object crossings, non-adjacent self-crossings, positive-area coplanar overlaps, button-stroke crossings, conservative charger/mute-envelope crossings, unexpected solid non-manifold edges, invalid normals, degenerate triangles or loose vertices. Flat decal/text boundaries are intentional. AABB overlaps remain warnings, not penetration claims. Surface tests are not a formal solid-containment proof or browser depth-buffer certification.

Mesh-buffer comparison against the corrected BackGlass checkpoint: only `FrontGlassGeometry` and `PhoneBodyGeometry` changed; only `PowerButton` transform changed. StainlessFrame, bottom grilles, Dock, top jack/microphone, cameras and remaining controls have unchanged mesh buffers and transforms.

PASS:

```sh
npm run build
npm run test:seed
git diff --check
node --test scripts/blender/iphone4_contract.test.mjs src/hero/*.test.mjs src/device/experienceLifecycle.test.mjs
```

Eleven test files pass: normalization, semantic/physical model, presentation readiness, ScreenPortal projection/rear visibility, Power routing, mute reset, Hero loops, materials, halo, spill, lifecycle. Real-GLB portal math maximum corner error: 1.61e−13 CSS pixels. Additional Power assertions check protrusion, seating and hit-volume/Screen separation. No dedicated browser charger-animation test was available.

Full preview build and `--no-render` rebuild produce identical bytes under Blender 5.2.1 LTS:

`b815054940675551a04d908f122cf88567774bf50532405034c8f300324b6b80`

Final asset: **1,609,640 bytes; 26,273 triangles; 19 meshes; 20 nodes; 37 primitives; 12 materials; one 943 × 1100 texture.** All original semantic node/material names retained. Canonical axes/origin unchanged. Model checkpoint message: `refine iphone4 production model v3.1`.

Rebuild with:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python-exit-code 1 --python scripts/blender/build_iphone4.py
```

Append `-- --no-render` for the same export without previews. `-- --steel-candidate=0.09` / `0.40` / `0.50` writes candidate previews/audit only, never replacing production GLB.

## Exact files touched in this continuation

Code/asset:

- `scripts/blender/build_iphone4.py`
- `scripts/blender/audit_iphone4.py`
- `scripts/blender/iphone4_contract.test.mjs`
- `src/assets/hero/iphone4/iphone4.glb`
- `src/hero/iphone4Normalization.ts`
- `src/hero/iphone4Normalization.test.mjs` (new)
- `src/hero/ProductionIPhone4Model.tsx` (normalization-error forwarding only)

Audit outputs under `src/assets/hero/iphone4/working/audits/`: `v31-source.json`, `v31-export.json`, `v31-report.md`.

Preview files under `src/assets/hero/iphone4/working/previews/`: `front.png`, `front-3q.png`, `front-3q-left.png`, `front-edge.png`, `front-steel-edge.png`, `left.png`, `right.png`, `back.png`, `back-3q.png`, `back-edge.png`, `top.png`, `top-3q.png`, `top-power-button.png`, `top-power-button-pressed.png`, `bottom.png`.

Each of the three preview subdirectories `v31-candidates/0.09/`, `v31-candidates/0.40/`, `v31-candidates/0.50/` contains these generated files: `front.png`, `front-3q.png`, `front-steel-edge.png`, `top.png`, `top-3q.png`, `top-power-button.png`, `audit.json`.

Existing `v3-source.json`, `v3-export.json`, `v3-before.json`, `v3-report.md` remain prior-stage evidence. No `src/device`, state, app, media, ScreenPortal, charger, Power routing, lighting, halo, spill or lifecycle source changed.

## Safari status

**User-confirmed Safari PASS (2026-09-11).** The explicit observations are that the front steel no longer reads as a hairline and ScreenPortal remains functional. The user authorized this model checkpoint.

Earlier Safari WebDriver attempts were blocked because **Allow remote automation is disabled**. No successful automated Safari session is claimed. The user's acceptance does not establish separate automated coverage of 360° rotation, three-second boot hold, sleep/wake, or charger/recharge appearance; numerical regression coverage and its limits are documented above. The earlier v3 report remains historical evidence, superseded by this acceptance status.

QA URL: `http://localhost:5173/?heroHardwareDebug=1&screenPortalDebug=1&heroLifecycleDebug=1`.
