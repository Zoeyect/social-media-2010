# iOS 4.1 System Sound Provenance Audit v0.1

## Scope and source

Target: iPhone 4 (`iPhone3,1`), iOS 4.1 build `8B117`, U.S./Pacific narrative runtime on 20 October 2010.

Primary source is the verified root filesystem image `tmp/firmware/rootfs/018-7063-114-decrypted.hfs`. All 66 files in `/System/Library/Audio/UISounds` were read directly from that HFS image into temporary audit storage. Nothing was copied into tracked application assets.

- **READY asset** — exact target-build bytes, container metadata, duration, and hash are established.
- **READY mapping** — target-build configuration or executable references establish the event association.
- **HOLD** — selection, trigger policy, preference state, or mapping is not fully established.

All recovered files use Core Audio Format (`caff`/CAF) with uncompressed 16-bit PCM. Sample rate and channel count vary by file. Durations below are `afinfo` estimates; hashes cover the original bytes extracted from the HFS image.

## 1. Lock and unlock

| Event | File | Duration / format | SHA-256 | Finding |
| --- | --- | --- | --- | --- |
| Lock | `lock.caf` | 0.399093s; stereo 44.1kHz Int16 | `508b2a39e04c9ba9d5eff180a647b38644bf19291de0b8175f33e06837ebfd39` | **READY asset and mapping** |
| Unlock | `unlock.caf` | 0.471655s; stereo 44.1kHz Int16 | `607e75f4c382fa1649e629f36a6991a8d9a8f5114207d31cb9314164501b097c` | **READY asset and mapping** |
| Short hardware/piezo lock variant | `sq_lock.caf` | 0.026939s; mono 44.1kHz BE Int16 | `4ac6ef6402d8fadc94bf6fa4b4de007131295673b0f75e1007ccecb1c3b5f5ee` | **READY asset**; device-path selection **HOLD** |

The exact `Sounds.plist` in `Preferences.app` binds the `com.apple.springboard` key `lock-unlock` to “Lock Sounds” with `default = true`. Lock-sound availability and its default-enabled configuration are therefore **READY**. Runtime interaction with the Ring/Silent switch, output route, and volume remains **HOLD** for integration.

## 2. SMS and Messages sounds

### User-selectable received-message tones

The SpringBoard executable references all six files. `Sounds.plist` exposes Text Messages values with `default = 1`; the value sequence begins with the default tone and maps through the six `sms-received` resources. The recommended untouched-device selection is therefore `sms-received1.caf` (**READY configuration mapping**). Do not assign a marketing tone name until the localized title-to-file mapping is independently resolved.

| File | Duration / format | SHA-256 | Status |
| --- | --- | --- | --- |
| `sms-received1.caf` | 0.780771s; mono 22.05kHz Int16 | `e62c99f80a82467f86e8829c34e2b8e06bcaeb3b56f90210dfbe01a6cc354e8d` | **READY; recommended default** |
| `sms-received2.caf` | 4.530045s; stereo 44.1kHz Int16 | `81ebadb1d107b686471db1ebe83110b7f780082db0b458e49fbf67835a9bb0a6` | **READY alternate** |
| `sms-received3.caf` | 1.633469s; stereo 44.1kHz Int16 | `514813bfea51d19420f4b90d651d05311a0c165f57ea03ce747fd1e168bf3089` | **READY alternate** |
| `sms-received4.caf` | 0.812698s; stereo 44.1kHz Int16 | `f13395d6dc5ec6ca3d10932e3555723fc2acebe56deefb650be59a2ee1e39ba9` | **READY alternate** |
| `sms-received5.caf` | 1.437755s; stereo 44.1kHz Int16 | `12c31d477fb429f294bfc81a48e646e9210f494ecc67b5208161c65fbd876da1` | **READY alternate** |
| `sms-received6.caf` | 1.078345s; mono 44.1kHz Int16 | `6b6c9bd1bddb9fa41fcd13a86580b16d415d88a75b71c1fb918d628f0cc10c0b` | **READY alternate** |

