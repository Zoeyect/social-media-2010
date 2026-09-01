# Twitter for iPhone Historical UI — Checkpoint B2 Swipe Action Pane

## Scope

Checkpoint B2 reconstructs only the Timeline swipe action pane and directly related Favorite/Retweet/Profile artwork. It preserves Checkpoint B1 Timeline geometry, Tweet Detail, Twitter state, canonical content, realtime delivery, Mentions, Messages, Search, More, Compose, and root-tab navigation.

Target: iPhone 4, iOS 4.1, Twitter for iPhone 3.0.x circa October 2010.

## Evidence

Direct and contemporary sources:

- Web Design Museum, `Twitter for iPhone in 2010`, native 320×480 Timeline/action-pane capture.
- Ryan Spoon, `Twitter's Surprising iPhone App UI`, October 6, 2010: swipe-right pane, Reply/Retweet/Favorite/user-info and other actions, plus favorited-Tweet corner feedback.
- Macworld, `Tweetie 2 for iPhone`, December 2009: inherited swipe shortcuts for Reply, Retweet, Favorite, and save-later actions.
- Period Tweetie 2 walkthrough: link handling, profile, Favorite, and a broader action category.

No authenticated Twitter 3.0.2 application bundle or action-icon raster was recovered. Every new SVG is therefore `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT` rather than authenticated artwork.

## Pane geometry and layering

The direct capture contains six slots across 320px, producing an approximately 53.33px pitch and centers near x=26.7, 80, 133.3, 186.7, 240, and 293.3.

The action pane occupies the selected Tweet row rather than appending a second toolbar. Runtime composition uses one grid cell:

1. the action pane occupies grid area 1/1 beneath the Tweet;
2. the Tweet row occupies the same grid area above it;
3. completed rightward recognition translates the Tweet row 320px right;
4. the pane stretches to the selected row's content-driven height;
5. its 58px minimum is inherited from the frozen B1 minimum, while longer Tweets create taller panes naturally.

The approximately 82–83px pane in the long-row reference is treated as evidence of row-height coupling, not a universal fixed pane height.

## Gesture and motion

Preserved behavior:

- 36px rightward release threshold;
- horizontal dominance ratio 1.25;
- one `revealedTweetId` at a time;
- vertical `pan-y` scrolling;
- existing Reply, Retweet, Favorite, and Profile callbacks;
- existing reveal clearing during Reply/detail/Profile navigation.

No momentum, spring overshoot, carousel, long press, or direct finger-following drag was introduced.

Final displacement is 320px and approved from the fully exposed historical pane. The short transition is `160ms cubic-bezier(.25,.1,.25,1)`, classified `RECONSTRUCTED`; exact historical UIKit duration/easing remains `HOLD`.

## Six-slot action set

| Slot | Visual identity | Runtime behavior | Classification |
| --- | --- | --- | --- |
| 1 | Reply arrow | Existing Reply composer | Semantics CONFIRMED; artwork RECONSTRUCTED |
| 2 | Retweet arrows | Existing Retweet toggle | Semantics CONFIRMED; artwork RECONSTRUCTED |
| 3 | Favorite star | Existing Favorite toggle | Semantics CONFIRMED; artwork RECONSTRUCTED |
| 4 | Person silhouette | Existing user Profile route | Semantics CONFIRMED at category level; artwork RECONSTRUCTED |
| 5 | Paperclip-like form | Decorative only | Shape RECONSTRUCTED; semantics HOLD |
| 6 | Final action-like form | Decorative only | Shape RECONSTRUCTED; semantics HOLD |

Slots 5 and 6 are non-button spans with `aria-hidden="true"`, no label/title/tab index/handler, and `pointer-events: none`. Their internal names remain neutral. They reproduce directly visible geometry without claiming or inventing functionality.

## Pane material

The pane uses a Twitter-local dark blue/graphite field, restrained four-pixel microtexture, upper/lower edge treatment, and off-white/silver icon silhouettes. No vertical slot dividers or text labels were added.

Material, RGB, microtexture, icon bounds, and pressed treatment are `RECONSTRUCTED_FROM_PERIOD_SCREENSHOT`; exact original resources remain `HOLD`.

## Favorite treatment

- Unfavorited pane state: outline star, directly supported in the native capture.
- Favorited pane state: filled warm star selected through the existing `favorite` boolean. The filled-state mapping is `PROBABLE`; exact RGB is `RECONSTRUCTED`.
- Timeline feedback: the prior literal `Favorite` state leak is replaced by a 15×15px orange/yellow corner marker visible only for favorited Tweets. Behavior/placement direction is period-supported; exact raster and color are `RECONSTRUCTED`.

The corner marker is an absolute overlay and does not change timestamp width, copy columns, text origin, body wrapping, avatar placement, or row height. Native runtime collision remains a manual visual-QA checkpoint because automated browser access was unavailable during implementation.

Tweet Detail's textual `Favorite / Favorited` control remains an explicitly deferred `HOLD` mismatch and was not modified.

## Preserved invariants

- B1 58px minimum, 5px padding, 48×48 avatar, x=60 copy origin, typography, and `#c5c5c5` separator remain unchanged.
- Fourteen seed Tweets, six realtime Tweets, manual RT strings, player Tweets, ordering, scroll restoration, and scheduler remain unchanged.
- Twitter reducer/state source remains unchanged.
- Reply origin handling, Retweet/Favorite persistence, profile Back behavior, root-tab navigation, Mentions, Messages, and unread state remain unchanged.
