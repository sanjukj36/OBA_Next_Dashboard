"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Loader = () => (
  <Skeleton className="pointer-events-none fixed left-0 right-0 top-0 -z-10 h-screen w-screen" />
);

const LazyLocationPlaybackMap = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => <Loader />
});

export default function LocationPlaybackMapLoader() {
  return <LazyLocationPlaybackMap />;
}
