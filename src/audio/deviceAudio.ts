import { DEVICE_AUDIO_REGISTRY, DeviceAudioEvent } from "./deviceAudioRegistry";

export type NotificationType = "message";

class DeviceAudioService {
  private activeAudio: HTMLAudioElement | null = null;
  private muted = false;
  private volume = 1;

  dispatch(event: DeviceAudioEvent): void {
    const sound = DEVICE_AUDIO_REGISTRY[event];
    if (sound.assetStatus !== "READY" || typeof Audio === "undefined") return;

    this.activeAudio?.pause();
    const audio = new Audio(sound.assetUrl);
    audio.preload = "auto";
    audio.muted = this.muted;
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

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.activeAudio) this.activeAudio.muted = muted;
  }

  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
    if (this.activeAudio) this.activeAudio.volume = this.volume;
  }
}

export const DeviceAudio = new DeviceAudioService();
