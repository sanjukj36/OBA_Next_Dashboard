import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClientUser } from "@/types";

interface AuthState {
  user: ClientUser | null;
  token: string | null;
  login: (user: ClientUser, token: string) => void;
  logout: () => void;
  hydrated: boolean;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      hydrated: false,
      setHydrated: () => set({ hydrated: true })
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      }
    }
  )
);
