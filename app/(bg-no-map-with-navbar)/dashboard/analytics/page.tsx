"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const DashbaordAnalytics = dynamic(
  () => import("./analytics-component"),
  {
    loading: () => <PageLoader />,
    ssr: false
  }
);

function DashbaordAnalyticsPage() {
  return <DashbaordAnalytics />;
}

export default DashbaordAnalyticsPage;
