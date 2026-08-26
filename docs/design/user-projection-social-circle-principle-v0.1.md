# User Projection & Social Circle Design Principle v0.1

## Status

PROJECT-LEVEL CONTENT DESIGN CONSTRAINT

This principle applies across every app, seed fixture, narrative event, profile, notification, and future content expansion. It is a design boundary, not UI copy.

## Internal design statement

> This is your 2010 phone. These are the kinds of friends you might have.

Never display or explain this statement in the product. It guides authorship and review.

## Core principle

The session owner is a projection surface. Keep the user's identity deliberately under-specified so different players can inhabit the same phone without being told who they are.

The surrounding social circle may be specific, memorable, and internally consistent. Friends can have recognizable interests, habits, roles, relationships, and voices because those details create the world around the player rather than defining the player.

## User projection boundary

Do not canonically assign the session owner:

- a hobby, fandom, or taste
- a school, course, employer, occupation, or career goal
- a fixed personality, mood, or social archetype
- a romantic interest, relationship status, or orientation
- a party preference or assumed attendance
- a personal history that the player did not create
- authored speech, posts, photos, or status updates that the player did not choose

Device-level historical defaults, such as locale or carrier presentation, do not automatically justify personal profile claims about the user.

## Social circle boundary

The nine canonical social characters remain the primary fictional social circle. Their specificity is intentional and should make the phone feel inhabited.

| Character | Social function | Projection safeguard |
| --- | --- | --- |
| June | Active connector and direct invitation path | Ask open questions; do not prescribe the user's feelings or attendance |
| Jack | Broad social-circle catalyst | Acceptance may unlock access, but not friendship depth or party commitment |
| Katie | Familiar everyday friend | Keep shared plans ordinary and avoid inventing a shared biography |
| Matt | Social observer and public reaction voice | His interests and reactions belong to him, not the user |
| Alex | Casual peer contact | Mentions may invite attention without defining a shared hobby |
| Chris | Loose-tie conversational contact | Avoid obligations that imply the user's job, school, or project history |
| Jay | Familiar social presence | Do not use familiarity to assign identity traits to the user |
| Ben | Peripheral canonical peer | Preserve distance unless the user creates stronger involvement |
| Luca | Distinct friend-authored presence | Keep his interests and circumstances character-owned |

Z.tokyo remains a Facebook-local `AUTHOR_EASTER_EGG`, outside the canonical nine and outside the user's projected identity.

## Open situations and multiple paths

Narrative prompts should create situations rather than conclusions. Prefer:

- questions over declarations about the user
- invitations over assumed attendance
- optional replies over scripted owner dialogue
- several plausible reactions over one personality-coded response
- consequences based on explicit user actions rather than inferred preference

When a single user action unlocks content, that action should establish only what is necessary. Accepting Jack's request establishes connection eligibility; it does not establish closeness. Replying to June establishes engagement; it does not establish enthusiasm for the party.

## App-level application

### Facebook

Friends may post detailed material about themselves. Seed content attributed to the session owner should be absent unless it represents a deliberate, documented setup decision with no identity claim. User-created posts, comments, likes, check-ins, and uploads are valid because the player authors them.

### Twitter

Friend Tweets and mentions may carry character voice. The owner's prior Tweets, bio, location, activity counts, and social graph require special scrutiny because they can fabricate a personal history. New Tweets and favorites created by the player are valid session choices.

### Messages

Contacts may ask open, ordinary questions. Replies should remain player-selected. Family labels can provide a broadly legible social anchor, but conversations must not force occupation, school, romance, hobbies, or personality.

### Instagram and other apps

An empty or sparse owner baseline is preferred to fabricated taste. Discovery of a friend's account does not imply the user's interest in photography, fashion, music, or any other domain. Future app content follows the same distinction between friend specificity and user projection.

## User-originated choices

The following may become session facts after explicit player action:

