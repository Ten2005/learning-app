import { useDashboardStore } from "@/store/dashboard";
import { useSidebarStore } from "@/store/sidebar";
import { updateFileAction } from "@/app/(main)/dashboard/actions";

export const useTextAreaChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
) => {
  const { currentFile, setCurrentFile } = useDashboardStore();
  if (currentFile) {
    setCurrentFile({ ...currentFile, content: e.target.value });
  }
};

export const useSave = async () => {
  const { currentFile, setIsTextAreaDisabled } = useDashboardStore();
  const { currentFiles, setCurrentFiles } = useSidebarStore();
  setIsTextAreaDisabled(true);
  if (currentFile) {
    await updateFileAction(
      currentFile.id,
      currentFile.title || "",
      currentFile.content || "",
    );
    setCurrentFiles(
      currentFiles.map((file) =>
        file.id === currentFile.id
          ? { ...file, content: currentFile.content }
          : file,
      ),
    );
  }
};

export const useUpdateTitle = async () => {
  const { currentFile, setIsEditingTitle } = useDashboardStore();
  const { currentFiles, setCurrentFiles } = useSidebarStore();
  setIsEditingTitle(false);
  if (currentFile) {
    await updateFileAction(
      currentFile.id,
      currentFile.title || "",
      currentFile.content || "",
    );
    setCurrentFiles(
      currentFiles.map((file) =>
        file.id === currentFile.id
          ? { ...file, title: currentFile.title }
          : file,
      ),
    );
  }
};
