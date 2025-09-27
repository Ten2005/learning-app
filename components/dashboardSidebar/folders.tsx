"use client";

import { UsedFolder, UsedFile } from "@/store/sidebar";
import { Button } from "../ui/button";
import { Pin, PinOff, Loader2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "../ui/sidebar";
import { useSidebarStore } from "@/store/sidebar";
import { useDashboardStore } from "@/store/dashboard";
import { createFileAction } from "@/app/(main)/dashboard/actions";
import { useCallback, useEffect, useRef } from "react";
import { toggleFolderPinnedAction } from "@/app/(main)/dashboard/actions";
import HighlightText from "@/utils/highlightText";

type FolderWithFiles = UsedFolder & { files: UsedFile[] };

export default function Folders({
  folders: initialFolders,
}: {
  folders: FolderWithFiles[];
}) {
  const {
    currentFolder,
    setCurrentFolder,
    setCurrentFiles,
    getFilesByFolder,
    cacheFiles,
    pinningFolders,
    setPinningFolder,
    toggleFolderPin,
    revertFolderPin,
    setFolders,
    folders,
  } = useSidebarStore();
  const { setCurrentFile } = useDashboardStore();

  const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    setFolders(initialFolders);

    initialFolders.forEach((folder) => {
      cacheFiles(folder.id, folder.files);
    });
  }, [initialFolders, cacheFiles, setFolders]);

  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const handlePinToggle = useCallback(
    async (folderId: number, currentPinState: boolean) => {
      if (pinningFolders.has(folderId)) {
        return;
      }

      const existingTimer = debounceTimers.current.get(folderId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      setPinningFolder(folderId, true);

      toggleFolderPin(folderId);

      const timer = setTimeout(async () => {
        try {
          await toggleFolderPinnedAction(folderId, !currentPinState);
        } catch (error) {
          console.error("Failed to toggle pin state:", error);

          revertFolderPin(folderId);
        } finally {
          setPinningFolder(folderId, false);
          debounceTimers.current.delete(folderId);
        }
      }, 300);

      debounceTimers.current.set(folderId, timer);
    },
    [pinningFolders, setPinningFolder, toggleFolderPin, revertFolderPin],
  );

  const changeFolder = useCallback(
    async (folder: UsedFolder) => {
      setCurrentFolder(folder);

      const files = getFilesByFolder(folder.id);
      if (files.length > 0) {
        setCurrentFiles(files);
      } else {
        setCurrentFiles([]);
        setCurrentFile(undefined);

        try {
          const file = await createFileAction(folder.id, 0);
          cacheFiles(folder.id, [file]);
          setCurrentFiles([file]);
        } catch (error) {
          console.error("Failed to create file:", error);
        }
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinToggle(folder.id, folder.is_pinned);
                  }}
                  disabled={pinningFolders.has(folder.id)}
                  aria-label={folder.is_pinned ? "Unpin folder" : "Pin folder"}
                  title={folder.is_pinned ? "Unpin" : "Pin"}
                >
                  {pinningFolders.has(folder.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : folder.is_pinned ? (
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
