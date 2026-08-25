# Facebook 2010 Native IA Correction v0.2

## Scope

This correction applies the A-level information-architecture findings and the minimum B-level layout required by `facebook-2010-native-ia-layout-fidelity-audit-v0.1.md`. It is Facebook-local. No system lifecycle, scheduler, Cross-App Timeline timing, battery, lock routing, sibling application, or historical asset was changed.

## Implemented root navigation

```text
Facebook Home
├── News Feed
│   ├── Feed Detail / Comments
│   └── Author Profile → Wall
├── Profile (sessionIdentity.name)
│   ├── Wall
│   ├── Info    [HOLD empty structure]
│   ├── Photos  [HOLD empty structure]
│   └── Friends
├── Friends
├── Inbox
│   └── June thread / reply
└── Requests
    └── Jack → Profile
```

The previous persistent `Feed / Requests / Messages` strip is removed. The Home grid contains only destinations backed by existing functionality. Places is historically READY for Facebook 3.2 but remains out of scope; Chat and broader Photos functionality remain HOLD and were not fabricated to fill grid positions.

## Navigation and return state

Facebook state now owns a local `navigationStack`. Root destination entry establishes `Home → destination`; detail and Profile routes push onto that stack. Back removes only the current route:

- News Feed → author Profile → Back → same News Feed scroll position.
- News Feed → Post → Back → News Feed.
- Inbox → June → Back → Inbox.
- Requests → Jack Profile → Back → Requests.

The title control returns to Facebook Home. It does not mutate application runtime ownership.

## Profile and Wall

Feed avatar and author-name controls open the selected person's Profile with Wall as its initial section. Current-user Profile reads the shared `sessionIdentity.name`. Wall selects existing Feed records by author, so Feed, Detail, and Wall retain one post identity and one `likedItemIds` source of truth.

Profile exposes the audited Wall/Info/Photos/Friends structure. Info and Photos are intentionally empty HOLD surfaces: no profile copy, photos, icons, or artwork were invented. Accepted Jack is marked by the existing Friends relation and is reachable from Friends.

## Requests and Friends

The existing `friendRequestState` remains the sole Jack relationship transition source:

```text
none → pending → accepted | ignored
```

- Before scheduled delivery, Requests is empty.
- Pending Jack appears only in Requests.
- Accept removes the pending count and adds the single shared Jack friend record.
- Ignore removes the pending count without adding Jack.
- Friends derives its rows from `state.friends`; no screen-local duplicate relationship exists.

`selectFacebookRequestCount` derives the Home count from pending state. Exact badge artwork remains HOLD.

## Inbox and Chat decision

June remains in **Inbox**, consistent with the audit's persistent-thread model. Chat remains a distinct, unimplemented HOLD destination and is not silently merged into Inbox.

`selectFacebookInboxUnreadCount` derives the internal count from unread thread records. Entering Inbox does not mark June read. Opening June changes only that thread to read; its existing plain reply path and `none → unread → read → replied` narrative state remain intact. No standalone Messenger or SMS UI was introduced.

## Feed structure

Feed remains a continuous native-style list. Avatar and author are independent Profile links; body opens the existing detail/comments route; Like and Comment are available as compact story actions. The existing reducer continues to own Likes and comments, and user comments continue to use the shared session identity.

Exact story-type routing is still partial: the current content inventory does not justify building photo viewers or external-link routes. Those remain HOLD rather than invented.

## Shared entity and reset model

- Feed/Wall/Detail reuse feed item IDs.
- Requests/Friends/Profile reuse the single Jack relationship state.
- Inbox/thread/unread count reuse `inboxThreads`.
- Session reset recreates Home navigation, clears selection/scroll/Like/comments/Jack/June mutations, and restores the deterministic seed baseline for the new identity.

## Automated results

Reducer validation covers:

- initial Home route;
- Feed → Profile → Back origin and scroll restoration;
- Jack count, Accept, Friends visibility, and resolved count;
- June absence/delivery, Inbox-only entry, read-on-thread-open, and Inbox Back;
- existing Like, Comment, reply, reset, seed/live isolation, and exactly-once scheduler checks.

## Remaining HOLD / C backlog

- Authentic Facebook Home and destination icon rasters.
- Exact 3.2 Home slot order and additional pages.
- Exact notification-area content and chrome.
- Exact blue gradients, fonts, shadows, separators, badge art, button gloss, and 1–3px geometry.
- Functional Chat, Places, Photos, Info, and broader Profile content.
- Story-type-specific photo/link routes.
- Browser pointer/touch verification and visual comparison.

## Verification classification

- Automated reducer/seed verification: required and reported separately.
- TypeScript/production build: required and reported separately.
- Manual browser interaction: **MANUAL TEST REQUIRED**; no browser PASS is claimed by this document.
