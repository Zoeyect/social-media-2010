# Twitter Avatar Pass B1 — CNN + NASA public-account avatars

Date/version target: Twitter for iPhone 3.0.x, iPhone 4, October 2010.

Pass B1 changes account media only. The established 48×48 image frame, 4px radius, 1px border, Suggested Users order, account copy, follow graph, statistics, and navigation remain unchanged.

## Implemented accounts

### CNN / `@CNN`

- Stable project identity: `cnn`
- Evidence: Twitter's May 19, 2010 Twitter for iPhone launch material directly shows CNN in the period Suggested Users surface.
- Visible composition: black square field with a red, softly glowing CNN wordmark.
- Identity match: confirmed for the project `@CNN` account.
- Asset: `cnn-2010-reconstructed.png`, reconstructed at 192×192 from the period screenshot composition and downsampled to the native 48×48 delivery size to retain screenshot-era softness.
- Classification: `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.
- Boundary: this is not a recovered Twitter-hosted original profile-image raster and is not described as one.

### NASA / `@NASA`

- Stable project identity: `nasa`
- Evidence: NASA official 2010 social-media material identifies `@NASA` and depicts the account/feed with NASA meatball branding.
- Visible composition: blue meatball field, pale NASA lettering and stars, and the red orbital vector on a square account-image canvas.
- Identity match: confirmed for the project `@NASA` account.
- Asset: `nasa-2010-reconstructed.png`, reconstructed at 192×192 from official period account/branding evidence and downsampled to the native 48×48 delivery size.
- Evidence confidence: `PERIOD-SUPPORTED`.
- Artwork classification: `RECONSTRUCTED_FROM_PERIOD_EVIDENCE`.
- HOLD: exact Twitter-hosted raster, crop, antialiasing, and color values.

## Intentionally unresolved accounts

| Project identity | Reason egg remains |
| --- | --- |
| `nytimes` / `@nytimes` | Target-period account-avatar appearance remains HOLD. |
| `npr` / `@NPR` | Direct period screenshot evidence is for the distinct `@nprnews` account; no cross-account mapping is permitted. |
| `time` / `@TIME` | Target-period account-avatar appearance remains HOLD. |
| `bbcworld` / `@BBCWorld` | Direct period screenshot evidence is for the distinct `@bbcbreaking` account; no cross-account mapping is permitted. |

These identities continue to resolve through the centralized Pass C egg. Their fallback is intentional, not a missing renderer state.

## Resolution and preservation boundary

Resolution order remains:

1. Pass A canonical fictional-character mapping
2. explicit stable-ID public-account mapping (`cnn`, `nasa` only)
3. Pass C period-supported egg fallback

No public mapping uses a display-name substring or handle alias. Player identities, public visitors, Jay, unresolved fictional identities, and all other unresolved public accounts remain on the Pass C fallback. The eight approved Pass A mappings and their crops are unchanged.

## Sources

- Twitter for iPhone launch screenshots, May 19, 2010, preserved in contemporary launch coverage: <https://techcrunch.com/2010/05/19/yes-folks-the-official-iphone-twitter-app-is-here-screen-shots-2/>
- Twitter, “The Evolving Ecosystem,” September 3, 2010: <https://blog.x.com/en_us/a/2010/the-evolving-ecosystem>
- NASA technical material, 2010, “NASA's Twitter Presence,” citation `20100009807`: <https://ntrs.nasa.gov/citations/20100009807>
