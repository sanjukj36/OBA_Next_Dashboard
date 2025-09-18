"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const FleetTable = dynamic(() => import("./fleet_table"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function FleetPage() {
  return <FleetTable />;
}
