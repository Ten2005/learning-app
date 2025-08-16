import { create } from "zustand";

interface SidebarState {
  newFolderName: string;
  setNewFolderName: (newFolderName: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  newFolderName: "",
  setNewFolderName: (newFolderName) => set({ newFolderName }),
  isDialogOpen: false,
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
}));
