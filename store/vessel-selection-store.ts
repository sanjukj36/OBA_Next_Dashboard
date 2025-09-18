import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VesselListItem } from "@/types/vessel-selection";

interface VesselSelectionState {
  vessel: VesselListItem | null;
  setVessel: (vessel: VesselListItem) => void;
  hydrated: boolean;
  setHydrated: () => void;
}

export const useVesselSelectionStore = create<VesselSelectionState>()(
  persist(
    set => ({
      vessel: null,
      setVessel: vessel => set({ vessel }),
      hydrated: false,
      setHydrated: () => set({ hydrated: true })
    }),
    {
      name: "vessel-selection-storage",
      onRehydrateStorage: () => state => {
        state?.setHydrated();
      }
    }
  )
);
