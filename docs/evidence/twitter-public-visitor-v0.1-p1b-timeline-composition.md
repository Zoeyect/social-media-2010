# Public Visitor Twitter v0.1 P1b — Timeline composition

Status: implemented with DEV / MOCK / NON-CANONICAL fixtures.

## Ownership and lifecycle

`App` owns `PublicTwitterState` separately from canonical `TwitterState`. A valid restored `experienceSessionId` starts a non-blocking mock repository load. Ready data is sampled deterministically; load failure leaves the canonical Timeline unchanged and has no visible error surface.

Public records are never inserted into the canonical seed, realtime scheduler, or `TwitterState.timeline`. A new experience resets local public state and selects again; the same restored experience ID produces the same stored sample IDs.

## Composition contract

- maximum three approved visitor records
- stable FNV-1a-derived ordering keyed by experience ID and archive ID
- stable selected IDs remain unchanged while future-selected records are hidden
- a selected visitor record becomes visible only when `simulatedElapsedMs <= currentExperienceElapsedMs`
- eligible visitor and canonical/session/realtime activities merge by numeric simulated epoch, newest first
- equal-time activities use explicit deterministic precedence: canonical before visitor, then original canonical or selected-ID order
- canonical, realtime, and player activity ordering follows the same simulated chronology
- normal reconstructed Tweet-row anatomy is reused without a badge, tint, or provenance label

The deterministic sampler and pure composition function are isolated in `twitterTimelineComposition.ts`.

This contract supersedes the original groups-of-four insertion zones and the
former rule that visitor content could never occupy the first Timeline row.
Runtime QA demonstrated that fixed placement could expose a future 12:11 AM
visitor Tweet at 12:04 AM and place it between older 11:26 PM and 11:09 PM
records. Placement now uses `simulated2010CreatedAt`/`effectiveAt`; the real
wall-clock `realCreatedAt` value and visible 12-hour timestamp strings never
participate in in-world ordering.

## P1b interaction boundary

Favorite is available as local session interaction because the existing favorite state is an ID set and does not require canonical Tweet insertion. Profile, Reply, Retweet, and Tweet Detail are unavailable for visitor records because those routes currently resolve only canonical Twitter collections. Their action-pane slots preserve the established six-slot geometry but remain non-interactive. This prevents fake visitor profiles and canonical-state contamination.

Public Favorite persistence beyond the current runtime remains out of scope. Visitor Profile, Reply, Retweet, and Detail remain HOLD pending an explicit archive-aware interaction contract.
