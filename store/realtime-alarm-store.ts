import { subMonths } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RealtimeAlarmStoreState {
  from_date: Date;
  setFromDate: (from_date: Date) => void;
  to_date: Date;
  setToDate: (to_date: Date) => void;
  sort: string;
  setSort: (sort: string) => void;
  page: number;
  limit: number;
  hydrated: boolean;
  setHydrated: () => void;
}

export const useRealtimeAlarmStore = create<RealtimeAlarmStoreState>()(
  persist(
    set => ({
      from_date: subMonths(new Date(), 1),
      to_date: new Date(),
      sort: "asc",
      page: 1,
      limit: 1000,
      setFromDate: from_date => set({ from_date }),
      setToDate: to_date => set({ to_date }),
      setSort: sort => set({ sort }),
      hydrated: false,
      setHydrated: () => set({ hydrated: true })
    }),

    {
      name: "realtime-alarm-storage",
      onRehydrateStorage: () => (state?: RealtimeAlarmStoreState) => {
        state?.setHydrated();
      }
    }
  )
);
