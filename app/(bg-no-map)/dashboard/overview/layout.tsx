import * as React from "react";
import { TrendContextProvider } from "@/components/dashboard/trends/trend-context";

export default function DashboardOverviewLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TrendContextProvider>{children}</TrendContextProvider>;
}
