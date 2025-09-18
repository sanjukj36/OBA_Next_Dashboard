"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const GECommon = dynamic(() => import("./ge-common-component"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function GECommonPage() {
  return <GECommon />;
}
