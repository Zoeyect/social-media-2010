---
name: sm2010-visual-authenticity-qa
description: Preserve and verify historical, visual, interaction, media, and continuity authenticity for the SOCIAL MEDIA, 2010 project. Use whenever Codex edits, debugs, refactors, reviews, or implements iPhone 4 / iOS 4.1 device UI or the 2010 Facebook, Twitter, Instagram, Foursquare, SMS, SpringBoard, lock screen, historical media, seeded content, timelines, or related project behavior. Prevent modernization, unsupported historical inference, continuity drift, and unrelated visual changes. Do not use as a generic modern frontend design skill.
---

# SOCIAL MEDIA, 2010 — Visual & Historical Authenticity QA

## Purpose

This skill is a preservation and verification layer for **SOCIAL MEDIA, 2010**.

Its job is not to make the interface more modern, cleaner, more fashionable, or more consistent with current UX conventions. Its job is to preserve the project's intended **October 2010 digital reality**, make only justified changes, and surface uncertainty instead of silently inventing details.

The skill applies to:

- historical UI reconstruction
- frontend implementation and debugging
- interaction behavior
- seeded social content
- cross-app chronology
- device-shell behavior
- media presentation and period treatment
- historical research decisions
- visual regression review
- continuity review
- refactors that could alter historically visible behavior

## Prime Directive

> **Preserve before improve. Verify before infer. Never modernize by default.**

A technically cleaner implementation is not automatically a better implementation if it changes the historical experience.

A historically awkward behavior may be correct and must not be "fixed" merely because a modern product would behave differently.

---

# 1. Canonical Experience Snapshot

Unless a newer project-local canonical source explicitly overrides these values, treat the following as the target experience:

- Project: **SOCIAL MEDIA, 2010**
- Primary device: **iPhone 4**
- OS target: **iOS 4.1**
- Primary experience date: **2010-10-21**
- Primary experience start: **00:02 U.S. Pacific Time**
- Core experience window: approximately **00:02–00:17**
- Historical context: early social-mobile era; do not import later platform conventions backward
- Core social platforms include:
  - Facebook
  - Twitter
  - Instagram
  - Foursquare
- Device-level experience may include:
  - Apple boot
  - lock screen / slide to unlock
  - SpringBoard
  - Home button behavior
  - period-appropriate status/navigation behavior
  - SMS and other seeded device content

The project is a **historical interactive reconstruction and narrative experience**, not a modern redesign inspired by 2010.

---

# 2. Instruction Precedence

When sources conflict, follow this order:

1. User's explicit current instruction
2. Project-local canonical documentation / locked continuity rules
3. Dated primary historical evidence
4. Multiple consistent contemporary secondary sources
5. Conservative reconstruction
6. Modern UX convention — **never use as historical evidence**

If an existing implementation conflicts with a newer locked canonical rule, the canonical rule wins.

Do not treat old generated assets, abandoned mockups, stale comments, or superseded screenshots as canonical merely because they exist in the repository.

---

# 3. Required Preflight Before Editing

Before making a historically visible change, determine:

1. **What exact screen or behavior is being changed?**
2. **Which platform and surface is involved?**
3. **What date/version/device does the change belong to?**
4. **What project-local canonical references already exist?**
5. **What historical evidence supports the requested behavior?**
6. **What must remain unchanged?**
7. **What is the smallest implementation change that can satisfy the request?**

Do not begin by redesigning or refactoring the surrounding UI.

If the request is a bug fix, separate:

- root cause
- required functional correction
- historically visible output
- unrelated cleanup

Do not combine unrelated cleanup with the historical fix unless the user explicitly asks for it.

---

# 4. Historical Evidence Classification

Every non-trivial historical decision must fit one of these confidence levels.

## A — CONFIRMED

Use when supported by strong dated evidence, such as:

- official platform documentation from the target period
- official blog/release material
- dated first-party screenshots
- contemporary screen recordings
- archived official pages
- clearly dated period device captures

Implementation may treat this behavior as canonical unless project-local rules override it.

## B — PROBABLE

Use when direct target-date evidence is incomplete, but the conclusion is supported by:

- multiple independent contemporary sources
- screenshots from very close versions/dates
- period tutorials or reviews that consistently show the same behavior
- adjacent-version evidence with no known conflicting change

Implement conservatively and keep the decision easy to revise.

