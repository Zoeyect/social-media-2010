export type DeviceAudioEvent =
  | "lock"
  | "unlock"
  | "keyboardTap"
  | "messageReceived"
  | "messageSent"
  | "lowBattery"
  | "cameraShutter";

export type ProvenanceStatus = "READY" | "HOLD" | "REJECT";

export type DeviceAudioRegistryEntry = {
  event: DeviceAudioEvent;
  filename: string;
  assetUrl: string;
  assetStatus: ProvenanceStatus;
  triggerStatus: Exclude<ProvenanceStatus, "REJECT">;
  sha256: string;
  notes: string;
};

const uiSoundUrl = (filename: string) => new URL(
  `../assets/historical/ios4.1/audio/uisounds/${filename}`,
  import.meta.url,
).href;

export const DEVICE_AUDIO_REGISTRY: Readonly<Record<DeviceAudioEvent, DeviceAudioRegistryEntry>> = {
  lock: {
    event: "lock",
    filename: "lock.caf",
    assetUrl: uiSoundUrl("lock.caf"),
    assetStatus: "READY",
    triggerStatus: "READY",
    sha256: "508b2a39e04c9ba9d5eff180a647b38644bf19291de0b8175f33e06837ebfd39",
    notes: "Verified 8B117 lock sound; connected to device lock transitions.",
  },
  unlock: {
    event: "unlock",
    filename: "unlock.caf",
    assetUrl: uiSoundUrl("unlock.caf"),
    assetStatus: "READY",
    triggerStatus: "READY",
    sha256: "607e75f4c382fa1649e629f36a6991a8d9a8f5114207d31cb9314164501b097c",
    notes: "Verified 8B117 unlock sound; connected after the unlock gesture completes.",
  },
  keyboardTap: {
    event: "keyboardTap",
    filename: "Tock.caf",
    assetUrl: uiSoundUrl("Tock.caf"),
    assetStatus: "READY",
    triggerStatus: "READY",
    sha256: "419233e9df586abf8df254028ff3f80e50659ffe3ca5b955fb0103680fd550ca",
    notes: "Verified keyboard-click mapping; exposed for future system text input only.",
  },
  messageReceived: {
    event: "messageReceived",
    filename: "sms-received1.caf",
    assetUrl: uiSoundUrl("sms-received1.caf"),
    assetStatus: "READY",
    triggerStatus: "READY",
    sha256: "e62c99f80a82467f86e8829c34e2b8e06bcaeb3b56f90210dfbe01a6cc354e8d",
    notes: "Verified default received-SMS selection; no Messages behavior is connected yet.",
  },
  messageSent: {
    event: "messageSent",
    filename: "SentMessage.caf",
    assetUrl: uiSoundUrl("SentMessage.caf"),
    assetStatus: "READY",
    triggerStatus: "READY",
    sha256: "749cb3afc95c624975a8546564f33b6b330a11f661c055ae61c23d99c4d76ecc",
    notes: "Verified sent-message role; no Messages behavior is connected yet.",
  },
  lowBattery: {
    event: "lowBattery",
    filename: "low_power.caf",
    assetUrl: uiSoundUrl("low_power.caf"),
    assetStatus: "READY",
    triggerStatus: "HOLD",
    sha256: "4c3d8f6ac2c59ee7ec15a88f972fd796bdc17d60ea2afb0345236c2efb31dc72",
    notes: "Verified low-power asset; percentage, repeat, and mute policy remain HOLD.",
  },
  cameraShutter: {
    event: "cameraShutter",
    filename: "photoShutter.caf",
    assetUrl: uiSoundUrl("photoShutter.caf"),
    assetStatus: "READY",
    triggerStatus: "READY",
    sha256: "69bd4cf8b91295dfe1286c72119610ff5c409c2e765292aeb86ab8f07bac1be1",
    notes: "Verified camera-shutter role; no Camera application behavior is connected yet.",
  },
};
