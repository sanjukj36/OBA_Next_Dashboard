"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const MainEngine = dynamic(() => import("./main-engine"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function MainEnginePage() {
  return <MainEngine />;
}
