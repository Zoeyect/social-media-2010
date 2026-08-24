import { StatusBarState } from "../state/statusBarModel";
import signal0Src from "../assets/historical/ios4.1/statusbar/Black_0_Bars.png";
import signal1Src from "../assets/historical/ios4.1/statusbar/Black_1_Bars.png";
import signal2Src from "../assets/historical/ios4.1/statusbar/Black_2_Bars.png";
import signal3Src from "../assets/historical/ios4.1/statusbar/Black_3_Bars.png";
import signal4Src from "../assets/historical/ios4.1/statusbar/Black_4_Bars.png";
import signal5Src from "../assets/historical/ios4.1/statusbar/Black_5_Bars.png";
import edgeSrc from "../assets/historical/ios4.1/statusbar/Black_DataTypeEDGE.png";
import threeGSrc from "../assets/historical/ios4.1/statusbar/Black_DataTypeUMTS.png";
import wifiSrc from "../assets/historical/ios4.1/statusbar/Black_3_WifiBars.png";
import bluetoothSrc from "../assets/historical/ios4.1/statusbar/Black_Bluetooth.png";
import batteryChargingSrc from "../assets/historical/ios4.1/statusbar/Black_BatteryCharging.png";
import batteryFrameSrc from "../assets/historical/ios4.1/statusbar/Black_BatteryDrainingBG.png";
import batteryFillSrc from "../assets/historical/ios4.1/statusbar/Black_BatteryDrainingInsides.png";
import batteryLowFillSrc from "../assets/historical/ios4.1/statusbar/Black_BatteryDrainingInsidesLow.png";

const signalGlyphs = [signal0Src, signal1Src, signal2Src, signal3Src, signal4Src, signal5Src] as const;
const networkGlyphs = {
  EDGE: edgeSrc,
  "3G": threeGSrc,
  WiFi: wifiSrc,
} as const;

export function StatusBar({ state }: { state: StatusBarState }) {
  const batteryFill = state.batteryStatus === "critical" ? batteryLowFillSrc : batteryFillSrc;

  return <div className="status" data-battery-status={state.batteryStatus}>
    <img className="signal" src={signalGlyphs[state.signalStrength]} data-signal-strength={state.signalStrength} alt={`${state.signalStrength} of 5 signal bars`} />
    <span className="carrier">{state.carrier}</span>
    {state.network !== "none" && <img className="network" src={networkGlyphs[state.network]} data-network={state.network} alt={state.network} />}
    <strong>{state.clock}</strong>
    {state.bluetoothEnabled && <img className="bluetooth" src={bluetoothSrc} alt="Bluetooth" />}
    <span className="battery-percent">{state.batteryPercentage}%</span>
    {state.batteryStatus === "charging"
      ? <img className="battery-glyph" src={batteryChargingSrc} alt="Charging" />
      : <span className="battery-glyph" role="img" aria-label={`${state.batteryPercentage}% battery`}>
          <span className="battery-fill-well">
            <span className="battery-fill" style={{ width: `${state.batteryPercentage}%`, backgroundImage: `url(${batteryFill})` }} />
          </span>
          <img className="battery-frame" src={batteryFrameSrc} alt="" aria-hidden="true" />
        </span>}
  </div>;
}
