precision mediump float;

uniform float uTime;
uniform sampler2D uEarthClouds;
uniform sampler2D uEarthNight;
uniform sampler2D uEarthTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vec4 earthNormalTexture = texture2D(uEarthTexture, vUv);
  vec4 earthCloudsTexture = texture2D(uEarthClouds, vUv);
  gl_FragColor = earthNormalTexture;
  gl_FragColor += earthCloudsTexture;
}