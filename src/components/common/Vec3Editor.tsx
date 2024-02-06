import { MinusIcon } from "@/icons/minus";
import { PlusIcon } from "@/icons/plus";
import { IVec3 } from "@/types/vec";

type IVec3Editor = {
  label: string;
  value: IVec3;
  onChange: (v: IVec3) => void;
};

export default function Vec3Editor({ label, onChange, value }: IVec3Editor) {
  return (
    <div>
      <p>{label}</p>
      <div>
        {([0, 1, 2] as const).map((idx) => (
          <div className="flex gap-2 items-center my-1" key={idx}>
            <button
              onClick={() => {
                const newVal: IVec3 = [...value];
                newVal[idx] -= 0.1;
                onChange(newVal);
              }}
              className="bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all"
            >
              <MinusIcon />
            </button>
            <input
              type="range"
              value={value[idx]}
              onChange={(e) => {
                const newVal: IVec3 = [...value];
                newVal[idx] = +e.target.value;
                onChange(newVal);
              }}
              min={-10}
              max={10}
              step={0.1}
            />
            <button
              onClick={() => {
                const newVal: IVec3 = [...value];
                newVal[idx] += 0.1;
                onChange(newVal);
              }}
              className="bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all"
            >
              <PlusIcon />
            </button>
            <span className="text-right">{value[idx].toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
