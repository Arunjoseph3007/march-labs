import RayMarchCanvas from "@/components/RayMarchCanvas";
import ShapeEditor from "@/components/ShapeEditor";
import ShapesTree from "@/components/ShapesTree";
import { Montserrat } from "next/font/google";
import Head from "next/head";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>March Labs</title>
      </Head>
      <main
        style={montserrat.style}
        className="flex min-h-screen items-center justify-between gap-2 p-2 overflow-hidden"
      >
        <ShapesTree />
        <RayMarchCanvas />
        <ShapeEditor />
      </main>
    </>
  );
}