## C — RECONSTRUCTED

Use when evidence is insufficient and a reasonable reconstruction is necessary.

Requirements:

- choose the least speculative implementation
- avoid adding functionality that is not necessary
- do not present the reconstruction as confirmed fact
- report the uncertainty explicitly
- keep the implementation isolated enough to replace later

## UNKNOWN

Use when the available evidence is too weak even for a responsible reconstruction.

Do not silently invent an answer. Surface the unresolved point to the user.

---

# 5. Evidence Source Hierarchy

Prefer evidence in this order:

1. target-date first-party material
2. target-date contemporary captures
3. same-year first-party material
4. same-year independent contemporary reporting/tutorials
5. close adjacent-version captures
6. later retrospectives with verifiable source material
7. modern recreations
8. memory or assumption

Rules:

- A modern recreation is not proof of a 2010 behavior.
- Search-result snippets are not sufficient evidence for exact UI claims.
- Undated screenshots must not be treated as target-date proof.
- A screenshot from 2011 or 2012 must not be back-projected into 2010 without evidence.
- Desktop behavior must not automatically be transferred to iPhone behavior.
- Web, mobile web, and native-app behavior must remain distinct unless evidence shows equivalence.
- Region/account rollout differences should be considered when sources conflict.

When evidence conflicts, record the conflict rather than averaging it away.

---

# 6. Hard Prohibitions

## DO NOT modernize

Do not introduce or "improve" the project with contemporary conventions unless explicitly requested.

Examples of prohibited default changes:

- modern rounded cards
- excessive whitespace
- modern SaaS dashboard hierarchy
- contemporary typography systems
- modern modal patterns
- current iOS navigation conventions
- current Facebook/Twitter/Instagram interaction patterns
- modern icon replacements
- modern shadows, gradients, easing, motion, or loading treatments
- modern responsive redesign logic that changes the intended iPhone 4 composition

## DO NOT erase period awkwardness

Do not fix a historically correct behavior merely because it appears:

- cramped
- visually dense
- slow
- inconsistent
- skeuomorphic
- low-resolution
- text-heavy
- navigation-heavy
- inelegant by current standards

Historical awkwardness is part of the artifact when supported by evidence.

## DO NOT invent undocumented features

Never add a capability because "Twitter/Facebook probably had it".

Verify feature availability for the target period first.

Examples requiring explicit historical verification include:

- native photo posting/display behavior
- retweet mechanics
- favorites/likes terminology
- threaded replies
- profile header imagery
- location behavior
- push notifications
- camera workflows
- photo viewer behavior
- multitasking behavior

## DO NOT backport later versions

Later UI that looks familiar is not valid evidence for 2010.

## DO NOT perform unrelated visual cleanup

A targeted bug fix must not silently change:

- font size
- line height
- spacing
- icon placement
- border thickness
- image crop
- colors
- navigation hierarchy
- content order
- animation
- character data
- timestamps

unless required by the task.

---

# 7. Change-Scope Rule

Use the **smallest historically correct change**.

Before editing, state internally:

- target behavior
- preserved behavior
- files expected to change
- known regression risks

After editing, inspect the diff for scope creep.

If a fix modifies unrelated components or styles, either:

- justify why it is technically necessary, or
- revert the unrelated edits

Do not use a historical fix as an excuse for architectural cleanup.

---

# 8. Visual Authenticity Checklist

For every historically visible frontend change, inspect the relevant items below.

## Device frame / viewport

- iPhone 4 target geometry remains intact
- expected viewport and scale remain intact
- content is not redesigned around modern phone dimensions
- status bar placement remains period-appropriate
- browser/device chrome is not unintentionally modernized

## Typography

- family matches project canonical/reference
- size remains period-appropriate
- weight is not modernized for aesthetics
- line-height has not drifted
- truncation/wrapping behavior remains plausible for target UI

## Layout

- original density is preserved
- dividers and borders remain correct
- margins/padding have not drifted
- rows retain expected height
- controls remain aligned to period references
- no new cardification or floating-panel logic appears

## Icons / chrome

- icons are period-correct or project-canonical
- icon size and baseline remain correct
- no current platform iconography has leaked in
- tabs, navigation bars, toolbars, badges, arrows, and disclosure indicators match the intended era

## Images

