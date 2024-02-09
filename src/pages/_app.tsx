import { SceneContextProvider } from "@/contexts/scene";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SceneContextProvider>
      <Component {...pageProps} />
    </SceneContextProvider>
  );
}
