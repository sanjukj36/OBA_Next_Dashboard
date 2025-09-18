"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const AlarmsRealtime = dynamic(() => import("./alarms-realtime"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function AalarmsRealtimePage() {
  return <AlarmsRealtime />;
}
