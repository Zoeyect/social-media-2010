# iPhone 4 Historical Reconstruction v3 — geometry checkpoint

Status: production asset replaced; numerical validation passes. **Final acceptance remains pending Safari QA.** No commit made. Started from clean `hero-shell` at `608e2a9` (media checkpoint). Only Blender/model/audit/preview files changed.

The `sm2010-visual-authenticity-qa` skill governed preservation, reference priority, isolated scope, and explicit uncertainty. Supplied `refs/` images are the visual authority; exact sub-millimetre radii, recesses and clearances are **RECONSTRUCTED**, not factory CAD measurements. Existing software, material calibration and Hero lighting remain unchanged.

## 1. Before-model audit and historical inaccuracies

Measured the original GLB and read its construction script before reconstruction. Units below are mm; positions use glTF `(right, top, front)` unless indicated. The original audit is retained in `v3-before.json`.

| Feature | Before | V3 / reference comparison |
| --- | --- | --- |
| Full visible envelope W × H × D | 59.200 × 115.665 × 9.720 | 58.600 × 115.200 × 9.300 |
| Nominal steel outline | 58.6 × 115.2; radius 7.8 | Radius 7.0, straighter corners |
| Glass outline | 58.1 × 114.7; radius 7.55 | Same outline; radius 6.75 |
| Front/rear glass thickness | 0.6 / 0.6 | Preserved; flat, not convex |
| Steel depth / structure | 7.1, solid slab; extra front shoulder made depth 8.05 | 7.1, hollow 1.0-thick perimeter wall |
| Front steel lip | Separate overlapping ~0.3-wide shoulder reaching front 4.5 | Removed; 0.25 outline inset exposes band behind glass |
| Rear steel exposure | Nominal 0.25, partly hidden by overlapping body | 0.25 outline inset; distinct black seat |
| Steel/glass edge bevel | 0.18 / 0.08 | 0.06 / 0.02 |
| Home button | Diameter 10.8, disc 0.10; origin (0, −47.2, 4.68) | Diameter 10.8, disc 0.30; origin (0, −47.2, 4.38); inset face; single square annulus |
| Power | 10.4 × 2.6 × 0.5 at (15.8, 57.7, 0) | 10.4 × 2.6 × 0.3 at (15.8, 57.45, 0); actual housing cut |
| Volume | Diameter 5.2 × 0.5 at (−29.4, 29.5 / 19.2, 0) | Diameter 5.0 × 0.38 at (−29.02, same heights, 0); 10.3 spacing retained |
| Mute | Origin (−29.45, 41, 0); source metal 0.4 × 5.5 × 2.5 | Origin (−29.05, 41, 0); metal 0.3 × 4.8 × 1.0, inset housing; existing runtime ±0.75 travel retained |
| SIM | 15.25 × 3.05 at (29.36, −4, 0), laid over steel | Same proportions, face at x=29.23; actual seam/eject aperture |
| Rear lens / flash | Diameters 5.6 / 2.3, rims 6.1 / 2.6; centres (21.1 / 14.8, 49, −4.78) | Same diameters/XY positions; lens plane −4.51, recessed rings, no island |
| Front lens | Diameter 2.4, rim 2.5; (−10.3, 46.5, 4.78) | Same diameter/XY; front 4.51, inset |
| Earpiece | 10.4 × 1.7; front grille reached 4.89 | Same size; backing at 4.35, grille face 4.50, real aperture |
| Screen | 49.30 × 73.95 × 0.04; (0, 1, 4.68) | Same XY/size; centre front 4.57, face 4.59 |
| Dock anchor | (0, −57.75, 0), quaternion (0.7071068, 0, 0, 0.7071068) | Exactly unchanged |

The older model's overlapping steel/body/glass slabs, asymmetric forward lip, softer corner/bevel treatment and proud optical details fused the layers visually. Bottom-slot backings and button strokes also intersected adjoining geometry. Original audit: 18 cross-object surface-crossing pairs, seven maximum-stroke crossing pairs, nine objects with topology findings. These are geometric findings, not a claim that every intersection was visible from every angle.

## 2–5. Silhouette, glass, band and screen

Flat parallel front/back planes and smaller controlled corner radii replace the softer outline. Hollow steel replaces the full solid slab. The body core is inset to 55.9 × 112.5 × 7.0. Two separate 0.38-thick polymer seats produce visible glass/steel layering without penetrating the core or glass. Front glass ends at +4.65; rear glass ends at −4.63 and flat markings at −4.65. Rear logo offset is 0.02, with no extrusion.

Steel remains 7.1 deep, with 0.06 edge bevels, not barrel-shaped rails. Front/back glass bevels are 0.02. The removed lip is not replaced by a second silver plate. Broad faces use flat shading; bevel geometry carries highlights.

