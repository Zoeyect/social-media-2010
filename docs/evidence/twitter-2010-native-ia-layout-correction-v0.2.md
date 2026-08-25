# Twitter 2010 Native IA & Layout Correction v0.2

## Result

The Twitter-local shell now follows the period-supported Twitter for iPhone 3.0.2 information architecture without changing shared runtime architecture or attempting pixel fidelity.

The correction implements the A/B structural findings from `twitter-2010-native-ia-layout-fidelity-audit-v0.1.md`. Exact app-bundle artwork and geometry remain HOLD.

## Before / after IA

### Before

```text
Twitter
└── text-led Timeline
    └── tap Tweet
        └── full Detail
            ├── inline Reply textarea
            ├── Retweet
            └── Favorite
```

### After

```text
Twitter account shell
├── Timeline
│   ├── account control
│   ├── compose control
│   ├── avatar/content Tweet cells
│   ├── swipe right → Reply / Retweet / Favorite
│   ├── tap → retained secondary Tweet Detail
│   └── Reply → New Tweet composer
├── Mentions — HOLD shell
├── Messages — HOLD shell
├── Search — HOLD shell
└── More — HOLD shell
```

## State correction

Twitter state adds only app-local IA fields:

```ts
activeTab:
  | "timeline"
  | "mentions"
  | "messages"
  | "search"
  | "more"

currentView:
  | "timeline"
  | "tweetDetail"
  | "composer"

composerKind: "new" | "reply" | null
revealedTweetId: string | null
```

Existing Timeline, selected Tweet, scroll, Favorite, native Retweet relations, replies, and composer draft remain Twitter-owned state. No state was moved into App Runtime or the global scheduler.

## Bottom navigation

The five period destinations render in the audited order:

1. Timeline
2. Mentions
3. Messages
4. Search
5. More

Timeline remains functional. Secondary destinations are empty structural surfaces with `HOLD` classification and no invented modern empty-state copy.

Exact tab icons, selected raster, label visibility, dimensions, and gradients remain **C/HOLD**. No Home, Notifications, Explore, Spaces, Connect, Discover, or modern Me tab was introduced.

## Top navigation

Timeline now provides:

- `Accounts` on the left, routed to the More shell as a minimal non-dead-end structural behavior;
- the current session identity in the center;
- `Compose` on the right, routed to the Twitter-local New Tweet composer.

The text buttons are explicitly structural chrome. They do not replace or claim original 3.0.2 raster controls.

## Tweet-cell anatomy and avatar boundary

Each timeline item has:

- a leading avatar track;
- a separate content column;
- display identity;
- relative period timestamp string;
- tweet body;
- optional native-Retweet attribution;
- a separator;
- Favorite state feedback.

No verified avatar files exist for the fictional/curated identities. The blank track is replaced with an initial-based neutral `DEV` fixture. It is not portrait artwork and is not claimed as historical UI. Celebrity portraits, generated faces, and screenshot crops were not added.

Exact avatar size, corner material, source/handle metadata, Favorite indicator art, and cell baselines remain **C/HOLD**.

## Selected-Tweet interaction

The primary timeline action path is now:

```text
pointer/touch down
→ rightward horizontal movement ≥ 36 logical pixels
→ horizontal movement dominates vertical movement
→ reveal one action row
```

Vertical scrolling is not treated as a tweet action gesture. The revealed item ID is stored in Twitter state, so it survives tab switching and retained app lifecycle state.

The action row exposes only the three implemented period actions:

- Reply
- Retweet
- Favorite

Profile, Attachment, email/share, exact reveal transform, and animation remain HOLD. The pre-existing Tweet Detail route remains a secondary tap path and no longer exclusively owns the actions.

## Reply / New Tweet composer

Reply now follows:

```text
Tweet action
→ Reply
→ New Tweet composer
→ prefilled @username approximation
→ 140-character constrained edit
→ Send
```

The handle is a deterministic Twitter-local approximation derived from the fictional display identity because verified account handles do not exist for all curated users. The exact handle data therefore remains **HOLD-content**.

The composer structurally contains:

- Close / New Tweet / Send navigation;
- current session identity;
- reply target context;
- textarea;
- remaining character count;
- disabled Camera, Photo Library, Geotag, Usernames, Hashtags, and Shrink URLs controls.

Only the existing Reply send behavior is active. General New Tweet sending and attachment tools are disabled because their runtime/content boundaries were not part of this IA correction. No Camera Runtime change was made.

The old inline detail-page Reply textarea was removed.

## Manual RT and native Retweet

### Manual RT

Seed text beginning `RT @…` remains a normal Tweet authored by its wrapper identity. It receives no native retweeter attribution automatically.

### Native Retweet

The existing native relation remains:

```ts
{
  sourceTweetId,
  retweetedBy,
  originalTweetTimestamp,
  retweetActionTimestamp
}
```

Rendering continues to use the original author's text and timestamp plus separate `Retweeted by <session identity>` attribution. The source Tweet is not rewritten as user-authored manual RT content. Stable relation IDs prevent duplicates and unretweet removes only the user relation.

Exact confirmation dialog, attribution icon/placement, and target-build duplicate/insertion presentation remain **HOLD**. Quote Tweet was not added.

## Persistence and isolation

Code-level state checks confirm preservation of:

- Timeline scroll across tab switching;
- selected Tweet across secondary tabs;
- revealed action item across tab switching;
- composer draft in retained Twitter state;
- Favorite / Reply / Retweet independence;
- native Retweet relations during live event delivery;
- chronological live Tweet insertion without scroll reset.

`RESET` restores Timeline, clears the selected/revealed/composer states, and removes user Replies, Favorites, Retweets, and live additions for the next Hero identity.

Home, app switching, and lock/sleep/resume use the unchanged root-owned App Runtime path. Browser lifecycle interaction was not manually observed in this implementation pass and is not claimed as a manual PASS.

## A / B / C findings

### A — Structural blockers

Resolved:

- missing five-tab IA;
- missing account/compose top structure;
- missing swipe action path;
- Reply trapped in inline detail UI;
- manual/native Retweet semantic boundary.

### B — Functional

Resolved in reducer/static checks:

- tab switching retains Timeline scroll and selected state;
- one revealed action relation is retained;
- Reply composer prefills a target handle and enforces 140 characters;
- Favorite, Reply, and Retweet remain independent;
- live delivery and reset retain their prior invariants.

No remaining B issue was found in code-level validation.

### C — Polish / HOLD

- exact Twitter 3.0.2 tab, account, compose, action, star, and attachment artwork;
- exact target-build center title;
- exact avatar assets and metadata hierarchy;
- exact swipe distance, reveal direction geometry, easing, and pressed states;
- Retweet confirmation presentation;
- populated Mentions, Messages, Search, More, Profile, and Lists content;
- general New Tweet publishing;
- direct browser interaction verification.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Scheduler and Cross-App Timeline definitions: unchanged
- System Foundation and shared App Runtime: unchanged
- Messages/Facebook/Instagram/Foursquare/Flickr/Tumblr: unchanged
- Historical assets: unchanged
- Generated/fabricated historical artwork: none
- Modern Twitter/X behavior: none
