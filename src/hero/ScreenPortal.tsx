import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import { quadCorners, screenQuadMatrix, type ProjectedScreenQuad } from "./screenPortalMath";

export type ScreenPortalState = "hidden" | "boot" | "qa";
export type ScreenPortalHandle = { update: (quad: ProjectedScreenQuad | null) => void };

/** Normal DOM content only. A future software surface replaces this QA child,
 * not the persistent Three shell. Pointer ownership remains with Hero in v0.1. */
export const ScreenPortal = forwardRef<ScreenPortalHandle, {
  host: HTMLDivElement; state: ScreenPortalState; debug: boolean;
}>(function ScreenPortal({host,state,debug}, ref) {
  const surface = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLOutputElement>(null);
  const markers = useRef<(HTMLSpanElement | null)[]>([]);
  const projectedMarkers = useRef<(HTMLSpanElement | null)[]>([]);
  const latest = useRef<ProjectedScreenQuad | null>(null);
  const raf = useRef<number | null>(null);
  useEffect(() => () => { if (raf.current !== null) cancelAnimationFrame(raf.current); }, []);
  useImperativeHandle(ref, () => ({ update(quad) {
    latest.current=quad;
    const element=surface.current;
    if (!element) return;
    if (!quad) { element.style.visibility="hidden"; return; }
    const origin=host.getBoundingClientRect();
    const width=320, height=width/quad.aspectRatio; // Software coordinates, never screen placement.
    const corners=quadCorners(quad);
    const matrix=screenQuadMatrix(corners.map(p=>({x:p.x-origin.left,y:p.y-origin.top})),width,height);
    if (!matrix) {element.style.visibility="hidden";return;}
    element.style.width=`${width}px`; element.style.height=`${height}px`;
    element.style.transform=`matrix3d(${matrix.join(",")})`;
    element.style.clipPath=`polygon(${quad.clipPolygon.map(p=>`${p.x*100}% ${p.y*100}%`).join(",")})`;
    element.style.visibility="visible";
    if (!debug) return;
    corners.forEach((point,i)=> {
      const marker=projectedMarkers.current[i];
      if(marker) marker.style.transform=`translate(${point.x-origin.left}px,${point.y-origin.top}px)`;
    });
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current=requestAnimationFrame(()=>{
      raf.current=null;
      if (!readout.current || latest.current !== quad) return;
      const actual=markers.current.map(marker=>marker?.getBoundingClientRect());
      const computed=getComputedStyle(element);
      readout.current.textContent=[`ScreenPortal: ${state} · CSS px · manual QA pending`,
        `mesh aspect ${quad.aspectRatio.toFixed(6)} · DOM aspect ${(parseFloat(computed.width)/parseFloat(computed.height)).toFixed(6)}`,
        `projected edges ${quad.width.toFixed(2)} × ${quad.height.toFixed(2)}`,
        ...corners.map((p,i)=>{
          const a=actual[i];
          return `${["TL","TR","BR","BL"][i]} mesh(${p.x.toFixed(2)},${p.y.toFixed(2)}) DOM(${a?.left.toFixed(2)},${a?.top.toFixed(2)}) error=${a ? Math.hypot(a.left-p.x,a.top-p.y).toFixed(3):"n/a"}`;
        })].join("\n");
    });
  }}),[host,debug,state]);
  return createPortal(<>
    <div ref={surface} className="hero-screen-portal" data-state={state} aria-hidden="true">
      <div className="hero-screen-portal-grid"><span>ScreenPortal QA<br/>mesh-derived aspect</span></div>
      {([ [0,0],[100,0],[100,100],[0,100] ] as const).map(([x,y],i)=><span key={i} ref={node=>{markers.current[i]=node;}} className="hero-screen-dom-corner" style={{left:`${x}%`,top:`${y}%`}} />)}
    </div>
    {debug && state !== "hidden" && <>
      {[0,1,2,3].map(i=><span key={i} ref={node=>{projectedMarkers.current[i]=node;}} className="hero-screen-projected-corner" />)}
      <output ref={readout} className="hero-screen-portal-readout" />
    </>}
  </>,host);
});
