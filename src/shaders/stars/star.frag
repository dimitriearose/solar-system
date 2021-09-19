precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 10.0);

  vec3 color = mix(vec3(0.0), vec3(1.0, 1.0, 1.0), strength);
  gl_FragColor = vec4(color, 1.0);
}