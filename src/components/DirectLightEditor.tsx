import useScene from "@/contexts/scene";
import Vec3Editor from "./common/Vec3Editor";

export default function DirectLightEditor() {
  const { scene, setDirectLight } = useScene();
  
  return (
    <div className="mt-2 p-3 rounded-md bg-zinc-950">
      <h3 className="font-semibold">Direct Light Editor</h3>
      <Vec3Editor
        label="Light Origin"
        onChange={setDirectLight}
        value={scene.directLight}
      />
    </div>
  );
}
