import { useCallback } from "react";
import { useSidebarStore } from "@/store/sidebar";
import { useDashboardStore } from "@/store/dashboard";
import { UsedFile } from "@/store/sidebar";

export const useOptimizedFileOperations = () => {
  const { currentFiles, setCurrentFiles, updateFileContent, updateFileTitle } =
    useSidebarStore();
  const { currentFile, setCurrentFile } = useDashboardStore();

  const optimisticUpdateFile = useCallback(
    (fileId: number, updates: Partial<UsedFile>) => {
      // Optimistically update the current file if it matches
      if (currentFile?.id === fileId) {
        setCurrentFile({ ...currentFile, ...updates });
      }

      // Update the file in the sidebar list
      if (updates.content !== undefined) {
        updateFileContent(fileId, updates.content);
      }
      if (updates.title !== undefined) {
        updateFileTitle(fileId, updates.title);
      }
    },
    [currentFile, setCurrentFile, updateFileContent, updateFileTitle],
  );

  const addFileToList = useCallback(
    (newFile: UsedFile) => {
      const updatedFiles = [...currentFiles, newFile].sort(
        (a, b) => a.page - b.page,
      );
      setCurrentFiles(updatedFiles);
    },
    [currentFiles, setCurrentFiles],
  );

  const removeFileFromList = useCallback(
    (fileId: number) => {
      const updatedFiles = currentFiles.filter((file) => file.id !== fileId);
      setCurrentFiles(updatedFiles);
    },
    [currentFiles, setCurrentFiles],
  );

  const reorderFiles = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updatedFiles = [...currentFiles];
      const [movedFile] = updatedFiles.splice(fromIndex, 1);
      updatedFiles.splice(toIndex, 0, movedFile);

      // Update page numbers based on new order
      const reorderedFiles = updatedFiles.map((file, index) => ({
        ...file,
        page: index + 1,
      }));

      setCurrentFiles(reorderedFiles);
    },
    [currentFiles, setCurrentFiles],
  );

  return {
    optimisticUpdateFile,
    addFileToList,
    removeFileFromList,
    reorderFiles,
  };
};
