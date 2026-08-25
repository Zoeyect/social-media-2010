# Twitter 2010 Native IA & Layout Fidelity Audit v0.1

## Result

The existing Twitter v0.3 state model preserves useful period functions, but its information architecture is not yet a faithful Twitter for iPhone 3.0-era shell.

The largest structural differences are:

1. the required five-destination bottom tab bar is absent;
2. the timeline lacks a real avatar/content hierarchy even though an empty 48pt avatar track exists;
3. period-verified swipe-to-reveal tweet actions are absent, while all actions are placed on a separate detail surface;
4. Reply uses an inline detail-page editor instead of the period New Tweet composer route;
5. the signed-in timeline header lacks the period account and compose controls.

This is an audit only. No Twitter runtime, UI, state, scheduler, asset, or shared-system file was changed.

## 1. Historical target and version assumption

The target is the official Twitter for iPhone on iPhone 4 / iOS 4.1 on October 20, 2010.

Twitter acquired Tweetie in April 2010 and released the renamed official client as version 3.0 on May 19. Version 3.0.1 added iOS 4 and iPhone 4 support in June; version 3.0.2 shipped in early August with iPhone 4 display fixes. The next clearly documented major update, 3.2 with push notifications, arrived November 16. Therefore **Twitter for iPhone 3.0.2 is the best-supported target-version assumption** for October 20. The exact target IPA/bundle has not been recovered, so binary-level resource provenance remains **HOLD**.

Classification: **PERIOD-EVIDENCE / READY target direction; HOLD exact bundle**.

## 2. Evidence sources

### Tier 1 — ORIGINAL / primary

