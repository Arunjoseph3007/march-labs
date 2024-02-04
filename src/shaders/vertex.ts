export const VertexSrc = `#version 300 es
in vec4 a_position;
out vec2 pos;

void main() {
  gl_Position = a_position;
  pos = gl_Position.xy;
}
`;

