import { create } from "zustand";

interface HeaderShowState {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const useHeaderShowStore = create<HeaderShowState>(set => ({
  show: false,
  setShow: show => set({ show })
}));
