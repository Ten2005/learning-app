import { create } from "zustand";
import { shallow } from "zustand/shallow";

export interface UsedFolder {
  id: number;
  name: string;
}

export interface UsedFile {
  id: number;
  title: string;
  content: string;
  page: number;
}

interface SidebarState {
  newFolderName: string;
  setNewFolderName: (newFolderName: string) => void;

  currentFolder: UsedFolder | undefined;
  setCurrentFolder: (currentFolder: UsedFolder | undefined) => void;

  folders: UsedFolder[];
  setFolders: (folders: UsedFolder[]) => void;

  currentFiles: UsedFile[];
  setCurrentFiles: (currentFiles: UsedFile[]) => void;
  updateFileContent: (fileId: number, content: string) => void;
  updateFileTitle: (fileId: number, title: string) => void;

  insertFileAfterCurrent: (newFile: UsedFile, currentPage: number) => void;

  filesCache: Record<number, UsedFile[]>;
  cacheFiles: (folderId: number, files: UsedFile[]) => void;

  isEditingFolder: boolean;
  setIsEditingFolder: (isEditingFolder: boolean) => void;

  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;

  isCreatingFolder: boolean;
  setIsCreatingFolder: (isCreatingFolder: boolean) => void;
  getFilesByFolder: (folderId: number) => UsedFile[];
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  newFolderName: "",
  setNewFolderName: (newFolderName) => set({ newFolderName }),

  currentFolder: undefined,
  setCurrentFolder: (currentFolder) => set({ currentFolder }),

  folders: [],
  setFolders: (folders) => set({ folders }),

  currentFiles: [],
  setCurrentFiles: (currentFiles) =>
    set((state) => ({
      currentFiles,
      filesCache: state.currentFolder
        ? { ...state.filesCache, [state.currentFolder.id]: currentFiles }
        : state.filesCache,
    })),

  updateFileContent: (fileId: number, content: string) =>
    set((state) => {
      const updatedFiles = state.currentFiles.map((file) =>
        file.id === fileId ? { ...file, content } : file,
      );
      return {
        currentFiles: updatedFiles,
        filesCache: state.currentFolder
          ? { ...state.filesCache, [state.currentFolder.id]: updatedFiles }
          : state.filesCache,
      };
    }),

  updateFileTitle: (fileId: number, title: string) =>
    set((state) => {
      const updatedFiles = state.currentFiles.map((file) =>
        file.id === fileId ? { ...file, title } : file,
      );
      return {
        currentFiles: updatedFiles,
        filesCache: state.currentFolder
          ? { ...state.filesCache, [state.currentFolder.id]: updatedFiles }
          : state.filesCache,
      };
    }),

  insertFileAfterCurrent: (newFile, currentPage) =>
    set((state) => {
      const updatedFiles = state.currentFiles.map((file) =>
        file.page > currentPage ? { ...file, page: file.page + 1 } : file,
      );

      updatedFiles.push(newFile);
      const sortedFiles = updatedFiles.sort((a, b) => a.page - b.page);

      return {
        currentFiles: sortedFiles,
        filesCache: state.currentFolder
          ? { ...state.filesCache, [state.currentFolder.id]: sortedFiles }
          : state.filesCache,
      };
    }),

  isEditingFolder: false,
  setIsEditingFolder: (isEditingFolder) => set({ isEditingFolder }),

  isDialogOpen: false,
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),

  isCreatingFolder: false,
  setIsCreatingFolder: (isCreatingFolder) => set({ isCreatingFolder }),

  filesCache: {},
  cacheFiles: (folderId, files) =>
    set((state) => ({
      filesCache: { ...state.filesCache, [folderId]: files },
    })),

  getFilesByFolder: (folderId: number) => {
    const { filesCache } = get();
    return filesCache[folderId] || [];
  },
}));
