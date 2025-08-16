
import { create } from "zustand";
import { ShowedFolder } from "@/types/sidebar/folder";
interface SidebarState {
  newFolderName: string;
  setNewFolderName: (newFolderName: string) => void;
  currentFolder: ShowedFolder | undefined;
  setCurrentFolder: (currentFolder: ShowedFolder) => void;
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
