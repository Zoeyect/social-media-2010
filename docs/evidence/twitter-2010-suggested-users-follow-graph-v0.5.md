# Twitter 2010 Identity, Suggested Users & Follow Graph v0.5

## Scope and result

This change is Twitter-local. It removes the redundant Timeline handle row and adds a period-appropriate Search → Suggested Users → Profile / Follow graph. It does not add a modern recommendation card, global notification, follow-back, scheduler event, or cross-app mutation.

The functional implementation is complete at the app-local level. Exact 2010 button chrome, avatar bitmaps, account ordering, and public-profile copy remain HOLD.

## Timeline identity correction

| Property | Before | v0.5 | Classification |
| --- | --- | --- | --- |
| Timeline identity | display name plus a second `@handle` row | one primary display/account label above tweet body | PERIOD-EVIDENCE / implemented |
| Handle data | stored and rendered in every cell | stored but omitted from Timeline cells | READY functional boundary |
| Reply prefill | derived from display name | uses stored `authorHandle` when available, otherwise the existing local derivation | READY |
| Profile identity | display name and handle | unchanged; both remain visible | PERIOD-EVIDENCE direction |

No handle/account identifier was removed from tweet or profile data.

## Suggested Users IA

Search now exposes a native list-style `Suggested Users` destination and `My Profile`. Suggested Users uses compact rows with a neutral avatar fixture, display name, handle, short category subtitle, and `FOLLOW` / `UNFOLLOW`. Selecting the identity area opens the existing profile IA. The implementation deliberately excludes modern “Who to follow” cards, mutual-follow explanations, recommendation algorithms, and modern verified-heavy styling.

The same `suggestedUsers[].following` value drives:

- Suggested Users row state;
- Suggested-user Profile action state;
- the current user's Following list;
- the current user's `followingCount`.

There is no second per-screen follow state.

## Account inventory and provenance

`avatarStatus` is `DEV-HOLD` for every entry. No portrait or historical profile image was copied, generated, or implied to be original. Subtitles are broad CURATED categories, not claimed October 2010 biography strings. No modern counts are stored.

| Account | Handle | 2010 handle status | Record classification | Evidence note |
| --- | --- | --- | --- | --- |
| CNN | `@CNN` | supported | PERIOD-EVIDENCE | Period public-account record; exact profile copy HOLD |
| The New York Times | `@nytimes` | supported | PERIOD-EVIDENCE | Period public-account record; exact profile copy HOLD |
| NASA | `@NASA` | supported | PERIOD-EVIDENCE | Period public-account record; exact profile copy HOLD |
| NPR | `@NPR` | supported | PERIOD-EVIDENCE | Period public-account record; exact Suggested Users placement HOLD |
| TIME | `@TIME` | HOLD | HOLD | Exact 2010 account snapshot requires stronger verification |
| BBC World | `@BBCWorld` | HOLD | HOLD | Exact handle/profile state requires stronger verification |
| TechCrunch | `@TechCrunch` | supported | PERIOD-EVIDENCE | Period technology-media account record |
| Mashable | `@mashable` | supported | PERIOD-EVIDENCE | Period technology-media account record |
| WIRED | `@WIRED` | HOLD | HOLD | Exact 2010 account snapshot requires stronger verification |
| Barack Obama | `@BarackObama` | supported | PERIOD-EVIDENCE | Documented pre-2010 public account; no modern stats used |
| Oprah Winfrey | `@Oprah` | supported | PERIOD-EVIDENCE | Period public-account record; exact profile copy HOLD |
| Conan O'Brien | `@ConanOBrien` | supported | PERIOD-EVIDENCE | Original status captures and period/archive evidence are recorded in the project archive audit |
| Kanye West | `@kanyewest` | supported | PERIOD-EVIDENCE | Contemporaneous October 2010 coverage and archive evidence are recorded in the project archive audit |
| Lady Gaga | `@ladygaga` | HOLD | HOLD | Period-prominent candidate; exact snapshot not established here |
| Ashton Kutcher | `@aplusk` | supported | PERIOD-EVIDENCE | Widely documented period account; exact profile copy HOLD |
| Britney Spears | `@britneyspears` | HOLD | HOLD | Exact 2010 account snapshot requires stronger verification |
| Stephen Fry | `@stephenfry` | supported | PERIOD-EVIDENCE | Widely documented early account; exact profile copy HOLD |
| Starbucks Coffee | `@Starbucks` | HOLD | HOLD | Candidate period brand account; exact snapshot HOLD |
| Whole Foods Market | `@WholeFoods` | HOLD | HOLD | Candidate period brand account; exact snapshot HOLD |
| YouTube | `@YouTube` | HOLD | HOLD | Candidate period media account; exact snapshot HOLD |

The inventory intentionally preserves uncertainty in code (`handleExistedIn2010`, `provenance`, `evidence`, and `profileDataProvenance`) rather than silently treating every candidate as verified.

## Current-user count model

The fictional session owner uses a modest CURATED baseline, not a claim about a historical real person:

| Count | Baseline / derivation | Behavior |
| --- | --- | --- |
| Following | 3 baseline records | increments/decrements idempotently with Follow/Unfollow |
| Followers | 12 CURATED | never changes from Follow/Unfollow |
| Tweets | 34 CURATED + session-created Tweets | derived locally |
| Favorites | 7 CURATED + session Favorite actions | derived locally |

The session identity supplies the owner display name and local handle. No name such as Zoey is hardcoded into Twitter state.

## Follow graph behavior

- `SET_FOLLOW` is explicit and idempotent. Repeating `following: true` or `following: false` returns the unchanged state.
- Following count is clamped at zero and cannot double-increment or double-decrement.
- Follow adds the account to the derived Following list; Unfollow removes only that account.
- Follow does not change `followerCount`, generate a follow-back, emit audio/notification, or register a scheduler event.
- Profile, Suggested Users, and Following list remain consistent because they select from one graph.
- Retained Twitter state survives Home, app switching, and lock/sleep/resume.
- `RESET` reconstructs the three-account baseline and removes prior-identity mutations.

## READY / HOLD / REJECT

### READY

- Timeline no longer renders the redundant handle line.
- Stored handles remain available for Reply and Profile.
- Suggested Users contains 20 separate account records.
- Follow/Unfollow, Following list, count update, idempotence, and new-session reset are enforced in state.
- No scheduler or cross-app ownership is involved.

### HOLD

- Exact Twitter 3.0.2 Suggested Users ordering and the exact account roster.
- Exact October 2010 profile biographies/statistics for public accounts.
- All avatar imagery.
- Exact FOLLOW/UNFOLLOW button raster/chrome and list geometry.
- Exact owner-account baseline values; they are explicitly CURATED narrative values.

### REJECT

- Modern Who-to-follow cards, mutual-follow explanations, current bios/counts, modern profile photos, generated celebrity portraits, and global follow notifications.

## A / B / C findings

- A: none after implementation.
- B: the previous empty Search shell and absent shared follow graph were corrected.
- C: avatar art, exact row/button chrome, exact roster/order, and pixel geometry remain in the historical visual-fidelity backlog.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Global scheduler definitions: unchanged
- System Foundation and sibling app state: unchanged by this feature
- Historical/generated avatar artwork: none added