- image crop and aspect behavior remain correct
- thumbnails retain expected dimensions
- no automatic modern border-radius treatment
- no modern image viewer behavior is introduced without evidence
- compressed/period media appearance is not "enhanced" away

## Motion / interaction

- transitions do not become modern merely because smoother animation is possible
- gesture behavior must be supported by target hardware/OS/app context
- loading and failure states should remain period-plausible
- interaction latency may be intentional when part of the reconstruction

---

# 9. Media & Camera Authenticity

Historical media assets are part of the reconstruction and must not be treated like contemporary polished photography.

When the project specifies a **2008–2010 Camera Treatment** or device-specific photo treatment:

- preserve the subject identity and canonical appearance
- preserve clothing when continuity requires it
- preserve the intended scene and composition unless change is requested
- do not add modern HDR clarity
- do not add modern computational-photography sharpening
- avoid contemporary cinematic grading unless explicitly canonical
- allow period-plausible compression, limited dynamic range, modest sensor noise, imperfect white balance, low-light degradation, and phone-camera softness where appropriate
- match the documented capture device when known
- distinguish DSLR/compact-camera treatment from early smartphone treatment

Do not assume every 2010 photo should look equally degraded. Base treatment on the intended capture source.

Do not "repair" period artifacts solely because they look technically imperfect.

---

# 10. Narrative & Character Continuity Protection

Historical QA includes fictional continuity.

Before changing seeded content, verify that the change does not unintentionally alter:

- character identity
- canonical name
- age at the target date
- appearance continuity
- relationships
- family/background details
- school/team/job roles
- device ownership
- posting behavior
- app usage patterns
- chronology
- known cross-app references
- public/private ambiguity intentionally preserved by the narrative

Do not fill missing character biography merely to make data "complete".

Some ambiguity is intentional and must remain ambiguous.

Do not convert text-only mentions into clickable accounts unless the project explicitly establishes an account.

Do not create new relationships, tags, replies, likes, timestamps, or historical events simply to make a screen feel populated.

---

# 11. Cross-App Timeline Integrity

SM2010 is a synchronized narrative system, not four independent mock apps.

When editing seeded content or app state, check whether the change affects:

- Facebook
- Twitter
- Instagram
- Foursquare
- SMS
- notifications
- unread state
- time-dependent stories
- character profile states
- prior historical content
- subsequent reactions

A timestamp change in one app may create contradictions elsewhere.

When a cross-app dependency exists, explicitly list affected surfaces before changing data.

Do not "fix" one app by creating a timeline contradiction in another.

## Shared Historical Map Architecture

For map-based surfaces in SOCIAL MEDIA, 2010:

- Facebook Places and Foursquare may share canonical venue location metadata.
- Shared location metadata may include:
  - canonical venue ID
  - coordinates
  - map viewport preset
  - optional address
- A shared deterministic fake/static map renderer may be used when this avoids modern map-provider UI contamination.
- Facebook Places and Foursquare must retain separate app-specific chrome, navigation, terminology, and interaction flows.
- Do not make Facebook Places depend on Foursquare state, or vice versa.
- Do not duplicate venue coordinates independently per app when they refer to the same canonical place.
- Do not expose the shared map renderer in another app unless target-period evidence supports a map surface there.
- Before implementing the shared map layer, audit the target-date Foursquare map/check-in UI separately.
- Until that audit is complete, placeholders such as `Map / Location view unavailable` may remain HOLD rather than inventing a modern map.

Implementation sequence:

1. Validate and commit Facebook Places flow.
2. Audit Foursquare circa-2010 map/check-in surfaces.
3. Build `Shared 2010 Fake Map System v0.1`.
4. Attach separate Facebook/Foursquare renderers to the shared canonical venue layer.

---

# 12. Platform-Specific QA

These lists are not substitutes for historical research. They are prompts for what to verify.

## Facebook

Check, when relevant:

- News Feed information density
- Profile / Wall / Info architecture
- Photos by [Name] vs Photos of [Name] / tagged-photo semantics
- "was tagged in a photo" story behavior
- Friends presentation
- Chat presence and entry points
- Places/check-in integration appropriate to the date
- likes/comments terminology and presentation
- photo viewer behavior appropriate to 2010
- link/tag behavior for users who do and do not have accounts
- period-correct timestamp formatting
- no later Timeline-era concepts

