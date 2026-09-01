# Twitter Historical UI — Checkpoint C1b-1 Suggested Users Typography

## Scope

Checkpoint C1b-1 is a typography-only micro-fidelity pass for the Suggested Users account-discovery list. It does not reconstruct the shared people-row geometry or alter discovery, Profile, Follow, or navigation behavior.

Target: iPhone 4, iOS 4.1, Twitter for iPhone 2010.

## Implemented reconstruction

- Suggested Users display name: `16px / 19px`, weight `700`.
- Classification: `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.
- The rule is scoped to Suggested Users and does not apply to the Profile Following list or other Twitter surfaces.

## Intentionally preserved geometry

The following existing values remain unchanged because the available evidence does not authenticate broader corrections:

- row minimum height: `64px`
- avatar: `48×48`, positioned at approximately `x=9`
- separator: `#bbb`
- white row background
- Follow control: `66×27` minimum frame and existing material
- title, navigation, and scroll behavior

## Secondary text provenance and HOLD status

- Handle typography remains `10px / 13px` — HOLD for exact fidelity.
- Subtitle typography remains `11px / 14px` — HOLD for exact fidelity.
- Per-account subtitles are project-curated/reconstructed descriptors. They are not authenticated Twitter 3.0.x account metadata and are not reinterpreted as Profile biography or category routing.

## Architecture and behavior preserved

- The current flat Suggested Users list remains; category architecture remains HOLD.
- No `Suggested Users -> News -> Accounts` or other hierarchy is introduced.
- The Follow control remains HOLD for exact visual fidelity; its labels, callbacks, follow graph, and count synchronization are unchanged.
- `Search -> Suggested Users -> Profile -> Back -> Suggested Users` remains the canonical functional route.
- Account order and scroll restoration remain unchanged.
