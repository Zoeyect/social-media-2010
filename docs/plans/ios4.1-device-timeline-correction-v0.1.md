# iOS 4.1 Device Timeline Correction v0.1

## Corrected narrative target

| Property | Target |
| --- | --- |
| Device | Black GSM iPhone 4 (`iPhone3,1`) |
| System | iOS 4.1 build `8B117` |
| Region | United States |
| Locale | `en-US` |
| Time zone | `America/Los_Angeles` |
| Carrier | AT&T |
| Session start | Wednesday, October 20, 2010 at 12:02 AM PDT |
| Session end | Wednesday, October 20, 2010 at 12:17 AM PDT |
| Duration | 15 minutes, unchanged |
| Planned clock text | `12:02` through `12:17`; no 24-hour display |
| Planned Lock Screen date | `Wednesday, October 20` |

Canonical future runtime instant:

`2010-10-20T00:02:00-07:00`

Firmware provenance remains separate from simulated runtime configuration. The 8B117 firmware source is not Japanese or U.S. narrative state by itself; locale, carrier bundle selection, time zone, and user preferences determine that state.

## Design rationale

The reconstructed device represents a U.S. iPhone 4 user in the early morning hours of October 20, 2010. Its 15-minute session concludes well before Apple’s Back to the Mac event later that morning.

That relationship is internal historical framing only. The experience must not explain it directly, label it as an event countdown, or turn it into overt interface copy. It should remain available as an implicit discovery.

## Preserved systems

- The 15-minute elapsed-time model is unchanged.
- The battery curve and warning lifecycle are unchanged.
- Sleep timing and Power/Home lifecycle are unchanged.
- SpringBoard, Folder behavior, Status Bar assets, and application content are unchanged.

## Future implementation boundary

A later runtime-configuration task may update the clock source, formatters, carrier state, and associated documentation. This correction does not authorize application-code or asset changes.
