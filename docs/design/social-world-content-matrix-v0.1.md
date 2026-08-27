# Social World Content Matrix v0.1

## 1. Purpose

This document is the project-level execution matrix for the social world of SOCIAL MEDIA, 2010. It translates the character Bible, established cross-app threads, shared media references, and user-projection principle into reusable content-production rules.

It answers who may appear on each surface, what they plausibly create, whether content is seed or live, how relationships may surface, where media can be reused, and where content risks defining the user. It does not add runtime behavior, require equal content volume, or authorize random content generation.

## 2. User projection principle

Internal governing statement:

> This is your 2010 phone.
> These are the kinds of friends you might have.

The phone belongs to the user. Friends may be specific, but the user's identity remains intentionally open. Do not infer or assign the user's hobby, occupation, student status, personality, romantic status, party preference, gender, or lifestyle unless an explicit user action establishes it.

Content should present situations and choices rather than conclusions about the user. A friend may ask `u coming?`; a friend may not assert `you always love parties`. See `docs/design/user-projection-social-circle-principle-v0.1.md` for the full project-level boundary.

## 3. Entity classifications

| Entity set | Members | Classification | Identity rule |
| --- | --- | --- | --- |
| Canonical social characters | Katie, Matt, Alex, Chris, Jay, June, Jack, Ben, Luca | `CORE_SOCIAL_CHARACTER` | Use `CoreSocialCharacterId` where a field references the canonical social world |
| Author identity | Z.tokyo | `AUTHOR_EASTER_EGG` | Facebook-local/meta identity; never add to `CORE_SOCIAL_CHARACTERS` |
| Offline character | Anil | `OFFLINE_SOCIAL_CHARACTER` | May appear only through offline evidence; has no SNS account or direct social action |
| Family contacts | Mom, Dad | `FAMILY / UNIVERSAL RELATIONSHIP` | Separate from the canonical nine; keep prompts broad and user responses optional |

Z.tokyo is a subtle Facebook author cameo and keyboard player in the established band/live-performance context. This role must remain peripheral and unexplained in UI.

Anil is the band's Indian drummer and does not use SNS. Do not create a Twitter account, Facebook profile, DM identity, comment identity, mention identity, or other account-owned activity for him unless future canon explicitly changes this rule.

## 4. Relationship map

| Relationship | Locked meaning | Allowed expression | Boundary |
| --- | --- | --- | --- |
| Katie <-> Ben | Siblings; Ben is Katie's older brother | Shared photos, casual family references, ordinary Facebook context | Do not use the relationship to define the user's family or life stage |
| Chris <-> Luca | Friends and basketball friends | Basketball photos, Facebook posts, Foursquare context, casual references | Luca's restaurant-worker identity must remain visible; do not reduce him to basketball |
| Jay <-> Matt <-> Z.tokyo <-> Anil | Shared music/band context: Jay music-centered, Matt bass, Z.tokyo keyboard, Anil drums | Live-performance photos, music links, background event context, references by active SNS users | Do not imply equal SNS presence; Anil remains offline and Z.tokyo remains a subtle meta identity |
| June <-> Jack | Broader social-circle overlap | Party, school/social events, Facebook activity | Do not define romance or assume the user's party stance |

These are the currently locked relationships. Do not infer additional romance, family ties, or close-friend status from co-appearance alone.

## 5. Main character matrix

