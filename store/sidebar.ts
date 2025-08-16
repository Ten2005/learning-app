import { create } from "zustand";
import { UsedFolder } from "@/types/sidebar/folder";
interface SidebarState {
  newFolderName: string;
  setNewFolderName: (newFolderName: string) => void;
  currentFolder: UsedFolder | undefined;
  setCurrentFolder: (currentFolder: UsedFolder) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  newFolderName: "",
  setNewFolderName: (newFolderName) => set({ newFolderName }),
  currentFolder: undefined,
  setCurrentFolder: (currentFolder) => set({ currentFolder }),
  isDialogOpen: false,
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
}));
