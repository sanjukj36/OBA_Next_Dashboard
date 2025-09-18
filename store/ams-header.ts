import { create } from "zustand";

interface AmsHeaderShowState {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const useAmsHeaderShowStore = create<AmsHeaderShowState>(set => ({
  show: false,
  setShow: show => set({ show })
}));
