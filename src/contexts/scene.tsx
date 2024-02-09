import type { IScene } from "@/types/scene";
import type { IEntityType, ISceneContext } from "@/types/sceneContext";
import type { IVec3 } from "@/types/vec";
import { ReactNode, createContext, useContext, useState } from "react";
import { useImmer } from "use-immer";

const vars: ISceneContext["vars"] = {
  gl: null,
  canvasTopLeftLoc: { x: 0, y: 0 },
  isMouseDown: false,
  mousePosition: { x: 0, y: 0 },
};
const uniforms: ISceneContext["uniforms"] = {
  mousePositionUniformLocation: null,
  lookFromUniformLocation: null,
  lookAtUniformLocation: null,
  directLightUniformLocation: null,
};

const SceneContext = createContext<ISceneContext>({} as any);

export function SceneContextProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useImmer<IScene>({
    camera: {
      angle: 0,
      fov: 1,
      lookAt: [0, 0, 0],
      lookFrom: [0, 3, -5],
    },
    directLight: [4, 4, 4],
  });
  const [selectedEntityType, setSelectedEntityType] = useState<IEntityType>();

  const selectEntity = (type: IEntityType) => {
    setSelectedEntityType(type);
  };

  const setLookFrom = (org: IVec3) => {
    if (!vars.gl) return;

    setScene((sc) => {
      sc.camera.lookFrom = org;
    });
    vars.gl.uniform3f(
      uniforms.lookFromUniformLocation,
      ...scene.camera.lookFrom
    );
  };

  const setLookAt = (p: IVec3) => {
    if (!vars.gl) return;

    setScene((sc) => {
      sc.camera.lookAt = p;
    });
    vars.gl.uniform3f(uniforms.lookAtUniformLocation, ...scene.camera.lookAt);
  };

  const setFOV = (f: number) => {
    setScene((sc) => {
      sc.camera.fov = f;
    });
  };

  const setAngle = (a: number) => {
    setScene((sc) => {
      sc.camera.angle = a;
    });
  };

  const setDirectLight = (pos: IVec3) => {
    if (!vars.gl) return;

    setScene((sc) => {
      sc.directLight = pos;
    });
    vars.gl.uniform3f(
      uniforms.directLightUniformLocation,
      ...scene.directLight
    );
  };

  return (
    <SceneContext.Provider
      value={{
        scene,
        setAngle,
        setFOV,
        setLookAt,
        setLookFrom,
        selectedEntityType,
        selectEntity,
        setDirectLight,
        vars,
        uniforms,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export default function useScene() {
  const scene = useContext(SceneContext);

  if (!scene) {
    throw new Error(`useScene must be used inside <SceneContextProvider>`);
  }

  return scene;
}
