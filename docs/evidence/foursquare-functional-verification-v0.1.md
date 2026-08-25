# iOS 4.1 Foursquare Functional Verification v0.1

## Scope

- Validate Foursquare v0.1 functional behavior against frozen system foundation and v1 constraints.
- No feature additions and no visual fidelity work were changed in this pass.
- Only issues classified as:
  - `A` blocker/architecture
  - `B` functional
  - `C` polish/historical fidelity
  were recorded.

## Validation commands

- `npm run build`: PASS
- `git diff --check`: PASS

## Test results

| Test | Result | Notes | Severity |
|---|---|---|---|
| 1. Launch | NOT TESTED | Dev route and runtime launch were not manually exercised in browser in this pass. | A |
| 2. Places list | NOT TESTED | Manual interaction not run. | B |
| 3. Venue detail | NOT TESTED | Manual interaction not run. | B |
| 4. Scroll restoration | NOT TESTED | Manual interaction not run. | B |
| 5. Check-In | NOT TESTED | Manual interaction not run. | B |
| 6. Duplicate check-in | NOT TESTED | Manual interaction not run. | B |
| 7. Multiple venues | NOT TESTED | Manual interaction not run. | B |
| 8. Home suspension | NOT TESTED | Manual interaction not run. | B |
| 9. Lock / sleep / unlock | NOT TESTED | Manual interaction not run. | B |
| 10. Session reset | NOT TESTED | Manual interaction not run. | B |
| 11. Cross-app isolation | NOT TESTED | Manual interaction not run. | B |

## A bugs

- No A-class blocker confirmed in this pass.

## B bugs

- No B-class functional bug confirmed in this pass because runtime-level manual checks were not executed.

## C backlog (hold/fidelity / polish)

- Historical scoring exactness
- Badges
- To-Dos
- Geolocation behavior
- Maps integration
- Production icon availability
- Exact Foursquare chrome
- Typography and gradients
- Pixel-level geometry

## Freeze recommendation

- Not ready for functional freeze from this pass.
- Requirement: run the manual browser matrix under `/?devApp=foursquare&autoOpen=1` and re-record PASS/FAIL states.

