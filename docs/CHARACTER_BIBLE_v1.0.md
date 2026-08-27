# SOCIAL MEDIA, 2010 - Character Bible v1.0

**Status:** CANONICAL / CONSOLIDATED v0.2
**Setting:** Los Angeles, October 2010  
**Authority:** Long-term source of truth for recurring character identity, behavior, relationships, chronology, and media continuity.

The nine major characters are specific people. The simulated phone's owner is deliberately under-specified. The experience should evoke recognition of old friends and 2010 social life without deciding who the user was, loved, dated, studied with, or knew best.

## 1. Global Relationship Map

### Hard canonical relationships

| Relationship | Canon |
| --- | --- |
| Katie <-> Ben | Siblings; Ben is Katie's older brother. |
| Chris <-> Luca | Friends who play basketball together. |
| Jack <-> Matt | Longtime neighbors; their families know each other well; Jack is approximately 1.5 years older; teasing and multilingual joking are normal. |
| June <-> Sophie | Best friends. Sophie is recurring-secondary, not one of the canonical nine. |
| Jay / Matt / Z.tokyo / Anil | Band membership: Jay guitar, Matt bass, Z.tokyo keyboard, Anil drums. |

Co-appearance does not create a new hard relationship. Other social overlap may remain natural and flexible.

## 2. Social Engagement Hierarchy

| Character | Self-posting | Tagged presence | Engagement |
| --- | --- | --- | --- |
| Jack | MEDIUM | VERY HIGH | HIGH |
| June | HIGH | HIGH | HIGH |
| Luca | MEDIUM/HIGH | MEDIUM | MEDIUM/HIGH |
| Jay | MEDIUM | MEDIUM | MEDIUM |
| Katie | MEDIUM | MEDIUM | MEDIUM |
| Alex | MEDIUM | LOW/MEDIUM | MEDIUM |
| Ben | LOW/MEDIUM | LOW | LOW/MEDIUM |
| Matt | LOW | MEDIUM/HIGH | LOW/MEDIUM |
| Chris | VERY LOW | MEDIUM/HIGH | INTERACTION-FIRST |

These levels are relative authoring guidance, not quotas. Exact Like, comment, friend, or follower counts are contextual and must not become permanent personality metrics.

## 3. Media Ownership / Tag Principles

The runtime remains normalized. The canonical relationship is:

```text
Media
|- owner
|- album
|- photo
|- story
|- timestamp
|- caption
`- tags
```

- Ownership determines the uploader and uploader Wall story.
- Album membership remains the real source album and is never inferred from owner.
- Structured tags power `Photos of [Name]` without changing ownership or album membership.
- Owned/self-tagged media must not be duplicated into tagged aggregation.
- Wall, Feed, Album, Photo Detail, and tagged-photo routes should resolve the same media/story identity.
- Normalized records remain authoritative; `getFacebookCanonicalMediaRelationship()` is the canonical joined read model.
- UI and validators must not independently rebuild incompatible ownership, album, story, or tag relationships.

## 4. Intentional Ambiguities

`INTENTIONAL_AMBIGUITY` is canon, not missing data.

- June <-> Jack relationship status is unresolved.
- Sophie <-> Jack history, surprise, attraction, or interest is unresolved.
- The user's exact relationship to every character is unresolved.
- The user's biography, personality, interests, school/work status, gender, romance, party preference, music taste, coding interest, and sports identity are unresolved.

No future audit should flag these boundaries as incomplete.

## 5. User Projection Principle

The phone belongs to the user. Characters may naturally ask `you coming?`, `where are you`, `did you see this`, or `thought you'd like this`. They must not canonically infer the user's:

- gender, age, school year, occupation, or location history
- hobbies, sports participation, coding interest, or music taste
- personality, popularity, party preference, or social status
- relationship status, romantic history, canonical crush, or best friend
- exact friendship duration or shared school/work history

The user is both observer and participant. There are no affection meters, romance routes, jealousy mechanics, correct love interests, forced confessions, or required emotional outcomes.

## 6. Katie

### Canonical Facts

