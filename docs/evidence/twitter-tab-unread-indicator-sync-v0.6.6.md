# Twitter Tab Unread Indicator Sync v0.6.6

## Result

Mentions and Messages tab indicators now reflect their actual Twitter-local unread records. No independent visibility boolean, cached badge state, scheduler event, or cross-app notification state was added.

## Source of truth

- `selectTwitterMentionsUnreadCount(state)` counts `state.mentions[].unread`.
- `selectTwitterDirectMessagesUnreadCount(state)` counts `state.directMessages[].unread`.
- `TwitterTabBar` receives those derived counts and renders an indicator only when the relevant count is greater than zero.
- Timeline, Search, and More always resolve an unread count of zero and are unaffected.

This structure also supports future Twitter-local Mention/DM records: any newly appended unread record automatically affects its corresponding selector without a second synchronization action.

## Reading semantics

Selecting Mentions or Messages changes only the active Twitter tab/view. It does not mark records read.

- `OPEN_MENTION` marks only the selected Mention read.
- `OPEN_DIRECT_MESSAGE` marks only the selected DM thread read.
- If other unread records remain, the derived count remains positive and the indicator stays visible.
- Opening a record does not clear unrelated Mention, DM, or other-tab state.

The read records remain inside the retained Twitter state across tab changes, Home suspension, app switching, and lock/sleep/resume. Session reset reconstructs the seed baseline, restoring one unread Mention and one unread DM.

## Visual treatment

The indicator is an unnumbered 6pt blue dot with a restrained border/inner highlight. It is positioned inside the existing fixed tab button and does not change footer geometry.

This is a functional period-style approximation. Exact 2010 Twitter for iPhone dot dimensions, color, raster/chrome, and placement remain HOLD. No red numbered badge, Notification Center treatment, or modern notification UI was introduced.

## Functional checks

- initial Mention unread count: `1`;
- initial DM unread count: `1`;
- entering either tab alone preserves its count;
- opening Alex clears only Alex and yields Mention count `0`;
- opening Katie clears only Katie and yields DM count `0`;
- a synthetic two-unread Mention state retains count `1` after opening only one item;
- reset restores both counts to `1`;
- UI source consumes selectors directly;
- CSS uses the small blue indicator and the v0.6.5 fixed footer shell remains unchanged.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Scheduler, System Foundation, Cross-App Timeline, Messages.app, sibling apps, battery, and lock routing were not modified.
