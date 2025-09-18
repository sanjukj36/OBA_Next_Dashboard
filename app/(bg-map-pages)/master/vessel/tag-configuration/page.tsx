"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const Builder = dynamic(() => import("./builder/Builder"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function VesselTagConfigurationPage() {
  return <Builder />;
}
