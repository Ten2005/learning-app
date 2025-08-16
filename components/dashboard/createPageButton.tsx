"use client";

import { useSidebarStore } from "@/store/sidebar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { createFileAction } from "@/app/(main)/dashboard/actions";
import { useDashboardStore } from "@/store/dashboard";

export default function CreatePageButton() {
  const { currentFolder } = useSidebarStore();
  const { currentFile, setCurrentFile } = useDashboardStore();
  if (!currentFolder || !currentFile) return;
  return (
    <div>
      <Button
        size="sm"
        onClick={async () => {
          const file = await createFileAction(
            currentFolder.id,
            currentFile.page + 1,
          );
          setCurrentFile(file);
        }}
      >
        <PlusIcon />
        New Page
      </Button>
    </div>
  );
}
