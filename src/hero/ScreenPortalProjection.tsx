import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh } from "three";
import { projectScreenQuad } from "./screenPortalMath";
import type { ScreenPortalHandle } from "./ScreenPortal";

export function ScreenPortalProjection({portal,enabled}:{portal:RefObject<ScreenPortalHandle|null>;enabled:boolean}) {
  const {scene,camera,gl,invalidate}=useThree();
  const previous=useRef("");
  const lastPortal=useRef<ScreenPortalHandle|null>(null);
  useEffect(()=> {
    previous.current="";
    invalidate();
    // R3F already observes canvas resizing. These cover viewport movement and
    // DPR changes; projection still uses CSS size, never backing-buffer pixels.
    const wake=()=>{previous.current="";invalidate();};
    window.addEventListener("resize",wake);
    window.addEventListener("scroll",wake,true);
    let dprQuery=window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const dprChanged=()=>{
      dprQuery.removeEventListener("change",dprChanged);
      dprQuery=window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprQuery.addEventListener("change",dprChanged);
      wake();
    };
    dprQuery.addEventListener("change",dprChanged);
    return()=>{window.removeEventListener("resize",wake);window.removeEventListener("scroll",wake,true);dprQuery.removeEventListener("change",dprChanged);};
  },[enabled,invalidate]);
  useFrame(()=>{
    if(!portal.current)return;
    if(lastPortal.current!==portal.current){previous.current="";lastPortal.current=portal.current;}
    if(!enabled){if(previous.current!=="hidden")portal.current.update(null);previous.current="hidden";return;}
    const screen=scene.getObjectByName("PersistentHeroPhone")?.getObjectByName("Screen");
    if(!(screen instanceof Mesh)){portal.current.update(null);return;}
    screen.updateWorldMatrix(true,false);camera.updateWorldMatrix(true,false);
    const rect=gl.domElement.getBoundingClientRect();
    const signature=[screen.uuid,...screen.matrixWorld.elements,...camera.matrixWorldInverse.elements,...camera.projectionMatrix.elements,
      rect.left,rect.top,rect.width,rect.height,window.devicePixelRatio].join(",");
    if(signature===previous.current)return;
    previous.current=signature;
    portal.current.update(projectScreenQuad(screen,camera,rect));
  }); // After HeroPhone (-1), with no independent perpetual RAF loop.
  return null;
}
