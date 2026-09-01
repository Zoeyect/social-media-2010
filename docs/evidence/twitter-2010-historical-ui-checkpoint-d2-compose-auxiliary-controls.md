# Twitter Historical UI Checkpoint D2 — Compose auxiliary controls

Status: implemented from the supplied native-period 320×480 Compose capture.

## Evidence classification

- attachments capsule identity: CONFIRMED
- paperclip and filled disclosure artwork: RECONSTRUCTED_FROM_PERIOD_SCREENSHOT
- capsule geometry and blue-gray material: RECONSTRUCTED_FROM_PERIOD_SCREENSHOT
- attachment count and disclosure semantics: HOLD
- character counter identity and remaining-count behavior: CONFIRMED
- counter frame, material, typography, and triangular detail: RECONSTRUCTED_FROM_PERIOD_SCREENSHOT
- counter-detail interaction semantics: HOLD; rendered decorative only

The SVG marks are screenshot reconstructions, not authenticated Twitter
application-bundle artwork.

## Runtime contract

The 34-point auxiliary strip retains a 148×26-point left capsule at a 10-point
inset and a 52×26-point counter at a 6-point right inset. The attachment label
is the truthful count-neutral `attachments`; no `(0)`, `(3)`, or placeholder
count is fabricated. The capsule is non-focusable, has no event handler, and is
hidden from accessibility APIs because the project has no supported attachment
action.

The counter remains accessible and displays the existing `140 - value.length`
value. The textarea `maxLength`, reducer slicing, Send eligibility, Close,
Reply, keyboard integration, D1 navigation/field geometry, and D3 tool panel
are unchanged.
