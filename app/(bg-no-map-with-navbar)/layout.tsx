import * as React from "react";
import { twMerge } from "tailwind-merge";
import { TrendContextProvider } from "@/components/dashboard/trends/trend-context";
import Header from "@/components/layout/header";
import { ProtectedRoutesProvider } from "@/provider/protected-routes-provider";
import PageLoader from "@/components/loader/page-loader";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bgGradientClassName =
    "bg-[linear-gradient(180deg,_#000000_0%,_#050505_100%)]";

  return (
    // <ProtectedRoutesProvider>
      <div
        className={twMerge(
          "relative isolate flex h-svh flex-col overflow-y-scroll",
          bgGradientClassName
        )}
      >
        <Header
          type="normal"
          showTime
          showTitle
          showVesselSelection={false}
          showLogoutUser={false}
        />
        <TrendContextProvider>
          <React.Suspense fallback={<PageLoader />}>
            {children}
          </React.Suspense>
        </TrendContextProvider>
      </div>
    // </ProtectedRoutesProvider>
  );
}
