"use client";

import { useSidebarStore } from "@/store/sidebar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { createFileAfterCurrentAction } from "@/app/(main)/dashboard/actions";
import { useDashboardStore } from "@/store/dashboard";

export default function CreateFileButton() {
  const { currentFolder, insertFileAfterCurrent } = useSidebarStore();
  const { currentFile, setCurrentFile, isLoading, setIsLoading } =
    useDashboardStore();

  const handleCreateFile = async () => {
    if (!currentFolder || !currentFile) return;
    await setIsLoading(true);
    const file = await createFileAfterCurrentAction(
      currentFolder.id,
      currentFile.page,
    );
    insertFileAfterCurrent(file, currentFile.page);
    setCurrentFile(file);
    setIsLoading(false);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={!currentFolder || !currentFile || isLoading}
      onClick={handleCreateFile}
    >
      {isLoading ? <Spinner /> : <PlusIcon />}
      New File
    </Button>
  );
}