| Character | Classification | Primary Hook | Secondary Hook | Strongest Apps | Secondary Apps | Typical Content | Visual Dependence | Seed Suitability | Live Suitability | User-Directed Interaction | Cross-App Threads | User Projection Risk | HOLD Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Katie | `CORE_SOCIAL_CHARACTER` | Everyday closeness | Casual family/social life | Facebook, Twitter DM | Flickr possible | Casual messages, daily life, plans, simple photos, low-context reactions such as `crazy ahaha` | Medium | High | Low/Medium | Yes: open questions such as `u coming?` and `call me when ur home` | Ben sibling context | Medium if closeness becomes romance, shared hobbies, or a fixed life stage | Keep the relationship ordinary and open |
| Matt | `CORE_SOCIAL_CHARACTER` | Tech/code | Music/bass | Twitter | Facebook, Tumblr, band-photo contexts | Bugs, coding, computers, tech links, late nights, dry frustration, occasional bass content | Low/Medium | High | High | Yes, without assuming the user understands code | Jack party reaction; band with Jay, Z.tokyo, Anil | Medium if his technical interests are projected onto the user | He dislikes the party crowd/noise, but do not label him introverted, antisocial, or socially anxious |
| Alex | `CORE_SOCIAL_CHARACTER` | Dogs/ordinary life | Casual social interaction | Facebook, Flickr, Twitter | Foursquare | Golden retriever and French bulldog photos, walks, weather, casual questions, light social posts | High | High | Medium | Yes | Jack party post; Jay and friend-of-friend comments | Low/Medium; questions must not assume shared pet ownership or interest | Dog names remain HOLD |
| Chris | `CORE_SOCIAL_CHARACTER` | Basketball/sports | Outgoing social life | Facebook, Twitter, Foursquare | Flickr | Practice, games, group plans, basketball photos, casual replies | Medium/High | High | Medium | Yes | Luca basketball relationship; wider party/social network | Medium if shared teams, school, or athletic identity are assigned to the user | Keep sports identity character-owned |
| Jay | `CORE_SOCIAL_CHARACTER` | Music | Live performance/link sharing | Twitter, Tumblr, Flickr | Facebook | Bands, shows, guitar, music links, concerts, short and vague music reactions | High | High | Medium | Yes | Alex party comments; band with Matt, Z.tokyo, Anil | Medium if copy assumes the user's music taste or band involvement | Avoid turning every appearance into a music reference |
| June | `CORE_SOCIAL_CHARACTER` | Photos/social visibility | Early Instagram adoption | Facebook, Instagram | Flickr, Twitter | Photos, social events, Facebook activity, Inbox messages, early Instagram discovery | High | High | High | Yes | `Hey, are you online?`; shared party invite; Facebook-to-Instagram discovery | Medium/High if engagement is treated as enthusiasm, attendance, or shared taste | Socially active, photogenic, early adopter, well-connected; not a mean-girl stereotype or influencer |
| Jack | `CORE_SOCIAL_CHARACTER` | Football/broad social circle | Party connector | Facebook | Foursquare, Twitter possible | Football, practice, social events, Friend Request, party-related presence | Medium | Low/Medium | High | Yes | Friend Request acceptance can unlock the shared party invite | High if acceptance is treated as closeness or party commitment | Keep content volume low; importance comes from network position |
| Ben | `CORE_SOCIAL_CHARACTER` | Working adult/office life | Coffee 24/7 | Twitter, Facebook, Foursquare | None required | Coffee, commute, Excel, small finance company, early meetings, clients, overtime, office frustration | Low/Medium | High | Medium | Low/Medium | Katie sibling context | Medium if his work or adult status is projected onto the user | Ordinary office worker, not finance-bro or LinkedIn voice |
| Luca | `CORE_SOCIAL_CHARACTER` | Restaurant work | Basketball/Chris friendship | Facebook, Foursquare, Twitter | Flickr | Late shifts, customers, tips, closing, kitchen, coworkers, exhaustion, basketball after work | Medium | High | Medium/High | Low/Medium | Chris basketball photos and contexts | Medium if work, schedule, or sports are projected onto the user | Restaurant-worker identity must remain visible |
| Z.tokyo | `AUTHOR_EASTER_EGG` | Hidden author presence | Keyboard/live-performance context | Facebook | Band-photo contexts only | One subtle profile/feed cameo; discreet appearance in band or live photos | High | Yes, very sparse | No by default | None required | Band background with Jay, Matt, Anil | Low if peripheral; high if made necessary or explained | Never canonical; no active Twitter/Instagram identity without separate approval |
| Anil | `OFFLINE_SOCIAL_CHARACTER` | Band drummer | Offline group presence | None as account owner | Facebook, Flickr, Tumblr only as depicted context | Band photos, event context, mentions by other characters, offline group evidence | Medium/High when depicted | Offline evidence only | No direct SNS activity | No | Band background with Jay, Matt, Z.tokyo | Low while offline; critical boundary violation if given direct SNS activity | No posts, comments, mentions, DMs, profiles, or account identity |

