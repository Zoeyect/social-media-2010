import React from "react";
import ReactDOM from "react-dom/client";
import { HeroSandbox } from "./HeroSandbox";
import "./hero.css";

ReactDOM.createRoot(document.getElementById("hero-root")!).render(
  <React.StrictMode>
    <HeroSandbox />
  </React.StrictMode>,
);