- Display name: Katie.
- Age: 14.
- Los Angeles-area student; brunette; girl-next-door presence.
- Ben is her older brother.
- School, library, swimming, and casual photos are appropriate. No prestigious school or special program is canon.

### Personality / Behavior

- Familiar, friendly, warm, mildly impulsive, and curious about gossip without being malicious.
- Everyday closeness and low social performance are her core qualities.
- Short, casual, often lowercase speech fits; she is not a precocious adult, influencer prototype, or teen-drama caricature.

### Social Media Behavior

- Facebook presence: MEDIUM; personal, casual, and interaction-oriented.
- Tagged presence and engagement: MEDIUM.
- Twitter, Instagram, and Foursquare are sparse or non-central.
- Mundane statuses, ordinary photos, friend comments, and harmless sibling banter fit better than polished self-branding.

### Relationships

- Katie <-> Ben: hard canonical siblings.
- Her broader social overlap remains flexible.
- `Do you know Jack????` is continuity from one moment of curiosity, not her defining personality.

### Canonical Timeline

- September 2010 photo history includes Ben's sibling-banter comment.
- October 2010 June/Jack aftermath may prompt her private question without defining the user's knowledge or stance.

### Media Continuity

- Current Facebook Profile Picture: `Katie03.PNG` through centralized actor media.
- Historical casual photo set remains Katie-owned.
- `Katie-Ben.JPG` is deleted/deprecated and must not be restored; sibling canon survives through metadata and interaction.

## 7. Matt Ricci

### Canonical Facts

- Full name: Matteo Lee Ricci; everyday name: Matt Ricci.
- Asian and Italian mixed background; approximately 180 cm; slim.
- Student-age code nerd and technically confident computer user.
- Bass player in the Jay/Matt/Z.tokyo/Anil band.
- Exact DOB/age is intentionally unlocked.

### Personality / Behavior

- Matt is introverted, quiet, observant, dry, and sarcastic with people he trusts.
- Do not reduce him to an introvert stereotype: he has close friendships, performs music, jokes sharply, and is socially familiar and confident in trusted settings.
- He is not socially helpless, an antisocial-genius cliche, or a modern startup founder.

### Social Media Behavior

- Facebook self-posting: LOW.
- Twitter activity: HIGHER; terse code, bugs, computers, links, and late-night observations are natural.
- Tagged presence: MEDIUM/HIGH; engagement: LOW/MEDIUM.
- His social depth should emerge through historical tags, dry exchanges, technical comments, and music performance more than frequent self-posts.

### Relationships

- Jack <-> Matt: hard canonical longtime neighbors and family friends; Jack is approximately 1.5 years older.
- Band: Matt plays bass with Jay, Z.tokyo, and Anil.
- His exact relationship with the user remains ambiguous.

### Canonical Timeline

- Jack-owned tagged history establishes familiarity from 2007 through 2010.
- October 18, 2010 band performance and subsequent Facebook activity are canonical.
- The Matteo Ricci / Li Madou historical-name coincidence remains a subtle Easter egg.

### Media Continuity

- Current Facebook Profile Picture: `Matt03.JPG`.
- Matt-owned Profile Pictures/Photos remain sparse.
- Jack-owned historical tags and June-owned show tags remain external media and must not enter Matt-owned albums.

## 8. Alex Wong

### Canonical Facts

- Full name: Alex Wong; age 21; approximately 171 cm.
- Hong Kong Chinese / Chinese-American family context in Los Angeles.
- University student; academic subject intentionally unspecified.
- Has a golden retriever and a French bulldog.

### Personality / Behavior

- Relaxed, gentle, easygoing, dependable, and comfortable with ordinary life.
- Dogs, walks, weather, parks, coffee, Chinese restaurants, hangouts, and casual questions fit.
- He provides ordinary-life texture and must not become a drama engine or dog caricature.

### Social Media Behavior

- Facebook self-posting: MEDIUM; tagged presence: LOW/MEDIUM; engagement: MEDIUM.
- Facebook dog photos and everyday albums are natural; Twitter and Foursquare are secondary.
- His voice is observational rather than highly curated.

### Relationships