Screen remains 49.30 × 73.95 (2:3; logical 320 × 480). Its XY placement, side bezel width and substantial top/bottom bezel proportions are preserved. Only depth changes: face recessed 0.06 behind the front-glass plane, within a real bezel aperture. No DOM/CSS compensation.

## 6–9. Hardware, cameras, dock and antenna gaps

- Left: distinct circular volume buttons, split non-intersecting plus glyph, smaller mute slider and real cut housings. Runtime mute visuals still replace the source switch, unchanged in code.
- Right: recessed SIM seam/face and a real eject aperture, not stacked discs on solid steel.
- Top: Power housing, centred 3.6 jack aperture/backing, small adjacent microphone. Power local orientation is unchanged.
- Bottom: rectangular 22 × 2.8 30-pin opening with 0.35 corner radius, paired period grille slots with separated warp/weft wires, small crosshead screw details supported by `reference5.png`. No Lightning port or modern circular-hole array.
- Cameras: independent small optical elements and real annular rims recessed into glass apertures. No camera island; original lens/flash spacing retained.
- Dock: anchor position and rotation exactly preserved. Opening now clears the existing 20.8 × 6 × 1.2 connector metal. Backing moved inward to −53.6; tongue depth range 0.86–1.14 stays outside the plug's ±0.6 depth range. Tip/backing clearance ≈0.29. Connector housing ends ≈0.55 below the steel edge with metal spanning the gap. Live connected/recharge appearance is still a Safari check.
- Antenna: original GSM top-left and two lower-side placements retained. Real 0.55 cuts contain 0.45 dark inserts with clearance, rather than dark strips intersecting continuous steel.

Strict envelope tradeoff: Power's resting face is at the top envelope; volume faces are close to flush rather than extending outside the nominal steel outline. Their reference-like raised appearance is **not signed off** by the numerical audit and needs visual acceptance. No invisible hit-volume dimensions were changed to mask this.

## 10–11. Semantic and coordinate contracts

All original 19 semantic nodes remain direct children of `iPhone4`:

`PhoneBody`, `StainlessFrame`, `FrontGlass`, `BackGlass`, `Screen`, `HomeButton`, `PowerButton`, `VolumeUp`, `VolumeDown`, `MuteSwitch`, `RearCamera`, `RearFlash`, `FrontCamera`, `Earpiece`, `HeadphoneJack`, `Dock30Pin`, `AntennaBreaks`, `BottomSpeakerOpenings`, `BottomMicrophoneOpenings`.

SIM/screws remain within StainlessFrame, as before. Mesh-data names now carry the semantic prefix so GLTFLoader's multi-material primitive children also resolve through the existing role resolver. Parent semantic names are unchanged. All roles resolve using the actual unchanged runtime functions. All node scales are +1; no negative scale or orientation compensation. Export basis remains +X right / +Y top / +Z front, origin (0,0,0). Existing normalization produces height 2.82 without rotation.

Final full envelope: **58.6 × 115.2 × 9.3 mm** (float error below 0.000004 mm).

## 12–14. Penetration, coplanar and topology validation

`audit_iphone4.py` runs on source and reimported production GLB. Both reports have:

- 0 strict cross-object surface crossings; 30 AABB warning pairs, all with zero BVH triangle candidates.
- 0 non-adjacent triangle self-crossing findings.
- 0 positive-area coplanar-overlap findings among candidate non-adjacent triangles.
- 0 maximum-depression crossings for Power, Home, VolumeUp and VolumeDown (0.16 stroke).
- 0 conservative runtime-box/shell crossings for existing charger metal, mute recess, ringer endpoint and silent endpoint.
- 0 unexpected non-manifold solid edges, zero-area faces, degenerate triangles, invalid normals or loose vertices.

Cleanup welds duplicate positions, dissolves degenerate edges, triangulates, recalculates normals and runs Blender mesh validation. glTF normal/UV seams intentionally duplicate vertices; audit topology welds a copy. Flat alpha decal/text boundaries are explicitly permitted, not mistaken for holes in solid glass. Coplanar test uses 0.00001 mm plane tolerance and 0.0000001 mm² area threshold; adjacent/shared-edge triangles are excluded. Source/export self-adjacency treats split glTF seam vertices consistently.

These tests detect surface crossings and coplanar candidates, not a formal exhaustive solid-containment proof. Numerical tests and neutral renders do not certify Safari depth-buffer behavior or the whole charger animation. No penetration or z-fighting was observed in the inspected neutral views; live interaction acceptance remains pending.

## 15–16. Metrics and reproducibility

Final GLB: **1,607,588 bytes; 19 meshes; 20 nodes; 37 primitives; 12 materials; 26,279 triangles; one 943 × 1100 rear-logo texture.** Original: 964,692 bytes, 17,279 triangles. Material roles/calibration unchanged. Unused UVs removed from untextured geometry, retaining rear decal UVs.

