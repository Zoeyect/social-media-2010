import {
  AMBIENT_WORLD_BRIGHT_PASS_SHADER,
  AMBIENT_WORLD_FRAGMENT_SHADER,
  AMBIENT_WORLD_VERTEX_SHADER,
} from "./ambientWorldShaders";
import { createAmbientWorldScene, updateAmbientWorldScene } from "./ambientWorldState";
import { CAMERA_LOOK_NOMINAL_LIMITS } from "../state/cameraRuntime";
import type { CameraDevice, CameraLookOffset, CameraLookState, CameraMode } from "../state/cameraRuntime";
import {
  CAMERA_CAPTURE_GRAIN_SCALE,
  CAMERA_CAPTURE_HEIGHT,
  CAMERA_CAPTURE_JPEG_QUALITY,
  CAMERA_CAPTURE_MIME_TYPE,
  CAMERA_CAPTURE_SCENE_ID,
  CAMERA_CAPTURE_WIDTH,
} from "../state/cameraCaptureState";
import type {
  CameraCapturedArtifact,
  CameraCaptureFramingSnapshot,
  CameraCaptureSceneSnapshot,
} from "../state/cameraCaptureState";

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
  captureCameraStill: (request: CameraStillCaptureRequest) => Promise<CameraCapturedArtifact>;
  dispose: () => void;
};

export type CameraStillCaptureRequest = Readonly<{
  createdAt: string;
  experienceSessionId: string;
  cameraFacing: CameraDevice;
  cameraMode: CameraMode;
}>;

type CameraLookAxisBounds = { minimum: number; maximum: number };
type CameraLookBounds = { x: CameraLookAxisBounds; y: CameraLookAxisBounds };

type PresentedCameraFrame = Readonly<{
  pointerOffset: CameraLookOffset;
  orientationOffset: CameraLookOffset;
  effectiveLookOffset: CameraLookOffset;
  sharedScene: CameraCaptureSceneSnapshot;
}>;

function cloneOffset(offset: CameraLookOffset): CameraLookOffset {
  return Object.freeze({ x: offset.x, y: offset.y });
}

