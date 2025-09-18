"use client";

import { useEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import PageLoader from "@/components/loader/page-loader";
import { toast } from "@/components/ui/sonner";
import { routes } from "@/lib/routes";
import { useAuthStore } from "@/store/use-auth-store";

export const ProtectedRoutesProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { token, hydrated, user } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    if (!token && hydrated) {
      // redirect("/login");
      redirect("/dashboard/overview");
    }

    const currentRouteSection = routes.find(item => {
      return pathname.toLowerCase().startsWith(item.href.toLowerCase());
    });

    if (
      currentRouteSection &&
      currentRouteSection.is_superuser &&
      !user?.is_superuser
    ) {
      toast.info("You don't have the permission.");
      redirect("/dashboard/overview");
    }
  }, [token, hydrated, user, pathname]);

  if (!hydrated) return <PageLoader className="h-screen w-screen" />;

  return <>{children}</>;
};
