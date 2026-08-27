# Canonical Character Bible Audit & Consolidation v0.1

## 1. Executive summary

Audit date: 2026-08-28

This report compares the approved current canon supplied for this pass against the long-term Character Bible, the Social World Content Matrix, typed identity and relationship registries, Facebook actor/media/album/story data, timeline data, validators, and implementation/evidence documents.

No Character Bible, registry, seed, timeline, media, album, or runtime file is changed by this audit.

| Audit measure | Result |
| --- | ---: |
| Major characters audited | 9 |
| Secondary recurring/offline identities audited | 3 |
| Additional ephemeral Facebook identities checked | 15 |
| Unique identities covered | 27 |
| Direct canon conflicts | 6 |
| Stale/superseded assertions | 10 |
| Missing central canon links | 6 |
| Intentional ambiguities preserved | 3 relationship groups plus all user biography |
| Remaining user decisions | 0 |

The approved model resolves three questions left open by the previous audit:

- Jack and Matt are canonical longtime neighbors and close family friends.
- June and Sophie are canonical best friends.
- Jay, Matt, Z.tokyo, and Anil have canonical band roles: guitar, bass, keyboard, and drums.

These facts are already represented by current content, but `docs/CHARACTER_BIBLE_v1.0.md` and `CORE_SOCIAL_RELATIONSHIPS` still claim only Katie/Ben and Chris/Luca are hard non-user relationships. Consolidation is required later, but is not performed in this report.

Jack's age is already correct everywhere active: DOB `1992-08-02`, age 18 on August 2, 2010, and age 18 on October 20, 2010. No Jack-at-17 value remains, so no automatic correction is necessary.

## 2. Per-character audit

### Jack Keller

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity | Jack Keller; DOB `1992-08-02`; 18 on Aug 2 and Oct 20; German-American; Los Angeles; tall and blond | Facebook profile registry and Jack-specific docs match. Character Bible says only `Jack` and omits DOB/surname. | MISSING |
| Football | Football player / captain-type social figure | Character Bible and older docs state formal high-school football captain | NEEDS_USER_DECISION |
| Behavior | Outgoing, socially comfortable; self-posting MEDIUM; tagged VERY HIGH; engagement HIGH | Jack social-centrality implementation matches this hierarchy | CONSISTENT |
| Matt relationship | Longtime neighbors; families know each other; very close pre-SNS friendship | Approved historical stories exist, but the Character Bible social graph and typed relationship registry omit the edge | CONFLICT |
| June/Sophie | Both intentionally ambiguous | Existing party, gossip, birthday, and photo content avoids confirmation | INTENTIONAL_AMBIGUITY |
| Timeline | 2007 family photo; 2008 lasagna; 2009 car/license; Aug 2 birthday; Oct 18 Matt photo; October party | Current stories/media cover each milestone | CONSISTENT |
| Media | Medium owned history, very high external tagged presence | Current strict tagged set is 14 after the birthday pass; older docs still say 9 or defer Jack Profile | STALE_CANON |

### June Park

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity | June Park; age 18; birthday June 6; Los Angeles; recently graduated | Runtime profile info says exactly this. Character Bible still says approximately 17–18 and recently finished/finishing high school. | STALE_CANON |
| Behavior | Popular without mean-girl framing; Facebook HIGH; Instagram HIGH; tagged HIGH; engagement HIGH | Current social baseline, 118/236 Instagram stats, and no follower drift match | CONSISTENT |
| Interests | Starbucks, The Hills, Gossip Girl, beach, shopping, photography, music | Current Facebook profile info contains this exact list | CONSISTENT |
| Sophie relationship | Best friends | Content and legacy-bible addenda match, but Character Bible v1 and typed relationships omit it | CONFLICT |
| Jack relationship | Intentionally ambiguous | Current content preserves ambiguity | INTENTIONAL_AMBIGUITY |
| Band/social circle | Connects to Jay, Matt, Z.tokyo, and Anil | Show media and structured mentions represent this without making Anil an SNS actor | CONSISTENT |
| Media | High owned/tagged presence with Facebook/Instagram boundaries | Current ownership/tag rules are correct; old Tagged Photos-deferred notes are stale | STALE_CANON |
| DOB precision | Birthday and age are approved, but no birth year is approved | Runtime correctly stores birthday display without inventing a DOB | INTENTIONAL_AMBIGUITY |

