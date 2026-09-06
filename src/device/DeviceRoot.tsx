import { lazy, Suspense, useState } from "react";
import { App } from "./App";
import type { DevicePresenter, HeroDevicePresentation } from "./DevicePresentation";

const HeroPresenter = lazy(() => import("../hero/HeroSandbox").then(module => ({ default: module.HeroSandbox })));
const renderHero = (presentation: HeroDevicePresentation) => <Suspense fallback={null}><HeroPresenter {...presentation} /></Suspense>;

/** Presenter is selected once per page, never by a session phase. */
export function DeviceRoot({ presenter }: { presenter: DevicePresenter }) {
  const [initialPresenter] = useState(presenter);
  return <App presenter={initialPresenter} renderHero={renderHero} />;
}
