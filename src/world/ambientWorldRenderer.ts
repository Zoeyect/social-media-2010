import {
  AMBIENT_WORLD_BRIGHT_PASS_SHADER,
  AMBIENT_WORLD_FRAGMENT_SHADER,
  AMBIENT_WORLD_VERTEX_SHADER,
} from "./ambientWorldShaders";
import { createAmbientWorldScene, updateAmbientWorldScene } from "./ambientWorldState";
import { CAMERA_LOOK_NOMINAL_LIMITS } from "../state/cameraRuntime";
import type { CameraLookOffset, CameraLookState } from "../state/cameraRuntime";

const WORLD_TREATMENT = {
  blur: 0.82,
  exposure: 0.7,
  noiseAmount: 0.012,
  luminanceDrift: 0.015,
  colorDrift: 0.006,
  bloomAmount: 0.2,
} as const;

const CAMERA_TREATMENT = {
  blur: 0.1,
  exposure: 1,
  noiseAmount: 0.022,
  luminanceDrift: 0.01,
  colorDrift: 0.004,
  bloomAmount: 0.16,
} as const;

const DISPLAY_CONSTANTS = {
  maxLod: 5,
  bloomLod: 5,
  grainRate: 18,
  brightThreshold: 0.58,
  brightKnee: 0.14,
} as const;

const CAMERA_LOOK_EDGE_SCALE = 0.994;
const MAX_SHARED_SCENE_OFFSET = 0.001;
const SHARED_ZOOM_RANGE = { minimum: 0.9986, maximum: 1.0014 } as const;
const ZERO_CAMERA_LOOK: CameraLookState = {
  pointerOffset: { x: 0, y: 0 },
  orientationOffset: { x: 0, y: 0 },
};

type Uniforms = Record<string, WebGLUniformLocation | null>;
type Treatment = typeof WORLD_TREATMENT | typeof CAMERA_TREATMENT;

export type AmbientWorldRenderer = {
  setCameraViewfinder: (canvas: HTMLCanvasElement | null) => void;
  setCameraLookState: (state: CameraLookState) => void;
  setCameraLookClampHandler: (handler: ((offset: CameraLookOffset) => void) | null) => void;
  dispose: () => void;
};

type CameraLookAxisBounds = { minimum: number; maximum: number };
type CameraLookBounds = { x: CameraLookAxisBounds; y: CameraLookAxisBounds };

function compileShader(gl: WebGL2RenderingContext, type: number, source: string, name: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error(`${name} could not be created.`);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Unknown shader error.";
    gl.deleteShader(shader);
    throw new Error(`${name} failed to compile: ${message}`);
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
  name: string,
) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource, `${name} vertex shader`);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource, `${name} fragment shader`);
  const program = gl.createProgram();
  if (!program) throw new Error(`${name} program could not be created.`);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown program link error.";
    gl.deleteProgram(program);
    throw new Error(`${name} failed to link: ${message}`);
  }
  return program;
}

