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
import lockSrc from "../assets/historical/ios4.1/statusbar/Black_Lock.png";
import carrierAttFsoSrc from "../assets/historical/ios4.1/statusbar/carrier/FSO_CARRIER_ATT@2x.browser.png";

export const STATUS_BAR_ASSETS = Object.freeze({
  signal: Object.freeze([signal0Src, signal1Src, signal2Src, signal3Src, signal4Src, signal5Src] as const),
  network: Object.freeze({ EDGE: edgeSrc, "3G": threeGSrc, WiFi: wifiSrc }),
  bluetooth: bluetoothSrc,
  battery: Object.freeze({
    charging: batteryChargingSrc,
    frame: batteryFrameSrc,
    fill: batteryFillSrc,
    lowFill: batteryLowFillSrc,
  }),
  lock: lockSrc,
  carrier: Object.freeze({ attFso: carrierAttFsoSrc }),
});