## 6. App distribution matrix

| App | Primary Characters | Secondary Characters | Sparse/Optional | Avoid / No Account |
| --- | --- | --- | --- | --- |
| Twitter | Matt, Jay, Ben, Alex | Chris, Katie, Luca, June | Jack; Z.tokyo only after separate justification | Anil; default no active Z.tokyo identity |
| Facebook | Katie, Alex, Chris, June, Jack, Ben, Luca, Jay | Matt | Z.tokyo as author easter egg; Anil in offline photo evidence only; launcher surfaces include Feed, Profile, Friends/Requests, Messages, Places, Events, Photos, conservative Chat and derived Notifications | Anil as account owner; Groups is `REJECTED FOR TARGET DATE` and its launcher position remains empty |
| Instagram | June | Jay and Alex only as possible future additions | Do not automatically populate the canonical nine; Z.tokyo only through a separately designed easter egg | Anil; default no active Z.tokyo account |
| Flickr | Alex, Jay, June, Chris/Luca shared contexts | Katie | Band or event media containing Z.tokyo or Anil | Anil as account owner |
| Foursquare | Ben, Luca, Chris, Alex | Jack, June | Matt and Jay low usage | Anil; Z.tokyo by default |
| Tumblr | Jay, Matt | June | Z.tokyo or Anil may appear only inside band media | Anil as account owner; active Z.tokyo blog without separate approval |
| Messages / Inbox / DM / Mentions | Katie, Matt, Alex, Chris, Jay, June | Jack, Ben, Luca where historically and narratively appropriate | Do not force every character into every private surface | Anil; Z.tokyo outside the normal user-contact pool |

Distribution expresses relative fit, not a quota. Historical surface constraints still apply independently.

## 7. Media matrix

All approved character photos are `SHARED CHARACTER MEDIA`, not Facebook-only assets. A single physical asset may be referenced from Facebook Photos, Flickr, Instagram, Tumblr, or linked-image posts when the platform, date, and narrative context are appropriate. Do not duplicate files merely to assign them to another app.

| Character | Existing Media | Best Reuse Surfaces | New Media Need | Priority |
| --- | --- | --- | --- | --- |
| Katie | `Katie01.jpg`, `Katie02.jpg`, `Katie03.PNG`, `Katie04.jpg`, `Katie05.jpg` | Facebook photos/profile, Flickr | None required until a specific story needs it | Medium |
| Matt | `Matt-code-10-15.PNG`, `Matt01.JPG`, `Matt02.JPG`, `Matt03.JPG`; `Matt04.JPG` remains unassigned | Twitter links, sparse Facebook Profile/Photos, Tumblr, band context | Approved bass/band evidence if existing images do not establish it | Medium |
| Alex | `Alex-dogs.PNG`, `Alex01.PNG` | Facebook, Flickr, Twitter image posts | Additional dog media only after dog identity details are locked | High |
| Chris | `Chris01.PNG` | Facebook Profile Picture; social presence primarily through Likes/comments on friends' content | Generic Photos remain intentionally empty; deleted Chris-Luca media stays removed | Medium |
| Jay | `10-18.JPG`, `Jay01.PNG`, `Jay02.PNG` | Flickr, Tumblr, Twitter links, Facebook, band context | Band/live coverage only if needed | High |
| June | Existing canonical references; no new filename locked here | Facebook, Instagram, Flickr | Historically appropriate early-Instagram imagery remains dependent on IA and asset approval | High |
| Jack | Existing canonical references; no new filename locked here | Facebook profile/activity, sparse event context | Football or group-event media optional, not required for narrative | Low/Medium |
| Ben | `Ben0.png`, `Ben-car.JPG`, `Ben-coffee.PNG`, `Ben-coffee02.JPG`, `Ben01.JPG` | Twitter links, Facebook, Foursquare | None required | Medium |
| Luca | `Luca.png`, `guys.png`, `guys02.PNG`, `guys03.png`, `Luca-work.png` | Facebook profile/photos, Flickr, Foursquare context | None required for the current profile/work/basketball baseline | Medium |
| Z.tokyo | Supplied author portrait at `src/assets/facebook/characters/z-tokyo/profile/IMG_1423.JPG`; existing author/photo references where approved | Facebook profile picture, Wall activity, Photos/Profile Pictures album later; discreet band media | Full Photos UI and additional album content remain HOLD | High for existing cameo, low for expansion |
| Anil | No standalone social-profile asset approved; band evidence only | Facebook/Flickr/Tumblr photos owned or posted by others | Band/group depiction only if separately approved | Low until a background thread needs it |

