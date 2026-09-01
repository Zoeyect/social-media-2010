# Public Visitor Twitter v0.1 P1c — Public handle and local-first submission

Status: architecture/state and DEV-only mock submission scaffolding. No production-visible publishing interface exists.

## Locked boundaries

The historical Twitter Send path remains local-only: it creates the existing session-player Tweet, closes Compose, and returns to Timeline. A frozen snapshot of that completed local Tweet is retained in an in-memory development registry. Only an explicit development QA action can begin public intent for one of those snapshots. Public failure never changes or removes the local Tweet.

Public identity belongs only to `PublicTwitterState`. It is never initialized from Hero/session identity or raw `experienceSessionId`. The write payload contains only the explicitly entered handle, exact Tweet body, simulated timestamp, simulated elapsed offset, and opaque idempotency key.

## Handle contract

Input is trimmed, one leading `@` is removed, and ASCII letters are lowercased. The resulting value must match `^[a-z0-9_]{1,15}$`. No uniqueness, reserved-name, automatic suffix, or separate display-name behavior exists. The characters and 15-character maximum are **PERIOD-SUPPORTED**; exact target-build account-entry UI is not claimed.

## Mock write contract

The write-side `PublicTwitterSubmissionRepository` is separate from the P1a read repository. Its deterministic in-memory mock returns `accepted_for_publication`, replays the same result for an identical idempotency key/payload, rejects conflicting reuse, and supports explicit DEV/test failure injection. Accepted drafts do not enter the approved P1b archive sample.

There is no network, storage, Supabase, moderation, historical classifier, safety provider, or server approval behavior. Future historical/safety preflight stages have a clear location before repository submission but are not implemented.

## UI and persistence confidence

Production public-publish UI remains **HOLD**. Proposed prompt copy and geometry remain **RECONSTRUCTED/HOLD** and are not rendered. `window.__SM2010_PUBLIC_TWITTER_QA__` exists only in development builds and is implementation scaffolding, not historical UI.

The handle and pending submission are memory-only. A new experience resets both. Same-experience reload persistence remains **HOLD** for the backend/session-persistence phase.
