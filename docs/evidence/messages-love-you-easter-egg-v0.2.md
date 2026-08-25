# Messages Love-You Easter Egg v0.2

## Scope

This change adds two deterministic, session-local semantic reply paths to the existing MobileSMS runtime. It does not change the device scheduler architecture, simulation clock, battery terminal boundary, notification ownership model, or Messages visual chrome.

## Intent classification

The controlled love-intent vocabulary is:

- `love u`
- `love you`
- `i love u`
- `i love you`
- `luv u`
- `luv you`

Input is trimmed, lowercased, and stripped of simple terminal punctuation through the existing Messages normalization path. A leading affirmative (`yes`, `yeah`, `yep`, or `yup`) is also accepted, so `yes love you` follows only the love branch. Love classification runs before the existing affirmative and negative classification; it therefore cannot also schedule Mom's `Good. Sleep early.` response.

## Mom path

Sending explicit love in the Mom conversation changes `momLoveReply` from `none` to `pending`. Event `mom-love-reply` is placed into the existing device-event queue with a deterministic identity-keyed delay in the inclusive 20–60 simulated-second range. Delivery produces exactly one incoming message:

> I love you too.

The existing affirmative reply remains unchanged at +30 simulated seconds for affirmative, non-love answers.

## Dad path

Sending explicit love in the Dad conversation before T+890s marks the Dad reply eligible and pending. Stable event `dad-love-terminal-reply` is scheduled at the fixed T+890s boundary and produces exactly one incoming message:

> Sleep early.

Love sent at or after T+890s does not schedule a reply. Dad has no other scripted reply in this version.

## Delivery context

If the corresponding conversation is visibly foregrounded when an event becomes due, the reply is appended silently and marked read. Otherwise it passes through the existing `smsMessageReceived` system boundary, preserving its current sound, unread badge, foreground alert, sleeping-device wake, and actionable Lock Screen routing behavior.

## Exactly-once and reset

Stable scheduler IDs prevent duplicate queued events, while the explicit `none | pending | delivered` state prevents duplicate message insertion. Existing new-session reset paths recreate Messages state and the session device-event queue, so identity, reply state, and queued love events cannot leak into the next Hero session.

## Classification

- Functional semantic matching and scheduling: implementation behavior, READY.
- Mom delay selection: deterministic CURATED range; exact human reply timing is not a historical claim.
- Dad T+890s placement and both reply sentences: CURATED narrative easter eggs.
- Existing system SMS delivery behavior: reused unchanged.

## Validation

Automated seed/runtime checks cover accepted and rejected phrases, love-over-affirmative priority, deterministic delay bounds, Dad cutoff behavior, stable event IDs, exactly-once delivery, and reset-compatible state. The global battery terminal remains T+900s.
