"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDashboardStore } from "@/store/dashboard";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageButtons from "@/components/dashboard/pageButton";
import { Input } from "@/components/ui/input";
import { useSidebarStore } from "@/store/sidebar";
import { updateFileAction } from "./actions";
import { SearchSheet } from "@/components/chat/searchSheet";

export default function Dashboard() {
  const { currentFile, setCurrentFile, isEditingTitle, autoSaveTimeout, setAutoSaveTimeout } =
    useDashboardStore();
  const { currentFolder, currentFiles, setCurrentFiles } = useSidebarStore();

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentFile) {
      const updatedFile = { ...currentFile, content: e.target.value };
      setCurrentFile(updatedFile);

      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      const timeout = setTimeout(async () => {
        try {
          await updateFileAction(updatedFile.id, updatedFile.title || "", updatedFile.content || "");
          setCurrentFiles(
            currentFiles.map((file) =>
              file.id === updatedFile.id ? { ...file, content: updatedFile.content } : file
            )
          );
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
        setAutoSaveTimeout(null);
      }, 1000);

      setAutoSaveTimeout(timeout);
    }
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] max-h-[100dvh]">
      <div className="flex flex-col justify-between py-1 px-2">
        <div className="flex flex-row justify-between border-b pb-1">
          {currentFile && (isEditingTitle ? <EditTitle /> : <ShowTitle />)}
          {currentFolder && <PageButtons />}
        </div>
        <div className="flex flex-row justify-between items-center border-b py-1">
          <SearchSheet />
        </div>
      </div>
      <Textarea
        value={currentFile?.content || ""}
        onChange={handleTextAreaChange}
        disabled={!currentFile}
        className="
        w-full flex-1
        resize-none border-none focus:border-none focus-visible:ring-0"
      />
    </div>
  );
}

function EditTitle() {
  const { currentFile, setCurrentFile, setIsEditingTitle } =
    useDashboardStore();

  const { currentFiles, setCurrentFiles } = useSidebarStore();

  const handleUpdateTitle = async () => {
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

  return (
    <div className="flex flex-row items-center gap-1">
      <Input
        type="text"
        value={currentFile?.title || ""}
        onChange={(e) => {
          if (currentFile) {
            setCurrentFile({ ...currentFile, title: e.target.value });
          }
        }}
      />
      <Button variant="ghost" size="icon" onClick={handleUpdateTitle}>
        <CheckIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}

function ShowTitle() {
  const { currentFile } = useDashboardStore();
  const { currentFolder } = useSidebarStore();
  const { setIsEditingTitle } = useDashboardStore();
  return (
    <div className="flex flex-row items-center">
      <span className="text-xs text-muted-foreground px-1">
        ({currentFolder?.name})
      </span>
      <span className="text-xs text-muted-foreground px-1">
        {currentFile?.page}
      </span>
      {currentFile?.title ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditingTitle(true)}
          asChild
        >
          <Label className="text-primary"> {currentFile?.title}</Label>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditingTitle(true)}
          asChild
        >
          <Label className="text-muted-foreground">None</Label>
        </Button>
      )}
    </div>
  );
}
