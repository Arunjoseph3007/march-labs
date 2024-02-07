import useScene from "@/contexts/scene";
import CameraEditor from "./CameraEditor";
import DirectLightEditor from "./DirectLightEditor";

export default function ElementEditor() {
  const { selectedEntityType } = useScene();

  return (
    <div className="self-stretch w-72 rounded-md p-3 border border-zinc-800">
      <h2 className="text-xl font-semibold">Editor</h2>
      <hr />

      {selectedEntityType == "CAMERA" && <CameraEditor />}
      {selectedEntityType == "DIRECT_LIGHT" && <DirectLightEditor />}
    </div>
  );
}
