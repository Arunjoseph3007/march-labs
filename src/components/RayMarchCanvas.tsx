import useScene from "@/contexts/scene";
import { FragmentSrc } from "@/shaders/fragment";
import { VertexSrc } from "@/shaders/vertex";
import * as webgl from "@/utils/webgl";
import { ElementRef, MouseEventHandler, useEffect, useRef } from "react";

const positions = [-1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1];

export default function RayMarchCanvas() {
  const canvasRef = useRef<ElementRef<"canvas">>(null);
  const { scene, vars, uniforms } = useScene();

  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    vars.canvasTopLeftLoc = { x: rect.left, y: rect.bottom };

    vars.gl = canvasRef.current.getContext("webgl2");
    if (!vars.gl) return;

    const vertexShader = webgl.createShader(
      vars.gl,
      vars.gl.VERTEX_SHADER,
      VertexSrc
    );
    const fragmentShader = webgl.createShader(
      vars.gl,
      vars.gl.FRAGMENT_SHADER,
      FragmentSrc
    );

    if (!fragmentShader || !vertexShader) return;

    vars.program = webgl.createProgram(vars.gl, vertexShader, fragmentShader);

    if (!vars.program) return;

    console.log("Compilation succesful");

    const positionAttributeLocation = vars.gl.getAttribLocation(
      vars.program,
      "a_position"
    );
    const resolutionUniformLocation = vars.gl.getUniformLocation(
      vars.program,
      "u_resolution"
    );
    uniforms.mousePositionUniformLocation = vars.gl.getUniformLocation(
      vars.program,
      "u_mouse"
    );
    uniforms.lookFromUniformLocation = vars.gl.getUniformLocation(
      vars.program,
      "u_lookFrom"
    );
    uniforms.lookAtUniformLocation = vars.gl.getUniformLocation(
      vars.program,
      "u_lookAt"
    );
    uniforms.directLightUniformLocation = vars.gl.getUniformLocation(
      vars.program,
      "u_directLight"
    );

    const positionBuffer = vars.gl.createBuffer();
    vars.gl.bindBuffer(vars.gl.ARRAY_BUFFER, positionBuffer);
    vars.gl.bufferData(
      vars.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      vars.gl.STATIC_DRAW
    );

    const vao = vars.gl.createVertexArray();
    vars.gl.bindVertexArray(vao);
    vars.gl.enableVertexAttribArray(positionAttributeLocation);
    vars.gl.vertexAttribPointer(
      positionAttributeLocation,
      2,
      vars.gl.FLOAT,
      false,
      0,
      0
    );

    vars.gl.canvas.width = rect.width - 10;
    vars.gl.canvas.height = rect.height - 10;

    vars.gl.viewport(0, 0, vars.gl.canvas.width, vars.gl.canvas.height);
    vars.gl.clearColor(0, 0, 0, 0);
    vars.gl.clear(vars.gl.COLOR_BUFFER_BIT);
    vars.gl.useProgram(vars.program);
    vars.gl.uniform2f(
      resolutionUniformLocation,
      vars.gl.canvas.width,
      vars.gl.canvas.height
    );
    vars.gl.uniform3f(
      uniforms.lookFromUniformLocation,
      ...scene.camera.lookFrom
    );
    vars.gl.uniform3f(uniforms.lookAtUniformLocation, ...scene.camera.lookAt);
    vars.gl.uniform3f(
      uniforms.directLightUniformLocation,
      ...scene.directLight
    );

    scene.circles.forEach((circle, i) => {
      if (!vars.gl || !vars.program) return;

      vars.gl.uniform3f(
        vars.gl.getUniformLocation(vars.program, `u_circles[${i}].center`),
        ...circle.center
      );
      vars.gl.uniform1f(
        vars.gl.getUniformLocation(vars.program, `u_circles[${i}].radius`),
        circle.radius
      );
    });

    vars.gl.drawArrays(vars.gl.TRIANGLES, 0, 6);

    const animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [canvasRef.current]);

  const handlMouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
    vars.isMouseDown = true;
    vars.mousePosition = {
      x: e.clientX - vars.canvasTopLeftLoc.x,
      y: vars.canvasTopLeftLoc.y - e.clientY,
    };
  };
  const handlMouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (vars.isMouseDown) {
      vars.mousePosition = {
        x: e.clientX - vars.canvasTopLeftLoc.x,
        y: vars.canvasTopLeftLoc.y - e.clientY,
      };
    }
  };
  const handlMouseUp: MouseEventHandler<HTMLCanvasElement> = (e) => {
    vars.isMouseDown = false;
  };

  const renderLoop: FrameRequestCallback = (timeStamp) => {
    if (vars.gl && false) {
      vars.gl.drawArrays(vars.gl.TRIANGLES, 0, 6);

      vars.gl.uniform3f(
        uniforms.mousePositionUniformLocation,
        vars.mousePosition.x,
        vars.mousePosition.y,
        vars.isMouseDown ? 1 : 0
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
      className="self-stretc flex-1 border border-zinc-800 rounded-md"
    />
  );
}
