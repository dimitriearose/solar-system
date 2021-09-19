precision mediump float;

uniform sampler2D uRingTexture;
uniform float innerRadius;
uniform float outerRadius;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

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