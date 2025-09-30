import { useCallback } from "react";
import { useDashboardStore } from "@/store/dashboard";
import { useSidebarStore } from "@/store/sidebar";
import { updateFileAction } from "@/app/(main)/dashboard/actions";
import { AUTO_SAVE_DELAY_MS } from "@/constants/dashboard";

export function useAutoSave(processCommandAgent: () => Promise<string | null>) {
  const { autoSaveTimeout, setAutoSaveTimeout } = useDashboardStore();
  const { updateFileContent } = useSidebarStore();

  const autoSaveHandler = useCallback(
    async (fileId: number, title: string, content: string) => {
      try {
        await processCommandAgent();
        await updateFileAction(fileId, title, content);
        updateFileContent(fileId, content);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
      setAutoSaveTimeout(null);
    },
    [updateFileContent, setAutoSaveTimeout, processCommandAgent],
  );

  const scheduleAutoSave = useCallback(
    (fileId: number, title: string, content: string) => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      const timeout = setTimeout(() => {
        autoSaveHandler(fileId, title, content);
      }, AUTO_SAVE_DELAY_MS);

      setAutoSaveTimeout(timeout);
    },
    [autoSaveTimeout, setAutoSaveTimeout, autoSaveHandler],
  );

  return {
    scheduleAutoSave,
  };
}
