import { create } from "zustand";
import { UsedFile } from "@/store/sidebar";

interface DashboardState {
  currentFile: UsedFile | undefined;
  setCurrentFile: (currentFile: UsedFile | undefined) => void;

  isEditingTitle: boolean;
  setIsEditingTitle: (isEditingTitle: boolean) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  autoSaveTimeout: NodeJS.Timeout | null;
  setAutoSaveTimeout: (timeout: NodeJS.Timeout | null) => void;

  getAutoSaveState: () => {
    currentFile: UsedFile | undefined;
    autoSaveTimeout: NodeJS.Timeout | null;
  };
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  currentFile: undefined,
  setCurrentFile: (currentFile) => set({ currentFile }),

  isEditingTitle: false,
  setIsEditingTitle: (isEditingTitle) => set({ isEditingTitle }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  autoSaveTimeout: null,
  setAutoSaveTimeout: (timeout) => set({ autoSaveTimeout: timeout }),

  getAutoSaveState: () => {
    const { currentFile, autoSaveTimeout } = get();
    return { currentFile, autoSaveTimeout };
  },
}));