Asset availability does not authorize new biography, relationships, or event attendance. Media reuse must preserve provenance and must not alter historical assets.

## 8. Narrative thread matrix

| Thread | Characters | Apps | Trigger | Required User Action | Optional/Missable | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Jack Party | June, Jack, Alex, Jay, Matt; Chris/Luca only as broader context if useful | Facebook Events/Notifications/Messages/Feed, Twitter | Reply to June or accept Jack; both converge on one shared invite | None for world context; either trigger for invitation delivery; RSVP only by explicit choice | Optional and missable; user stance remains undefined | `ACTIVE / CURATED`; one shared Events projection, no duplicate invite |
| June -> Instagram | June | Facebook -> Instagram | June's Facebook discovery post/handle | Optional exploration | Optional and missable | `ACTIVE DATA LINK`; exact Instagram discovery/Follow IA `HOLD pending audit` |
| June/Jack Instagram Drama | June, Jack, Katie, Chris; Jay intentionally absent | Facebook Feed/Comments/Messages, Instagram discovery/Profile/Feed | Fixed scheduler events from T+60 through T+210 | None; discovery and Follow are explicit optional actions | Optional and missable with early, mid, late and unseen outcomes | `ACTIVE / OPTIONAL / MISSABLE`; party state independent |
| Matt/Jay/Z.tokyo/Anil Band | Jay, Matt, Z.tokyo, Anil | Twitter, Facebook, Flickr, Tumblr as context permits | No direct trigger required | None | Optional and missable | `BACKGROUND WORLD THREAD` |
| Chris <-> Luca Basketball | Chris, Luca | Facebook, Flickr, possible Foursquare | Seed or contextual appearance | None | Optional and missable | `BACKGROUND RELATIONSHIP` |
| Katie <-> Ben Siblings | Katie, Ben | Facebook, shared photos, casual references | Seed/contextual appearance | None | Optional and missable | `BACKGROUND RELATIONSHIP` |
| Alex Dogs | Alex | Facebook, Flickr, Twitter | Seed or recurring character-authored content | None | Optional and missable | `CHARACTER RECURRING MOTIF` |
| Mom / Dad Messages | Mom, Dad | Messages | Existing family-message flow | Optional reply | Optional; separate from the canonical nine | `FAMILY / UNIVERSAL RELATIONSHIP THREAD` |

No listed thread is required for understanding or completing the 15-minute experience. A thread's runtime status does not make user participation mandatory.

### Shared venue continuity

Luca's Facebook check-in, March 2010 workplace photo, and Foursquare venue all reference canonical venue ID `main-street-diner` with display name `Main Street Diner`. This is identity continuity only; cross-app deep linking remains HOLD.

Frank is a Facebook-local `EPHEMERAL_FRIEND_OF_FRIEND` and basketball-social peripheral. His only approved role is one closing joke in Luca's Pickup Basketball comment thread; he is not a canonical character or recurring storyline.

Jay's October 19 band post is high-engagement social/music-circle content with a deterministic 48-Like and 11-comment baseline. Ryan and Frank remain Facebook-local ephemeral actors and use the shared default Facebook avatar; their participation does not make them canonical or recurring protagonists.

Alex's centralized Facebook media includes `Alex.png` plus a `Dogs` album documenting long-term pet continuity from a 2007 golden retriever photo to the 2009 `旺財&BB` golden retriever/French bulldog photo. These remain historical Profile content rather than current Feed stories.

