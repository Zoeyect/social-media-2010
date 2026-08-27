# Facebook News Feed Missing Story Eligibility Audit v0.1

## Scope and pipeline

This audit covers Matt-, Ben-, and Jay-owned Facebook stories dated in 2010, followed by a scan of all canonical-character records carrying the same explicit custom-audience exclusion. The canonical candidate source is `SESSION_SEED_CONTENT.facebook.feed`; `selectFacebookVisibleFeed` applies `isFacebookNewsFeedEligible` and then canonical descending chronology. All audited records exist in that source, have valid non-future 2010 timestamps, and are neither deleted nor hidden. The distinguishing gate is audience visibility.

Legend: `Y` means pass/present, `N` means fail, and `WALL_ONLY` includes historical records intentionally retained on Profile Wall or in Photos without current Feed exposure.

## Matt audit

| Story ID | Actor | createdAt | Exists | Feed Candidate | Year Pass | Future Pass | Visibility Pass | Feed Eligible | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `matt-code-photo-2010` | Matt | `2010-10-15T23:03:00-07:00` | Y | Y | Y | Y | Y | Y | `EXPECTED_FEED` |
| `matt-jack-tagged-photo` | Matt | `2010-10-03T20:00:00-07:00` | Y | Y | Y | Y | Y | Y | `EXPECTED_FEED` |
| `matt-profile-current-update` | Matt | `2010-10-02T21:18:00-07:00` | Y | Y | Y | Y | N | N | `PROFILE_ACTIVITY_ONLY` |

`matt-code-photo-2010` previously used `custom` with `customAudienceIncludesUser: false`, so it reached the centralized eligibility helper but failed the visibility gate. Its canonical semantics are now `friends`; Matt is already in the baseline Facebook friend graph. The Oct 2 profile-picture update remains intentionally profile-local.

## Ben audit

| Story ID | Actor | createdAt | Exists | Feed Candidate | Year Pass | Future Pass | Visibility Pass | Feed Eligible | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ben-long-day` | Ben | `2010-10-19T23:58:00-07:00` | Y | Y | Y | Y | Y | Y | `EXPECTED_FEED` |
| `ben-profile-current-update` | Ben | `2010-10-15T22:12:00-07:00` | Y | Y | Y | Y | N | N | `PROFILE_ACTIVITY_ONLY` |
| `ben-photo-friday-2010` | Ben | `2010-10-15T21:49:00-07:00` | Y | Y | Y | Y | Y | Y | `EXPECTED_FEED` |
| `ben-wall-2010-10-12-coffee` | Ben | `2010-10-12T08:29:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-10-04-spreadsheet` | Ben | `2010-10-04T17:36:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-09-29-still-here` | Ben | `2010-09-29T21:03:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-09-10-numbers` | Ben | `2010-09-10T18:12:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-08-27-home` | Ben | `2010-08-27T16:49:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-08-18-printer` | Ben | `2010-08-18T17:27:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-08-06-emails` | Ben | `2010-08-06T08:41:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-07-23-friday` | Ben | `2010-07-23T16:03:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-07-12-monday` | Ben | `2010-07-12T08:16:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-car-2010` | Ben | `2010-07-10T16:00:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-07-02-weekend` | Ben | `2010-07-02T14:38:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-06-29-quarter-end` | Ben | `2010-06-29T20:44:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-06-11-office` | Ben | `2010-06-11T19:08:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-05-25-excel` | Ben | `2010-05-25T18:31:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-05-14-weekend` | Ben | `2010-05-14T15:55:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-05-06-coffee` | Ben | `2010-05-06T09:22:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-04-27-tuesday` | Ben | `2010-04-27T10:17:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-04-16-meeting` | Ben | `2010-04-16T13:34:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-04-09-outside` | Ben | `2010-04-09T17:18:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-03-31-month-end` | Ben | `2010-03-31T20:06:00-07:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-03-12-client` | Ben | `2010-03-12T16:42:00-08:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-02-26-numbers` | Ben | `2010-02-26T18:09:00-08:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-02-19-lunch` | Ben | `2010-02-19T12:23:00-08:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-02-05-commute` | Ben | `2010-02-05T07:51:00-08:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-01-21-meeting` | Ben | `2010-01-21T14:12:00-08:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |
| `ben-wall-2010-01-08-inbox` | Ben | `2010-01-08T08:36:00-08:00` | Y | Y | Y | Y | N | N | `WALL_ONLY` |

`ben-photo-friday-2010` had the same unintended explicit audience exclusion as Matt's code story. It now uses baseline-friend visibility. The profile-picture update remains separate from the ordinary-photo story despite sharing one physical asset; keeping it profile-local avoids duplicate image activity in the current Feed. Ben's dense mundane history remains discoverable on his Wall rather than flooding the Feed.

## Jay audit

| Story ID | Actor | createdAt | Exists | Feed Candidate | Year Pass | Future Pass | Visibility Pass | Feed Eligible | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `jay-band-performance-photo` | Jay | `2010-10-19T22:00:00-07:00` | Y | Y | Y | Y | Y | Y | `EXPECTED_FEED` |
| `jay-guitar-photo` | Jay | `2010-10-17T21:12:00-07:00` | Y | Y | Y | Y | Y | Y | `EXPECTED_FEED` |
| `jay-may-guitar-photo` | Jay | `2010-05-15T18:00:00-07:00` | Y | Y | Y | Y | Y | Y | `EXPECTED_FEED` |

`jay-may-guitar-photo` was already a canonical 2010 Music-album story with stable media and timestamp, but the same unintended `customAudienceIncludesUser: false` value removed it at the visibility gate. It now uses `friends`, matching Jay's baseline Facebook relationship and the other Feed-eligible Jay music stories.

## Global defect-class scan

All canonical-character 2010 stories with `customAudienceIncludesUser: false` were reviewed. No global selector defect was found: the privacy helper correctly enforces explicit custom audiences. The defect class was incorrect story-level audience data on three already-intended Feed stories: Matt's Oct 15 code photo, Ben's Oct 15 Friday photo, and Jay's May guitar photo.

The remaining excluded records retain evidence-backed non-Feed semantics:

- Profile-picture activities for June, Jack, Luca, Katie, Alex, Ben, and Matt remain `PROFILE_ACTIVITY_ONLY`.
- June's private/custom photo history and birthday album remain Profile/Wall content.
- Jack's custom historical posts remain Wall-only and continue to respect the pre-acceptance relationship boundary.
- Katie's selfie history, Luca's work photo, Ben's dense historical statuses and truck photo remain `WALL_ONLY`.

No character-specific selector exception, duplicate story, or generalized privacy weakening was introduced.

## Final relationship and regression disposition

- Candidate source: unchanged canonical `state.feed`; no duplicate stories were created.
- Eligibility logic: unchanged centralized year, future-time, and visibility gates.
- Data correction: only the three proven `EXPECTED_FEED` records changed from an excluding custom audience to `friends` across the complete audit.
- Chronology: unchanged descending canonical timestamp sort places Matt's Oct 15 11:03 PM story above Ben's Oct 15 9:49 PM story.
- Media relationship, tagged-photo ownership, scheduler, global timing, Feed scrolling, Profile Wall scrolling, and device sleep/wake are unchanged.
