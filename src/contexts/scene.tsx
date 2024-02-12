import type { IMaterial } from "@/types/material";
import type { IScene } from "@/types/scene";
import type { ICircle } from "@/types/shapes/circle";
import type { IVec3 } from "@/types/vec";
import type {
  IEntityType,
  ISceneContext,
  ISceneUniforms,
  ISceneVars,
} from "@/types/sceneContext";
import { ReactNode, createContext, useContext, useState } from "react";
import { useImmer } from "use-immer";

const vars: ISceneVars = {
  gl: null,
  canvasTopLeftLoc: { x: 0, y: 0 },
  isMouseDown: false,
  mousePosition: { x: 0, y: 0 },
  program: null,
};
const uniforms: ISceneUniforms = {
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
      { center: [0, 0, 0], radius: 2, materialId: 1 },
      { center: [6.2, 2.2, 2.2], radius: 0.8, materialId: 2 },
    ],
    materials: [
      { color: [227, 30, 210] },
      { color: [9, 17, 235] },
      { color: [235, 110, 52] },
    ],
  });
  const [selectedEntityType, setSelectedEntityType] = useState<IEntityType>();
  const [selectedEntityId, setSelectedEntityId] = useState<number>();

  const selectEntity = (type: IEntityType) => {
    setSelectedEntityType(type);
  };

  const selectMaterial = (idx: number) => {
    setSelectedEntityId(idx);
    setSelectedEntityType("MATERIAL");
  };

  const addMaterial = () => {
    if (!vars.gl || !vars.program) return;

    const newMaterial: IMaterial = { color: [234, 123, 12] };

    vars.gl.uniform3f(
      vars.gl.getUniformLocation(
        vars.program,
        `u_materials[${scene.materials.length}].color`
      ),
      ...newMaterial.color
    );
    // TODO
    setScene((sc) => {
      sc.materials.push(newMaterial);
    });
  };

  const setMaterialColor = (color: IVec3) => {
    if (!vars.gl || !vars.program || selectedEntityId == undefined) return;

    vars.gl.uniform3f(
      vars.gl.getUniformLocation(
        vars.program,
        `u_materials[${selectedEntityId}].color`
      ),
      ...color
    );

    setScene((sc) => {
      sc.materials[selectedEntityId].color = color;
    });
  };

  const addCircle = () => {
    if (!vars.gl || !vars.program) return;

    const newCircle: ICircle = { center: [1, 0, 0], radius: 2, materialId: 1 };

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
    vars.gl.uniform1i(
      vars.gl.getUniformLocation(
        vars.program,
        `u_circles[${scene.circles.length}].materialId`
      ),
      newCircle.materialId
    );

    setScene((sc) => {
      sc.circles.push(newCircle);
    });
  };

  const selectCircle = (idx: number) => {
    setSelectedEntityType("CIRCLE");
    setSelectedEntityId(idx);
  };

  const setCircleCenter = (center: IVec3) => {
    if (!vars.gl || !vars.program || selectedEntityId == undefined) return;

    setScene((sc) => {
      sc.circles[selectedEntityId].center = center;
    });

    vars.gl.uniform3f(
      vars.gl.getUniformLocation(
        vars.program,
        `u_circles[${selectedEntityId}].center`
      ),
      ...center
    );
  };

  const setCircleMaterial = (materialId: number) => {
    if (!vars.gl || !vars.program || selectedEntityId == undefined) return;

    setScene((sc) => {
      sc.circles[selectedEntityId].materialId = materialId;
    });

    vars.gl.uniform1i(
      vars.gl.getUniformLocation(
        vars.program,
        `u_circles[${selectedEntityId}].materialId`
      ),
      materialId
    );
  };

  const setCircleRadius = (radius: number) => {
    if (!vars.gl || !vars.program || selectedEntityId == undefined) return;

    setScene((sc) => {
      sc.circles[selectedEntityId].radius = radius;
    });

    vars.gl.uniform1f(
      vars.gl.getUniformLocation(
        vars.program,
        `u_circles[${selectedEntityId}].radius`
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
        selectedEntityId,
        setCircleRadius,
        setCircleMaterial,
        addCircle,
        selectMaterial,
        setMaterialColor,
        addMaterial,
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
