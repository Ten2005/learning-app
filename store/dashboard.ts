import { create } from "zustand";
import { UsedFile } from "@/types/sidebar/file";

interface DashboardState {
  currentFile: UsedFile | undefined;
  setCurrentFile: (currentFile: UsedFile | undefined) => void;

  isEditingTitle: boolean;
  setIsEditingTitle: (isEditingTitle: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  currentFile: undefined,
  setCurrentFile: (currentFile) => set({ currentFile }),

  isEditingTitle: false,
  setIsEditingTitle: (isEditingTitle) => set({ isEditingTitle }),
}));
