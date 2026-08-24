# iOS 4.1 Device Audio Runtime v0.1

## Scope

Target: iPhone 4 (`iPhone3,1`), iOS 4.1 build `8B117`, U.S./Pacific narrative runtime on 20 October 2010.

This implementation adds a device-owned semantic audio registry and centralized playback service. It connects only verified device Lock and Unlock events. It adds no Messages, social-application, or Camera behavior.

## Architecture

```text
Device/application interaction
  → semantic DeviceAudio event
  → DEVICE_AUDIO_REGISTRY resolver
  → centralized DeviceAudioService
  → byte-identical historical UISound CAF
```

Applications must request semantic operations such as `notificationReceived("message")` or `keyboardTap()`. They do not import CAF paths or select historical filenames.

The playback service owns the current `HTMLAudioElement`, restarts the single device sound channel for a new event, and contains the future mute/volume boundary. It does not add equalization, spatial effects, ambience, background music, or synthetic mixing.

## Asset promotion and provenance

The seven runtime files were extracted directly from:

```text
tmp/firmware/rootfs/018-7063-114-decrypted.hfs
/System/Library/Audio/UISounds
```

They are stored under `src/assets/historical/ios4.1/audio/uisounds/` without conversion or byte changes.

| Semantic event | Historical file | SHA-256 | Asset | Trigger |
| --- | --- | --- | --- | --- |
| `lock` | `lock.caf` | `508b2a39e04c9ba9d5eff180a647b38644bf19291de0b8175f33e06837ebfd39` | **READY** | **READY**, connected |
| `unlock` | `unlock.caf` | `607e75f4c382fa1649e629f36a6991a8d9a8f5114207d31cb9314164501b097c` | **READY** | **READY**, connected |
| `keyboardTap` | `Tock.caf` | `419233e9df586abf8df254028ff3f80e50659ffe3ca5b955fb0103680fd550ca` | **READY** | **READY**, not yet connected |
| `messageReceived` | `sms-received1.caf` | `e62c99f80a82467f86e8829c34e2b8e06bcaeb3b56f90210dfbe01a6cc354e8d` | **READY** | **READY**, not yet connected |
| `messageSent` | `SentMessage.caf` | `749cb3afc95c624975a8546564f33b6b330a11f661c055ae61c23d99c4d76ecc` | **READY** | **READY**, not yet connected |
| `lowBattery` | `low_power.caf` | `4c3d8f6ac2c59ee7ec15a88f972fd796bdc17d60ea2afb0345236c2efb31dc72` | **READY** | **HOLD**, not connected |
| `cameraShutter` | `photoShutter.caf` | `69bd4cf8b91295dfe1286c72119610ff5c409c2e765292aeb86ab8f07bac1be1` | **READY** | **READY role**, not connected |

The registry records asset status and trigger status separately. An authentic asset does not by itself authorize an unresolved runtime trigger.

## Device integration

### Lock

`DeviceAudio.lock()` is dispatched when an existing device transition actually enters `sleeping`:

- short Power-button lock;
- existing idle auto-lock.

Wake from sleeping to the Lock Screen does not replay the lock sound. Boot and shutdown remain silent.

### Unlock

`DeviceAudio.unlock()` is dispatched after the existing Lock Screen unlock gesture completes. The existing destination decision—resume retained application or return to SpringBoard—is unchanged.

### Unconnected semantic APIs

The runtime exposes `keyboardTap`, `notificationReceived("message")`, `messageSent`, `lowBatteryWarning`, and `cameraShutter`, but no current application or battery event calls them. This preserves the boundary for later implementation without fabricating application behavior.

## System and application boundary

```text
Device Audio Layer
├── Lock / Unlock
├── Keyboard
├── Notifications
├── Battery warning
└── verified system events

Future application adapters
├── Messages semantic events
├── Twitter semantic events
├── Camera semantic events
└── other provenance-complete apps
```

Future adapters may emit semantic events only. Filename selection remains owned by the device registry.

## READY

- Seven CAF assets are byte-identical verified 8B117 extracts.
- Semantic registry and centralized playback boundary.
- Historical Lock and Unlock event mappings.
- Lock integration for Power lock and existing idle lock.
- Unlock integration after the existing gesture completes.
- Future keyboard, SMS, sent-message, low-power, and shutter semantic interfaces.

## HOLD

- Charging sound: no verified 8B117 asset was identified.
- Exact low-battery percentage, repetition, and suppression policy.
- Ring/Silent switch behavior and event-specific muting.
- User volume persistence and the exact historical volume category.
- Audio-session interruption, route, headphones, and background-audio rules.
- Browser autoplay restrictions for timer-originated auto-lock audio.
- Browser/platform CAF decode support; source files must not be transcoded to conceal incompatibility.
- Special-key `Tink.caf` behavior and `sq_` output-path selection.
- Foreground Messages distinction between notification and in-app received-message sounds.

## Preservation boundary

No application UI, app-specific sound logic, modern audio behavior, generated sound, visual asset change, battery calculation change, or runtime-lifecycle redesign is included. Existing PNG and pre-existing audio source bytes are untouched.
