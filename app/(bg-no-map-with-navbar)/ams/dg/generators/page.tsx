"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import PageLoader from "@/components/loader/page-loader";
import { DG } from "./dg-taglist";

const DgComponent = dynamic(() => import("./dg-component"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function GeneratorsPage() {
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("dg");

  if (currentSection === "dg-2") {
    const dg2Label = DG("DG2");
    return <DgComponent l={dg2Label} />;
  }

  if (currentSection === "dg-3") {
    const dg3Label = DG("DG3");
    return <DgComponent l={dg3Label} />;
  }

  if (currentSection === "dg-4") {
    const dg4Label = DG("DG4");
    return <DgComponent l={dg4Label} />;
  }

  const dg1Label = DG("DG1");
  return <DgComponent l={dg1Label} />;
}
