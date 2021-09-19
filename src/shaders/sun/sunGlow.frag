precision mediump float;

uniform vec3 sunGlowColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vertexNormal;

void main() {
  float intensity = pow(0.75 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
  gl_FragColor = vec4(sunGlowColor, 0.1) * intensity;
}