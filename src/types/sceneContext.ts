import { IScene } from "./scene";
import { IVec3 } from "./vec";

export type IEntityType = "CAMERA" | "DIRECT_LIGHT" | "CIRCLE" | "MATERIAL";

export type ISceneVars = {
  gl: WebGL2RenderingContext | null;
  program: WebGLProgram | null;
  canvasTopLeftLoc: { x: number; y: number };
  isMouseDown: boolean;
  mousePosition: { x: number; y: number };
};

export type ISceneUniforms = {
  mousePositionUniformLocation: WebGLUniformLocation | null;
  lookFromUniformLocation: WebGLUniformLocation | null;
  lookAtUniformLocation: WebGLUniformLocation | null;
  directLightUniformLocation: WebGLUniformLocation | null;
};

export type ISceneContext = {
  scene: IScene;
  // Webgl Stuff
  uniforms: ISceneUniforms;
  vars: ISceneVars;
  // Camera controll
  setLookFrom: (org: IVec3) => void;
  setLookAt: (p: IVec3) => void;
  setFOV: (f: number) => void;
  setAngle: (a: number) => void;
  // Direct Light Contoll
  setDirectLight: (pos: IVec3) => void;
  // Editor Control
  selectedEntityType: IEntityType | undefined;
  selectedEntityId: number | undefined;
  selectEntity: (type: IEntityType) => void;
  // Circle Controll
  addCircle: () => void;
  selectCircle: (idx: number) => void;
  setCircleCenter: (center: IVec3) => void;
  setCircleRadius: (radius: number) => void;
  setCircleMaterial: (materialId: number) => void;
  // Material control
  selectMaterial: (idx: number) => void;
  addMaterial: () => void;
  setMaterialColor: (color: IVec3) => void;
  setMaterialBumpSize: (bumpSize: number) => void;
};
