"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { amsRoutes, routes } from "@/lib/routes";

export const NavigationTitleCard = ({ className }: { className?: string }) => {
  const [title, setTitle] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
 
  useEffect(() => {
    const currentRouteElement =
      amsRoutes.find(route => pathname.startsWith(route.href)) ||
      routes.find(route => pathname.startsWith(route.href)) ||
      routes.find(route => route.sameRouters?.includes(pathname));

    let newTitle = "";

    // Check if we're on the G/E Common page
    if (pathname.includes('/ge-common')) {
      newTitle = "G/E Common";
    } 
    // Check if we're on a DG page
    else if (pathname.includes('/dg')) {
      const currentDg = searchParams.get('dg')?.replace('dg-', '') || '1';
      newTitle = `NO ${currentDg} DG`;
    } 
    // Handle other routes
    else if (currentRouteElement?.sub) {
      const currentSubElement =
        currentRouteElement.sub.find(subRoute => pathname.startsWith(subRoute.href) ||
        currentRouteElement.sub?.find(subRoute => subRoute.sameRouters?.includes(pathname)))
      
      if (currentSubElement) {
        newTitle = currentSubElement.label;
      } else {
        newTitle = currentRouteElement.label;
      }
    } else if (currentRouteElement?.label) {
      newTitle = currentRouteElement.label;
    } else {
      newTitle = "__";
    }

    setTitle(newTitle);
  }, [pathname, searchParams]);

  return (
    <div
      className={twMerge(
        "flex items-center text-wrap rounded-[10px] font-alexandria text-[12px] leading-[100%] xl:text-[15px] 3xl:text-[20px]",
        className
      )}
    >
      {title}
    </div>
  );
};
