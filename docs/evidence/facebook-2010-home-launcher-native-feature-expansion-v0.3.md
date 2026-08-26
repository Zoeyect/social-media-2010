# Facebook 2010 Home Launcher & Native Feature Expansion v0.3

## Evidence and target

The structural reference is the supplied period Facebook for iPhone launcher imagery, interpreted for October 20, 2010 on iPhone 4, iOS 4.1, Facebook 3.2-era, U.S. runtime and a 320 x 480 pt viewport. The screenshots lock the Account/facebook/+ header, Search field, three-column launcher family, page dots and bottom Notifications bar. Exact raster assets and pixel geometry remain HOLD.

## Home launcher anatomy

Facebook now opens to a native-style launcher rather than a text menu:

```text
Account | facebook | +
Search
News Feed | Profile | Friends
Messages  | Places  | [EMPTY]
Events    | Photos  | Chat
page dots
Notifications
```

`+` is a disabled shortcut/customization control, not Create Post. Account opens a sparse shell linked to the session owner's existing Profile. The second launcher page is intentionally empty and does not fabricate shortcuts or people.

## Search

Home Search performs deterministic display-name lookup across the nine canonical Facebook identities plus the Facebook-local Z.tokyo easter egg. Anil is excluded because he is an offline non-SNS character. The search is plain people lookup, not a modern suggestions or global-search system.

## News Feed and composer

News Feed uses a Home launcher control, centered Facebook title and right-side Live Feed label. The structural composer strip is Photo, Status and Check In.

- Status accepts only explicit user text, stores `origin: "user"`, uses the current simulated device time and appears in the Feed/current-user Wall through the shared Feed collection.
- Photo remains disabled/HOLD because no audited Facebook upload picker is ready.
- Check In routes to Facebook Places.
- No owner status is pre-seeded.

## Friends and Requests

Friends provides Search Friends, an alphabetical baseline list, a structural alphabet index and Friends/Pages/Requests segments. Pages is a sparse HOLD surface and Sync is structural/HOLD; no Contacts mutation occurs.

Requests is no longer a Home destination. Jack's pending request is reachable through Friends -> Requests and Notifications. Accept appends Jack once to the eight-person baseline Facebook friend list; Ignore does not. Delivery timing and eligibility semantics are unchanged.

## Messages

The launcher label is Messages while the existing Facebook-internal Inbox/thread model remains shared. Katie/Jay seed threads, June's live `Hey, are you online?` thread and the existing party invitation message remain intact. This surface is not standalone SMS and is not modern Messenger.

## Events

Events exposes the existing shared party invite only after delivery. It does not create a second invite or alter June/Jack eligibility and deduplication.

The event is `Jack's Party`, hosted by Jack, with Friday timing and location HOLD. RSVP state begins `null` and changes only through explicit Yes/Maybe/No user action. The minimal Event Wall links to the existing Alex Feed record instead of cloning its copy or comments.

## Places

Places is a Facebook-specific minimal surface with CURATED friend check-ins for Ben, Chris and Luca plus three CURATED/HOLD venue choices. The owner begins with no location. A user check-in exists only after an explicit Check In action and resets with the session. No Foursquare UI or state is reused.

## Photos

Photos exposes a minimal Albums -> Photo Viewer path using the centralized Facebook media registry. v0.3 contains only Z.tokyo's approved portrait in Profile Pictures; the same `z-tokyo-profile-picture` media ID drives Feed activity, Profile, Photos and the album entry. No physical file is copied, generated or altered.

Z.tokyo remains `AUTHOR_EASTER_EGG`, carries no author label and remains outside the canonical nine. Other character albums stay HOLD until their shared media is registered and surface suitability is approved.

## Chat

Chat is separate from Messages and shows a small CURATED roster: Katie and Chris online, Jay offline. It creates no owner status, direct messages, automatic replies or Messenger semantics. Exact presence evidence, roster behavior and conversation chrome remain HOLD.

## Notifications

The persistent bottom Notifications bar routes to a Facebook-internal list. Entries derive only from existing state:

- Jack request
- June live message
- delivered party event invitation

Unread state derives from the request, thread/invite and read-ID state. Opening an entry routes to Friends/Requests, June's message or Jack's Event and marks only that relevant record read. No random filler notification is generated.

## Groups target-date decision

Classification: `REJECTED FOR TARGET DATE`.

Facebook for iPhone gained Groups support on November 3, 2010, after the October 20 simulation date. The supplied 3 x 3 screenshot containing Groups is therefore a later-version visual reference. v0.3 preserves row 2 as Messages, Places, EMPTY and does not render a Groups tile, label, route or interaction. The slot remains empty intentionally rather than being filled for visual symmetry.

## Asset HOLD list

- Exact nine launcher raster icons
- Account, Home-grid, Search and `+` artwork
- Header, page-dot and Notifications textures
- Photo upload picker artwork
- Friends alphabet-index geometry and Sync chrome
- Event RSVP control arrangement
- Places nearby/location chrome
- Chat presence and conversation chrome

Neutral lettered structural placeholders are used instead of question marks. They are `DEV/HOLD`, not final historical assets.

## User-projection safeguards

No user status, RSVP, location, photo history, interests, online presence or party preference is seeded. Status, RSVP and Check In become session facts only after direct user action. Account/Profile shells remain sparse and contain no fabricated biography.

## Existing narrative migration

June's message, both party eligibility paths, stable invite ID, Alex/Jay discussion, Matt's Twitter reaction, June's Instagram bridge, Chris/Luca relationship and Z.tokyo cameo remain unchanged. The party gained an Events projection and notification route, not a new state machine.

## Remaining C-level fidelity backlog

Exact icons, gradients, gloss, typography, antialiasing, one-pixel separators, row metrics and 320 pt geometry remain for a Historical Visual Fidelity Pass. Exact Search behavior, photo upload, other-user photo libraries, complete Chat and exact Instagram-related discovery remain separate HOLD items. Groups is rejected rather than held for this target date.
