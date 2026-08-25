# Jack Party Cross-App Narrative v0.4

## 1. Narrative purpose

This design treats Jack's upcoming Friday party as one social event inferred through fragments across Facebook and Twitter. No screen explains the connection or displays a narrative graph. Character behavior, platform choice, shared IDs, and repeated references provide the continuity.

## 2. Shared Jack-party identity

Every party reference means Jack's Friday party following the Wednesday, October 20, 2010 simulation date. The content does not introduce a second Friday, a Saturday event, or a party happening tonight.

The Facebook invitation remains the single stable `facebook-party-invite` record. Alex's post and Matt's Tweet are related narrative fragments, not additional invitations or scheduler events.

## 3. June trigger

June remains the socially active connector. Her existing `Hey, are you online?` Inbox message and any non-empty user reply preserve the v0.3 eligibility path. The later shared invite remains `Party at Jack's Friday. You coming?`. No extra June message is added in v0.4.

## 4. Jack trigger

Jack's scheduled Friend Request remains the second independent eligibility path. Accepting it can unlock the same shared invitation; ignoring it cannot. Jack remains the broadly connected football captain and implied host without being overused in authored content.

## 5. Matt Twitter fragment

Matt posts `jack's party sounds exhausting lol` at 8:30 PM in the pre-session Twitter seed. The lowercase, brief and slightly contextless complaint implies discomfort with a loud or crowded event without labeling Matt or turning him into a generic party hater.

This record replaces one generic filler Tweet, so the existing fourteen-item timeline density and all live-event timings remain unchanged. The content is `CURATED` and appears only on Twitter.

## 6. Alex Facebook post

Alex authors one Facebook record, `alex-jacks-party-friday`:

> anyone going to jack's party friday?

Its `alex` character ID, text, timestamp, visibility, comments and Like membership are stored once in Facebook state. News Feed and Alex Wall select that same object; Detail opens it by the same ID. The casual question complements Alex's dog and everyday-life motif without becoming an event announcement.

## 7. Jay comment

Jay's canonical `jay` identity replies:

> yeah probably

The reply is intentionally ordinary and `CURATED`. It suggests Jay is in the same social orbit without adding music exposition merely to restate his character motif.

## 8. Friend-of-friend privacy rationale

The Alex post alone carries `friends-of-friends` visibility. This period-informed broader audience permits one unknown commenter:

```text
fof-ryan-001
Ryan
EPHEMERAL_FRIEND_OF_FRIEND
```

Ryan replies `yeah everyone's going lol`. He is separately typed, has no `CoreSocialCharacterId`, and is not part of `CORE_SOCIAL_CHARACTERS` or the Character Bible. The ambiguity is mild and has no downstream narrative role. The privacy rationale is `PERIOD-EVIDENCE-informed`; the fictional post and comment are `CURATED`.

## 9. Luca and Chris basketball evidence

Luca's Facebook seed includes one `photoActivity` record stating that he added four photos from pickup basketball. Its underlying `relatedCharacterIds` contains canonical `chris`, reinforcing their existing basketball friendship without explanatory copy.

No image is generated. Exact people-tag chrome is not rendered and remains `HOLD`. Luca's restaurant-server identity remains canonical and is not replaced by the basketball fragment.

## 10. Timing consistency

Matt's reaction and the Facebook seed fragments predate the 12:02–12:17 AM session. The shared invitation may arrive only after a qualifying in-session Facebook action and its existing deterministic delay. All references point forward to Friday, October 22, 2010; the global simulated date and clock remain unchanged.

## 11. Canonical identity rules

Matt, Alex, Jay, Chris, June, Jack and Luca resolve through `CORE_SOCIAL_CHARACTERS` and `CoreSocialCharacterId`. Screen-local duplicates are not created. Ryan uses the separate ephemeral identity structure. Mutable Like, Comment, Friend Request, unread, reply and invite state remains outside the canonical registry.

Baseline Jay and Ryan comments coexist with session-user comments on Alex's post. A new Hero session restores the two baseline comments and removes user additions through the existing Facebook reset path.

## 12. Facebook Events HOLD

Facebook Events existed during the period, but exact Events list, Event Wall, RSVP and invitation chrome remain unaudited and `HOLD`. The v0.3 invitation continues to use Inbox/internal delivery. No modern Event card or full Events product is introduced.

## 13. Provenance classifications

| Element | Classification |
| --- | --- |
| Matt party Tweet | `CURATED` |
| Alex party post | `CURATED` |
| Jay comment | `CURATED` |
| Ryan identity/comment | `CURATED / EPHEMERAL_FRIEND_OF_FRIEND` |
| Alex visibility rationale | `PERIOD-EVIDENCE-informed` |
| Luca/Chris relationship fragment | `CURATED canonical character continuity` |
| Exact tag UI and photo assets | `HOLD` |
| Facebook Events UI | `HOLD` |
