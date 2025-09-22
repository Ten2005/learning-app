"use client";

import { UsedFolder, UsedFile } from "@/store/sidebar";
import { Button } from "../ui/button";
import { Pin, PinOff } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";
import { useSidebarStore } from "@/store/sidebar";
import { useDashboardStore } from "@/store/dashboard";
import { createFileAction } from "@/app/(main)/dashboard/actions";
import { useCallback, useEffect } from "react";
import { toggleFolderPinnedAction } from "@/app/(main)/dashboard/actions";
import { useRouter } from "next/navigation";
import HighlightText from "@/utils/highlightText";

type FolderWithFiles = UsedFolder & { files: UsedFile[] };

export default function Folders({ folders }: { folders: FolderWithFiles[] }) {
  const {
    currentFolder,
    setCurrentFolder,
    setCurrentFiles,
    getFilesByFolder,
    cacheFiles,
  } = useSidebarStore();
  const { setCurrentFile } = useDashboardStore();
  const router = useRouter();

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
            asChild
          >
            <div
              id={folder.id.toString()}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-1"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await toggleFolderPinnedAction(
                      folder.id,
                      !folder.is_pinned,
                    );
                    router.refresh();
                  }}
                  aria-label={folder.is_pinned ? "Unpin folder" : "Pin folder"}
                  title={folder.is_pinned ? "Unpin" : "Pin"}
                >
                  {folder.is_pinned ? (
                    <Pin className="text-primary" />
                  ) : (
                    <PinOff className="text-muted" />
                  )}
                </Button>
                {currentFolder?.id === folder.id ? (
                  <HighlightText text={folder.name} />
                ) : (
                  folder.name
                )}
              </div>
            </div>
          </Button>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
