import useScene from "@/contexts/scene";
import Vec3Editor from "./common/Vec3Editor";

export default function CameraEditor() {
  const { scene, setAngle, setFOV, setLookAt, setLookFrom } = useScene();

  return (
    <div className="mt-2 p-3 rounded-md bg-zinc-950">
      <h3 className="font-semibold">Camera Editor</h3>
      <Vec3Editor
        label="Look From"
        onChange={setLookFrom}
        value={scene.camera.lookFrom}
      />
      <Vec3Editor
        label="Look At"
        onChange={setLookAt}
        value={scene.camera.lookAt}
      />
    </div>
  );
}