- Alex can bridge loosely between groups without a fixed clique.
- No additional hard relationship is inferred from party discussion or comments.

### Canonical Timeline

- Golden retriever history is visible by October 3, 2007.
- Golden retriever and French bulldog appear together by May 8, 2009 with caption `旺財&BB`.
- October 2010 party question remains contextual, not a defining plot role.

### Media Continuity

- Current Facebook Profile Picture: `Alex.png`.
- Historical dog media remains in Alex's `Dogs` album and outside the current Feed.
- Dog chronology communicates continuity without explanatory exposition.

## 9. Chris

### Canonical Facts

- Display name: Chris; approximately 19; approximately 185 cm.
- College-age, outgoing, socially attractive, ordinary school/team basketball player.
- Not a celebrity athlete, sports prospect, bully, or school king.

### Personality / Behavior

- Energetic, extroverted, direct, group-comfortable, competitive without intensity, and quick to joke.
- Participation is his social role: he makes activities feel available without scripting the user's participation.

### Social Media Behavior

- Self-posting: VERY LOW; Profile density: LOW and intentionally sparse.
- Tagged presence: MEDIUM/HIGH; engagement is INTERACTION-FIRST.
- He browses, Likes, comments, joins gossip/discussion, and appears in others' photos.
- Do not compensate for sparse ownership by inventing Chris posts or albums.

### Relationships

- Chris <-> Luca: hard canonical basketball friends.
- Luca is the more active media poster; Chris reacts and participates.
- Broader overlap with Jack and others remains flexible.

### Canonical Timeline

- Existing Luca basketball Like/comment behavior and June/Jack reaction are canonical examples of his interaction-first presence.

### Media Continuity

- Current and only approved Facebook Profile Picture: `Chris01.PNG`.
- Generic Chris Photos remain intentionally empty.
- Deleted `Chris-Luca*` media must remain deleted; Luca retains ownership of basketball media.

## 10. Jay

### Canonical Facts

- Display name: Jay; approximately 18-20; exact school/occupation intentionally unspecified.
- Music/guitar character and guitarist in the Jay/Matt/Z.tokyo/Anil band.
- Show/performance orientation and wider music-circle presence are canonical.

### Personality / Behavior

- Understated, culturally curious, selective, and occasionally age-appropriately pretentious.
- Music is important without turning him into a tortured artist, gatekeeper, or encyclopedia.
- Gossip-driving behavior is LOW; he must not become a June/Jack gossip engine.

### Social Media Behavior

- Self-posting: MEDIUM; music content: HIGH; tagged presence and engagement: MEDIUM.
- Facebook and especially Twitter may carry music links, shows, records, guitar, and terse reactions.
- Public music posting is more frequent than Matt's.

### Relationships

- Band: Jay guitar, Matt bass, Z.tokyo keyboard, Anil drums.
- Broader music-circle friend-of-friend interactions are natural.
- Other relationships remain flexible.

### Canonical Timeline

- May 2010 guitar continuity is canonical.
- October 18 performance and October 19 Facebook upload are canonical.
- Feed implementation/debug history is not character canon.

### Media Continuity

- `Music` is Jay's canonical owned album for guitar/performance continuity.
- No approved portrait replaces the historically intentional default Facebook avatar.
- Band photos may tag account-bearing members; Anil remains plain-text/offline only.

## 11. June Park

### Canonical Facts

- Full name: June Park.
- DOB: 1992-06-06; age 18 in October 2010.
- Korean-American, Los Angeles, recently graduated from high school.
- Socially central and an early Instagram adopter.
- Interests: Starbucks, The Hills, Gossip Girl, beach, shopping, photography, music.
- Existing six-person family structure remains secondary context, not her defining identity.

### Personality / Behavior

- Social, warm, visually aware, trend-sensitive, and mildly self-conscious.
- Popular without a mean-girl stereotype; attractive/visible without influencer or celebrity framing.
- She documents life but still feels like an ordinary 18-year-old in 2010.

### Social Media Behavior

- Facebook self-posting: HIGH; tagged presence: HIGH; engagement: HIGH.
- Facebook and early Instagram are primary; social photography, albums, comments, and profile changes fit.
- Engagement represents a large offline/school circle and early friend migration, not influencer status.

