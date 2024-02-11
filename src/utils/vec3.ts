import { IVec3 } from "@/types/vec";

export const vec3ToHex = (vec: IVec3): string => {
  return (
    "#" +
    vec
      .map((no) => {
        let str = no.toString(16);
        if (str.length < 2) str = "0" + str;
        return str;
      })
      .join("")
  );
};

export const hexToVec3 = (str: string): IVec3 => {
  if (str.length != 7) throw "Length must be 7";

  const r = parseInt(str.slice(1, 3), 16);
  const g = parseInt(str.slice(3, 5), 16);
  const b = parseInt(str.slice(5, 7), 16);

  return [r, g, b];
};
