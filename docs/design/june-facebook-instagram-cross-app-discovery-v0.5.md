# June Facebook to Instagram Cross-App Discovery v0.5

## Purpose

This optional, missable thread connects June's established Facebook presence to the same canonical identity on the newly launched Instagram. It expresses an October 2010 transition between an established social network and a sparse new photo service without forcing discovery, following or photography interest onto the user.

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

The cross-app relationship is an `ACTIVE DATA LINK`: both Facebook and Instagram resolve `CORE_SOCIAL_CHARACTERS.june`, and both derive `junephoto` from its central `socialHandles.instagram` field. There is no `instagram-june`, `june2` or parallel identity record.

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

## Shared media policy

Approved June media may later be referenced through a shared character-media registry when a historically audited Instagram profile or photo surface needs it. v0.5 does not import, copy or duplicate any image: the known-account model requires no avatar, and the exact other-user Profile/Avatar IA remains HOLD. A neutral development placeholder is preferable to asserting that an existing image is June's launch-era Instagram avatar without a separate suitability decision.

## User-projection check

The copy describes June's own early adoption. It does not say that the user likes photography, wants Instagram, shares June's interests, intends to follow her or plans to participate in the party storyline. No owner profile field, follow relation or content preference is created.

## Optional and missable classification

Status: `OPTIONAL / MISSABLE`.

The experience remains valid when the user never opens Facebook, ignores the seed post, never opens Instagram, or opens Instagram without finding June. No redirect, notification, scheduler event or mandatory task exposes the thread.

## Narrative compatibility

June's Instagram post is independent of `Hey, are you online?`, the June reply trigger, Jack's Friend Request and the deduplicated party invitation. It adds no scheduler event and does not change global timing, unread behavior or any other app.

## Provenance

| Element | Classification |
| --- | --- |
| Instagram launch on October 6, 2010 | `PERIOD-EVIDENCE` |
| June, `junephoto`, account metadata and Facebook copy | `CURATED FICTIONAL` |
| Cross-app discovery pattern | `PERIOD-EVIDENCE-informed` |
| Exact Facebook handle-link presentation | `HOLD` |
| Exact Instagram 1.0 lookup/Profile/Follow IA | `HOLD pending native IA audit` |

The fictional June account is not presented as historical evidence.

## HOLD items

- Exact Instagram 1.0 username-search IA
- Profile navigation chrome for another account
- Follow interaction and relationship mutation
- June profile biography or photo content
- Photographic/avatar assets
- Facebook rich-link or unfurl treatment