Ben's Facebook baseline now has centralized `Profile Pictures` and `Photos` albums plus 30 explicit historical Wall statuses. The record density is intentionally uneven from November 2009 through October 2010: mostly mundane coffee, commute, deadline and end-of-day fragments, with occasional dry office humor. `Ben01.JPG` is one physical shared asset referenced by separate ordinary-photo and profile-picture records; all historical records remain Profile-only and do not inflate the current Feed.

## 9. User projection risk matrix

| Content Type | Risk | Rule |
| --- | --- | --- |
| Friend shares their own hobby | Low | Allowed; keep the hobby character-owned |
| Friend asks whether the user saw or listened to something | Low/Medium | Allowed when phrased as an open question rather than evidence of shared interest |
| Friend says `because you love X` | High | Avoid unless the user explicitly established that preference |
| Friend asks `you coming?` | Low | Allowed; the user's choice stays open |
| Friend says `you always love parties` | High | Avoid |
| Friend references the user's occupation | High | Avoid unless directly established by the user |
| Friend references the user's school or student status | High | Avoid unless directly established by the user |
| Friend assigns the user a personality, mood, gender, romance, or lifestyle | High | Avoid unless the relevant fact was explicitly established and is necessary |
| User-generated action changes session state | Low | Allowed because the user explicitly chose it |
| Accepting or following unlocks content | Low/Medium | Unlock only the minimum consequence; do not infer closeness, enthusiasm, or preference |
| Prewritten session-owner post, Tweet, photo, or profile claim | High | Avoid; it fabricates user-authored history unless separately justified |
| Friend-to-friend content unrelated to the user | Low | Encouraged when it strengthens an independent social world |

## 10. Seed/live guidance

| Character | Seed Weight | Live Weight | Notes |
| --- | --- | --- | --- |
| Katie | High | Low/Medium | Everyday familiarity works best as baseline texture; keep live prompts sparse |
| Matt | High | High | Text-heavy Twitter use and the party reaction support both modes |
| Alex | High | Medium | Dog and ordinary-life media suit seed content; occasional live social posts are plausible |
| Chris | High | Medium | Sports/social context can establish the world without demanding frequent live events |
| Jay | High | Medium | Music links and photos suit baseline content; live reactions should remain concise |
| June | High | High | Strong seed visibility plus established Inbox, party, and Instagram discovery roles |
| Jack | Low | High | Low volume and high network significance; Friend Request and party path carry the role |
| Ben | High | Medium | Office and coffee observations create baseline texture; live activity need not be frequent |
| Luca | High | Medium/High | Seed work context should remain visible; late-shift timing can support selective live content |
| Z.tokyo | Sparse seed only | None by default | One quiet Facebook cameo; no live event unless a future easter egg explicitly authorizes it |
| Anil | Offline evidence only | None | May be seen or referenced, never act through an SNS account |

These weights are directional. Do not turn them into exact quotas without a separate content and timing audit.

## 11. Content density rules

The nine canonical characters do not require equal content volume. Density follows platform fit, visual dependence, narrative role, time-of-day plausibility, and believable 2010 usage patterns.

- Matt may have more Twitter text and fewer photos.
- Matt's Facebook Profile density is LOW/MEDIUM; brief technical comments are plausible, while Twitter remains his strongest platform.
- June may have more Facebook/photo presence and the earliest Instagram presence.
- Alex may have more pet imagery.
- Chris has LOW self-posting, HIGH Comment/Like activity, and LOW Profile density; sparse space is intentional.
- Ben may have more office/coffee text and fewer photos.
- Jack should have low content volume but high narrative significance.
- Luca needs enough restaurant content to keep work more visible than basketball alone.
- Z.tokyo must remain sparse even when media exists.
- Anil's visibility comes only from offline evidence owned or posted by others.

The world does not revolve around the user. Matt can complain about code, Ben about clients, Luca about closing, Jay can share music, Chris and Luca can appear together, Alex can post dogs, and a friend-of-friend can comment without addressing the user. The user owns the phone, but friends have independent lives.