### Messages event sounds

| File | Duration / format | SHA-256 | Finding |
| --- | --- | --- | --- |
| `ReceivedMessage.caf` | 0.491474s; mono 44.1kHz Int16 | `13b3703c17d5681fff7b6727b555b6501ff6055f82e5320cc09f75ec0ca3b5c5` | **READY asset**; exact foreground-vs-notification trigger **HOLD** |
| `SentMessage.caf` | 0.459297s; mono 44.1kHz Int16 | `749cb3afc95c624975a8546564f33b6b330a11f661c055ae61c23d99c4d76ecc` | **READY asset and sent-message role** |
| `SIMToolkitSMS.caf` | 0.491474s; mono 44.1kHz Int16 | `ce191ca9d0edcb672e7e74f083a27f4796ee990c488886aa46c72502fd21f1bf` | **READY SIM Toolkit asset; not ordinary Messages** |

`Messages.plist` also shows `SBExtraSMSAlerts` defaulting to true, proving a default repeat-alert capability. Exact delay/count and whether the narrative incoming message should repeat are **HOLD**.

## 3. Keyboard feedback

| File | Duration / format | SHA-256 | Finding |
| --- | --- | --- | --- |
| `Tock.caf` | 0.025011s; stereo 44.1kHz Int16 | `419233e9df586abf8df254028ff3f80e50659ffe3ca5b955fb0103680fd550ca` | **READY keyboard-click candidate** |
| `Tink.caf` | 0.021678s; stereo 22.05kHz Int16 | `aa10a34a275d59b428afeb4bfbd6894edec0550e602401cf88164fa3bf68de7e` | **READY alternate UI-key candidate; exact trigger HOLD** |
| `sq_tock.caf` | 0.004649s; mono 44.1kHz BE Int16 | `80affc26aeef13a41641a13312dd1b16b2e9e589080578ac4a8eaa4eaa337baa` | **READY hardware/piezo variant; selection HOLD** |

`Sounds.plist` binds “Keyboard Clicks” to `com.apple.preferences.sounds` key `keyboard` with `default = true`. Keyboard feedback being enabled by default is **READY**. `Tock.caf` is referenced by the target SpringBoard executable and is the recommended future software-key click, but exact special-key use of `Tink.caf` and routing between normal/`sq_` variants remain **HOLD**.

## 4. Battery and power

| File | Duration / format | SHA-256 | Finding |
| --- | --- | --- | --- | --- |
| `low_power.caf` | 0.632154s; stereo 44.1kHz Int16 | `4c3d8f6ac2c59ee7ec15a88f972fd796bdc17d60ea2afb0345236c2efb31dc72` | **READY asset and low-power role** |

No separately named charging/connect-power CAF was present in the complete 8B117 `UISounds` directory, and no such filename was found in the inspected target filesystem strings. A charging chime is therefore **HOLD / do not implement**, not permission to borrow a later iOS sound. Boot and shutdown have no verified audio mapping in this audit and should remain silent.

The exact percentage/alert presentation that triggers `low_power.caf`, repeat suppression, silent-mode behavior, and its relationship to the project's special 1% terminal warning remain **HOLD**. Asset presence alone must not alter the verified battery lifecycle.

## 5. Other UI sounds

| Area | Files | Relevance | Classification |
| --- | --- | --- | --- |
| Camera | `photoShutter.caf` | Relevant when Camera behavior is implemented | Asset/role **READY** |
| Screenshot | `photoShutter.caf` is a candidate, but exact iOS 4 screenshot dispatch was not traced | Not currently relevant | **HOLD mapping** |
| Mail | `new-mail.caf`, `mail-sent.caf` | Not part of current narrative scope | Assets/roles **READY** |
| Calendar | `alarm.caf`, `sq_alarm.caf`; Settings points to a missing `/Applications/MobileCal.app/alarm.aiff` path | Not currently relevant | UISounds assets READY; final Calendar selection **HOLD** |
| Voicemail | `Voicemail.caf` | Not currently relevant | Asset/role **READY**; Settings default enabled |
| Recording | `begin_record`, `end_record`, video equivalents | Future Camera/video scope only | Assets/roles **READY** |
| Phone keypad | `dtmf-*`, `ct-*` | Not relevant to current experience | Assets/roles **READY** |
| Voice Control | `vc~*`, `jbl_*` | Not relevant | Asset family READY; detailed triggers HOLD |
| Generic alerts | `alarm`, `beep-beep`, pitch-pattern and `short_*` files | No current trigger | Assets READY; event mappings HOLD |