### Matteo “Matt” Ricci

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity | Matteo Lee Ricci; everyday Matt Ricci; Asian/Italian; about 180 cm; slim | Character Bible and Facebook profile full name match; slim is not consistently centralized | MISSING |
| Behavior | Introverted, quiet, dry/sarcastic with close friends; Facebook LOW; Twitter HIGHER | Character Bible calls him introverted, but Social World Content Matrix explicitly says not to label him introverted | CONFLICT |
| Skills | Code nerd and bass player | Code history, Twitter voice, show media, and band context match | CONSISTENT |
| Jack relationship | Longtime neighbor/family friend | Current historical content matches; central Bible graph and typed registry omit it | CONFLICT |
| Band | Matt bass; Jay/Z.tokyo/Anil band relationships | Matrix and media support this; central relationship registry/Bible do not | MISSING |
| Timeline | 2007 profile/photo; 2008 Jack; 2009 car; 2010 code; Jack birthday; Oct 18 show and Jack photo | Current media/story chronology matches | CONSISTENT |
| Age | Existing Bible says approximately 17–18 | Approved model does not add exact age or DOB | INTENTIONAL_AMBIGUITY |

### Jay

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity/behavior | Guitar, music, band, shows; posts music more publicly than Matt; broad music-circle engagement | Character Bible, Music album, Twitter role, and engagement model match | CONSISTENT |
| Band | Jay guitar; Matt bass; Z.tokyo keyboard; Anil drums | Matrix and show media match; central relationship registry/Bible omit the explicit role set | MISSING |
| Timeline | May guitar; Oct 18 show; Oct 19 upload | Current IDs `jay-may-guitar-photo` and `jay-band-performance-photo` match | CONSISTENT |
| Feed | May 2010 story must remain eligible | Strict validator confirms May story passes centralized Feed eligibility | CONSISTENT |
| Gossip boundary | Not a June/Jack gossip driver | Runtime excludes Jay from that activity | CONSISTENT |
| Media | Music album exists; Facebook avatar remains an intentional default placeholder | No approved portrait conflict | CONSISTENT |

### Katie

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity | Age 14; brunette; girl-next-door; Ben's younger sister | Age and sibling relationship match; appearance wording is not centralized | MISSING |
| Behavior | Everyday/casual; curious but not malicious; school/library/swimming/selfie texture | Existing gossip and selfie behavior match. Swimming should remain content texture, not an inferred user or elite-athlete fact. | CONSISTENT |
| June/Jack | Curious observer; exact message `Do you know Jack????` | Scheduler/runtime preserve exact message | CONSISTENT |
| Media | `Katie03.PNG`, historical selfies, Ben sibling banter | Current actor media, albums, and seed comment match | CONSISTENT |
| Deprecated media | `Katie-Ben.JPG` deleted | No runtime reference remains; older visual assumptions are deprecated | DEPRECATED |

### Ben

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity | Age 23; Katie's older brother; brunette; black-frame glasses | Age/family match; appearance is documented but not centralized | CONSISTENT |
| Work | Small finance company, about one year into job | Ben-specific working-life doc matches; main Character Bible omits the one-year detail | MISSING |
| Behavior | Work/Excel/client/commute/coffee; not family-heavy | Current Wall/media content follows this | CONSISTENT |
| Media | 2005 profile, 2010 profile, coffee, 2010 truck/Ford continuity | Media exists; UI copy says `new truck :)`, while exact Ford identification is not structured metadata | MISSING |
| Feed | October photo remains eligible | Strict validator confirms `ben-photo-friday-2010` Feed eligibility | CONSISTENT |
| Deprecated media | `Katie-Ben.JPG` removed | Registry and validator no longer reference it | DEPRECATED |

