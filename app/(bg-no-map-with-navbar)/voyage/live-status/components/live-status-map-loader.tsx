"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Loader = () => (
  <Skeleton className="pointer-events-none fixed left-0 right-0 top-0 -z-10 h-screen w-screen" />
);

const LazyLiveStatusMap = dynamic(() => import("./live-status-map"), {
  ssr: false,
  loading: () => <Loader />
});

export default function LiveStatusMapLoader() {
  return <LazyLiveStatusMap />;
}
