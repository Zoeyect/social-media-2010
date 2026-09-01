# Public Visitor Twitter v0.1 P1b — Timeline composition

Status: implemented with DEV / MOCK / NON-CANONICAL fixtures.

## Ownership and lifecycle

`App` owns `PublicTwitterState` separately from canonical `TwitterState`. A valid restored `experienceSessionId` starts a non-blocking mock repository load. Ready data is sampled deterministically; load failure leaves the canonical Timeline unchanged and has no visible error surface.

Public records are never inserted into the canonical seed, realtime scheduler, or `TwitterState.timeline`. A new experience resets local public state and selects again; the same restored experience ID produces the same stored sample IDs.

## Composition contract

- maximum three approved visitor records
- stable FNV-1a-derived ordering keyed by experience ID and archive ID
- visitor rows inserted only after groups of four canonical/session activities
- visitor content is never the first Timeline row
- canonical, realtime, and player activity relative order is preserved
- normal reconstructed Tweet-row anatomy is reused without a badge, tint, or provenance label

The deterministic sampler and pure composition function are isolated in `twitterTimelineComposition.ts`.

## P1b interaction boundary

Favorite is available as local session interaction because the existing favorite state is an ID set and does not require canonical Tweet insertion. Profile, Reply, Retweet, and Tweet Detail are unavailable for visitor records because those routes currently resolve only canonical Twitter collections. Their action-pane slots preserve the established six-slot geometry but remain non-interactive. This prevents fake visitor profiles and canonical-state contamination.

Public Favorite persistence beyond the current runtime remains out of scope. Visitor Profile, Reply, Retweet, and Detail remain HOLD pending an explicit archive-aware interaction contract.
