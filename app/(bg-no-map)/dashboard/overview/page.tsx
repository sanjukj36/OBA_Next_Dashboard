"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const OverviewComponent = dynamic(
  () => import("./overview-component-black-theme-tagg-assign"),
  {
    loading: () => <PageLoader />,
    ssr: false
  }
);

function OverViewPage() {
  return <OverviewComponent />;
}

export default OverViewPage;
