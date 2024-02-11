import { ICamera } from "./camera";
import { IMaterial } from "./material";
import { ICircle } from "./shapes/circle";
import { IVec3 } from "./vec";

export type IScene = {
  camera: ICamera;
  directLight: IVec3;
  materials: IMaterial[];
  // Shapes
  circles: ICircle[];
};
