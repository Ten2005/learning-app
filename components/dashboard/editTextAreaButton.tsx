import { useDashboardStore } from "@/store/dashboard";
import { useSidebarStore } from "@/store/sidebar";
import { updateFileAction } from "@/app/(main)/dashboard/actions";
import { Button } from "../ui/button";

export default function EditTextAreaButton() {
  const { setIsTextAreaDisabled, isTextAreaDisabled, currentFile } =
    useDashboardStore();
  const { currentFiles, setCurrentFiles } = useSidebarStore();

  const handleSave = async () => {
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

  return isTextAreaDisabled ? (
    <Button
      size="sm"
      variant="secondary"
      disabled={!currentFile}
      onClick={() => setIsTextAreaDisabled(false)}
    >
      Edit
    </Button>
  ) : (
    <Button size="sm" onClick={handleSave} disabled={!currentFile}>
      Save
    </Button>
  );
}
