# Twitter for iPhone Historical UI — Checkpoint B4a Messages List Fidelity

## Scope

Checkpoint B4a makes only the Twitter Messages root-list typography deterministic. It preserves the approved list structure and geometry, canonical Direct Message content and state, navigation, the tab unread indicator, and every previously committed Twitter checkpoint.

Target: iPhone 4, iOS 4.1, Twitter for iPhone 3.0.x circa October 2010.

DM detail composition and the DM reply UI remain `HOLD`. The existing rounded-card detail is a known unsupported historical mismatch and is deliberately unchanged until B4b receives separate evidence and approval.

## Evidence and confidence

The May 20, 2010 Netaful Twitter for iPhone walkthrough directly identifies `tw_for_iphone_056222.png` as the Direct Messages screen. It supports the plain avatar-led Messages list, sender and preview hierarchy, right-side timestamps, separators, and read/unread distinction. Contemporary Twitter for iPhone reporting establishes that the release retained Tweetie 2's visual foundation, while Tweetie 2 reporting supports threaded Direct Message semantics and the tab-level unread indicator.

- Messages list anatomy: `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`;
- 62px minimum, 7px/10px padding, 48×48 avatar, x=60 copy origin: `RECONSTRUCTED` / period-supported;
- 15/18 sender, 13/17 preview, and 11/17 timestamp typography: `RECONSTRUCTED`;
- unread row color `#edf4fa`: approved project treatment; exact RGB `RECONSTRUCTED`;
- white read/empty field and thin gray separator: `PROBABLE` structure, exact colors `RECONSTRUCTED`;
- Katie/Matt identities, wording, ordering, timestamps, and unread lifecycle: canonical project invariants;
- initials avatars: project placeholders, not authenticated Twitter artwork;
- DM detail composition and reply UI: `HOLD`.

No authenticated Twitter 3.0.x application-bundle Messages artwork or native DM-detail raster was recovered.

## Locked Messages geometry

- content-driven row with a 62px minimum;
- 7px vertical and 10px horizontal padding;
- existing 48×48 framed initials avatar at x=10/y=7;
- intentional 42px grid track plus 8px gap, placing copy at x=60;
- timestamp upper-right with the existing 10px row inset;
- full-width one-pixel `#c7c7c7` separator;
- white read and empty-list field;
- pale-blue `#edf4fa` unread field.

The geometry is intentionally distinct from Timeline B1 and Mentions B3 and was not normalized to either Tweet-list anatomy.

## Deterministic typography

- sender: 15px size, 18px line height, weight 700;
- preview: 13px size, 17px line height, weight 400;
- timestamp: 11px size, 17px line height, weight 400, upper-right.

All text continues through the existing period Helvetica / Helvetica Neue stack. No unread-only font-weight change, dot, badge, or additional marker is rendered.

## Canonical behavior preserved

- Katie Dawson appears first, begins unread, and uses the pale-blue row.
- Matt Ricci appears second, begins read, and uses the white row.
- Opening Katie marks only Katie read; returning retains both rows and their order.
- Opening Matt does not change either read state.
- Timestamps remain the seed strings `11:46 PM` and `10:21 PM`; no host time, relative time, or date label is introduced.
- Whole-row routing, Messages scroll restoration, tab-root navigation, suspend/resume, and RESET semantics are unchanged.
- The Messages tab unread indicator remains derived from canonical Direct Message unread state.
- Timeline B1/B2 and Mentions B3 presentation and behavior remain unchanged.
- DM detail markup, navigation, title, tab visibility, rounded-card presentation, and lack of a reply composer remain source-unchanged for B4a.

## Sources

- Twitter, `Twitter for iPhone`, May 19, 2010.
- Netaful, `Twitter for iPhone`, May 20, 2010, including the directly identified Direct Messages capture.
- MacRumors, `Tweetie 2 Arrives in the App Store`, October 9, 2009, documenting threaded Direct Messages.
- TechCrunch, `Preview: Tweetie 2`, September 28, 2009, documenting the tab-level unread indicator.
- Twitter, `Twitter for iPhone & iPad: Even Better`, March 3, 2011, used only as the later conversation-view boundary.
- Project evidence: Checkpoint A shell/navigation, B1 Timeline rows, B2 swipe actions, B3 Mentions fidelity, and tab unread-indicator synchronization.
