"use client";

import { UsedFolder } from "@/store/sidebar";
import { Button } from "../ui/button";
import { Folder } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";
import { useSidebarStore } from "@/store/sidebar";
import { useDashboardStore } from "@/store/dashboard";
import { readFilesAction } from "@/app/(main)/dashboard/actions";
import { createFileAction } from "@/app/(main)/dashboard/actions";
import { useCallback, useEffect, useRef } from "react";

export default function Folders({ folders }: { folders: UsedFolder[] }) {
  const { setCurrentFolder, setCurrentFiles, getFilesByFolder } =
    useSidebarStore();
  const { setCurrentFile } = useDashboardStore();

  const changeFolder = async (folder: UsedFolder) => {
    setCurrentFolder(folder);

    const files = await readFilesAction(folder.id);
    if (files.length > 0) {
      setCurrentFiles(files);
      setCurrentFile(files[0]);
    } else {
      const file = await createFileAction(folder.id, 0);
      setCurrentFiles([file]);
      setCurrentFile(file);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant="ghost"
            size="sm"
            className="p-0 justify-start w-full"
            onClick={() => changeFolder(folder)}
          >
            <div
              id={folder.id.toString()}
              className="flex items-center justify-start w-full"
            >
              <Folder className="w-4 h-4 mr-2" />
              {folder.name}
            </div>
          </Button>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
