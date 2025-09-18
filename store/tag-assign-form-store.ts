import { create } from "zustand";

interface TagAssignFormState {
  showTagAssign: boolean;
  setShowTagAssign: (showTagAssign: boolean) => void;
}

export const useTagAssignStore = create<TagAssignFormState>(set => ({
  showTagAssign: false,
  setShowTagAssign: showTagAssign => set({ showTagAssign })
}));
