import useScene from "@/contexts/scene";
import ColorEditor from "./common/ColorEditor";

export default function MaterialEditor() {
  const { scene, selectedEntityId, setMaterialColor } = useScene();

  return (
    <div className="mt-2 p-3 rounded-md bg-zinc-950">
      <h3 className="font-semibold">Material Editor</h3>
      <ColorEditor
        label="Color"
        value={scene.materials[selectedEntityId!].color}
        onChange={setMaterialColor}
      />
    </div>
  );
}
