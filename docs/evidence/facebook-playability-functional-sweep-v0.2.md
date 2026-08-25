# Facebook Playability Functional Sweep v0.2

## Scope

This sweep covers Facebook-local downstream Friend Request behavior, the June message reply path, and plain Feed comments. It does not change live-event timing, global scheduling, system lifecycle, or another application.

## Functional results

| Check | Result | Evidence |
| --- | --- | --- |
| Jack absent before scheduled delivery | PASS | Fresh Facebook state uses `friendRequestState: none` and an empty Friends array. Existing scheduler timing remains unchanged. |
| Jack Accept | PASS | Reducer resolves `pending → accepted`, adds exactly one `{ id: "jack", name: "Jack" }` friend record, and the pending request row disappears. |
| Jack Ignore | PASS | Reducer resolves `pending → ignored`, leaves Friends empty, and the pending request row disappears. |
| Resolved request does not recreate | PASS | Re-delivery assertions preserve accepted/ignored state and do not duplicate Jack. |
| June absent before scheduled delivery | PASS | Fresh state contains no June live thread and uses `juneMessageState: none`. |
| June unread/read/replied lifecycle | PASS | Delivery creates one unread live thread; opening changes unread to read; successful send changes state to replied. |
| June plain-text reply | PASS | Reply is session-local, uses the supplied shared identity name, clears its draft after send, and creates no scripted June response. |
| Feed comment | PASS | A selected Feed item accepts a trimmed plain-text comment attributed to the shared identity and clears its composer afterward. |
| Like/Comment/Friend/Message independence | PASS | Reducer assertions confirm Feed Like/comment actions leave Friends and June state unchanged. Separate Jack branches do not mutate messages or Feed interactions. |
| Scroll retention | PASS (code-level) | Existing scroll position remains unchanged through June reply, comment, and Like transitions. |
| Home/lock/sleep/app-switch retention | PASS (architecture/code-level) | Facebook state remains owned by the existing parent runtime reducer; no lifecycle transition resets it. Actual pointer/device browser interaction was not performed. |
| Session reset and identity isolation | PASS | Reset assertions remove Zoey's Friends, June replies/draft, comments/draft, Likes, and live June thread; the seed owner becomes Alex. |
| Cross-app and scheduler isolation | PASS (diff inspection) | Changes are confined to Facebook state/container styling, its automated validation, and documentation. Timeline and scheduler files are unchanged. |

## A — Architecture / Blocker

None found.

## B — Functional

None found by reducer tests, build validation, and change-scope inspection.

## C — Polish / Historical fidelity

- Exact 2010 Facebook Friends-list chrome.
- Exact message composer, comment row, button, typography, gradient, and spacing treatment.
- Exact period navigation route labels and back-button treatment.

These were intentionally not polished.

## HOLD

- Pixel-exact Facebook 2010 messaging/comment visual evidence.
- Real-browser pointer/touch testing of the complete interaction matrix.
- Any scripted June response, modern Messenger behavior, threaded comments, reactions, or mentions remain excluded.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Historical assets: unchanged
- Global scheduler and timeline definitions: unchanged
- Messages and Twitter: unchanged

## Checkpoint recommendation

Facebook v0.2 is ready for a **code-level functional checkpoint**. Manual browser interaction remains explicitly NOT TESTED and must not be represented as a browser PASS. The umbrella App Playability Expansion remains in progress.
