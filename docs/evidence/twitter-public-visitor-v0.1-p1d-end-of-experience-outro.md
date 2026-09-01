# Public Visitor Twitter v0.1 P1d — End-of-experience outro prototype

Status: **PROJECT UX / RECONSTRUCTED** prototype. This is not historical Twitter UI and is not production-backed.

## Lifecycle boundary

Only the normal T+15-minute battery terminal path pauses destructive reset. After the existing 1% warning, the simulated phone reaches `shutdown` and remains black while the project-level outro is active. Application and Twitter state, local player Tweets, and frozen P1c snapshots remain available. Skip, success completion, failure cancellation, or withdrawn completion all converge on the same canonical destructive reset function and then return to Hero.

Manual power-off bypasses the outro and invokes that canonical reset immediately. Device-event delivery is disabled during `shutdown`, so no realtime activity can advance during the outro.

## Selection and consent

Eligibility is exactly `origin === "user"`; seed, realtime, visitor, reply-only, and Retweet activity are excluded. Stable local Tweet IDs resolve both the immutable Timeline text and P1c frozen snapshot. Zero eligible Tweets bypass the flow. One or many begin unselected, and selection is limited to one.

The project-shell flow requires selection, separate public-handle entry, and a final confirmation showing exact Tweet text, `@handle`, and persistence/visibility copy. Hero identity is neither displayed as attribution nor included in the write payload. All copy and project-shell geometry are **RECONSTRUCTED PROJECT UX**.

## Mock-only behavior

Submission uses the P1c `PublicTwitterSubmissionRepository`; accepted results never enter the P1b approved sample. Failure retains the local Tweet, frozen snapshot, handle, and idempotency key for retry. The mock repository now supports immediate withdrawal and records the mock submission as withdrawn.

**WITHDRAWAL IS NOT PRODUCTION-BACKED.** No network, Supabase, durable public persistence, moderation, historical classifier, retention policy, or enforceable server deletion exists. Production publishing remains blocked until withdrawal can be honored by a real backend.

Early-exit discoverability remains **HOLD**. This prototype runs only at the normal terminal ending.
