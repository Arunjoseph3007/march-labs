import useScene from "@/contexts/scene";
import Vec3Editor from "./common/Vec3Editor";
import FloatEditor from "./common/FloatEditor";

export default function CircleEditor() {
  const { setCircleCenter, setCircleRadius, scene, selectedShapeId } =
    useScene();

  return (
    <div className="mt-2 p-3 rounded-md bg-zinc-950">
      <h3 className="font-semibold">Circle Editor</h3>
      <Vec3Editor
        label="Circle Center"
        onChange={setCircleCenter}
        value={scene.circles[selectedShapeId!].center}
      />
      <FloatEditor
        label="Circle radius"
        value={scene.circles[selectedShapeId!].radius}
        onChange={setCircleRadius}
        min={0}
        max={20}
      />
    </div>
  );
}
