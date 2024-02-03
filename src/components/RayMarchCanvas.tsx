import * as webgl from "@/utils/webgl";
import { ElementRef, useEffect, useRef } from "react";

const vertexSrc = `#version 300 es
in vec4 a_position;
out vec2 pos;
uniform vec2 u_resolution;

void main() {
  gl_Position = a_position;
  pos = (gl_Position.xy*0.5)*u_resolution;
}
`;

const fragmentSrc = `#version 300 es
precision highp float;
in vec2 pos;
out vec4 outColor;

void main(){
    outColor = vec4(pos.x,pos.y,0,1);
}
`;
const positions = [-1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1];

export default function RayMarchCanvas() {
  const canvasRef = useRef<ElementRef<"canvas">>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const gl = canvasRef.current.getContext("webgl2");
    if (!gl) return;

    const { width, height } = canvasRef.current.getBoundingClientRect();
    const vertexShader = webgl.createShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = webgl.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentSrc
    );

    if (!fragmentShader || !vertexShader) return;

    const program = webgl.createProgram(gl, vertexShader, fragmentShader);

    if (!program) return;

    console.log("Compilation succesful");

    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    const resolutionUniformLocation = gl.getUniformLocation(
      program,
      "u_resolution"
    );

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // gl.canvas.width = width;
    // gl.canvas.height = height;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [canvasRef.current]);

  return (
    <canvas
      ref={canvasRef}
      className="self-stretch flex-1 border border-zinc-800 rounded-md"
    />
  );
}
