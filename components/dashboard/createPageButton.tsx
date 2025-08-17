"use client";

import { useSidebarStore } from "@/store/sidebar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { createFileAfterCurrentAction } from "@/app/(main)/dashboard/actions";
import { useDashboardStore } from "@/store/dashboard";

export default function CreatePageButton() {
  const { currentFolder, insertFileAfterCurrent } = useSidebarStore();
  const { currentFile, setCurrentFile } = useDashboardStore();

  const handleCreateFile = async () => {
    if (!currentFolder || !currentFile) return;
    const file = await createFileAfterCurrentAction(
      currentFolder.id,
      currentFile.page,
    );
    insertFileAfterCurrent(file, currentFile.page);
    setCurrentFile(file);
  };

  return (
    <div>
      <Button
        size="sm"
        disabled={!currentFolder || !currentFile}
        onClick={handleCreateFile}
      >
        <PlusIcon />
        New Page
      </Button>
    </div>
  );
}
