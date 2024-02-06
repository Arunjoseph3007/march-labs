import { ReactNode, createContext, useContext } from "react";
import { useImmer } from "use-immer";

type ISceneContext = {};

const SceneContext = createContext<ISceneContext>({});

export function SceneContextProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useImmer({});

  return <SceneContext.Provider value={{}}>{children}</SceneContext.Provider>;
}

export default function useScene<T>(selector: (state: ISceneContext) => T) {
  const scene = useContext(SceneContext);

  if (!scene) {
    throw new Error(`useScene must be used inside <SceneContextProvider>`);
  }

  return selector(scene);
}
