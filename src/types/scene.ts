import { ICamera } from "./camera";
import { IVec3 } from "./vec";

export type IScene = {
  camera: ICamera;
  directLight: IVec3;
};
