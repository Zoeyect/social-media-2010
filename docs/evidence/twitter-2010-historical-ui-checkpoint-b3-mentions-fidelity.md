# Twitter for iPhone Historical UI — Checkpoint B3 Mentions Fidelity

## Scope

Checkpoint B3 reconstructs only the Mentions list presentation. It preserves Timeline Checkpoints B1 and B2, Tweet Detail, Messages, Search, Profile, More, Compose, Twitter state, canonical content, realtime delivery, root-tab navigation, and the visitor layer.

Target: iPhone 4, iOS 4.1, Twitter for iPhone 3.0.x circa October 2010.

## Evidence and confidence

The May 20, 2010 Netaful Twitter for iPhone walkthrough provides a directly identified Mentions capture alongside the ordinary Timeline. Contemporary Tweetie 2 reviews describe Mentions as a top-level Tweet list and locate unread feedback at the tab-level electric-blue indicator. Existing Checkpoint B1 direct-capture measurements supply the ordinary Tweet-cell dimensions reused here.

- ordinary avatar-led Tweet-list anatomy: `PROBABLE` for Mentions;
- 58px minimum, 5px inset, 48×48 avatar, x=60 copy origin, and compact typography: `PROBABLE` reuse of the measured B1 cell family;
- full-width one-pixel separator geometry: `PROBABLE`;
- separator color `#c5c5c5`: `RECONSTRUCTED`;
- unread Mention pale-blue row treatment: approved from direct runtime/reference comparison; exact `#edf4fa` color remains `RECONSTRUCTED`;
- removal of the list-level `View Tweet` CTA: `PROBABLE`;
- exact historical list-level linked-status alternative: `HOLD`;
- whole-row route to Mention Tweet Detail: conservative `RECONSTRUCTED` interaction preserving existing semantics;
- Mentions swipe actions: `HOLD` and unrendered.

No authenticated Twitter 3.0.2 application bundle or Mentions-specific raster was recovered.

## Implemented row anatomy

Mentions now use Mentions-specific declarations rather than changing the frozen Timeline B1 rules or the shared Messages presentation:

- content-driven row with a 58px minimum;
- 5px padding;
- existing 48×48 framed initials avatar at x=5/y=5;
- 7px avatar/copy gap, placing copy at x=60;
- 5px right inset;
- display name at 14px/17px bold;
- Tweet body at 14px/18px with 2px separation;
- timestamp at 11px/17px in the upper-right;
- full-width one-pixel `#c5c5c5` separator.

Alex and Chris initials remain project placeholder content, not authenticated Twitter artwork. No character photography was generated or substituted.

## Unread and linked-status presentation

Alex retains the canonical initial unread state and Chris retains the canonical initial read state. An unread Mention receives the existing period-style pale-blue `#edf4fa` row treatment while retaining the B3 Tweet-list geometry. Opening Alex marks it read and returns its row to white; Chris begins and remains white. The existing Mentions tab-level blue indicator remains visible while unread Mention state exists. No replacement marker, bold treatment, or additional badge is added.

The unsupported list-level `View Tweet` copy is removed without replacement. The entire Mention row still opens Mention Tweet Detail. Alex's existing Detail-level `View linked Tweet` control and Conan route remain unchanged and explicitly `HOLD` for a future Tweet Detail pass.

## Preserved behavior

- Alex and Chris identities, wording, order, linked IDs, and read-state semantics are unchanged.
- Opening Alex marks only Alex read.
- Mention row → Detail → linked Conan Tweet → Reply → Cancel → Detail → Back → Mentions remains origin-aware.
- Timeline/mentions/search switching, scroll restoration, suspend/resume, and reset retain existing state behavior.
- Timeline B1/B2 geometry, action pane, Favorite marker, assets, and interactions are unchanged.
- Messages retains its existing row-level unread class and presentation unchanged; the Mentions-specific unread selector only resolves precedence against the B3 white row base.
- No swipe action pane or Favorite/Retweet visuals were added to Mentions.

## Sources

- Twitter, `Twitter for iPhone`, May 19, 2010.
- Netaful, `Twitter for iPhone`, May 20, 2010, including the directly identified Mentions capture.
- 148Apps, `Tweetie 2 / Twitter Review`, 2009, tab order and electric-blue dock-like unread indicator.
- DigitalOutbox, `Tweetie 2`, October 18, 2009, tab-level Mentions/DM unread indicator.
- Project evidence: Checkpoint A shell/navigation, Checkpoint B1 Timeline rows, Checkpoint B2 swipe action pane.
