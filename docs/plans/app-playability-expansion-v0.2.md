# App Playability Expansion v0.2

## Scope

This phase adds session-local interaction inside existing applications. The shared System Foundation, App Runtime, session clock, scheduler, battery lifecycle, lock-notification routing, and identity ownership remain frozen.

Curated live events and user-generated session actions remain separate. All mutations reset with a new simulation session.

## Global user-projection constraint

All app expansions must preserve the session owner as an under-specified projection surface. Do not add seed content, profile metadata, dialogue, or narrative consequences that canonically assign the user a hobby, school, occupation, fixed personality, romantic interest, party preference, or unchosen personal history.

Specificity belongs primarily to the nine canonical social characters and other clearly separated peripheral identities. User-authored actions may become session-local facts, but a trigger must not infer more than the explicit action establishes. Apply the writing checklist and audit rules in `docs/design/user-projection-social-circle-principle-v0.1.md` during every content pass.

## App sequence

| App | Planned interaction | Status | A/B findings | C backlog / HOLD | Checkpoint |
| --- | --- | --- | --- | --- | --- |
| Twitter | Period five-tab IA, swipe actions, shared New Tweet/Reply composer, user-authored chronological Tweets; preserve Favorite/native Retweet | Composer/timeline v0.3 implemented and code-tested | None remaining | Exact 3.0.2 icon/chrome, composer texture/tools artwork, handle presentation, refresh animation, profile/search content, avatar art, and geometry remain C/HOLD; browser interaction NOT TESTED | `Integrate Twitter 2010 composer and user Tweets` |
| Twitter | Avatar/name/handle profile entry with back-origin restoration | v0.4 implemented and code-tested | None | Exact profile counts/metadata for public figures, action toolbar, and remaining iOS 4 profile chrome remain HOLD | `Add Twitter User Profile Navigation v0.4` |
| Facebook | Jack friend outcome, June reply thread, one plain Feed comment interaction | Implemented and code-tested | None found | Exact Facebook 2010 Friends/message/comment chrome remains C/HOLD; browser interaction NOT TESTED | `Add Facebook v0.2 friend, message, and comment playability` |
| Foursquare | Optional check-in shout, per-venue record, open/close Tip | Implemented and code-tested | None found | Exact shout limit/timestamp chrome and To-Do interaction remain HOLD; Mayor read-only and badges excluded | `Add Foursquare v0.2 shout and Tip playability` |
| Flickr | Seed/user comments and two ID-based Sets with origin-aware Back routing | Implemented and code-tested | None found | Exact 2010 comments/Sets chrome, seed commenter identity, and imagery remain C/HOLD | `Add Flickr v0.2 comments and Sets playability` |
| Tumblr | Confirmed Reblog relation with optional text; seed/user Notes | Implemented and code-tested | None found | Exact 2010 Reblog/Notes chrome, wording, timing, and seed blog identities remain C/HOLD | `Add Tumblr v0.2 Reblog and Notes playability` |
| Instagram | One-photo source, Original filter, confirmation, and post flow using a non-photographic DEV fixture | Implemented and code-tested | None found | Exact launch-era picker/filter/share chrome, complete filter names, and approved photography remain C/HOLD | `Add Instagram v0.2 first-photo playability` |
| Messages | No expansion in this phase unless explicitly requested | Unchanged | None | Additional scripted replies remain out of scope | Existing freeze retained |

## Twitter v0.2 result

- Replies are limited to 140 characters in both the UI and state transition layer.
- Replies use the shared `sessionIdentity.name` and are stored as Twitter-local activity.
- Native Retweet state uses the period term “Retweet”; Quote Tweet is absent.
- A current-user Retweet creates one stable `user-retweet:<sourceTweetId>` activity at the top of the rendered timeline while retaining the untouched source tweet.
- Retweet activities record the source ID, current session identity, original tweet timestamp, and a separate action timestamp; unretweet removes only that user activity.
- Reply, Retweet, and Favorite are independent.
- Twitter-local mutations survive retained runtime state and live timeline deliveries.
- A new-session reset removes replies, reply drafts, Retweets, Favorites, and live additions while restoring the seed timeline.
- The global live-event scheduler and all other app state modules were left unchanged.