### Chris

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity | About 19, about 185 cm, basketball, outgoing/socially attractive | Character Bible matches age/height/basketball; appearance/attractiveness is not centralized | CONSISTENT |
| Posting behavior | NOT a self-poster; Profile intentionally sparse; presence through Likes/comments/gossip/other people's photos | Current sparse-profile implementation matches. Character Bible's older “Facebook HIGH” self-content examples and matrix medium/high activity wording are stale. | STALE_CANON |
| Luca relationship | Basketball friends | Character Bible and typed relationship registry match | CONSISTENT |
| Media | Only approved `Chris01.PNG`; deleted Chris-Luca media stays deleted | Current media/albums match | CONSISTENT |

### Luca

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity/life | Chris's basketball friend; restaurant server at Main Street Diner | Character Bible, venue registry, media, and Foursquare continuity match | CONSISTENT |
| Behavior | Active Facebook poster; work/late shifts/tips/closing/basketball; active Foursquare | Current check-ins, work photo, basketball and birthday uploads match | CONSISTENT |
| Profile picture | Canonical upload-story relationship required | Album uses `luca-profile-picture-current`; Feed/Wall contain exactly one owner story and validator enforces it | CONSISTENT |
| Other media | Pickup Basketball, work photo, Jack birthday four-photo upload | Ownership, album, story and Jack tags are consistent | CONSISTENT |

### Alex

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Role | Golden Retriever, French Bulldog, everyday-life texture, not a drama driver | Character Bible, Dogs album, party participation, and current content match | CONSISTENT |
| Behavior | Dogs/walks/weather/casual Facebook; Foursquare parks, dog walks, coffee, Chinese restaurants, hangouts | Character Bible gives compatible Facebook/Foursquare behavior; not every approved example needs seed content | CONSISTENT |
| Media | Long-running dog history and current `Alex.png` profile image | Current media/albums match | CONSISTENT |
| Dog names | Caption `旺財&BB` exists | Caption does not automatically establish typed dog names; matrix keeps names HOLD | INTENTIONAL_AMBIGUITY |
| Drama boundary | Ordinary-life texture | Current party question is social context, not a protagonist/drama route | CONSISTENT |

### Sophie Miller

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity | Recurring peripheral character; not canonical nine | Current stable Facebook actor/profile supports recurrence, but classification remains `EPHEMERAL_FRIEND_OF_FRIEND` | CONFLICT |
| June relationship | Best friend | Current club photo, comments, and addendum match; central Bible/relationship registry omit it | CONFLICT |
| Avatar | Dedicated `S.png`, excluded from generic pool | Central actor-media mapping matches | CONSISTENT |
| Jack relationship | Intentionally ambiguous | Current comments/birthday content do not resolve it | INTENTIONAL_AMBIGUITY |
| Media | Owns June-club photo and tags June | Album, story, Photo Detail, and tag ownership match | CONSISTENT |

### Z.tokyo

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity | `AUTHOR_EASTER_EGG`, outside canonical nine, unexplained in UI | Actor registry and profile route match | CONSISTENT |
| Band | Keyboard player | Matrix/show tag context match; central relationship model omits role | MISSING |
| Media | Dedicated portrait and structured tagged-photo support | Current implementation matches; old “Photos later/HOLD” notes are stale | STALE_CANON |
| Other apps | No automatic Twitter/Instagram/Foursquare identity | Current boundaries match | CONSISTENT |

### Anil

| Area | Approved current canon | Existing project state | Status |
| --- | --- | --- | --- |
| Identity | `OFFLINE_SOCIAL_CHARACTER`; Indian drummer; somewhat known musician | Matrix and story copy support this; no canonical/SNS registry entry exists | CONSISTENT |
| SNS boundary | No Facebook profile, Twitter, DM, clickable account, or structured social tag | Runtime mentions remain plain text and validator enforces no actor | CONSISTENT |
| Media | May appear in photos or be discussed | Current show context permits presence without ownership/account identity | CONSISTENT |