function encodeJpeg(pixels: Uint8Array, width: number, height: number) {
  const rowBytes = width * 4;
  const row = new Uint8Array(rowBytes);
  for (let top = 0, bottom = height - 1; top < bottom; top += 1, bottom -= 1) {
    const topOffset = top * rowBytes;
    const bottomOffset = bottom * rowBytes;
    row.set(pixels.subarray(topOffset, topOffset + rowBytes));
    pixels.copyWithin(topOffset, bottomOffset, bottomOffset + rowBytes);
    pixels.set(row, bottomOffset);
  }

  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const context = output.getContext("2d", { alpha: false });
  if (!context) throw new Error("Camera capture could not create a 2D encoding context.");
  context.putImageData(
    new ImageData(
      new Uint8ClampedArray(pixels.buffer as ArrayBuffer, pixels.byteOffset, pixels.byteLength),
      width,
      height,
    ),
    0,
    0,
  );
  return new Promise<Blob>((resolve, reject) => {
    try {
      output.toBlob(blob => {
        output.width = 1;
        output.height = 1;
        if (blob) resolve(blob);
        else reject(new Error("Camera capture JPEG encoding returned no data."));
      }, CAMERA_CAPTURE_MIME_TYPE, CAMERA_CAPTURE_JPEG_QUALITY);
    } catch (error) {
      output.width = 1;
      output.height = 1;
      reject(error);
    }
  });
}

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
  let lastPresentedCameraFrame: PresentedCameraFrame | null = null;

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

  function uploadScene(
    width: number,
    height: number,
    time: number,
    offset: CameraLookOffset,
    zoom: number,
    luminance: number,
    color: number,
    ring: number,
    grainScale: number,
  ) {
    if (!plateTexture || !bloomTexture) return;
    gl.useProgram(layerProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, plateTexture);
    gl.uniform1i(uniforms.uTexture, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, bloomTexture);
    gl.uniform1i(uniforms.uBloomTex, 1);
    gl.uniform2f(uniforms.uResolution, width, height);
    gl.uniform2f(uniforms.uTexResolution, plateWidth, plateHeight);
    gl.uniform1f(uniforms.uTime, time);
    gl.uniform2f(uniforms.uSceneOffset, offset.x, offset.y);
    gl.uniform1f(uniforms.uSceneZoom, zoom);
    gl.uniform1f(uniforms.uSceneLuma, luminance);
    gl.uniform1f(uniforms.uSceneColor, color);
    gl.uniform1f(uniforms.uSceneRing, ring);
    gl.uniform1f(uniforms.uMaxLod, DISPLAY_CONSTANTS.maxLod);
    gl.uniform1f(uniforms.uBloomLod, DISPLAY_CONSTANTS.bloomLod);
    gl.uniform1f(uniforms.uGrainScale, grainScale);
    gl.uniform1f(uniforms.uGrainRate, DISPLAY_CONSTANTS.grainRate);
  }

  function uploadTreatment(treatment: Treatment, grainSeed: number) {
    gl.uniform1f(uniforms.uBlur, treatment.blur);
    gl.uniform1f(uniforms.uExposure, treatment.exposure);
    gl.uniform1f(uniforms.uNoiseAmount, treatment.noiseAmount);
    gl.uniform1f(uniforms.uLuminanceDrift, treatment.luminanceDrift);
    gl.uniform1f(uniforms.uColorDrift, treatment.colorDrift);
    gl.uniform1f(uniforms.uBloomAmount, treatment.bloomAmount);
    gl.uniform1f(uniforms.uOpacity, 1);
    gl.uniform1f(uniforms.uGrainSeed, grainSeed);
  }

  function drawLayer(treatment: Treatment, grainSeed: number) {
    uploadTreatment(treatment, grainSeed);
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
    uploadScene(
      canvas.width,
      canvas.height,
      scene.time,
      { x: scene.offset[0], y: scene.offset[1] },
      scene.zoom,
      scene.luma,
      scene.color,
      scene.ring,
      dpr * 1.25,
    );
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const bounds = cameraBounds();
    if (!bounds) {
      lastPresentedCameraFrame = null;
      canvas.dataset.drawCalls = "0";
      return;
    }
    const cameraLook = effectiveCameraLook(bounds);
    lastPresentedCameraFrame = Object.freeze({
      pointerOffset: cloneOffset(cameraLookState.pointerOffset),
      orientationOffset: cloneOffset(cameraLookState.orientationOffset),
      effectiveLookOffset: cloneOffset(cameraLook),
      sharedScene: Object.freeze({
        timeSeconds: scene.time,
        swayOffset: cloneOffset({ x: scene.offset[0], y: scene.offset[1] }),
        zoom: scene.zoom,
        luminance: scene.luma,
        color: scene.color,
        ring: scene.ring,
        grainSeed: 137,
      }),
    });
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
    canvas.dataset.drawCalls = "1";
  }

  async function captureCameraStill(request: CameraStillCaptureRequest): Promise<CameraCapturedArtifact> {
    if (disposed || !ready || !plateTexture || !bloomTexture) {
      throw new Error("Camera capture is unavailable before the scene renderer is ready.");
    }
    if (request.cameraMode !== "photo" || request.cameraFacing !== "rear") {
      throw new Error("Camera Capture Pipeline v0.1 supports rear-camera Photo mode only.");
    }
    const presented = lastPresentedCameraFrame;
    if (!presented) throw new Error("Camera capture has no presented Camera frame to snapshot.");

    const maximumTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (maximumTextureSize < Math.max(CAMERA_CAPTURE_WIDTH, CAMERA_CAPTURE_HEIGHT)) {
      throw new Error(`Camera capture requires a 2592px texture; WebGL reports ${maximumTextureSize}px.`);
    }

    const framing: CameraCaptureFramingSnapshot = Object.freeze({
      pointerOffset: cloneOffset(presented.pointerOffset),
      orientationOffset: cloneOffset(presented.orientationOffset),
      effectiveLookOffset: cloneOffset(presented.effectiveLookOffset),
      sharedScene: Object.freeze({
        ...presented.sharedScene,
        swayOffset: cloneOffset(presented.sharedScene.swayOffset),
      }),
    });
    const snapshot = Object.freeze({
      createdAt: request.createdAt,
      experienceSessionId: request.experienceSessionId,
      sceneId: CAMERA_CAPTURE_SCENE_ID,
      width: CAMERA_CAPTURE_WIDTH,
      height: CAMERA_CAPTURE_HEIGHT,
      mimeType: CAMERA_CAPTURE_MIME_TYPE,
      cameraFacing: request.cameraFacing,
      cameraMode: request.cameraMode,
      framing,
    });

    const previousFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
    const previousViewport = gl.getParameter(gl.VIEWPORT) as Int32Array;
    const previousScissorBox = gl.getParameter(gl.SCISSOR_BOX) as Int32Array;
    const previousScissorEnabled = gl.isEnabled(gl.SCISSOR_TEST);
    const previousBlendEnabled = gl.isEnabled(gl.BLEND);
    const previousProgram = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null;
    const previousVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING) as WebGLVertexArrayObject | null;
    const previousActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE) as number;
    const previousPackAlignment = gl.getParameter(gl.PACK_ALIGNMENT) as number;
    gl.activeTexture(gl.TEXTURE0);
    const previousTexture0 = gl.getParameter(gl.TEXTURE_BINDING_2D) as WebGLTexture | null;
    gl.activeTexture(gl.TEXTURE1);
    const previousTexture1 = gl.getParameter(gl.TEXTURE_BINDING_2D) as WebGLTexture | null;
    gl.activeTexture(previousActiveTexture);

    let captureTexture: WebGLTexture | null = null;
    let captureFramebuffer: WebGLFramebuffer | null = null;
    let pixels: Uint8Array | null = null;
    try {
      captureTexture = gl.createTexture();
      captureFramebuffer = gl.createFramebuffer();
      if (!captureTexture || !captureFramebuffer) {
        throw new Error("Camera capture could not allocate its WebGL target.");
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, captureTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA8,
        CAMERA_CAPTURE_WIDTH,
        CAMERA_CAPTURE_HEIGHT,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, captureFramebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        captureTexture,
        0,
      );
      const framebufferStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (framebufferStatus !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error(`Camera capture framebuffer is incomplete (0x${framebufferStatus.toString(16)}).`);
      }

      gl.bindVertexArray(vertexArray);
      gl.viewport(0, 0, CAMERA_CAPTURE_WIDTH, CAMERA_CAPTURE_HEIGHT);
      gl.disable(gl.SCISSOR_TEST);
      gl.disable(gl.BLEND);
      const captureOffset = {
        x: framing.sharedScene.swayOffset.x + framing.effectiveLookOffset.x,
        y: framing.sharedScene.swayOffset.y + framing.effectiveLookOffset.y,
      };
      uploadScene(
        CAMERA_CAPTURE_WIDTH,
        CAMERA_CAPTURE_HEIGHT,
        framing.sharedScene.timeSeconds,
        captureOffset,
        framing.sharedScene.zoom,
        framing.sharedScene.luminance,
        framing.sharedScene.color,
        framing.sharedScene.ring,
        CAMERA_CAPTURE_GRAIN_SCALE,
      );
      drawLayer(CAMERA_TREATMENT, framing.sharedScene.grainSeed);

      pixels = new Uint8Array(CAMERA_CAPTURE_WIDTH * CAMERA_CAPTURE_HEIGHT * 4);
      gl.readPixels(
        0,
        0,
        CAMERA_CAPTURE_WIDTH,
        CAMERA_CAPTURE_HEIGHT,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels,
      );
      const readError = gl.getError();
      if (readError !== gl.NO_ERROR) {
        throw new Error(`Camera capture readPixels failed (0x${readError.toString(16)}).`);
      }
    } finally {
      if (captureFramebuffer) gl.deleteFramebuffer(captureFramebuffer);
      if (captureTexture) gl.deleteTexture(captureTexture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, previousFramebuffer);
      gl.viewport(previousViewport[0], previousViewport[1], previousViewport[2], previousViewport[3]);
      gl.scissor(previousScissorBox[0], previousScissorBox[1], previousScissorBox[2], previousScissorBox[3]);
      if (previousScissorEnabled) gl.enable(gl.SCISSOR_TEST);
      else gl.disable(gl.SCISSOR_TEST);
      if (previousBlendEnabled) gl.enable(gl.BLEND);
      else gl.disable(gl.BLEND);
      uploadScene(
        canvas.width,
        canvas.height,
        framing.sharedScene.timeSeconds,
        {
          x: framing.sharedScene.swayOffset.x + framing.effectiveLookOffset.x,
          y: framing.sharedScene.swayOffset.y + framing.effectiveLookOffset.y,
        },
        framing.sharedScene.zoom,
        framing.sharedScene.luminance,
        framing.sharedScene.color,
        framing.sharedScene.ring,
        Math.min(window.devicePixelRatio || 1, 2) * 1.25,
      );
      uploadTreatment(CAMERA_TREATMENT, framing.sharedScene.grainSeed);
      gl.useProgram(previousProgram);
      gl.bindVertexArray(previousVertexArray);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, previousTexture0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, previousTexture1);
      gl.activeTexture(previousActiveTexture);
      gl.pixelStorei(gl.PACK_ALIGNMENT, previousPackAlignment);
    }

    if (!pixels) throw new Error("Camera capture produced no pixel buffer.");
    const encoding = encodeJpeg(pixels, CAMERA_CAPTURE_WIDTH, CAMERA_CAPTURE_HEIGHT);
    pixels = null;
    const blob = await encoding;
    if (blob.type !== CAMERA_CAPTURE_MIME_TYPE || blob.size <= 0) {
      throw new Error(`Camera capture encoded an invalid JPEG (${blob.type || "unknown type"}, ${blob.size} bytes).`);
    }
    return Object.freeze({ snapshot, blob });
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
      lastPresentedCameraFrame = null;
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
    captureCameraStill,
    dispose() {
      disposed = true;
      cameraViewfinder = null;
      cameraPresentation = null;
      cameraLookClampHandler = null;
      lastPresentedCameraFrame = null;
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
