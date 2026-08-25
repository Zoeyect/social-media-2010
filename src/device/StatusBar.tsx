import { StatusBarState } from "../state/statusBarModel";
import { STATUS_BAR_ASSETS } from "../data/statusBarAssets";
import { HistoricalStatusAsset } from "./HistoricalStatusAsset";

export function StatusBar({ state }: { state: StatusBarState }) {
  const batteryFill = state.batteryStatus === "critical" ? STATUS_BAR_ASSETS.battery.lowFill : STATUS_BAR_ASSETS.battery.fill;

  return <div className="system-status-bar" data-battery-status={state.batteryStatus}>
    <div className="status-region status-region-left">
      <HistoricalStatusAsset className="status-signal" src={STATUS_BAR_ASSETS.signal[state.signalStrength]} data-signal-strength={state.signalStrength} alt={`${state.signalStrength} of 5 signal bars`} />
      {state.carrierArtworkSrc
        ? <HistoricalStatusAsset className="status-carrier" src={state.carrierArtworkSrc} data-carrier={state.carrier} alt={state.carrier} />
        : <span className="status-carrier status-text" data-carrier={state.carrier}>{state.carrier}</span>}
      {state.network !== "none" && <HistoricalStatusAsset className="status-network" src={STATUS_BAR_ASSETS.network[state.network]} data-network={state.network} alt={state.network} />}
    </div>
    <div className="status-region status-region-center"><strong className="status-clock">{state.clock}</strong></div>
    <div className="status-region status-region-right">
      {state.bluetoothEnabled && <HistoricalStatusAsset className="status-bluetooth" src={STATUS_BAR_ASSETS.bluetooth} alt="Bluetooth" />}
      <span className="status-battery-percent status-text">{state.batteryPercentage}%</span>
      {state.batteryStatus === "charging"
        ? <HistoricalStatusAsset className="status-battery-glyph" src={STATUS_BAR_ASSETS.battery.charging} alt="Charging" />
        : <span className="status-battery-glyph" role="img" aria-label={`${state.batteryPercentage}% battery`}>
            <span className="battery-fill-well">
              <span className="battery-fill" style={{ width: `${state.batteryPercentage}%`, backgroundImage: `url(${batteryFill})` }} />
            </span>
            <HistoricalStatusAsset className="battery-frame" src={STATUS_BAR_ASSETS.battery.frame} alt="" aria-hidden="true" />
          </span>}
    </div>
  </div>;
}
