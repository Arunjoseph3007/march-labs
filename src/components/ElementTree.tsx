import useScene from "@/contexts/scene";
import { BulbIcon } from "@/icons/bulb";
import { CameraIcon } from "@/icons/camera";
import { CircleIcon } from "@/icons/circle";

export default function ElementTree() {
  const { selectEntity, scene, selectCircle } = useScene();

  return (
    <div className="self-stretch w-72 rounded-md p-3 border border-zinc-800">
      <h2 className="text-xl font-semibold">Element Tree</h2>
      <hr />

      {/* LIST */}
      <div className="flex flex-col gap-2 mt-2">
        {/* Camera */}
        <div
          onClick={() => selectEntity("CAMERA")}
          className="flex items-center gap-4 p-3 rounded-md bg-zinc-950 hover:bg-zinc-900 transition-all font-semibold cursor-pointer"
        >
          <CameraIcon />
          <p>Camera</p>
        </div>

        {/* Direct Light */}
        <div
          onClick={() => selectEntity("DIRECT_LIGHT")}
          className="flex items-center gap-4 p-3 rounded-md bg-zinc-950 hover:bg-zinc-900 transition-all font-semibold cursor-pointer"
        >
          <BulbIcon />
          <p>Direct Light</p>
        </div>

        {/* Shapes */}
        {scene.circles.map((_, i) => (
          <div
            key={i}
            onClick={() => selectCircle(i)}
            className="flex items-center gap-4 p-3 rounded-md bg-zinc-950 hover:bg-zinc-900 transition-all font-semibold cursor-pointer"
          >
            <CircleIcon />
            <p>Circle</p>
          </div>
        ))}
      </div>
    </div>
  );
}
