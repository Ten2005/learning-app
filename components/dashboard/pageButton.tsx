"use client";

import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard";
import { useSidebarStore } from "@/store/sidebar";
import { useSidebar } from "../ui/sidebar";

export default function PageButtons() {
  const { currentFile, setCurrentFile } = useDashboardStore();
  const { currentFiles } = useSidebarStore();
  const { isMobile, setOpenMobile } = useSidebar();

  const handlePageChange = (page: number) => {
    if (!currentFile) return;
    const newCurrentFile = currentFiles.find((file) => file.page === page);
    if (!newCurrentFile) return;
    setCurrentFile(newCurrentFile);

    if (isMobile) {
      setOpenMobile(false);
    }
  };
  if (!currentFile) return;
  return (
    <div className="flex flex-row gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="size-8"
        onClick={() => handlePageChange(currentFile.page - 1)}
        disabled={currentFile.page === 0}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-8"
        onClick={() => handlePageChange(currentFile.page + 1)}
        disabled={currentFile.page === currentFiles.length - 1}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
