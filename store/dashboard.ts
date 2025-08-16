import { create } from "zustand";
import { UsedFile } from "@/types/sidebar/file";

interface DashboardState {
  currentFile: UsedFile | undefined;
  setCurrentFile: (currentFile: UsedFile | undefined) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  currentFile: undefined,
  setCurrentFile: (currentFile) => set({ currentFile }),
}));
