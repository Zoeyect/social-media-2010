# Public Visitor Twitter v0.1 — P1a Read-Only Architecture

Status: architectural foundation only. No runtime Timeline integration.

## Ownership boundary

Twitter content has four conceptually separate sources:

1. canonical historical seed (`seed`)
2. canonical realtime scheduler (`live`)
3. current experience player content (`user`)
4. persistent public visitor content (`public_visitor`)

P1a does not rename or migrate the three existing origins. The public visitor domain and repository are separate from `TwitterState`, canonical seed content, and the session scheduler.

## P1a implementation

- `PublicVisitorTweet` is the approved UI-facing domain record.
- `PublicTwitterPostDto` contains transport/schema-shaped fields.
- The mapper owns snake_case to camelCase conversion and filters malformed, non-approved, or deleted records.
- `PublicTwitterRepository` exposes read-only `listApprovedPosts` behavior.
- The mock repository is deterministic, immutable, and has no network or browser-storage dependency.
- Three fixtures are classified `DEV / MOCK / NON-CANONICAL` and exist only for architectural validation.
- `PublicTwitterState` remains independent from canonical `TwitterState`.
- `RESET_PUBLIC_SESSION` clears local public state and never represents deletion of a persistent archive.

## Explicitly absent

- real backend or Supabase connection: HOLD
- public Tweet writes: not implemented
- moderation UI or write contract: not implemented
- Timeline composition/sampling: deferred to P1b
- visitor Profile, stats, Follow, or verification: unsupported
- public handle selection: deferred; remains `null`

## Temporary text contract

Read-side validation follows the current application contract of at most 140 UTF-16 code units. Code-point/grapheme semantics and backend parity remain a future contract decision.

## Historical classification

The fixture text is generic period-plausible development material. It is not authenticated history, canonical narrative content, or evidence of a surviving visitor archive.
