# Foursquare Playability Functional Sweep v0.2

## Scope

This sweep covers Foursquare-local check-in shouts, per-venue check-in records, and minimal Tip opening. User actions do not enter the global scheduler and do not mutate seeded/live friend activity.

## State model

A successful venue check-in stores:

```ts
{
  checkedIn: true,
  checkedInBy: sessionIdentity.name,
  checkInTimestamp,
  shout: string | null,
  pointsAwarded: 1
}
```

Records are keyed by venue ID. `checkInTimestamp` is captured independently at the user action boundary and is not used to rewrite historical seed/live timestamps. The deterministic `+1` remains a functional approximation; exact scoring is HOLD.

## Functional results

| Check | Result | Evidence |
| --- | --- | --- |
| Existing check-in | PASS | A valid unchecked venue creates one record and increments the existing points total by one. |
| Optional shout | PASS | A trimmed plain-text shout is stored with its venue and current identity. The draft is removed after success. |
| Empty shout | PASS | Check-in without a draft succeeds and stores `shout: null`. |
| Duplicate points | PASS | A repeated check-in to the same venue returns the identical state; points and record remain unchanged. |
| Per-venue independence | PASS | A second venue creates its own record and increments points independently. |
| Tip opening | PASS | The seeded Tip can open only from its owning selected venue and can close without changing gameplay state. |
| To-Do / Save | HOLD / NOT IMPLEMENTED | Existing v0.1 evidence confirms To-Dos historically but explicitly leaves exact interaction implementation unresolved. No control or state was invented. |
| Mayor | PASS | `mayorState` remains `otherUser`; check-in never promotes the current user. |
| Badges | PASS | `earnedBadges` remains empty and no artwork/system was added. |
| Ambient activity isolation | PASS | Seed/live friend activity remains observational; user check-in does not append activity or touch its unread count. |
| Scroll and selection retention | PASS (code-level) | Shout/check-in/Tip transitions preserve the existing Places scroll value and selected venue unless navigation explicitly changes it. |
| Suspension/resume | PASS (architecture/code-level) | The existing mounted Foursquare reducer owns the new state; no Home, lock/sleep, app-switch, or reopen transition resets it. Browser interaction was not performed. |
| Session reset | PASS | Reset removes Zoey's check-ins/shouts/points/Tip selection/live activity and restores the one-item ambient seed baseline for Alex. |
| Cross-app isolation | PASS (diff inspection) | Only Foursquare state/container/styles, shared validation assertions, planning, and this evidence document changed. |

## Interaction independence

Automated checks establish that:

- Opening a Tip does not add points.
- Check-in does not close or rewrite the selected Tip.
- A shout does not change Tip content.
- Check-in does not change Mayor or award badges.
- User check-ins do not add or overwrite ambient seed/live activity.
- Duplicate check-in does not alter the stored shout or timestamp.

## Findings

### A — Architecture / Blocker

None found.

### B — Functional

None found by reducer tests, build validation, and diff inspection.

### C — Polish / Historical fidelity

- Exact Foursquare 2.0 shout composer chrome and text limit.
- Exact check-in/Tip typography, buttons, spacing, gradients, and transition behavior.
- Human-readable historical presentation of the stored check-in action timestamp.

These were intentionally not polished.

## HOLD boundaries

- Exact Foursquare 2.0 To-Do/Save interaction.
- Exact points formula.
- Mayor promotion rules beyond the preserved read-only context.
- Badge earning and badge artwork.
- Exact historical app chrome and production icon.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Global scheduler and Cross-App Timeline: unchanged
- Twitter commit/state: unchanged
- Facebook state: unchanged
- Historical artwork: none added or modified

## Checkpoint recommendation

Foursquare v0.2 is ready for a **code-level functional checkpoint**. Manual browser interaction remains NOT TESTED. The umbrella App Playability Expansion remains in progress.
