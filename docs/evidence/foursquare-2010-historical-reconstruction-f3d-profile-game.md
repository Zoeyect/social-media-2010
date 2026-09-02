# Foursquare 2010 F3d — Minimal Profile Game Integration Closure

## Decision

F3d is an evidence and validation closure only. The approved Profile root remains the existing identity block followed by one `Leaderboard` disclosure row. No visible Profile implementation, reducer change, routing change, or game-model change is warranted.

This preservation decision is deliberate: the current minimal Profile is more historically defensible than displaying unsupported game statistics.

## Evidence boundary

The self Profile destination is `CONFIRMED`. Contemporary March 2010 iPhone coverage documents its introduction, and September 2010 Foursquare 2.0 coverage documents redesigned Profile pages.

Foursquare's points and leaderboard system is `CONFIRMED / PERIOD-SUPPORTED`. Profile ownership of the current standalone Leaderboard route remains `PROBABLE / PERIOD-SUPPORTED`; the exact target-build entry placement and geometry remain reconstructed.

Contemporary sources used for this closure:

- The Next Web, 6 March 2010, *The Foursquare iPhone App Redesign: A Side by Side Comparison* — self Profile introduction.
- TechCrunch, 5 March 2010, *Meet The New Foursquare. Same As The Old Foursquare — But Prettier* — close-period Profile mayorship/badge presentation and the point system's less-prominent placement.
- MacMagazine, 20 September 2010, *foursquare chega à versão 2.0* — Foursquare 2.0 Profile redesign.
- iPhon.fr, 14 October 2010, *Be the Mayor... + mise à jour de Foursquare (2.0)* — close target-date corroboration of the redesigned Profile interface.

None of the reviewed evidence authenticates a current weekly score, current rank, or their exact wording on the Foursquare 2.0 Profile root.

## Approved Profile surface

The Profile root remains:

```text
[avatar] Player Name
Leaderboard                         ›
```

The identity block, player avatar and display name, existing 44-pixel Leaderboard row and disclosure, Profile-to-Leaderboard route, bottom-tab behavior, materials, geometry, and root scroll behavior remain unchanged.

Before a successful check-in, Profile shows no game number and no placeholder or `Unranked` state. After the first, second, and third successful check-ins, Profile remains structurally identical. Current live values remain available only through the standalone Leaderboard: respectively `1 / #6`, `2 / #6`, and `3 / #5` for the player under the frozen F3a model.

## HOLD

- Points or score on the Foursquare 2.0 Profile root
- weekly wording such as `Weekly`, `Weekly Points`, or `This Week`
- rank or `Unranked` on Profile
- Profile stats-block anatomy
- badges and badge gallery in the target Profile reconstruction
- mayorship counts and lists
- historical or total check-in counts
- friends, recent activity, and history

Session check-ins must not be presented as historical Profile totals. Badges and mayorships remain F4/F6 scope.

## Preserved game boundaries

F3d does not alter F3a scoring, weekly seed, tie order, player inclusion, or pure ranking helpers. It does not alter the frozen F3b standalone Leaderboard or the frozen F3c per-venue result UI. Duplicate check-ins remain strict no-ops, and RESET continues to remove the player from the Leaderboard and return Foursquare to Friends root without changing the Profile structure.
