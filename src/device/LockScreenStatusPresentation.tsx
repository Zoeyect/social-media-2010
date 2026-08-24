import signal0Src from "../assets/historical/ios4.1/statusbar/Black_0_Bars.png";
import signal1Src from "../assets/historical/ios4.1/statusbar/Black_1_Bars.png";
import signal2Src from "../assets/historical/ios4.1/statusbar/Black_2_Bars.png";
import signal3Src from "../assets/historical/ios4.1/statusbar/Black_3_Bars.png";
import signal4Src from "../assets/historical/ios4.1/statusbar/Black_4_Bars.png";
import signal5Src from "../assets/historical/ios4.1/statusbar/Black_5_Bars.png";
import edgeSrc from "../assets/historical/ios4.1/statusbar/Black_DataTypeEDGE.png";
import threeGSrc from "../assets/historical/ios4.1/statusbar/Black_DataTypeUMTS.png";
import wifiSrc from "../assets/historical/ios4.1/statusbar/Black_3_WifiBars.png";
import batteryChargingSrc from "../assets/historical/ios4.1/statusbar/Black_BatteryCharging.png";
import batteryFrameSrc from "../assets/historical/ios4.1/statusbar/Black_BatteryDrainingBG.png";
import batteryFillSrc from "../assets/historical/ios4.1/statusbar/Black_BatteryDrainingInsides.png";
import batteryLowFillSrc from "../assets/historical/ios4.1/statusbar/Black_BatteryDrainingInsidesLow.png";
import lockSrc from "../assets/historical/ios4.1/statusbar/Black_Lock.png";
import { LockScreenModel } from "../state/lockScreenModel";

const signalGlyphs = [signal0Src, signal1Src, signal2Src, signal3Src, signal4Src, signal5Src] as const;
const networkGlyphs = { EDGE: edgeSrc, "3G": threeGSrc, WiFi: wifiSrc } as const;

export function LockScreenStatusPresentation({ model }: { model: LockScreenModel }) {
  const batteryFill = model.batteryStatus === "critical" ? batteryLowFillSrc : batteryFillSrc;

  return <div className="system-status-bar" data-runtime="SBAway" data-center-lock-artwork="READY">
    <div className="status-region status-region-left">
      <img className="status-signal" src={signalGlyphs[model.signalStrength]} alt={`${model.signalStrength} of 5 signal bars`} />
      {model.carrierArtworkSrc
        ? <img className="status-carrier" src={model.carrierArtworkSrc} alt={model.carrier} />
        : <span className="status-carrier status-text">{model.carrier}</span>}
      {model.network !== "none" && <img className="status-network" src={networkGlyphs[model.network]} alt={model.network} />}
    </div>
    <div className="status-region status-region-center"><img className="status-lock" src={lockSrc} alt="Locked" /></div>
    <div className="status-region status-region-right">
      <span className="status-battery-percent status-text">{model.batteryPercentage}%</span>
      {model.batteryStatus === "charging"
        ? <img className="status-battery-glyph" src={batteryChargingSrc} alt="Charging" />
        : <span className="status-battery-glyph" role="img" aria-label={`${model.batteryPercentage}% battery`}>
            <span className="battery-fill-well">
              <span className="battery-fill" style={{ width: `${model.batteryPercentage}%`, backgroundImage: `url(${batteryFill})` }} />
            </span>
            <img className="battery-frame" src={batteryFrameSrc} alt="" aria-hidden="true" />
          </span>}
    </div>
  </div>;
}
