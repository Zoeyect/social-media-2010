import { StatusBarState } from "./statusBarModel";

export type LockScreenModel = {
  clock: string;
  date: string;
  signalStrength: StatusBarState["signalStrength"];
  network: StatusBarState["network"];
  carrier: string;
  carrierArtworkSrc: string | null;
  batteryPercentage: number;
  batteryStatus: StatusBarState["batteryStatus"];
};

export function createLockScreenModel(clock: string, date: string, status: StatusBarState): LockScreenModel {
  return {
    clock,
    date,
    signalStrength: status.signalStrength,
    network: status.network,
    carrier: status.carrier,
    carrierArtworkSrc: status.carrierArtworkSrc,
    batteryPercentage: status.batteryPercentage,
    batteryStatus: status.batteryStatus,
  };
}