## Twitter 2010 IA correction result

- The signed-in shell now exposes the period five-tab order: Timeline, Mentions, Messages, Search, More. Only Timeline is populated; the other destinations are intentionally empty HOLD shells.
- Timeline top navigation now contains account and compose controls. Their text chrome is structural/HOLD and does not claim original button artwork.
- Tweet rows retain the avatar/content-column hierarchy. In the absence of approved portrait assets, neutral initial-based DEV identity fixtures make the column functional without fabricating people or celebrity images.
- A rightward horizontal pointer gesture reveals the Twitter-local Reply / Retweet / Favorite action row. The existing detail route remains available as a secondary path.
- Reply now routes through a shared `New Tweet` composer shell with target-handle prefill, a 140-character limit, remaining count, and period tool categories. General New Tweet sending and unsupported tools remain disabled/HOLD.
- Manual `RT @…` seed records remain ordinary authored tweets. Native Retweets retain source ID/author/text/timestamp plus a separate current-user attribution relation.
- Active tab, selected tweet, revealed action item, composer draft, Favorite, Retweet, replies, and Timeline scroll are root-owned Twitter state and survive retained runtime state. Reset restores Timeline and removes all user/live mutations.
- Scheduler/timeline definitions, System Foundation, other apps, historical assets, and Camera Runtime were not modified.

## Twitter composer and user Timeline v0.3 result

- The shared New Tweet shell now uses the period structural order: compact account context, text surface, attachment disclosure with remaining-character counter, and a dark 2×3 attachment-tools panel.
- The rejected large avatar/name composer row is removed. The session identity supplies a CURATED local handle; exact historical account-line rendering remains HOLD.
- General Compose and Reply retain independent drafts. Compose starts blank; Reply retains target-handle prefill; both enforce 140 characters.
- Sending a normal Compose creates one session-local `origin: "user"` Tweet using the simulated device time. It never enters the global scheduler.
- A unified selector orders seed, live, user, and native Retweet activity newest-first by effective activity time with stable ID tie-breaking. A later live Tweet can therefore appear above an earlier user Tweet.
- User Tweets survive the retained Twitter runtime and reset with the Hero session. Self-Retweet remains disabled/HOLD rather than inventing unresolved behavior.
- Exact tool rasters, textures, attachment semantics, animation, and passive-new-item indication remain HOLD. No historical artwork was fabricated.

## Twitter User Profile Navigation v0.4 result

- Avatar, display name, and handle links were added as profile entry points from timeline rows and tweet detail.
- Tweet cell tap behavior remains separate (opens tweet detail) and no full-row hijack was introduced.
- Profile open stores local navigation origin (`timeline` / `tweetDetail`) and restores the same surface on back.
- New-profile state is local to Twitter (`selectedUserId`, `profileOriginView`) and included in state reset and session restoration.
- Profile header renders display name, handle, optional verified marker, bio/location/web metadata, and a minimal stats grid.
- Public figures / fictional users use curated or minimal fields; unverifiable exact counts remain HOLD/omitted to avoid fabrication.
- Profile action surface remains intentionally read-only in v0.4.

## Facebook v0.2 result

- Accepting the scheduled Jack request removes it from pending and creates one minimal session-local Jack friend record.
- Ignoring the request removes it without adding Jack; later duplicate delivery cannot recreate either resolved request.
- The scheduled June message remains absent before delivery, becomes unread on delivery, read on opening, and replied after a successful plain-text response.
- June replies use the shared `sessionIdentity.name`; there is no scripted June response or modern Messenger behavior.
- A Feed detail can accept plain session-local comments attributed to the shared session identity.
- Like, Comment, Friend Request, and June Message mutations remain independent and retain feed scroll state.
- Reset removes Friends, June state/replies/draft, comments/draft, Likes, and the scheduled live records, then restores the Facebook seed baseline with the new identity.
- Global timeline definitions, scheduler code, frozen System modules, Messages, and Twitter were not modified.

