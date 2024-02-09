import type { IScene } from "@/types/scene";
import type { IEntityType, ISceneContext } from "@/types/sceneContext";
import { ICircle } from "@/types/shapes/circle";
import type { IVec3 } from "@/types/vec";
import { ReactNode, createContext, useContext, useState } from "react";
import { useImmer } from "use-immer";

const vars: ISceneContext["vars"] = {
  gl: null,
  canvasTopLeftLoc: { x: 0, y: 0 },
  isMouseDown: false,
  mousePosition: { x: 0, y: 0 },
  program: null,
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
    circles: [
      { center: [0, 0, 0], radius: 2 },
      { center: [6.2, 2.2, 2.2], radius: 0.8 },
    ],
  });
  const [selectedEntityType, setSelectedEntityType] = useState<IEntityType>();
  const [selectedShapeId, setSelectedShapeId] = useState<number>();

  const selectEntity = (type: IEntityType) => {
    setSelectedEntityType(type);
  };

  const addCircle = () => {
    if (!vars.gl || !vars.program) return;

    const newCircle: ICircle = { center: [1, 0, 0], radius: 2 };

    vars.gl.uniform3f(
      vars.gl.getUniformLocation(
        vars.program,
        `u_circles[${scene.circles.length}].center`
      ),
      ...newCircle.center
    );
    vars.gl.uniform1f(
      vars.gl.getUniformLocation(
        vars.program,
        `u_circles[${scene.circles.length}].radius`
      ),
      newCircle.radius
    );

    setScene((sc) => {
      sc.circles.push(newCircle);
    });
  };

  const selectCircle = (idx: number) => {
    setSelectedEntityType("CIRCLE");
    setSelectedShapeId(idx);
  };

  const setCircleCenter = (center: IVec3) => {
    if (!vars.gl || !vars.program || selectedShapeId == undefined) return;

    setScene((sc) => {
      sc.circles[selectedShapeId].center = center;
    });

    vars.gl.uniform3f(
      vars.gl.getUniformLocation(
        vars.program,
        `u_circles[${selectedShapeId}].center`
      ),
      ...center
    );
  };

  const setCircleRadius = (radius: number) => {
    if (!vars.gl || !vars.program || selectedShapeId == undefined) return;

    setScene((sc) => {
      sc.circles[selectedShapeId].radius = radius;
    });

    vars.gl.uniform1f(
      vars.gl.getUniformLocation(
        vars.program,
        `u_circles[${selectedShapeId}].radius`
      ),
      radius
    );
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
        selectCircle,
        setCircleCenter,
        selectedShapeId,
        setCircleRadius,
        addCircle,
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
