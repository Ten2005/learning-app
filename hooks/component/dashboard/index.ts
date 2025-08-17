import { useSidebarStore } from "@/store/sidebar";
import {
  createFileAfterCurrentAction,
  createFileAction,
  deleteFileAction,
  deleteFolderAction,
  readFilesAction,
  updateFolderAction,
} from "@/app/(main)/dashboard/actions";
import { useDashboardStore } from "@/store/dashboard";
import { UsedFolder } from "@/types/sidebar/folder";

export const useCreateFile = async () => {
  const { currentFolder, insertFileAfterCurrent } = useSidebarStore();
  const { currentFile, setCurrentFile } = useDashboardStore();
  if (!currentFolder || !currentFile) return;
  const file = await createFileAfterCurrentAction(
    currentFolder.id,
    currentFile.page,
  );
  insertFileAfterCurrent(file, currentFile.page);
  setCurrentFile(file);
};

export const useDeleteFile = async (fileId: number) => {
  const { currentFiles, setCurrentFiles } = useSidebarStore();
  const { currentFolder } = useSidebarStore();
  const { setCurrentFile } = useDashboardStore();
  await deleteFileAction(fileId);
  const filteredFiles = currentFiles.filter((file) => file.id !== fileId);
  await setCurrentFiles(filteredFiles);
  if (filteredFiles.length === 0 && currentFolder) {
    const file = await createFileAction(currentFolder.id, 0);
    setCurrentFiles([file]);
    setCurrentFile(file);
  }
};

export const useFolderInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const { currentFolder, setCurrentFolder } = useSidebarStore();
  if (!currentFolder) return;
  setCurrentFolder({ ...currentFolder, name: e.target.value });
};

export const useUpdateFolder = () => {
  const { currentFolder, isEditingFolder, setIsEditingFolder } =
    useSidebarStore();
  if (isEditingFolder && currentFolder) {
    updateFolderAction(currentFolder.id, currentFolder.name);
  }
  setIsEditingFolder(!isEditingFolder);
};

export const useDeleteFolder = () => {
  const { currentFolder, setCurrentFolder } = useSidebarStore();
  if (!currentFolder) return;
  deleteFolderAction(currentFolder.id);
  setCurrentFolder(undefined);
};

export const useChangeFolder = async (folder: UsedFolder) => {
  const { setCurrentFolder, setCurrentFiles } = useSidebarStore();
  const { setCurrentFile } = useDashboardStore();
  setCurrentFolder(folder);
  const files = await readFilesAction(folder.id);
  if (files.length > 0) {
    setCurrentFiles(files);
    setCurrentFile(files[0]);
  } else {
    const file = await createFileAction(folder.id, 0);
    setCurrentFiles([file]);
    setCurrentFile(file);
  }
};
