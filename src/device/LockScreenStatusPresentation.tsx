import { STATUS_BAR_ASSETS } from "../data/statusBarAssets";
import { LockScreenModel } from "../state/lockScreenModel";
import { HistoricalStatusAsset } from "./HistoricalStatusAsset";

export function LockScreenStatusPresentation({ model }: { model: LockScreenModel }) {
  const batteryFill = model.batteryStatus === "critical" ? STATUS_BAR_ASSETS.battery.lowFill : STATUS_BAR_ASSETS.battery.fill;

  return <div className="system-status-bar" data-runtime="SBAway" data-center-lock-artwork="READY">
    <div className="status-region status-region-left">
      <HistoricalStatusAsset className="status-signal" src={STATUS_BAR_ASSETS.signal[model.signalStrength]} alt={`${model.signalStrength} of 5 signal bars`} />
      {model.carrierArtworkSrc
        ? <HistoricalStatusAsset className="status-carrier" src={model.carrierArtworkSrc} alt={model.carrier} />
        : <span className="status-carrier status-text">{model.carrier}</span>}
      {model.network !== "none" && <HistoricalStatusAsset className="status-network" src={STATUS_BAR_ASSETS.network[model.network]} alt={model.network} />}
    </div>
    <div className="status-region status-region-center"><HistoricalStatusAsset className="status-lock" src={STATUS_BAR_ASSETS.lock} alt="Locked" /></div>
    <div className="status-region status-region-right">
      <span className="status-battery-percent status-text">{model.batteryPercentage}%</span>
      {model.batteryStatus === "charging"
        ? <HistoricalStatusAsset className="status-battery-glyph" src={STATUS_BAR_ASSETS.battery.charging} alt="Charging" />
        : <span className="status-battery-glyph" role="img" aria-label={`${model.batteryPercentage}% battery`}>
            <span className="battery-fill-well">
              <span className="battery-fill" style={{ width: `${model.batteryPercentage}%`, backgroundImage: `url(${batteryFill})` }} />
            </span>
            <HistoricalStatusAsset className="battery-frame" src={STATUS_BAR_ASSETS.battery.frame} alt="" aria-hidden="true" />
          </span>}
    </div>
  </div>;
}
