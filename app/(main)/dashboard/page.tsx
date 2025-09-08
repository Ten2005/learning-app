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
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAutoSave } from "@/hooks/use-auto-save";

export default function Dashboard() {
  const { currentFile, setCurrentFile, isEditingTitle } = useDashboardStore();
  const { currentFolder, updateFileContent } = useSidebarStore();

  const saveFile = useCallback(
    async (signal: AbortSignal) => {
      if (!currentFile) return;
      try {
        await fetch(`/api/file/${currentFile.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: currentFile.title || "",
            content: currentFile.content || "",
          }),
          signal,
        });
        updateFileContent(currentFile.id, currentFile.content || "");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Auto-save failed:", error);
        }
      }
    },
    [currentFile, updateFileContent],
  );

  useAutoSave(currentFile, 500, saveFile);

  const handleTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (currentFile) {
        setCurrentFile({ ...currentFile, content: e.target.value });
      }
    },
    [currentFile, setCurrentFile],
  );

  return (
    <div className="flex flex-col w-full h-[100dvh] max-h-[100dvh]">
      <div className="flex flex-col justify-between py-1 px-2">
        <div className="flex flex-row justify-between border-b pb-1">
          {currentFile && (isEditingTitle ? <EditTitle /> : <ShowTitle />)}
          {currentFolder && <PageButtons />}
        </div>
        <div className="flex flex-row justify-end items-center border-b py-1">
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

  const { updateFileTitle } = useSidebarStore();

  const handleUpdateTitle = useCallback(async () => {
    setIsEditingTitle(false);
    if (currentFile) {
      await updateFileAction(
        currentFile.id,
        currentFile.title || "",
        currentFile.content || "",
      );
      updateFileTitle(currentFile.id, currentFile.title || "");
    }
  }, [currentFile, setIsEditingTitle, updateFileTitle]);

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
        {currentFolder?.name} -&gt; {currentFile?.page} :
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditingTitle(true)}
        asChild
      >
        <Label
          className={cn(
            currentFile?.title ? "text-primary" : "text-muted-foreground",
          )}
        >
          {currentFile?.title ? currentFile.title : "None"}
        </Label>
      </Button>
    </div>
  );
}