- [Twitter, “Twitter for iPhone,” April 10, 2010](https://blog.x.com/en_us/a/2010/twitter-for-iphone-1): confirms the Tweetie acquisition, rename, and first-party direction.
- Exact 3.0.2 IPA, executable, resource bundle, App Store payload, and icon bytes: **not recovered / HOLD**.

### Tier 2 — PERIOD-EVIDENCE

- [PCWorld, May 20, 2010](https://www.pcworld.com/article/512894/twitter_iphone-2.html): explicitly describes five bottom tabs, the upper-right compose control, compose quick tools, and actions moved to the main action bar.
- [TechCrunch, May 19, 2010](https://techcrunch.com/2010/05/19/yes-folks-the-official-iphone-twitter-app-is-here-screen-shots-2/): identifies version 3.0, official App Store screenshots, improved search, and more-prominent Retweet.
- [MacStories, Twitter 3.0.2 update](https://www.macstories.net/iphone/twitter-for-iphone-updated-with-iphone-4-bug-fixes/): confirms 3.0.2 and its iPhone 4 display fixes before the target date.
- [Ryan Spoon, October 6, 2010](https://www.ryanspoon.com/blog/2010/10/06/twitters-surprising-iphone-app-ui): directly describes swiping a tweet right to reveal Reply, Retweet, Favorite, email, user-info, and more actions; also records the small Favorite star feedback.
- [Macworld, Tweetie 2 review, December 1, 2009](https://www.macworld.com/article/201344/tweetie2.html): documents the inherited swipe action shortcuts, photo/camera compose tools, geotagging, account/hashtag tools, URL shortening, and exact-position restoration.
- [Incredible iPhone Apps for Dummies, period publication](https://device.report/m/19b09e5cb317160ea32b36bc18b5d31997bef46c682195d0f19530c4c8312fec.pdf): its Tweetie 2 screenshots/descriptions show a `New Tweet` screen with `Close`/`Send`, account identity, character count, Camera, Photo Library, Geotag, Usernames, Hashtags, and Shrink URLs; the timeline screenshot shows avatar-led rows and the five-icon tab bar.
- [Web Design Museum, Twitter for iPhone in 2010](https://www.webdesignmuseum.org/iphone/twitter-for-iphone-in-2010): preserved visual-structure cross-check classified here as **PERIOD-EVIDENCE**, not original binary provenance.

The Web Design Museum page was located, but a controllable browser was unavailable during this run, so its images were not manually inspected at pixel level. No exact geometry is promoted from unobserved thumbnails.

### Tier 3 — VISUAL-CROSSCHECK

No later reconstruction is required for the structural findings below. Tier 3 cannot upgrade a classification to READY.

## 3. Native navigation map

```text
Signed-in account
│
├── Timeline / latest tweets
│   ├── pull to refresh
│   ├── top-left account control
│   ├── top-right compose
│   ├── swipe tweet → action pane
│   └── user/profile drill-down
│
├── @ Mentions
├── Direct Messages
├── Search
└── More
    ├── profile/account destinations
    ├── Lists and related account tools
    └── settings/services as supported by the target build
```

The five persistent bottom destinations—latest tweets, `@`, messages, search, and more—are **READY at IA level** from contemporary reporting. Exact label text, icon raster, selected treatment, and whether the first tab visibly said `Tweets` or used only an icon remain **HOLD** without the target bundle/direct screenshot measurement.

## 4. Top navigation structure

Period material supports:

- a signed-in account/timeline surface;
- an account control on the upper left in Tweetie-era screenshots;
- a compose control on the upper right;
- the account/timeline title in the middle region;
- pull-to-refresh as the main timeline refresh gesture rather than consuming the compose position.

The exact center title for the October 3.0.2 build—account username, `Tweets`, or another account-specific string—is **HOLD**. A generic centered `Twitter` title is not supported by the recovered evidence and should not be treated as final.

Current implementation:

- centered `Twitter` on Timeline;
- centered `Tweet` on detail;
- no left account control on Timeline;
- no right compose control;
- no refresh gesture/control.

Classification: **WRONG / STRUCTURAL MISMATCH** for control structure; **HOLD** for exact title string and chrome.

## 5. Bottom tab structure

Period reporting explicitly identifies five bottom tabs:

1. latest tweets / timeline;
2. `@` mentions;
3. direct messages;
4. search;
5. more.

The current app has no persistent Twitter tab bar. This is a **STRUCTURAL MISMATCH (A)**. Mentions, Messages, Search, Profile/Lists, and More need not be made fully functional in the first correction, but the IA shell must reserve their historically correct destinations rather than inventing a later Home/Connect/Discover/Me structure.

Exact icons, labels, spacing, and selected art: **HOLD / C**.

## 6. Tweet-cell anatomy

The period structure is:

```text
┌ avatar ┐  display identity                         age
│  left  │  tweet text, wrapping in a content column
└────────┘  optional location / retweet attribution
            separator
```

### READY direction

- avatar at the leading/left side;
- content in a separate right column;
- compact display identity and relative timestamp hierarchy;
- tweet text below/alongside the identity line;
- row separator;
- optional inline-retweet and location information in version 3.x.

### HOLD

- exact avatar size/inset;
- whether `@handle` was independently visible in every timeline cell;
- exact timestamp edge and baseline;
- metadata/source wording and line placement;
- exact row minimum height for each content variant.

Current implementation already reserves a 48×48 empty avatar track and places name/text/time in a second column. However, it has no avatar artwork or identity fallback, no handle field, no location/source metadata, and simplified retweet attribution. It is therefore **PARTIAL**, not wholly text-only, but visually functions as text-only because the avatar track is blank.

Required change: retain the two-column architecture, provide only provenance-controlled avatar treatment, and add metadata slots without fabricating their content.

## 7. Selected-tweet interaction model

Contemporary October evidence directly confirms this primary shortcut:

```text
timeline tweet
  → horizontal swipe
  → tweet slides/reveals a compact action pane
  → Reply / Retweet / Favorite / more actions
```

The available evidence does not prove that every full tweet-detail route was absent. Consequently:

- swipe-to-reveal action pane: **READY behavior**;
- exact tap behavior and full-detail availability in 3.0.2: **HOLD**;
- replacing the swipe pane entirely with a mandatory full-detail screen: **STRUCTURAL MISMATCH**.

The current `tap → Tweet Detail → action row` route may remain as a secondary/HOLD route, but it cannot be the only way to expose period actions.

Classification: **PARTIAL / A structural mismatch**.

## 8. Reply flow

Period behavior supports Reply as an action from the tweet action pane and a route into the Tweetie-era composer. The composer should carry reply context and a prefilled `@username`; exact keyboard focus timing and title wording for a Reply-specific composer remain HOLD.

Current behavior opens a textarea inline inside the custom detail screen. The 140-character constraint is period-correct, but the IA is not.

Classification:

- reply state/function: **CORRECT direction**;
- inline detail composer entry/layout: **WRONG / A**;
- prefilled handle and exact composer title: **HOLD pending identity/handle data**.

## 9. Retweet semantics and flow

### Manual RT

`RT @username …` is ordinary tweet text authored by the wrapper account. It must remain a normal timeline item and must not receive native `Retweeted by …` attribution merely because its text begins with `RT`.

The seed layer already preserves manual-RT provenance separately. Classification: **CORRECT**.

### Native Retweet

A native Retweet must preserve the source tweet ID, original author, original text, and original timestamp. The acting session identity belongs in a separate retweeter relation/attribution.

The current reducer does this correctly and stores the action timestamp separately. The current UI renders a second activity row at the top with `Retweeted by <name>` while leaving the original timeline row in place. This is a functional approximation; exact 3.0.2 insertion/deduplication behavior, attribution wording, icon, location, and timestamp display remain **HOLD**.

Native Retweet entry belonged to the main tweet action pane by version 3.0. Whether the target build required a confirmation/action sheet cannot be established from the recovered evidence and remains **HOLD**. Modern Quote Tweet UI is **REJECTED**.

Overall classification: **CORRECT semantic model / PARTIAL presentation**.

## 10. Favorite flow

Favorite was exposed in the swipe action pane and used star language/artwork. Period October evidence also records a small star appearing at the tweet's upper-right region after favoriting.

Current state toggling is valid, but Favorite exists only as a text button on the detail page and no timeline star state is exposed.

Classification: **CORRECT state / WRONG entry location / B missing feedback**.

Exact star raster, offset, selected color, and animation: **HOLD / C**.

## 11. Compose IA

Period evidence supports this future route:

```text
Timeline upper-right compose
  → New Tweet
     ├── Close
     ├── account / username identity
     ├── editable 140-character body
     ├── remaining-character counter
     ├── Send
     └── attachment/tool row
         ├── Camera
         ├── Photo Library
         ├── Geotag
         ├── Usernames
         ├── Hashtags
         └── Shrink URLs
```

The presence of these tool categories is **PERIOD-EVIDENCE / READY direction** from Tweetie 2 and launch coverage. Exact ordering, icon art, disclosure behavior, and whether every tool was immediately visible in Twitter 3.0.2 are **HOLD**.

Current implementation has no general compose route and uses only an inline Reply editor. This is an **A structural gap**. Future work should first create a shared Twitter-local composer route usable by New Tweet and Reply; it should not implement all attachment services before their UI evidence/assets are ready.

## 12. Timeline behavior

| Behavior | Historical conclusion | Current comparison |
| --- | --- | --- |
| Newest-first timeline | **READY** | Correct. Seed/live tweets are ordered newest first. |
| Pull-to-refresh | **READY behavior** from Tweetie lineage | Missing. |
| Loading older items | **READY broad behavior / HOLD trigger chrome** | Not implemented. |
| Live insertion at top | **READY direction** | Correct direction. |
| Preserve reading position | **READY direction**; Tweetie retained exact app position | Current reducer retains scroll and does not force-scroll on live delivery. |
| New-item indicator | **HOLD** | Not implemented; acceptable. |

## 13. Profile and user navigation

The October action pane included a user-info/profile action, and Tweetie-era profiles exposed user tweets, Favorites, follower/following navigation, and related account actions. Tapping an avatar/name likely provided a direct route, but exact hit targets and transition hierarchy are not sufficiently verified here.

Recommendation:

- reserve one `userProfile` route keyed by source identity;
- make the action-pane user-info control the evidence-backed entry;
- keep avatar/name direct-tap behavior **HOLD** until stronger evidence;
- do not invent a modern profile header or tabs.

## 14. Search, Mentions, Messages, Lists, and More IA

- **Mentions:** second persistent bottom destination (`@`).
- **Messages:** third persistent bottom destination (envelope / private messages).
- **Search:** fourth persistent bottom destination; version 3.0 also exposed Top Tweets, suggested users, trends, and location-aware search.
- **More:** fifth persistent destination; period reporting says it was reorganized in 3.0.
- **Lists/Profile/settings/services:** belonged behind account/profile/More routes; exact placement within 3.0.2 remains **HOLD**.

These destinations should be structurally represented before later feature expansion, but this audit does not require their content implementation.

## 15. Current-versus-native matrix

| Area | Current implementation | 2010 native structure | Classification | Required change |
| --- | --- | --- | --- | --- |
| Top nav | Center `Twitter`; no Timeline controls | Account context, left account control, right compose | **WRONG / A** | Add account/compose structure; hold exact center title. |
| Bottom nav | None | Five tabs: timeline, @, messages, search, more | **STRUCTURAL MISMATCH / A** | Add persistent historical IA shell. |
| Tweet cell | Blank 48pt avatar track + right text column | Avatar-led two-column row | **PARTIAL / B** | Preserve columns; resolve avatar provenance/fallback without fabrication. |
| Avatar | Empty transparent track | Visible source identity image | **MISSING / B; artwork HOLD** | Add only verified/curated provenance-controlled avatar data. |
| Timestamp | Right side of name row | Compact relative age in cell; exact location HOLD | **PARTIAL / B** | Retain until direct measurement; do not claim exactness. |
| Metadata/location | Absent | Optional retweet/location information | **MISSING / B** | Add conditional metadata slots only. |
| Selected tweet | Tap always opens full detail | Swipe reveals quick-action pane; detail availability HOLD | **PARTIAL / A** | Implement swipe/inline action pane as primary shortcut. |
| Reply | Inline detail textarea | Action pane → composer with reply context | **WRONG / A** | Route through shared Twitter composer. |
| Retweet | Detail text button; semantic relation is separate | Main action pane; exact confirmation HOLD | **PARTIAL** | Move entry to action pane; preserve reducer semantics. |
| Favorite | Detail text button | Action pane + small star feedback | **PARTIAL / B** | Expose action and timeline selected feedback. |
| Compose | No general compose | Upper-right compose → New Tweet tools | **MISSING / A** | Add route/shell before rich tools. |
| Profile navigation | None | User-info/profile drill-down | **MISSING / B** | Map source identity route; exact hit target HOLD. |
| Scroll/live insertion | Retained scroll; newest-first | Newest-first, pull-to-refresh, retained position | **PARTIAL** | Keep stable insertion; add pull-to-refresh structure later. |
| Manual RT | Normal seeded tweet text | Normal tweet authored by wrapper | **CORRECT** | Preserve. |
| Native Retweet | Original data retained plus user activity row | Original source + separate retweeter attribution | **CORRECT semantics / PARTIAL UI** | Audit exact dedupe/attribution before visual correction. |

## 16. A / B / C findings

### A — Functional / structural mismatch

1. Missing five-item bottom tab architecture.
2. Missing top-left account and top-right compose controls.
3. Missing swipe-to-reveal tweet action pane.
4. Reply uses the wrong navigation route (inline detail editor rather than composer).
5. No general New Tweet composer route.

The current full-detail state and reducers should not be discarded. They can be adapted behind the corrected IA without rewriting runtime architecture.

### B — Layout mismatch

1. Empty avatar column makes cells read as text-only.
2. Handle/source/location/retweet metadata slots are incomplete.
3. Favorite has no timeline star feedback.
4. Profile/user navigation is absent.
5. Exact timestamp and retweet-attribution placement need direct screenshot/bundle measurement.
6. Pull-to-refresh structure is missing.

### C — Pixel polish / later

- navigation and tab raster assets;
- exact gradients and separator colors;
- 1–3px row, baseline, and icon offsets;
- exact avatar size/corner treatment;
- font rasterization and weights;
- pressed/selected animation timing;
- exact swipe-panel reveal distance and easing.

## 17. Recommended correction sequence

1. **IA shell:** add the five persistent tabs and account/compose top controls without implementing missing destinations.
2. **Tweet row anatomy:** preserve the two-column track, add conditional identity/metadata regions, and keep unavailable avatar artwork transparent/HOLD rather than fabricating it.
3. **Selection actions:** add horizontal swipe/reveal state and an inline action pane; keep full detail only as a secondary HOLD-compatible route.
4. **Composer route:** create one Twitter-local New Tweet composer shell reused for Reply; preserve the 140-character and session-local state logic.
5. **Action presentation:** move Reply/Retweet/Favorite entry to the action pane and add Favorite timeline feedback.
6. **Profile/Search/other tab route placeholders:** establish non-dead-end IA containers without inventing content.
7. **Visual evidence pass:** only after structure is corrected, recover/measure target 3.0.2 screenshots or bundle resources for C-level chrome and geometry.

## Validation record

- Documentation-only change: **PASS**
- Twitter runtime/state/UI changes: **none**
- Shared runtime or other app changes: **none**
- Historical assets added/modified: **none**
- Browser screenshot inspection: **NOT PERFORMED — browser unavailable**
- Exact unobserved screenshot geometry promoted to READY: **no**