export function createAmbientWorldRenderer(canvas: HTMLCanvasElement, plateUrl: string) {
  const context = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!context) throw new Error("Ambient World requires WebGL2.");
  const gl: WebGL2RenderingContext = context;

  const layerProgram = createProgram(gl, AMBIENT_WORLD_VERTEX_SHADER, AMBIENT_WORLD_FRAGMENT_SHADER, "Ambient World layer");
  const brightProgram = createProgram(gl, AMBIENT_WORLD_VERTEX_SHADER, AMBIENT_WORLD_BRIGHT_PASS_SHADER, "Ambient World bright pass");
  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);

  const uniformNames = [
    "uTexture", "uBloomTex", "uResolution", "uTexResolution", "uTime", "uSceneOffset",
    "uSceneZoom", "uSceneLuma", "uSceneColor", "uSceneRing", "uBlur", "uNoiseAmount",
    "uLuminanceDrift", "uColorDrift", "uBloomAmount", "uExposure", "uOpacity", "uMaxLod",
    "uBloomLod", "uGrainScale", "uGrainRate", "uGrainSeed",
  ];
  const uniforms: Uniforms = Object.fromEntries(
    uniformNames.map(name => [name, gl.getUniformLocation(layerProgram, name)]),
  );
  const scene = createAmbientWorldScene();
  let plateTexture: WebGLTexture | null = null;
  let bloomTexture: WebGLTexture | null = null;
  let plateWidth = 1;
  let plateHeight = 1;
  let ready = false;
  let disposed = false;
  let animationFrame = 0;
  let lastFrameTime = performance.now();
  let sampleElapsed = 0;
  let sampleFrames = 0;
  let cameraViewfinder: HTMLCanvasElement | null = null;
  let cameraPresentation: CanvasRenderingContext2D | null = null;
  let cameraLookState: CameraLookState = ZERO_CAMERA_LOOK;
  let cameraLookClampHandler: ((offset: CameraLookOffset) => void) | null = null;
  let lastReportedClampedOffset: CameraLookOffset | null = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(canvas.clientWidth * dpr);
    const height = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    return dpr;
  }

  function uploadPlate(image: HTMLImageElement) {
    plateWidth = image.naturalWidth;
    plateHeight = image.naturalHeight;
    plateTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, plateTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);

    const bloomWidth = Math.max(2, plateWidth >> 1);
    const bloomHeight = Math.max(2, plateHeight >> 1);
    bloomTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, bloomTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, bloomWidth, bloomHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, bloomTexture, 0);
    gl.viewport(0, 0, bloomWidth, bloomHeight);
    gl.useProgram(brightProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, plateTexture);
    gl.uniform1i(gl.getUniformLocation(brightProgram, "uSrc"), 0);
    gl.uniform1f(gl.getUniformLocation(brightProgram, "uThreshold"), DISPLAY_CONSTANTS.brightThreshold);
    gl.uniform1f(gl.getUniformLocation(brightProgram, "uKnee"), DISPLAY_CONSTANTS.brightKnee);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(framebuffer);
    gl.bindTexture(gl.TEXTURE_2D, bloomTexture);
    gl.generateMipmap(gl.TEXTURE_2D);
    ready = true;
  }

  function uploadScene(dpr: number) {
    if (!plateTexture || !bloomTexture) return;
    gl.useProgram(layerProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, plateTexture);
    gl.uniform1i(uniforms.uTexture, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, bloomTexture);
    gl.uniform1i(uniforms.uBloomTex, 1);
    gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.uTexResolution, plateWidth, plateHeight);
    gl.uniform1f(uniforms.uTime, scene.time);
    gl.uniform2f(uniforms.uSceneOffset, scene.offset[0], scene.offset[1]);
    gl.uniform1f(uniforms.uSceneZoom, scene.zoom);
    gl.uniform1f(uniforms.uSceneLuma, scene.luma);
    gl.uniform1f(uniforms.uSceneColor, scene.color);
    gl.uniform1f(uniforms.uSceneRing, scene.ring);
    gl.uniform1f(uniforms.uMaxLod, DISPLAY_CONSTANTS.maxLod);
    gl.uniform1f(uniforms.uBloomLod, DISPLAY_CONSTANTS.bloomLod);
    gl.uniform1f(uniforms.uGrainScale, dpr * 1.25);
    gl.uniform1f(uniforms.uGrainRate, DISPLAY_CONSTANTS.grainRate);
  }

  function drawLayer(treatment: Treatment, grainSeed: number) {
    gl.uniform1f(uniforms.uBlur, treatment.blur);
    gl.uniform1f(uniforms.uExposure, treatment.exposure);
    gl.uniform1f(uniforms.uNoiseAmount, treatment.noiseAmount);
    gl.uniform1f(uniforms.uLuminanceDrift, treatment.luminanceDrift);
    gl.uniform1f(uniforms.uColorDrift, treatment.colorDrift);
    gl.uniform1f(uniforms.uBloomAmount, treatment.bloomAmount);
    gl.uniform1f(uniforms.uOpacity, 1);
    gl.uniform1f(uniforms.uGrainSeed, grainSeed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function cameraBounds() {
    if (!cameraViewfinder || !cameraPresentation) return null;
    const canvasRect = canvas.getBoundingClientRect();
    const viewfinderRect = cameraViewfinder.getBoundingClientRect();
    if (canvasRect.width <= 0 || canvasRect.height <= 0 || viewfinderRect.width <= 0 || viewfinderRect.height <= 0) return null;
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    const left = Math.max(0, Math.round((viewfinderRect.left - canvasRect.left) * scaleX));
    const top = Math.max(0, Math.round((viewfinderRect.top - canvasRect.top) * scaleY));
    const right = Math.min(canvas.width, Math.round((viewfinderRect.right - canvasRect.left) * scaleX));
    const bottom = Math.min(canvas.height, Math.round((viewfinderRect.bottom - canvasRect.top) * scaleY));
    if (right <= left || bottom <= top) return null;
    return { left, top, width: right - left, height: bottom - top };
  }

  function coverScale() {
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = plateWidth / plateHeight;
    return canvasAspect > imageAspect
      ? { x: 1, y: imageAspect / canvasAspect }
      : { x: canvasAspect / imageAspect, y: 1 };
  }

  function extremaAcrossZoom(minimum: number, maximum: number) {
    const candidates = [
      (minimum - 0.5) / SHARED_ZOOM_RANGE.minimum + 0.5,
      (minimum - 0.5) / SHARED_ZOOM_RANGE.maximum + 0.5,
      (maximum - 0.5) / SHARED_ZOOM_RANGE.minimum + 0.5,
      (maximum - 0.5) / SHARED_ZOOM_RANGE.maximum + 0.5,
    ];
    return {
      minimum: Math.min(...candidates) - MAX_SHARED_SCENE_OFFSET,
      maximum: Math.max(...candidates) + MAX_SHARED_SCENE_OFFSET,
    };
  }

  function safeAxisBounds(
    minimum: number,
    maximum: number,
    nominalLimit: number,
    samplingRadius: number,
  ): CameraLookAxisBounds {
    const transformedMinimum = (samplingRadius - 0.5) / CAMERA_LOOK_EDGE_SCALE + 0.5;
    const transformedMaximum = ((1 - samplingRadius) - 0.5) / CAMERA_LOOK_EDGE_SCALE + 0.5;
    const safeMinimum = Math.max(-nominalLimit, transformedMinimum - minimum);
    const safeMaximum = Math.min(nominalLimit, transformedMaximum - maximum);
    return safeMinimum <= safeMaximum
      ? { minimum: safeMinimum, maximum: safeMaximum }
      : { minimum: 0, maximum: 0 };
  }

  function cameraLookBounds(bounds: NonNullable<ReturnType<typeof cameraBounds>>): CameraLookBounds {
    const scale = coverScale();
    const left = bounds.left / canvas.width;
    const right = (bounds.left + bounds.width) / canvas.width;
    const bottom = (canvas.height - bounds.top - bounds.height) / canvas.height;
    const top = (canvas.height - bounds.top) / canvas.height;
    const sourceX = extremaAcrossZoom(
      (left - 0.5) * scale.x + 0.5,
      (right - 0.5) * scale.x + 0.5,
    );
    const sourceY = extremaAcrossZoom(
      (bottom - 0.5) * scale.y + 0.5,
      (top - 0.5) * scale.y + 0.5,
    );
    const samplingRadius = ((2 ** (CAMERA_TREATMENT.blur * DISPLAY_CONSTANTS.maxLod)) * 0.85)
      / plateHeight;
    return {
      x: safeAxisBounds(
        sourceX.minimum,
        sourceX.maximum,
        CAMERA_LOOK_NOMINAL_LIMITS.x,
        samplingRadius,
      ),
      y: safeAxisBounds(
        sourceY.minimum,
        sourceY.maximum,
        CAMERA_LOOK_NOMINAL_LIMITS.y,
        samplingRadius,
      ),
    };
  }

  function effectiveCameraLook(bounds: NonNullable<ReturnType<typeof cameraBounds>>) {
    const safeBounds = cameraLookBounds(bounds);
    const requested = {
      x: cameraLookState.pointerOffset.x + cameraLookState.orientationOffset.x,
      y: cameraLookState.pointerOffset.y + cameraLookState.orientationOffset.y,
    };
    const effective = {
      x: Math.min(safeBounds.x.maximum, Math.max(safeBounds.x.minimum, requested.x)),
      y: Math.min(safeBounds.y.maximum, Math.max(safeBounds.y.minimum, requested.y)),
    };
    const clampedPointerOffset = {
      x: effective.x - cameraLookState.orientationOffset.x,
      y: effective.y - cameraLookState.orientationOffset.y,
    };
    const wasClamped = Math.abs(clampedPointerOffset.x - cameraLookState.pointerOffset.x) > 1e-7
      || Math.abs(clampedPointerOffset.y - cameraLookState.pointerOffset.y) > 1e-7;
    if (wasClamped) {
      const alreadyReported = lastReportedClampedOffset
        && Math.abs(lastReportedClampedOffset.x - clampedPointerOffset.x) <= 1e-7
        && Math.abs(lastReportedClampedOffset.y - clampedPointerOffset.y) <= 1e-7;
      if (!alreadyReported) {
        lastReportedClampedOffset = clampedPointerOffset;
        cameraLookClampHandler?.(clampedPointerOffset);
      }
    } else {
      lastReportedClampedOffset = null;
    }
    canvas.dataset.cameraLookMinX = safeBounds.x.minimum.toFixed(6);
    canvas.dataset.cameraLookMaxX = safeBounds.x.maximum.toFixed(6);
    canvas.dataset.cameraLookMinY = safeBounds.y.minimum.toFixed(6);
    canvas.dataset.cameraLookMaxY = safeBounds.y.maximum.toFixed(6);
    canvas.dataset.cameraLookX = effective.x.toFixed(6);
    canvas.dataset.cameraLookY = effective.y.toFixed(6);
    return effective;
  }

  function presentCamera(bounds: NonNullable<ReturnType<typeof cameraBounds>>, dpr: number) {
    if (!cameraViewfinder || !cameraPresentation) return;
    const targetWidth = Math.max(1, Math.round(cameraViewfinder.clientWidth * dpr));
    const targetHeight = Math.max(1, Math.round(cameraViewfinder.clientHeight * dpr));
    if (cameraViewfinder.width !== targetWidth || cameraViewfinder.height !== targetHeight) {
      cameraViewfinder.width = targetWidth;
      cameraViewfinder.height = targetHeight;
    }
    cameraPresentation.drawImage(
      canvas,
      bounds.left,
      bounds.top,
      bounds.width,
      bounds.height,
      0,
      0,
      targetWidth,
      targetHeight,
    );
  }

  function draw(dpr: number) {
    if (!plateTexture || !bloomTexture) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.BLEND);
    uploadScene(dpr);
    drawLayer(WORLD_TREATMENT, 0);

    const bounds = cameraBounds();
    if (!bounds) {
      canvas.dataset.drawCalls = "1";
      return;
    }
    const cameraLook = effectiveCameraLook(bounds);
    gl.uniform2f(
      uniforms.uSceneOffset,
      scene.offset[0] + cameraLook.x,
      scene.offset[1] + cameraLook.y,
    );
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(bounds.left, canvas.height - bounds.top - bounds.height, bounds.width, bounds.height);
    drawLayer(CAMERA_TREATMENT, 137);
    gl.disable(gl.SCISSOR_TEST);
    presentCamera(bounds, dpr);
    canvas.dataset.drawCalls = "2";
  }

  function frame(now: number) {
    if (disposed) return;
    const deltaSeconds = Math.min((now - lastFrameTime) / 1000, 0.1);
    lastFrameTime = now;
    updateAmbientWorldScene(scene, deltaSeconds);
    const dpr = resize();
    if (ready) draw(dpr);
    sampleElapsed += deltaSeconds;
    sampleFrames += 1;
    if (sampleElapsed >= 0.5) {
      canvas.dataset.fps = String(Math.round(sampleFrames / sampleElapsed));
      sampleElapsed = 0;
      sampleFrames = 0;
    }
    animationFrame = window.requestAnimationFrame(frame);
  }

  const image = new Image();
  image.onload = () => {
    if (!disposed) uploadPlate(image);
  };
  image.onerror = () => console.error("Ambient World could not load its photographic plate.");
  image.src = plateUrl;
  document.addEventListener("visibilitychange", resetFrameTime);
  animationFrame = window.requestAnimationFrame(frame);

  function resetFrameTime() {
    lastFrameTime = performance.now();
  }

  return {
    setCameraViewfinder(target: HTMLCanvasElement | null) {
      cameraViewfinder = target;
      cameraPresentation = target?.getContext("2d", { alpha: false }) ?? null;
    },
    setCameraLookState(state: CameraLookState) {
      cameraLookState = {
        pointerOffset: { ...state.pointerOffset },
        orientationOffset: { ...state.orientationOffset },
      };
    },
    setCameraLookClampHandler(handler: ((offset: CameraLookOffset) => void) | null) {
      cameraLookClampHandler = handler;
    },
    dispose() {
      disposed = true;
      cameraViewfinder = null;
      cameraPresentation = null;
      cameraLookClampHandler = null;
      image.onload = null;
      image.onerror = null;
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("visibilitychange", resetFrameTime);
      if (plateTexture) gl.deleteTexture(plateTexture);
      if (bloomTexture) gl.deleteTexture(bloomTexture);
      gl.deleteProgram(layerProgram);
      gl.deleteProgram(brightProgram);
      if (vertexArray) gl.deleteVertexArray(vertexArray);
    },
  };
}
