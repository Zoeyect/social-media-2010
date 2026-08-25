# Flickr Playability Functional Sweep v0.2

## Scope

This sweep covers Flickr-local comments, minimal Sets navigation, and source-aware Photo Detail return behavior. Existing Photostream, Favorite, App Runtime retention, and session reset boundaries remain in place.

## Comments model

Comments are normalized into session-local records:

```ts
{
  id,
  photoId,
  author,
  text,
  origin: "seed" | "user"
}
```

- The existing `Nice shot` seed string is cloned with `origin: "seed"`.
- Its source does not provide an author, so the normalized record stores `author: null` rather than fabricating an identity.
- A submitted comment stores `sessionIdentity.name` and `origin: "user"`.
- User submission does not modify the frozen seed definition.
- Comments are plain text with no threading, reactions, mentions, or rich composer.

## Sets model

Two CURATED local Sets are intentionally small:

| Set | Photo IDs |
| --- | --- |
| Late Night | `sunset-brooklyn`, `platform` |
| Everyday | `coffee-table` |

Sets contain IDs only. Photo detail resolves the shared photo object from `state.photos`; no photo object or seed record is copied into Set membership.

## Navigation origin

Photo Detail stores one local origin:

```ts
{ view: "photostream" }
// or
{ view: "set", setId }
```

- Photostream → Photo → Back restores Photostream and its recorded scroll position.
- Sets → Set → Photo → Back restores the originating Set.
- Comments → Photo retains the original Photo navigation origin, so the subsequent Back still returns to the correct source.

## Functional results

| Check | Result | Evidence |
| --- | --- | --- |
| Existing Photostream | PASS | The same seed photo array is cloned per session and rendered through the existing row path. |
| Photo Detail | PASS | Both Photostream and Set photo IDs resolve the shared detail view. |
| Favorite / Unfavorite | PASS | Existing toggle remains Flickr-local; invalid photo IDs are rejected. |
| Open Comments | PASS | A selected photo opens a filtered list of its seed/user comments. |
| Post plain-text comment | PASS | Reducer trims non-empty text, attributes the shared session identity, and clears the draft. |
| Seed provenance | PASS | Seed comment remains `origin: "seed"`; source array remains unchanged. |
| Sets list and Set | PASS | Two Sets open and reference only existing photo IDs. |
| Correct Back origin | PASS | Reducer tests cover Photostream scroll restoration and Set return routing. |
| Interaction independence | PASS | Commenting preserves Favorite and Set membership; Set navigation preserves comment/Favorite state. |
| Suspension/resume | PASS (architecture/code-level) | New fields remain in the existing mounted Flickr reducer; no lifecycle transition resets them. Browser interaction was not performed. |
| Session reset | PASS | Reset removes Zoey user comments/Favorites/navigation/scroll and restores the seed comment baseline for Alex. |
| Cross-app isolation | PASS (diff inspection) | Changes are confined to Flickr state/container/styles, validation assertions, planning, and this document. |

## Findings

### A — Architecture / Blocker

None found.

### B — Functional

None found by reducer tests, build validation, and diff inspection.

### C — Polish / Historical fidelity

- Exact 2010 Flickr Sets and Comments chrome.
- Exact tab/navigation typography, gradients, spacing, and button treatment.
- Period-authentic photo fixtures and seed commenter identity.

These remain backlog items and were not polished.

## HOLD boundaries

- Upload and Camera Roll.
- Direct camera capture and Camera Runtime integration.
- EXIF, geotag/maps, Groups, share sheets, and richer organization tools.
- Exact historical icon, photos, animations, and pixel geometry.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- Global scheduler and Cross-App Timeline: unchanged
- Twitter/Facebook/Foursquare: unchanged
- Camera Runtime: unchanged
- Historical assets: none added or modified

## Checkpoint recommendation

Flickr v0.2 is ready for a **code-level functional checkpoint**. Manual browser interaction remains NOT TESTED. The umbrella App Playability Expansion remains in progress.
