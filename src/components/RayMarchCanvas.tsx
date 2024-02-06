import useScene from "@/contexts/scene";
import { FragmentSrc } from "@/shaders/fragment";
import { VertexSrc } from "@/shaders/vertex";
import * as webgl from "@/utils/webgl";
import { ElementRef, MouseEventHandler, useEffect, useRef } from "react";

const positions = [-1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1];

let gl: WebGL2RenderingContext | null;
let canvasTopLeftLoc = { x: 0, y: 0 };
let isMouseDown: boolean = false;
let mousePosition = { x: 0, y: 0 };
let mousePositionUniformLocation: WebGLUniformLocation | null = null;
let lookFromUniformLocation: WebGLUniformLocation | null = null;
let lookAtUniformLocation: WebGLUniformLocation | null = null;
let directLightUniformLocation: WebGLUniformLocation | null = null;

export default function RayMarchCanvas() {
  const canvasRef = useRef<ElementRef<"canvas">>(null);
  const { scene } = useScene();

  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    canvasTopLeftLoc = { x: rect.left, y: rect.bottom };

    gl = canvasRef.current.getContext("webgl2");
    if (!gl) return;

    const vertexShader = webgl.createShader(gl, gl.VERTEX_SHADER, VertexSrc);
    const fragmentShader = webgl.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      FragmentSrc
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
    mousePositionUniformLocation = gl.getUniformLocation(program, "u_mouse");
    lookFromUniformLocation = gl.getUniformLocation(program, "u_lookFrom");
    lookAtUniformLocation = gl.getUniformLocation(program, "u_lookAt");
    directLightUniformLocation = gl.getUniformLocation(
      program,
      "u_directLight"
    );

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.canvas.width = rect.width - 10;
    gl.canvas.height = rect.height - 10;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(lookFromUniformLocation, ...scene.camera.lookFrom);
    gl.uniform3f(lookAtUniformLocation, ...scene.camera.lookAt);
    gl.uniform3f(directLightUniformLocation, ...scene.directLight);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    const animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [canvasRef.current]);

  useEffect(() => {
    if (!gl) return;

    gl.uniform3f(lookFromUniformLocation, ...scene.camera.lookFrom);
    gl.uniform3f(lookAtUniformLocation, ...scene.camera.lookAt);
  }, [scene.camera]);

  useEffect(() => {
    if (!gl) return;

    gl.uniform3f(directLightUniformLocation, ...scene.directLight);
  }, [scene.directLight]);

  const handlMouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
    isMouseDown = true;
    mousePosition = {
      x: e.clientX - canvasTopLeftLoc.x,
      y: canvasTopLeftLoc.y - e.clientY,
    };
  };
  const handlMouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (isMouseDown) {
      mousePosition = {
        x: e.clientX - canvasTopLeftLoc.x,
        y: canvasTopLeftLoc.y - e.clientY,
      };
    }
  };
  const handlMouseUp: MouseEventHandler<HTMLCanvasElement> = (e) => {
    isMouseDown = false;
  };

  const renderLoop: FrameRequestCallback = (timeStamp) => {
    if (gl) {
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      gl.uniform3f(
        mousePositionUniformLocation,
        mousePosition.x,
        mousePosition.y,
        isMouseDown ? 1 : 0
      );
    }

    window.requestAnimationFrame(renderLoop);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handlMouseDown}
      onMouseMove={handlMouseMove}
      onMouseUp={handlMouseUp}
      className="self-stretch flex-1 border border-zinc-800 rounded-md"
    />
  );
}
