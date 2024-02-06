import { IVec3 } from "./vec";

export type ICamera = {
  lookFrom: IVec3;
  lookAt: IVec3;
  fov: number;
  angle: number;
};
