"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const VesselTable = dynamic(() => import("./vessel_table"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function VesselPage() {
  return <VesselTable />;
}