- text the player sends
- content the player posts or uploads
- likes, favorites, follows, accepts, ignores, and dismissals
- profile fields the player directly edits
- places the player deliberately checks into
- responses selected from clearly optional choices

Store these as session-local outcomes unless a future persistence design is separately approved.

## Shared character media

Canonical character imagery and Facebook-local identity media may be reused through their approved registries. Media associated with a friend describes that friend. It must not be presented as evidence of the user's interests, relationships, attendance, or personal history without an explicit user action.

## Ephemeral contacts

Non-canonical contacts may support period texture or a narrowly scoped interaction. Keep them peripheral, avoid deep invented relationships with the user, and do not use them to bypass the canonical character or user-projection boundaries.

## Narrative restraint

Prefer a small number of legible social cues over a complete biography. Ambiguity is functional: it leaves room for the player to project while specific friends make the world coherent.

## Writing checklist

Before adding or revising content, ask:

- Who authored this statement: the player, a friend, or the system?
- Does it assign the user a hobby, role, mood, history, relationship, or preference?
- Is an invitation still open, or does the copy assume the user's answer?
- Could the same narrative function be achieved by giving specificity to a friend instead?
- Does a trigger infer more than the user's explicit action establishes?
- Is a user-owned profile field necessary, or merely decorative?
- Will the content remain plausible for users with different lives and identities?

## v0.1 content audit

Classification meanings:

- `A`: direct contradiction with the projection boundary
- `B`: mild over-specification or an avoidable personal-history assumption
- `C`: safe or neutral under the current principle

| Class | Surface | Finding | Disposition |
| --- | --- | --- | --- |
| A - RESOLVED | Facebook seed Feed, formerly `owner-late` | The prewritten session-owner post `Long day.` assigned the player authored status and emotional framing | Reassigned as `ben-long-day` to canonical character `ben`; timestamp, order, kind, and seed density preserved |
| A - RESOLVED | Twitter seed timeline, formerly `late-night-user` | The prewritten session-owner Tweet `can't sleep` assigned the player authored speech and a sleep state | Reassigned as `late-night-matt` to canonical character `matt`; timestamp, order, classification, and seed density preserved |
| B | Twitter owner baseline | Fixed follower, Tweet, and favorite counts create an unexplained prior social history | Review with the owner-seed migration; retain for now to avoid runtime and baseline changes |
| B | Twitter owner profile | `United States` is stored as the owner's location rather than only as a device or service locale | Review as a personal-profile default in the next content pass |
| B | Twitter mention, `mention-chris` | `did you ever finish that thing?` implies an unfinished obligation or project, although it stays deliberately vague | Keep for now; rewrite only if future context makes the implied obligation more specific |
| C | Messages family prompts | Dinner and affectionate family exchanges are open prompts and user-triggered replies, not fixed hobbies, work, study, romance, or personality | Retain |
| C | June and Jack party paths | The user may reply, accept, ignore, open, dismiss, or decline; eligibility does not assert party attendance or preference | Retain |
| C | Friend-authored seed content | Friends' school, sport, music, pet, work, and social details belong to those characters | Retain |
| C | User-generated app actions | Posts, replies, comments, likes, favorites, follows, check-ins, and photos reflect explicit player choices | Retain |
| C | Instagram baseline and June discovery | Sparse owner state and discovery of June's account do not assign the user an interest or identity | Retain |
| C | Z.tokyo Facebook cameo | The author easter egg is peripheral and does not define the session owner or canonical nine | Retain |

The audit found no direct assignment of a school, occupation, hobby, romantic preference, or party attendance to the user. The two original `A` findings are resolved by `docs/evidence/user-projection-a-issue-migration-v0.1.md`; neither record remains user-authored seed content.

## Enforcement and next pass

New content must satisfy this principle before entering seed data or a live narrative. Future review should reassess the remaining B-level owner-profile history without changing scheduler architecture or the canonical social circle.
