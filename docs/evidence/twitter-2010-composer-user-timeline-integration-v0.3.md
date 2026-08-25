# Twitter 2010 Composer & User Tweet Timeline Integration v0.3

## Scope and result

This Twitter-local correction implements the period-supported New Tweet information architecture and session-local user publishing. It does not change the global scheduler, live-event definitions or timing, System Foundation, Messages, or another app.

## Corrected composer IA

The composer now follows this structural order:

1. shared device Status Bar;
2. `Close | New Tweet | Send` navigation;
3. compact current-account line;
4. Tweet text area;
5. `attachments (...)` disclosure and remaining-character counter;
6. dark 2×3 HOLD tools panel: Camera, Photo Library, Geotag, Usernames, Hashtags, and Shrink URLs.

The previous independent avatar/name row was removed. The current-account label derives a session-local handle by normalizing `sessionIdentity.name` (for example, `Zoey` becomes `@zoey`). This is a clearly CURATED functional identity; exact handle typography and historical account presentation remain HOLD. No icon or texture artwork was fabricated.

Compose and Reply share the same shell but retain separate state. Timeline Compose opens a blank draft. Reply pre-fills the target handle. Both enforce the 140-character limit and show remaining characters in the attachment strip.

## User Tweet record

A successful normal Compose action creates exactly one Twitter-local record with:

- stable session ID (`twitter-user-tweet:<sequence>` semantics; implementation uses `twitter-user-tweet-<sequence>`);
- `displayName` from `sessionIdentity.name`;
- a CURATED session handle derived from that identity;
- plain-text body;
- simulated device timestamp and numeric creation instant;
- `origin: "user"`, `type: "tweet"`, and `contentStatus: "USER"`.

Publishing does not register a device event and does not touch delivered scheduler IDs. It closes the composer, returns to Timeline, clears the New Tweet draft, and moves the explicit posting result to the current chronological position.

## Unified Timeline ordering

The Timeline selector combines without cloning source definitions:

- seed Tweets;
- scheduled live Tweets;
- user-authored Tweets;
- native current-user Retweet activities.

Ordinary Tweet activity uses `createdAt` when present, otherwise the record's curated historical timestamp. Native Retweet activity uses `retweetActionTimestamp` while retaining the original Tweet timestamp separately. Items sort newest-first with stable ID tie-breaking.

Consequently, a user Tweet at 12:07:15 appears above older material at posting time, while a scheduled 12:08 Tweet later sorts above it. Passive live delivery retains the stored Timeline scroll position and does not dispatch a scroll-to-top action. A new-items indicator remains HOLD.

## Interaction and lifecycle boundaries

User Tweets reuse Detail, Favorite, Reply, and the existing action row where safe. Self-Retweet is disabled because exact target-client behavior remains unresolved; no invented behavior is supplied.

User Tweets and their sequence live in root-owned Twitter state, so they survive Detail, tab switching, Home suspension, app switching, and lock/sleep/resume. The existing Twitter `RESET` transition reconstructs seed state and removes user Tweets, drafts, Retweets, Favorites, replies, live additions, and sequence state for a new Hero identity.

## Classification

### READY / strongly supported

- New Tweet with Close and Send.
- 140-character maximum and remaining-character count.
- compact current-account context.
- attachment disclosure plus six-category 2×3 tools structure.
- user-authored Tweet entry into a newest-first Timeline.
- chronological coexistence of seed, live, user, and Retweet activity.

### HOLD / approximation

- exact composer texture, gradients, typography, geometry, and control rasters;
- exact `attachments (...)` semantics;
- session handle derivation and exact account-line presentation;
- exact tool availability for the precise target point release;
- immediate publish refresh animation and passive-new-item indicator;
- exact self-Retweet client behavior.

## Validation

Automated state coverage checks blank Compose, Reply prefill isolation, the 140-character boundary, one-record publishing, later-live ordering, unified Retweet ordering, self-Retweet rejection, reset behavior, and unchanged seed/live definitions.

Manual browser interaction is not claimed by this document.

