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
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

export default function Dashboard() {
  const {
    currentFile,
    setCurrentFile,
    isEditingTitle,
    autoSaveTimeout,
    setAutoSaveTimeout,
  } = useDashboardStore();
  const { currentFolder, updateFileContent } = useSidebarStore();
  const { isMobile, setOpenMobile } = useSidebar();

  // Open sidebar when no file is selected (mobile)
  useEffect(() => {
    if (isMobile && !currentFile) {
      setOpenMobile(true);
    }
  }, [currentFile, isMobile, setOpenMobile]);

  const autoSaveHandler = useCallback(
    async (fileId: number, title: string, content: string) => {
      try {
        await updateFileAction(fileId, title, content);
        updateFileContent(fileId, content);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
      setAutoSaveTimeout(null);
    },
    [updateFileContent, setAutoSaveTimeout],
  );

  const handleTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (currentFile) {
        const updatedFile = { ...currentFile, content: e.target.value };
        setCurrentFile(updatedFile);

        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout);
        }

        const timeout = setTimeout(() => {
          autoSaveHandler(
            updatedFile.id,
            updatedFile.title || "",
            updatedFile.content || "",
          );
        }, 500);

        setAutoSaveTimeout(timeout);
      }
    },
    [
      currentFile,
      setCurrentFile,
      autoSaveTimeout,
      setAutoSaveTimeout,
      autoSaveHandler,
    ],
  );

  return (
    <div className="flex flex-col w-full h-[100dvh] max-h-[100dvh]">
      <div className="flex flex-col justify-between py-1 px-2 sticky top-0 bg-background z-5">
        <div className="flex flex-row justify-between pb-1">
          {currentFile && (isEditingTitle ? <EditTitle /> : <ShowTitle />)}
          {currentFolder && <PageButtons />}
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
      updateFileTitle(currentFile.id, currentFile.title || "");

      try {
        await updateFileAction(
          currentFile.id,
          currentFile.title || "",
          currentFile.content || "",
        );
      } catch (error) {
        console.error("Failed to update title:", error);
      }
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
