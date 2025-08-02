import { create } from "zustand";

interface DashboardState {
  currentTitle: string;
  currentContent: string;
  setCurrentTitle: (currentTitle: string) => void;
  setCurrentContent: (currentContent: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  currentTitle: "",
  currentContent: "",
  setCurrentTitle: (currentTitle) => set({ currentTitle }),
  setCurrentContent: (currentContent) => set({ currentContent }),
}));