### Relationships

- June <-> Sophie: hard canonical BEST_FRIENDS.
- June <-> Jack: INTENTIONAL_AMBIGUITY; no romantic status is canon.
- Other school/social overlap remains flexible.

### Canonical Timeline

- June 6, 2010: 18th birthday continuity.
- Recent graduation and 2010 social/photo history are canonical.
- October 18 show upload, October 20 Facebook-to-Instagram discovery, accidental IG04 deletion, and replacement chronology remain optional/missable narrative continuity.

### Media Continuity

- Current Facebook Profile Picture: `June01.PNG` through centralized actor media.
- Owned Facebook albums retain their real source albums; externally owned tagged media appears only through tagged aggregation.
- Sophie-owned `sophie-june-club-photo` tags June but is not June-owned.
- IG01-IG04 and private June/Jack assets remain Instagram/private-boundary media and must not leak into Facebook albums.

## 12. Jack Keller

### Canonical Facts

- Full name: Jack Keller.
- DOB: 1992-08-02; age 18 on August 2 and October 20, 2010.
- German-American, Los Angeles, tall, blond.
- Formal football team captain and socially central figure.

### Personality / Behavior

- Outgoing, confident, broadly known, socially comfortable, and casually teasing.
- His social gravity should be communicated through others' posts, tags, comments, invitations, and reactions as much as his own content.
- He is not a bully, womanizer, route protagonist, or mandatory party gatekeeper.

### Social Media Behavior

- Self-posting: MEDIUM; tagged presence: VERY HIGH; engagement: HIGH.
- Much of his popularity is visible through friend-owned tagged photos and high response density.
- Do not make the Bible depend on a fixed tagged-photo count; derived runtime counts may evolve.

### Relationships

- Jack <-> Matt: hard canonical longtime neighbors/family friends; Jack is approximately 1.5 years older.
- Jack <-> June: INTENTIONAL_AMBIGUITY.
- Jack <-> Sophie: INTENTIONAL_AMBIGUITY.
- Accepting Jack's request may unlock shared party context but does not establish closeness or attendance.

### Canonical Timeline

- August 2, 2010: 18th birthday; August 2-3 birthday social-presence timeline is canonical.
- Historical Jack/Matt continuity spans 2007-2010.
- October 2010 football, tagged social presence, Friend Request, and optional party context remain canonical.

### Media Continuity

- Current Facebook Profile Picture: `Jack01.PNG`.
- Jack-owned albums and friend-owned `Photos of Jack` remain distinct.
- Current derived tagged presence is high (14 in the consolidation audit), but the qualitative `VERY HIGH` rule is authoritative.

## 13. Ben

### Canonical Facts

- Display name: Ben; age 23; brunette; black-frame glasses.
- Katie's older brother.
- Approximately one year into work at a small finance company.
- Coffee-heavy routine; Los Angeles-area working life.

### Personality / Behavior

- Ordinary young adult balancing Excel, clients, commute, coffee, meetings, and overtime.
- Dry office frustration is appropriate; finance-bro, LinkedIn, luxury, or hustle stereotypes are not.

### Social Media Behavior

- Facebook self-posting: LOW/MEDIUM; tagged presence: LOW; engagement: LOW/MEDIUM.
- Work, commute, car, and coffee may appear, but he is not family-content-heavy.

### Relationships

- Ben <-> Katie: hard canonical siblings; Ben is older.
- Other relationships remain flexible.

### Canonical Timeline

- Older Profile Picture/coffee history remains valid Profile history.
- July and October 2010 work/car/photo continuity is canonical.
- Feed validator incidents are not character canon.

### Media Continuity

- Current Facebook Profile Picture: `Ben01.JPG`.
- Distinct stories may reuse one physical source without merging interaction identity.
- `Katie-Ben.JPG` is explicitly deleted/deprecated and must not be restored.

## 14. Luca

### Canonical Facts

- Display name: Luca.
- Restaurant server at canonical venue `Main Street Diner`.
- Basketball player and Chris's friend.
- Exact age, surname, and biography remain unlocked.

