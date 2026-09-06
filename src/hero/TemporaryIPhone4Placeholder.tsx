import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import bootLogoSrc from "../assets/historical/ios4.1/applelogo-iphone3,1-8B117.png";
import { createIPhone4MaterialRoles, disposeIPhone4MaterialRoles } from "./iphone4Materials";

type TemporaryIPhone4PlaceholderProps = Readonly<{
  bootAmount: number;
  powerEnabled: boolean;
  onPowerPress: () => void;
}>;

/**
 * RECONSTRUCTED / TEMPORARY interaction geometry. This is deliberately isolated
 * so it can be deleted when an approved iphone4.glb arrives.
 *
 * Production mesh requirements live only in iphone4ModelContract.ts.
 */
export function TemporaryIPhone4Placeholder({
  bootAmount,
  powerEnabled,
  onPowerPress,
}: TemporaryIPhone4PlaceholderProps) {
  const bootTexture = useLoader(TextureLoader, bootLogoSrc);
  const materials = useMemo(createIPhone4MaterialRoles, []);
  useEffect(() => () => disposeIPhone4MaterialRoles(materials), [materials]);

  return (
    <group name="TemporaryIPhone4Placeholder">
      <mesh name="PhoneBody" material={materials.blackPlastic}>
        <boxGeometry args={[1.38, 2.78, 0.25]} />
      </mesh>
      <mesh name="StainlessFrame" material={materials.stainlessSteel}>
        <boxGeometry args={[1.42, 2.82, 0.2]} />
      </mesh>
      <mesh name="FrontGlass" position={[0, 0, 0.132]} material={materials.blackGlass}>
        <boxGeometry args={[1.36, 2.76, 0.035]} />
      </mesh>
      <mesh name="BackGlass" position={[0, 0, -0.132]} material={materials.blackGlass}>
        <boxGeometry args={[1.36, 2.76, 0.035]} />
      </mesh>

      <mesh name="Screen" position={[0, 0.05, 0.155]} material={materials.displayGlass}>
        <planeGeometry args={[1.12, 1.91]} />
      </mesh>
      <mesh name="BootLogo" position={[0, 0.05, 0.158]} visible={bootAmount > 0.01}>
        <planeGeometry args={[1.12, 1.91]} />
        <meshBasicMaterial
          map={bootTexture}
          transparent
          opacity={bootAmount}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh name="HomeButton" position={[0, -1.13, 0.174]} rotation={[Math.PI / 2, 0, 0]} material={materials.blackPlastic}>
        <cylinderGeometry args={[0.145, 0.145, 0.025, 40]} />
      </mesh>
      <mesh name="HomeButtonGlyph" position={[0, -1.13, 0.19]}>
        <ringGeometry args={[0.047, 0.055, 4]} />
        <meshBasicMaterial color="#777777" transparent opacity={0.7} />
      </mesh>
      <mesh name="Earpiece" position={[0, 1.16, 0.176]} material={materials.blackPlastic}>
        <boxGeometry args={[0.34, 0.055, 0.018]} />
      </mesh>
      <mesh name="FrontCamera" position={[-0.28, 1.16, 0.178]} material={materials.cameraLens}>
        <circleGeometry args={[0.035, 24]} />
      </mesh>
      <mesh name="RearCamera" position={[-0.47, 1.12, -0.156]} rotation={[0, Math.PI, 0]} material={materials.cameraLens}>
        <circleGeometry args={[0.075, 28]} />
      </mesh>
      <mesh name="RearFlash" position={[-0.29, 1.12, -0.157]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.045, 24]} />
        <meshStandardMaterial color="#d6cfb4" roughness={0.55} />
      </mesh>

      <mesh
        name="PowerButton"
        position={[0.38, 1.425, 0]}
        material={materials.buttonMetal}
        onPointerEnter={(event) => {
          if (!powerEnabled) return;
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => { document.body.style.cursor = ""; }}
        onPointerDown={(event) => {
          if (!powerEnabled) return;
          event.stopPropagation();
        }}
        onPointerUp={(event) => {
          if (!powerEnabled) return;
          event.stopPropagation();
          document.body.style.cursor = "";
          onPowerPress();
        }}
      >
        <boxGeometry args={[0.36, 0.055, 0.13]} />
      </mesh>
      <mesh name="VolumeUp" position={[-0.725, 0.48, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.buttonMetal}>
        <cylinderGeometry args={[0.075, 0.075, 0.035, 24]} />
      </mesh>
      <mesh name="VolumeDown" position={[-0.725, 0.19, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.buttonMetal}>
        <cylinderGeometry args={[0.075, 0.075, 0.035, 24]} />
      </mesh>
      <mesh name="MuteSwitch" position={[-0.725, 0.82, 0]} material={materials.buttonMetal}>
        <boxGeometry args={[0.035, 0.15, 0.1]} />
      </mesh>
      <mesh name="HeadphoneJack" position={[-0.43, 1.425, 0]} material={materials.blackPlastic}>
        <cylinderGeometry args={[0.075, 0.075, 0.018, 24]} />
      </mesh>
      <mesh name="Dock30Pin" position={[0, -1.412, 0.015]} rotation={[Math.PI / 2, 0, 0]} material={materials.blackPlastic}>
        <planeGeometry args={[0.46, 0.08]} />
      </mesh>
    </group>
  );
}
