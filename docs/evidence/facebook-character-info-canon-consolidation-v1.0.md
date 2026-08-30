# Facebook Character Info Canon Consolidation v1.0

## Checkpoint

**FACEBOOK CHARACTER INFO PASS = COMPLETE**

**FACEBOOK CURRENT DEVELOPMENT PHASE = TEMPORARILY CLOSED**

This checkpoint closes the current Facebook development phase; it does not classify every historical HOLD as resolved.

## Canonical result

- Stable actor IDs remain `katie`, `matt`, `alex`, `chris`, `jay`, `june`, `jack`, `ben`, and `luca`.
- Canonical display names are Katie Dawson, Matt Ricci, Alex Wong, Chris Morgan, Jay Diaz, June Park, Jack Keller, Ben Dawson, and Luca Bennett.
- Sophie Miller remains the Facebook-local recurring-secondary actor `facebook-ephemeral-sophie`.
- Matt's formal canonical name remains Matteo Lee Ricci while his ordinary Facebook display remains Matt Ricci.
- Ben and Katie share the canonical Dawson surname and retain the existing sibling relationship.
- Facebook Info remains intentionally incomplete and uneven. It is evidence about a character, not a complete explanation.
- June and Jack expose no Relationship Status. The June/Jack and Sophie/Jack ambiguities remain unresolved.
- The simulated user's own Profile remains under-specified.

## Implementation boundary

The central character registry supplies canonical names. Facebook Info values live in the centralized profile-info registry, including Sophie’s Facebook-local entry. Canonical album ownership, Friends, Search, Places, Chat, comments, mentions, and actor routes resolve stable IDs to those names. Existing textual mention tokens such as `@Jack`, post copy, and notification sentences remain unchanged.

No profile geometry, tabs, Wall/Photos architecture, story order, Like/comment count, media ownership, tag, timestamp, scheduler event, route ID, username, handle, post, photo, or relationship was added or changed. Twitter mention eligibility was made ID-based (`alex`) because the previous display-string comparison was not identity-safe.

## Out-of-scope Facebook HOLD items

- exact Facebook 3.2.2 Home icon payload recovery and remaining icon provenance follow-up
- exact Account / Logout / `+` target-build verification
- fake/shared historical map renderer
- unresolved exact Profile tab chrome
- other HOLD items already recorded in Facebook evidence documents

The adjacent Facebook 3.2.1 Home assets already recovered by the project remain adopted according to their existing provenance classifications; this pass did not alter them.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- manual browser: BLOCKED — no in-app/default browser was available after the required browser connection and bootstrap check