Blender 5.2.1 LTS generated identical GLB bytes with full preview rendering and a second `--no-render` rebuild. SHA-256:

`5f56b2b6884483dec196daadfed7019262ccd4f8e4818843b69953e6a2e04f05`

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python-exit-code 1 --python scripts/blender/build_iphone4.py
# Same GLB without updating previews:
/Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python-exit-code 1 --python scripts/blender/build_iphone4.py -- --no-render
node --test scripts/blender/iphone4_contract.test.mjs
```

Build script now authors housings/clearances, cleans topology, names primitive data semantically, and gates export with source/roundtrip audits. Neutral deterministic preview rig uses Cycles seed 0; runtime lighting untouched. Audit findings raise an exception (`--python-exit-code 1` makes that fail the CLI).

## 17. Runtime regression results

PASS: `npm run build`, `npm run test:seed`, `git diff --check`.

PASS: all ten test files from:

```sh
node --test scripts/blender/iphone4_contract.test.mjs src/hero/*.test.mjs src/device/experienceLifecycle.test.mjs
```

Covers actual GLB semantic/material names, clean transforms, dimensions, Screen bounds/aspect, Power basis, Dock transform, actual role resolver/normalization; Hero readiness; boot/return loops; pre-boot hold and awake/asleep Power routing; mute reset/indicator state; halo and spill attachment/gating; lifecycle; 16 real-GLB projection/viewport/loop cases and front/rear visibility gates. Maximum numerical portal corner error: 1.61e−13 CSS pixels. No dedicated live charger-animation test exists; unchanged Dock transform and Blender clearance test supply numerical coverage only.

Non-failing warnings: Vite large chunks, Node experimental TypeScript stripping, Blender future `use_nodes` deprecation, validator's deliberate invalid seed/Camera fixtures.

## 18. Preview evidence and comparison

Generated and inspected under `working/previews/`: `front.png`, `front-3q.png` (right), `front-3q-left.png`, `left.png`, `right.png`, `back.png`, `back-3q.png`, `top.png`, `bottom.png`, `front-edge.png`, `back-edge.png`.

Reference comparisons: `front-back-reference.png` for bezel/layer proportions; `front-3q-reference.png` for corners, flat rails and SIM side; `left-reference.png` for mute/round buttons; `top-reference2.png` for jack/microphone/Power; `back-reference2.png` for separate optics/markings; `reference5.png` and `iphone04charge.png` for bottom/30-pin arrangement. Several files named `bottom-reference*` actually depict the top and were not used to infer bottom hardware.

Neutral renders show more rectilinear layering and a recognisable period dock arrangement. Microgeometry remains reconstructed. Original references were not modified.

## 19. Safari QA — blocked, not passed

Safari WebDriver session creation was attempted and retried. Safari refused both because **Allow remote automation** is disabled in Safari Settings → Developer. User assistance is required to enable it. No preferences were changed programmatically.

QA URL: `http://localhost:5173/?heroDebug=1&heroHardwareDebug=1&screenPortalDebug=1&heroLifecycleDebug=1`

Still required: 360° inspect; raised-control appearance; physical hold/sleep/wake; mute endpoints/orange indicator; volume depression; boot/Lock Screen/App portal fit and resize/rear occlusion; connected charger and recharge loop; console/network review. This checkpoint is **not final visual acceptance**.

## 20. Exact changed files

- `scripts/blender/build_iphone4.py`
- `scripts/blender/audit_iphone4.py` (new)
- `scripts/blender/iphone4_contract.test.mjs` (new)
- `src/assets/hero/iphone4/iphone4.glb`
- `src/assets/hero/iphone4/working/audits/v3-before.json` (new)
- `src/assets/hero/iphone4/working/audits/v3-source.json` (new)
- `src/assets/hero/iphone4/working/audits/v3-export.json` (new)
- `src/assets/hero/iphone4/working/audits/v3-report.md` (new)
- `src/assets/hero/iphone4/working/previews/front.png`
- `src/assets/hero/iphone4/working/previews/front-3q.png`
- `src/assets/hero/iphone4/working/previews/front-3q-left.png` (new)
- `src/assets/hero/iphone4/working/previews/left.png`
- `src/assets/hero/iphone4/working/previews/right.png`
- `src/assets/hero/iphone4/working/previews/back.png`
- `src/assets/hero/iphone4/working/previews/back-3q.png`
- `src/assets/hero/iphone4/working/previews/top.png`
- `src/assets/hero/iphone4/working/previews/bottom.png`
- `src/assets/hero/iphone4/working/previews/front-edge.png` (new)
- `src/assets/hero/iphone4/working/previews/back-edge.png` (new)

No `src/hero` runtime source, `src/device`, `src/state`, media, Notification, timeline or app files changed. No staging or commit. Generated Python cache was moved outside the repository to a temporary audit directory.