## Facebook 2010 native IA correction v0.2 result

- Facebook now launches into a Facebook-local Home hub instead of a persistent Feed/Requests/Messages strip.
- The implemented Home destinations are limited to existing evidence-backed, functional surfaces: News Feed, current-user Profile, Friends, Inbox, and Requests. Places/Chat/Photos root functionality remains out of scope/HOLD.
- A Facebook-local navigation stack preserves origin-aware Back behavior. Feed → Profile → Back restores Feed and its scroll position; Inbox → June → Back restores Inbox.
- Feed avatar/name entry opens Profile/Wall. Wall reuses the same Feed records and Like state instead of cloning post entities.
- Current-user Profile uses `sessionIdentity.name` and exposes structural Wall/Info/Photos/Friends sections. Unsupported Info/Photos content remains empty HOLD structure without fabricated assets.
- Accepted Jack appears through the shared Friends relation; ignored or not-yet-delivered Jack does not. Requests and Inbox counts derive from pending/unread records.
- June remains an integrated Inbox thread, not Chat or standalone Messenger. Opening Inbox alone does not clear unread; opening June does.
- Existing scheduled timing, Like, Comment, June reply, session reset, shared lifecycle, scheduler, and sibling applications remain unchanged.
- Exact Facebook chrome, icon rasters, typography, gradients, notification-area treatment, and pixel geometry remain C/HOLD.

## Cross-App Jack Party Narrative v0.4 result

- The existing June-reply and Jack-accept paths continue to converge on the single deduplicated `facebook-party-invite` Inbox delivery.
- Matt's short party reaction replaces one generic pre-session Twitter filler record, preserving the fourteen-item seed density without adding a scheduler event.
- One Alex Facebook post with `friends-of-friends` visibility is reused by News Feed, Alex Wall, Detail, Like, and Comment state.
- Jay contributes one canonical seed comment; Ryan contributes one separately typed `EPHEMERAL_FRIEND_OF_FRIEND` comment and is not added to the character registry.
- Luca's Facebook photo activity stores canonical Chris participation and a four-photo count while exact tag UI and all photo assets remain HOLD.
- User comments coexist with baseline comments and reset independently with the existing Facebook session state.
- Scheduler architecture, Cross-App Timeline timing, simulated date/time, other apps, and historical assets were not modified.

## Foursquare v0.2 result

- Each successful check-in now stores the current session identity, action timestamp, optional trimmed shout, and points awarded for its venue.
- Empty shout remains valid; a compact 140-character functional limit prevents the local composer from becoming long-form, while the exact historical limit remains HOLD.
- A venue may award points only once in the current session. Repeated check-in returns the unchanged state.
- The existing seed Tip can be opened and closed without affecting check-in, points, Mayor, badges, or ambient activity.
- To-Dos remain unimplemented: project evidence verifies the historical feature but still classifies the exact interaction as HOLD.
- Mayor stays assigned to the seeded other user and no badge is awarded.
- Reset clears check-ins, shout drafts, points, venue/Tip selection, and live activity, restoring the immutable ambient seed baseline.
- Global scheduler/timeline definitions, frozen System modules, Twitter, Facebook, and other apps were not modified.

## Flickr v0.2 result

- Existing seed comment strings are cloned into session-local records with `origin: "seed"`; no unsupported seed author is invented.
- User comments use `sessionIdentity.name`, remain plain text and session-local, and carry `origin: "user"`.
- Two small CURATED Sets reference existing photo IDs instead of duplicating photo records.
- Photo Detail is reused from both Photostream and Set navigation. A local navigation-origin record returns Back to the correct source while retaining Photostream scroll.
- Favorite, Comments, and Set membership remain independent.
- Reset removes user comments, Favorites, selected photo/Set, navigation origin, drafts, and scroll, then recreates the seed comment and Set baseline.
- Upload, Camera Roll, camera capture, EXIF, and maps remain HOLD; Camera Runtime was not modified.
- Global scheduler/timeline definitions, frozen System modules, Twitter, Facebook, Foursquare, and other apps were not modified.

