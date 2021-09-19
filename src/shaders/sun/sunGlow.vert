uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

varying vec3 vertexNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;
  vertexNormal = normalize(normalMatrix * normal);

  gl_Position =
      projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}