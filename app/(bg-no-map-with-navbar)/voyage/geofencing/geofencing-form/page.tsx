"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const GeofencingAddComponent = dynamic(() => import("./geofencing-form"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function LocationPlaybackPage() {
  return <GeofencingAddComponent />;
}
