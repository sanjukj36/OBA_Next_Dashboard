"use client"

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

// const LocationPlaybackMapLoader  = dynamic(() => import("./components/map-loader"), {
const LocationPlaybackMapLoader  = dynamic(() => import("./components/geofencing-list"), {
  loading: () => <PageLoader />,
  ssr: false
})

export default function LocationPlaybackPage() {
  return <LocationPlaybackMapLoader />;
}
