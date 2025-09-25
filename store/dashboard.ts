import { create } from "zustand";
import { UsedFile } from "@/store/sidebar";

interface DashboardState {
  currentFile: UsedFile | undefined;
  setCurrentFile: (currentFile: UsedFile | undefined) => void;

  isEditingTitle: boolean;
  setIsEditingTitle: (isEditingTitle: boolean) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  currentFile: undefined,
  setCurrentFile: (currentFile) => set({ currentFile }),

  isEditingTitle: false,
  setIsEditingTitle: (isEditingTitle) => set({ isEditingTitle }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
