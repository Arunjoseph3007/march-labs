import useScene from "@/contexts/scene";
import { AddIcon } from "@/icons/add";
import { CircleIcon } from "@/icons/circle";
import { MaterialIcon } from "@/icons/material";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function AddMenu() {
  const { addCircle, addMaterial } = useScene();

  return (
    <Menu as="div" className="relative inline-block text-left px-3">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-3 rounded-md bg-zinc-900 px-4 py-3 text-md font-semibold text-white hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
          <AddIcon /> <p>ADD ELEMENT</p>
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
        <Menu.Items className="absolute right-0 bottom-full mb-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => addCircle()}
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <CircleIcon />
                  Circle
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Duplicate
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => addMaterial()}
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <MaterialIcon color={[150, 150, 150]} /> Material
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Archive
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
