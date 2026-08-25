# Facebook 2010 Native IA & Layout Fidelity Audit v0.1

## Scope and method

This is an evidence-only audit of the current Facebook v0.2 implementation against the native Facebook for iPhone 3.x family available around October 20, 2010. No runtime, CSS, assets, state, scheduler, or application behavior was changed.

The exact target IPA and binary resources have not been recovered in the project. Consequently, this audit has no Tier 1 asset/binary finding. Conclusions marked READY are structural behaviors corroborated by multiple contemporaneous Tier 2 sources; exact geometry and artwork remain HOLD.

Evidence hierarchy used:

- **ORIGINAL / PRIMARY (Tier 1):** no target Facebook IPA or app bundle available locally.
- **PERIOD-EVIDENCE (Tier 2):** period reviews and screenshots of Facebook 3.0/3.2 for iPhone.
- **VISUAL-CROSSCHECK (Tier 3):** none used to promote a conclusion.

The screenshot supplied with this task shows the project's Twitter five-tab interface (`Timeline`, `Mentions`, `Messages`, `Search`, `More`). It is not Facebook evidence and is excluded from this audit.

## Target version and date assumption

The narrative date is October 20, 2010. Facebook 3.2 had been released in August 2010 with Places, so the working target is the **Facebook 3.2-era native iPhone application**, inheriting the Facebook 3.0 launcher architecture. This is a date-supported assumption rather than a recovered installed-build claim. The exact App Store patch version or binary present on the fictional device remains HOLD.

## Evidence base