## Complete recovered inventory

Purpose is assigned by verified filename family: SMS/Messages, telephony (`ct`, `dtmf`, SIM, USSD), Voice Control (`vc~`, `jbl`), Mail, recording/camera, lock/power, keyboard/UI click, or generic alert. A family classification does not promote an exact runtime trigger.

| Filename | Duration | PCM format | SHA-256 |
| --- | ---: | --- | --- |
| `ReceivedMessage.caf` | 0.491474s | 1ch 44.1kHz LE | `13b3703c17d5681fff7b6727b555b6501ff6055f82e5320cc09f75ec0ca3b5c5` |
| `RingerChanged.caf` | 0.168345s | 2ch 22.05kHz LE | `db1adaedfab18996b69dfb2accaed768ad4df5b8f661499f6edb18f659c85e4c` |
| `SIMToolkitCallDropped.caf` | 0.171701s | 2ch 22.05kHz LE | `260d353f3699c921f1dbcfe366baeac7cb5642b23fdde3038cfbd655f646048b` |
| `SIMToolkitGeneralBeep.caf` | 0.380000s | 2ch 22.05kHz LE | `c82dbdd6c72d8fcce2a851b6c6062058b535f37a25d50684fb736d56df4b8402` |
| `SIMToolkitNegativeACK.caf` | 0.164490s | 2ch 22.05kHz LE | `5b6f0c4734d1c4861485a4848a458266cba248b1eca97a96ea3112cb64de9d74` |
| `SIMToolkitPositiveACK.caf` | 0.630000s | 2ch 44.1kHz LE | `45011170dd3b40410b51cb5a7765c8359d03d56a46973db7e2920a7b0c0f1aba` |
| `SIMToolkitSMS.caf` | 0.491474s | 1ch 44.1kHz LE | `ce191ca9d0edcb672e7e74f083a27f4796ee990c488886aa46c72502fd21f1bf` |
| `SentMessage.caf` | 0.459297s | 1ch 44.1kHz LE | `749cb3afc95c624975a8546564f33b6b330a11f661c055ae61c23d99c4d76ecc` |
| `Tink.caf` | 0.021678s | 2ch 22.05kHz LE | `aa10a34a275d59b428afeb4bfbd6894edec0550e602401cf88164fa3bf68de7e` |
| `Tock.caf` | 0.025011s | 2ch 44.1kHz LE | `419233e9df586abf8df254028ff3f80e50659ffe3ca5b955fb0103680fd550ca` |
| `Voicemail.caf` | 0.780771s | 1ch 22.05kHz LE | `e62c99f80a82467f86e8829c34e2b8e06bcaeb3b56f90210dfbe01a6cc354e8d` |
| `alarm.caf` | 1.416100s | 1ch 44.1kHz LE | `df413fde3aa1cb432b07e7d21104a612b91ce845eb03a5d2944744f7a8a9eeef` |
| `beep-beep.caf` | 0.484921s | 1ch 44.1kHz LE | `9321b9b832426db5f2544b72d91fc73fcc15b4b240db87a80c3b6a65b0eba2d4` |
| `begin_record.caf` | 0.522925s | 2ch 44.1kHz LE | `3335ee22b5a4d5311a6d685c329eddbe2363c4a9e5fb45579276ff096c8e2593` |
| `begin_video_record.caf` | 0.522925s | 2ch 44.1kHz LE | `3335ee22b5a4d5311a6d685c329eddbe2363c4a9e5fb45579276ff096c8e2593` |
| `ct-busy.caf` | 1.000000s | 1ch 11.025kHz LE | `c357a8cf7b18c66969b79957408b9fafed5eca174361157b362e4b9d4de6862d` |
| `ct-call-waiting.caf` | 4.000000s | 1ch 11.025kHz LE | `d0f6e8b2d55ca94919addd63c9632e397a05c9bfce155f31e6078ddf45820719` |
| `ct-congestion.caf` | 0.400000s | 1ch 11.025kHz LE | `31e8a1f50657340b864b4532db783d7f9baab4e97cf7c6bb940204db74f98496` |
| `ct-error.caf` | 2.049977s | 1ch 11.025kHz LE | `cf62afdb33f8f692bb9a6e29ba507ffeab1b7f1dd256b318330047c0ef405dde` |
| `ct-keytone2.caf` | 0.200000s | 1ch 11.025kHz BE | `5b21b1127c553d3b639b31d9f99184cfcdd3fa3f359f21b696105294415fb7fb` |
| `ct-path-ack.caf` | 0.200000s | 1ch 11.025kHz LE | `f8880f2b77632d8185fb3c5285457d2384e8a1b79b5bf7bbd76a40485733d4cf` |
| `dtmf-0.caf` | 0.106281s | 1ch 44.1kHz LE | `fca5bcd1c82cbfaf97573bcf4883415b864b1acf28de6b2477a19080d131b5b0` |
| `dtmf-1.caf` | 0.091814s | 1ch 44.1kHz LE | `1a9d0a2abce3b9d03c6e26044756cc628e8af449c9a0961796f9936e229cb8b7` |
| `dtmf-2.caf` | 0.084603s | 1ch 44.1kHz LE | `e25fbaad18b54a976a617f82e3c269013d40cad3bbf008141cf02d275a589e53` |
| `dtmf-3.caf` | 0.119138s | 1ch 44.1kHz LE | `e3ea75f4952cf720e5032ea4f4ee3b0e41d7b8cf7d6144f06cf00383093911bf` |
| `dtmf-4.caf` | 0.120771s | 1ch 44.1kHz LE | `12a7069e48109436de1514050b24cf8f702b3121211d2e2897aa443a1ed0d84d` |
| `dtmf-5.caf` | 0.102562s | 1ch 44.1kHz LE | `d0eaaf3608ca611aaa14a86677459689919f8a4e95b3948da5dd0b5f2be8550a` |
| `dtmf-6.caf` | 0.127279s | 1ch 44.1kHz LE | `4d8bf8e4dc06d1c6f3d618150804e15f279640d3633c4f535fb0afa82d85677e` |
| `dtmf-7.caf` | 0.114989s | 1ch 44.1kHz LE | `44ade49a1db459655002050a3f7e2e44f152d4ce0b35182034704fc3e6ac9ced` |
| `dtmf-8.caf` | 0.111519s | 1ch 44.1kHz LE | `c2502fa678c3123428949f948463425a7c2618bea72fa2ace3976ca9f5bcf029` |
| `dtmf-9.caf` | 0.105624s | 1ch 44.1kHz LE | `132fab202f5dd5c00ce0bd076ae94a0f8f4e2bb52bde6582248ca8e952629f92` |
| `dtmf-pound.caf` | 0.098844s | 1ch 44.1kHz LE | `ccc554434c0a45b47027e0aaa9e5b20680b8b28ca9def53ec00166de2604b26f` |
| `dtmf-star.caf` | 0.138141s | 1ch 44.1kHz LE | `19676ea5a0e56fc6bcdb55a9dc7116ec719739b6f7bdf3f100f98610d47d1d95` |
| `end_record.caf` | 0.579342s | 2ch 44.1kHz LE | `4309e1d1ea8f4af4244009681e9ecdd188938a3f535840e6aaca276a61f6d9b5` |
| `end_video_record.caf` | 0.579342s | 2ch 44.1kHz LE | `4309e1d1ea8f4af4244009681e9ecdd188938a3f535840e6aaca276a61f6d9b5` |
| `jbl_ambiguous.caf` | 0.512188s | 2ch 16kHz LE | `0939c646d84973d8c0bd1890cf5c22e80f0a71ad7f6926dcae8db90213b3052e` |
| `jbl_begin.caf` | 0.242500s | 2ch 16kHz LE | `743d3bba8e8c513c109d4e74388267fec55398e3923527ad4177bc64bf94a08f` |
| `jbl_cancel.caf` | 0.389437s | 2ch 16kHz LE | `11ecededc614ddb3319f2f0df38aac2615cf3f25d3d7dffbd8e494b823ee0d4e` |
| `jbl_confirm.caf` | 0.394500s | 2ch 16kHz LE | `f1f1d2670eaa992687019f31561335233e8683b7e9e0bd070b700950f72b2ab8` |
| `jbl_no_match.caf` | 0.512188s | 2ch 16kHz LE | `97909b47a4f34ccbb51232a0f03d67455cc45c7102a51a0c705025f24deb7b7d` |
| `lock.caf` | 0.399093s | 2ch 44.1kHz LE | `508b2a39e04c9ba9d5eff180a647b38644bf19291de0b8175f33e06837ebfd39` |
| `long_low_short_high.caf` | 0.522472s | 1ch 44.1kHz LE | `ab47d86644e1575a84e51b7ad86e709a08425f737503d98d4593e17ac29cb4a3` |
| `low_power.caf` | 0.632154s | 2ch 44.1kHz LE | `4c3d8f6ac2c59ee7ec15a88f972fd796bdc17d60ea2afb0345236c2efb31dc72` |
| `mail-sent.caf` | 1.096848s | 2ch 44.1kHz LE | `5e09720cb4cf200a13bd0ffe774a60b7a2c91a7f7c2ca9cbf57ab463ef50a589` |
| `middle_9_short_double_low.caf` | 1.036372s | 1ch 44.1kHz LE | `de436c8c318917aba20a6a51a606db59c68aa4f01dc523c425da73e6e8fd8d4b` |
| `new-mail.caf` | 0.766553s | 2ch 44.1kHz LE | `81448ff38b82f7926dc51655bdb7e9a89e9c0180576afa13005dc0868a47d45f` |
| `photoShutter.caf` | 0.501633s | 1ch 44.1kHz LE | `69bd4cf8b91295dfe1286c72119610ff5c409c2e765292aeb86ab8f07bac1be1` |
| `shake.caf` | 0.510023s | 1ch 11.025kHz LE | `b250e59083b059de310cf5eb91df7fd329c41b0c93ea9e152b73d166a0fd8fee` |
| `short_double_high.caf` | 0.236508s | 1ch 44.1kHz LE | `298282f6c5abe7e3d29c448916faea47bea77bfdb6ee0f9c6434c6b463eefa81` |
| `short_double_low.caf` | 0.236644s | 1ch 44.1kHz LE | `c0ab61d6169a435a4f02d56a6585e6e674bbd146fdb3bdb163590dc33db56f41` |
| `short_low_high.caf` | 0.249161s | 1ch 44.1kHz LE | `cf2a139a68d0afea97895233c46fd36e4f95be9c26a22d2497ac104147f3072d` |
| `sms-received1.caf` | 0.780771s | 1ch 22.05kHz LE | `e62c99f80a82467f86e8829c34e2b8e06bcaeb3b56f90210dfbe01a6cc354e8d` |
| `sms-received2.caf` | 4.530045s | 2ch 44.1kHz LE | `81ebadb1d107b686471db1ebe83110b7f780082db0b458e49fbf67835a9bb0a6` |
| `sms-received3.caf` | 1.633469s | 2ch 44.1kHz LE | `514813bfea51d19420f4b90d651d05311a0c165f57ea03ce747fd1e168bf3089` |
| `sms-received4.caf` | 0.812698s | 2ch 44.1kHz LE | `f13395d6dc5ec6ca3d10932e3555723fc2acebe56deefb650be59a2ee1e39ba9` |
| `sms-received5.caf` | 1.437755s | 2ch 44.1kHz LE | `12c31d477fb429f294bfc81a48e646e9210f494ecc67b5208161c65fbd876da1` |
| `sms-received6.caf` | 1.078345s | 1ch 44.1kHz LE | `6b6c9bd1bddb9fa41fcd13a86580b16d415d88a75b71c1fb918d628f0cc10c0b` |
| `sq_alarm.caf` | 1.481293s | 1ch 44.1kHz BE | `befc9dd5733de8e4d39e332baee4c58d99677d526f85ae89c1fc2c9d3f382b37` |
| `sq_beep-beep.caf` | 0.175351s | 1ch 44.1kHz BE | `f584aeb9670c214ee6c0bf851f082d5e93d95b22649b0b1db563cd4b33d24c83` |
| `sq_lock.caf` | 0.026939s | 1ch 44.1kHz BE | `4ac6ef6402d8fadc94bf6fa4b4de007131295673b0f75e1007ccecb1c3b5f5ee` |
| `sq_tock.caf` | 0.004649s | 1ch 44.1kHz BE | `80affc26aeef13a41641a13312dd1b16b2e9e589080578ac4a8eaa4eaa337baa` |
| `unlock.caf` | 0.471655s | 2ch 44.1kHz LE | `607e75f4c382fa1649e629f36a6991a8d9a8f5114207d31cb9314164501b097c` |
| `ussd.caf` | 1.325011s | 2ch 44.1kHz LE | `e6040e18a08ee17933b7a833249c6d332a4593d44b33f406dde0232e914d146f` |
| `vc~ended.caf` | 0.997642s | 1ch 11.025kHz BE | `6482fa18475b091fe5da7dd2a573a2fae9a8b315f71286a65ed0ee3250d67a6c` |
| `vc~invitation-accepted.caf` | 0.998345s | 2ch 44.1kHz LE | `3c4d543b33c75acdaf6fba6af8a15f596cd2dbd0db412344ab3c73f74f7f617a` |
| `vc~ringing.caf` | 1.172086s | 1ch 44.1kHz LE | `939f793fbcf9c42b8317b4f936a5a08bc56eab9d28420b0fd9dfd0333b092fc7` |

