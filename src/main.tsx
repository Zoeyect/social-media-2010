import React from "react";
import ReactDOM from "react-dom/client";
import { DeviceRoot } from "./device/DeviceRoot";
import "./styles/device.css";

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><DeviceRoot presenter="legacy" /></React.StrictMode>);
