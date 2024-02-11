import { IVec3 } from "@/types/vec";
import { hexToVec3, vec3ToHex } from "@/utils/vec3";

type IColorEditor = {
  label: string;
  value: IVec3;
  onChange: (v: IVec3) => void;
};

export default function ColorEditor({ label, onChange, value }: IColorEditor) {
  return (
    <div className="my-3">
      <div className="flex items-center gap-1">
        <p className="flex-1">{label}</p>

        <label
          className="h-6 aspect-video cursor-pointer rounded hover:scale-110 transition"
          style={{ backgroundColor: `rgb(${value})` }}
          htmlFor={label}
        />
        <input
          id={label}
          type="color"
          className="w-0 h-0 self-end pointer-events-none bg-transparent"
          value={vec3ToHex(value)}
          onChange={(e) => {
            onChange(hexToVec3(e.target.value));
          }}
        />
      </div>
    </div>
  );
}
