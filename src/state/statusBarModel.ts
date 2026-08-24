export type SignalStrength = 0 | 1 | 2 | 3 | 4 | 5;
export type NetworkType = "none" | "EDGE" | "3G" | "WiFi";
export type BatteryStatus = "normal" | "critical" | "charging";

export type StatusBarState = {
  signalStrength: SignalStrength;
  network: NetworkType;
  bluetoothEnabled: boolean;
  batteryPercentage: number;
  batteryStatus: BatteryStatus;
  carrier: string;
  clock: string;
};

type CreateStatusBarStateOptions = {
  signalStrength: SignalStrength;
  network: NetworkType;
  bluetoothEnabled: boolean;
  batteryPercentage: number;
  charging: boolean;
  carrier: string;
  clock: string;
};

export function createStatusBarState(options: CreateStatusBarStateOptions): StatusBarState {
  const batteryPercentage = Math.max(1, Math.min(100, Math.round(options.batteryPercentage)));
  return {
    signalStrength: options.signalStrength,
    network: options.network,
    bluetoothEnabled: options.bluetoothEnabled,
    batteryPercentage,
    batteryStatus: options.charging ? "charging" : batteryPercentage <= 20 ? "critical" : "normal",
    carrier: options.carrier,
    clock: options.clock,
  };
}
