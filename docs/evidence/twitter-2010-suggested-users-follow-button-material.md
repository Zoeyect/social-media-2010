# Twitter 2010 Suggested Users — Follow control material

Status: implemented as a narrow Suggested Users–only visual correction.

## Evidence and confidence

The supplied native 2010 Suggested Users screenshot directly supports both
`FOLLOW` and `UNFOLLOW` as blue skeuomorphic controls with white text. That
visual family is **CONFIRMED**. Exact undocumented gradient stops, border
colors, corner radius, and pixel dimensions remain
`RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`.

## Implemented reconstruction

The existing `.twitter-people-list.is-suggested-users` container scopes the
material without changing the shared Follow-control rule. Both states retain
the existing 27px height, right inset of 8px, and row-local top position of
18px. Label-driven widths are 58px for `FOLLOW` and 74px for `UNFOLLOW`.

Both states use a medium Twitter-blue vertical gradient, a thin blue-gray
border, 5px radius, restrained inset top highlight and lower edge, and white
10/12 Helvetica Neue bold text. The conservative active state remains within
the same blue family and adds no interaction semantics.

## Preserved scope

The existing `SET_FOLLOW` callback path, follow graph, count synchronization,
account order/content, row geometry, and Search/Suggested Users navigation are
unchanged. Profile Follow controls and owner Following-list controls retain
their pre-existing shared material and geometry. No state, seed, asset,
keyboard, Timeline, Mentions, Messages, or Public Twitter code changed.
