export const AMBIENT_WORLD_VERTEX_SHADER = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const AMBIENT_WORLD_BRIGHT_PASS_SHADER = `#version 300 es
precision highp float;
uniform sampler2D uSrc;
uniform float uThreshold;
uniform float uKnee;
in vec2 vUv;
out vec4 frag;
void main() {
  vec3 c = texture(uSrc, vUv).rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float w = smoothstep(uThreshold - uKnee, uThreshold + uKnee, l);
  frag = vec4(c * w, 1.0);
}`;

export const AMBIENT_WORLD_FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uBloomTex;
uniform vec2 uResolution;
uniform vec2 uTexResolution;
uniform float uTime;
uniform vec2 uSceneOffset;
uniform float uSceneZoom;
uniform float uSceneLuma;
uniform float uSceneColor;
uniform float uSceneRing;
uniform float uBlur;
uniform float uNoiseAmount;
uniform float uLuminanceDrift;
uniform float uColorDrift;
uniform float uBloomAmount;
uniform float uExposure;
uniform float uOpacity;
uniform float uMaxLod;
uniform float uBloomLod;
uniform float uGrainScale;
uniform float uGrainRate;
uniform float uGrainSeed;

out vec4 frag;

const float PI = 3.14159265;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 coverUV(vec2 uv) {
  float ca = uResolution.x / uResolution.y;
  float ia = uTexResolution.x / uTexResolution.y;
  vec2 s = (ca > ia) ? vec2(1.0, ia / ca) : vec2(ca / ia, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float t = uTime;
  vec2 uv = coverUV(gl_FragCoord.xy / uResolution);
  uv = (uv - 0.5) / uSceneZoom + 0.5 + uSceneOffset;
  uv = (uv - 0.5) * 0.994 + 0.5;

  float lod = uBlur * uMaxLod;
  vec3 col;
  if (uBlur > 0.02) {
    float r = (exp2(lod) * 0.85) / uTexResolution.y;
    vec3 acc = vec3(0.0);
    for (int i = 0; i < 6; i++) {
      float a = uSceneRing + float(i) * (PI / 3.0);
      acc += textureLod(uTexture, uv + vec2(cos(a), sin(a)) * r, lod).rgb;
    }
    col = mix(textureLod(uTexture, uv, lod).rgb, acc / 6.0, 0.72);
  } else {
    col = texture(uTexture, uv).rgb;
  }

  if (uBloomAmount > 0.0005) {
    vec3 wide = textureLod(uBloomTex, uv, uBloomLod).rgb;
    vec3 tight = textureLod(uBloomTex, uv, uBloomLod - 2.0).rgb;
    col += (wide * 0.62 + tight * 0.38) * uBloomAmount;
  }

  col *= uExposure * (1.0 + uSceneLuma * uLuminanceDrift);
  float w = uSceneColor * uColorDrift;
  col *= vec3(1.0 + w, 1.0 + w * 0.12, 1.0 - w);

  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float amp = uNoiseAmount * mix(1.0, 0.22, smoothstep(0.03, 0.45, luma));
  vec2 cell = floor(gl_FragCoord.xy / uGrainScale) + uGrainSeed;
  float tq = mod(floor(t * uGrainRate), 1024.0);
  vec3 n = vec3(
    hash21(cell + tq * 17.13),
    hash21(cell + tq * 17.13 + 31.7),
    hash21(cell + tq * 17.13 + 71.3)
  ) - 0.5;
  n = mix(vec3(n.r), n, 0.35);
  col += n * amp;

  frag = vec4(max(col, 0.0), uOpacity);
}`;
