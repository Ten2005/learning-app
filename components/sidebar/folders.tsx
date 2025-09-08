"use client";

import { UsedFolder, UsedFile } from "@/store/sidebar";
import { Button } from "../ui/button";
import { Folder } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";
import { useSidebarStore } from "@/store/sidebar";
import { useDashboardStore } from "@/store/dashboard";
import { createFileAction } from "@/app/(main)/dashboard/actions";
import { useCallback, useEffect } from "react";

type FolderWithFiles = UsedFolder & { files: UsedFile[] };

export default function Folders({ folders }: { folders: FolderWithFiles[] }) {
  const { setCurrentFolder, setCurrentFiles, getFilesByFolder, cacheFiles } =
    useSidebarStore();
  const { setCurrentFile } = useDashboardStore();

  useEffect(() => {
    folders.forEach((folder) => {
      cacheFiles(folder.id, folder.files);
    });
  }, [folders, cacheFiles]);

  const changeFolder = useCallback(
    async (folder: UsedFolder) => {
      setCurrentFolder(folder);

      const files = getFilesByFolder(folder.id);
      if (files.length > 0) {
        setCurrentFiles(files);
        setCurrentFile(files[0]);
      } else {
        const file = await createFileAction(folder.id, 0);
        cacheFiles(folder.id, [file]);
        setCurrentFiles([file]);
        setCurrentFile(file);
      }
    },
    [
      setCurrentFolder,
      getFilesByFolder,
      setCurrentFiles,
      setCurrentFile,
      cacheFiles,
    ],
  );

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
