import { ICamera } from "./camera";
import { ICircle } from "./shapes/circle";
import { IVec3 } from "./vec";

export type IScene = {
  camera: ICamera;
  directLight: IVec3;
  // Shapes
  circles: ICircle[];
};
