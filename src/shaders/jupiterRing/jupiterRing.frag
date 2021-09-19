precision mediump float;

uniform sampler2D uRingTexture;
uniform float innerRadius;
uniform float outerRadius;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec4 color() {
  vec2 uv = vec2(0);
  uv.x = (length(vPosition) - innerRadius) / (outerRadius - innerRadius);
  if (uv.x < 0.0 || uv.x > 1.0) {
    discard;
  }
  vec4 pixel = texture2D(uRingTexture, uv);
  return pixel;
}

void main() {
  vec4 ring = texture2D(uRingTexture, vUv);
  gl_FragColor = color();
}