## Future audio architecture recommendation

Use one device-owned dispatcher rather than app-local audio elements:

```text
Device Audio System
├── UISounds
│   ├── lock / unlock
│   ├── low power
│   └── camera / generic system events
├── Notifications
│   ├── SMS received tone selection
│   └── mail / calendar when in scope
├── Keyboard
│   └── per-key feedback with preference/ringer policy
└── App event adapters
    ├── Messages sent / foreground received
    └── future app-specific verified events
```

Recommended data boundary:

- immutable asset registry: ID, source path, SHA-256, duration, channels, sample rate, provenance status;
- device audio preferences: lock sound, keyboard clicks, SMS selection, silent/ringer state, alert volume;
- event router: semantic system events mapped to READY asset IDs;
- playback service: concurrency/interruption/routing policy;
- app adapters emit semantic events only and never choose files directly.

Do not begin Audio Runtime integration until the selected CAF files are promoted byte-for-byte into a dedicated historical audio directory and browser playback compatibility is tested without transcoding or modifying the archival source.

## Remaining HOLD items

- Exact silent-switch, alert-volume, headphones, and speaker routing for each event.
- `Tink` special-key mapping and normal versus `sq_` output-path selection.
- Foreground Messages use of `ReceivedMessage.caf` versus notification-tone dispatch.
- Human-readable localized names for all six SMS tones.
- Low-power trigger timing and repeat policy.
- Charging/connect-power sound: no verified 8B117 asset identified.
- Calendar configuration's reference to an absent `MobileCal.app/alarm.aiff`.
- Screenshot shutter mapping and locale/hardware rules for camera shutter muting.

## Validation boundary

This audit adds only this Markdown document. It does not add audio files, audio playback, application code, app experiences, or visual assets.
