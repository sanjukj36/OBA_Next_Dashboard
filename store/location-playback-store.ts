import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { LocationPlaybackNavlistItem } from "@/app/(bg-no-map-with-navbar)/voyage/location-playback/location-playback-context";
import { PlaybackInitialVesselTimeTimeStamp } from "@/types/playback";
import { CachePlaybackRange } from "@/queries/use-get-playback-cords-query";

export type LocationPlaybackStoreState = {
  currentNavList: LocationPlaybackNavlistItem[];
  setCurrentNavList: (navList: LocationPlaybackNavlistItem[]) => void;
  filteredNavList: LocationPlaybackNavlistItem[];
  setFilteredNavList: (navList: LocationPlaybackNavlistItem[]) => void;
  from_date: Date | undefined;
  to_date: Date | undefined;
  setFrom: (date: Date | undefined) => void;
  setTo: (date: Date | undefined) => void;
  initialDate: PlaybackInitialVesselTimeTimeStamp | undefined;
  setInitialDate: (initialDate: PlaybackInitialVesselTimeTimeStamp | undefined) => void;
  selectedDate: PlaybackInitialVesselTimeTimeStamp | undefined;
  prevSelectedDate: PlaybackInitialVesselTimeTimeStamp | undefined;
  setPrevSelectedDate: (
    selectedDate: PlaybackInitialVesselTimeTimeStamp | undefined
  ) => void;
  setSelectedDate: (
    selectedDate: PlaybackInitialVesselTimeTimeStamp | undefined
  ) => void;
  cachePlaybackData?: CachePlaybackRange;
  setCachePlaybackData: (cachePlaybackData?: CachePlaybackRange) => void;
  hydrated: boolean;
  setHydrated: () => void;
};

export const useLocationPlaybackStore = create<LocationPlaybackStoreState>()(
    devtools(
      (set, get) => ({
        currentNavList: [],
        setCurrentNavList: currentNavList => set({ currentNavList }),
        filteredNavList: [],
        setFilteredNavList: filteredNavList => set({ filteredNavList }),
        from_date: undefined,
        to_date: undefined,
        setFrom: from_date => set({ from_date }),
        setTo: to_date => set({ to_date }),
        prevSelectedDate: undefined,
        initialDate: undefined,
        setInitialDate: initialDate => set({ initialDate }),
        setPrevSelectedDate: prevSelectedDate => set({ prevSelectedDate }),
        selectedDate: undefined,
        setSelectedDate: newDate => {
          const { prevSelectedDate, selectedDate, initialDate } = get()
          if(!newDate) {
            return set({ selectedDate: undefined, prevSelectedDate: undefined, initialDate: undefined });
          }
          if(!prevSelectedDate && !selectedDate && !initialDate) {
            return set({ selectedDate: newDate, prevSelectedDate: newDate, initialDate: newDate });
          }
          if(!prevSelectedDate && !selectedDate) {
            return set({ selectedDate: newDate, prevSelectedDate: newDate });
          }
          return set({ selectedDate: newDate, prevSelectedDate: selectedDate });
        },
        cachePlaybackData: undefined,
        setCachePlaybackData: (cachePlaybackData?: CachePlaybackRange) => set({ cachePlaybackData }),
        hydrated: false,
        setHydrated: () => set({ hydrated: true })
      }),
      {
        name: "location-playback-store",
        enabled: process.env.NODE_ENV === "development"
      }
    ),
);
