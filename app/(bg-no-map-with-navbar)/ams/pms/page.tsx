"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const PMSComponent = dynamic(() => import("./pms"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function PMSPage() {
  return <PMSComponent />;
}
