import { cn } from "@/lib/utils";
import AddConfirmationDialog from "./addConfirmationDialog";
import { useDashboardStore } from "@/store/dashboard";
import { UsedFile } from "@/types/sidebar/file";
import { updateFileAction } from "@/app/(main)/dashboard/actions";

export function Message({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) {
  const { currentFile, setCurrentFile } = useDashboardStore();

  const handleAddMessage = async () => {
    if (currentFile) {
      const updatedFile: UsedFile = {
        ...currentFile,
        content: currentFile.content + "\n\n" + content,
      };
      await updateFileAction(
        currentFile.id,
        updatedFile.title,
        updatedFile.content,
      );
      setCurrentFile(updatedFile);
    }
  };

  return (
    <div className="flex flex-row gap-2 items-end">
      <div
        className={cn(
          "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted",
        )}
      >
        {content}
      </div>
      <div className="flex flex-row justify-end">
        <AddConfirmationDialog addFunction={handleAddMessage} />
      </div>
    </div>
  );
}
