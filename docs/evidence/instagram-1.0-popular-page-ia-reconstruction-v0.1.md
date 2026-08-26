# Instagram 1.0 Popular Page IA Reconstruction v0.1

## Scope and evidence

This reconstruction targets the Instagram 1.0-era Popular page on an iPhone 4 at a 320 by 480 logical viewport on October 20, 2010. The supplied period screenshot is classified `PERIOD-EVIDENCE` for information architecture and B-level geometry.

## Screenshot anatomy

The evidenced structure is a blue Instagram navigation bar titled `Popular`, a right-side Refresh control, a dense discovery-photo grid, and a persistent bottom tab bar. Popular is a root destination and has no Back control.

## Popular grid

Popular uses four fixed columns with one-point separators, square cells and vertical scrolling. Each unchanged source image fills its square with centered `object-fit: cover`; no placeholder surface remains. It does not use feed cards, captions, username labels, variable masonry geometry, search, categories or modern Explore elements. Exact per-image crop art direction remains HOLD.

The v0.7.1 registry contains twenty deterministic `EPHEMERAL_INSTAGRAM_USER` records bound to the unchanged local images in `src/assets/instagram/popular`. It contains no historical celebrity claim and does not insert June or any canonical character. Hidden and non-image filesystem artifacts are not registered.

`src/data/instagramPopularContent.ts` is the centralized media source of truth. It imports every intended JPG and PNG explicitly and defines the canonical session order without filesystem enumeration or runtime randomization. Grid thumbnails and Photo Detail resolve the same record and therefore share one media reference.

## Header and Refresh

The header remains in the existing blue Instagram navigation family. Refresh recomputes the same deterministic session dataset and never fetches modern network content or randomizes on render. Exact refresh artwork, gradient, gloss and shadow are `HOLD - HISTORICAL ASSET`.

## Photo Detail

Each thumbnail opens one period-structured Photo Detail with a small neutral avatar, ephemeral username, relative timestamp, square media surface and conservative Like/Comment text. Back returns to Popular with the same order and prior grid scroll position. Modern menus, bookmarks, carousels and share sheets are absent.

## Bottom tabs

The root semantics are:

1. Feed
2. Popular
3. Share
4. News
5. Current account identity

Share launches the existing photo workflow and is structurally raised. The rightmost label is derived from the session identity through a conservative normalized account label; exact handle policy remains HOLD.

## Popular and Profile boundary

`Popular GRID = READY / PERIOD-EVIDENCE`.

`Profile GRID = REJECTED FOR TARGET DATE`.

June and current-user profiles retain their vertical chronological streams. The Popular grid is not reused by Profile, and June discovery remains through Following or Facebook-friend discovery.

## HOLD

- Original Instagram 1.0 tab and Refresh rasters
- Exact per-image crop art direction beyond centered cover
- Exact Popular ranking
- Exact Photo Detail Like/Comment chrome
- Exact current-account visible-handle policy
- Pixel-level geometry and material fidelity

Manual browser confirmation remains pending and must not be reported as PASS without visual inspection.

## Closeout status

FUNCTIONALLY COMPLETE

MANUAL VISUAL CONFIRMATION PENDING

Instagram implementation is paused after this local-media closeout. Likes, comments, additional discovery behavior, exact unaudited Photo Detail chrome, and further Instagram expansion remain HOLD.
