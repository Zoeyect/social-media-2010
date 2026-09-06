import React from "react";
import ReactDOM from "react-dom/client";
import { DeviceRoot } from "../device/DeviceRoot";
import "../styles/device.css";
import "./hero.css";

ReactDOM.createRoot(document.getElementById("hero-root")!).render(
  <React.StrictMode>
    <DeviceRoot presenter="hero" />
  </React.StrictMode>,
);
