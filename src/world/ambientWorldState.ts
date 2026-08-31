export type AmbientWorldScene = {
  time: number;
  motionAmount: number;
  offset: [number, number];
  zoom: number;
  luma: number;
  color: number;
  ring: number;
};

function slow(time: number, frequency: number, phase: number) {
  return (
    Math.sin(time * frequency + phase)
    + 0.72 * Math.sin(time * frequency * 1.61803 + phase * 2.31 + 1.7)
    + 0.48 * Math.sin(time * frequency * 2.71828 + phase * 4.13 + 4.2)
  ) / 2.2;
}

export function createAmbientWorldScene(): AmbientWorldScene {
  return {
    time: 0,
    motionAmount: 1,
    offset: [0, 0],
    zoom: 1,
    luma: 0,
    color: 0,
    ring: 0.4,
  };
}

export function updateAmbientWorldScene(scene: AmbientWorldScene, deltaSeconds: number) {
  scene.time += deltaSeconds;
  const motion = scene.motionAmount;
  scene.offset[0] = slow(scene.time, 0.285, 0) * 0.001 * motion;
  scene.offset[1] = slow(scene.time, 0.231, 2.6) * 0.001 * motion;
  scene.zoom = 1 + slow(scene.time, 0.197, 5.1) * 0.0014 * motion;
  scene.luma = slow(scene.time, 0.62, 0.9);
  scene.color = slow(scene.time, 0.083, 3.4);
  scene.ring = 0.4 + slow(scene.time, 0.11, 1.3) * 0.25;
}
