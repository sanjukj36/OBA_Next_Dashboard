import * as React from "react";
import { twMerge } from "tailwind-merge";
import Header from "@/components/layout/header";
import { ProtectedRoutesProvider } from "@/provider/protected-routes-provider";
import PageLoader from "@/components/loader/page-loader";
import TimeCardBg from "@/assets/voyage/bg_water_animated.gif";
import GlowBg from "@/assets/voyage/bg_glow.gif";
import GoldenBg from "@/assets/voyage/bg-golden.gif";
import Image from "next/image";


export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bgGradientClassName =
    "bg-[linear-gradient(180deg,_#000000_0%,_#050505_100%)]";
  //const bgGradientClassName = "bg-[radial-gradient(93.65%_295.97%_at_3.57%_10.83%,_#000000_0%,_#111111_95.67%)]";

  return (
    // <ProtectedRoutesProvider>
      <div
        className={twMerge(
          "relative isolate flex h-svh flex-col overflow-y-scroll",
          bgGradientClassName
        )}
      >
              {/* <Image
        // src={TimeCardBg}
        // src={GlowBg}
        src={GoldenBg}
        alt={`Background`}
        fill
        className="pointer-events-none absolute inset-0 -z-10 select-none object-cover"
        priority
      /> */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,_#000000_0%,_#050505_100%)] opacity-70 -z-0" />

        {/* <Header type="overlay" /> */}
          <React.Suspense fallback={<PageLoader />}>
            {children}
          </React.Suspense>
      </div>
    // </ProtectedRoutesProvider>
  );
}