1. TechCrunch's August 18, 2009 hands-on describes a launcher-like Facebook Home screen, News Feed, Profile, Friends, Inbox, Chat, Requests, Events, Photos, Notes, a bottom Notifications area, and the title/logo return-to-Home behavior: [Facebook 3.0 May Be The Most Useful App On The iPhone Yet](https://techcrunch.com/2009/08/18/facebook-30-may-be-the-most-useful-app-on-the-iphone-yet/).
2. PCWorld's August 28, 2009 review identifies the final 3×3 Home grid, swipeable additional pages, rearrangeable icons, Likes in News Feed, and Notifications at the bottom of Home: [First Look: Facebook 3.0 for iPhone](https://www.pcworld.com/article/525251/first_look_facebook_three_for_iphone.html).
3. iMore's detailed Facebook 3.0 walkthrough lists Home destinations and describes Profile, Friends, Inbox, Chat, Requests, Events, Photos, Notes, Search, notification counts, and profile Wall/Info/Photos sections: [App Preview: Facebook 3.0 for iPhone](https://www.imore.com/preview-facebook-30).
4. Contemporary coverage confirms that Facebook 3.2 added Places in August 2010 without replacing the launcher-era application model: [Facebook 3.2 update](https://9to5mac.com/2010/08/18/facebook-3-2-update-tells-the-cops-where-you-stay-places-also-allows-background-media-uploading/).
5. Web Design Museum preserves Facebook-for-iPhone period captures as a visual-structure reference. It is treated as PERIOD-EVIDENCE, not binary provenance: [Facebook for iPhone in 2009](https://www.webdesignmuseum.org/iphone/facebook-for-iphone-in-2009).

## Executive finding

The current Facebook reducer behavior is usable, but its information architecture is not the Facebook 3.x architecture.

Current root:

```text
Launch
└── News Feed
    └── persistent custom strip
        ├── Feed
        ├── Requests
        └── Messages
```

Evidence-supported target:

```text
Launch / retained working surface
├── News Feed
└── Facebook Home (launcher)
    ├── News Feed
    ├── Profile
    ├── Friends
    ├── Inbox
    ├── Places                 (3.2)
    ├── Chat
    ├── Requests
    ├── Events
    ├── Photos
    ├── Notes / additional page or arrangement
    ├── Search
    └── Notifications area at bottom
```

Facebook 3.0 reports differ on whether the first visible surface after launch was Home or the previously retained/default News Feed. The existence and centrality of the Home launcher is READY; the precise cold-launch/restoration rule for the October 2010 target is HOLD.

## 1. Root application navigation

| Property | Current implementation | Evidence-supported target | Classification |
| --- | --- | --- | --- |
| Root structure | Direct News Feed plus a persistent three-button strip | Launcher-style Home with large destination icons; destination screens use a top hierarchy | **STRUCTURAL MISMATCH** |
| Primary destinations | Feed, Requests, Messages only | News Feed, Profile, Friends, Inbox, Chat, Requests, Events, Photos, Notes, Search; Places in 3.2 | **READY** structurally |
| Persistent bottom tab bar | Not present, but custom strip behaves like persistent root tabs | No evidence for this three-tab structure in Facebook 3.x | **REJECT** as historical structure |
| Return to Home | Non-feed screens always show a `News Feed` button | Facebook logo/title interaction returned to Home and could toggle back | **STRUCTURAL MISMATCH** |
| Cold-launch screen | News Feed | Conflicting period descriptions: Home emphasized as redesigned first screen; another account says app opens to News Feed with Home reachable | **HOLD** |

The current strip should not be polished. A later correction should replace its IA rather than refine it visually.

## 2. Root destinations and hierarchy

The destination inventory is strongly corroborated at the feature/IA level:

```text
Facebook Home
├── News Feed
│   ├── feed filters
│   └── feed item / comments
├── Profile
│   ├── Wall
│   ├── Info
│   └── Photos
├── Friends
│   ├── Friends
│   └── Pages
├── Inbox
│   ├── Messages
│   ├── Updates
│   └── Sent
├── Places
├── Chat
├── Requests
├── Events
│   └── Birthdays
├── Photos
├── Notes
├── Search
└── Notifications
```

Whether all icons occupy the same first 3×3 page in Facebook 3.2 is HOLD. The Home screen was customizable and pageable, so a single immutable ordering must not be invented.

## 3. News Feed structure

Period evidence supports a continuous, native list rather than modern separated cards. Feed entries used profile imagery, blue linked names, body/activity copy, compact metadata, and Like/Comment interaction. Photos and links could expand within relevant entry types.

| Element | Current | Audit |
| --- | --- | --- |
| Continuous white list and separators | Present | **PARTIAL / READY direction** |
| Avatar region | Empty 48pt HOLD block | Structural space is plausible; exact size/artwork **HOLD** |
| Author | Blue bold name | Period-appropriate direction; exact font/size **HOLD** |
| Body | Plain text | Structurally plausible |
| Timestamp | Compact gray line | Structurally plausible; exact source/application metadata **HOLD** |
| Like state | Appends `You like this` to timestamp | Functional but historically unsupported placement; **STRUCTURAL MISMATCH** |
| Comment/Like links in feed row | Absent | Period evidence supports direct feed interaction; **MISSING** |
| Cards/modern reaction bar | Absent | Correct exclusion |

The current Feed is a restrained approximation, not a historically resolved Facebook 3.x cell.

## 4. Like and Comment placement

Like and Comment were established Facebook 3.0 actions on News Feed items and Profile Wall content. Evidence supports text-oriented direct actions and dedicated comments interaction, not a modern reactions row.

- Existing Like/Comment behavior: **READY at capability level**.
- Restricting both actions to the current detail view: **PARTIAL**; period accounts explicitly describe direct News Feed Like/Comment access.
- Current equal-width gradient action buttons: **HOLD / implementation approximation**.
- `Unlike` behavior: supported at the behavior level by period coverage.
- Exact order, counts, separator glyphs, and selected style: **HOLD**.

## 5. Feed item detail

Facebook 3.x exposed comment-linked detail and context-dependent routes. A status/story could lead to comments or a Wall context; an author led to Profile/Wall; a photo led to the photo viewer. Therefore one universal `Post` detail route is not fully faithful.

Classification: **PARTIAL**.

- Dedicated detail/comments surface: plausible and supported for relevant stories.
- Treating every row identically: structurally incomplete.
- Current author is non-navigable: mismatch; name/avatar should route to the person's Profile/Wall where supported.

## 6. Profile IA

Profile pages in the target family were divided into:

```text
Profile
├── Wall
├── Info
└── Photos
```

Period evidence places this section navigation at the bottom of Profile in Facebook 3.0. Profile included the person's picture and identity, Wall activity, information, photo access, mutual/total Friends information, and actions such as Message. It did not contain cover photography or the later Timeline model.

Current implementation has no Profile route. Classification: **MISSING / STRUCTURAL MISMATCH**.

Exact profile header geometry, section control artwork, ordering of secondary actions, and 3.2-specific changes remain **HOLD**.

## 7. Wall versus News Feed

- News Feed aggregates activity from the user's network.
- Wall is the activity surface of one Profile.
- They are not interchangeable.

Current state has only a global Feed. It cannot route author/avatar taps to Profile/Wall and therefore omits this distinction. Classification: **STRUCTURAL MISMATCH**.

Future correction should preserve a shared post object when content is visible in both contexts rather than duplicating records.

## 8. Friends

Facebook 3.0 Friends was a dedicated root destination, described as a conventional friend listing with Friends and Pages, profile entry, and phone/SMS contact affordances when data existed. Period reporting also supports name-based list management/search behavior.

Current accepted Jack is rendered under the Requests screen beneath a `Friends` heading. The state transition is functional, but the destination is wrong.

- Jack entering Facebook-local Friends state after acceptance: **READY behavior**.
- Friends nested inside Requests: **STRUCTURAL MISMATCH**.
- Exact row height, alphabetic sections, search bar, avatar size, phone control, and count: **HOLD**.

## 9. Friend Requests

Requests was a distinct Home destination and displayed a pending-count badge on its Home icon. Jack therefore belongs in Requests before resolution and in Friends after acceptance.

Current `Accept / Ignore` terminology is consistent with the project's prior period evidence and is a reasonable implementation choice, but exact target-version labels and chrome are not established by Tier 1 assets here. Classification: **READY at semantic level / HOLD at exact copy and layout**.

Expected structural flow:

```text
Home Requests badge +1
→ Requests
→ Jack request row
   ├── Accept → removed from Requests; Jack available in Friends
   └── Ignore → removed from Requests; no Friend record
```

The reducer behavior matches this flow. The custom persistent Requests strip button does not.

## 10. Inbox / Messages

The target family calls the root destination **Inbox** in multiple period sources. It included messages and additional subdivisions such as Updates and Sent. Threads loaded within the integrated Facebook app and could be replied to; this was not standalone Messenger.

Current June implementation is semantically compatible with an Inbox message:

```text
Inbox
→ June
→ "Hey, are you online?"
→ plain reply
```

Required IA correction in a later task:

- Rename/map the root destination to Inbox unless target 3.2 bundle evidence proves otherwise.
- Place it on Facebook Home, not in the custom three-segment strip.
- Retain sender, preview, unread state, timestamp, thread, and simple reply composer.

Exact Inbox subsections, unread marker, composer geometry, and thread chrome remain **HOLD**.

## 11. Chat versus Inbox

Chat and Inbox were separate Facebook 3.x root destinations. Chat exposed online/idle presence and synchronous IM semantics; Inbox handled message threads and sent/update categories.

June's copy alone does not prove a Chat event. The current data model is a persistent inbox thread with unread/read/replied state and no presence model. Mapping June to **Inbox** is therefore the evidence-supported and architecture-consistent choice. Reclassifying it as Chat solely because the text says “online” would be invention.

- Separation of Chat and Inbox: **READY**.
- June as Inbox in this project: **CURATED implementation decision**, historically plausible.
- Exact Facebook Chat UI: **HOLD** and out of current scope.

## 12. Notifications, Requests, and Inbox counts

Facebook 3.0 period evidence distinguishes:

- a red numeric badge on the Requests Home icon for pending requests;
- a Notifications area at the bottom of Facebook Home showing recent notification/count information;
- Inbox/message unread state within its destination, with exact Home badge behavior not sufficiently resolved here.

Current implementation embeds `1` directly in strip labels (`Requests 1`, `Messages 1`). This conveys state but is not the evidenced Facebook 3.x count placement.

| Count | Classification |
| --- | --- |
| Requests count on Home icon | **READY** structurally |
| Notifications bar/area at Home bottom | **READY** structurally |
| Exact notification bar geometry/artwork | **HOLD** |
| Exact Inbox badge/count placement in 3.2 | **HOLD** |
| Current inline strip-label counts | **STRUCTURAL MISMATCH** |

This is entirely Facebook-internal IA. No system Lock Screen or global notification change is recommended.

## 13. Photos

The target app supported albums, thumbnail grids, photo viewing/zooming, uploads, tags, profile-photo changes, and Like-related photo interaction. Facebook 3.2 also supported Places and background media upload behavior.

Classification:

- Photos as a root destination and Profile section: **READY**.
- Albums and thumbnail-to-viewer hierarchy: **READY** structurally.
- Exact raster controls, image geometry, tag overlays, photo action placement: **HOLD**.
- Current lack of Photos UI: **MISSING**, but intentionally out of this audit's implementation scope.

No photo assets should be fabricated to fill this gap.

## 14. Places

Facebook announced Places and released Facebook for iPhone 3.2 in August 2010. Period reporting supports a Places entry, nearby place discovery/check-in behavior, and check-in activity flowing into Facebook's social surfaces.

| Property | Classification | Decision |
| --- | --- | --- |
| Places present in the target 3.2-era application | **READY** | Include as a Home destination in the IA map. |
| Check-in capability | **READY** at feature level | Historically available, but not required for Facebook v0.2 playability. |
| Nearby place list and feed/profile integration | **READY** at broad structure | Exact screens and routing remain unresolved. |
| Exact Home slot, icon, geometry, and place-cell chrome | **HOLD** | Requires target bundle or stronger screenshot sequence. |
| Implementation in this audit | **OUT OF SCOPE** | Do not duplicate the project's Foursquare behavior or add a modern Nearby surface. |

## 15. Top navigation chrome structure

The target app combined Facebook-specific blue navigation chrome with hierarchical destination screens. Period reporting establishes the following control relationships without establishing pixel geometry:

- A top title/logo region identified the current destination.
- The Facebook logo/title interaction could return to Home and toggle back to the prior working context.
- Destination-specific left/right controls existed, including News Feed filtering and creation/action controls where relevant.
- Profile, Inbox, Requests, Photos, and other screens used their own hierarchical controls rather than one universal `News Feed` back button.

Current comparison:

| Control | Current | Target assessment |
| --- | --- | --- |
| Center title | View-specific title | **PARTIAL**; correct native hierarchy direction. |
| Left control | Always `News Feed` outside Feed | **STRUCTURAL MISMATCH**; it loses navigation origin and bypasses Home. |
| Home access | Absent | **A mismatch**; the Facebook Home/logo relationship is foundational. |
| Right action | Absent | **B/HOLD**; action varies by destination and should not be invented globally. |
| Refresh/status/compose | Absent | Exact target controls and placement **HOLD**. |

No pixel values, gradients, or button rasters are READY from this audit.

## 16. Bottom navigation versus Home grid

Facebook 3.x must not inherit Twitter's five-tab IA. Period evidence supports a Home launcher and destination-specific controls, not a persistent bottom tab bar for the target version.

- Current three-section strip: **REJECT / STRUCTURAL MISMATCH**.
- Twitter-style `Timeline / Mentions / Messages / Search / More`: **REJECT** for Facebook.
- Facebook Home launcher with pageable/customizable destinations: **READY**.
- Profile-local Wall/Info/Photos section navigation is distinct from global navigation and may occupy a lower control region: **READY structurally**, exact chrome HOLD.

## 17. Current-user identity

The current user should be reachable through the root **Profile** destination. That Profile owns the user's name, picture, Wall, Info, Photos, Friends relationships, and current status/activity context. It is not a modern cover-photo/Timeline profile.

The project already has the correct identity source: `sessionIdentity.name`. The mismatch is exposure, not ownership:

- Shared session identity source: **READY architecture**.
- Owner-authored Feed seed using that identity: **READY functional use**.
- Root Profile destination: **MISSING / A mismatch**.
- Current user's Wall and Friends access from Profile: **MISSING / A/B boundary**.
- Profile photograph and exact statistics: **HOLD**; do not fabricate.

## 18. Current implementation comparison matrix

| Area | Current implementation | 2010 native structure | Classification | Required change |
| --- | --- | --- | --- | --- |
| Root navigation | Feed plus persistent Feed/Requests/Messages strip | Pageable/customizable Home launcher plus destination hierarchy | **A / STRUCTURAL MISMATCH** | Introduce Home and remove strip. |
| News Feed | Default view, continuous list | Root Home destination and common working surface | **PARTIAL** | Route through Home; preserve reducer and scroll. |
| Feed row | Empty avatar slot, author/body/time | Avatar, linked author, story body/media, compact metadata and direct actions | **B mismatch** | Restore information hierarchy when evidence permits. |
| Like | Detail-only toggle, liked text in timestamp | Available on feed/Wall content with Unlike state | **B / PARTIAL** | Expose in correct story context; preserve state. |
| Comment | Detail-only composer | Direct comment access and comments/detail context | **B / PARTIAL** | Route from story without modern reaction bar. |
| Feed detail | Universal `Post` screen | Story-dependent comments, Wall, profile, link, or photo route | **A/B / PARTIAL** | Add typed route behavior without duplicating content. |
| Profile | Absent | Root destination with Wall/Info/Photos | **A / MISSING** | Add minimal Profile IA foundation. |
| Wall | Absent/merged conceptually into Feed | Per-profile activity distinct from News Feed | **A / MISSING** | Separate global Feed from Profile Wall. |
| Friends | Accepted Jack shown under Requests | Separate root Friends destination/list | **A / STRUCTURAL MISMATCH** | Move Friend display to Friends route. |
| Friend Requests | Persistent strip destination; Accept/Ignore works | Home Requests destination with pending count and request rows | **A placement / READY behavior** | Preserve reducer; reroute through Home. |
| Inbox/Messages | Root label `Messages`; list/thread/reply works | Root `Inbox`, with message/update/sent organization | **A naming/placement, PARTIAL behavior** | Map June to Inbox; retain thread state. |
| Chat | Absent | Separate root live-presence/IM destination | **HOLD/MISSING** | Keep visible IA slot only if correction scope permits; do not fabricate Chat. |
| Photos | Absent | Root Photos plus Profile Photos, albums and viewer | **HOLD/MISSING** | Map route; no fabricated imagery. |
| Places | Absent | Facebook 3.2 Places/check-in destination | **READY feature / OUT OF SCOPE implementation** | Reserve correct Home destination. |
| Internal counts | Inline label suffixes (`Requests 1`) | Requests icon badge and Home-bottom Notifications area; Inbox details unresolved | **B / STRUCTURAL MISMATCH** | Derive existing state into period structure later. |
| Identity | Shared session identity, no Profile route | Current user's Profile/Wall/Friends accessible from Home | **A exposure mismatch** | Reuse `sessionIdentity.name` in Profile. |
| Lifecycle | Shared App Runtime | Native app retained state under system lifecycle | **READY project architecture** | No change. |

## 19. Structural severity

### A — Structural / functional mismatch

Must be corrected before visual-fidelity work:

- Missing Facebook Home launcher and wrong persistent section-strip root.
- Missing Profile route and Wall/News Feed distinction.
- Universal `News Feed` back behavior instead of origin-aware/Home navigation.
- Friends rendered inside Requests.
- June exposed through a `Messages` strip destination instead of the integrated Inbox IA.
- Author/avatar routes absent.
- Universal Feed Detail route where story type should control destination.

### B — Layout / interaction-structure mismatch

Belongs in the IA correction phase but does not justify pixel polish:

- Feed avatar/name/body/metadata/action hierarchy.
- Direct Like/Comment placement and count treatment.
- Request row action arrangement and Home badge placement.
- Inbox row unread/timestamp/subsection structure.
- Profile local Wall/Info/Photos navigation.
- Facebook Home Notifications area.

### C — Pixel / chrome polish

Explicitly deferred:

- Exact Facebook blue gradients.
- Authentic destination icon rasters.
- Exact fonts, shadows, separators, corner radii, and 1–3px offsets.
- Animations and transition timing.
- Exact avatar/photo imagery.

No C item was modified.

## 20. Frozen boundaries

This audit made no changes to System Foundation, global scheduler, Cross-App Timeline, Messages, Twitter, Instagram, Foursquare, Flickr, Tumblr, battery, lock routing, Facebook runtime/state/UI, or historical assets.

## READY / HOLD / STRUCTURAL MISMATCH summary

### READY

- Facebook Home launcher exists and is central to 3.x IA.
- 3×3/pageable/customizable launcher model.
- Root-level News Feed, Profile, Friends, Inbox, Chat, Requests, Events, Photos, Notes/Search inventory.
- Places belongs to the August 2010 Facebook 3.2 context.
- Profile separates Wall, Info, and Photos.
- Inbox and Chat are distinct.
- Requests carries a pending count and resolves into Friends state on acceptance.
- News Feed supports Like and Comment.
- Notifications occupies a dedicated Home-bottom area.

### HOLD

- Exact October 20, 2010 cold-launch/resume destination.
- Exact 3.2 icon ordering across launcher pages.
- Exact geometry, fonts, gradients, raster artwork, cell heights, badges, and transitions.
- Exact Inbox badge presentation and subsection chrome.
- Exact Feed story-type detail routes and control placement.
- Target IPA/binary provenance.

### STRUCTURAL MISMATCH

- Persistent custom `Feed / Requests / Messages` strip.
- Missing launcher Home.
- `News Feed` used as the universal Back destination.
- Friends nested under Requests.
- `Messages` used where period evidence favors root `Inbox`.
- Missing Profile/Wall distinction and author navigation.
- Inline strip-label counts replacing Home icon/Notifications count structure.

## Recommended correction boundary

A future Facebook native-IA correction should change structure only:

1. Introduce Facebook Home launcher state.
2. Route existing Feed, Requests, Inbox, and Friends behavior through that Home.
3. Preserve all existing reducers for Like, Comment, Jack, June, lifecycle, and session reset.
4. Add only minimal Profile/Wall routing necessary to stop author links from being dead ends; broader Profile/Photos/Chat features may remain HOLD.
5. Remove the custom section strip rather than polishing it.

No exact visual values should be implemented until stronger target-version image or bundle evidence is available.

## Remaining unknowns

- Exact Facebook app version/build installed on October 20, 2010 beyond the 3.2-era target.
- Whether a cold launch entered Home or News Feed and how restoration affected that choice.
- Exact Home icon order after Places integration and customization.
- Exact Requests button wording and row chrome in that build.
- Exact Inbox badge semantics and subdivisions in 3.2.
- Exact source/application metadata and action layout per News Feed story type.
- Authentic Facebook raster/icon resources and their hashes.

## Audit conclusion

Facebook v0.2 remains functionally sound but is **not ready for native IA/layout fidelity freeze**. The root navigation is a structural mismatch. The next justified implementation task is a Facebook 2010 native IA correction centered on the launcher Home and historically separate destinations—not pixel polishing and not new features.
