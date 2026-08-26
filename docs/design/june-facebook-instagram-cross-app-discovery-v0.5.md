# June Facebook to Instagram Cross-App Discovery v0.5

## Historical rationale

The simulation begins on October 20, 2010, fourteen days after Instagram launched on October 6. A socially active fictional character trying the new photo service and mentioning it to existing Facebook friends is therefore plausible. The launch context is `PERIOD-EVIDENCE`; June, her account and her post are `CURATED` fictional material.

## Facebook bridge

June has one pre-session Facebook seed post dated October 19, 2010 at 11:44 PM:

> finally got instagram lol @junephoto

The post uses canonical character ID `june` and contains only a plain-text handle. It does not use `IG`, `follow my IG`, `link in bio`, `DM me`, a rich preview, an Instagram card or influencer language. Exact October 2010 Facebook-to-Instagram unfurl behavior remains `HOLD`.

## Canonical Instagram handle

`junephoto` is stored once in June's `CORE_SOCIAL_CHARACTERS` metadata under `socialHandles.instagram`. It is lowercase, deterministic, session-independent and does not imply an exact age or branded persona.

The Facebook post derives its handle from that field. Instagram's known-account seed also derives its username and `june` character reference from the same canonical object, preventing a second June identity.

## Instagram account mapping

Instagram begins with one familiar known-account record:

| Field | Value |
| --- | --- |
| Canonical character | `june` |
| Username | `junephoto` |
| Display name | June |
| Existing photos | 0 |
| Classification | `CURATED` |
| Discovery UI | `HOLD` |
| Follow UI | `HOLD` |

`selectInstagramKnownAccountByUsername` provides a deterministic data lookup that accepts a plain username or leading `@`. This is a model-level discovery boundary, not a claim about exact Instagram 1.0 search chrome.

## Discovery boundary

The current Instagram implementation has Feed, Profile and first-photo creation but no audited launch-era username search route. v0.5 therefore does not invent Explore, Suggested for You, contact sync, follower recommendations, a modern search page or automatic following.

The narrative path currently stops at evidence-safe data readiness:

```text
June Facebook post
  -> plain @junephoto clue
  -> Instagram canonical account mapping
  -> exact lookup UI HOLD pending Instagram 1.0 IA audit
```

A future IA audit may expose the lookup through historically supported chrome without changing the canonical mapping.

## Instagram newness

The user's Instagram baseline remains zero photos, zero followers and zero following. June is the only familiar canonical account in the Instagram model, and her account has no photographic fixture. No image asset is generated and no other character is populated. The result remains intentionally sparse: one person the user knows has arrived before them.

## Narrative compatibility

June's Instagram post is independent of `Hey, are you online?`, the June reply trigger, Jack's Friend Request and the deduplicated party invitation. It adds no scheduler event and does not change global timing, unread behavior or any other app.

## HOLD items

- Exact Instagram 1.0 username-search IA
- Profile navigation chrome for another account
- Follow interaction and relationship mutation
- June profile biography or photo content
- Photographic/avatar assets
- Facebook rich-link or unfurl treatment