## Tumblr v0.2 result

- Reblog now opens a separate minimal confirmation flow that preserves the source post and accepts optional session-local text.
- Confirm creates one stable `user-reblog:<sourcePostId>` relation with the current identity and an independent action timestamp; Cancel creates nothing.
- Unreblog removes only the current-user relation and its local Note, preserving the source post, live/seed content, and Like state.
- Notes provides a simple chronological state list containing CURATED/HOLD seed Notes and local Like/Reblog Notes with explicit `seed`/`user` origin.
- Like, Reblog, and Notes remain independent. A post can remain Liked while its Reblog is removed.
- Reset clears Likes, Reblogs, drafts, selection, scroll, user Notes, and live posts while restoring the seed Dashboard/Notes baseline.
- Full posting/composer types remain HOLD and were not introduced.
- Global scheduler/timeline definitions, frozen System modules, Twitter, Facebook, Foursquare, Flickr, and other apps were not modified.

## Instagram v0.2 result

- Every session still begins with an empty account: `0` Photos, `0` Followers, and `0` Following.
- Period evidence already recorded for v0.1 supports the broad capture/select, filter, and post sequence. Exact launch-era chrome and the complete filter list remain HOLD.
- The repository contains no approved photographic fixture, so the source step exposes one explicitly labeled, non-photographic DEV-only fixture instead of fabricating a photo or borrowing historical system artwork.
- The functional flow is Source → `Original` → Share → one session-local photo record. A second photo is rejected by the state layer as well as disabled in the UI.
- The photo record keeps owner identity, source, filter, creation time, and `origin: "user"`; it does not mutate the immutable Instagram seed baseline.
- Feed/Profile navigation and scroll state retain the photo during the current session. Reset removes the photo and draft and restores the intentional empty baseline for the next identity.
- Camera Runtime, global scheduler/timeline definitions, frozen System modules, and all other app state modules were not modified.

## Twitter identity, Suggested Users, and follow graph v0.5 result

- Timeline cells now show one primary identity label; the redundant second handle row is removed while handle data remains available to Reply and Profile.
- Search exposes Suggested Users and the current session owner's Profile using period-style list hierarchy rather than modern recommendation cards.
- Twenty Twitter-local suggested-user records carry explicit account/handle/provenance fields. Unverified account snapshots and all avatars remain HOLD.
- Suggested Users, Profile, Following, and owner `followingCount` share one idempotent local follow graph.
- The owner profile uses a modest CURATED baseline and derives session Tweet/Favorite totals without hardcoding a user name.
- Follow/Unfollow survives retained app state and resets to the designed baseline for a new Hero session.
- No scheduler, System Foundation, cross-app timeline, or sibling app state was modified.

## Twitter social graph and demographic balance v0.6 result

- Real-account profile counts now carry field-level `EXACT` / `NEAR-DATE` / `ESTIMATED` / `HOLD` metadata. Only NASA and Conan have near-date follower values; five large public accounts use explicitly rounded estimates; unsupported fields remain blank.
- Suggested Users, Profile, and Following continue to use the same account records and Follow graph. Follow actions do not rewrite public statistics.
- Fictional-user profiles use varied CURATED small-account values instead of one repeated statistical shape.
- Five CURATED work-life Tweets are interleaved into the seed timeline, expanding it from 9 to 14 items without creating scheduler events.
- The sole Apple-reference record remains unchanged, and the three existing live Twitter event definitions retain their IDs and timing.
- No avatars, modern Twitter/X values, scheduler changes, System changes, or sibling-app changes were introduced.

## Twitter universal Follow graph v0.6.2 result

