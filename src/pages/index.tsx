import RayMarchCanvas from "@/components/RayMarchCanvas";
import ElementEditor from "@/components/ElementEditor";
import ElementTree from "@/components/ElementTree";
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
        className="flex min-h-screen items-center justify-between gap-2 p-2"
      >
        <ElementTree />
        <RayMarchCanvas />
        <ElementEditor />
      </main>
    </>
  );
}
