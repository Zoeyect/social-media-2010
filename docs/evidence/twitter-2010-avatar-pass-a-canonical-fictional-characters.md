# Twitter Final QA — Avatar Pass A

Status: implemented; pending manual native-scale QA.

## Scope

Pass A replaces initials fixtures only for eight fictional characters backed by existing canonical project media. Source images remain byte-for-byte unchanged. Public accounts, public visitors, the session owner, Jay Diaz, and fictional identities without approved portraits retain the existing fallback.

## Approved registry mappings

| Identity ID | Shared media ID | Source file | Object position | Classification |
| --- | --- | --- | --- | --- |
| `june` | `june-profile-avatar` | `June/June01.PNG` | `50% 35%` | `CANONICAL_AVATAR_CANDIDATE` |
| `matt` | `matt-profile-current` | `Matt/Matt03.JPG` | `50% 34%` | `CANONICAL_AVATAR_CANDIDATE` |
| `jack` | `jack-profile-picture` | `Jack/Jack01.PNG` | `50% 35%` | `CANONICAL_AVATAR_CANDIDATE` |
| `alex` | `alex-profile-picture` | `Alex/Alex.png` | `50% 24%` | `CANONICAL_AVATAR_CANDIDATE` |
| `ben` | `ben-profile-current` | `Ben/Ben01.JPG` | `50% 30%` | `CANONICAL_AVATAR_CANDIDATE` |
| `katie` | `katie-profile-picture` | `Katie/Katie03.PNG` | `50% 35%` | `CANONICAL_AVATAR_CANDIDATE` |
| `chris` | `chris-profile-picture` | `Chris/Chris01.PNG` | `50% 30%` | `CANONICAL_AVATAR_CANDIDATE` |
| `luca` | `luca-profile-picture` | `Luca/Luca.png` | `50% 50%` | `CANONICAL_AVATAR_CANDIDATE` |

The Alex crop is biased upward so Alex remains the primary subject rather than the dogs.

## Resolution and presentation

Stable identity IDs are authoritative. A centralized temporary name bridge covers existing canonical seeded/realtime Tweet rows that do not yet carry stable author IDs. The bridge is explicitly disabled for session-owner Tweets and public visitor Tweets.

One shared renderer is used by Timeline, Tweet Detail, Mentions, Messages, Profile, Suggested Users, and Following. It preserves each surface's existing slot geometry and supplies only the image inside the established 48-point framed square. Images use deterministic `object-fit: cover` and registry-owned `object-position` values.

## HOLD boundaries

- Jay Diaz remains `POSSIBLE_CROP / HOLD`; `Jay01.PNG` is not registered.
- Dana, Nora, Mia, Marcus, Eli, Claire, Sam, Priya, and Eva retain fallback.
- The session owner retains fallback; no face is fabricated.
- Public visitors retain fallback and cannot inherit fictional-character media through display-name coincidence.
- Suggested Users public accounts retain their existing initials and `DEV-HOLD` evidence status pending Pass B.
- Default-avatar artwork remains a separate Pass C decision.
