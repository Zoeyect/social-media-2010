import type { ReactElement } from "react";

export type DevicePresenter = "legacy" | "hero";
export type RuntimePowerControl = {
  state: "awake" | "asleep";
  begin: () => void;
  end: () => void;
  cancel: () => void;
};
export type HeroDevicePresentation = {
  screen: ReactElement;
  softwareReady: boolean;
  powerControl?: RuntimePowerControl;
  onConfirmIdentity: (name: string) => void;
  onHandoff: () => void;
  onUserActivity: () => void;
  onHomePress: () => void;
};