## 12. Offline and non-SNS character rule

Offline presence is a valid form of world-building and must not be converted into account activity for convenience.

For Anil:

- another character may post a band photo containing him
- another character may mention him in event or band context
- a photo caption may identify him when that identification is already approved canon
- he may not own a post, comment, profile, message, DM, mention, check-in, or social notification

For Z.tokyo:

- the existing Facebook-local author identity may own its approved sparse cameo
- band images may include the keyboard role discreetly
- the identity may not enter the canonical registry or ordinary user-contact pool
- expansion into another active account requires explicit easter-egg approval

## 13. Optional and missable narrative principle

Every future thread must be marked `REQUIRED`, `OPTIONAL`, or `MISSABLE`. Social threads default to `OPTIONAL / MISSABLE`.

The experience must not require the user to:

- find June's Instagram
- discover Z.tokyo
- follow the Jack party storyline
- notice the band relationship
- see Anil
- open every photo

Incomplete discovery is intentional. It preserves agency, replay variation, and the sense that the social world continues beyond the user's immediate attention.

## 14. Existing A-level content issues

| Surface | Record | Current Copy | Classification | Recommended Migration |
| --- | --- | --- | --- | --- |
| Facebook | `owner-late` -> `ben-long-day` | `Long day.` | `A - RESOLVED` | Reassigned to canonical `ben`; Feed order, count, timestamp, kind, and seed origin preserved |
| Twitter | `late-night-user` -> `late-night-matt` | `can't sleep` | `A - RESOLVED` | Reassigned to canonical `matt`; timeline order, count, timestamp, classification, and seed origin preserved |

Both records formerly prewrote speech and a state of mind for the user. `docs/evidence/user-projection-a-issue-migration-v0.1.md` records their canonical reassignment and assertion updates. No pre-authored session-owner seed post replaces them.

## 15. Future content-authoring checklist

Before adding any fictional post, message, photo, comment, profile field, or live event:

1. Which character owns it?
2. Does it fit that character's established identity?
3. Does it fit this app and surface in 2010?
4. Is it seed or live?
5. Does it accidentally define the user?
6. Is it part of an existing thread?
7. Is it optional or missable?
8. Does it require media?
9. Can approved shared media be reused without duplicating the file?
10. Does it introduce a new named character unnecessarily?

Also confirm that canonical references use `CoreSocialCharacterId`, Z.tokyo remains a separate `AUTHOR_EASTER_EGG`, Anil remains an offline non-SNS character, and no content path infers more than the user's explicit action establishes.

## 16. Facebook narrative content lock v0.4

Facebook narrative content is now `LOCKED`. The final map is June's Instagram announcement and Katie/Chris aftermath, Katie's private message, Jack's request and one shared party Event, Alex/Jay/Ryan party context, Ben's office-life anchor, Chris/Luca basketball media, Katie/Ben sibling interaction, and restrained Jay/Z.tokyo/offline-band context. Major new Facebook drama requires explicitly reopening the lock.

Facebook Feed now uses visibility-aware shared records across `status`, `photo`, `album`, `checkin`, and `activity`. Comments and Likes derive from actor records; June's deterministic Like growth is notification-free. IG04 remains Instagram-only, Jack friends-only content is hidden before acceptance, and Anil remains an offline-only identity pending approved group media.

## Facebook Photos / Albums boundary

Approved shared media is reachable through each owning Facebook Profile and a registry-driven album. Z.tokyo, Luca, Katie, Jay, Alex, and Ben now have approved album/media bindings. June, Jack, Matt, Ryan, and the current user remain empty on this surface; Anil has no Facebook profile. This is a media-availability boundary, not a statement about fictional lifetime photo counts.

Katie has two Facebook album bindings: `Profile Pictures` for `Katie03.PNG` and a four-photo `Photos` history spanning July 2009 through September 2010. The September selfie carries one real canonical Ben sibling-banter comment, which preserves visible sibling continuity without the intentionally deleted family photo; historical photos remain outside the current Feed.
