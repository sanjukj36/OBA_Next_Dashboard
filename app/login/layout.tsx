"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/provider/auth-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { token } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    setHasCheckedAuth(true);
    if (token) {
      router.replace("/dashboard/overview");
    }
  }, [token, router]);

  if (!hasCheckedAuth) {
    return null;
  }

  return token ? null : children;
}
