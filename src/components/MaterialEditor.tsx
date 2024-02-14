import useScene from "@/contexts/scene";
import ColorEditor from "./common/ColorEditor";
import FloatEditor from "./common/FloatEditor";

export default function MaterialEditor() {
  const { scene, selectedEntityId, setMaterialColor, setMaterialBumpSize } =
    useScene();

  return (
    <div className="mt-2 p-3 rounded-md bg-zinc-950">
      <h3 className="font-semibold">Material Editor</h3>
      <ColorEditor
        label="Color"
        value={scene.materials[selectedEntityId!].color}
        onChange={setMaterialColor}
      />
      <FloatEditor
        label="Bump Size"
        value={scene.materials[selectedEntityId!].bumpSize}
        onChange={setMaterialBumpSize}
        min={0}
        max={0.5}
        step={0.02}
      />
    </div>
  );
}
