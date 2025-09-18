"use client";

import * as React from "react";
import Header from "@/components/layout/header";
import BgMapLoader from "@/components/layout/map/bg-map-loader";
import { ProtectedRoutesProvider } from "@/provider/protected-routes-provider";
import PageLoader from "@/components/loader/page-loader";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoutesProvider>
      <div className="relative isolate flex h-svh flex-col overflow-y-scroll font-din">
        <BgMapLoader />
        <Header type="sticky" />
          <React.Suspense fallback={<PageLoader />}>
            {children}
          </React.Suspense>
      </div>
    </ProtectedRoutesProvider>
  );
}
