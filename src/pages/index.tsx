import ShapeEditor from "@/components/ShapeEditor";
import ShapesTree from "@/components/ShapesTree";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      style={montserrat.style}
      className="flex min-h-screen items-center justify-between gap-2 p-2"
    >
      <ShapesTree />
      
      <ShapeEditor />
    </main>
  );
}
