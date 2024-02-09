import { IScene } from "./scene";
import { IVec3 } from "./vec";

export type IEntityType = "CAMERA" | "DIRECT_LIGHT";

export type ISceneContext = {
  scene: IScene;
  // Webgl Stuff
  uniforms: {
    mousePositionUniformLocation: WebGLUniformLocation | null;
    lookFromUniformLocation: WebGLUniformLocation | null;
    lookAtUniformLocation: WebGLUniformLocation | null;
    directLightUniformLocation: WebGLUniformLocation | null;
  };
  vars: {
    gl: WebGL2RenderingContext | null;
    canvasTopLeftLoc: { x: number; y: number };
    isMouseDown: boolean;
    mousePosition: { x: number; y: number };
  };
  // Camera controll
  setLookFrom: (org: IVec3) => void;
  setLookAt: (p: IVec3) => void;
  setFOV: (f: number) => void;
  setAngle: (a: number) => void;
  // Direct Light Contoll
  setDirectLight: (pos: IVec3) => void;
  // Editor Control
  selectedEntityType: IEntityType | undefined;
  selectEntity: (type: IEntityType) => void;
};
