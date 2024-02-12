import useScene from "@/contexts/scene";
import { ChevronDownIcon } from "@/icons/chevronDown";
import { MaterialIcon } from "@/icons/material";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

type IMaterialTypeEditor = {
  value: number;
  onChange: (mi: number) => void;
};

export default function MaterialTypeEditor({
  onChange,
  value,
}: IMaterialTypeEditor) {
  const { scene } = useScene();

  return (
    <div className="my-3">
      <div className="flex items-center gap-1">
        <p>Material</p>
        <span className="flex-1 text-right text-xs text-zinc-400">{value}</span>

        <Menu as="div" className="relative inline-block text-left pl-2">
          <div>
            <Menu.Button className="inline-flex w-full justify-center items-center gap-3 rounded-md text-md font-semibold text-white hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              <button className="text-zinc-500 scale-75">
                <ChevronDownIcon />
              </button>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 ">
                {scene.materials.map((material, i) => (
                  <Menu.Item key={i}>
                    {({ active }) => (
                      <button
                        onClick={() => onChange(i)}
                        className={`${
                          active ? "bg-violet-500 text-white" : "text-gray-900"
                        } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <MaterialIcon {...material} />
                        Material {i}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