### Other ephemeral Facebook actors

Ryan, Frank, Mike, Sarah, Kevin, Emily, Nick, Rachel, Eric, Daniel, Sam, Nicole, Derek, Megan, and Evan remain lightweight Facebook-local identities. No biography, family, school, occupation, romance, or cross-app identity leakage was found. Sophie is the sole actor whose recurring approved role no longer fits the generic ephemeral classification cleanly.

## 3. Cross-character relationship audit

| Relationship | Approved status | Current representation | Audit status |
| --- | --- | --- | --- |
| Katie ↔ Ben | Hard canonical siblings | `CORE_SOCIAL_RELATIONSHIPS`, Character Bible, media/comments | CONSISTENT |
| Chris ↔ Luca | Hard canonical basketball friends | `CORE_SOCIAL_RELATIONSHIPS`, Character Bible, media/comments | CONSISTENT |
| Jack ↔ Matt | Hard canonical longtime neighbors/close family friends | Newer docs and 2007–2010 content only; missing from central registry/Bible | CONFLICT |
| June ↔ Sophie | Hard canonical best friends | Content/addenda only; missing from central registry/Bible; Sophie typed ephemeral | CONFLICT |
| Jay/Matt/Z.tokyo/Anil | Hard canonical band-role context | Matrix/media only; missing typed role relationship | MISSING |
| June ↔ Jack | Deliberately unresolved | Current content supports multiple readings | INTENTIONAL_AMBIGUITY |
| Sophie ↔ Jack | Deliberately unresolved | Current content supports multiple readings | INTENTIONAL_AMBIGUITY |
| Chris/Luca ↔ Jack | Broader social circle | Birthday, sports and social content; no false best-friend edge | CONSISTENT |
| User ↔ all characters | User biography and exact relationships open | User-projection guard remains intact | INTENTIONAL_AMBIGUITY |

The approved model supersedes the Character Bible sentence “Only two non-user relationships currently need to be hard canonical.” Consolidation should replace that sentence with a relationship map that distinguishes family/friendship edges from band roles and intentional ambiguities.

## 4. Timeline conflicts

| Timeline item | Canonical value | Conflicting/stale source | Status |
| --- | --- | --- | --- |
| Session anchor | `2010-10-20T00:02:00-07:00` | Old Twitter functional sweep contains a `12:01 AM` session-era observation | DEPRECATED |
| Jack DOB/age | `1992-08-02`; 18 on birthday and target date | No active age-17 value remains | CONSISTENT |
| Jack/Matt history | 2007, 2008, 2009, Aug/Oct 2010 milestones | Character Bible social graph omits history | MISSING |
| Jack birthday | Aug 2 owner/social posts and Aug 3 thank-you | Current stories/media/validators match | CONSISTENT |
| Jay show | Oct 18 performance, Oct 19 10:00 PM upload | Current story/media evidence distinguishes performance and upload dates | CONSISTENT |
| Jay May post | May 15, 2010 and Feed eligible | Strict selector test matches | CONSISTENT |
| Ben October photo | Oct 15, 2010 and Feed eligible | Strict selector test matches | CONSISTENT |
| Luca profile picture | Oct 20 12:00 AM upload story, before 12:02 session | Old evidence once said album-only/no Wall story | STALE_CANON |
| June/Jack live sequence | T+60 through T+210 plus later Sophie comments | Current timeline remains optional/missable and relationship-neutral | CONSISTENT |

## 5. Media continuity conflicts

The approved relationship rule is semantically implemented, but its fields are distributed across registries rather than stored in one object:

- `sharedCharacterMedia.ts` owns source asset, canonical subject context, timestamp, role, and approved uses.
- `facebookAlbums.ts` owns album, uploader actor, `storyId`, caption, and structured tags.
- `sessionSeedContent.ts` owns the uploader Wall/Feed story.
- tagged selectors derive `Photos of [Character]` from structured tags.

This distribution is not currently a runtime inconsistency because strict validators join the records, but it is a duplicate-source risk for future consolidation. Do not flatten it casually.

