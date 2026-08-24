# Social Media 2010 Folder Population v0.1

## Scope

Target runtime: iPhone 4, iOS 4.1, AT&T, `en-US`, `America/Los_Angeles`, 20 October 2010 at 00:02–00:17.

This integration adds the Folder-content registry and historical state metadata only. A slot is rendered only when its icon is classified **READY**, marked available, and backed by an imported provenance-complete asset. No application experience is implemented.

Classification follows `social-media-2010-app-icons-v0.1.md`:

- **READY** — authentic target-period icon bytes with complete provenance.
- **HOLD** — the application is historically appropriate, but its exact period icon payload is unavailable or insufficiently verified.

## Registry and placement

| Slot | Row / column | Application | Historical state | Icon provenance | Status | Runtime result |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | 1 / 1 | Facebook | Installed | Facebook 3.1.4 is period-correct; original Retina icon payload not recovered | **HOLD** | Empty slot |
| 2 | 1 / 2 | Twitter | Installed | First-party Twitter for iPhone is period-correct; October 2010 icon payload not recovered | **HOLD** | Empty slot |
| 3 | 1 / 3 | Foursquare | Installed | Foursquare 2.0 is period-correct; original icon payload not recovered | **HOLD** | Empty slot |
| 4 | 1 / 4 | Tumblr | Installed | Tumblr 1.2 is period-correct; original icon payload not recovered | **HOLD** | Empty slot |
| 5 | 2 / 1 | Flickr | Installed | Flickr 1.2 is period-correct and lacked Retina support; original 57×57 payload not recovered | **HOLD** | Empty slot |
| 6 | 2 / 2 | Instagram | Installed; 0 photos, 0 followers, 0 following | Instagram 1.0 is period-correct after its 6 October launch; original launch icon payload not recovered | **HOLD** | Empty slot |
| 7 | 2 / 3 | — | — | No application assigned | — | Empty slot |
| 8 | 2 / 4 | — | — | No application assigned | — | Empty slot |
| 9–12 | 3 / 1–4 | — | — | No application assigned | — | Empty slots |

The intended order is retained in data even though all six visual positions remain transparent. No HOLD text, application label, placeholder, or click target is emitted.

## Historical state metadata

The registry records all six applications as installed in the narrative device state. `available` describes whether a verified icon is available for rendering; it does not contradict the narrative installation state.

Instagram is initialized as:

```text
installed: true
photos: 0
followers: 0
following: 0
```

This records the requested early-account state without implementing a feed, profile, “No Photos” view, or any modern Instagram feature.

## READY / HOLD decision

No target third-party icon is READY in the controlling provenance audit. Consequently, this population pass integrates zero icon assets and renders zero Folder application entries. Facebook, Twitter, Foursquare, Tumblr, Flickr, and Instagram remain **HOLD** until original period IPA bundles or provenance-equivalent icon payloads are recovered and hashed.

Modern App Store artwork, later classic-logo variants without bundle proof, screenshots, thumbnails, redrawn logos, CSS artwork, and generated imagery are rejected.

## Preservation boundary

- Folder opening, closing, reducer state, calibrated geometry, animation, raster composition, title layer, and 4×3 grid structure are unchanged.
- SpringBoard pages, navigation, Dock, page indicator, Status Bar, Lock Screen, battery, power, sleep, Home behavior, and device timeline are unchanged.
- No historical PNG was added or modified.
- No third-party click target exists while its icon remains HOLD.

## Remaining work

- Recover provenance-complete target-period bundles and original icon payloads.
- Record version metadata, dimensions, alpha properties, and SHA-256 for each accepted icon.
- Promote individual registry entries to READY only after that evidence is complete.
- Implement application experiences in separate tasks; Instagram's empty account may later present a historically supported empty state.
