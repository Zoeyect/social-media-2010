# Facebook Unified Story / Wall / Photo Interaction v0.1

## Canonical story model

Facebook Feed and Profile Wall consume the same `FacebookFeedItem` records and the same reusable `FacebookStoryView`. A story keeps one ID, actor, copy, media binding, ISO timestamp, Like state, Comment state, and structured mention set across Feed, Wall, and Post Detail. Wall does not copy or simplify story data.

Supported Wall story types are status, photo, album, check-in, and activity. Only existing Profile Wall stories are enriched; historical album-only records do not create new Wall activity.

## Shared interactions

Like and Comment summaries use `selectFacebookLikes` and `selectFacebookComments` on the canonical story ID. The same transition events power Feed, Wall, Post Detail, and Photo Detail. June's elapsed-time Like growth is therefore visible wherever `june-show-photos-oct19` appears. User Likes and comments mutate the same state arrays and immediately appear on every surface bound to that ID.

`FacebookStoryCounts` provides one singular/plural formatter, while `FacebookCommentRow` provides one avatar/name/body/mention anatomy for both detail surfaces. Comment actors route through the shared canonical, ephemeral, author-easter-egg, and session-user resolver. Sophie retains `S.png`; stable friend-of-friend mappings remain centralized; Anil remains plain text without an SNS actor.

## Upload story and photo ownership

The architecture distinguishes `storyId` from optional `uploadStoryId` on album photo records.

- June `10/18`: all three photos intentionally use upload story `june-show-photos-oct19`, including its 41-to-51 live Like progression and ten seed comments.
- Luca `Pickup Basketball`: all three photos intentionally use `luca-pickup-basketball-photos`.
- June `18th Birthday`: upload engagement remains on `june-18th-birthday-photos` at 38 Likes and 12 comments. The bag, gift, and main Photo Detail records use independent `june-birthday-bag-photo`, `june-birthday-gift-photo`, and `june-birthday-main-photo` IDs. Liking or commenting on one photo does not mutate the upload story or sibling photos.
- Ben's ordinary Ben01 photo and Profile Picture update remain separate story usages of one physical asset.

## Surface distinctions

Feed and Wall use compact canonical story rows. Post Detail derives a larger textual layout from the same story. Photo Detail retains the dark photo viewer and derives owner, album, date, caption, media, and interaction key from the album photo record. Context-specific timestamp formatting is allowed, but every bound surface starts from the same ISO source.

Album previews route through the centralized album registry. Photo thumbnails route to canonical Photo Detail records. Existing navigation stacks preserve the originating Profile or Feed route on Back; no second comment, Like, or Wall store exists.

## Repaired inconsistencies

- Media-backed Wall stories no longer render as text-only rows.
- Jay's band image and 48/11 baseline now appear from the same story on Feed, Wall, and Post Detail.
- June's three-photo show preview and live engagement are shared across those surfaces.
- Luca's existing basketball upload renders through the same Wall story architecture.
- Post and Photo Detail now share one consistent comment anatomy and actor-avatar resolver.
- Birthday upload and individual-photo interaction ownership is explicit.

## Boundaries

No new story content, user history, Chris self-posting, Tagged Photos, scheduler event, global timing, or image asset was introduced. Final 2010 pixel fidelity remains a separate pass.