| Media area | Current result | Status |
| --- | --- | --- |
| Owner versus tag | External Jack photos keep real Mike/Sarah/Sophie/Ryan/June/Luca/Matt owners | CONSISTENT |
| Jack tagged count | Current strict total is 14 after birthday additions | STALE_CANON in old nine-photo docs |
| Jack owned birthday album | Two Jack-owned photos remain outside `Photos of Jack` | CONSISTENT |
| Sophie club photo | Sophie owner, June tag, Sophie Wall story, no June-owned album insertion | CONSISTENT |
| Luca profile picture | One album record and one canonical owner story | CONSISTENT |
| Chris media | Only `Chris01.PNG`; no deleted Chris-Luca source | CONSISTENT |
| Katie/Ben media | Deleted family image stays absent; sibling comment remains | CONSISTENT |
| Ben reused source | Ordinary photo and profile update share bytes but retain distinct story IDs | CONSISTENT |
| Facebook/Instagram June boundary | IG01–IG04 and private June/Jack media do not enter Facebook albums | CONSISTENT |
| Z.tokyo | Author portrait and tagged show context remain separate from canonical nine | CONSISTENT |
| Anil | No owner/profile/tag actor despite visible/plain-text references | CONSISTENT |

## 6. Deprecated canon

1. Jack age 17 on October 20, 2010 is obsolete; no active occurrence remains.
2. Jack Profile/Photos “deferred” language predates the implemented profile.
3. `Photos of June` / Tagged Photos “deferred” language predates tagged aggregation.
4. Jack's nine-tagged-photo snapshots predate the five birthday-tagged additions; current total is 14.
5. Old Jack media rows saying no filename is locked predate `Jack01.PNG` and current albums.
6. Old avatar HOLD language saying Katie is the only approved exception predates centralized actor media.
7. Z.tokyo “Profile Pictures/Photos later” notes predate the implemented author profile media flow.
8. Luca album-only profile-picture notes predate `luca-profile-picture-current` owner story.
9. `Katie-Ben.JPG` / `katie-ben-family` remains intentionally deleted.
10. Deleted Chris-Luca visual media remains intentionally deleted; Luca owns the approved basketball set.

## 7. Intentional ambiguity

The following must not be resolved during consolidation:

- June ↔ Jack relationship status.
- Sophie ↔ Jack relationship/history/interest.
- Alex's dog names beyond the visible `旺財&BB` caption.
- June's exact birth year; only age 18 and birthday June 6 are approved.
- Exact DOBs and unapproved legal names for characters whose approved model does not provide them.
- Every aspect of the user's gender, age, school, job, hobbies, sports, romance, party preference, personality, and exact closeness to characters.

## 8. Resolved decisions

1. Jack remains the formal school football captain, now explicit in runtime/profile metadata.
2. Sophie uses the Facebook-local `RECURRING_SECONDARY_CHARACTER` classification while remaining outside the canonical nine.
3. The normalized media relationship architecture remains canonical, with a read-only joined resolver exposing media, owner, album, story, timestamp, caption, and tags.

The approved model has also resolved Jack/Matt, June/Sophie, and band-role canon. Remaining consolidation work should align central relationship documentation without changing these decisions.

## 9. Safe automatic corrections

- Jack 17 → 18 requires no edit because all active values are already correct.
- The three approved decisions above are applied as a bounded consolidation pass.
- A later approved consolidation may update Character Bible facts, typed relationships, and stale documentation in bounded passes.

## 10. Recommended consolidation order

1. Update normative Character Bible facts and relationship map without touching runtime.
2. Add approved typed relationship/role records for Jack/Matt, June/Sophie, and the band.
3. Preserve Sophie's resolved recurring-secondary classification across future Facebook surfaces.
4. Align Chris and Matt behavior language across Bible and matrix.
5. Mark obsolete implementation snapshots deprecated rather than deleting history.
6. Only then audit runtime copy for character-voice drift; do not bulk rewrite seed content preemptively.
