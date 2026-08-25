# Facebook Party Invitation Storyline v0.3

## Scope

This storyline is Facebook-local. It adds one shared party invitation unlocked by either replying to June's existing Inbox message or accepting Jack's existing Friend Request. It does not alter the Cross-App Timeline definitions or timing, global scheduler architecture, Messages, Twitter, other apps, battery behavior, Lock Screen behavior, or notification routing.

## Shared state

`FacebookState` owns one canonical `partyInviteState`:

- `none`: neither trigger has qualified
- `eligible`: at least one trigger qualified and delivery may be pending
- `delivered`: the invitation exists in Inbox and is unread
- `opened`: the invitation thread has been opened and read
- `dismissed`: reserved for a later audited dismissal interaction

The independent source flags `partyInviteEligibleFromJune` and `partyInviteEligibleFromJack` preserve why the story became eligible. They do not create separate invitation records or delivery states.

Facebook Feed, Inbox, and accepted-friend records reference canonical identities with `CoreSocialCharacterId`, allowing narrative contacts such as June and Jack without weakening the field to an unrestricted string. `CoreSocialFriendId` remains the backward-compatible five-person subset for logic that specifically means Katie, Matt, Alex, Chris, or Jay.

## Trigger paths

### June reply

After `Hey, are you online?` has arrived, any non-empty submitted reply sets June eligibility. No keyword classification is used.

### Jack acceptance

The `pending -> accepted` Friend Request transition sets Jack eligibility. `Ignore` leaves the shared invitation in `none` unless June already qualified independently.

Both paths converge on event and Inbox record ID `facebook-party-invite`.

## Delivery and deduplication

The first valid trigger schedules `facebook-party-invite` through the existing device event queue with `sourceApp: facebook`, `deliveryPolicy: internal`, and `CURATED` provenance. The scheduler's stable-ID deduplication prevents two pending records, while Facebook state rejects delivery unless the shared state is exactly `eligible`. Once delivered or opened, the second trigger cannot schedule another invitation.

Delay is deterministic per normalized session identity and falls inclusively between 20 and 60 simulated seconds. The implementation uses a stable FNV-style hash; it does not call `Math.random()` or create a component timer.

## Content and surface

The invitation is delivered as an existing-style June Inbox thread:

> Party at Jack's Friday. You coming?

The copy is classified `CURATED`. June functions as the socially active connector, while accepting broadly connected Jack plausibly enters the same party circle. This interpretation remains implicit in UI.

Exact October 2010 Facebook Events invitation chrome remains HOLD, so no modern Event card is introduced. Optional reply branching and downstream party gameplay also remain HOLD. The current generic non-June-reply thread treatment is retained.

## Read behavior

Arrival creates one unread Inbox thread and contributes to the existing derived Facebook Inbox count. Opening `facebook-party-invite` uses existing message semantics to mark the thread read and moves the shared state to `opened`. No iOS or Lock Screen notification is generated.

## Session continuity and reset

Facebook state is owned by the persistent top-level App reducer, so Home navigation, app switching, lock, sleep, and in-session suspend/resume do not recreate it. The pending delivery event lives in the existing session event queue and therefore survives those same transitions.

The existing new-Hero reset clears Facebook reducer state and replaces the device event queue with the next session baseline. June eligibility, Jack eligibility, invite state, invite thread, and any pending `facebook-party-invite` event therefore do not cross sessions.

## Validation coverage

Seed validation covers both eligibility paths, the negative Ignore path, deterministic delay bounds, no early delivery, stable-ID queue deduplication, shared dual-trigger state, navigation survival, at-most-once Inbox delivery, unread-to-opened behavior, and reset. Existing scheduler timeline assertions continue to lock architecture and Cross-App Timeline timing.
