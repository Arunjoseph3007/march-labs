import type { IScene } from "@/types/scene";
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

type ISceneContext = {
  scene: IScene;
  // Webgl Stuff
  uniforms: {
    mousePositionUniformLocation: WebGLUniformLocation | null;
    lookFromUniformLocation: WebGLUniformLocation | null;
    lookAtUniformLocation: WebGLUniformLocation | null;
    directLightUniformLocation: WebGLUniformLocation | null;
  };
  vars: {
    gl: WebGL2RenderingContext | null;
    canvasTopLeftLoc: { x: number; y: number };
    isMouseDown: boolean;
    mousePosition: { x: number; y: number };
  };
  // Camera controll
  setLookFrom: (org: IVec3) => void;
  setLookAt: (p: IVec3) => void;
  setFOV: (f: number) => void;
  setAngle: (a: number) => void;
  // Direct Light Contoll
  setDirectLight: (pos: IVec3) => void;
  // Editor Control
  selectedEntityType: IEntityType | undefined;
  selectEntity: (type: IEntityType) => void;
};

type IEntityType = "CAMERA" | "DIRECT_LIGHT";

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
    setScene((sc) => {
      sc.camera.lookFrom = org;
    });
  };

  const setLookAt = (p: IVec3) => {
    setScene((sc) => {
      sc.camera.lookAt = p;
    });
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
    setScene((sc) => {
      sc.directLight = pos;
    });
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