Do not import post-2010 Timeline/profile conventions.

## Twitter

Before implementing or changing behavior, verify:

- target-date profile structure
- timeline structure
- tweet metadata
- 140-character behavior
- reply behavior
- retweet behavior and visual treatment
- favorite terminology and placement
- native photo support/display behavior at the target date
- mobile/native/web differences
- navigation and compose behavior
- timestamp conventions

Treat "Twitter has always worked like this" as an unsafe assumption.

## Instagram

Remember the target is very early Instagram.

Verify:

- feature availability by October 2010
- iPhone-only context where applicable
- early feed/profile structure
- filter vocabulary and treatment
- photo capture/import behavior
- comments/likes presentation
- Popular/discovery behavior if used
- absence of later Instagram features

Do not import Stories, DMs, Explore-era conventions, modern profiles, reels, carousels, or later editing behavior.

## Foursquare

Verify:

- check-in flow
- venues
- mayor mechanics
- badges
- points
- tips
- to-dos
- friend/activity presentation
- location permission behavior appropriate to iOS 4-era expectations
- terminology and information density

Do not simplify it into a modern generic map/check-in app.

## iOS / SpringBoard / device shell

Verify:

- iOS 4.1 conventions
- iPhone 4 physical/viewport assumptions
- lock-screen behavior
- slide-to-unlock presentation
- SpringBoard icon arrangement and period assets
- Home button behavior
- multitasking behavior if implemented
- status bar states
- period-correct system alerts
- loading/failure behavior

Do not use later Control Center, Notification Center, modern home indicator, current alert sheets, or later iOS visual language.

---

# 13. Historical Research Workflow

When a task requires historical research:

1. Define the exact question narrowly.
2. Include the target month/year and platform/device in the search.
3. Prefer primary or contemporary sources.
4. Record source date where possible.
5. Distinguish native app, mobile web, and desktop.
6. Compare at least two independent sources for important claims when practical.
7. Stop searching once evidence is sufficient for the decision.
8. Assign CONFIRMED / PROBABLE / RECONSTRUCTED / UNKNOWN.
9. Store or reference useful evidence in the project's canonical research location when one exists.

Do not spend unlimited time proving irrelevant pixel-level details.

Prioritize research effort by impact.

## High-impact: research carefully

- information architecture
- feature availability
- navigation
- major interaction flows
- photo/media behavior
- terminology
- date-sensitive product changes
- cross-app chronology
- device/OS behavior

## Lower-impact: use conservative approximation when evidence is unavailable

- exact subpixel spacing
- exact undocumented hover state
- imperceptible color differences
- tiny implementation details that do not affect historical recognition or narrative

---

# 14. Anti-Memory-Contamination Rule

Modern familiarity is a liability in historical reconstruction.

When thinking:

- "I remember Facebook looked like..."
- "Twitter probably already had..."
- "Instagram normally does..."
- "iPhone alerts look like..."

stop and verify.

Do not trust present-day muscle memory.

---

# 15. Debugging Rules

Historical authenticity does not replace systematic debugging.

For bugs:

1. reproduce the issue
2. identify actual vs expected behavior
3. inspect recent diff and relevant state/data flow
4. form one testable hypothesis at a time
5. determine root cause
6. make the smallest fix
7. verify the original bug
8. verify no historically visible regression was introduced
9. inspect the final diff

Do not shotgun-edit multiple unrelated layers.

Do not claim success solely because the project builds.

---

# 16. Browser / Interaction Verification

When browser automation or an equivalent test environment is available, use it for visible or interactive changes.

At minimum, validate the affected flow in the intended iPhone 4-sized experience.

Depending on the task, verify:

- page opens correctly
- intended control is reachable
- click/tap behavior works
- scroll behavior remains correct
- navigation returns to the correct state
- images remain in correct order
- seeded data remains intact
- back/home behavior is correct
- overlays close correctly
- no unexpected modern focus/hover artifact appears
- no console errors were introduced
- no uncaught promise errors were introduced
- no asset requests fail unexpectedly

For stateful behavior, test the operation sequence, not just the final static screen.

Example:

> open → navigate → act → leave → return → verify state

A successful build is not a regression test.

---

# 17. Visual Regression Verification

For any meaningful UI change:

