import { ChevronDownIcon } from "@/icons/chevronDown";
import { MinusIcon } from "@/icons/minus";
import { PlusIcon } from "@/icons/plus";
import { useState } from "react";

type FloatEditor = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  max?: number;
  min?: number;
};

export default function FloatEditor({
  label,
  onChange,
  value,
  step = 0.1,
  max = 10,
  min = -10,
}: FloatEditor) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="my-3">
      <div className="flex items-center gap-1">
        <p>{label}</p>
        <span className="flex-1 text-right text-xs text-zinc-400">
          {collapsed ? value.toFixed(1) : ""}
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
          <div className="flex gap-2 items-center my-1">
            <button
              onClick={() => {
                onChange(value - step);
              }}
              className="text-zinc-700 rounded-full hover:text-zinc-500 transition-all"
              disabled={value - step < min}
            >
              <MinusIcon />
            </button>
            <input
              type="range"
              className="appearance-none cursor-pointer h-[3px] rounded-full bg-zinc-400 accent-zinc-200"
              value={value}
              onChange={(e) => {
                onChange(+e.target.value);
              }}
              min={min}
              max={max}
              step={step}
            />
            <button
              onClick={() => {
                onChange(value + step);
              }}
              className="text-zinc-700 rounded-full hover:text-zinc-500 transition-all"
              disabled={value + step > max}
            >
              <PlusIcon />
            </button>
            <span className="flex-1 text-right text-xs text-zinc-400">
              {value.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