### Personality / Behavior

- Working-life texture comes through shifts, closing, tips, customers, exhaustion, and basketball.
- Work must remain at least as visible as sports; he is not only Chris's basketball friend.

### Social Media Behavior

- Self-posting: MEDIUM/HIGH; tagged presence: MEDIUM; engagement: MEDIUM/HIGH.
- Facebook and Foursquare are strong; check-ins, shift posts, venue continuity, and basketball uploads fit.

### Relationships

- Luca <-> Chris: hard canonical basketball friends.
- Coworker and wider social relationships remain flexible.

### Canonical Timeline

- March 2010 workplace photo links to Main Street Diner.
- October 2010 work/check-in and Pickup Basketball continuity are canonical.

### Media Continuity

- Current Facebook Profile Picture: centralized `Luca.png` media.
- Profile Picture is Luca-owned and has exactly one canonical owner story.
- Pickup Basketball remains Luca-owned; Chris participates through appearance and interaction.

## 15. Sophie Miller

- Classification: `RECURRING_SECONDARY_CHARACTER`.
- Stable Facebook-local actor, outside the canonical nine.
- Preserve actor ID `facebook-ephemeral-sophie`, existing route kind, dedicated `S.png` avatar, media mapping, stories, and profile compatibility.
- June <-> Sophie: hard canonical BEST_FRIENDS.
- Sophie <-> Jack: INTENTIONAL_AMBIGUITY.
- Sophie may own stories/media and recur naturally; she must not be demoted semantically to `EPHEMERAL_FRIEND_OF_FRIEND` or promoted into `CORE_SOCIAL_CHARACTERS`.

## 16. Z.tokyo

- Classification: `AUTHOR_EASTER_EGG`; separate from the canonical nine.
- Keyboard player in the canonical band.
- May own approved sparse Facebook-local profile/media and may be structurally tagged.
- The author/meta role must never be explained in UI.
- No expansion into an ordinary recurring account without explicit approval.

## 17. Anil

- Classification: `OFFLINE_SOCIAL_CHARACTER`.
- Indian drummer; somewhat known musician; drummer in the Jay/Matt/Z.tokyo/Anil band.
- No SNS account.
- Must not receive a Facebook profile, Twitter account, DM identity, clickable account, comment identity, or Facebook structured SNS actor/tag.
- May appear visually in others' photos, be discussed, and be mentioned as plain text.

## 18. Deprecated / Superseded Canon

- `June approximately 17-18` is superseded by DOB `1992-06-06`, age 18 in October 2010.
- `Jack captain-type` is superseded by formal football team captain.
- Any Jack-at-17 ambiguity is superseded by DOB `1992-08-02` and age 18.
- `Matt should not be called introverted` is superseded: introversion is canon, stereotype reduction is prohibited.
- Chris high self-posting is superseded by VERY LOW / interaction-first presence.
- Sophie `EPHEMERAL_FRIEND_OF_FRIEND` semantic classification is superseded by `RECURRING_SECONDARY_CHARACTER`; compatibility IDs/kinds remain.
- `Only two hard relationships` is superseded by the Global Relationship Map.
- Jack Profile and Tagged Photos deferred language is superseded by implemented Profile/Photos/tagged aggregation.
- Fixed Jack tagged-photo total `9` is superseded; qualitative VERY HIGH presence is canonical.
- Centralized actor media supersedes old blanket avatar-HOLD language for approved character assets.
- Old session-start references to 12:01 AM are superseded by `2010-10-20T00:02:00-07:00`; individual content may still legitimately carry a 12:01 timestamp.
- Debug failures, Feed omissions, scroll bugs, build incidents, and validator migrations are evidence/history, not Character Bible canon.

## 19. Authoring Rule

Future Facebook posts, comments, Walls, Messages, Twitter posts/replies, Instagram posts, Foursquare check-ins, SMS, profile metadata, captions, cross-character interactions, Easter eggs, party overlap, and notifications must remain consistent with this Bible. Platform activity stays asymmetric. New content must preserve character independence, intentional ambiguity, optional/missable discovery, 2010 voice, and user projection.
