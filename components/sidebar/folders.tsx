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
  const {
    setCurrentFolder,
    setCurrentFiles,
    getFilesByFolder,
    setFilesForFolder,
  } = useSidebarStore();
  const { setCurrentFile } = useDashboardStore();

  const inFlight = useRef<Set<number>>(new Set());

  const prefetchFiles = useCallback(
    async (folderId: number) => {
      const cached = getFilesByFolder(folderId);
      if (cached !== undefined) return;
      if (inFlight.current.has(folderId)) return;
      inFlight.current.add(folderId);
      try {
        const files = await readFilesAction(folderId);
        setFilesForFolder(folderId, files);
      } finally {
        inFlight.current.delete(folderId);
      }
    },
    [getFilesByFolder, setFilesForFolder],
  );

  useEffect(() => {
    const idsToPrefetch = folders.slice(0, 3).map((f) => f.id);
    idsToPrefetch.forEach((id) => {
      void prefetchFiles(id);
    });
  }, [folders, prefetchFiles]);

  const changeFolder = async (folder: UsedFolder) => {
    setCurrentFolder(folder);

    const cached = getFilesByFolder(folder.id);
    if (cached && cached.length > 0) {
      setCurrentFiles(cached);
      setCurrentFile(cached[0]);
      return;
    }

    const files = await readFilesAction(folder.id);
    if (files.length > 0) {
      setFilesForFolder(folder.id, files);
      setCurrentFiles(files);
      setCurrentFile(files[0]);
    } else {
      const file = await createFileAction(folder.id, 0);
      setFilesForFolder(folder.id, [file]);
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
            onMouseEnter={() => prefetchFiles(folder.id)}
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
