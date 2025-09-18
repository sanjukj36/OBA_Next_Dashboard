"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const AlertComponent = dynamic(() => import("./alert-component"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function LocationPlaybackPage() {
  return <AlertComponent />;
}
