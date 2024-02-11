import useScene from "@/contexts/scene";
import CameraEditor from "./CameraEditor";
import DirectLightEditor from "./DirectLightEditor";
import CircleEditor from "./CircleEditor";
import MaterialEditor from "./MaterialEditor";

export default function ElementEditor() {
  const { selectedEntityType } = useScene();

  return (
    <div className="self-stretch flex-1 rounded-md p-3 border border-zinc-800">
      <h2 className="text-xl font-semibold">Editor</h2>
      <hr />

      {selectedEntityType == "CAMERA" && <CameraEditor />}
      {selectedEntityType == "DIRECT_LIGHT" && <DirectLightEditor />}
      {selectedEntityType == "CIRCLE" && <CircleEditor />}
      {selectedEntityType == "MATERIAL" && <MaterialEditor />}
    </div>
  );
}
