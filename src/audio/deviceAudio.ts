import { DEVICE_AUDIO_REGISTRY, DeviceAudioEvent } from "./deviceAudioRegistry";

export type NotificationType = "message";

class DeviceAudioService {
  private activeAudio: HTMLAudioElement | null = null;
  private hardwareMuteMode: (() => "ringer" | "silent") | null = null;
  private lastSuppressedSound: DeviceAudioEvent | null = null;
  private volume = 1;

  dispatch(event: DeviceAudioEvent): void {
    if (!this.canPlayAudio) {
      this.lastSuppressedSound = event;
      return; // Muted one-shots are discarded, never queued for replay.
    }
    const sound = DEVICE_AUDIO_REGISTRY[event];
    if (sound.assetStatus !== "READY" || typeof Audio === "undefined") return;

    this.activeAudio?.pause();
    const audio = new Audio(sound.assetUrl);
    audio.preload = "auto";
    audio.muted = false;
    audio.volume = this.volume;
    this.activeAudio = audio;
    audio.addEventListener("ended", () => {
      if (this.activeAudio === audio) this.activeAudio = null;
    }, { once: true });
    void audio.play().catch(() => {
      if (this.activeAudio === audio) this.activeAudio = null;
    });
  }

  lock(): void { this.dispatch("lock"); }
  unlock(): void { this.dispatch("unlock"); }
  keyboardTap(): void { this.dispatch("keyboardTap"); }
  notificationReceived(type: NotificationType): void {
    if (type === "message") this.dispatch("messageReceived");
  }
  messageSent(): void { this.dispatch("messageSent"); }
  lowBatteryWarning(): void { this.dispatch("lowBattery"); }
  cameraShutter(): void { this.dispatch("cameraShutter"); }

  get canPlayAudio(): boolean {
    return (this.hardwareMuteMode?.() ?? "ringer") === "ringer";
  }

  // Read the existing physical state; no app-local copy of the mute boolean.
  bindHardwareMuteMode(readMode: () => "ringer" | "silent"): () => void {
    this.hardwareMuteMode = readMode;
    this.hardwareMuteChanged();
    return () => {
      if (this.hardwareMuteMode === readMode) this.hardwareMuteMode = null;
    };
  }

  hardwareMuteChanged(): void {
    if (!this.canPlayAudio && this.activeAudio) {
      this.activeAudio.muted = true;
      this.activeAudio.pause();
      this.activeAudio = null;
    }
  }

  get diagnostics() {
    return { muteMode: this.hardwareMuteMode?.() ?? "ringer", audioGateOpen: this.canPlayAudio, lastSuppressedSound: this.lastSuppressedSound };
  }

  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
    if (this.activeAudio) this.activeAudio.volume = this.volume;
  }
}

export const DeviceAudio = new DeviceAudioService();
