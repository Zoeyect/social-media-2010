# Historical Seed Content Layer v0.1

## Result

The session now starts from a centralized, immutable pre-session content baseline. App reducers clone that baseline into session-local state. Runtime interaction mutates only the clone; confirmed manual shutdown or battery shutdown resets each reducer to a fresh clone.

Seed initialization does not call Device Audio, the SMS notification runtime, lock-notification routing, or the Device Event Scheduler. The scheduler and fixed live timeline definitions are unchanged in this task.

The preceding orchestration work was checkpointed first as commit `1735f7f` (`Add cross-app timeline orchestration v0.1`).

## Architecture

The source of truth is `src/data/sessionSeedContent.ts`:

```text
immutable SESSION_SEED_CONTENT
            ↓ clone
app initial state / RESET
            ↓
session-local mutation
            ↓ shutdown
discard mutation → clone baseline again
```

Each content record carries `origin: "seed"` or receives `origin: "live"` when added by runtime delivery. Origin is internal metadata and is not rendered in the historical UI.

Seed content uses explicit curated timestamps. It does not derive historical content time from `Date.now()`.

## Seed inventory

### Messages

One unread, pre-session conversation is present:

| Contact | Text | Time | Status | Origin |
| --- | --- | --- | --- | --- |
| Dad | Are you coming over for dinner tonight? | 5:48 PM | unread | seed |

Messages now keeps a `conversationId` per message and an `activeConversationId` in runtime state. This was required to prevent the Dad seed from absorbing the later Mom message into the wrong conversation.

At T+0 the list contains Dad only and the Messages badge is 1. Opening Dad marks only Dad read and removes that badge entry. Dad remains fully interactive: the user may send additional SMS messages in the thread, but Dad has no scripted reply in v0.1.

At T+60, the existing live event adds Mom / “Home yet?” as a separate unread conversation. If Dad remains unread, the badge becomes 2; if Dad was read, it becomes 1. Replying does not alter unread count. Seed initialization establishes the pre-existing Dad badge state but does not play a sound, animate the badge, create an SMS alert, or create a Lock Screen preview.

### Facebook

The feed baseline contains four sparse, fictional daily-life entries, all before 12:02 AM:

- session owner — “Long day.” — 11:58 PM
- Jack — movie observation — 11:52 PM
- Mia — coffee-shop activity — 11:41 PM
- Eli — reading update — 11:33 PM

The older inbox baseline contains two read threads:

- Eli — “see you tomorrow” — 10:14 PM
- Mia — “send me the photo” — 9:16 PM

Jack's request still starts at `none`. June's live message still starts at `none`. Their existing timeline events create the pending request and insert the new unread June thread only at their scheduled boundaries.

### Twitter

Five chronological seed tweets exist at startup. They cover ordinary transit, reading, weather, a late-night thought, and one Apple-event reference. All occur before 12:02 AM.

The seeded Sam tweet at 12:01 AM remains the only Apple / Back to the Mac hint. The T+390 live tweet is unrelated and receives `origin: "live"`. Midnight ordering explicitly treats 11:xx PM seed items as the previous evening, so the 12:08 AM live item sorts above them.

### Foursquare

The venue and Tip fixtures are now explicit seed records. One ambient pre-session activity exists:

- Mia checked in at Cedar Books — 8:42 PM

The current user still begins with zero points, no check-ins, no earned badges, and `otherUser` mayor state. The T+510 event adds a distinct live activity and increments only the local activity unread count.

### Flickr

The three existing DEV/HOLD photostream fixtures are formalized as seed records. Their timestamps are now before the session boundary:

- Evening Streetlight — 11:54 PM
- Cup and Notepad — 11:27 PM
- Platform — 10:49 PM

No raster, photography, or provenance claim was added.

### Tumblr

The three existing dashboard fixtures are formalized as seed records at 11:51 PM, 11:36 PM, and 11:18 PM. The T+630 `late-note` record is absent from the seed and is appended once with `origin: "live"` when its timeline event arrives.

### Instagram

The explicit seed remains:

- photos: 0
- followers: 0
- following: 0

No Instagram activity or content was introduced.

## Seed/live boundary

| Content | Seed at T+0 | Live delivery |
| --- | --- | --- |
| Dad SMS | yes, unread; initial badge 1 | none |
| Mom / Home yet? | no | T+60 SMS path |
| Older Facebook feed/inbox | yes | none |
| Jack request | no | T+150 internal event |
| June message | no | T+270 internal event |
| Initial Twitter items | yes | none |
| Late-night Twitter update | no | T+390 internal event |
| Foursquare ambient activity | yes | none |
| June/Night Owl activity | no | T+510 internal event |
| Initial Tumblr posts | yes | none |
| Tumblr late note | no | T+630 internal event |

Seed data is never registered as a `DeviceEvent`. Live IDs are absent from their app seed arrays, so scheduler catch-up cannot duplicate seed records.

## Reset and mutation isolation

Messages, Facebook, Twitter, Instagram, Foursquare, Flickr, and Tumblr use factory-based initialization or reset paths. Arrays, message records, photo comments, venue Tips, and other mutable structures are copied into each new state. Like, Favorite, check-in, read, draft, selected-view, delivered-content, and scroll mutations therefore remain session-local.

The established shutdown phase still owns application reset. No new persistence layer or reset coordinator was introduced.

## Provenance classification

| Item | Classification |
| --- | --- |
| Seed/live architectural separation | PROJECT READY |
| Seed content copy and exact timestamps | CURATED |
| `origin` integrity metadata | PROJECT READY |
| Existing third-party UI chrome | HOLD under existing app evidence |
| Existing Flickr visual fixtures | DEV/HOLD, unchanged |
| Mom SMS delivery mechanics | HISTORICAL READY per existing SMS audits |
| Exact fictional social history | CURATED, not historical fact |

## Bug discipline

- **B fixed:** a Dad seed in the former single-conversation model would have mislabeled Mom and mixed both contacts. Messages now routes by conversation ID.
- **B fixed:** initial Twitter, Tumblr, and Flickr fixtures previously included timestamps after 12:02 AM despite being visible at startup. Seed timestamps are now explicitly before the session boundary.
- **B fixed:** opening any Messages conversation could have cleared the active SMS unread state. Read clearing now requires the notification message's actual conversation to be visible.
- **B fixed:** the Messages badge previously initialized and reset to empty independently of seeded unread state. It now derives its baseline from unread seed SMS records and stays synchronized with per-message read state.
- **C/HOLD:** exact fictional wording, row density, and fine timestamp choices remain curated content decisions.

No A-class architecture issue remains from code-level verification.

## Validation

- `npm run build`: PASS
- `npm run test:seed`: PASS
- `git diff --check`: PASS
- Clean seed cloning and independent state instances: PASS
- Messages Dad unread badge, interactive thread, Mom live boundary, and reset: PASS
- Facebook Jack/June pre-delivery absence: PASS
- Twitter single Apple reference and live-item idempotency: PASS
- Foursquare seed activity with untouched user gameplay state: PASS
- Tumblr seed/live ID separation: PASS
- Flickr seed origin and pre-session timestamps: PASS
- Instagram empty baseline: PASS
- Seed module has no Audio, notification, or scheduler dependency: PASS
- `src/state/deviceEventScheduler.ts` and `src/data/sessionTimeline.ts` unchanged from orchestration checkpoint: PASS
- Historical assets changed: none

The repeatable state checks live in `scripts/validate-seed-content.mjs` and execute through Vite's TypeScript module loader. Browser interaction was not claimed because no browser connection was available in the current environment.