1. capture or inspect the before state when available
2. inspect the after state at the canonical viewport
3. compare the affected region
4. inspect surrounding regions for collateral drift
5. check text wrapping and image crop
6. check scroll position and content height
7. check modal/overlay stacking
8. check status/navigation bars when visible

If the change is intentionally visual, identify exactly which pixels/regions are expected to differ conceptually.

Unexpected drift must be investigated before completion.

---

# 18. Refactor Safety

A refactor is acceptable only if it preserves observable historical behavior unless the user requested behavior changes.

Before a refactor, identify invariants such as:

- content order
- timestamps
- route/navigation behavior
- visual geometry
- asset mapping
- image identity/order
- likes/comments counts
- tagged relationships
- persisted state
- unread state

After the refactor, re-test those invariants.

Do not merge historical correction and broad refactor into one opaque change.

---

# 19. Canonical vs Generated Asset Rule

Generated images and previous mockups are not automatically canonical.

When selecting visual references:

- prefer explicitly approved/canonical assets
- respect later continuity corrections over earlier generations
- do not use an asset known to contain outdated wardrobe, jersey, device, age, name, UI, or other superseded details
- if two references conflict, stop and resolve which is canonical before propagating the inconsistency

Never infer continuity solely from filename order or generation date.

---

# 20. Handling Missing Evidence

When exact evidence does not exist, do not freeze the task unnecessarily.

Use this decision tree:

```text
Can the detail be confirmed from canonical/project evidence?
  yes → implement as CONFIRMED
  no  ↓

Can multiple contemporary sources support it?
  yes → implement as PROBABLE
  no  ↓

Is the detail necessary for the experience to function?
  yes → choose the most conservative reconstruction and label RECONSTRUCTED
  no  → omit it or leave current behavior unchanged
```

Never modernize merely to fill a documentation gap.

---

# 21. Completion Report

After a historically visible task, report concisely:

## Changed

- what was changed

## Preserved

- important adjacent behavior intentionally left unchanged

## Historical confidence

- `CONFIRMED`, `PROBABLE`, `RECONSTRUCTED`, or a mix

## Evidence / canonical basis

- project canonical reference and/or historical source category used

## Verification

- interaction/browser checks performed
- visual regression checks performed
- relevant build/tests

## Remaining uncertainty

- unresolved historical details, if any

Do not write "historically accurate" as an absolute claim when any relevant part is only probable or reconstructed.

---

# 22. Failure Conditions

Do not mark the task complete if any of the following is true:

- the requested bug still reproduces
- a new console error appeared
- visible layout drift occurred without justification
- a later-era convention was introduced
- historical evidence was guessed but reported as fact
- a canonical continuity rule was violated
- unrelated UI was changed accidentally
- seeded timeline consistency was broken
- image ordering/identity was altered unintentionally
- the change only passed build/typecheck but the interaction was not verified when verification was possible

---

# 23. Default Decision Heuristics

When forced to choose between two plausible implementations:

Prefer the one that is:

1. better supported by target-period evidence
2. less feature-rich
3. less modern
4. less visually polished in a contemporary sense
5. easier to revise if new evidence appears
6. less disruptive to existing canonical content

For this project, **historical credibility beats contemporary elegance**.

---

# 24. What This Skill Must Never Become

Do not turn this skill into:

- a generic frontend style guide
- a modern accessibility redesign mandate
- a "make it beautiful" prompt
- a source of invented historical facts
- an excuse for endless archaeology
- a replacement for root-cause debugging
- a replacement for tests
- a replacement for the user's creative direction

Its function is to protect the reconstruction while making development safer and more consistent.

---

# 25. Short Operational Checklist

Use this condensed pass for routine work:

```text
[ ] Read applicable canonical rules first
[ ] Lock date / app / device / surface
[ ] Identify what must not change
[ ] Determine evidence confidence
[ ] Reject modern assumptions
[ ] Make the smallest change
[ ] Test the real interaction
[ ] Inspect canonical viewport
[ ] Check surrounding visual regression
[ ] Check console/network failures
[ ] Check character/timeline continuity if content changed
[ ] Inspect diff for scope creep
[ ] Report confidence + uncertainty
```

# Final Rule

> **SOCIAL MEDIA, 2010 is not a modern product wearing a retro skin. Treat it as a reconstructed historical system whose imperfections, constraints, media artifacts, interaction grammar, and uncertainty are part of the design.**
