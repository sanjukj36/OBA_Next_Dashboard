"use client"

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const  LiveStatusMapLoader  = dynamic(() => import("./components/live-status-map-loader"), {
  loading: () => <PageLoader />,
  ssr: false
})


export default function LiveStatusPage() {
  return <LiveStatusMapLoader />;
}
