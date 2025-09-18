"use client"

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const LocationPlaybackComponent = dynamic(() => import("./components"), {
  loading: () => <PageLoader />,
  ssr: false
})

export default function LocationPlaybackPage() {
  return <LocationPlaybackComponent />;
}
