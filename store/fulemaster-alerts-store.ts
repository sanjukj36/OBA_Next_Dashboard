import { SortOption } from "@/app/(bg-no-map-with-navbar)/alerts/fuel-master/component/sorting-component";
import { subDays } from "date-fns";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FuelMasterAlertsStoreState {
  from_date?: Date;
  setFromDate: (from_date?: Date) => void;
  to_date?: Date;
  setToDate: (to_date?: Date) => void;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  /*
  hydrated: boolean;
  setHydrated: () => void;
  */
}

export const useFuelmasterAlertsStore = create<FuelMasterAlertsStoreState>()(
  persist(
    set => ({
      from_date: subDays(new Date(), 1),
      to_date: new Date(),
      setFromDate: from_date => set({ from_date }),
      setToDate: to_date => set({ to_date }),
      sort: SortOption.Des,
      setSort: (sort: SortOption) => set({ sort })
      /*
      hydrated: false,
      setHydrated: () => set({ hydrated: true })
      */
    }),
    {
      name: "realtime-alarm-storage",
      storage: createJSONStorage(() => sessionStorage)
      /*
      onRehydrateStorage: () => (state?: FuelMasterAlertsStoreState) => {
        state?.setHydrated();
      }
      */
    }
  )
);