- Follow/Unfollow membership now lives only in `followedUserIds`; Suggested Users no longer owns a second route-specific membership field.
- Every known non-self profile uses the same graph, including Timeline and Tweet Detail authors, Suggested Users, Following, fictional users, and public/official accounts.
- Following is derived from the graph and can include profiles that are not part of the Suggested Users inventory.
- The current user's `followingCount` is derived from graph size; target-account historical/curated statistics remain static snapshots.
- Follow and Unfollow are idempotent, the reducer rejects self-follow, and session reset restores the designed baseline.
- Suggested Users and Following profile-return scroll positions remain preserved. Exact historical button chrome remains C/HOLD.
- Scheduler, System Foundation, cross-app timeline, and sibling app modules were not modified.

## Twitter Follow/follower-count sync v0.6.3 result

- Target Profile follower counts now derive from the immutable account baseline plus a session-local `-1`, `0`, or `+1` relationship delta.
- Initially-unfollowed accounts gain one displayed follower while followed and return to baseline when unfollowed.
- Initially-followed accounts begin at baseline, display baseline minus one when unfollowed, and return to baseline when followed again.
- The shared Profile selector applies the same value across Suggested Users, Timeline/Tweet Detail authors, Following, fictional users, and public accounts.
- Historical/estimated statistic provenance remains attached to the unchanged baseline; the delta is simulated interaction state rather than a historical claim.
- Idempotent graph transitions prevent repeated actions from stacking follower changes, and new sessions discard every prior-session delta.

## Twitter natural stats, Mentions, and Messages v0.6.4 result

- Public-account profile cells now use deterministic irregular values. Evidence-based range estimates are labeled `ESTIMATED-DISPLAY` internally and are explicitly not exact historical snapshots.
- Mentions contains two CURATED seed public mentions using the dynamic session handle; one begins unread and links to an authentic older Conan O'Brien status.
- Messages contains two distinct CURATED seed DM conversations; one begins unread and exposes the same source through plain text plus a functional Tweet link.
- Opening clears the relevant unread state. Linked Tweet Back restores Mentions scroll or the same DM thread, and DM Back returns to its list.
- The linked Tweet is original Wayback-captured period evidence and predates the references; no celebrity Tweet or modern share card was fabricated.
- Read state is session-local and reset restores the designed unread baseline. Exact tab indicators, DM reply composer, and share chrome remain HOLD.
- Global scheduler architecture/timings, System Foundation, other apps, battery, and lock routing were not modified.

## Twitter footer stability and live follower drift v0.6.5 result

- Twitter now uses an invariant three-row app shell: 44pt navigation, bounded flexible content, and a 49pt tab bar fixed at app-surface Y=411pt.
- Mentions and DM surfaces no longer use absolute viewport insets; all variable/empty content scrolls or rests only inside the middle row.
- Real/public Suggested User follower counts derive a deterministic session drift from identity, account ID, and shared simulated second.
- Only a small hash-selected subset changes each second, with a slight positive weighted tendency and a CURATED ±500 session cap.
- Fictional ordinary users receive no drift. Follow/unfollow remains an independent ±1 layer over the same immutable historical/estimated baseline.
- Drift has no timer, random render mutation, stored counter, scheduler event, sound, notification, or animation. T0/new-session display begins at zero drift.
- Exact historical volatility and cap remain CURATED/HOLD; browser pixel comparison remains pending.

## Twitter Mentions / Home Timeline routing v0.6.7 result

- Mentions now stores unread/routing indexes into shared Tweet entities instead of duplicating Tweet content.
- Alex is baseline-followed and the same Alex Tweet object appears in Mentions and Home Timeline; Chris is unfollowed and remains Mentions-only.
- Following Chris later does not retroactively rewrite the already-created historical Home Timeline.
- Reading Alex changes only Mentions unread state. Favorite, Reply, and Retweet share the same Tweet ID across Mention, Timeline, and Detail surfaces.
- The historical Conan reference remains a plain linked status; its Back route respects whether Alex was opened from Mentions or Timeline.
- No scheduler, System Foundation, Cross-App Timeline, sibling app, battery, or lock-routing change was introduced.

## Phase status

**IN PROGRESS.** Instagram now has its v0.2 app-local functional slice. Remaining phase work must continue app by app and must not be declared complete before all selected app checkpoints are finished.
