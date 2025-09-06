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

  isEditingFolder: boolean;
  setIsEditingFolder: (isEditingFolder: boolean) => void;

  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;

  isCreatingFolder: boolean;
  setIsCreatingFolder: (isCreatingFolder: boolean) => void;

  isDeleting: boolean;
  setIsDeleting: (isDeletingFile: boolean) => void;

  // In-memory per-folder cache for faster folder switching
  filesByFolder: Record<number, UsedFile[]>;
  setFilesForFolder: (folderId: number, files: UsedFile[]) => void;
  getFilesByFolder: (folderId: number) => UsedFile[] | undefined;
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
    set((state) => {
      const updated: Partial<SidebarState> = { currentFiles };
      if (state.currentFolder) {
        updated.filesByFolder = {
          ...state.filesByFolder,
          [state.currentFolder.id]: currentFiles,
        };
      }
      return updated as SidebarState;
    }),

  updateFileContent: (fileId: number, content: string) =>
    set((state) => {
      const updatedCurrentFiles = state.currentFiles.map((file) =>
        file.id === fileId ? { ...file, content } : file,
      );
      const updated: Partial<SidebarState> = {
        currentFiles: updatedCurrentFiles,
      };
      if (state.currentFolder) {
        updated.filesByFolder = {
          ...state.filesByFolder,
          [state.currentFolder.id]: updatedCurrentFiles,
        };
      }
      return updated as SidebarState;
    }),

  updateFileTitle: (fileId: number, title: string) =>
    set((state) => {
      const updatedCurrentFiles = state.currentFiles.map((file) =>
        file.id === fileId ? { ...file, title } : file,
      );
      const updated: Partial<SidebarState> = {
        currentFiles: updatedCurrentFiles,
      };
      if (state.currentFolder) {
        updated.filesByFolder = {
          ...state.filesByFolder,
          [state.currentFolder.id]: updatedCurrentFiles,
        };
      }
      return updated as SidebarState;
    }),

  insertFileAfterCurrent: (newFile, currentPage) =>
    set((state) => {
      const updatedFiles = state.currentFiles.map((file) =>
        file.page > currentPage ? { ...file, page: file.page + 1 } : file,
      );

      updatedFiles.push(newFile);

      return {
        currentFiles: updatedFiles.sort((a, b) => a.page - b.page),
      };
    }),

  isEditingFolder: false,
  setIsEditingFolder: (isEditingFolder) => set({ isEditingFolder }),

  isDialogOpen: false,
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),

  isCreatingFolder: false,
  setIsCreatingFolder: (isCreatingFolder) => set({ isCreatingFolder }),

  isDeleting: false,
  setIsDeleting: (isDeleting) => set({ isDeleting }),

  filesByFolder: {},
  setFilesForFolder: (folderId: number, files: UsedFile[]) =>
    set((state) => ({
      filesByFolder: {
        ...state.filesByFolder,
        [folderId]: files,
      },
    })),
  getFilesByFolder: (folderId: number) => {
    const { filesByFolder } = get();
    return filesByFolder[folderId];
  },
}));
