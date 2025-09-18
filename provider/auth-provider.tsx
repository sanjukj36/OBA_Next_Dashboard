"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { ClientUser } from "@/types";

interface AuthContextType {
  user: ClientUser | null;
  token: string | null;
  login: (user: ClientUser, token: string) => void;
  logout: () => void;
  hydrated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, token, login, logout, hydrated } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (hydrated && !token) {
      // router.push("/dashboard/overview");
    }
  }, [token, router, hydrated]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
