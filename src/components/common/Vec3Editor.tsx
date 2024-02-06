import { ChevronDownIcon } from "@/icons/chevronDown";
import { MinusIcon } from "@/icons/minus";
import { PlusIcon } from "@/icons/plus";
import { IVec3 } from "@/types/vec";
import { useState } from "react";

type IVec3Editor = {
  label: string;
  value: IVec3;
  onChange: (v: IVec3) => void;
  step?: number;
  max?: number;
  min?: number;
};

export default function Vec3Editor({
  label,
  onChange,
  value,
  step = 0.1,
  max = 10,
  min = -10,
}: IVec3Editor) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="my-3">
      <div className="flex items-center gap-1">
        <p>{label}</p>
        <span className="flex-1 text-right text-xs text-zinc-400">
          {collapsed ? value.map((e) => e.toFixed(2)).join(", ") : ""}
        </span>
        <button
          onClick={() => setCollapsed((p) => !p)}
          className={`text-zinc-500 scale-75 transition-all ${
            !collapsed && "rotate-180"
          }`}
        >
          <ChevronDownIcon />
        </button>
      </div>
      {!collapsed && (
        <div className="mt-2 mb-4">
          {([0, 1, 2] as const).map((idx) => (
            <div className="flex gap-2 items-center my-1" key={idx}>
              <button
                onClick={() => {
                  const newVal: IVec3 = [...value];
                  newVal[idx] -= step;
                  onChange(newVal);
                }}
                className="text-zinc-700 rounded-full hover:text-zinc-500 transition-all"
                disabled={value[idx] - step < min}
              >
                <MinusIcon />
              </button>
              <input
                type="range"
                className="appearance-none cursor-pointer h-[3px] rounded-full bg-zinc-400 accent-zinc-200"
                value={value[idx]}
                onChange={(e) => {
                  const newVal: IVec3 = [...value];
                  newVal[idx] = +e.target.value;
                  onChange(newVal);
                }}
                min={min}
                max={max}
                step={step}
              />
              <button
                onClick={() => {
                  const newVal: IVec3 = [...value];
                  newVal[idx] += step;
                  onChange(newVal);
                }}
                className="text-zinc-700 rounded-full hover:text-zinc-500 transition-all"
                disabled={value[idx] + step > max}
              >
                <PlusIcon />
              </button>
              <span className="flex-1 text-right text-xs text-zinc-400">
                {value[idx].toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
